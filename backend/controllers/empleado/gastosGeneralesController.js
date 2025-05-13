const db = require('../../config/db');

// Obtener todos los gastos
exports.getAllGastos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gastos_generales');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener gasto por ID
exports.getGastoById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM gastos_generales WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo gasto
exports.createGasto = async (req, res) => {
  const { fecha, descripcion, monto, tipo, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO gastos_generales (fecha, descripcion, monto, tipo, observaciones)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [fecha, descripcion, monto, tipo, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar gasto
exports.updateGasto = async (req, res) => {
  const id = req.params.id;
  const { fecha, descripcion, monto, tipo, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE gastos_generales
      SET fecha = $1, descripcion = $2, monto = $3, tipo = $4, observaciones = $5
      WHERE id = $6
      RETURNING *
    `, [fecha, descripcion, monto, tipo, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

