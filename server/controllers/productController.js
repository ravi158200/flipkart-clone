const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (category) {
            const catMap = {
                'electronics': 'Electronics',
                'fashion': 'Fashion',
                'mobiles': 'Mobiles',
                'home': 'Home',
                'beauty': 'Beauty',
                'toys': 'Toys',
                'appliances': 'Appliances',
                'travel': 'Travel',
                'bikes': 'Bikes',
                'grocery': 'Grocery'
            };
            const normalized = catMap[category.toLowerCase().trim()];
            if (normalized) {
                query.category = normalized;
            } else {
                query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
            }
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email profilePic');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create product (Admin/Retailer only)
const createProduct = async (req, res) => {
    const { title, description, price, discount, category, brand, images } = req.body;
    try {
        console.log('Pushing to Vault:', { title, price, category });
        const product = new Product({
            title,
            description,
            price,
            discount: discount || 0,
            category,
            brand,
            images,
            seller: req.user._id,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        console.error('VAULT PUSH FAILED:', err.message);
        res.status(400).json({ message: err.message, errors: err.errors });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            // Security check: Only the original seller or an Admin can edit products
            if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Unauthorized: You can only edit your own business assets.' });
            }
            
            product.title = req.body.title || product.title;
            product.description = req.body.description || product.description;
            product.price = req.body.price !== undefined ? req.body.price : product.price;
            product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
            product.brand = req.body.brand || product.brand;
            product.category = req.body.category || product.category;
            product.images = req.body.images || product.images;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('VAULT UPDATE FAILED:', err.message);
        res.status(400).json({ message: err.message, errors: err.errors });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            // Security check: Only the original seller or an Admin can delete products
            if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Unauthorized: You can only remove your own business assets.' });
            }

            await product.deleteOne(); // Using deleteOne instead of remove
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
