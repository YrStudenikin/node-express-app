import { Application } from 'express';
import { authRoutes, userRoutes } from '@app/features';

const BASE_PATH = '/api';

export const applicationRoutes = (app: Application) => {
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, userRoutes.routes());
};
