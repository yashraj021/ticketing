import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { NotFoundError, errorHandler } from '@ystickets/common';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { singninRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(singninRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
