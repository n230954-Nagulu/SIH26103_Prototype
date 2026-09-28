module.exports = async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    data: {
      sector: ['Power', 'Railways', 'Road Transport And Highways', 'Coal', 'Telecommunications'],
      state: ['Maharashtra', 'Delhi', 'Tamil Nadu', 'Karnataka', 'West Bengal'],
      ministry: ['Ministry of Railways', 'Ministry of Power', 'Ministry of Road Transport and Highways'],
      risk_level: ['Low', 'Medium', 'High'],
      project_type: ['Road', 'Rail', 'Power', 'Urban Infrastructure']
    }
  });
};
