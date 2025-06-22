// routes/migration.js
const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
require('dotenv').config();
const path = require('path');
const scriptPath = path.join(__dirname, '../scripts/migrate_postgres.sh');
const migrationController = async(req, res) => {
  const {
    sourceType,
    targetType,
    sourceHost,
    sourcePort,
    sourceDB,
    sourceUser,
    sourcePassword,
    targetHost,
    targetPort,
    targetDB,
    targetUser,
    targetPassword
  } = req.body;
  process.env.PGPASSWORD = sourceType === "rds" ? sourcePassword : targetPassword;

  const args = [
  sourceType,
  targetType,
  sourceHost,
  sourcePort,
  sourceDB,
  sourceUser,
  sourcePassword,
  targetHost,
  targetPort,
  targetDB,
  targetUser,
  targetPassword
];

  // Optional: set PGPASSWORD in env for non-interactive auth
  process.env.PGPASSWORD = process.env.PG_PASSWORD;

  execFile(scriptPath, args, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Errorr:`, error);
    console.error(`stderr: ${stderr}`);
      return res.status(500).json({ message: 'Migration failed', error: stderr });
    }
    console.log(`✅ Migration output: ${stdout}`);
    res.status(200).json({ message: 'Migration completed', output: stdout });
  });
};

module.exports = {migrationController};
