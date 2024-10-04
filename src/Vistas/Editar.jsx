import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const EditarReservas = () => {
    const { id } = useParams();
    const [reserva, setReserva] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const fetchReserva = async () => {
            try {
                const response = await fetch(`http://localhost:5000/reserva/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch reservation");
                }
                const data = await response.json();
                setReserva(data);
            } catch (err) {
                console.error("Error fetching reserva:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReserva();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setReserva((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        console.log('ReservaID:', reserva.ReservaID);
        if (!reserva.ReservaID) {
            console.error('Error: ReservaID no está definido');
            return;
        }

        event.preventDefault();
        
        // Convierte la fecha a formato adecuado
        const fechaSinHora = new Date(reserva.FechaReserva).toISOString().slice(0, 10);
    
        try {
            // Paso 1: Actualizar Cliente
            await fetch(`http://localhost:5000/actualizarcliente/${reserva.ClienteID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreCliente: reserva.ClienteNombre,
                    emailCliente: reserva.ClienteEmail
                }),
            });
    
            // Paso 2: Actualizar Pista
            await fetch(`http://localhost:5000/actualizarpista/${reserva.PistaID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    precioPorHora: reserva.PrecioPorHora,
                    pistaNombre: reserva.PistaNombre
                }),
            });
    
            // Paso 3: Actualizar Reserva
            await fetch(`http://localhost:5000/actualizarreservas/${reserva.ReservaID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fechaReserva: fechaSinHora, // Usa la fecha sin la parte de tiempo
                    horaInicio: reserva.HoraInicio,
                    horaFin: reserva.HoraFin,
                    estado: reserva.Estado,
                    numeroPersonas: reserva.NúmeroPersonas
                }),
            });
    
            console.log('Reserva actualizada correctamente');
            console.log('ReservaID:', reserva.ReservaID);
            setRedirect(true); // Asegúrate de tener un estado que controle la redirección
        } catch (error) {
            console.error('Error updating reserva:', error);
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Cliente: </label>
                    <input
                        type="text"
                        name="ClienteNombre"
                        value={reserva.ClienteNombre || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email del Cliente: </label>
                    <input
                        type="email"
                        name="ClienteEmail"
                        value={reserva.ClienteEmail || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Pista: </label>
                    <input
                        type="text"
                        name="PistaNombre"
                        value={reserva.PistaNombre || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio por Hora: </label>
                    <select
                        name="PrecioPorHora"
                        value={reserva.PrecioPorHora || 50}
                        onChange={handleChange}
                    >
                        <option value={50}>50</option>
                        <option value={60}>60</option>
                        <option value={70}>70</option>
                    </select>
                </div>
                <div>
                    <label>Fecha: </label>
                    <input
                        type="date"
                        name="FechaReserva"
                        value={reserva.FechaReserva ? reserva.FechaReserva.slice(0, 10) : ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Inicio (HH:MM): </label>
                    <input
                        type="time"
                        name="HoraInicio"
                        value={reserva.HoraInicio || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Fin (HH:MM): </label>
                    <input
                        type="time"
                        name="HoraFin"
                        value={reserva.HoraFin || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Estado: </label>
                    <select
                        name="Estado"
                        value={reserva.Estado || 'Confirmada'}
                        onChange={handleChange}
                    >
                        <option value="Confirmada">Confirmada</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="No-show">No-show</option>
                    </select>
                </div>
                <div>
                    <label>Número de Personas: </label>
                    <input
                        type="number"
                        name="NúmeroPersonas"
                        value={reserva.NúmeroPersonas || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Actualizar Reserva</button>
            </form>
        </div>
    );
};

export default EditarReservas;
