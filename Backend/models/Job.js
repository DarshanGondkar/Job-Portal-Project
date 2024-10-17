const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    workMode: { type: String, required: true },
    contact: { type: String, required: true },

   employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
   applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],

});

module.exports = mongoose.model('Job', JobSchema);
