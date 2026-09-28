const { Client } = require('pg');
const { DATABASE_URL } = require('./env');

async function withDb(handler) {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured. Set it in your Vercel environment variables.');
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  await client.connect();

  try {
    return await handler(client);
  } finally {
    await client.end();
  }
}

module.exports = {
  withDb
};
