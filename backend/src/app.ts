import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import errorMiddleware from './api/middlewares/errorMiddleware';
import { patientRouter, noteRouter } from './api/routes/index';

class App {
  private app: Express;

  constructor() {
    this.app = express();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(
      cors({
        // You can replace '*' with a whitelist for better security in prod
        origin: ['http://localhost:3001', 'http://localhost:3002'],
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    );
  }

  private routes(): void {
    this.app.use('/api/patients', patientRouter);
    this.app.use('/api/notes', noteRouter);

    // 404 handler
    this.app.use('*', (_req: Request, res: Response) => {
      return res.status(404).json({ message: 'Route not found' });
    });
  }

  private errorHandler(): void {
    this.app.use(errorMiddleware);
  }

  public startServer(port: number): void {
    try {
      this.config();
      this.routes();
      this.errorHandler();

      this.app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server running here 👉 http://localhost:${port}`);
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  public getApp(): Express {
    return this.app;
  }
}

export default App;
