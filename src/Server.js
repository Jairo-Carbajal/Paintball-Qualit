const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors');

const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

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
    const sql = `
        SELECT Reserva.ReservaID, Cliente.Nombre AS NombreCliente, Reserva.FechaReserva, Reserva.FechaHoraInicio 
        FROM Reserva 
        INNER JOIN Cliente ON Reserva.ClienteID = Cliente.ClienteID
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error executing query');
        }
        res.json(result);
    });
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor iniciado en el puerto 5000');
});
