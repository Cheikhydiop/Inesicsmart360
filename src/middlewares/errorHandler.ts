import { ErrorRequestHandler } from 'express';
import { ValidationError, DatabaseError } from '../errors/customErrors';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    res.status(400).json({
      type: 'ValidationError',
      message: err.message,
      details: err.details,
    });
    return; // juste return void
  }

  if (err instanceof DatabaseError) {
    res.status(500).json({
      type: 'DatabaseError',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    type: 'InternalServerError',
    message: 'Une erreur interne est survenue.',
  });
};

export default errorHandler;
