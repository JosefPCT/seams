import express from 'express';

import apiRouter from './api/v1/routes.js';
import { notFoundErrorHandler } from './middleware/NotFoundHandler.js';
import { globalErrorHandler } from './middleware/GlobalErrorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/', apiRouter);
app.use(notFoundErrorHandler);
app.use(globalErrorHandler)

export { app }