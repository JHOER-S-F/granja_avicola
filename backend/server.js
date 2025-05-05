const express = require('express');
const cors = require('cors');
const path = require('path');
const client = require('./config/db');
const authRoutes = require('./routers/authRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando');
});

// ✅ Rutas de autenticación correctamente usadas
app.use('/api/auth', authRoutes);

app.get('/api/hola', (req, res) => {
    res.json({ mensaje: '¡Hola desde el backend!' });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../frontend/dist')));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

client.connect()
  .then(() => {
    console.log('🟢 Conectado a PostgreSQL');
  })
  .catch(err => {
    console.error('🔴 Error de conexión a PostgreSQL:', err.message);
  });

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
