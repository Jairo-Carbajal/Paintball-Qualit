import "../css/añadir.css"
function Añadir() {
    return(
        <>
        <main className="añadir">
            <div className = "btn-group-vertical">
                <div>
                    <h1 className="titulo">añadir reserva</h1>
                </div>
                <div className="datos1">
                    <label htmlFor="" className ="textos">Fecha:</label>
                    <input type="text" className = "botonArriba1"/>
                    <label htmlFor="" className ="textos">Hora:</label>
                    <input type="text" className = "botonArriba1"/>
                    <label htmlFor="" className ="textos">Tipo:</label>
                    <input type="text" className = "botonArriba2"/>
                </div>
                <div className ="tabla">
                    <table className="tablaA">
                        <thead>
                            <tr>
                                <th className = "columna-inicial">Fecha</th>
                                <th className = "columna">Hora</th>
                                <th className = "columna">Personas</th>
                                <th className = "columna">Precio</th>
                                <th className = "columna-final">pista</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className = "fila-inicial">00/00/00</td>
                                <td className = "fila">00:00</td>
                                <td className = "fila">0</td>
                                <td className = "fila">00000$</td>
                                <td className = "fila-final">N° pista</td>
                            </tr>
                            <tr>
                                <td className = "fila">00/00/00</td>
                                <td className = "fila">00:00</td>
                                <td className = "fila">0</td>
                                <td className = "fila">00000$</td>
                                <td className = "fila">N° pista</td>
                            </tr>
                            <tr>
                                <td className = "fila-secu">00/00/00</td>
                                <td className = "fila">00:00</td>
                                <td className = "fila">0</td>
                                <td className = "fila">00000$</td>
                                <td className = "fila-secus">N° pista</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="datos2">
                    <label htmlFor="" className ="textos">Nombre:</label>
                    <input type="text" className = "botonAbajo"/>
                    <label htmlFor="" className ="textos-xd">E-mail:</label>
                    <input type="text" className = "botonAbajo"/>
                </div>
                <div>
                    <button type="button" className="cancel">Cancelar</button>
                    <button type="button" className="confirm">Confirmar</button>
                </div>
            </div>
        </main>

        </>
    )
}

export default Añadir;