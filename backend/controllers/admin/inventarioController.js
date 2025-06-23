const pool = require('../../config/db');

// ✅ Crear producto con validaciones
exports.crearInventario = async (req, res) => {
  const {
    nombre_producto, descripcion, categoria, cantidad,
    unidad, costo_unitario, proveedor, ubicacion,
    responsable, metodo_pago_id, observaciones
  } = req.body;

  const categoriasValidas = ['alimento', 'insumo', 'medicamento', 'herramienta', 'otro'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }

  if (parseFloat(cantidad) < 0 || parseFloat(costo_unitario) < 0) {
    return res.status(400).json({ error: 'Cantidad o costo unitario no puede ser negativo' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO inventario (
        nombre_producto, descripcion, categoria, cantidad,
        unidad, costo_unitario, proveedor, ubicacion,
        responsable, metodo_pago_id, observaciones
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `, [
      nombre_producto,
      descripcion,
      categoria,
      parseFloat(cantidad),
      unidad,
      parseFloat(costo_unitario),
      proveedor,
      ubicacion,
      responsable,
      metodo_pago_id ? parseInt(metodo_pago_id) : null,
      observaciones
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear inventario:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Obtener todo el inventario
exports.obtenerInventario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Obtener por ID
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

// ✅ Actualizar producto
exports.actualizarInventario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_producto, descripcion, categoria, cantidad,
    unidad, costo_unitario, proveedor, ubicacion,
    responsable, metodo_pago_id, observaciones
  } = req.body;

  const categoriasValidas = ['alimento', 'insumo', 'medicamento', 'herramienta', 'otro'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }

  try {
    const result = await pool.query(`
      UPDATE inventario SET
        nombre_producto=$1, descripcion=$2, categoria=$3, cantidad=$4,
        unidad=$5, costo_unitario=$6, proveedor=$7, ubicacion=$8,
        responsable=$9, metodo_pago_id=$10, observaciones=$11,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id=$12 RETURNING *;
    `, [
      nombre_producto,
      descripcion,
      categoria,
      parseFloat(cantidad),
      unidad,
      parseFloat(costo_unitario),
      proveedor,
      ubicacion,
      responsable,
      metodo_pago_id ? parseInt(metodo_pago_id) : null,
      observaciones,
      id
    ]);

    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Eliminar
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

// ✅ Filtrar por categoría, ubicación o responsable
exports.filtrarInventario = async (req, res) => {
  const { categoria, ubicacion, responsable } = req.query;

  let filtros = [];
  let valores = [];

  if (categoria) {
    filtros.push(`categoria = $${filtros.length + 1}`);
    valores.push(categoria);
  }

  if (ubicacion) {
    filtros.push(`ubicacion ILIKE $${filtros.length + 1}`);
    valores.push(`%${ubicacion}%`);
  }

  if (responsable) {
    filtros.push(`responsable ILIKE $${filtros.length + 1}`);
    valores.push(`%${responsable}%`);
  }

  const whereClause = filtros.length > 0 ? 'WHERE ' + filtros.join(' AND ') : '';

  try {
    const result = await pool.query(`SELECT * FROM inventario ${whereClause} ORDER BY id DESC`, valores);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Estadísticas por categoría
exports.estadisticasPorCategoria = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT categoria, COUNT(*) AS cantidad_items, SUM(valor_total) AS valor_total
      FROM inventario
      GROUP BY categoria
      ORDER BY valor_total DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
