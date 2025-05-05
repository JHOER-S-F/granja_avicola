const pool = require('../config/db'); // Importar la conexión a la base de datos

// Función para obtener un usuario por nombre de usuario
const getUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1', [username]);
  return result.rows[0];
};

// Función para crear un nuevo usuario
const createUser = async (username, passwordHash, rol) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nombre_usuario, contraseña, rol) VALUES ($1, $2, $3) RETURNING *',
    [username, passwordHash, rol]
  );
  return result.rows[0];
};

module.exports = {
  getUserByUsername,
  createUser,
};
