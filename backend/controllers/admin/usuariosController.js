
const db = require('../../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const result = await db.query('SELECT id, nombre_usuario, rol, observaciones FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener usuario por ID
exports.getUsuarioById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(
      'SELECT id, nombre_usuario, rol, observaciones FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear usuario nuevo
exports.createUsuario = async (req, res) => {
  const { nombre_usuario, contraseña, rol, observaciones } = req.body;
  try {
    const hash = await bcrypt.hash(contraseña, 10);
    const result = await db.query(`
      INSERT INTO usuarios (nombre_usuario, contraseña, rol, observaciones)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre_usuario, rol, observaciones
    `, [nombre_usuario, hash, rol || 'empleado', observaciones]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Nombre de usuario ya existe' });
    res.status(500).json({ error: err.message });
  }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const id = req.params.id;
  const { nombre_usuario, contraseña, rol, observaciones } = req.body;
  try {
    const hash = contraseña ? await bcrypt.hash(contraseña, 10) : null;
    const result = await db.query(`
      UPDATE usuarios
      SET nombre_usuario = COALESCE($1, nombre_usuario),
          contraseña = COALESCE($2, contraseña),
          rol = COALESCE($3, rol),
          observaciones = COALESCE($4, observaciones)
      WHERE id = $5
      RETURNING id, nombre_usuario, rol, observaciones
    `, [nombre_usuario, hash, rol, observaciones, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
