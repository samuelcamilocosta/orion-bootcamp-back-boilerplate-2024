import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export class BaseValidator {
  public static validationList(
    schema: RequestHandler[]
  ): Array<RequestHandler> {
    return [
      ...schema,
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
