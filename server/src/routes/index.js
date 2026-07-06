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

// Dashboard, Standings, Results, Bracket
router.get('/dashboard', dashboardController.getDashboard);
router.get('/standings', dashboardController.getStandings);
router.get('/results', dashboardController.getResults);
router.get('/bracket', dashboardController.getBracket);

// Tournament Action Aliases
router.post('/resetTournament', matchController.reset);
router.post('/simulateGroup', matchController.simulateGroup);
router.post('/generateKnockout', matchController.advanceKnockout);

module.exports = router;
