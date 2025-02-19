const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Employer Schema
const EmployerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    companyName: { type: String },
    contactNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'employer'], default: 'user' },  // Added role field
    

});

// Hash the password before saving
EmployerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
EmployerSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Employer', EmployerSchema);
