// backend/config/db.js

const { Client } = require('pg');
require('dotenv').config(); 

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'granja_avicola',
  password: process.env.DB_PASSWORD || '1006521620Jhoer',
  port: process.env.DB_PORT || 5432,
});
module.exports = client;
