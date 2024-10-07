import React, { useState, useEffect } from "react";
import "../../css/Reservas.css";
import { Link } from "react-router-dom";

const Reservas = () => {
  const [filtro, setFiltro] = useState("dia");
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date("2024-09-02"));
  const [rolEmpleado, setRolEmpleado] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);

  useEffect(() => {
    const sucursalID = localStorage.getItem("sucursalID");
    const empleadoID = localStorage.getItem("empleadoID");

    if (!sucursalID || !empleadoID) {
      console.error("Sucursal ID o Empleado ID no encontrados en localStorage");
      return;
    }

    fetch(`http://localhost:5000/api/empleado/${empleadoID}/rol`)
      .then((response) => response.json())
      .then((data) => {
        setRolEmpleado(data.rol);
      })
      .catch((error) => console.error("Error al obtener el rol:", error));

    fetch(`http://localhost:5000/api/reservas?sucursalID=${sucursalID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la red");
        }
        return response.json();
      })
      .then((data) => {
        setReservas(data);
      })
      .catch((error) => console.error("Error al obtener reservas:", error));
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

  const handleDelete = (reservaID) => {
    setReservaToDelete(reservaID);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/eliminar/reservas/${reservaToDelete}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la reserva');
        }
        setReservasFiltradas(reservasFiltradas.filter(reserva => reserva.ReservaID !== reservaToDelete));
        setShowConfirm(false);
      })
      .catch(error => console.error('Error al eliminar reserva:', error));
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setReservaToDelete(null);
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
          {rolEmpleado === "Administrador" && (
            <>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Opciones
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <Link to="/asistencias" className="dropdown-item">
                      Gestor Empleados
                    </Link>
                  </li>
                  <li>
                    <Link to="/enviaremail" className="dropdown-item">
                      Enviar Email
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
          <Link to="/añadir" className="clearfix">
            <button type="button" className="btn btn-success mx-4">
              Crear Reserva
            </button>
          </Link>
          <Link to={"/logout"} className="clearfix">
            <button type="button" className="btn btn-outline-danger">
              Cerrar Sesion
            </button>
          </Link>
        </div>

        {showConfirm && (
          <div className="alert alert-dismissible alert-warning">
            <h4 className="alert-heading">Confirmación de eliminación</h4>
            <p className="mb-0">
            ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
            </p>
            <button type="button"  className="btn btn-danger pop" onClick={confirmDelete}>
              Confirmar
            </button>
            <button type="button" className="btn btn-success pop" onClick={cancelDelete}>
              Cancelar
            </button>
          </div>
        )}

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
                    <td>{new Date(reserva.FechaReserva).toLocaleDateString()}</td>
                    <td>{reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}</td>
                    <td>
                      <Link to={`/editar/${reserva.ReservaID}`} className="btn btn-primary">
                        Editar
                      </Link>
                      <button type="button" className="btn btn-dark" onClick={() => handleDelete(reserva.ReservaID)}>
                        Eliminar
                      </button>
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
                    <td>{new Date(reserva.FechaReserva).toLocaleDateString()}</td>
                    <td>{reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}</td>
                    <td>
                      <Link to={`/editar/${reserva.ReservaID}`} className="btn btn-primary">
                        Editar
                      </Link>
                      <button type="button" className="btn btn-dark" onClick={() => handleDelete(reserva.ReservaID)}>
                        Eliminar
                      </button>
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
                    <td>{new Date(reserva.FechaReserva).toLocaleDateString()}</td>
                    <td>{reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}</td>
                    <td>
                      <Link to={`/editar/${reserva.ReservaID}`} className="btn btn-primary">
                        Editar
                      </Link>
                      <button type="button" className="btn btn-dark" onClick={() => handleDelete(reserva.ReservaID)}>
                        Eliminar
                      </button>
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
