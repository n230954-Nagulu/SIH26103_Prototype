module.exports = async function handler(req, res) {
  const { id } = req.query;
  return res.status(200).json({
    ok: true,
    projectId: id,
    report: {
      title: 'Deployment placeholder report',
      period: 'Current cycle',
      summary: 'Use a hosted backend or database-backed report service in production.'
    }
  });
};
