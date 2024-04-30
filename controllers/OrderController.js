

const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { orderAmount, orderDateTime, venueOpenDate } = req.body;
    const currentDateTime = new Date(orderDateTime);
    const venueStartTime = new Date(`${venueOpenDate}T08:00:00.000Z`); 
    const venueEndTime = new Date(`${venueOpenDate}T02:00:00.000Z`); 
    venueEndTime.setDate(venueEndTime.getDate() + 1); 

    if (currentDateTime >= venueStartTime && currentDateTime < venueEndTime) {
      const lastOrder = await Order.findOne({ orderDateTime: { $gte: venueStartTime, $lt: venueEndTime } }, {}, { sort: { orderID: -1 } });
      let orderID = 1;
      if (lastOrder) {
        orderID = lastOrder.orderID + 1;
      }
      const order = new Order({ orderID, orderAmount, orderDateTime });
      await order.save();
      res.status(201).json({ message: 'Order created successfully' });
    } else {
      res.status(400).json({ message: 'Orders can only be created between 8 am and 2 am' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating order' });
  }
};


exports.getOrderByDate = async (req, res) => {
  try {
    const date = req.query.date;
    const startDate = new Date(`${date}T08:00:00.000Z`); 
    const endDate = new Date(`${date}T02:00:00.000Z`); 
    endDate.setDate(endDate.getDate() + 1); 
    const orders = await Order.find({ orderDateTime: { $gte: startDate, $lt: endDate } });
    res.json(orders.map((order) => ({ orderID: order.orderID, orderAmount: order.orderAmount })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};