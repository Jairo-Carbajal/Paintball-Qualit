import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sucursales");
        const data = await response.json();
        setSucursales(data);
      } catch (err) {
        console.error("Error al obtener sucursales:", err);
      }
    };

    fetchSucursales();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!selectedSucursal) {
      setError("Por favor selecciona una sucursal.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, sucursal: selectedSucursal }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("empleadoID", data.user.id);
        localStorage.setItem("sucursalID", selectedSucursal);
        console.log("Sucursal ID guardado:", selectedSucursal);
        console.log("Empleado ID guardado:", data.user.id);
        navigate("/reservas");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <fieldset>
          <div className="row">
            <label htmlFor="email" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingrese su email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="form-label mt-4">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingrese su contraseña"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="sucursalSelect" className="form-label mt-4">
              Sucursal
            </label>
            <select
              className="form-select"
              id="sucursalSelect"
              value={selectedSucursal}
              onChange={(e) => setSelectedSucursal(e.target.value)}
              required
            >
              <option value="">Seleccionar sucursal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.SucursalID} value={sucursal.SucursalID}>
                  {sucursal.Nombre}
                </option>
              ))}
            </select>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="btn btn-primary mt-4">
            Iniciar sesión
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
