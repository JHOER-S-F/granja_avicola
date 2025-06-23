const pool = require('../../config/db');

// Obtener todas las bajas con info del pollo
exports.obtenerBajasPollos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bp.*, 
             pp.nombre AS nombre_pollo, 
             pp.fecha_ingreso, 
             pp.cantidad AS cantidad_pollo
      FROM bajas_pollos bp
      JOIN pollos_produccion pp ON bp.pollo_id = pp.id
      ORDER BY bp.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una baja por ID
exports.obtenerBajaPorId = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bp.*, 
             pp.nombre AS nombre_pollo, 
             pp.fecha_ingreso, 
             pp.cantidad AS cantidad_pollo
      FROM bajas_pollos bp
      JOIN pollos_produccion pp ON bp.pollo_id = pp.id
      WHERE bp.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva baja
exports.crearBajaPollo = async (req, res) => {
  try {
    const { pollo_id, lote_id, causa, cantidad, fecha, observaciones } = req.body;

    const insert = await pool.query(`
      INSERT INTO bajas_pollos (pollo_id, lote_id, causa, cantidad, fecha, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [pollo_id, lote_id, causa, cantidad, fecha, observaciones]);

    const pollo = await pool.query(`
      SELECT nombre, fecha_ingreso, cantidad 
      FROM pollos_produccion 
      WHERE id = $1
    `, [pollo_id]);

    res.json({
      ...insert.rows[0],
      nombre_pollo: pollo.rows[0].nombre,
      fecha_ingreso: pollo.rows[0].fecha_ingreso,
      cantidad_pollo: pollo.rows[0].cantidad
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar baja
exports.actualizarBajaPollo = async (req, res) => {
  try {
    const { id } = req.params;
    const { pollo_id, lote_id, causa, cantidad, fecha, observaciones } = req.body;

    await pool.query(`
      UPDATE bajas_pollos
      SET pollo_id = $1, lote_id = $2, causa = $3, cantidad = $4, fecha = $5, observaciones = $6
      WHERE id = $7
    `, [pollo_id, lote_id, causa, cantidad, fecha, observaciones, id]);

    res.json({ message: 'Registro actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar baja
exports.eliminarBajaPollo = async (req, res) => {
  try {
    await pool.query('DELETE FROM bajas_pollos WHERE id = $1', [req.params.id]);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
