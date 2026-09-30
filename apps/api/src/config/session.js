import { prisma } from "@repo/database";
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import 'dotenv/config';

const expressSessionConfig= expressSession({
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

export { expressSessionConfig }