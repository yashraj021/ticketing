import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { NotFoundError } from './errors/not-found-error';
import { currentUserRouter } from './routes/current-user';
import { singninRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(singninRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log('LISTENING: 3000!!');
});
