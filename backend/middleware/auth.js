// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Verificar si hay encabezado y si empieza con Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ||'jhoer_s_f');
    req.user = decoded; // Añade el usuario decodificado a la petición
    next(); // Continuar a la ruta protegida
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido' });
  }
};

module.exports = auth;
