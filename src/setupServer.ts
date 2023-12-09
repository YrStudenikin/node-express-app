// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import http from 'http';

import { Application, NextFunction, Request, Response, json } from 'express';
import cookieParser from 'cookie-parser';
import HTTP_STATUS from 'http-status-codes';
import cors from 'cors';
import config from 'config';
import morgan from 'morgan';

import { AppErrorResponse, CustomError } from './shared';
import { applicationRoutes } from './routes';

const SERVER_PORT = config.get('port');

export class AppServer {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  start(): void {
    this.securityMiddleware();
    this.standardMiddleware();
    this.routesMiddleware();
    this.globalErrorHandler();
    this.startServer();
  }

  private securityMiddleware() {
    this.app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }

  private routesMiddleware(): void {
    applicationRoutes(this.app);
  }

  private standardMiddleware(): void {
    this.app.use(json());
    this.app.use(cookieParser());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    // app.use(urlencoded({ extended: true, limit: '1mb' }));
  }

  private globalErrorHandler(): void {
    this.app.all('*', (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    this.app.use(
      (
        error: AppErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }

        next(error);
      },
    );
  }

  private async startServer(): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(this.app);

      httpServer.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
