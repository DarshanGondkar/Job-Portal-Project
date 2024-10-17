/*const Application = require('../models/Application');

// Create a new application
exports.createApplication = async (req, res) => {
    try {
        const application = new Application({ ...req.body, user: req.user._id });
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all applications for the current user
exports.getApplicationsByUser = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete an application by ID
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json({ message: 'Application deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
*/