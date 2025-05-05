// backend/middleware/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'jhoer_s_f';
  return jwt.sign(
    {
      id: user.id,
      rol: user.rol,
      nombre_usuario: user.nombre_usuario,
    },
    secret,
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
