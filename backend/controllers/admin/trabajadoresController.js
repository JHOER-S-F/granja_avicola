const db = require('../../config/db');

// Obtener todos los trabajadores
exports.getAllTrabajadores = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM trabajadores`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un trabajador por ID
exports.getTrabajadorById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`SELECT * FROM trabajadores WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Trabajador no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo trabajador
exports.createTrabajador = async (req, res) => {
  const { nombre, cedula, telefono, cargo, fecha_ingreso, estado, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO trabajadores 
      (nombre, cedula, telefono, cargo, fecha_ingreso, estado, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [nombre, cedula, telefono, cargo, fecha_ingreso, estado, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar trabajador
exports.updateTrabajador = async (req, res) => {
  const id = req.params.id;
  const { nombre, cedula, telefono, cargo, fecha_ingreso, estado, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE trabajadores
      SET nombre = $1, cedula = $2, telefono = $3, cargo = $4,
          fecha_ingreso = $5, estado = $6, observaciones = $7
      WHERE id = $8
      RETURNING *
    `, [nombre, cedula, telefono, cargo, fecha_ingreso, estado, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Trabajador no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar trabajador
exports.deleteTrabajador = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`DELETE FROM trabajadores WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Trabajador no encontrado" });
    res.json({ mensaje: "Trabajador eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
