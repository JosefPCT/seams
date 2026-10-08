import { Prisma } from "@repo/database";

export const globalErrorHandler = (err, req, res, next) => {
  console.log("GLOBAL ERROR HANDLING....");
  
  console.error(err.stack);
  console.log(err);

  let isPrismaError = false;
  if(err instanceof Prisma.PrismaClientKnownRequestError){
    console.log("Prisma Error");
    isPrismaError = true;
  }
  const statusCode = isPrismaError ? 500 : err.code || 500;
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

