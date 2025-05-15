document.addEventListener('DOMContentLoaded', function () {
    const cardSaldo = document.getElementById('card_saldo');
    const cardRetiro = document.getElementById('card_retiro');
    const cardDeposito = document.getElementById('card_deposito');
    const cardPago = document.getElementById('card_pago');
    const canvas = document.getElementById('grafico');
    
    
    
    const grafico1 = canvas.getContext('2d');

   
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

                    if (!isNaN(monto)) {
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

            // Actualizar tarjetas
            if (cardSaldo) cardSaldo.textContent = '$' + (saldoActual || 0).toFixed(2);
            if (cardRetiro) cardRetiro.textContent = '$' + (totalRetiros || 0).toFixed(2);
            if (cardDeposito) cardDeposito.textContent = '$' + (totalDepositos || 0).toFixed(2);
            if (cardPago) cardPago.textContent = '$' + (totalPagos || 0).toFixed(2);

            // Crear gráfico con los datos obtenidos
            crearGrafico(totalRetiros, totalDepositos, totalPagos, saldoActual);
        } else {
            if (cardSaldo) cardSaldo.textContent = '$0.00';
            if (cardRetiro) cardRetiro.textContent = '$0.00';
            if (cardDeposito) cardDeposito.textContent = '$0.00';
            if (cardPago) cardPago.textContent = '$0.00';
            console.warn("No se encontraron datos de cuenta en localStorage.");
            
            // Crear gráfico con valores cero si no hay datos
            crearGrafico(0, 0, 0, 0);
        }
    };

    // --- Función para crear el gráfico ---
    function crearGrafico(retiros, depositos, pagos, saldo) {
        // Destruir gráfico anterior si existe
        if (window.miGrafico) {
            window.miGrafico.destroy();
        }

        const data = {
            labels: ['Retiros', 'Depósitos', 'Pagos', 'Saldo'],
            datasets: [{
                data: [retiros, depositos, pagos, saldo],
                backgroundColor: [
                    '#e74c3c', // Rojo
                    '#3498db', // Azul
                    '#f39c12', // Amarillo
                    '#2ecc71'  // Turquesa
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'center',
                    },
                    title: {
                        display: true,
                        text: 'Análisis Económico',
                        font: {
                            size: 35,
                            family: 'Gidole'
                        },
                        padding: {
                        top: 10,
                      bottom: 30
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: $${context.raw.toFixed(2)} (${percentage}%)`;
        }
                        }
                    }
                }
            }
        };

        window.miGrafico = new Chart(grafico1, config);
    }

   
    cargarYMostrarDatosAnalisis();
});