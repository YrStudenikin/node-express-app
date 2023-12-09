import { NextFunction, Request, Response } from 'express';

import { SignInInput, SignupInput } from '../schemas';
import { authService } from '../services';
import { AuthMapper } from '../mappers';

//30 дней
const COOKIE_REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export class AuthController {
  public async signUp(
    req: Request<object, object, SignupInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userData = await authService.signUp(
        AuthMapper.toSignupDTO(req.body),
      );

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
        httpOnly: true,
      });

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  public async signIn(
    req: Request<object, object, SignInInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userData = await authService.signIn(req.body);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
        httpOnly: true,
      });

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  public async logout(
    req: Request<object, object>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;

      await authService.logout(refreshToken);
      res.clearCookie('refreshToken');

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request<object, object>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
        httpOnly: true,
      });

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  //TODO тест ручки (отдает список всех пользователей)
  public async getUsers(
    req: Request<object, object>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const users = await authService.getAllUsers();

      res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

export const authController: AuthController = new AuthController();
