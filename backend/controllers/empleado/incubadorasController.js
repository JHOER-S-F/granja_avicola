const pool = require('../../config/db');

exports.crearIncubadora = async (req, res) => {
  const { nombre, capacidad, ubicacion, estado, observaciones } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO incubadoras (nombre, capacidad, ubicacion, estado, observaciones)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, capacidad, ubicacion, estado || 'operativa', observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerIncubadoras = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incubadoras ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerIncubadoraPorId = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incubadoras WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarIncubadora = async (req, res) => {
  const { nombre, capacidad, ubicacion, estado, observaciones } = req.body;
  try {
    const result = await pool.query(
      `UPDATE incubadoras SET 
        nombre = $1,
        capacidad = $2,
        ubicacion = $3,
        estado = $4,
        observaciones = $5,
        id = id
       WHERE id = $6 RETURNING *`,
      [nombre, capacidad, ubicacion, estado, observaciones, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

