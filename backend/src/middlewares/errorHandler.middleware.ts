import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../utils/errors.js';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Internal server error',
  });
};
