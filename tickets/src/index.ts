import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key must defined!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must defined!');
  }

  try {
    await natsWrapper.connect('ticketing', 'asdasd', `http://nats-srv:4222`);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to mongoDb!');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('LISTENING: 3000');
  });
};

start();
