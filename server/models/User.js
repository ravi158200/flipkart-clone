const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'retailer'],
        default: 'user',
    },
    profilePic: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: 'No bio added yet.',
    },
    mobile: {
        type: String,
        default: '+91 9999999999',
    },
    address: {
        type: String,
        default: 'New Delhi, India',
    },
    houseNo: { type: String, default: '' },
    street: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, default: 'New Delhi' },
    state: { type: String, default: 'Delhi' },
    pincode: { type: String, default: '110001' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
