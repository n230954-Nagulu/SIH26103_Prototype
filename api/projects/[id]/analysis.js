module.exports = async function handler(req, res) {
  const { id } = req.query;
  return res.status(200).json({
    ok: true,
    projectId: id,
    analysis: {
      risk_level: 'Medium',
      summary: 'This is a deployment-safe placeholder response for the project analysis endpoint.'
    }
  });
};
