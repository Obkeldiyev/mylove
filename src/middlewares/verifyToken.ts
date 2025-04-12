import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { role: string };

    if (decoded.role === 'admin') {
      return next();
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    return res.redirect('/');
  }
};
