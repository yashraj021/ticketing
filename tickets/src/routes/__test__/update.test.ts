import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if provided id doesnt exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdsad',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdsad',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdasda',
      price: 100,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdasdasf',
      price: -20,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'hi',
      price: 20,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('hi');
  expect(ticketResponse.body.price).toEqual(20);
});

it('Publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'hi',
      price: 20,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects if ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });

  await ticket!.save();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'hi',
      price: 20,
    })
    .expect(400);
});
