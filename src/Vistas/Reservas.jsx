import React, { useState, useEffect } from "react";
import "../css/reservas.css";
import { Link } from "react-router-dom";

const Reservas = () => {
  const [filtro, setFiltro] = useState("dia");
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date("2024-09-02"));

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

  useEffect(() => {
    const filteredByDay = reservas.filter((reserva) => {
      const reservaDate = new Date(reserva.FechaReserva);
      return reservaDate.toDateString() === selectedDate.toDateString();
    });

    const filteredByWeek = reservas.filter((reserva) => {
      const reservaDate = new Date(reserva.FechaReserva);
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      return reservaDate >= startOfWeek && reservaDate <= endOfWeek;
    });

    const filteredByMonth = reservas.filter((reserva) => {
      const reservaDate = new Date(reserva.FechaReserva);
      return (
        reservaDate.getFullYear() === selectedDate.getFullYear() &&
        reservaDate.getMonth() === selectedDate.getMonth()
      );
    });

    if (filtro === "dia") {
      setReservasFiltradas(filteredByDay);
    } else if (filtro === "semana") {
      setReservasFiltradas(filteredByWeek);
    } else if (filtro === "mes") {
      setReservasFiltradas(filteredByMonth);
    }
  }, [filtro, reservas, selectedDate]);

  const handleTabChange = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
  };

  return (
    <>
      <main>
        <div className="taburador">
          <ul className="nav nav-tabs" role="tablist">
            <h1
              style={{
                color: "white",
                marginBottom: "0",
                marginRight: "3rem",
                marginInline: "1rem",
              }}
            >
              PaintBall
            </h1>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${filtro === "dia" ? "active" : ""}`}
                data-bs-toggle="tab"
                href="#dia"
                aria-selected="true"
                role="tab"
                onClick={() => handleTabChange("dia")}
              >
                Día
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${filtro === "semana" ? "active" : ""}`}
                data-bs-toggle="tab"
                href="#semana"
                aria-selected="false"
                role="tab"
                onClick={() => handleTabChange("semana")}
              >
                Semana
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${filtro === "mes" ? "active" : ""}`}
                data-bs-toggle="tab"
                href="#mes"
                aria-selected="false"
                role="tab"
                onClick={() => handleTabChange("mes")}
              >
                Mes
              </a>
            </li>
          </ul>
          <Link to={"/asistencias"}>
            <button type="button" class="btn btn-info" >Info</button>
          </Link>
          <Link to="/añadir" className="clearfix">
            <button type="button" className="btn btn-success mx-4">
              Crear Reserva
            </button>
          </Link>
        </div>

        <div id="myTabContent" className="tab-content">
          <div className="tab-pane fade active show" id="dia" role="tabpanel">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.ReservaID}>
                    <td>{reserva.ReservaID}</td>
                    <td>{reserva.NombreCliente}</td>
                    <td>
                      {new Date(reserva.FechaReserva).toLocaleDateString()}
                    </td>
                    <td>
                      {reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}
                    </td>
                    <td>
                      <Link to={`/editar/${reserva.ReservaID}`} className="btn btn-primary">
                        Editar
                      </Link>                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tab-pane fade" id="semana" role="tabpanel">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.ReservaID}>
                    <td>{reserva.ReservaID}</td>
                    <td>{reserva.NombreCliente}</td>
                    <td>
                      {new Date(reserva.FechaReserva).toLocaleDateString()}
                    </td>
                    <td>
                      {reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}
                    </td>
                    <td>
                      <Link to={`/editar/${reserva.ReservaID}`} type="button" className="btn btn-primary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tab-pane fade" id="mes" role="tabpanel">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.ReservaID}>
                    <td>{reserva.ReservaID}</td>
                    <td>{reserva.NombreCliente}</td>
                    <td>
                      {new Date(reserva.FechaReserva).toLocaleDateString()}
                    </td>
                    <td>
                      {reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}
                    </td>
                    <td>
                      <Link to={`/editar/${reserva.ReservaID}`} type="button" className="btn btn-primary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reservas;
