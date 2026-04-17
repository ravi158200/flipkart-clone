const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ['Fashion', 'Electronics', 'Mobiles', 'Mobile', 'Home', 'Appliances', 'Beauty', 'Toys', 'Grocery', 'Laptops', 'Other'],
    },
    brand: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
