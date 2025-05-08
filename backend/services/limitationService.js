const { exec } = require("child_process");
function limitStorageWrite(projectCgroup, limit = 2) {
  exec(`echo "259:0 wbps=${limit}" | sudo tee /sys/fs/cgroup/${projectCgroup}/io.max`, (err, stdout, stderr) => {
    if (err) {
      console.error("Failed to apply I/O limit:", stderr);
    } else {
      console.log("I/O limit applied:", stdout);
    }
  });
}

function removeThrottle(projectCgroup) {
    exec(`echo "default" | sudo tee /sys/fs/cgroup/${projectCgroup}/io.max`, (err, stdout, stderr) => {
      if (err) {
        console.error("Failed to reset I/O limit:", stderr);
      } else {
        console.log("I/O limit removed:", stdout);
      }
    });
  }
  
module.exports = {
    limitStorageWrite
};