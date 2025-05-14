const db = require('../../config/db');

// Obtener todos los eventos
exports.obtenerTodos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM eventos_generales ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener evento por ID
exports.obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM eventos_generales WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo evento
exports.crear = async (req, res) => {
  const { tabla_origen, registro_id, tipo_evento, descripcion, solucion, observaciones } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO eventos_generales (tabla_origen, registro_id, tipo_evento, descripcion, solucion, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tabla_origen, registro_id, tipo_evento, descripcion, solucion, observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar evento
exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { tabla_origen, registro_id, tipo_evento, descripcion, solucion, observaciones } = req.body;
  try {
    const result = await db.query(
      `UPDATE eventos_generales
       SET tabla_origen = $1, registro_id = $2, tipo_evento = $3, descripcion = $4, solucion = $5, observaciones = $6
       WHERE id = $7 RETURNING *`,
      [tabla_origen, registro_id, tipo_evento, descripcion, solucion, observaciones, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


