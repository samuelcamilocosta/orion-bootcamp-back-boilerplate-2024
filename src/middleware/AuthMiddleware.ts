import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export const authMiddleware = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;
      (req as unknown as { decoded: DecodedToken }).decoded = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: 'Acesso negado. Permissão insuficiente.' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido. ' });
    }
  };
};
