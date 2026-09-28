const { APP_ENV } = require('./lib/env');

module.exports = async function handler(req, res) {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    environment: APP_ENV,
    service: 'sih26103-api',
    note: 'This endpoint is safe for Vercel serverless deployment. Avoid localhost-only dependencies.'
  });
};
