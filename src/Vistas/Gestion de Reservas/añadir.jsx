import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/añadir.css";

function Añadir() {
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [pistaID, setPistaID] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [reservas, setReservas] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false); 

  const loggedEmpleadoID = localStorage.getItem("loggedEmpleadoID");
  const sucursalID = localStorage.getItem("sucursalID");
  const navigate = useNavigate();

  useEffect(() => {
    if (sucursalID) {
      fetchReservas(sucursalID);
    } else {
      alert("Sucursal ID es requerido");
      console.log(sucursalID);
    }
  }, [sucursalID]);

  const fetchReservas = async (sucursalID) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reservas?sucursalID=${sucursalID}`
      );
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error("Error fetching reservas", error);
    }
  };

  const handleConfirm = async () => {
    if (
      !nombreCliente ||
      !emailCliente ||
      !fecha ||
      !horaInicio ||
      !numeroPersonas ||
      !pistaID
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const clienteResponse = await fetch("http://localhost:5000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: nombreCliente,
          Email: emailCliente,
          FechaRegistro: new Date().toISOString().split("T")[0],
          SucursalID: sucursalID,
        }),
      });
      const clienteData = await clienteResponse.json();
      const clienteID = clienteData.insertId;

      const HoraInicio = new Date(`${fecha}T${horaInicio}`);
      const HoraFin = new Date(HoraInicio);
      HoraFin.setHours(HoraFin.getHours() + 1);

      await fetch("http://localhost:5000/crearreservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ClienteID: clienteID,
          EmpleadoID: loggedEmpleadoID,
          PistaID: pistaID,
          Estado: "Confirmada",
          FechaReserva: fecha,
          HoraInicio: HoraInicio.toISOString(),
          HoraFin: HoraFin.toISOString(),
          NumeroPersonas: numeroPersonas,
          SucursalID: sucursalID,
        }),
      });

      setAlertVisible(true);
      fetchReservas(sucursalID);

      setTimeout(() => {
        navigate("/reservas");
      }, 2000); 
    } catch (error) {
      console.error("Error al añadir la reserva", error);
      alert("Hubo un error al añadir la reserva");
    }
  };

  return (
    <main className="body-añadir">
      <h1 className="titulo">Añadir Reserva</h1>
      {alertVisible && ( 
        <div className="alert alert-dismissible alert-success">
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertVisible(false)}
          ></button>
          Reserva añadida exitosamente.
        </div>
      )}
      <section className="añadir">
        <div className="formulario">
          <div className="datos1">
            <label htmlFor="32" className="textos">
              Fecha:
            </label>
            <input
              type="date"
              className="botonArriba1"
              id="32"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <label htmlFor="33" className="textos">
              Hora:
            </label>
            <input
              type="time"
              className="botonArriba1"
              id="33"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
            <label htmlFor="34" className="textos">
              Personas:
            </label>
            <input
              type="number"
              className="botonArriba1"
              id="34"
              value={numeroPersonas}
              onChange={(e) => setNumeroPersonas(e.target.value)}
            />
            <label htmlFor="35" className="textos">
              Pista:
            </label>
            <select
              id="35"
              className="botonArriba2"
              value={pistaID}
              onChange={(e) => setPistaID(e.target.value)}
            >
              <option value="0">---</option>
              <option value="1">PH1</option>
              <option value="2">PS1</option>
              <option value="3">PH2</option>
            </select>
            <label htmlFor="40" className="textos">
              Nombre:
            </label>
            <input
              type="text"
              className="botonAbajo"
              id="40"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
            <label htmlFor="41" className="textos-xd">
              E-mail:
            </label>
            <input
              type="email"
              className="botonAbajo"
              id="41"
              value={emailCliente}
              onChange={(e) => setEmailCliente(e.target.value)}
            />
          </div>
          <div className="botones">
            <Link to="/reservas">
              <button type="button" className="cancel">
                Cancelar
              </button>
            </Link>
            <button type="button" className="confirmar" onClick={handleConfirm}>
              Confirmar
            </button>
          </div>
        </div>

        <div className="tabla-container">
          <table className="tablaA">
            <thead>
              <tr>
                <th className="columna-inicial">ID</th>
                <th className="columna">Fecha</th>
                <th className="columna">Hora</th>
                <th className="columna">Personas</th>
                <th className="columna">Precio</th>
                <th className="columna-final">Pista</th>
              </tr>
            </thead>
          </table>
          <div className="tabla-scroll">
            <table className="tablaA">
              <tbody>
                {reservas.map((reserva) => {
                  const fechaReserva = new Date(reserva.FechaReserva);
                  const horaInicioReserva = new Date(
                    `${fechaReserva.toISOString().split("T")[0]}T${
                      reserva.HoraInicio
                    }`
                  );

                  return (
                    <tr key={reserva.ReservaID}>
                      <td className="fila-secu">{reserva.ReservaID}</td>
                      <td className="fila">
                        {fechaReserva.toLocaleDateString()}
                      </td>
                      <td className="fila">
                        {horaInicioReserva.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="fila">{reserva.NumeroPersonas}</td>
                      <td className="fila">{reserva.precioPorHora}</td>
                      <td className="fila-secus">{reserva.NombrePista}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Añadir;
