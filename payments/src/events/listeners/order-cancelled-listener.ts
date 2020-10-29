import {
  OrderCancelledEvents,
  Listener,
  Subjects,
  OrderStatus,
} from '@ystickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvents> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = queGroupName;

  async onMessage(data: OrderCancelledEvents['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
