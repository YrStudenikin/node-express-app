import { NextFunction, Request, Response } from 'express';
import { tokenService } from '@app/features';
import { AuthPayload, NotAuthorizedError } from '@app/shared';

export class AuthMiddleware {
  /** Верификация авторизации пользователя */
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new NotAuthorizedError();
    }

    try {
      const accessToken = authorizationHeader.split(' ')[1];

      if (!accessToken) {
        return next(
          new NotAuthorizedError('Token is invalid. Please login again.'),
        );
      }

      const userData = tokenService.verifyAccessToken<AuthPayload>(accessToken);

      if (!userData) {
        return next(
          new NotAuthorizedError('Token is invalid. Please login again.'),
        );
      }

      req.currentUser = userData;
      next();
    } catch (error) {
      throw new NotAuthorizedError('Token is invalid. Please login again.');
    }
  }

  /** Проверка на то что пользователь авторизован */
  public checkAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError(
        'Authentication is required to access this route.',
      );
    }

    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
