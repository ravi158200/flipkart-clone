const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected (Admin/Retailer Only)
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, seller, updateProduct);
router.delete('/:id', protect, seller, deleteProduct);

module.exports = router;
