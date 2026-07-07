const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', matchController.getMatches);
router.put('/:id', verifyToken, requireRole('Admin'), matchController.updateMatch);
router.post('/simulate-group', verifyToken, requireRole('Admin'), matchController.simulateGroup);
router.post('/advance-knockout', verifyToken, requireRole('Admin'), matchController.advanceKnockout);
router.post('/reset', verifyToken, requireRole('Admin'), matchController.reset);

module.exports = router;
