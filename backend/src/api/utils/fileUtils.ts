import fs from "fs";
import path from "path";

export class FileUtils {
  /**
   * Get the relative path for storing in database
   * @param filePath - Full file path
   * @returns Relative path from uploads directory
   */
  static getRelativePath(filePath: string): string {
    const uploadsDir = path.resolve("./uploads");
    return path.relative(uploadsDir, filePath);
  }

  /**
   * Get the full path from relative path
   * @param relativePath - Relative path from database
   * @returns Full file path
   */
  static getFullPath(relativePath: string): string {
    return path.resolve("./uploads", relativePath);
  }

  /**
   * Check if file exists
   * @param filePath - File path to check
   * @returns Boolean indicating if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Delete file safely
   * @param filePath - File path to delete
   * @returns Boolean indicating success
   */
  static deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  /**
   * Get file size in bytes
   * @param filePath - File path
   * @returns File size in bytes
   */
  static getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      console.error("Error getting file size:", error);
      return 0;
    }
  }

  /**
   * Get file extension
   * @param filePath - File path
   * @returns File extension
   */
  static getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * Create directory if it doesn't exist
   * @param dirPath - Directory path
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
