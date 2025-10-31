import OpenAI from "openai";
import fs from "fs";
import path from "path";

class AIServices {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Transcribe audio file using OpenAI Whisper
   * @param audioFilePath - Path to the audio file
   * @returns Transcribed text
   */
  async transcribeAudio(audioFilePath: string): Promise<{
    code: number;
    transcribedText?: string;
    message?: string;
  }> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return {
          code: 500,
          message: "OpenAI API key not configured",
        };
      }

      const fullPath = path.resolve(audioFilePath);

      if (!fs.existsSync(fullPath)) {
        return {
          code: 404,
          message: "Audio file not found",
        };
      }

      const audioFile = fs.createReadStream(fullPath);

      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "text",
      });

      return {
        code: 200,
        transcribedText: transcription as string,
      };
    } catch (error) {
      console.error("Transcription error:", error);
      return {
        code: 500,
        message: "Error transcribing audio file",
      };
    }
  }

  /**
   * Generate AI summary of clinical note
   * @param text - Text to summarize
   * @param noteType - Type of note (TEXT, AUDIO, MIXED)
   * @returns AI summary and SOAP format
   */
  async generateSummary(
    text: string,
    noteType: "TEXT" | "AUDIO" | "MIXED" = "TEXT"
  ): Promise<{
    code: number;
    aiSummary?: string;
    soapFormat?: any;
    message?: string;
  }> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return {
          code: 500,
          message: "OpenAI API key not configured",
        };
      }

      const prompt = this.buildSummaryPrompt(text, noteType);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a medical AI assistant that helps create clinical notes summaries and SOAP format documentation. Always respond with valid JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        return {
          code: 500,
          message: "No response from AI service",
        };
      }

      try {
        const parsedResponse = JSON.parse(response);
        return {
          code: 200,
          aiSummary: parsedResponse.summary,
          soapFormat: parsedResponse.soap,
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          code: 200,
          aiSummary: response,
        };
      }
    } catch (error) {
      console.error("Summary generation error:", error);
      return {
        code: 500,
        message: "Error generating AI summary",
      };
    }
  }

  /**
   * Build prompt for AI summary generation
   */
  private buildSummaryPrompt(text: string, noteType: string): string {
    return `
Please analyze the following clinical note and provide:
1. A concise medical summary
2. A SOAP format breakdown

Note Type: ${noteType}
Note Content: "${text}"

Please respond with a JSON object in this exact format:
{
  "summary": "Brief medical summary of the note content",
  "soap": {
    "subjective": "Patient-reported symptoms and concerns",
    "objective": "Observable findings and measurements",
    "assessment": "Clinical assessment and diagnosis",
    "plan": "Treatment plan and follow-up recommendations"
  }
}

If any SOAP section is not applicable, use "Not documented" as the value.
`;
  }

  /**
   * Process audio file and generate both transcription and summary
   * @param audioFilePath - Path to the audio file
   * @param existingText - Any existing text to include in summary
   * @returns Complete processing result
   */
  async processAudioNote(
    audioFilePath: string,
    existingText?: string
  ): Promise<{
    code: number;
    transcribedText?: string;
    aiSummary?: string;
    soapFormat?: any;
    message?: string;
  }> {
    try {
      // Step 1: Transcribe audio
      const transcriptionResult = await this.transcribeAudio(audioFilePath);

      if (transcriptionResult.code !== 200) {
        return transcriptionResult;
      }

      // Step 2: Combine transcribed text with existing text
      const combinedText = existingText
        ? `${existingText}\n\nTranscribed: ${transcriptionResult.transcribedText}`
        : transcriptionResult.transcribedText!;

      // Step 3: Generate summary
      const noteType = existingText ? "MIXED" : "AUDIO";
      const summaryResult = await this.generateSummary(combinedText, noteType);

      if (summaryResult.code !== 200) {
        return {
          code: transcriptionResult.code,
          transcribedText: transcriptionResult.transcribedText,
          message: summaryResult.message,
        };
      }

      return {
        code: 200,
        transcribedText: transcriptionResult.transcribedText,
        aiSummary: summaryResult.aiSummary,
        soapFormat: summaryResult.soapFormat,
      };
    } catch (error) {
      console.error("Audio processing error:", error);
      return {
        code: 500,
        message: "Error processing audio note",
      };
    }
  }
}

export default AIServices;

