const express = require('express');
const { exec } = require('child_process');
const pool = require('./db_connect');
const util = require('util');
const execPromise = util.promisify(exec);
const {app} = require('./app.js');

// Define project paths and volume paths
// const PROJECTS = {
//     "protfolio": {
//         path: "/home/ubuntu/app/protfolio",
//         volume_path: "/opt/protfolio/postgres-data"
//     },
//     "new-groupp": {
//         path: "/home/ubuntu/projects/project2",
//         volume_path: "/opt/new-groupp/postgres-data"
//     }
// };


// async function runComposeCommand(projectName, composeCommand) {
//     const project = PROJECTS[projectName];
//     if (!project) {
//         throw new Error("Project not found");
//     }

//     const { path } = project;
//     let command;

//     if (composeCommand === "up") {
//         command = `sudo docker-compose --env-file backend/.env up -d --build`;
//     } else {
//         // command = `sudo docker compose ${composeCommand}`;
//         command = `sudo docker-compose --env-file backend/.env down`;
//     }

//     try {
//         const { stdout, stderr } = await execPromise(command, { cwd: path });
//         return {
//             stdout,
//             stderr,
//             returncode: stderr ? 1 : 0
//         };
//     } catch (error) {
//         console.error(`Error executing command: ${error.message}`);
//         throw error;
//     }
// }

// async function getFolderSize(path) {
//     try {
//         const { stdout } = await execPromise(`du -sh ${path}`);
//         const size = stdout.split('\t')[0];
//         return size;
//     } catch (error) {
//         return `Error: ${error.message}`;
//     }
// }

// app.post('/start/:projectName', async (req, res) => {
//     try {
//         const result = await runComposeCommand(req.params.projectName, "up");
//         console.log(result);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/stop/:projectName', async (req, res) => {
//     try {
//         const result = await runComposeCommand(req.params.projectName, "down");
//         console.log(result);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/storage/:projectName', async (req, res) => {
//     try {
//         const project = PROJECTS[req.params.projectName];
//         if (!project) {
//             return res.status(404).json({ error: "Project not found" });
//         }

//         const { path, volume_path } = project;
        
//         const projectFolderSize = await getFolderSize(path);
//         const volumeFolderSize = await getFolderSize(volume_path);

//         res.json({
//             project_name: req.params.projectName,
//             project_folder_path: path,
//             project_folder_size: projectFolderSize,
//             volume_folder_path: volume_path,
//             volume_folder_size: volumeFolderSize
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


const PORT = process.env.PORT || 8001;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${PORT}`);
});