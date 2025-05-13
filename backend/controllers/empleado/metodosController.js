const pool = require('../../config/db');

// Crear método de pago
exports.crearMetodo = async (req, res) => {
    const { nombre, observaciones } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO metodos_pago (nombre, observaciones) VALUES ($1, $2) RETURNING *`,
            [nombre, observaciones]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los métodos de pago
exports.obtenerMetodos = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM metodos_pago ORDER BY id`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un método de pago por ID
exports.obtenerMetodoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM metodos_pago WHERE id = $1`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Método no encontrado' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un método de pago
exports.actualizarMetodo = async (req, res) => {
    const { id } = req.params;
    const { nombre, observaciones } = req.body;
    try {
        const result = await pool.query(
            `UPDATE metodos_pago SET nombre = $1, observaciones = $2 WHERE id = $3 RETURNING *`,
            [nombre, observaciones, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Método no encontrado' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


