import React, { useState } from "react";
import { Link } from "react-router-dom";

function EnviarEmail() {
  const [mensaje, setMensaje] = useState("");
  const [asunto, setAsunto] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // Cambiado a alertMessage
  const [alertVisible, setAlertVisible] = useState(false); // Estado para controlar la alerta

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      mensaje: mensaje,
      asunto: asunto,
    };

    try {
      const response = await fetch("http://localhost:5000/api/enviar-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Correo enviado a todos los clientes."); // Mensaje para la alerta
        setAlertVisible(true); // Muestra la alerta
        setMensaje(""); // Limpia el mensaje después de enviar
        setAsunto(""); // Limpia el asunto después de enviar
      } else {
        window.alert("Hubo un error al enviar el correo.");
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      setAlertMessage("Error al enviar el correo."); // Mensaje para la alerta en caso de error
      setAlertVisible(true); // Muestra la alerta
      window.alert("Hubo un error al enviar el correo.");
    }
  };

  return (
    <>
      <div
        className="taburador"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#343a40",
        }}
      >
        <ul
          className="nav nav-tabs"
          role="tablist"
          style={{ display: "flex", alignItems: "center" }}
        >
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
        </ul>
        {alertVisible && (
          <div className="alert alert-dismissible alert-success position-fixed" style={{ bottom: "1rem", right: "1rem", zIndex: 1050 }}>
            <button type="button" className="btn-close" onClick={() => setAlertVisible(false)}></button>
            <strong>Éxito!</strong> {alertMessage} {/* Mostrar el mensaje en la alerta */}
          </div>
        )}
      </div>
      <div style={{ paddingTop: "5rem" }}>
        <h2>Enviar Email a los Clientes</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Asunto: </label>
            <input
              type="text"
              className="form-control"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mensaje: </label>
            <textarea
              className="form-control"
              name="message"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              rows="5"
            />
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ gap: "10px" }}
          >
            <button
              type="submit"
              className="btn btn-success"
              style={{ width: "150px", height: "50px" }}
            >
              Enviar
            </button>
            <Link to="/reservas">
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: "150px", height: "50px", marginTop: "-10px" }}
              >
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default EnviarEmail;
