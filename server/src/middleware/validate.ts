import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

export interface ValidationSchemas {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
}

export interface ValidatedDto {
  params?: unknown;
  query?: unknown;
  body?: unknown;
}

// Validates request params/query/body with zod and stashes the parsed,
// type-safe values on res.locals.dto (Express 5 makes req.query read-only).
// Zod failures propagate to the central error handler as 400s.
export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: ValidatedDto = {};
      if (schemas.params) dto.params = schemas.params.parse(req.params);
      if (schemas.query) dto.query = schemas.query.parse(req.query);
      if (schemas.body) dto.body = schemas.body.parse(req.body);
      res.locals.dto = dto;
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function dto<T = ValidatedDto>(res: Response): T {
  return res.locals.dto as T;
}
