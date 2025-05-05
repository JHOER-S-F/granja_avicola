// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const generateToken = require('../middleware/generateToken');

// Registrar nuevo usuario
const register = async (req, res) => {
  const { nombre_usuario, contraseña, rol = 'empleado' } = req.body;

  try {
    const existingUser = await userModel.getUserByUsername(nombre_usuario);
    if (existingUser) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const newUser = await userModel.createUser(nombre_usuario, hashedPassword, rol);
    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;

  try {
    const user = await userModel.getUserByUsername(nombre_usuario);
    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Cerrar sesión (solo respuesta simbólica)
const logout = (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};

module.exports = {
  register,
  login,
  logout,
};

