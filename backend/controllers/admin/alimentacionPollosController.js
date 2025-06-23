const db = require('../../config/db');

// Obtener todos los registros de alimentación con multiplicación de cantidad
exports.getAllAlimentaciones = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.id AS alimentacion_id,
        a.fecha,
        a.tipo_alimento,
        a.cantidad_kg,
        a.proveedor,
        a.hora_aplicacion,
        a.etapa_produccion,
        a.observaciones,
        p.id AS pollo_id,
        p.nombre,
        p.fecha_ingreso,
        p.cantidad,
        (a.cantidad_kg * p.cantidad) AS total_kg_consumidos
      FROM alimentacion_pollos a
      LEFT JOIN pollos_produccion p ON a.pollo_id = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un registro de alimentación por ID
exports.getAlimentacionById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`
      SELECT 
        a.id AS alimentacion_id,
        a.fecha,
        a.tipo_alimento,
        a.cantidad_kg,
        a.proveedor,
        a.hora_aplicacion,
        a.etapa_produccion,
        a.observaciones,
        p.id AS pollo_id,
        p.nombre,
        p.fecha_ingreso,
        p.cantidad,
        (a.cantidad_kg * p.cantidad) AS total_kg_consumidos
      FROM alimentacion_pollos a
      LEFT JOIN pollos_produccion p ON a.pollo_id = p.id
      WHERE a.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Registro no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo registro de alimentación
exports.createAlimentacion = async (req, res) => {
  const { pollo_id, fecha, tipo_alimento, cantidad_kg, proveedor, hora_aplicacion, etapa_produccion, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alimentacion_pollos 
      (pollo_id, fecha, tipo_alimento, cantidad_kg, proveedor, hora_aplicacion, etapa_produccion, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [pollo_id, fecha, tipo_alimento, cantidad_kg, proveedor, hora_aplicacion, etapa_produccion, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un registro de alimentación
exports.updateAlimentacion = async (req, res) => {
  const id = req.params.id;
  const { pollo_id, fecha, tipo_alimento, cantidad_kg, proveedor, hora_aplicacion, etapa_produccion, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE alimentacion_pollos
      SET 
        pollo_id = $1, 
        fecha = $2, 
        tipo_alimento = $3, 
        cantidad_kg = $4,
        proveedor = $5, 
        hora_aplicacion = $6, 
        etapa_produccion = $7, 
        observaciones = $8
      WHERE id = $9
      RETURNING *
    `, [pollo_id, fecha, tipo_alimento, cantidad_kg, proveedor, hora_aplicacion, etapa_produccion, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Registro no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un registro de alimentación
exports.deleteAlimentacion = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`DELETE FROM alimentacion_pollos WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Registro no encontrado" });
    res.json({ mensaje: "Registro eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
