const mongoose = require('../db_connection');

const orderSchema = new mongoose.Schema({
  orderID: Number,
  orderAmount: Number,
 orderDateTime: Date

});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;