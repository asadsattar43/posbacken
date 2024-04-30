const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.post('/orders', OrderController.createOrder);
router.get('/orders/byDate', OrderController.getOrderByDate);
router.get('/orders', OrderController.getAllOrders);

module.exports = router;