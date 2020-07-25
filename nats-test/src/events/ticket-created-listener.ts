import { Message } from 'node-nats-streaming';
import { Listener } from '@ystickets/common';
import { TicketCreatedEvent } from '@ystickets/common';
import { Subjects } from '@ystickets/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.price);
    console.log(data.title);
    msg.ack();
  }
}
