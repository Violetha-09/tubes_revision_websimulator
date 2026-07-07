const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', teamController.getTeams);
router.post('/', verifyToken, requireRole('Admin'), teamController.createTeam);
router.put('/:id', verifyToken, requireRole('Admin'), teamController.updateTeam);
router.patch('/:id', verifyToken, requireRole('Admin'), teamController.updateTeam);
router.delete('/:id', verifyToken, requireRole('Admin'), teamController.deleteTeam);

module.exports = router;
