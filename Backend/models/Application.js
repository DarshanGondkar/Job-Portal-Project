const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skills: { type: String, required: true },
    workingExperience: { type: String, required: true },
    email: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String },

}, { timestamps: true });  // Add timestamps to automatically create createdAt and updatedAt fields

module.exports = mongoose.model('Application', ApplicationSchema);
