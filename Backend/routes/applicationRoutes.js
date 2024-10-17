/*const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/apply', authMiddleware, applicationController.createApplication);
router.get('/applications', authMiddleware, applicationController.getApplicationsByUser);
router.delete('/applications/:id', authMiddleware, applicationController.deleteApplication);

module.exports = router;

*/