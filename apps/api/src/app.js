import express from 'express';
import { prisma } from "@repo/database";
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import 'dotenv/config';



import apiRouter from './api/v1/routes.js';
import { notFoundErrorHandler } from './middleware/NotFoundHandler.js';
import { globalErrorHandler } from './middleware/GlobalErrorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Setting up session and session store for prisma
app.use(
  expressSession({
    cookie: {
      maxAge:1 * 24 * 60 * 60 * 1000 // 1 day
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 10,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use('/', apiRouter);
app.use(notFoundErrorHandler);
app.use(globalErrorHandler)

export { app }