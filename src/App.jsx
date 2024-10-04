import React from 'react';
import "bootswatch/dist/lux/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {BrowserRouter as Router,Routes,Route,Link,BrowserRouter,} from "react-router-dom";
import "./css/app.css"

/*
Bootstrap: npm i bootstrap@5.3.3
BootsWath: npm install bootswatch
Express: npm install express mysql cors body-parser
React-doom: npm install react-router-dom@6
*/

import Añadir from "./Vistas/añadir";
import Reservas from "./Vistas/Reservas";
import Login from './Vistas/login';
import EditarReserva from './Vistas/Editar';

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/reservas" element={<Reservas></Reservas>}></Route>
          <Route path="/añadir" element={<Añadir></Añadir>}></Route>
          <Route path="/editar/:id" element={<EditarReserva></EditarReserva>}></Route>
          <Route path="/" element={<Login></Login>}></Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
