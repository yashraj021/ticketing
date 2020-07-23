import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

const options = stan.subscriptionOptions().setManualAckMode(true);

stan.on('connect', () => {
  console.log('Listener connected to Nats');

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event ${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});
