/*const Employer = require('../models/Employer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

// Create a New Employer
exports.createEmployer = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingEmployer = await Employer.findOne({ email });
        if (existingEmployer) {
            return res.status(400).json({ message: 'Employer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newEmployer = new Employer({ 
            username, 
            email, 
            password: hashedPassword, 
            role: 'employer' // Explicitly set the role as 'employer'
        });
        await newEmployer.save();

        const token = jwt.sign({ id: newEmployer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login employer
exports.loginEmployer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employer = await Employer.findOne({ email });
        if (!employer || !(await bcrypt.compare(password, employer.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Employer Profile
exports.getEmployerProfile = async (req, res) => {
    try {
        const employer = await Employer.findById(req.user._id).select('-password'); // Exclude password
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.json(employer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Employer Profile
exports.updateEmployerProfile = async (req, res) => {
    try {
        const employer = await Employer.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password'); // Exclude password
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.json(employer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Jobs Posted by Employer
exports.getJobsByEmployer = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Post a New Job
exports.postJob = async (req, res) => {
    try {
        const job = new Job({ ...req.body, employer: req.user._id });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a Job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Applicants for a Job
exports.getApplicantsByJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate('applications');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job.applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
*/