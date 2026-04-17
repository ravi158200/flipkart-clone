const Order = require('../models/Order');

// Create new order (POST /orders)
const addOrderItems = async (req, res) => {
    console.log('ORDER HANDSHAKE DETECTED:', JSON.stringify(req.body, null, 2));
    
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body;

    try {
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order Vault Rejection: Zero items detected.' });
        } else {
            const order = new Order({
                user: req.user._id,
                orderItems: orderItems.map(item => ({
                    ...item,
                    image: item.image || 'https://via.placeholder.com/150', // Fail-safe asset
                    price: Number(item.price || 0)
                })),
                shippingAddress: {
                    address: shippingAddress.address || 'Hauz Khas enclave',
                    city: shippingAddress.city || 'Delhi',
                    postalCode: shippingAddress.postalCode || '110001',
                    country: shippingAddress.country || 'India'
                },
                paymentMethod: paymentMethod || 'Flipkart VIP Card',
                itemsPrice: Number(itemsPrice || 0),
                taxPrice: Number(taxPrice || 0),
                shippingPrice: Number(shippingPrice || 0),
                totalPrice: Number(totalPrice || 0),
                isPaid: true,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (err) {
        console.error('VAULT ORDER CRITICAL FAILURE:', err.message);
        res.status(400).json({ 
            message: 'Order processing failed in the vault.',
            detail: err.message,
            errors: err.errors 
        });
    }
};

// Get logged-in user's orders (GET /orders/myorders)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

// Get all orders (GET /orders) - Admin Only
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', '_id name email mobile').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching global orders vault' });
    }
};

// Update order status (PUT /orders/:id/status) - Admin Only
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email name');
        if (order) {
            const oldStatus = order.status;
            order.status = req.body.status || order.status;
            
            const updatedOrder = await order.save();
            
            // Simulated Email Dispatch for High-Fidelity Notification Lifecycle
            if (updatedOrder.status === 'Delivered' && oldStatus !== 'Delivered') {
                console.log('\n--- ELECTRONIC DISPATCH: ORDER DELIVERED ---');
                console.log(`TO: ${order.user?.name} <${order.user?.email || 'customer@vault.com'}>`);
                console.log(`SUBJECT: Order Delivered - #${order._id.toString().slice(-8).toUpperCase()}`);
                console.log(`MESSAGE: Your high-fidelity Flipkart order has been successfully delivered to the marketplace hub.`);
                console.log('--- END DISPATCH ---\n');
            }
            
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found in vault' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Status update failed' });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrders,
    updateOrderStatus,
};
