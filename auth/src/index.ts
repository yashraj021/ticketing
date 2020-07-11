import express, { Router } from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { singninRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(singninRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.listen(3000, () => {
  console.log('LISTENING: 3000!!');
});
