require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://raviraj7301325_db_user:raviraj7301325_db_user@cluster0.fqucwma.mongodb.net/?appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Flipkart Clone API is running...');
});


// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Product Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// User Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Orders Routes
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

// Payment Terminal Engine (Hardwired for Live Stability)
const { createRazorpayOrder, verifyPayment } = require('./controllers/paymentController');
const { protect } = require('./middleware/authMiddleware');
const { updateUserProfile } = require('./controllers/authController');

app.post('/api/payment/order', protect, createRazorpayOrder);
app.post('/api/payment/verify', protect, verifyPayment);
app.put('/api/auth/profile', protect, updateUserProfile);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
