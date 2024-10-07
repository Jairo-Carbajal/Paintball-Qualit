drop database if  exists Proyecto_Balines_Mojados;
CREATE DATABASE Proyecto_Balines_Mojados;
USE Proyecto_Balines_Mojados;



	-- Tabla Zona
	CREATE TABLE IF NOT EXISTS Zona (
		ZonaID INT AUTO_INCREMENT PRIMARY KEY,
		Ubicación VARCHAR(30),
		NombreZona VARCHAR(30)
	);

	-- Tabla Sucursal
	CREATE TABLE IF NOT EXISTS Sucursal (
		SucursalID INT AUTO_INCREMENT PRIMARY KEY,
		ZonaID INT(11),
		Nombre VARCHAR(30),
		Dirección VARCHAR(30),
		Telefono VARCHAR(30),
		FOREIGN KEY (ZonaID) REFERENCES Zona(ZonaID)
	);
	CREATE TABLE IF NOT EXISTS Cliente (
		ClienteID INT(11) PRIMARY KEY AUTO_INCREMENT,
		SucursalID INT(11),
        Nombre VARCHAR(30),
		Email VARCHAR(30),
		FechaRegistro DATE,
		FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)

	);
    
	-- Tabla Empleado (actualizada con roles específicos)
	CREATE TABLE IF NOT EXISTS Empleado (
		EmpleadoID INT(11) PRIMARY KEY AUTO_INCREMENT,
		SucursalID INT(11),
		Nombre VARCHAR(30),
		Rol ENUM('Empleado', 'Administrador'),
		Email VARCHAR(30),
		Contraseña VARCHAR(30),
		FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
	);

	-- Tabla Pista
CREATE TABLE IF NOT EXISTS Pista (
    PistaID INT AUTO_INCREMENT PRIMARY KEY,
    SucursalID INT(11),
    Nombre ENUM('PH1', 'PS1', 'PH2'),
    PrecioPorHora decimal(10.2),
    FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
);


	-- Tabla Reserva
	CREATE TABLE IF NOT EXISTS Reserva (
		ReservaID INT(11) PRIMARY KEY AUTO_INCREMENT,
		PistaID INT(11),
		ClienteID INT(11),
		EmpleadoID INT(11),	
        SucursalID INT(11),
		Estado ENUM('Confirmada', 'Completada', 'Cancelada', 'No-show'),
		FechaReserva DATE,
		HoraInicio Time,
		HoraFin Time,
		NumeroPersonas INT(11),
		FOREIGN KEY (PistaID) REFERENCES Pista(PistaID),
		FOREIGN KEY (ClienteID) REFERENCES Cliente(ClienteID),
		FOREIGN KEY (EmpleadoID) REFERENCES Empleado(EmpleadoID),
        FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
	);

	-- Tabla FacturaReserva
	CREATE TABLE IF NOT EXISTS FacturaReserva (
		FacturaReservaID INT(11) PRIMARY KEY AUTO_INCREMENT,
		ReservaID INT(11),
		SucursalID INT(11),
		Estado VARCHAR(30),
		MontoTotal VARCHAR(30),
		MetodoPago VARCHAR(30),
		FechaEmision DATE,
		FOREIGN KEY (ReservaID) REFERENCES Reserva(ReservaID),
		FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
	);

	-- Tabla RegistroAsistencia
	CREATE TABLE IF NOT EXISTS RegistroAsistencia (
		AsistenciaID INT AUTO_INCREMENT PRIMARY KEY,
		EmpleadoID INT(11),
		Fecha DATE,
        Estado enum('Presente','Ausente','Tarde','Justificado','SinRegistrar'),
        SucursalID int,
		foreign key (SucursalID) references Sucursal(SucursalID),
		FOREIGN KEY (EmpleadoID) REFERENCES Empleado(EmpleadoID)
	);

	-- Tabla FacturaBala
	CREATE TABLE IF NOT EXISTS FacturaBala (
		FacturaBalaID INT AUTO_INCREMENT PRIMARY KEY,
		SucursalID INT(11),
		Estado VARCHAR(30),
		MontoTotal VARCHAR(30),
		FechaEmisión DATE,
		DescuentoAplicado VARCHAR(30),
		FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
	);

	-- Tabla DescuentoAutomático
	CREATE TABLE IF NOT EXISTS DescuentoAutomático (
		DescuentoID INT(11) PRIMARY KEY AUTO_INCREMENT,
		Umbral VARCHAR(30),
		Tipo VARCHAR(30),
		Valor VARCHAR(30)
	);

	-- Tabla PaqueteBala
	CREATE TABLE IF NOT EXISTS PaqueteBala (
		PaqueteBalaID INT(11) PRIMARY KEY AUTO_INCREMENT,
		DescuentoID INT(11),
		Nombre VARCHAR(30),
		Precio VARCHAR(30),
		CantidadBalas INT(11),
		FOREIGN KEY (DescuentoID) REFERENCES DescuentoAutomático(DescuentoID)
	);

	-- Tabla EmailMarketing
	CREATE TABLE IF NOT EXISTS EmailMarketing (
		CampaniaID INT(11) PRIMARY KEY AUTO_INCREMENT,
		NombreCampania VARCHAR(30),
		FechaCreación DATE,
		FechaEnvio DATE,
		Asunto VARCHAR(30)
	);



INSERT INTO Zona (Ubicación, NombreZona) VALUES
('Centro', 'Zona A'),
('Norte', 'Zona B');

INSERT INTO Sucursal (ZonaID, Nombre, Dirección, Telefono) VALUES
(1, 'Sucursal Central', 'Calle Principal 123', '555-1234'),
(2, 'Sucursal Norte', 'Avenida Norte 456', '555-5678');

INSERT INTO Cliente (SucursalID, Nombre, Email, FechaRegistro) VALUES
(1, 'Juan Pérez1', 'juan.perez@example.com', '2024-08-20'),
(1, 'María López1', 'maria.lopez@example.com', '2024-08-21'),
(1, 'Carlos García1', 'carlos.garcia@example.com', '2024-08-22');


INSERT INTO Cliente (SucursalID, Nombre, Email, FechaRegistro) VALUES
(2, 'Juan Pérez2', 'juan.perez@example.com', '2024-08-20'),
(2, 'María López2', 'maria.lopez@example.com', '2024-08-21'),
(2, 'Carlos García2', 'carlos.garcia@example.com', '2024-08-22');

INSERT INTO Empleado (SucursalID, Nombre, Rol, Email, Contraseña) VALUES
(1, 'Ana Gómez', 'Empleado', 'emp@gmail', 'emp123'),
(1, 'Luis Martínez', 'Administrador', 'admin@gmail', 'admin123'),
(2, 'Juan Gonsalez', 'Empleado', 'emp2@gmail', 'emp123'),
(2, 'Marta Saenz', 'Administrador', 'admin2@gmail', 'admin123');

INSERT INTO Pista (SucursalID, Nombre, PrecioPorHora) VALUES
(1, 'PH1', 15000),
(1, 'PS1', 10000),
(1, 'PH2', 18000),
(2, 'PH1', 20000),
(2, 'PS1', 15000),
(2, 'PH2', 23000);

-- Scurusal 1
-- Reservas para el 1 de septiembre de 2024
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas) VALUES
(1, 1, 1, 1, 'Confirmada', '2024-09-01', '10:00:00', '12:00:00', 5),
(2, 2, 2, 1, 'Confirmada', '2024-09-01', '13:00:00', '15:00:00', 4);

-- Reservas durante la misma semana (1/9/2024 a 7/9/2024)
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas) VALUES
(1, 3, 1, 1, 'Confirmada', '2024-09-03', '09:00:00', '01:00:00', 6),
(2, 1, 2, 1, 'Confirmada', '2024-09-06', '14:00:00', '16:00:00', 3);

-- Reservas para el mismo mes (septiembre de 2024)
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas) VALUES
(3, 2, 1, 1, 'Confirmada', '2024-09-15', '11:00:00', '13:00:00', 7),
(1, 3, 2, 1, 'Confirmada', '2024-09-20', '12:00:00', '14:00:00', 5);

-- Sucurasal 2
-- Reservas para el 1 de septiembre de 2024
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas) VALUES
(1, 4, 1, 2, 'Confirmada', '2024-09-01', '10:00', '12:00:00', 5),
(2, 5, 2, 2, 'Confirmada', '2024-09-01', '13:00', '15:00:00', 4);

-- Reservas durante la misma semana (1/9/2024 a 7/9/2024)
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas) VALUES
(1, 6, 1, 2, 'Confirmada', '2024-09-03', '09:00:00', '01:00:00', 6),
(2, 4, 2, 2, 'Confirmada', '2024-09-06', '14:00:00', '16:00:00', 3);

-- Reservas para el mismo mes (septiembre de 2024)
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, SucursalID, Estado, FechaReserva, HoraInicio, HoraFin, NumeroPersonas) VALUES
(3, 5, 1, 2, 'Confirmada', '2024-09-15', '11:00:00', '13:00:00', 7),
(1, 4, 2, 2, 'Confirmada', '2024-09-20', '12:00:00', '14:00:00', 5);

INSERT INTO FacturaReserva (ReservaID, SucursalID, Estado, MontoTotal, MetodoPago, FechaEmision) VALUES
(1, 1, 'Pagada', '100', 'Tarjeta', '2024-09-01'),
(2, 2, 'Pendiente', '120', 'Efectivo', '2024-09-01');

INSERT INTO RegistroAsistencia (EmpleadoID, Fecha, Estado, SucursalID)
VALUES
  (1, CURDATE(), 'Presente', 1),
  (2, CURDATE(), 'Ausente', 1),
  (3, CURDATE(), 'Presente', 2),
  (4, CURDATE(), 'Ausente', 2);	
  
INSERT INTO FacturaBala (SucursalID, Estado, MontoTotal, FechaEmisión, DescuentoAplicado) VALUES
(1, 'Pagada', '200', '2024-09-01', '10%'),
(2, 'Pendiente', '250', '2024-09-02', '5%');

INSERT INTO DescuentoAutomático (Umbral, Tipo, Valor) VALUES
('10', 'Porcentaje', '10'),
('20', 'Porcentaje', '15');

INSERT INTO PaqueteBala (DescuentoID, Nombre, Precio, CantidadBalas) VALUES
(1, 'Paquete A', '50', 100),
(2, 'Paquete B', '75', 200);

INSERT INTO EmailMarketing (NombreCampania, FechaCreación, FechaEnvio, Asunto) VALUES
('Campaña Septiembre', '2024-09-01', '2024-09-02', 'Descuentos en septiembre'),
('Campaña Octubre', '2024-09-15', '2024-09-16', 'Nuevas llegadas');
