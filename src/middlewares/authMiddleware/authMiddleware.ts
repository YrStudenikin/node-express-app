import { NextFunction, Request, Response } from 'express';
import { tokenService } from 'src/features';
import { AuthPayload, NotAuthorizedError } from 'src/shared';

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
          new NotAuthorizedError('Невалидный токен'),
        );
      }

      const userData = tokenService.verifyAccessToken<AuthPayload>(accessToken);

      if (!userData) {
        return next(
          new NotAuthorizedError('Невалидный токен'),
        );
      }

      req.currentUser = userData;
      next();
    } catch (error) {
      throw new NotAuthorizedError('Невалидный токен');
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
        'Доступ запрещен! Необходима авторизация',
      );
    }

    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
