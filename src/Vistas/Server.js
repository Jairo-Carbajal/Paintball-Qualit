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
        SELECT Reserva.ReservaID, Pista.PistaID, Reserva.EmpleadoID, Cliente.ClienteID, Cliente.Nombre AS NombreCliente, Cliente.Email, Cliente.FechaRegistro, Reserva.FechaReserva, Reserva.HoraInicio, Pista.PrecioPorHora, Reserva.Estado, Pista.Nombre, Pista.SucursalID, Pista.Nombre, Reserva.NúmeroPersonas
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


app.post('/clientes', (req, res) => {
  const { Nombre, Email, FechaRegistro } = req.body;
  const query = 'INSERT INTO Cliente (Nombre, Email, FechaRegistro) VALUES (?, ?, ?)';
  
  db.query(query, [Nombre, Email, FechaRegistro], (error, results) => {
    if (error) {
      console.error('Error inserting cliente:', error);
      return res.status(500).json({ error: 'Error inserting cliente' });
    }
    res.status(201).json({ insertId: results.insertId });
  });
});

// Ruta para insertar una nueva reserva
app.post('/crearreservas', (req, res) => {
  const { ClienteID, EmpleadoID, PistaID, Estado, FechaReserva, HoraInicio, HoraFin, NúmeroPersonas } = req.body;

  // Convertir las fechas a formato MySQL
  const formattedHoraInicio = new Date(HoraInicio).toISOString().slice(0, 19).replace('T', ' ');
  const formattedHoraFin = new Date(HoraFin).toISOString().slice(0, 19).replace('T', ' ');

  const query = `
    INSERT INTO Reserva (ClienteID, EmpleadoID, PistaID, Estado, FechaReserva, HoraInicio, HoraFin, NúmeroPersonas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [ClienteID, EmpleadoID, PistaID, Estado, FechaReserva, formattedHoraInicio, formattedHoraFin, NúmeroPersonas], (error, results) => {
    if (error) {
      console.error('Error inserting reserva:', error);
      return res.status(500).json({ error: 'Error inserting reserva' });
    }
    res.status(201).json({ insertId: results.insertId });
  });
});




// Ruta para el inicio de sesión
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const sql = "SELECT * FROM Empleado WHERE Email = ? AND Contraseña = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      return res.status(500).json({ error: "Error al iniciar sesión" });
    }

    if (result.length > 0) {
      const user = result[0]; 
      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user.EmpleadoID,
          nombre: user.Nombre,
          rol: user.Rol,
        },
      });
    } else {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }
  });
});

app.get('/reserva/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `
      SELECT 
          Reserva.FechaReserva, Reserva.HoraInicio, Reserva.HoraFin, Reserva.NúmeroPersonas, Reserva.Estado,
          Reserva.ClienteID, Cliente.Nombre AS ClienteNombre, Cliente.Email AS ClienteEmail,
          Pista.PistaID,Pista.Nombre AS PistaNombre, Pista.PrecioPorHora, Reserva.ReservaID
      FROM Reserva
      JOIN Cliente ON Reserva.ClienteID = Cliente.ClienteID
      JOIN Pista ON Reserva.PistaID = Pista.PistaID
      WHERE Reserva.ReservaID = ?;

  `;

  try {
      const [result] = await db.promise().query(sql, [id]); 
      if (result.length > 0) {
          res.json(result[0]);
      } else {
          res.status(404).json({ message: "Reservation not found" });
      }
  } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ message: "Server error" });
  }
});



app.put('/actualizarcliente/:id', (req, res) => {
  const { nombreCliente, emailCliente } = req.body;
  const { id } = req.params; // Cambiar aquí
  const sql = `
    UPDATE Cliente
    SET Nombre = ?, Email = ?
    WHERE ClienteID = ?;
  `;
  db.query(sql, [nombreCliente, emailCliente, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar el cliente:", err);
      return res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  });
});


// Update Pista
app.put('/actualizarpista/:id', (req, res) => {
  const { precioPorHora,pistaNombre } = req.body;
  const { idPista } = req.params;
  
  const sql = `
  update Pista
  set PrecioPorHora = ?, Nombre = ?
  where PistaID = ?;
  `;
  try {
    db.query(sql, [precioPorHora,pistaNombre, idPista], (err, result) => {
      if (err) {
        console.error("Error al actualizar el cliente:", err);
        return res.status(500).json({ error: "Error al actualizar el cliente" });
      }
      res.status(200).json({ message: "Cliente actualizado exitosamente" });
    });
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
});

app.put('/actualizarreservas/:id', (req, res) => {
  const { fechaReserva, horaInicio, horaFin, estado, numeroPersonas } = req.body;
  const { id } = req.params;
  const sql = `
    UPDATE Reserva
    SET FechaReserva = ?, HoraInicio = ?, HoraFin = ?, Estado = ?, NúmeroPersonas = ?
    WHERE ReservaID = ?;
  `;
  db.query(sql, [fechaReserva, horaInicio, horaFin, estado, numeroPersonas, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la reserva:", err);
      return res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
    res.status(200).json({ message: 'Reserva actualizada correctamente' });
  });
});





// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor iniciado en el puerto 5000");
});
