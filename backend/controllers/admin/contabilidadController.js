const db = require('../../config/db');

// Obtener todos los registros
exports.obtenerTodos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contabilidad_general ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un registro por ID
exports.obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM contabilidad_general WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo registro
exports.crear = async (req, res) => {
  const { fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO contabilidad_general (fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un registro
exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones } = req.body;
  try {
    const result = await db.query(
      `UPDATE contabilidad_general
       SET fecha = $1, descripcion = $2, tipo_operacion = $3, monto = $4, origen = $5, referencia_id = $6, observaciones = $7
       WHERE id = $8 RETURNING *`,
      [fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un registro
exports.eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM contabilidad_general WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json({ mensaje: 'Registro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resumen por fecha exacta
exports.resumenPorFecha = async (req, res) => {
  const { fecha } = req.query;

  try {
    const ingresosResult = await db.query(
      `SELECT COALESCE(SUM(monto), 0) AS total_ingresos
       FROM contabilidad_general
       WHERE tipo_operacion = 'ingreso' AND fecha = $1`,
      [fecha]
    );

    const egresosResult = await db.query(
      `SELECT COALESCE(SUM(monto), 0) AS total_egresos
       FROM contabilidad_general
       WHERE tipo_operacion = 'egreso' AND fecha = $1`,
      [fecha]
    );

    const totalIngresos = parseFloat(ingresosResult.rows[0].total_ingresos);
    const totalEgresos = parseFloat(egresosResult.rows[0].total_egresos);
    const totalNeto = totalIngresos - totalEgresos;

    res.json({
      fecha,
      total_ingresos: totalIngresos,
      total_egresos: totalEgresos,
      total_neto: totalNeto,
      estado: totalNeto >= 0 ? 'ganancia' : 'pérdida'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resumen por rango de fechas
exports.resumenPorRango = async (req, res) => {
  const { desde, hasta } = req.query;

  try {
    const ingresosResult = await db.query(
      `SELECT COALESCE(SUM(monto), 0) AS total_ingresos
       FROM contabilidad_general
       WHERE tipo_operacion = 'ingreso' AND fecha BETWEEN $1 AND $2`,
      [desde, hasta]
    );

    const egresosResult = await db.query(
      `SELECT COALESCE(SUM(monto), 0) AS total_egresos
       FROM contabilidad_general
       WHERE tipo_operacion = 'egreso' AND fecha BETWEEN $1 AND $2`,
      [desde, hasta]
    );
    
    const totalIngresos = parseFloat(ingresosResult.rows[0].total_ingresos);
    const totalEgresos = parseFloat(egresosResult.rows[0].total_egresos);
    const totalNeto = totalIngresos - totalEgresos;

    res.json({
      desde,
      hasta,
      total_ingresos: totalIngresos,
      total_egresos: totalEgresos,
      total_neto: totalNeto,
      estado: totalNeto >= 0 ? 'ganancia' : 'pérdida'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
