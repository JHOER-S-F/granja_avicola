const pool = require('../../config/db');

// Obtener todos los registros de pollitos con info del lote
exports.obtenerPollitos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, l.id AS lote_id, l.fecha_salida
      FROM pollitos p
      JOIN lotes_huevos l ON p.lote_id = l.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un pollito por ID
exports.obtenerPollitoPorId = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, l.id AS lote_id, l.fecha_salida
      FROM pollitos p
      JOIN lotes_huevos l ON p.lote_id = l.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo registro de pollitos
exports.crearPollito = async (req, res) => {
  try {
    const { lote_id, fecha_nacimiento, cantidad_vivos, cantidad_muertos, peso_promedio, observaciones } = req.body;

    const insert = await pool.query(`
      INSERT INTO pollitos (lote_id, fecha_nacimiento, cantidad_vivos, cantidad_muertos, peso_promedio, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [lote_id, fecha_nacimiento, cantidad_vivos, cantidad_muertos, peso_promedio, observaciones]
    );

    const lote = await pool.query(`SELECT id, fecha_salida FROM lotes_huevos WHERE id = $1`, [lote_id]);

    res.json({
      ...insert.rows[0],
      lote_id: lote.rows[0].id,
      fecha_salida: lote.rows[0].fecha_salida
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un registro
exports.actualizarPollito = async (req, res) => {
  try {
    const { id } = req.params;
    const { lote_id, fecha_nacimiento, cantidad_vivos, cantidad_muertos, peso_promedio, observaciones } = req.body;

    await pool.query(`
      UPDATE pollitos
      SET lote_id = $1, fecha_nacimiento = $2, cantidad_vivos = $3, cantidad_muertos = $4,
          peso_promedio = $5, observaciones = $6
      WHERE id = $7
    `, [lote_id, fecha_nacimiento, cantidad_vivos, cantidad_muertos, peso_promedio, observaciones, id]);

    res.json({ message: 'Registro actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un registro
exports.eliminarPollito = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pollitos WHERE id = $1', [id]);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
