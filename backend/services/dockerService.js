const { exec, execSync } = require('child_process');
const Project = require('../db_connect');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

async function runComposeCommand(projectId, composeCommand) {
    // Get project from database
    const projectResult = await Project.query(
        'SELECT * FROM projects WHERE id = $1',
        [projectId]
    );
    
    if (projectResult.rows.length === 0) {
        throw new Error("Project not found");
    }
    
    const project = projectResult.rows[0];
    const projectPath = path.join('/home/ubuntu/app', project.name);
    const volumePath = path.join('/opt', project.name, 'postgres-data');

    // Verify project directory exists
    if (!fs.existsSync(projectPath)) {
        throw new Error(`Project directory not found at ${projectPath}`);
    }

    // Determine the correct compose file path
    const composeFilePath = path.join(projectPath, 'docker-compose.yml');
    if (!fs.existsSync(composeFilePath)) {
        throw new Error(`docker-compose.yml not found in ${projectPath}`);
    }

    let command;
    if (composeCommand === "up") {
        const envFilePath = path.join(projectPath, '.env');
        if (!fs.existsSync(envFilePath)) {
            throw new Error(`.env file not found at ${envFilePath}`);
        }
        command = `DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f ${composeFilePath} --env-file ${envFilePath} up -d --build`;
    } else if (composeCommand === "down") {
        command = `COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f ${composeFilePath} down`;
    } else {
        throw new Error(`Invalid compose command: ${composeCommand}`);
    }

    try {
        console.log(`Executing in ${projectPath}: ${command}`);
        const { stdout, stderr } = await execPromise(command, { 
            cwd: projectPath,
            env: { ...process.env, COMPOSE_PROJECT_NAME: project.name }
        });
        
        return {
            success: true,
            stdout,
            stderr,
            returncode: stderr ? 1 : 0
        };
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        throw new Error(`Failed to ${composeCommand} project: ${error.message}`);
    }
}

const getDockerCpuUsage = (projectName) => {
  try {
    // Get stats for all running containers
    const output = execSync(
      `docker stats --no-stream --format "{{.Name}}:{{.CPUPerc}}"`,
      { encoding: "utf-8" }
    );

    const lines = output.trim().split('\n');
    let totalCpu = 0;

    lines.forEach(line => {
      const [name, percent] = line.split(':');
      if (name.includes(projectName)) {
        const cpuValue = parseFloat(percent.replace('%', '')) || 0;
        totalCpu += cpuValue;
      }
    });

    return totalCpu;
  } catch (err) {
    console.error("Error getting Docker CPU stats:", err.message);
    return null;
  }
};

const getDockerMemoryUsage = (projectName) => {
  try {
    const output = execSync(
      `docker stats --no-stream --format "{{.Name}}:{{.MemUsage}}"`,
      { encoding: 'utf-8' }
    );

    let totalUsedMb = 0;

    output.trim().split('\n').forEach(line => {
      const [name, usage] = line.split(':');

      if (name.includes(projectName)) {
        const match = usage.match(/([\d.]+)([a-zA-Z]+)/);
        if (match) {
          let value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();

          if (unit === 'gib' || unit === 'gb') value *= 1024;
          else if (unit === 'kib' || unit === 'kb') value /= 1024;

          totalUsedMb += value;
        }
      }
    });

    return totalUsedMb;
  } catch (err) {
    console.error("Error getting Docker memory stats:", err.message);
    return null;
  }
};


module.exports = {
    runComposeCommand,
    getDockerCpuUsage,
    getDockerMemoryUsage
};