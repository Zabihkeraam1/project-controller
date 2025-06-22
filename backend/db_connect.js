// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
//   ssl: {
//     rejectUnauthorized: false // Required for RDS PostgreSQL
//   }
// });

// // Test the connection
// pool.query('SELECT NOW()', (err) => {
//   if (err) {
//     console.error('Database connection error:', err.stack);
//   } else {
//     console.log('Successfully connected to PostgreSQL RDS');
//   }
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
//   pool // For transactions
// };