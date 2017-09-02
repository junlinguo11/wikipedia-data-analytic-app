var express = require('express');
var controller = require('../controllers/revision.server.controller');
var router = express.Router();

router.get('/overall', controller.renderOverallResults);
router.get('/index', controller.getTitles,controller.renderTitles);
router.post('/article', controller.renderIndividualResults);
router.post('/user', controller.getDataTableByTitleByUser, controller.renderUserChart);
router.post('/topfive', controller.getDataTableOfFiveUserByTitle, controller.renderFiveUserChart);
module.exports = router;