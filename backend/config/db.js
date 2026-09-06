const { Pool } = require('pg');
const { DATABASE_URL } = require('./env');

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: process.env.NODE_ENV === 'production'
		? { rejectUnauthorized: false }
		: false
});

function query(text, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = [];
	}

	const request = pool.query(text, params || []);

	if (typeof callback === 'function') {
		request
			.then(result => callback(null, result.rows))
			.catch(error => callback(error));
	}

	return request;
}

module.exports = { pool, query };