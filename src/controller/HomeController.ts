import { Request, Response } from 'express';

export class HomeController {
  hello(_req: Request, res: Response) {
    return res.status(200).send('Hello');
  }
}
