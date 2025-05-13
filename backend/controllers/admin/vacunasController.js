const db = require('../../config/db');

// Obtener todas las vacunas con datos de pollitos y pollos_producción
exports.getAllVacunas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.id AS vacuna_id,
        v.fecha_aplicacion,
        v.nombre_vacuna,
        v.cantidad_dosis,
        v.observaciones,
        p.id AS pollito_id,
        p.cantidad_vivos,
        pr.id AS pollo_id,
        pr.estado,
        pr.fecha_ingreso
      FROM vacunas v
      LEFT JOIN pollitos p ON v.pollito_id = p.id
      LEFT JOIN pollos_produccion pr ON v.pollo_id = pr.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una vacuna por ID
exports.getVacunaById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`
      SELECT 
        v.id AS vacuna_id,
        v.fecha_aplicacion,
        v.nombre_vacuna,
        v.cantidad_dosis,
        v.observaciones,
        p.id AS pollito_id,
        p.cantidad_vivos,
        pr.id AS pollo_id,
        pr.estado,
        pr.fecha_ingreso
      FROM vacunas v
      LEFT JOIN pollitos p ON v.pollito_id = p.id
      LEFT JOIN pollos_produccion pr ON v.pollo_id = pr.id
      WHERE v.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Vacuna no encontrada" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva vacuna
exports.createVacuna = async (req, res) => {
  const { pollito_id, pollo_id, fecha_aplicacion, nombre_vacuna, cantidad_dosis, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO vacunas (pollito_id, pollo_id, fecha_aplicacion, nombre_vacuna, cantidad_dosis, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [pollito_id, pollo_id, fecha_aplicacion, nombre_vacuna, cantidad_dosis, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar vacuna
exports.updateVacuna = async (req, res) => {
  const id = req.params.id;
  const { pollito_id, pollo_id, fecha_aplicacion, nombre_vacuna, cantidad_dosis, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE vacunas
      SET pollito_id = $1, pollo_id = $2, fecha_aplicacion = $3,
          nombre_vacuna = $4, cantidad_dosis = $5, observaciones = $6
      WHERE id = $7
      RETURNING *
    `, [pollito_id, pollo_id, fecha_aplicacion, nombre_vacuna, cantidad_dosis, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Vacuna no encontrada" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar vacuna
exports.deleteVacuna = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`DELETE FROM vacunas WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Vacuna no encontrada" });
    res.json({ mensaje: "Vacuna eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
