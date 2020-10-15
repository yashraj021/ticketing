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

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must defined!');
  }

  console.log(process.env.NATS_CLIENT_ID);

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must defined!');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must defined!');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

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