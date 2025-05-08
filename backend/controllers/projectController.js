const { exec, execSync } = require('child_process');
const Project = require('../db_connect.js');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);
const {runComposeCommand} = require('../services/dockerService.js');
const {getProjectStateInfo, getDiskInfo} = require('../services/storageService.js');
const { limitStorageWrite } = require('../services/limitationService.js');
const os = require('os');
const osu = require('os-utils');
const si = require('systeminformation');
// START PROJECT
const startProject = async(req, res) => {
    const { projectId } = req.params
    if (!projectId) {
        throw new Error("Project id is required");
    }

    try {
        runComposeCommand(projectId, "up");
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        throw error;
    }
}

//STOP PROJECT
const stopProject = async(req, res) => {
    const { projectId } = req.params
    if (!projectId) {
        throw new Error("Project Id is required");
    }
    
    try {
        runComposeCommand(projectId, "down");
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        throw error;
    }
}

// Get project storage information
const getProjectStorage = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Validate project ID
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required"
      });
    }

    // Get project from database
    const projectResult = await Project.query(
      'SELECT * FROM projects WHERE id = $1', 
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const project = projectResult.rows[0];
    const storageInfo = await getProjectStateInfo(project);

    res.json({
      success: true,
      message: "Storage information retrieved",
      data: storageInfo
    });

  } catch (error) {
    console.error("Error getting project storage:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get project storage information",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all projects with storage information
const getProjects = async (req, res) => {
  try {
    const result = await Project.query('SELECT * FROM projects');
    const projects = result.rows;

    const projectsWithStorage = await Promise.all(
      projects.map(async (project) => {
        try {
          const storageInfo = await getProjectStateInfo(project);
          // if (storageInfo.usage.used >= storageInfo.usage.total) {
          if (storageInfo.usage.used >= storageInfo.usage.total) {
            limitStorageWrite(project.name);
            console.log("Storage limit exceeded", project.name);
          }
          return {
            ...project,
            storageInfo
          };
        } catch (error) {
          console.error(`Error processing project ${project.id}:`, error);
          return {
            ...project,
            storageInfo: null,
            storageError: error.message
          };
        }
      })
    );

    res.json({
      success: true,
      data: projectsWithStorage
    });
  } catch (error) {
    console.error("Error getting projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get projects information",
      error: error.message
    });
  }
}

const getEc2InstanceInfo = async (req, res) => {
  try {
    const info = await getDiskInfo();
    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error("Error getting EC2 instance info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get EC2 instance information",
      error: error.message
    });
  }
}
// Get system stats
const getSystemStats = async (req, res) => {
  try {
    // Basic Info
    const uptime = os.uptime();
    const totalMem = os.totalmem() / 1024 / 1024; // MB
    const freeMem = os.freemem() / 1024 / 1024;   // MB
    const usedMem = totalMem - freeMem;
    const info = await getDiskInfo();
    // CPU Usage
    osu.cpuUsage(async (cpuPercent) => {
      // Disk Info
      const disk = await si.fsSize();
      const net = await si.networkStats();
      const io = await si.disksIO();

      res.json({
        data: info,
        os: {
          platform: os.platform(),
          arch: os.arch(),
          hostname: os.hostname(),
          release: os.release(),
          uptimeSeconds: uptime,
        },
        cpu: {
          model: os.cpus()[0].model,
          speed: os.cpus()[0].speed,
          cores: os.cpus().length,
          load: os.loadavg(),
          cpuUsagePercent: (cpuPercent * 100).toFixed(2),
          cpuCurrentSpeed: await si.cpuCurrentSpeed(),
          cpuCache: await si.cpuCache(),
          cpu: await si.cpu(),
        },
        memory: {
          totalMB: totalMem.toFixed(2),
          usedMB: usedMem.toFixed(2),
          freeMB: freeMem.toFixed(2),
        },
        disk: disk.map((d) => ({
          fs: d.fs,
          type: d.type,
          sizeGB: (d.size / 1024 / 1024 / 1024).toFixed(2),
          usedGB: (d.used / 1024 / 1024 / 1024).toFixed(2),
          usePercent: d.use,
          mount: d.mount,
        })),
        network: net.map((n) => ({
          iface: n.iface,
          rxMBps: (n.rx_bytes / 1024 / 1024).toFixed(2),
          txMBps: (n.tx_bytes / 1024 / 1024).toFixed(2),
        })),
        diskIO: {
          readMB: (io.rIO / 1024 / 1024).toFixed(2),
          writeMB: (io.wIO / 1024 / 1024).toFixed(2),
        }
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve system stats' });
  }
};

// Delete project resources
// This function deletes the project resources including Docker containers, volumes, cgroups, and NGINX configurations.
const deleteProjectResources = async (req, res) => {
  const projectName  = req.params.projectName;
  const projectPath = `/home/ubuntu/app/${projectName}`;
  const volumeName = `${projectName}_postgres-data`;
  const volumePath = `/opt/${projectName}`;
  const cgroupPath = `/sys/fs/cgroup/${projectName}`;
  const nginxConfig = `/etc/nginx/sites-available/${projectName}`;
  const nginxEnabledLink = `/etc/nginx/sites-enabled/${projectName}`;

  try {
    console.log("🔧 Stopping and removing Docker containers...");
    execSync(`docker compose -f ${projectPath}/docker-compose.yml down --rmi all -v`, {
      stdio: "inherit",
    });

    console.log("🧹 Deleting Docker volume if exists...");
    try {
      execSync(`docker volume rm -f ${volumeName}`, { stdio: "inherit" });
    } catch (error) {
      console.warn(`⚠️ Volume ${volumeName} may not exist, skipping.`);
    }

    console.log("🗑️ Deleting project directory...");
    fs.rmSync(projectPath, { recursive: true, force: true });

    console.log("🗑️ Deleting volume directory...");
    try{
      execSync(`sudo rm -rf ${volumePath}`, { stdio: "inherit" });
    }catch (error) {
      console.warn(`⚠️ Volume directory ${volumePath} may not exist, skipping.`);
    }

    console.log("📦 Removing associated Docker images...");
    execSync(`docker image prune -a -f`, { stdio: "inherit" });

    console.log("⚙️ Cleaning up cgroup directory...");
    if (fs.existsSync(cgroupPath)) {
      try {
        execSync(`sudo rmdir ${cgroupPath}`);
      } catch (err) {
        console.warn("⚠️ Unable to remove cgroup directory. May require elevated permissions.");
      }
    }
    console.log("🧼 Removing nginx config and link...");
    try {
      execSync(`sudo rm ${nginxConfig}`);
      execSync(`sudo rm ${nginxEnabledLink}`);
      console.log("✅ Nginx config and link removed.");
    } catch (error) {
      console.error("❌ Cleanup error:", error.message);
    }

    console.log("🔄 Reloading NGINX...");
    execSync("sudo systemctl reload nginx");

    return res.status(200).json({ message: "Project cleanup successful." });
  } catch (err) {
    console.error("❌ Cleanup error:", err.message);
    return res.status(500).json({ error: "Cleanup failed", details: err.message });
  }
};

module.exports = {
    startProject,
    stopProject,
    getProjectStorage,
    getProjects,
    getEc2InstanceInfo,
    getSystemStats,
    deleteProjectResources
  };
  