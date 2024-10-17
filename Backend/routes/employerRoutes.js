/*const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', employerController.createEmployer);
router.post('/loginEmployer', employerController.loginEmployer);
router.get('/profile', authMiddleware, employerController.getEmployerProfile);
router.put('/profile', authMiddleware, employerController.updateEmployerProfile);
router.get('/jobs', authMiddleware, employerController.getJobsByEmployer);
router.post('/jobs', authMiddleware, employerController.postJob);
router.delete('/jobs/:jobId', authMiddleware, employerController.deleteJob);
router.get('/jobs/:jobId/applicants', authMiddleware, employerController.getApplicantsByJob);

module.exports = router;
*/