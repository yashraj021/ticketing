import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@ystickets/common';

it('Returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdsdfsdafsa',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('Returns a 401 when purchasing an order that does not belong to the person', async () => {
  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdsdfsdafsa',
      orderId: order.id,
    })
    .expect(401);
});

it('Returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'asdasda',
    })
    .expect(400);
});
