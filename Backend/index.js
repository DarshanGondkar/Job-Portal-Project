const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db'); // Assuming you have a DB connection file

const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config(); // Load environment variables before using them

// Connect to MongoDB Database
connectDB();

// User Model
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Employer = require('./models/Employer');

// Middleware to authenticate users/emp
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');  // Changed from 'x-auth-token' to 'Authorization'
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);  // Bearer token extraction
        req.user = decoded;  // Attach the user data to the request object
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// Routes

// User routes
app.get('/api/users/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

app.put('/api/users/profile', authMiddleware, async (req, res) => {
    const { name, email,password } = req.body;
    const user = await User.findById(req.user.id);
    user.name = name;
    user.email = email;
    user.password=password;

    await user.save();
    res.json(user);
});

// User Registration Route working new
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) {
      return res.status(400).json({ message: 'User already exists' });
  }

  user = new User({ name, email, password, role });
  await user.save();
  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
  res.json({ token });
});

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.json({ token });
});

// Job routes
app.get('/api/jobs', async (req, res) => {
    const jobs = await Job.find(req.query);
    res.json(jobs);
});

app.get('/api/jobs/:id', async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
});

app.put('/api/jobs/:id', async (req, res) => {
    const { title, description, location, salary,workMode,contact } = req.body;

    // Build job object
    const jobFields = {};
    if (title) jobFields.title = title;
    if (description) jobFields.description = description;
    if (location) jobFields.location = location;
    if (salary) jobFields.salary = salary;
    if (workMode) jobFields.workMode = workMode;
    if (contact) jobFields.contact = contact;

    try {
        let job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ msg: 'Job not found' });

        // Update
        job = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: jobFields },
            { new: true }
        );

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Application routes
/*
app.post('/api/applications', async (req, res) => {
    const { jobId, email, name, skills, workingExperience } = req.body;

    // Validate required fields
    if (!jobId || !email || !name || !skills || !workingExperience) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the job exists
        const jobExists = await Job.findById(jobId);
        if (!jobExists) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Create a new application
        const application = new Application({
            job: jobId,
            email,
            name,
            skills,
            workingExperience,
            // No user field as authentication is not required
        });

        // Save the application
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get applicants for a specific job
app.get('/api/jobs/:jobId/applicants', async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log('Fetching applicants for jobId:', jobId); // Debug log
        const applicants = await Application.find({ job: jobId });
        console.log('Applicants:', applicants); // Debug log
        res.json(applicants);
    } catch (error) {
        console.error('Error fetching applicants:', error); // Debug log
        res.status(500).json({ message: 'Server error' });
    }
});*/
///
// Application routes
app.post('/api/applications', authMiddleware, async (req, res) => {
    const { jobId, email, name, skills, workingExperience } = req.body;

    // Validate required fields
    if (!jobId || !email || !name || !skills || !workingExperience) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the job exists
        const jobExists = await Job.findById(jobId);
        if (!jobExists) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Create a new application
        const application = new Application({
            job: jobId,
            email,
            name,
            skills,
            workingExperience,
            user: req.user.id  // Associate the application with the logged-in user
        });

        // Save the application
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get applications for the logged-in user
// Backend: Get applications for the logged-in user
app.get('/api/applications', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).populate('job').exec();
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.delete('/api/applications/:id', authMiddleware, async (req, res) => {
    const application = await Application.findById(req.params.id);
    if (!application || application.user.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Application not found' });
    }
    await application.remove();
    res.json({ message: 'Application deleted' });
});
// Update application status
/*app.put('/api/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
        if (!application) return res.status(404).send('Application not found');
        res.send(application);
    } catch (error) {
        res.status(500).send('Server error');
    }
});*/
// Backend: API to update application status
// Backend: API to update application status
app.patch('/api/applications/:id/status', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Employer routes
// Get Employer Profile Route
app.get('/api/employers/profile', authMiddleware, async (req, res) => {
    try {
        const employer = await Employer.findById(req.user.id);
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.json({
            name: employer.name,
            email: employer.email,
            contactNumber: employer.contactNumber,
            companyName: employer.companyName // Ensure this is included
        });
    } catch (error) {
        console.error('Error fetching employer profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/employers/profile', authMiddleware, async (req, res) => {
    const { name, email, companyName, password, contactNumber } = req.body;
    const employer = await Employer.findById(req.user.id);
    employer.name = name;
    employer.email = email;
    employer.companyName = companyName;
    employer.password = password;
    employer.contactNumber = contactNumber;

    await employer.save();
    res.json(employer);
});

app.get('/api/employers/jobs', authMiddleware, async (req, res) => {
    const jobs = await Job.find({ employer: req.user.id });
    res.json(jobs);
});

// Route to create a job posting
app.post('/api/employers/jobs', authMiddleware, async (req, res) => {
    try {
        const { title, description, location, salary,workMode,contact } = req.body;

        // Create a new job document with the provided details
        const job = new Job({
            title,
            description,
            location,
            salary,
            workMode,
            contact,
            employer: req.user.id,  // Associate with the authenticated employer's ID
            applications: []  // Start with an empty applications array
        });

        // Save the new job to the database
        await job.save();

        // Respond with the created job details
        res.json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Job Route
app.delete('/api/employers/jobs/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        console.log('Job:', job); // Debug: log the job data
        console.log('Employer ID:', req.user.id); // Debug: log the employer ID

        if (!job || job.employer.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await Job.deleteOne({ _id: req.params.id });
        res.json({ message: 'Job deleted' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Applicants by Job Route
app.get('/api/employers/jobs/:id/applicants', authMiddleware, async (req, res) => {
    try {
        const applicants = await Application.find({ job: req.params.id }).populate('user');
        console.log('Applicants:', applicants); // Debug: log the applicants data
        res.json(applicants);
    } catch (error) {
        console.error('Error fetching applicants:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Employer registration and login routes
app.post('/api/employers/create', async (req, res) => {
    const { name, email, password, role } = req.body;
    let employer = await Employer.findOne({ email });
    if (employer) {
        return res.status(400).json({ message: 'Employer already exists' });
    }

    employer = new Employer({ name, email, password, role });
    await employer.save();
    const payload = { id: employer.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.json({ token });
});

app.post('/api/employers/login', async (req, res) => {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ email });
    if (!employer || !(await employer.comparePassword(password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { id: employer.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
