const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);
const { getDockerCpuUsage, getDockerMemoryUsage } = require('./dockerService.js');
const getDockerContainerSize = async (containerName) => {
    try {
        const { stdout } = await execPromise(
            `du -sb ${containerName} | cut -f1`
        );
        const sizeString = stdout.trim();
        return parseFloat(sizeString) || 0;
    } catch (error) {
        console.error('Error getting container size:', error);
        return 0;
    }
};

const getVolumeSize = async (volumePath) => {
    try {
        const { stdout } = await execPromise(`sudo du -sb ${volumePath} | cut -f1`);
        const bytes = parseInt(stdout.trim());

        return bytes;
    } catch (error) {
        console.error('Error getting volume size:', error);
        return 0;
    }
};

const getStorageUsage = async (path) => {
    try {
        const { stdout } = await execPromise(`du -sh ${path} | cut -f1`);
        return stdout.trim();
    } catch (error) {
        console.error(`Error getting storage usage for ${path}:`, error);
        return '0B';
    }
};

const getDiskInfo = async (path = `/home/ubuntu/app/`) => {
    try {
        const { stdout } = await execPromise(`df -h ${path}`);
        const lines = stdout.trim().split('\n');
        const headers = lines[0].split(/\s+/);
        const values = lines[1].split(/\s+/);

        const result = {};
        headers.forEach((header, i) => {
            result[header.toLowerCase()] = values[i];
        });

        // Calculate free space percentage
        if (result['use%']) {
            result.free_percentage = 100 - parseInt(result['use%']);
        }

        return result;
    } catch (error) {
        console.error(`Error getting disk info for ${path}:`, error);
        return {
            'use%': '0%',
            free_percentage: 100
        };
    }
};

const getProjectStateInfo = async (project) => {
    const projectPath = `/home/ubuntu/app/${project.name}`;
    const volumePath = `/opt/${project.name}/postgres-data`;

    // Check if paths exist
    const pathsExist = {
        project_path: fs.existsSync(projectPath),
        volume_path: fs.existsSync(volumePath)
    };
    // Get all storage information in parallel
    const [containerSize, volumeSize, diskInfo] = await Promise.all([
        getDockerContainerSize(projectPath),
        getVolumeSize(volumePath),
        getDiskInfo(projectPath)
    ]);
    // Convert all sizes to numbers in GB
    const GbToByte = 1073741824;
    const allocatedSpace = Number(project.storage) * GbToByte || 0;
    const totalUsedSpace = containerSize + volumeSize;
    const freeSpace = Math.max(0, allocatedSpace - totalUsedSpace);
    function formatBytesToMbOrGb(bytes) {
        const MB = bytes / (1024 * 1024);
        return MB >= 1024
            ? `${(MB / 1024).toFixed(2)}G`
            : `${MB.toFixed(2)}M`;
    }

    const volumeSizeInGbOrMb = formatBytesToMbOrGb(volumeSize);
    const allocatedSpaceInGbOrMb = formatBytesToMbOrGb(allocatedSpace);
    const totalUsedSpaceInGbOrMb = formatBytesToMbOrGb(totalUsedSpace);
    const freeSpaceInGbOrMb = formatBytesToMbOrGb(freeSpace);
    const containerSizeInGbOrMb = formatBytesToMbOrGb(containerSize);
    const cpuUsedPercent = getDockerCpuUsage(project.name);
    const memoryUsedMB = getDockerMemoryUsage(project.name);


    return {
        paths: {
            application: projectPath,
            volume: volumePath,
            exists: pathsExist
        },
        usage: {
            total: allocatedSpaceInGbOrMb,
            used: totalUsedSpaceInGbOrMb,
            free: freeSpaceInGbOrMb,
            container: containerSizeInGbOrMb,
            volume: volumeSizeInGbOrMb,
        },
        filesystem: diskInfo,
        resources: {
            cpuAllocated: (Number(project.cpu) / 1000).toFixed(1),
            cpuUsedPercent: cpuUsedPercent?.toFixed(2) || '0.00',
            memoryAllocated: (Number(project.memory) / 1024).toFixed(2),
            memoryUsedMB: memoryUsedMB?.toFixed(2) || '0.00'
        }
    };
};




module.exports = {
    getProjectStateInfo,
    getDiskInfo,
};