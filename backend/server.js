const express = require('express');
const cors = require('cors');
const path = require('path');
const client = require('./config/db');
const authRoutes = require('./routers/authRoutes');
const empleado = require('./routers/empleadoRoutes')
const admin = require('./routers/adminRoutes');
const { console } = require('inspector');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Ruta de autenticación 
app.use('/api/auth', authRoutes);
//Ruta de empleado
app.use('/api/empl', empleado);
//ruta de admin
app.use('/api/admi', admin);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../frontend/dist')));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

client.connect()
  .then(() => {
    console.log('Conectado a PostgreSQL');
  })
  .catch(err => {
    console.error('Error de conexión a PostgreSQL:', err.message);
  });

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
