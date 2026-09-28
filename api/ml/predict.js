const { ML_SERVICE_URL } = require('../lib/env');

module.exports = async function handler(req, res) {
  const payload = req.body || {};

  if (!ML_SERVICE_URL) {
    return res.status(400).json({
      ok: false,
      message: 'ML_SERVICE_URL is missing. Set it in your Vercel environment variables.'
    });
  }

  try {
    const response = await fetch(`${ML_SERVICE_URL.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      ...data
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      message: 'Could not reach the external ML service.',
      error: error.message
    });
  }
};
