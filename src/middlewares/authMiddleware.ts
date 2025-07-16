import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';
import { isBlacklisted } from '../utils/tokenBlacklist';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
    userType?: string;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  if (isBlacklisted(token)) {
    res.status(401).json({ message: 'Token is no longer valid' });
    return;
  }

  try {
    const payload = verifyToken(token);
    
    if (typeof payload === 'object' && 'userId' in payload) {
      req.userId = payload.userId as number;
      req.userType = payload.type as string;
      next(); // ✅ continue vers la prochaine route
    } else {
      res.status(401).json({ message: 'Invalid token structure' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
