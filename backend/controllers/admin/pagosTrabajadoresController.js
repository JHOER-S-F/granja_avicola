const db = require('../../config/db');

// Obtener todos los pagos con nombre del trabajador, cargo y método de pago
exports.getAllPagos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT pt.*, t.nombre AS nombre_trabajador, t.cargo, mp.nombre AS metodo_pago
      FROM pagos_trabajadores pt
      JOIN trabajadores t ON pt.trabajador_id = t.id
      JOIN metodos_pago mp ON pt.metodo_pago_id = mp.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener pago por ID
exports.getPagoById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`
      SELECT pt.*, t.nombre AS nombre_trabajador, t.cargo, mp.nombre AS metodo_pago
      FROM pagos_trabajadores pt
      JOIN trabajadores t ON pt.trabajador_id = t.id
      JOIN metodos_pago mp ON pt.metodo_pago_id = mp.id
      WHERE pt.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo pago
exports.createPago = async (req, res) => {
  const { trabajador_id, fecha_pago, monto, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO pagos_trabajadores (trabajador_id, fecha_pago, monto, metodo_pago_id, observaciones)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [trabajador_id, fecha_pago, monto, metodo_pago_id, observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar pago
exports.updatePago = async (req, res) => {
  const id = req.params.id;
  const { trabajador_id, fecha_pago, monto, metodo_pago_id, observaciones } = req.body;
  try {
    const result = await db.query(`
      UPDATE pagos_trabajadores
      SET trabajador_id = $1, fecha_pago = $2, monto = $3, metodo_pago_id = $4, observaciones = $5
      WHERE id = $6
      RETURNING *
    `, [trabajador_id, fecha_pago, monto, metodo_pago_id, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar pago
exports.deletePago = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`DELETE FROM pagos_trabajadores WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json({ mensaje: 'Pago eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
