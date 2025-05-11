// analitico.js
document.addEventListener('DOMContentLoaded', function () {
    const cardSaldo = document.getElementById('card_saldo');
    const cardRetiro = document.getElementById('card_retiro');
    const cardDeposito = document.getElementById('card_deposito');
    const cardPago = document.getElementById('card_pago');

    // --- Función formatearCantidad eliminada ---

    // Cargar datos desde localStorage y mostrar en las tarjetas
    const cargarYMostrarDatosAnalisis = () => {
        const datosGuardados = localStorage.getItem('datosCuenta');
        
        if (datosGuardados) {
            const datosParseados = JSON.parse(datosGuardados);
            const saldoActual = datosParseados.Saldo !== undefined ? parseFloat(datosParseados.Saldo) : 0;
            const historial = datosParseados.Historial || [];

            let totalDepositos = 0;
            let totalRetiros = 0;
            let totalPagos = 0;

            historial.forEach(transaccion => {
                if (transaccion && transaccion.Monto !== undefined) {
                    const monto = parseFloat(transaccion.Monto);

                    if (!isNaN(monto)) { // Asegurarse que el monto es un número
                        switch(transaccion.Tipo.toUpperCase()) {
                            case 'DEPÓSITO':
                                totalDepositos += monto;
                                break;
                            case 'RETIRO':
                                totalRetiros += monto;
                                break;
                            case 'PAGO': 
                                totalPagos += monto;
                                break;
                        }
                    }
                }
            });

            // Actualizar el contenido de las tarjetas
            // Se usa (valor || 0).toFixed(2) para asegurar que si el valor es NaN o undefined, se trate como 0.
            if (cardSaldo) cardSaldo.textContent = '$' + (saldoActual || 0).toFixed(2);
            if (cardRetiro) cardRetiro.textContent = '$' + (totalRetiros || 0).toFixed(2);
            if (cardDeposito) cardDeposito.textContent = '$' + (totalDepositos || 0).toFixed(2);
            if (cardPago) cardPago.textContent = '$' + (totalPagos || 0).toFixed(2);

        } else {
            // Si no hay datos, mostrar $0.00 en las tarjetas
            if (cardSaldo) cardSaldo.textContent = '$0.00';
            if (cardRetiro) cardRetiro.textContent = '$0.00';
            if (cardDeposito) cardDeposito.textContent = '$0.00';
            if (cardPago) cardPago.textContent = '$0.00';
            console.warn("No se encontraron datos de cuenta en localStorage para el análisis.");
        }
    };

    // Llamar a la función para cargar y mostrar los datos cuando la página esté lista
    cargarYMostrarDatosAnalisis();
});