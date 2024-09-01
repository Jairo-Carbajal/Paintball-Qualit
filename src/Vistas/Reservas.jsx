import React, { useState, useEffect } from "react";
import "../css/reservas.css";
import { Link } from "react-router-dom";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reservas")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setReservas(data);
      })
      .catch((error) => console.error("Error fetching reservas:", error));
  }, []);

  return (
    <>
      <main>
        <div className="taburador">
          <ul className="nav nav-tabs " role="tablist" >
            <h1 style={{color:"white", marginBottom:"0", marginRight:"3rem", marginInline:"1rem"}}>PaintBall</h1>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                data-bs-toggle="tab"
                href="#dia"
                aria-selected="true"
                role="tab"
              >
                Dia
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#semana"
                aria-selected="false"
                role="tab"
                tabindex="-1"
              >
                Semana
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#mes"
                aria-selected="false"
                role="tab"
                tabindex="-1"
              >
                Mes
              </a>  
            </li>
          </ul>
          <Link to="/añadir" className="clearfix">
            <button type="button" class="btn btn-success mx-4">Crear Reserva</button>
          </Link>
        </div>


        {/* Taburadores */}
        
        <div id="myTabContent" class="tab-content">
          {/* Dia */}
          <div class="tab-pane fade active show" id="dia" role="tabpanel">
            <p>
              Dia
            </p>
            <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Nombre</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.ReservaID}>
                <td>{reserva.ReservaID}</td>
                <td>{reserva.NombreCliente}</td>
                <td>{new Date(reserva.FechaReserva).toLocaleDateString()}</td>
                <td>
                  {new Date(reserva.FechaHoraInicio).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          

          </div>

          {/* Semana */}
          <div class="tab-pane fade" id="semana" role="tabpanel">
            <p>
              Semana
            </p>
          </div>

          {/* Mes */}
          <div class="tab-pane fade" id="mes" role="tabpanel">
            <p>
              Mes
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reservas;
