import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ZodRequestValidationError } from 'src/shared';

export class ValidationMiddleware {
  public validate(schema: AnyZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          params: req.params,
          query: req.query,
          body: req.body,
        });

        next();
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new ZodRequestValidationError(
            'Произошла ошибка валидации одного или нескольких полей',
            error.issues,
          );
        }

        next(error);
      }
    };
  }
}

export const validationMiddleware: ValidationMiddleware =
  new ValidationMiddleware();
