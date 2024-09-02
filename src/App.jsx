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
