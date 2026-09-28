import express from 'express';

import apiRouter from './api/v1/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/', apiRouter);

export { app }