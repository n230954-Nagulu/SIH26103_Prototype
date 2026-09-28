const { withDb } = require('../lib/db');

module.exports = async function handler(req, res) {
  try {
    const projects = await withDb(async (client) => {
      const result = await client.query('SELECT * FROM projects LIMIT 20');
      return result.rows;
    });

    return res.status(200).json({
      ok: true,
      projects
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      message: 'Database not configured or unreachable.',
      error: error.message
    });
  }
};
