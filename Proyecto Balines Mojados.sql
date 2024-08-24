create database Proyecto_Balines_Mojados;
use Proyecto_Balines_Mojados;

create table CLiente(
ClienteID int(11) primary key AUTO_INCREMENT,
Nombre varchar(30),
Email varchar(30),
FechaRegistro date
);

create table Zona(
ZonaID int(11) primary key,
Ubicación varchar(30),
NombreZona varchar(30)
);

Create table Sucursal(
SucursalID int(11) primary key,
ZonaID int(11),
Nombre varchar(30),
Dirección varchar(30),
Telefono varchar(30),
foreign key (ZonaID) references Zona(ZonaID)
);

create table Empleado(
EmpleadoID int(11) primary key auto_increment,
SucursalID int(11),
Nombre varchar(30),
Rol varchar(30),
Email varchar(30),
Contraseña varchar(30),
foreign key(SucursalId) references Sucursal(SucursalID)
);

create table Pista(
PistaID int(11) primary key,
SucursalID int(11),
Nombre varchar(30),
Tipo varchar(30),
PrecioPorHora int(11),
foreign key(SucursalId) references Sucursal(SucursalID)
);

create table Reserva(
ReservaID int(11) primary key auto_increment,
PistaID int(11),
CLienteID int(11),
EmpleadoID int(11),
Estado varchar(30),
FechaReserva date,
FechaHoraInicio datetime,
FechaHoraFin datetime,
NúmeroPersonas int(11),
foreign key(PistaID) references Pista(PistaID),
foreign key(ClienteID)references Cliente(ClienteID),
foreign key(EmpleadoID)references Empleado(EmpleadoID)
);

create table FacturaReserva(
FacturaReservaID int(11)primary key auto_increment,
ReservaID int(11),
SucursalID int(11),
Estado varchar (30),
MontoTotal varchar(30),
MetodoPago varchar(30),
FechaEmision date,
foreign key(ReservaID)references Reserva(ReservaID),
foreign key(SucursalID)references Sucursal(SucursalID)
);

create table RegistroAsistencia(
AsistenciaID int(11) primary key,
EmpleadoID int(11),
Fecha date,
HoraEntrada time,
HoraSalida time
);

create table FacturaBala(
FacturaBalaID int(11) primary key,
SucursalID int(11),
Estado varchar(30),
MontoTotal varchar(30),
FechaEmisión date,
DescuentoAplicado varchar(30),
foreign key(SucursalID) references Sucursal(SucursalID)
);

create table DescuentoAutomático(
DescuentoID int(11) primary key auto_increment,
Umbral varchar(30),
Tipo varchar(30),
Valor varchar(30)
);

create table PaqueteBala(
PaqueteBalaID int(11) primary key auto_increment,
DescuentoID int(11),
Nombre varchar(30),
Precio varchar(30),
CantidadBalas int(11),
foreign key(DescuentoID) references DescuentoAutomático(DescuentoID)
);

create table EmailMarketing(
CampaniaID int(11) primary key auto_increment,
NombreCampania varchar(30),
FechaCreación date,
FechaEnvio date,
Asunto varchar(30),
Cuerpo varchar(30)
);