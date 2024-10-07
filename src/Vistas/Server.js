const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require('nodemailer');

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

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




app.get("/api/sucursales", (req, res) => {
  const sql = "SELECT SucursalID, Nombre FROM Sucursal"; 

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sucursales" });
    }
    res.json(results);
  });
});




app.delete('/api/eliminar/reservas/:id', (req, res) => {
  const reservaID = req.params.id;

  const deleteReservaQuery = 'DELETE FROM Reserva WHERE ReservaID = ?';

  db.query(deleteReservaQuery, [reservaID], (err, result) => {
      if (err) {
          console.error('Error eliminando la reserva:', err);
          return res.status(500).json({ error: 'Error al eliminar la reserva' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      res.status(200).json({ message: 'Reserva eliminada correctamente' });
  });
});




app.get("/api/reservas", (req, res) => {
  const sucursalID = req.query.sucursalID;

  if (!sucursalID) {
    return res.status(400).json({ error: "Sucursal ID es requerido" });
  }

  const query = `
    SELECT r.ReservaID, c.Nombre as NombreCliente, r.FechaReserva, r.HoraInicio as HoraInicio, r.NumeroPersonas, p.Nombre as NombrePista, p.precioPorHora, r.Estado
    FROM Reserva r
    JOIN Cliente c ON r.ClienteID = c.ClienteID
    JOIN Pista p ON r.PistaID = p.PistaID
    WHERE r.SucursalID = ? 
    ORDER BY r.FechaReserva asc;
  `;

  db.query(query, [sucursalID], (error, results) => {
    if (error) {
      console.error("Error al obtener las reservas:", error);
      return res.status(500).json({ error: "Error al obtener las reservas" });
    }
    res.json(results);
  });
});





app.post('/clientes', (req, res) => {
  const { Nombre, Email, FechaRegistro, SucursalID } = req.body; 
  const query = 'INSERT INTO Cliente (Nombre, Email, FechaRegistro, SucursalID) VALUES (?, ?, ?, ?)';
  
  db.query(query, [Nombre, Email, FechaRegistro, SucursalID], (error, results) => {
    if (error) {
      console.error('Error inserting cliente:', error);
      return res.status(500).json({ error: 'Error inserting cliente' });
    }
    res.status(201).json({ insertId: results.insertId });
  });
});



app.get('/api/pistas', async (req, res) => {
  const sucursalID = req.query.sucursalID; 
  const sql = `
      SELECT 
      PistaID, Nombre, PrecioPorHora
      FROM Pista
      WHERE SucursalID = ?;
  `;

  try {
      const [result] = await db.promise().query(sql, [sucursalID]); 
      res.json(result);
  } catch (error) {
      console.error("Error fetching pistas:", error);
      res.status(500).json({ message: "Server error" });
  }
});




app.post('/crearreservas', (req, res) => {
  const { ClienteID, EmpleadoID, PistaID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas } = req.body;

  const formattedHoraInicio = new Date(HoraInicio).toISOString().slice(0, 19).replace('T', ' ');
  const formattedHoraFin = new Date(HoraFin).toISOString().slice(0, 19).replace('T', ' ');

  const queryPrecio = 'SELECT PrecioPorHora FROM Pista WHERE PistaID = ?';
  
  db.query(queryPrecio, [PistaID], (error, results) => {
    if (error) {
      console.error('Error fetching PrecioPorHora:', error);
      return res.status(500).json({ error: 'Error fetching PrecioPorHora' });
    }
    
    const PrecioPorHora = results[0].PrecioPorHora;

    const query = `
      INSERT INTO Reserva (ClienteID, EmpleadoID, PistaID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [ClienteID, EmpleadoID, PistaID, SucursalID, Estado, FechaReserva, formattedHoraInicio, formattedHoraFin, NumeroPersonas], (error, results) => {
      if (error) {
        console.error('Error inserting reserva:', error);
        return res.status(500).json({ error: 'Error inserting reserva' });
      }
      res.status(201).json({ insertId: results.insertId, PrecioPorHora: PrecioPorHora });
    });
  });
});




app.post("/api/login", (req, res) => {
  const { email, password, sucursal } = req.body;

  if (!email || !password || !sucursal) {
    return res.status(400).json({ error: "Email, contraseña y sucursal son requeridos" });
  }

  const sql = "SELECT * FROM Empleado WHERE Email = ? AND Contraseña = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      return res.status(500).json({ error: "Error al iniciar sesión" });
    }

    if (result.length > 0) {
      const user = result[0]; 

      if (user.SucursalID !== parseInt(sucursal)) {
        return res.status(403).json({ error: "No tienes acceso a esta sucursal." });
      }

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


app.get('/api/empleado/:empleadoID/rol', (req, res) => {
  const { empleadoID } = req.params;

  const query = 'SELECT Rol FROM Empleado WHERE EmpleadoID = ?';
  db.query(query, [empleadoID], (error, results) => {
    if (error) {
      console.error('Error al obtener el rol del empleado:', error);
      return res.status(500).json({ error: 'Error al obtener el rol del empleado' });
    }

    if (results.length > 0) {
      const rol = results[0].Rol;
      res.json({ rol });
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  });
});



app.get('/reserva/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `
      SELECT 
          Reserva.FechaReserva, Reserva.HoraInicio, Reserva.HoraFin, Reserva.NumeroPersonas, Reserva.Estado,
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
  const { id } = req.params; 
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





app.put('/actualizarpista/:id', (req, res) => {
  const { precioPorHora, pistaNombre } = req.body;
  const { id } = req.params; 

  const sql = `
  UPDATE Pista
  SET PrecioPorHora = ?, Nombre = ?
  WHERE PistaID = ? AND SucursalID = ?;  
  `;

  const sucursalID = req.body.sucursalID; 

  try {
      db.query(sql, [precioPorHora, pistaNombre, id, sucursalID], (err, result) => {
          if (err) {
              console.error("Error al actualizar la pista:", err);
              return res.status(500).json({ error: "Error al actualizar la pista" });
          }
          res.status(200).json({ message: "Pista actualizada exitosamente" });
      });
  } catch (error) {
      console.error("Error al actualizar la pista:", error);
      res.status(500).json({ error: "Error al actualizar la pista" });
  }
});





app.put('/actualizarreservas/:id', (req, res) => {
  const { fechaReserva, horaInicio, horaFin, estado, numeroPersonas } = req.body;
  const { id } = req.params;
  const sql = `
    UPDATE Reserva
    SET FechaReserva = ?, HoraInicio = ?, HoraFin = ?, Estado = ?, NumeroPersonas = ?
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






app.get("/api/asistencias/empleados", (req, res) => {
  const sucursalID = req.query.sucursalID; 

  if (!sucursalID) {
    return res.status(400).send("SucursalID es requerido");
  }

  const sql = `
    SELECT Empleado.EmpleadoID, Empleado.Nombre, Empleado.Email, Empleado.Rol, a.Fecha, a.Estado
    FROM Empleado 
    LEFT JOIN RegistroAsistencia a ON Empleado.EmpleadoID = a.EmpleadoID
    WHERE Empleado.SucursalID = ?;
  `;

  db.query(sql, [sucursalID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error ejecutando la consulta");
    }
    res.json(result);
  });
});




app.put("/api/asistencias/:empleadoID", (req, res) => {
  const { empleadoID } = req.params;
  const { Estado } = req.body;

  const sql = `
    UPDATE RegistroAsistencia
    SET Estado = ?
    WHERE EmpleadoID = ?
  `;

  db.query(sql, [Estado, empleadoID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error executing query");
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).send("Empleado no encontrado");
    }

    res.send("Estado actualizado correctamente");
  });
});




app.post("/api/crear/empleados", (req, res) => {
  const { SucursalID, Nombre, Rol, Email, Contraseña } = req.body;

  const sqlEmpleado = `
    INSERT INTO Empleado (SucursalID, Nombre, Rol, Email, Contraseña)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sqlEmpleado, [SucursalID, Nombre, Rol, Email, Contraseña], (err, result) => {
    if (err) {
      console.error("Error al insertar el empleado:", err);
      return res.status(500).json({ error: "Error al insertar el empleado" });
    }

    const empleadoID = result.insertId; 

    const sqlAsistencia = `
      INSERT INTO RegistroAsistencia (EmpleadoID, Fecha, Estado)
      VALUES (?, CURDATE(), 'SinRegistrar') 
    `;

    db.query(sqlAsistencia, [empleadoID], (err) => {
      if (err) {
        console.error("Error al insertar la asistencia:", err);
        return res.status(500).json({ error: "Error al insertar la asistencia" });
      }

      res.status(201).json({ message: "Empleado y asistencia añadidos correctamente", EmpleadoID: empleadoID });
    });
  });
});




app.post('/api/enviar-emails', async (req, res) => {
  const { mensaje, asunto } = req.body; 

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'paintballet32@gmail.com', 
      pass: 'vrpacgcvszyykmsh', 
    },
    tls: {
      rejectUnauthorized: false, 
    },
  });

  db.query('SELECT Email FROM Cliente', (error, results) => {
    if (error) {
      console.error('Error al obtener correos de la base de datos:', error);
      return res.status(500).json({ error: 'Error al obtener correos de la base de datos' });
    }

    const emails = results.map(row => row.Email);
    
    const mailOptions = {
      from: 'paintballet32@gmail.com', 
      to: emails.join(','), 
      subject: asunto || 'Asunto predeterminado', 
      text: mensaje, 
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo' });
      }
      res.status(200).json({ message: 'Correo enviado a todos los clientes', info });
    });
  });
});



app.listen(5000, () => {
  console.log("Servidor iniciado en el puerto 5000");
});
