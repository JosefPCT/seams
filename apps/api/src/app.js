import express from 'express';
import { expressSessionConfig } from './config/session.js';
import passport from "passport";


import apiRouter from './api/v1/routes.js';
import { notFoundErrorHandler } from './middleware/NotFoundHandler.js';
import { globalErrorHandler } from './middleware/GlobalErrorHandler.js';

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Setting up session and session store for prisma, using an exported object from a different file that holds the configuration
app.use(expressSessionConfig);

// Passport Setup
import './config/passport.js';

// Has to do with serialize and deserialize of user
// Express session gives us access to the `req.session` object anything we store in the req.session object will persist into the database under the 'session' collection/table
app.use(passport.session());

// Logger Middleware
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use('/', apiRouter);
app.use(notFoundErrorHandler);
app.use(globalErrorHandler)

export { app }