import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  role: string;
}

export const verifyRole = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as Request & { user?: { id: string; role: string } }).user;
  
      if (!user || user.role !== requiredRole) {
        return res.redirect('/');
      }
  
      next();
    };
};
  
