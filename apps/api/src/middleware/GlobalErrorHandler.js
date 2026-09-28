export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.code || 500;
  const message = err.message || 'Internal Server Error';

  // Don't send error stack in production environment
  if(process.env.NODE_ENV === 'production') {
    res.status(statusCode).send({ 
        status: 'error', 
        message: message });
  } else {
    res.status(statusCode).send({ 
        status: 'error', 
        message: message, 
        stack: err.stack });
  }
//   res.status(statusCode).send({
//     status: 'error',
//     message: message,
//     stack: err.stack
//   });
}

