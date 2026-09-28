module.exports = async function handler(req, res) {
  const { id } = req.query;

  return res.status(200).json({
    ok: true,
    project: {
      id,
      project_code: `PRJ-${String(id || '0001').slice(-4)}`,
      name: 'Project placeholder',
      state: 'Delhi',
      place: 'New Delhi',
      sector: 'Power',
      implementing_agency: 'PowerGrid',
      ministry: 'Ministry of Power',
      project_type: 'Infrastructure',
      risk_level: 'Medium',
      risk_percentage: 42,
      progress_pct: 65,
      original_cost_crore: 1250,
      planned_duration_months: 30,
      manpower: 180,
      contractor_name: 'Project Partner Ltd.',
      officer_name: 'Officer',
      officer_designation: 'Project Director',
      latitude: 28.6139,
      longitude: 77.2090,
      photos: []
    }
  });
};
