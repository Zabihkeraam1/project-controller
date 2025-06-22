const express = require('express');
const projectRouter = require('./project');
const migrationRouter = require('./migration');
const router = express.Router();
router.use('/project', projectRouter);
router.use('/migration', migrationRouter);


module.exports = router;