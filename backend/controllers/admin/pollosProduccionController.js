const pool = require('../../config/db');

// Obtener todos los registros con datos del pollito
exports.obtenerPollosProduccion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pp.*, 
        p.id AS pollito_id,
        p.peso_promedio,
        p.fecha_nacimiento,
        p.cantidad_vivos,
        p.cantidad_muertos,
        p.observaciones AS observaciones_pollito
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
      SELECT 
        pp.*, 
        p.id AS pollito_id,
        p.peso_promedio,
        p.fecha_nacimiento,
        p.cantidad_vivos,
        p.cantidad_muertos,
        p.observaciones AS observaciones_pollito
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
    const { pollito_id, nombre, fecha_ingreso, cantidad, peso_inicial, observaciones } = req.body;

    const insert = await pool.query(`
      INSERT INTO pollos_produccion 
        (pollito_id, nombre, fecha_ingreso, cantidad, peso_inicial, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [pollito_id, nombre, fecha_ingreso, cantidad, peso_inicial, observaciones]);

    const pollito = await pool.query(`
      SELECT id, peso_promedio, fecha_nacimiento, cantidad_vivos, cantidad_muertos, observaciones 
      FROM pollitos 
      WHERE id = $1
    `, [pollito_id]);

    res.json({
      ...insert.rows[0],
      pollito_id: pollito.rows[0].id,
      peso_promedio: pollito.rows[0].peso_promedio,
      fecha_nacimiento: pollito.rows[0].fecha_nacimiento,
      cantidad_vivos: pollito.rows[0].cantidad_vivos,
      cantidad_muertos: pollito.rows[0].cantidad_muertos,
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
    const { pollito_id, nombre, fecha_ingreso, cantidad, peso_inicial, observaciones } = req.body;

    await pool.query(`
      UPDATE pollos_produccion
      SET 
        pollito_id = $1, 
        nombre = $2,
        fecha_ingreso = $3, 
        cantidad = $4,
        peso_inicial = $5, 
        observaciones = $6,
        fecha_actualizacion = CURRENT_DATE
      WHERE id = $7
    `, [pollito_id, nombre, fecha_ingreso, cantidad, peso_inicial, observaciones, id]);

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
