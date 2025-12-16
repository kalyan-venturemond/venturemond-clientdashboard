const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, projectsController.listProjects);

module.exports = router;
