import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";

const EditarReservas = () => {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [pistas, setPistas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const sucursalID = localStorage.getItem("sucursalID");

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const response = await fetch(`http://localhost:5000/reserva/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reservation");
        }
        const data = await response.json();
        console.log("Reserva data:", data);

        setReserva(data);
      } catch (err) {
        console.error("Error fetching reserva:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPistas = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/pistas?sucursalID=${sucursalID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pistas");
        }
        const data = await response.json();
        console.log("Pistas data:", data);

        setPistas(data);
      } catch (err) {
        console.error("Error fetching pistas:", err);
        setError(err.message);
      }
    };

    fetchReserva();
    fetchPistas();
  }, [id, sucursalID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePistaChange = (e) => {
    const selectedPistaID = Number(e.target.value);
    const selectedPista = pistas.find(
      (pista) => pista.PistaID === selectedPistaID
    );

    console.log("Selected Pista:", selectedPista);

    setReserva((prev) => ({
      ...prev,
      PistaID: selectedPistaID,
      PrecioPorHora: selectedPista ? selectedPista.PrecioPorHora : "",
      PistaNombre: selectedPista ? selectedPista.Nombre : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!reserva.ReservaID) {
      console.error("Error: ReservaID no está definido");
      return;
    }

    const fechaSinHora = new Date(reserva.FechaReserva)
      .toISOString()
      .slice(0, 10);

    try {
      await fetch(
        `http://localhost:5000/actualizarcliente/${reserva.ClienteID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombreCliente: reserva.ClienteNombre,
            emailCliente: reserva.ClienteEmail,
          }),
        }
      );

      await fetch(`http://localhost:5000/actualizarpista/${reserva.PistaID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          precioPorHora: reserva.PrecioPorHora,
          pistaNombre: reserva.PistaNombre,
          sucursalID: sucursalID,
        }),
      });

      await fetch(
        `http://localhost:5000/actualizarreservas/${reserva.ReservaID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fechaReserva: fechaSinHora,
            horaInicio: reserva.HoraInicio,
            horaFin: reserva.HoraFin,
            estado: reserva.Estado,
            numeroPersonas: reserva.NumeroPersonas,
          }),
        }
      );

      console.log("Reserva actualizada correctamente");
      setRedirect(true);
    } catch (error) {
      console.error("Error updating reserva:", error);
    }
  };

  if (redirect) {
    return <Navigate to="/reservas" />;
  }

  if (loading) {
    return <div>Cargando reserva...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reserva) {
    return <div>No se encontró la reserva.</div>;
  }

  return (
    <div>
      <h2>Editar Reserva</h2>
      <Link to={"/reservas"}>
        <button type="button" className="btn btn-primary">
          Volver
        </button>
      </Link>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Editar Reserva</legend>
          <div className="mb-3">
            <label htmlFor="ClienteNombre" className="form-label">
              Cliente:
            </label>
            <input
              type="text"
              className="form-control"
              name="ClienteNombre"
              value={reserva.ClienteNombre || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ClienteEmail" className="form-label">
              Email del Cliente:
            </label>
            <input
              type="email"
              className="form-control"
              name="ClienteEmail"
              value={reserva.ClienteEmail || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="PistaID" className="form-label">
              Pista:
            </label>
            <select
              className="form-select"
              name="PistaID"
              value={reserva.PistaID || ""}
              onChange={handlePistaChange}
              required
            >
              <option value="">Seleccionar Pista</option>
              {pistas.map((pista) => (
                <option key={pista.PistaID} value={pista.PistaID}>
                  {pista.Nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="PrecioPorHora" className="form-label">
              Precio por Hora:
            </label>
            <input
              type="text"
              className="form-control"
              name="PrecioPorHora"
              value={reserva.PrecioPorHora || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="FechaReserva" className="form-label">
              Fecha:
            </label>
            <input
              type="date"
              className="form-control"
              name="FechaReserva"
              value={
                reserva.FechaReserva ? reserva.FechaReserva.slice(0, 10) : ""
              }
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="HoraInicio" className="form-label">
              Inicio (HH:MM):
            </label>
            <input
              type="time"
              className="form-control"
              name="HoraInicio"
              value={reserva.HoraInicio || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="HoraFin" className="form-label">
              Fin (HH:MM):
            </label>
            <input
              type="time"
              className="form-control"
              name="HoraFin"
              value={reserva.HoraFin || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Estado" className="form-label">
              Estado:
            </label>
            <select
              className="form-select"
              name="Estado"
              value={reserva.Estado || "Confirmada"}
              onChange={handleChange}
            >
              <option value="Confirmada">Confirmada</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="No-show">No-show</option>
            </select>
          </div>
          <button
            style={{ float: "right" }}
            type="submit buttom"
            className="btn btn-success"
          >
            Actualizar Reserva
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default EditarReservas;
