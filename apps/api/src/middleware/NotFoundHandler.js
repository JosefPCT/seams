import { NotFound } from "../utils/extended-errors.js";

export const notFoundErrorHandler = (req, res, next) => {
  next(new NotFound(`Route: ${req.originalUrl} not found in this application`));
}

