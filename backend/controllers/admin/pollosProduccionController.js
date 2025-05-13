const pool = require('../../config/db');

// Obtener todos los registros con datos del pollito
exports.obtenerPollosProduccion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pp.*, p.id AS pollito_id, p.peso_promedio, p.observaciones AS observaciones_pollito
      FROM pollos_produccion pp
      JOIN pollitos p ON pp.pollito_id = p.id
      ORDER BY pp.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un registro por ID
exports.obtenerPolloPorId = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pp.*, p.id AS pollito_id, p.peso_promedio, p.observaciones AS observaciones_pollito
      FROM pollos_produccion pp
      JOIN pollitos p ON pp.pollito_id = p.id
      WHERE pp.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo registro
exports.crearPolloProduccion = async (req, res) => {
  try {
    const { pollito_id, fecha_ingreso, peso_inicial, estado, causa_muerte, fecha_muerte, observaciones } = req.body;

    const insert = await pool.query(`
      INSERT INTO pollos_produccion (pollito_id, fecha_ingreso, peso_inicial, estado, causa_muerte, fecha_muerte, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [pollito_id, fecha_ingreso, peso_inicial, estado, causa_muerte, fecha_muerte, observaciones]);

    const pollito = await pool.query(`SELECT id, peso_promedio, observaciones FROM pollitos WHERE id = $1`, [pollito_id]);

    res.json({
      ...insert.rows[0],
      pollito_id: pollito.rows[0].id,
      peso_promedio: pollito.rows[0].peso_promedio,
      observaciones_pollito: pollito.rows[0].observaciones
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar registro
exports.actualizarPolloProduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { pollito_id, fecha_ingreso, peso_inicial, estado, causa_muerte, fecha_muerte, observaciones } = req.body;

    await pool.query(`
      UPDATE pollos_produccion
      SET pollito_id = $1, fecha_ingreso = $2, peso_inicial = $3, estado = $4,
          causa_muerte = $5, fecha_muerte = $6, observaciones = $7, fecha_actualizacion = CURRENT_DATE
      WHERE id = $8
    `, [pollito_id, fecha_ingreso, peso_inicial, estado, causa_muerte, fecha_muerte, observaciones, id]);

    res.json({ message: 'Registro actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar registro
exports.eliminarPolloProduccion = async (req, res) => {
  try {
    await pool.query('DELETE FROM pollos_produccion WHERE id = $1', [req.params.id]);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
