import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/añadir.css";

function Añadir() {
  // Estados para manejar los datos del formulario
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [pistaID, setPistaID] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [reservas, setReservas] = useState([]);

  // Obtener reservas desde la API
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
  // Función para manejar la confirmación y envío de los datos
  const handleConfirm = async () => {
    if (!fecha || !horaInicio || !pistaID || !nombreCliente || !emailCliente) {
      alert("Todos los campos son necesarios");
      return;
    }
    const reservaData = {
      fecha: fecha,
      horaInicio: `${fecha} ${horaInicio}:00`, // Combina fecha y hora
      pistaID: pistaID, // Cambiado a ID de pista
      nombreCliente: nombreCliente,
      emailCliente: emailCliente,
      numeroPersonas: numeroPersonas,
    };
    try {
      const response = await fetch("http://localhost:5000/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaData),
      });
      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }

      const data = await response.json();
      console.log("Reserva creada:", data);
      // Aquí puedes manejar la respuesta, mostrar un mensaje, limpiar el formulario, etc.
    } catch (error) {
      console.error("Error al crear la reserva:", error);
    }
  };

  return (
    <>
      <main className="body-añadir">
        <h1 className="titulo">Añadir Reserva</h1>
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
                <option value="1">---</option>
                <option value="2">PH1</option>
                <option value="3">PS1</option>
                <option value="4">PH2</option>
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
              <Link to="/">
                <button type="button" className="cancel">
                  Cancelar
                </button>
              </Link>
              <Link to="/">
                <button
                  type="button"
                  className="confirmar"
                  onClick={handleConfirm}
                >
                  Confirmar
                </button>
              </Link>
            </div>
          </div>
          <div className="tabla">
            <table className="tablaA">
              <thead>
                <tr>
                  <th className="columna-inicial">id</th>
                  <th className="columna">Fecha</th>
                  <th className="columna">Hora</th>
                  <th className="columna">Personas</th>
                  <th className="columna">Precio</th>
                  <th className="columna-final">Pista</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.ReservaID}>
                    <td className="fila-secu">{reserva.ReservaID}</td>
                    <td className="fila">
                      {new Date(reserva.FechaReserva).toLocaleDateString()}
                    </td>
                    <td className="fila">
                      {new Date(reserva.FechaHoraInicio).toLocaleTimeString()}
                    </td>
                    <td className="fila">{reserva.NúmeroPersonas}</td>
                    <td className="fila">{reserva.PrecioPorHora}</td>
                    <td className="fila-secus">{reserva.Nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

export default Añadir;
