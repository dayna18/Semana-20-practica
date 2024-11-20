const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); 

// Conexión con la base de datos
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '19881617', 
    database: 'productos_db'
});

// Obtener la lista de productos
app.get('/productos', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM productos');
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar un nuevo producto
app.post('/productos', async (req, res) => {
    const { nombre, precio } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        conn.release();
        res.json({ id: result.insertId, nombre, precio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});