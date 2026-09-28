const getEnv = (name, fallback = '') => {
  const value = process.env[name];
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim();
  }
  return fallback;
};

module.exports = {
  APP_ENV: getEnv('NODE_ENV', 'development'),
  PORT: Number(getEnv('PORT', '3000')),
  DATABASE_URL: getEnv('DATABASE_URL', ''),
  ML_SERVICE_URL: getEnv('ML_SERVICE_URL', ''),
  PROJECTS_API_BASE_URL: getEnv('PROJECTS_API_BASE_URL', ''),
  DASHBOARD_API_BASE_URL: getEnv('DASHBOARD_API_BASE_URL', ''),
  API_PREFIX: getEnv('API_PREFIX', '/api')
};
