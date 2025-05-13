// controllers/inventarioController.js
const pool = require('../../config/db');

// Crear producto
exports.crearInventario = async (req, res) => {
  const {
    nombre_producto, descripcion, categoria, cantidad,
    unidad, costo_unitario, proveedor, ubicacion,
    responsable, metodo_pago_id, observaciones
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO inventario (
        nombre_producto, descripcion, categoria, cantidad,
        unidad, costo_unitario, proveedor, ubicacion,
        responsable, metodo_pago_id, observaciones
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `, [nombre_producto, descripcion, categoria, cantidad, unidad, costo_unitario, proveedor, ubicacion, responsable, metodo_pago_id, observaciones]);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos
exports.obtenerInventario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener uno
exports.obtenerInventarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM inventario WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar
exports.actualizarInventario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_producto, descripcion, categoria, cantidad,
    unidad, costo_unitario, proveedor, ubicacion,
    responsable, metodo_pago_id, observaciones
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE inventario SET
        nombre_producto=$1, descripcion=$2, categoria=$3, cantidad=$4,
        unidad=$5, costo_unitario=$6, proveedor=$7, ubicacion=$8,
        responsable=$9, metodo_pago_id=$10, observaciones=$11,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id=$12 RETURNING *;
    `, [nombre_producto, descripcion, categoria, cantidad, unidad, costo_unitario, proveedor, ubicacion, responsable, metodo_pago_id, observaciones, id]);

    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar
exports.eliminarInventario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM inventario WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
