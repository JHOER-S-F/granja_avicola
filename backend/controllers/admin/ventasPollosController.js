const db = require('../../config/db');

// Obtener todas las ventas con datos relacionados
exports.obtenerTodas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT vp.*, 
             pp.nombre AS nombre_pollo,
             pp.cantidad AS cantidad_pollo,
             mp.nombre AS metodo_pago_nombre
      FROM ventas_pollos vp
      JOIN pollos_produccion pp ON vp.pollo_id = pp.id
      JOIN metodos_pago mp ON vp.metodo_pago_id = mp.id
      ORDER BY vp.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una venta por ID
exports.obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT vp.*, 
             pp.nombre AS nombre_pollo,
             pp.cantidad AS cantidad_pollo,
             mp.nombre AS metodo_pago_nombre
      FROM ventas_pollos vp
      JOIN pollos_produccion pp ON vp.pollo_id = pp.id
      JOIN metodos_pago mp ON vp.metodo_pago_id = mp.id
      WHERE vp.id = $1
    `, [id]);

    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Venta no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva venta
exports.crear = async (req, res) => {
  const { pollo_id, fecha_venta, peso_kg, precio_total, cliente_nombre, cliente_contacto, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO ventas_pollos 
        (pollo_id, fecha_venta, peso_kg, precio_total, cliente_nombre, cliente_contacto, metodo_pago_id, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [pollo_id, fecha_venta, peso_kg, precio_total, cliente_nombre, cliente_contacto, metodo_pago_id, observaciones]);

    const datosRelacionados = await db.query(`
      SELECT pp.nombre AS nombre_pollo, pp.cantidad AS cantidad_pollo, mp.nombre AS metodo_pago_nombre
      FROM pollos_produccion pp
      JOIN metodos_pago mp ON mp.id = $1
      WHERE pp.id = $2
    `, [metodo_pago_id, pollo_id]);

    res.status(201).json({
      ...result.rows[0],
      ...datosRelacionados.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar venta
exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { pollo_id, fecha_venta, peso_kg, precio_total, cliente_nombre, cliente_contacto, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE ventas_pollos
      SET pollo_id = $1, fecha_venta = $2, peso_kg = $3, precio_total = $4,
          cliente_nombre = $5, cliente_contacto = $6, metodo_pago_id = $7, observaciones = $8
      WHERE id = $9 RETURNING *
    `, [pollo_id, fecha_venta, peso_kg, precio_total, cliente_nombre, cliente_contacto, metodo_pago_id, observaciones, id]);

    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Venta no encontrada' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar venta
exports.eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM ventas_pollos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Venta no encontrada' });
    res.json({ mensaje: 'Venta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
