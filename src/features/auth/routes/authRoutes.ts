import express, { Router } from 'express';
import { authMiddleware, validationMiddleware } from '@app/middlewares';
import { signInSchema, signUpSchema } from '../schemas';
import { authController } from '../controllers';

class AuthRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/signup',
      validationMiddleware.validate(signUpSchema),
      authController.signUp,
    );

    this.router.post(
      '/signin',
      validationMiddleware.validate(signInSchema),
      authController.signIn,
    );

    this.router.post('/logout', authController.logout);
    this.router.post('/refresh', authController.refresh);

    this.router.get(
      '/users',
      authMiddleware.verifyUser,
      authController.getUsers,
    );

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
