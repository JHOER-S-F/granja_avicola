// backend/middleware/authorizeRoles.js
const authorizeRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
      if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' });
      }
      next();
    };
  };
  
  module.exports = authorizeRoles;
  