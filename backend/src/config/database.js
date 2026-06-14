const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'taqueen_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: parseInt(process.env.DB_POOL_SIZE) || 10,
});

pool.on('error', (err) => {
  logger.error('Unexpected pool error:', err);
});

pool.on('connect', () => {
  logger.info('✅ Connected to PostgreSQL');
});

module.exports = pool;
