  Nivel 0: Sistema de Reservas  
1\. Cliente  
   \- Descripción: Persona que realiza una solicitud de reserva.  
   \- Tipo de Dato: Entidad externa.  
    
2\. Empleado  
   \- Descripción: Persona que gestiona y visualiza las reservas.  
   \- Tipo de Dato: Entidad externa.  
    
3\. Pide reserva  
   \- Descripción: Acción realizada por el cliente para solicitar una reserva.  
   \- Tipo de Dato: Flujo de datos.  
    
4\. Recibe confirmación  
   \- Descripción: Acción en la que el cliente recibe la confirmación de la reserva realizada.  
   \- Tipo de Dato: Flujo de datos.  
    
5\. Gestiona la reserva  
   \- Descripción: Proceso por el cual el empleado administra la reserva realizada por el cliente.  
   \- Tipo de Dato: Flujo de datos.  
    
6\. Visualiza las reservas  
   \- Descripción: Acción del empleado para revisar las reservas existentes.  
   \- Tipo de Dato: Flujo de datos.

 Nivel 1: Sistema de Reservas  
1\. Recepción de Solicitud  
   \- Descripción: Proceso inicial donde se recibe la solicitud de reserva del cliente.  
   \- Tipo de Dato: Proceso.  
    
2\. Verifica la Disponibilidad  
   \- Descripción: Proceso para revisar si existen reservas disponibles.  
   \- Tipo de Dato: Proceso.  
    
3\. Actualización de Reservas  
   \- Descripción: Proceso donde se actualizan las reservas disponibles en la base de datos.  
   \- Tipo de Dato: Proceso.  
    
4\. B.D. Reservas  
   \- Descripción: Base de datos que almacena las reservas registradas.  
   \- Tipo de Dato: Almacén de datos.  
    
5\. Confirmación de Reservas  
   \- Descripción: Proceso donde se confirma la reserva al cliente.  
   \- Tipo de Dato: Proceso.  
    
6\. Generación de Reportes  
   \- Descripción: Proceso en el que se generan informes de las reservas.  
   \- Tipo de Dato: Proceso.  
    
7\. No hay Reservas  
   \- Descripción: Notificación al cliente de que no existen reservas disponibles.  
   \- Tipo de Dato: Flujo de datos.

 Nivel 2: Detalle de Procesos  
1\. Solicitud de Reserva  
   \- Descripción: Proceso donde el cliente solicita una reserva.  
   \- Tipo de Dato: Proceso.  
    
2\. Confirmación  
   \- Descripción: Proceso donde se confirma al cliente que la reserva ha sido registrada exitosamente.  
   \- Tipo de Dato: Proceso.  
    
3\. Informe  
   \- Descripción: Documento generado que detalla las reservas existentes.  
   \- Tipo de Dato: Flujo de datos.

Componentes adicionales y detalles:  
\- Disponibilidad:  
   \- Descripción: Información sobre si hay o no reservas disponibles en el sistema.  
   \- Tipo de Dato: Flujo de datos.  
   \- Origen/Destino: Generado por "Verifica la Disponibilidad", usado por "Confirmación de Reservas" y "No hay Reservas".  
    
\- Actualización:  
   \- Descripción: Acción de modificar la base de datos con las reservas actualizadas.  
   \- Tipo de Dato: Flujo de datos.  
   \- Origen/Destino: Generado por "Actualización de Reservas", almacenado en "B.D. Reservas".  
    
\- Registro:  
   \- Descripción: Información de reserva ingresada en la base de datos.  
   \- Tipo de Dato: Flujo de datos.  
   \- Origen/Destino: Usado por "Actualización de Reservas", almacenado en "B.D. Reservas".