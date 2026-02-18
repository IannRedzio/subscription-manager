export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message = 'Not authenticated') {
    super(message);
  }
}
