import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/añadir.css";

function Añadir() {
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [pistaID, setPistaID] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [reservas, setReservas] = useState([]);

  const loggedEmpleadoID = localStorage.getItem("loggedEmpleadoID");
  const navigate = useNavigate();  // Hook para redirigir

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reservas");
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error("Error fetching reservas", error);
    }
  };

  const handleConfirm = async () => {
    if (!nombreCliente || !emailCliente || !fecha || !horaInicio || !numeroPersonas || !pistaID) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      // 1. Insertar cliente
      const clienteResponse = await fetch("http://localhost:5000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: nombreCliente,
          Email: emailCliente,
          FechaRegistro: new Date().toISOString().split("T")[0], // Fecha actual
        }),
      });
      const clienteData = await clienteResponse.json();
      const clienteID = clienteData.insertId;

      // 2. Calcular fecha y hora de fin (1 hora después de la hora de inicio)
      const HoraInicio = new Date(`${fecha}T${horaInicio}`);
      const HoraFin = new Date(HoraInicio);
      HoraFin.setHours(HoraFin.getHours() + 1);

      // 3. Insertar reserva
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
          NúmeroPersonas: numeroPersonas,
        }),
      });

      alert("Reserva añadida exitosamente");
      fetchReservas(); // Actualizar la lista de reservas
      
      navigate("/reservas"); // Redirigir a la página de reservas
    } catch (error) {
      console.error("Error al añadir la reserva", error);
      alert("Hubo un error al añadir la reserva");
    }
  };

  return (
    <main className="body-añadir">
      <h1 className="titulo">Añadir Reserva</h1>
      <section className="añadir">
        <div className="formulario">
          <div className="datos1">
            <label htmlFor="32" className="textos">Fecha:</label>
            <input type="date" className="botonArriba1" id="32" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <label htmlFor="33" className="textos">Hora:</label>
            <input type="time" className="botonArriba1" id="33" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            <label htmlFor="34" className="textos">Personas:</label>
            <input type="number" className="botonArriba1" id="34" value={numeroPersonas} onChange={(e) => setNumeroPersonas(e.target.value)} />
            <label htmlFor="35" className="textos">Pista:</label>
            <select id="35" className="botonArriba2" value={pistaID} onChange={(e) => setPistaID(e.target.value)}>
              <option value="0">---</option>
              <option value="1">PH1</option>
              <option value="2">PS1</option>
              <option value="3">PH2</option>
            </select>
            <label htmlFor="40" className="textos">Nombre:</label>
            <input type="text" className="botonAbajo" id="40" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
            <label htmlFor="41" className="textos-xd">E-mail:</label>
            <input type="email" className="botonAbajo" id="41" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} />
          </div>
          <div className="botones">
            <Link to="/reservas">
              <button type="button" className="cancel">Cancelar</button>
            </Link>
            <button type="button" className="confirmar" onClick={handleConfirm}>Confirmar</button>
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
              {reservas.map((reserva) => {
                const fechaReserva = new Date(reserva.FechaReserva);
                const horaInicio = new Date(reserva.HoraInicio);
                
                return (
                  <tr key={reserva.ReservaID}>
                    <td className="fila-secu">{reserva.ReservaID}</td>
                    <td className="fila">{fechaReserva.toLocaleDateString()}</td>
                    <td className="fila">
                    {reserva.HoraInicio && reserva.HoraInicio.slice(0, 5)}
                    </td>
                    <td className="fila">{reserva.NúmeroPersonas}</td>
                    <td className="fila">{reserva.PrecioPorHora}</td>
                    <td className="fila-secus">{reserva.Nombre}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Añadir;
