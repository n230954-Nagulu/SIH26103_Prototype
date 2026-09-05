function riskFromScores(
    timeOverrunPct,
    costOverrunPct
) {
    const time = Math.max(
        0,
        Number(timeOverrunPct) || 0
    );

    const cost = Math.max(
        0,
        Number(costOverrunPct) || 0
    );

    const score = Math.max(
        0,
        Math.min(
            100,
            (Math.min(time, 100) * 0.45) +
            (Math.min(cost, 100) * 0.55)
        )
    );

    let level = 'Low';

    if (score >= 60) {
        level = 'High';
    } else if (score >= 35) {
        level = 'Medium';
    }

    return {
        score: Number(score.toFixed(1)),
        level
    };
}


function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}


module.exports = {
    riskFromScores,
    clamp
};