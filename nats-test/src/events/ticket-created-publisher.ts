import { Publisher } from '@ystickets/common';
import { TicketCreatedEvent } from '@ystickets/common';
import { Subjects } from '@ystickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
