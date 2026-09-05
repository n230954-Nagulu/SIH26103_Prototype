function riskFromScores(timeOverrunPct,costOverrunPct){const score=Math.max(0,Math.min(100,(Math.max(0,timeOverrunPct)*0.5)+(Math.max(0,costOverrunPct)*0.5)));let level=score>=70?'High':score>=40?'Medium':'Low';return {score:Number(score.toFixed(1)),level};}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
module.exports={riskFromScores,clamp};