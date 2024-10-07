import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("SucursalID");
    localStorage.removeItem("EmpleadoID");

    navigate("/");
  }, [navigate]);

  return (
    <div>
      <h2>Cerrando sesión...</h2>
    </div>
  );
};

export default Logout;
