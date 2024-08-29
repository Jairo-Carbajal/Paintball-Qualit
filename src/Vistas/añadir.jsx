function Añadir() {
    return(
        <>
        <div class = "btn-group-vertical">
            <h1 style = "background: white">añadir reserva</h1>
            <div class="btn btn-group" role="group">
                <h2>fecha:</h2>
                <button type="button" class = "boton1"></button>
                <h2>Hora:</h2>
                <button type="button" class = "boton2"></button>
                <h2>Tipo:</h2>
                <button type="button" class = "boton3"></button>
            </div>
            <div class="btn btn-group" role="group">
                <h2>Nombre:</h2>
                <button type="button" class="btn btn-dark"></button>
                <h2>E-mail:</h2>
                <button type="button" class="btn btn-dark"></button>
            </div>
            <div class="btn btn-group" role="group">
                <button type="button" class="cancel">Cancelar</button>
                <button type="button" class="confirm">Confirmar</button>
            </div>
        </div>
        </>
    )
}

export default Añadir;