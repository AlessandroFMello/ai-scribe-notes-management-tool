import { Request, Response } from 'express';
import prisma from '../models/connection';

class HealthController {
  async check(_req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        code: 200,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'ai-scribe-backend',
        },
      });
    } catch (error) {
      res.status(503).json({
        code: 503,
        message: 'Service unhealthy',
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          service: 'ai-scribe-backend',
        },
      });
    }
  }
}

export default HealthController;
