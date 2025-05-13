const pool = require('../../config/db');

// Obtener todos los lotes con nombre e ID de la incubadora
exports.obtenerLotes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lh.*, i.id AS incubadora_id, i.nombre AS incubadora_nombre
      FROM lotes_huevos lh
      JOIN incubadoras i ON lh.incubadora_id = i.id
      ORDER BY lh.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un solo lote por ID
exports.obtenerLotePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT lh.*, i.id AS incubadora_id, i.nombre AS incubadora_nombre
      FROM lotes_huevos lh
      JOIN incubadoras i ON lh.incubadora_id = i.id
      WHERE lh.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lote no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo lote
exports.crearLote = async (req, res) => {
  try {
    const { incubadora_id, fecha_ingreso, cantidad_huevos, fecha_salida, observaciones } = req.body;

    const insertResult = await pool.query(
      `INSERT INTO lotes_huevos (incubadora_id, fecha_ingreso, cantidad_huevos, fecha_salida, observaciones)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [incubadora_id, fecha_ingreso, cantidad_huevos, fecha_salida, observaciones]
    );

    const incubadora = await pool.query(
      'SELECT id, nombre FROM incubadoras WHERE id = $1',
      [incubadora_id]
    );

    res.status(201).json({
      ...insertResult.rows[0],
      incubadora_id: incubadora.rows[0].id,
      incubadora_nombre: incubadora.rows[0].nombre
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar lote
exports.actualizarLote = async (req, res) => {
  try {
    const { id } = req.params;
    const { incubadora_id, fecha_ingreso, cantidad_huevos, fecha_salida, observaciones } = req.body;

    const result = await pool.query(
      `UPDATE lotes_huevos
       SET incubadora_id = $1, fecha_ingreso = $2, cantidad_huevos = $3, fecha_salida = $4, observaciones = $5
       WHERE id = $6 RETURNING *`,
      [incubadora_id, fecha_ingreso, cantidad_huevos, fecha_salida, observaciones, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lote no encontrado para actualizar' });
    }

    const incubadora = await pool.query(
      'SELECT id, nombre FROM incubadoras WHERE id = $1',
      [incubadora_id]
    );

    res.json({
      ...result.rows[0],
      incubadora_id: incubadora.rows[0].id,
      incubadora_nombre: incubadora.rows[0].nombre
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

