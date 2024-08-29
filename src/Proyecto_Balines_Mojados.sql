	drop database if  exists Proyecto_Balines_Mojados;

CREATE DATABASE Proyecto_Balines_Mojados;
USE Proyecto_Balines_Mojados;

	-- Tabla Cliente
	CREATE TABLE IF NOT EXISTS Cliente (
		ClienteID INT(11) PRIMARY KEY AUTO_INCREMENT,
		Nombre VARCHAR(30),
		Email VARCHAR(30),
		FechaRegistro DATE
	);

	-- Tabla Zona
	CREATE TABLE IF NOT EXISTS Zona (
		ZonaID INT(11) PRIMARY KEY,
		Ubicación VARCHAR(30),
		NombreZona VARCHAR(30)
	);

	-- Tabla Sucursal
	CREATE TABLE IF NOT EXISTS Sucursal (
		SucursalID INT(11) PRIMARY KEY,
		ZonaID INT(11),
		Nombre VARCHAR(30),
		Dirección VARCHAR(30),
		Telefono VARCHAR(30),
		FOREIGN KEY (ZonaID) REFERENCES Zona(ZonaID)
	);

	-- Tabla Empleado (actualizada con roles específicos)
	CREATE TABLE IF NOT EXISTS Empleado (
		EmpleadoID INT(11) PRIMARY KEY AUTO_INCREMENT,
		SucursalID INT(11),
		Nombre VARCHAR(30),
		Rol ENUM('Recepcionista', 'Administrador'),
		Email VARCHAR(30),
		Contraseña VARCHAR(30),
		FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
	);

	-- Tabla Pista
CREATE TABLE IF NOT EXISTS Pista (
    PistaID INT(11) PRIMARY KEY,
    SucursalID INT(11),
    Nombre VARCHAR(30),
    PrecioPorHora INT(11),
    FOREIGN KEY (SucursalID) REFERENCES Sucursal(SucursalID)
);

	-- Tabla Reserva
	CREATE TABLE IF NOT EXISTS Reserva (
		ReservaID INT(11) PRIMARY KEY AUTO_INCREMENT,
		PistaID INT(11),
		ClienteID INT(11),
		EmpleadoID INT(11),
		Estado ENUM('Confirmada', 'Completada', 'Cancelada', 'No-show'),
		FechaReserva DATE,
		FechaHoraInicio DATETIME,
		FechaHoraFin DATETIME,
		NúmeroPersonas INT(11),
		FOREIGN KEY (PistaID) REFERENCES Pista(PistaID),
		FOREIGN KEY (ClienteID) REFERENCES Cliente(ClienteID),
		FOREIGN KEY (EmpleadoID) REFERENCES Empleado(EmpleadoID)
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
		AsistenciaID INT(11) PRIMARY KEY,
		EmpleadoID INT(11),
		Fecha DATE,
		HoraEntrada TIME,
		HoraSalida TIME,
		FOREIGN KEY (EmpleadoID) REFERENCES Empleado(EmpleadoID)
	);

	-- Tabla FacturaBala
	CREATE TABLE IF NOT EXISTS FacturaBala (
		FacturaBalaID INT(11) PRIMARY KEY,
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
		Asunto VARCHAR(30),
		Cuerpo VARCHAR(30)
	);
    

-- Insertar datos en la tabla Zona
INSERT INTO Zona (ZonaID, Ubicación, NombreZona) VALUES
(1, 'Centro', 'Zona Centro'),
(2, 'Norte', 'Zona Norte'),
(3, 'Sur', 'Zona Sur');

-- Insertar datos en la tabla Sucursal
INSERT INTO Sucursal (SucursalID, ZonaID, Nombre, Dirección, Telefono) VALUES
(1, 1, 'Sucursal Centro', 'Calle Principal 123', '555-1234'),
(2, 2, 'Sucursal Norte', 'Avenida Norte 456', '555-5678'),
(3, 3, 'Sucursal Sur', 'Bulevar Sur 789', '555-9012');

-- Insertar datos en la tabla Cliente
INSERT INTO Cliente (Nombre, Email, FechaRegistro) VALUES
('Juan Pérez', 'juan@email.com', '2023-01-15'),
('María García', 'maria@email.com', '2023-02-20'),
('Carlos Rodríguez', 'carlos@email.com', '2023-03-25');

-- Insertar datos en la tabla Empleado
INSERT INTO Empleado (SucursalID, Nombre, Rol, Email, Contraseña) VALUES
(1, 'Ana López', 'Recepcionista', 'ana@empresa.com', 'contraseña123'),
(2, 'Pedro Martínez', 'Administrador', 'pedro@empresa.com', 'admin456'),
(3, 'Laura Sánchez', 'Recepcionista', 'laura@empresa.com', 'recepcion789');

-- Insertar datos en la tabla Pista
INSERT INTO Pista (PistaID, SucursalID, Nombre, PrecioPorHora) VALUES
(1, 1, 'Pista A', 50),
(2, 1, 'Pista B', 60),
(3, 2, 'Pista C', 55),
(4, 3, 'Pista D', 65);

-- Insertar datos en la tabla Reserva
INSERT INTO Reserva (PistaID, ClienteID, EmpleadoID, Estado, FechaReserva, FechaHoraInicio, FechaHoraFin, NúmeroPersonas) VALUES
(1, 1, 1, 'Confirmada', '2023-04-01', '2023-04-01 10:00:00', '2023-04-01 11:00:00', 4),
(2, 2, 2, 'Completada', '2023-04-02', '2023-04-02 15:00:00', '2023-04-02 16:00:00', 6),
(3, 3, 3, 'Cancelada', '2023-04-03', '2023-04-03 18:00:00', '2023-04-03 19:00:00', 2);

-- Insertar datos en la tabla FacturaReserva
INSERT INTO FacturaReserva (ReservaID, SucursalID, Estado, MontoTotal, MetodoPago, FechaEmision) VALUES
(1, 1, 'Pagada', '50.00', 'Tarjeta', '2023-04-01'),
(2, 2, 'Pagada', '60.00', 'Efectivo', '2023-04-02'),
(3, 3, 'Cancelada', '0.00', 'N/A', '2023-04-03');

-- Insertar datos en la tabla RegistroAsistencia
INSERT INTO RegistroAsistencia (AsistenciaID, EmpleadoID, Fecha, HoraEntrada, HoraSalida) VALUES
(1, 1, '2023-04-01', '08:00:00', '17:00:00'),
(2, 2, '2023-04-02', '09:00:00', '18:00:00'),
(3, 3, '2023-04-03', '08:30:00', '17:30:00');

-- Insertar datos en la tabla FacturaBala
INSERT INTO FacturaBala (FacturaBalaID, SucursalID, Estado, MontoTotal, FechaEmisión, DescuentoAplicado) VALUES
(1, 1, 'Pagada', '100.00', '2023-04-01', '0'),
(2, 2, 'Pagada', '150.00', '2023-04-02', '10%'),
(3, 3, 'Pendiente', '200.00', '2023-04-03', '0');

-- Insertar datos en la tabla DescuentoAutomático
INSERT INTO DescuentoAutomático (Umbral, Tipo, Valor) VALUES
('1000', 'Porcentaje', '5%'),
('2000', 'Porcentaje', '10%'),
('3000', 'Monto Fijo', '50');

-- Insertar datos en la tabla PaqueteBala
INSERT INTO PaqueteBala (DescuentoID, Nombre, Precio, CantidadBalas) VALUES
(1, 'Paquete Básico', '50.00', 100),
(2, 'Paquete Intermedio', '90.00', 200),
(3, 'Paquete Premium', '120.00', 300);

-- Insertar datos en la tabla EmailMarketing
INSERT INTO EmailMarketing (NombreCampania, FechaCreación, FechaEnvio, Asunto) VALUES
('Promoción Verano', '2023-05-01', '2023-06-01', 'Ofertas de Verano'),
('Nuevo Paquete', '2023-07-01', '2023-07-15', 'Nuevo Paquete Disponible'),
('Descuento Especial', '2023-09-01', '2023-09-10', 'Descuento por Lealtad');