const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors()); // Esto permite que React se conecte a tu backend

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '030602',
    database: 'Proyecto_Balines_Mojados'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos');
});

// Ruta para obtener las reservas
app.get('/api/reservas', (req, res) => {
    const sql = 'SELECT * FROM Reserva';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor iniciado en el puerto 5000');
});
