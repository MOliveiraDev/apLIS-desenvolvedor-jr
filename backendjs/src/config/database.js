const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { StartupConfigurationException } = require('../exception/BackendExceptions');

dotenv.config();

const REQUIRED_DB_ENV_KEYS = [
  'DB_HOST',
  'DB_PORT',
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_CHARSET',
];

function validateDatabaseEnv() {
  const missingKeys = REQUIRED_DB_ENV_KEYS.filter((key) => {
    const value = process.env[key];
    return !value || String(value).trim() === '';
  });

  if (missingKeys.length > 0) {
    throw new StartupConfigurationException(
      `Variaveis obrigatorias ausentes no .env: ${missingKeys.join(', ')}`,
      { missingKeys }
    );
  }
}

validateDatabaseEnv();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'hospital_db',
  charset: process.env.DB_CHARSET || 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

async function assertDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}

module.exports = {
  assertDatabaseConnection,
  pool,
  validateDatabaseEnv,
};
