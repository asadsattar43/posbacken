const mongoose = require('mongoose');
const OrderController = require('../controllers/OrderController');
const Order = require('../models/Order');

describe('OrderController', () => {
  beforeAll(() => {
    mongoose.connect('mongodb://localhost:27017/orders', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await Order.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const req = {
        body: {
          orderAmount: 100,
          orderDateTime: '2024-04-29T12:00:00.000Z',
          venueOpenDate: '2024-04-29',
        },
      };
      const res = {
        status: jest.fn(() => ({
          json: jest.fn(),
        })),
      };

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return an error if the order is not created between 8 am and 2 am', async () => {
      const req = {
        body: {
          orderAmount: 100,
          orderDateTime: '2024-04-29T06:00:00.000Z',
          venueOpenDate: '2024-04-29',
        },
      };
      const res = {
        status: jest.fn(() => ({
          json: jest.fn(),
        })),
      };

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getOrderByDate', () => {
    it('should fetch orders for a specific date', async () => {
      const order1 = new Order({
        orderID: 1,
        orderAmount: 100,
        orderDateTime: '2024-04-29T12:00:00.000Z',
      });
      const order2 = new Order({
        orderID: 2,
        orderAmount: 200,
        orderDateTime: '2024-04-29T13:00:00.000Z',
      });

      await order1.save();
      await order2.save();

      const req = {
        query: {
          date: '2024-04-29',
        },
      };
      const res = {
        json: jest.fn(),
      };

      await OrderController.getOrderByDate(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { orderID: 1, orderAmount: 100 },
        { orderID: 2, orderAmount: 200 },
      ]);
    });
  });


});