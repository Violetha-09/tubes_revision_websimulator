const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/', matchController.getMatches);
router.put('/:id', matchController.updateMatch);
router.post('/simulate-group', matchController.simulateGroup);
router.post('/advance-knockout', matchController.advanceKnockout);
router.post('/reset', matchController.reset);

module.exports = router;
