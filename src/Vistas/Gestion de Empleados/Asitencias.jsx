import { useState, useEffect } from "react";
import AñadirEmpleado from "./Crearempleado";

const getLocalDate = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split("T")[0];
};

function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Nueva variable para empleados
  const [fechaFiltro, setFechaFiltro] = useState(getLocalDate());
  const sucursalID = localStorage.getItem("sucursalID");
  const [estados, setEstados] = useState({});

  useEffect(() => {
    fetchEmpleados(); // Cargar empleados al inicio
    fetchAsistencias();
  }, []);

  const fetchEmpleados = async () => {
    try {
      // Cambiado a la nueva ruta para obtener empleados
      const response = await fetch(`http://localhost:5000/api/asistencias/empleados?sucursalID=${sucursalID}`);
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  const fetchAsistencias = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/asistencias/empleados?sucursalID=${sucursalID}`);
      const data = await response.json();
      setAsistencias(data);

      const initialEstados = data.reduce((acc, asistencia) => {
        acc[asistencia.EmpleadoID] = asistencia.Estado;
        return acc;
      }, {});
      setEstados(initialEstados);
    } catch (error) {
      console.error("Error fetching asistencias:", error);
    }
  };

  const handleEmpleadoAñadido = () => {
    fetchAsistencias();
  };

  const handleSave = async (empleadoID, nuevoEstado) => {
    try {
      await fetch(`http://localhost:5000/api/asistencias/${empleadoID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Estado: nuevoEstado }),
      });

      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Hubo un error al actualizar el estado");
    }
  };

  const handleChangeEstado = (empleadoID, nuevoEstado) => {
    setEstados((prevEstados) => ({
      ...prevEstados,
      [empleadoID]: nuevoEstado,
    }));
  };

  const empleadosConAsistencias = empleados.map((empleado) => {
    const asistencia = asistencias.find((a) => a.EmpleadoID === empleado.EmpleadoID);
    return {
      ...empleado,
      Estado: asistencia ? asistencia.Estado : "SinRegistrar", 
      Fecha: asistencia ? asistencia.Fecha : null, 
    };
  });

  const filteredAsistencias = asistencias.filter(
    (asistencia) =>
      (asistencia.Fecha ? new Date(asistencia.Fecha).toISOString().split("T")[0] : null) === fechaFiltro
  );

  return (
    <>
      <AñadirEmpleado onEmpleadoAñadido={handleEmpleadoAñadido} />
      <main style={{ marginTop: "8rem" }}>
        <h2 style={{ margin: "2rem" }} id="asistencias">
          Asistencias
        </h2>
        <div className="mb-3">
          <label htmlFor="fechaFiltro" className="form-label">
            <h5 style={{ margin: "2rem" }}>Filtrar por fecha:</h5>
          </label>
          <input
            type="date"
            id="fechaFiltro"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.length > 0 ? (
                asistencias.map((asistencia) => (
                  <tr key={asistencia.EmpleadoID} className="table-info">
                    <th scope="row">{asistencia.EmpleadoID}</th>
                    <td>{asistencia.Nombre}</td>
                    <td>{asistencia.Email}</td>
                    <td>{asistencia.Rol}</td>
                    <td>
                      {asistencia.Fecha
                        ? new Date(asistencia.Fecha).toLocaleDateString()
                        : 'Sin Registrar'}
                    </td>
                    <td>
                      <select
                        value={estados[asistencia.EmpleadoID] || "SinRegistrar"} // Default to 'Sin Registrar'
                        onChange={(e) => handleChangeEstado(asistencia.EmpleadoID, e.target.value)}
                      >
                        <option value="SinRegistrar">Sin Registrar</option>
                        <option value="Presente">Presente</option>
                        <option value="Ausente">Ausente</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Justificado">Justificado</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleSave(asistencia.EmpleadoID, estados[asistencia.EmpleadoID])}
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron empleados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default Asistencias;
