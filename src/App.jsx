import React from 'react';
import "bootswatch/dist/lux/bootstrap.min.css";
import {BrowserRouter as Router,Routes,Route,Link,BrowserRouter,} from "react-router-dom";
import "./css/app.css"


import Navbar from "./Componentes/Navbar";
import Añadir from "./Vistas/añadir";
import Editar from "./Vistas/Editar";
import Reservas from "./Vistas/Reservas";

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Reservas></Reservas>}></Route>
          <Route path="/añadir" element={<Añadir></Añadir>}></Route>
          <Route path="/editar" element={<Editar></Editar>}></Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
