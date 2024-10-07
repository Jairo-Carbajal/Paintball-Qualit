import React, { useState } from "react";
import { Link } from "react-router-dom";

const AñadirEmpleado = ({ onEmpleadoAñadido }) => {
  const [sucursalID, setSucursalID] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("Empleado");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); // Nuevo estado para manejar la alerta

  const handleSubmit = async (e) => {
    e.preventDefault();

    const empleadoData = {
      SucursalID: sucursalID,
      Nombre: nombre,
      Rol: rol,
      Email: email,
      Contraseña: contraseña,
    };

    try {
      const response = await fetch("http://localhost:5000/api/crear/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleadoData),
      });

      if (response.ok) {
        const data = await response.json();
        onEmpleadoAñadido(); 
        setAlertVisible(true); // Muestra la alerta
        setSucursalID("");
        setNombre("");
        setRol("Empleado");
        setEmail("");
        setContraseña("");
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
    }
  };

  return (
    <>
      <div>
        <header>
          <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
              <a className="navbar-brand">Gestor de Empleados</a>
            </div>
            <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#asistencias">Asistencias</a>
                </li>
                <li className="nav-item">
                  <Link to={"/reservas"} className="nav-link">Reserva</Link>
                </li>
              </ul>
            </div>
          </nav>
          {alertVisible && (
            <div className="alert alert-dismissible alert-success position-fixed" style={{ bottom: "1rem", right: "1rem", zIndex: 1050 }}>
              <button type="button" className="btn-close" onClick={() => setAlertVisible(false)}></button>
              <strong>Bien hecho!</strong> Empleado agregado correctamente.
            </div>
          )}
        </header>

        <main style={{ margin: "2rem" }}>
          <h2 style={{ margin: "2rem" }}>Añadir Empleado</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Datos del Empleado</legend>
              <div className="row mb-3">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Sucursal ID
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    value={sucursalID}
                    onChange={(e) => setSucursalID(e.target.value)}
                    required
                    placeholder="ID de la Sucursal"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="nombreEmpleado" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreEmpleado"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Nombre del empleado"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="rolEmpleado" className="form-label">
                  Rol
                </label>
                <select
                  className="form-select"
                  id="rolEmpleado"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="Empleado">Empleado</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="emailEmpleado" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailEmpleado"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email del empleado"
                />
                <small id="emailHelp" className="form-text text-muted">
                  No compartiremos tu email con nadie más.
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="contraseñaEmpleado" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="contraseñaEmpleado"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                  placeholder="Contraseña"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Agregar Empleado
              </button>
            </fieldset>
          </form>
        </main>
      </div>
    </>
  );
};

export default AñadirEmpleado;
