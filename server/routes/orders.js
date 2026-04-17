const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, seller, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
