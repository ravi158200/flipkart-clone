const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'raviraj_secret_key_7301', { expiresIn: '30d' });
};

// Register
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role: role || 'user' });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic || '',
                bio: user.bio || '',
                mobile: user.mobile || '',
                address: user.address || '',
                houseNo: user.houseNo || '',
                street: user.street || '',
                landmark: user.landmark || '',
                city: user.city || '',
                state: user.state || '',
                pincode: user.pincode || '',
                token: generateToken(user._id, user.role),
            });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic || '',
                bio: user.bio || '',
                mobile: user.mobile || '',
                address: user.address || '',
                houseNo: user.houseNo || '',
                street: user.street || '',
                landmark: user.landmark || '',
                city: user.city || '',
                state: user.state || '',
                pincode: user.pincode || '',
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    console.log('Update Request for User:', req.user?._id);
    console.log('Update Data:', req.body);
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.profilePic = req.body.profilePic !== undefined ? req.body.profilePic : user.profilePic;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.mobile = req.body.mobile || user.mobile;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.pincode = req.body.pincode || user.pincode;

            const updatedUser = await user.save();
            console.log('User Updated Successfully:', updatedUser._id);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                mobile: updatedUser.mobile,
                address: updatedUser.address,
                city: updatedUser.city,
                state: updatedUser.state,
                pincode: updatedUser.pincode,
                token: generateToken(updatedUser._id, updatedUser.role),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('SERVER UPDATE ERROR:', err);
        res.status(400).json({ message: 'Invalid data update request', error: err.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile };
