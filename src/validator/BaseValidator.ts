import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Schema, checkSchema, validationResult } from 'express-validator';

export class BaseValidator {
  protected static validationList(schema: Schema): Array<RequestHandler> {
    return [
      ...checkSchema(schema),
      (req: Request, res: Response, next: NextFunction): void | Response => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).send({ message: errors });
        }
        next();
      }
    ];
  }
}
