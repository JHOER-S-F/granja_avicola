const db = require('../../config/db');

// Obtener todas las compras esenciales con nombre del método de pago
exports.getAllCompras = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT ic.*, mp.nombre AS metodo_pago_nombre
      FROM inversion_compras ic
      LEFT JOIN metodos_pago mp ON ic.metodo_pago_id = mp.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una compra por ID
exports.getCompraById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`
      SELECT ic.*, mp.nombre AS metodo_pago_nombre
      FROM inversion_compras ic
      LEFT JOIN metodos_pago mp ON ic.metodo_pago_id = mp.id
      WHERE ic.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Compra no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva compra
exports.createCompra = async (req, res) => {
  const { nombre_producto, cantidad, unidad, costo_unitario, fecha_compra, proveedor, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO inversion_compras 
      (nombre_producto, cantidad, unidad, costo_unitario, fecha_compra, proveedor, metodo_pago_id, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [nombre_producto, cantidad, unidad, costo_unitario, fecha_compra, proveedor, metodo_pago_id, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar compra
exports.updateCompra = async (req, res) => {
  const id = req.params.id;
  const { nombre_producto, cantidad, unidad, costo_unitario, fecha_compra, proveedor, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE inversion_compras
      SET nombre_producto = $1, cantidad = $2, unidad = $3, costo_unitario = $4, 
          fecha_compra = $5, proveedor = $6, metodo_pago_id = $7, observaciones = $8
      WHERE id = $9
      RETURNING *
    `, [nombre_producto, cantidad, unidad, costo_unitario, fecha_compra, proveedor, metodo_pago_id, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Compra no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


