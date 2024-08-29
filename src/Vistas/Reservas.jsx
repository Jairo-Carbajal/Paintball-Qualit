import React, { useState, useEffect } from "react";
import "../css/reservas.css";


const Reservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/reservas')
      .then(response => response.json())
      .then(data => setReservas(data))
      .catch(error => console.error('Error fetching reservas:', error));
  }, []);

  return (
    <>
      <div>
        <h2 class="Texto1">PaintBall</h2>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-success">
            Añadir
          </button>
        </div>

        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              data-bs-toggle="tab"
              href="#Día"
              aria-selected="false"
              role="tab"
              tabindex="-1"
            >
              Día
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link active"
              data-bs-toggle="tab"
              href="#Semana"
              aria-selected="true"
              role="tab"
            >
              Semana
            </a>
          </li>
        </ul>
        <div id="myTabContent" class="tab-content">
          <div class="tab-pane fade active show" id="Día" role="presentation">
            <p>
              Raw denim you probably haven't heard of them jean shorts Austin.
              Nesciunt tofu stumptown aliqua, retro synth master cleanse.
              Mustache cliche tempor, williamsburg carles vegan helvetica.
              Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby
              sweater eu banh mi, qui irure terry richardson ex squid. Aliquip
              placeat salvia cillum iphone. Seitan aliquip quis cardigan
              american apparel, butcher voluptate nisi qui.
            </p>
          </div>
          <div class="tab-pane fade" id="Semana" role="presentation">
            <p>
              Food truck fixie locavore, accusamus mcsweeney's marfa nulla
              single-origin coffee squid. Exercitation +1 labore velit, blog
              sartorial PBR leggings next level wes anderson artisan four loko
              farm-to-table craft beer twee. Qui photo booth letterpress,
              commodo enim craft beer mlkshk aliquip jean shorts ullamco ad
              vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic
              magna delectus mollit.
            </p>
          </div>
        </div>
        <br />
        <h2 class="Texto2">Reserva</h2>
        <label class="col-form-label mt-4" for="inputDefault">
          Fecha
        </label>
        <input
          type="text"
          class="form-control"
          placeholder="Default input"
          id="inputDefault"
        />
        <label class="col-form-label mt-4" for="inputDefault">
          Hora
        </label>
        <input
          type="text"
          class="form-control"
          placeholder="Default input"
          id="inputDefault"
        />
        <label class="col-form-label mt-4" for="inputDefault">
          Tipo
        </label>
        <input
          type="text"
          class="form-control"
          placeholder="Default input"
          id="inputDefault"
        />
        <label for="exampleSelect1" class="form-label mt-4">
          Example select
        </label>
        <select class="form-select" id="exampleSelect1">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </div>

      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Fecha</th>
            <th scope="col">Hora</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(reserva => (
            <tr key={reserva.ReservaID}>
              <td>{reserva.ReservaID}</td>
              <td>{reserva.ClienteID}</td>
              <td>{reserva.FechaReserva}</td>
              <td>{reserva.FechaHoraInicio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Reservas;
