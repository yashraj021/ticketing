import { Publisher, OrderCancelledEvents, Subjects } from '@ystickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvents> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
