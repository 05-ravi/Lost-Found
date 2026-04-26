const express = require('express');
const router = express.Router();
const { searchReports } = require('../controllers/searchController');

router.get('/', searchReports);

module.exports = router;
