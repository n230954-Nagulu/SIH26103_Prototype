const axios = require('axios');

const { ML_SERVICE_URL } = require('../config/env');


async function predict(features = {}, options = {}) {
    const payload = {
        ...features,

        scenario:
            options.scenario === true,

        baseline_manpower:
            options.baseline_manpower,

        baseline_original_cost:
            options.baseline_original_cost,

        baseline_duration:
            options.baseline_duration
    };

    const r = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        payload,
        {
            timeout: 20000
        }
    );

    return r.data;
}


module.exports = {
    predict
};