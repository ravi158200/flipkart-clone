const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all directory profiles (Public)
router.get('/sellers', async (req, res) => {
    try {
        const sellers = await User.find({}).select('name email profilePic role createdAt').sort({ createdAt: -1 });
        res.json(sellers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Profile
router.put('/profile', protect, async (req, res) => {
    const { name, email, profilePic, bio, mobile, address, houseNo, street, landmark, city, state, pincode } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.profilePic = profilePic !== undefined ? profilePic : user.profilePic;
            user.bio = bio !== undefined ? bio : user.bio;
            user.mobile = mobile !== undefined ? mobile : user.mobile;
            user.address = address !== undefined ? address : user.address;
            user.houseNo = houseNo !== undefined ? houseNo : user.houseNo;
            user.street = street !== undefined ? street : user.street;
            user.landmark = landmark !== undefined ? landmark : user.landmark;
            user.city = city !== undefined ? city : user.city;
            user.state = state !== undefined ? state : user.state;
            user.pincode = pincode !== undefined ? pincode : user.pincode;
            
            const updatedUser = await user.save();
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET || 'raviraj_secret_key_7301', { expiresIn: '30d' });
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                mobile: updatedUser.mobile,
                address: updatedUser.address,
                houseNo: updatedUser.houseNo,
                street: updatedUser.street,
                landmark: updatedUser.landmark,
                city: updatedUser.city,
                state: updatedUser.state,
                pincode: updatedUser.pincode,
                createdAt: updatedUser.createdAt,
                token
            });
        } else {
            res.status(404).json({ message: 'Identity Vault Node not found' });
        }
    } catch (err) {
        console.error('PROFILES SYNC ERROR:', err.message);
        res.status(400).json({ message: err.message || 'Error updating profile' });
    }
});

// Create Admin/Retailer (Strictly by another Admin?)
router.post('/create', protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({ _id: user._id, name: user.name, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
