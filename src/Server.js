const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Middleware para manejar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "030602",
  database: "Proyecto_Balines_Mojados",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conectado a la base de datos");
});

// Ruta para obtener todas las reservas
app.get("/api/reservas", (req, res) => {
  const sql = `
        SELECT Reserva.ReservaID, Cliente.Nombre AS NombreCliente, Reserva.FechaReserva, Reserva.FechaHoraInicio, Pista.PrecioPorHora, Pista.Nombre, Reserva.NúmeroPersonas
        FROM Reserva 
        INNER JOIN Cliente ON Reserva.ClienteID = Cliente.ClienteID
        INNER JOIN Pista ON Reserva.PistaID = Pista.PistaID

        ORDER BY ReservaID DESC
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error executing query");
    }
    res.json(result);
  });
});



app.post('/api/reservas', (req, res) => {
    const { fecha, horaInicio, pistaID, nombreCliente, emailCliente, numeroPersonas } = req.body;

    if (!fecha || !horaInicio || !pistaID || !nombreCliente || !emailCliente) {
        return res.status(400).json({ error: 'Todos los campos son necesarios' });
    }

    // Primero, inserta el cliente si no existe
    db.query('INSERT INTO Cliente (Nombre, Email, FechaRegistro) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ClienteID=LAST_INSERT_ID(ClienteID)', [nombreCliente, emailCliente, new Date()], (err, result) => {
        if (err) {
            console.error('Error inserting cliente:', err);
            return res.status(500).json({ error: 'Error al crear el cliente' });
        }
        const clienteID = result.insertId;

        // Finalmente, inserta la reserva
        const sql = `
            INSERT INTO Reserva (FechaReserva, FechaHoraInicio, FechaHoraFin, NúmeroPersonas, PistaID, ClienteID, EmpleadoID, Estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [fecha, horaInicio, null, numeroPersonas, pistaID, clienteID, 1, 'Confirmada'], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Error al crear la reserva' });
            }
            res.status(201).json({ message: 'Reserva creada exitosamente' });
        });
    });
});

// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor iniciado en el puerto 5000");
});
