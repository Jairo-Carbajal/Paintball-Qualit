import React from 'react';
import "bootswatch/dist/lux/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {BrowserRouter as Router,Routes,Route,Link,BrowserRouter,} from "react-router-dom";
import "./css/app.css"

/*
Bootstrap: npm i bootstrap@5.3.3
BootsWath: npm install bootswatch
Express: npm install express mysql cors body-parser
Mysql2: npm install mysql2
React-doom: npm install react-router-dom@6
Nodemailer: npm install nodemailer
Package.json:
  "type": "commonjs",

*/

import Añadir from "./Vistas/Gestion de Reservas/añadir";
import Reservas from "./Vistas/Gestion de Reservas/Reservas";
import Login from './Vistas/Sesion/login';
import EditarReserva from './Vistas/Gestion de Reservas/Editar';
import Asitencias from './Vistas/Gestion de Empleados/Asitencias';
import AñadirEmpleado from './Vistas/Gestion de Empleados/Crearempleado';
import Logout from './Vistas/Sesion/logout';
import EnviarEmail from './Vistas/Email/enviaremail';

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/reservas" element={<Reservas></Reservas>}></Route>
          <Route path="/asistencias" element={<Asitencias></Asitencias>}></Route>
          <Route path="/añadir" element={<Añadir></Añadir>}></Route>
          <Route path="/editar/:id" element={<EditarReserva></EditarReserva>}></Route>
          <Route path="/añadirempleado" element={<AñadirEmpleado></AñadirEmpleado>}></Route>
          <Route path="/logout" element={<Logout></Logout>}></Route>
          <Route path="/enviaremail" element={<EnviarEmail></EnviarEmail>}></Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
