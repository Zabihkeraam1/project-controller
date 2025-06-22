const express = require("express");
const {
  migrationController} = require("../controllers/migrationController");
const migrationRouter = express.Router();

migrationRouter.post("/migrate-db", migrationController);

module.exports = migrationRouter;
