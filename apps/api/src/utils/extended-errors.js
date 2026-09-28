// List of Custom Errors

class GeneralError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code || 500;
  }
}

class BadRequest extends GeneralError {
  constructor(message, code) {
    super(message, 400);
  }
}

class NotFound extends GeneralError {
  constructor(message, code) {
    super(message, 404);
  }
}

export {
  GeneralError,
  BadRequest,
  NotFound
}