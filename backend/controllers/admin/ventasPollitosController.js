const db = require('../../config/db');

//Obtener todas las ventas de pollitos con info de métodos de pago y pollitos
exports.getAllVentas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.id AS venta_id,
        v.fecha_venta,
        v.cantidad_vendida,
        v.precio_unitario,
        v.cliente,
        v.observaciones,
        m.id AS metodo_pago_id,
        m.nombre AS metodo_pago,
        p.id AS pollito_id,
        p.fecha_nacimiento,
        p.cantidad_vivos
      FROM ventas_pollitos v
      LEFT JOIN metodos_pago m ON v.metodo_pago_id = m.id
      LEFT JOIN pollitos p ON v.pollito_id = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una venta por ID
exports.getVentaById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`
      SELECT 
        v.id AS venta_id,
        v.fecha_venta,
        v.cantidad_vendida,
        v.precio_unitario,
        v.cliente,
        v.observaciones,
        m.id AS metodo_pago_id,
        m.nombre AS metodo_pago,
        p.id AS pollito_id,
        p.fecha_nacimiento,
        p.cantidad_vivos
      FROM ventas_pollitos v
      LEFT JOIN metodos_pago m ON v.metodo_pago_id = m.id
      LEFT JOIN pollitos p ON v.pollito_id = p.id
      WHERE v.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva venta
exports.createVenta = async (req, res) => {
  const { pollito_id, fecha_venta, cantidad_vendida, precio_unitario, cliente, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO ventas_pollitos (pollito_id, fecha_venta, cantidad_vendida, precio_unitario, cliente, metodo_pago_id, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [pollito_id, fecha_venta, cantidad_vendida, precio_unitario, cliente, metodo_pago_id, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar venta
exports.updateVenta = async (req, res) => {
  const id = req.params.id;
  const { pollito_id, fecha_venta, cantidad_vendida, precio_unitario, cliente, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE ventas_pollitos
      SET pollito_id = $1, fecha_venta = $2, cantidad_vendida = $3,
          precio_unitario = $4, cliente = $5, metodo_pago_id = $6, observaciones = $7
      WHERE id = $8
      RETURNING *
    `, [pollito_id, fecha_venta, cantidad_vendida, precio_unitario, cliente, metodo_pago_id, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar venta
exports.deleteVenta = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`DELETE FROM ventas_pollitos WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.json({ mensaje: "Venta eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
