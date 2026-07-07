const express = require('express');
const router = express.Router();
const teamRoutes = require('./teamRoutes');
const matchRoutes = require('./matchRoutes');
const authRoutes = require('./authRoutes');

const dashboardController = require('../controllers/dashboardController');
const matchController = require('../controllers/matchController');

router.use('/teams', teamRoutes);
router.use('/matches', matchRoutes);
router.use('/auth', authRoutes);

const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Dashboard, Standings, Results, Bracket
router.get('/dashboard', dashboardController.getDashboard);
router.get('/standings', dashboardController.getStandings);
router.get('/results', dashboardController.getResults);
router.get('/bracket', dashboardController.getBracket);

// Tournament Action Aliases
router.post('/resetTournament', verifyToken, requireRole('Admin'), matchController.reset);
router.post('/simulateGroup', verifyToken, requireRole('Admin'), matchController.simulateGroup);
router.post('/generateKnockout', verifyToken, requireRole('Admin'), matchController.advanceKnockout);

module.exports = router;
