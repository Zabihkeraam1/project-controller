const express = require("express");
const {
  startProject, stopProject, getProjectStorage, getProjects, getEc2InstanceInfo, getSystemStats, deleteProjectResources
} = require("../controllers/projectController");
const projectRouter = express.Router();

projectRouter.post("/start/:projectId", startProject);
projectRouter.post("/stop/:projectId", stopProject);
projectRouter.get("/get_storage/:projectId", getProjectStorage);
projectRouter.get("/get_instanceInfo", getEc2InstanceInfo);
projectRouter.get("/system-stats", getSystemStats);
projectRouter.get("/projects", getProjects);
projectRouter.delete("/projects/:projectName", deleteProjectResources);


module.exports = projectRouter;
