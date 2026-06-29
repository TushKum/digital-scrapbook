import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { authService } from '../services/authService';
import { AppError } from '../errors/AppError';
import type { TokenPayload } from '../services/authService';

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

// Requires a valid Bearer token; attaches the decoded payload to res.locals.auth.
export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    next(AppError.unauthorized('Missing Bearer token'));
    return;
  }
  try {
    res.locals.auth = authService.verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
};

export function currentUser(res: Response): TokenPayload {
  return res.locals.auth as TokenPayload;
}
