import { Usuario } from "./Login-JS.js";

document.addEventListener('DOMContentLoaded', function () {
    
    const { jsPDF } = window.jspdf;

    const Saldo = document.getElementById('saldo-display');
    const numero_cuenta = document.getElementById('Cuenta');
    const nombre_cuenta = document.getElementById('titulo');
    let Historial = [];
    
    const transactionList = document.querySelector('.transaction-list');
    console.log("Transaction list element:", transactionList); 

    const botones_Transacciones = {
        boton_depositar: document.getElementById('confirmar-deposito'),
        boton_retirar: document.getElementById('confirmar-retiro'),
        boton_pagar: document.getElementById('confirmar-pago')
    };

    const input_transacciones = {
        input_deposito: document.getElementById('cantidad-deposito'),
        input_retiro: document.getElementById('cantidad-retiro'),
        input_servicio: document.getElementById('servicio'),
        input_pago: document.getElementById('cantidad-servicio')
    };
 
    const cargarDatosUsuario = () => {
        const datosGuardados = localStorage.getItem('datosCuenta');
        console.log("Datos guardados:", datosGuardados); 
        
        if (datosGuardados) {
            const datosParseados = JSON.parse(datosGuardados);
            Usuario.Saldo = parseFloat(datosParseados.Saldo) || 0; 
            Usuario.Nombre = datosParseados.Nombre;
            Usuario.Ncuenta = datosParseados.Ncuenta;
            Historial = datosParseados.Historial || [];
            console.log("Historial cargado:", Historial); 
        } else {
            console.log("No hay datos guardados en localStorage");
        }
    };

    const guardarDatosUsuario = () => {
        const datosParaGuardar = {
            Saldo: Usuario.Saldo,
            Nombre: Usuario.Nombre,
            Ncuenta: Usuario.Ncuenta,
            Historial: Historial
        };
        localStorage.setItem('datosCuenta', JSON.stringify(datosParaGuardar));
    };

    cargarDatosUsuario();
 
    if (numero_cuenta) numero_cuenta.textContent = Usuario.Ncuenta;
    if (nombre_cuenta) nombre_cuenta.textContent = Usuario.Nombre;
    // Mostrar saldo con dos decimales
    if (Saldo) Saldo.textContent =  (Usuario.Saldo || 0).toFixed(2); 
    
    const actualizar_saldo = () => {
        // Mostrar saldo con dos decimales
        if (Saldo) Saldo.textContent =  (Usuario.Saldo || 0).toFixed(2); 
        guardarDatosUsuario();
    };
    
    

    const obtenerFechaHoraActual = () => {
        const ahora = new Date();
        return ahora.toLocaleString();
    };

    const generarPDF = (tipoTransaccion, monto, descripcion = '') => {
        try {
            const doc = new jsPDF();
            
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('Comprobante de Transacción', 105, 20, { align: 'center' });
            
            doc.setFillColor(255, 203, 5); 
            doc.rect(75, 30, 60, 20, 'F');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('POKE BANK ', 105, 43, { align: 'center' } );
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            
            doc.setFont('helvetica', 'bold');
            doc.text('Datos del Cliente:', 20, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`Nombre: ${Usuario.Nombre}`, 20, 70);
            doc.text(`Número de Cuenta: ${Usuario.Ncuenta}`, 20, 80);
            
            doc.setFont('helvetica', 'bold');
            doc.text('Detalles de la Transacción:', 20, 100);
            doc.setFont('helvetica', 'normal');
            doc.text(`Tipo: ${tipoTransaccion}`, 20, 110);
            // Usar (monto || 0).toFixed(2) para asegurar dos decimales
            doc.text(`Monto: $${(parseFloat(monto) || 0).toFixed(2)}`, 20, 120); 
            if (descripcion) {
                doc.text(`Descripción: ${descripcion}`, 20, 130);
            }
            doc.text(`Fecha y Hora: ${obtenerFechaHoraActual()}`, 20, 140);
            // Usar (Usuario.Saldo || 0).toFixed(2) para asegurar dos decimales
            doc.text(`Saldo Actual: $${(Usuario.Saldo || 0).toFixed(2)}`, 20, 150); 
            
            doc.setFontSize(10);
            doc.text('Gracias por usar nuestros servicios.', 105, 280, { align: 'center' });
            
            const referencia = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
            doc.setFontSize(8);
            doc.text(`Num: ${referencia}`, 20, 290);
            
            const nombreArchivo = `${tipoTransaccion.toLowerCase()}_${Usuario.Ncuenta}_${new Date().getTime()}.pdf`;
            doc.save(nombreArchivo);
            
        } catch (error) {
           console.log("Hay un error en la generación del PDF:", error);
        }
    };
    
    const validarTransaccion = (valor, inputElement) => {
        if (isNaN(valor) || valor <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Valor incorrecto',
                text: 'La cantidad debe ser mayor a 0',
                timer: 2000,
                showConfirmButton: false
            });
            inputElement.value = '';
            if (input_transacciones.input_servicio) input_transacciones.input_servicio.value = ''; 
            return false;
        }
        return true;
    };
    
    if (botones_Transacciones.boton_depositar) {
        botones_Transacciones.boton_depositar.addEventListener('click', () => {
            const valor = parseFloat(input_transacciones.input_deposito.value);
            
            if (!validarTransaccion(valor, input_transacciones.input_deposito)) return;
            
            Usuario.Saldo += valor;
            actualizar_saldo(); 
            const transaccion = {
                Tipo: 'Depósito',
                Monto: valor,
                Fecha: obtenerFechaHoraActual()
            };
            Historial.push(transaccion);
            guardarDatosUsuario();
            
            generarPDF('Depósito', valor);
            
            Swal.fire({
                icon: 'success',
                title: 'Depósito Exitoso',
                timer: 2000,
                showConfirmButton: false
            });
            
            input_transacciones.input_deposito.value = ''; 
        });
    }
    
    if (botones_Transacciones.boton_retirar) {
        botones_Transacciones.boton_retirar.addEventListener('click', () => {
            const valor = parseFloat(input_transacciones.input_retiro.value);
            
            if (!validarTransaccion(valor, input_transacciones.input_retiro)) return;
            
            if (valor > Usuario.Saldo) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fondos insuficientes',
                    text: 'No tiene suficiente dinero para retirar esa cantidad',
                    timer: 3000,
                    showConfirmButton: false
                });
                input_transacciones.input_retiro.value = ''; 
                return;
            }
            Usuario.Saldo -= valor;
            actualizar_saldo(); // Ya formatea el saldo en la UI
            const transaccion = {
                Tipo: 'RETIRO',
                Monto: valor,
                Fecha: obtenerFechaHoraActual()
            };
            Historial.push(transaccion);
            guardarDatosUsuario();
            
            generarPDF('Retiro', valor);
            
            Swal.fire({
                icon: 'success',
                title: 'Retiro Exitoso',
                timer: 1500,
                showConfirmButton: false
            });
            
            input_transacciones.input_retiro.value = '';
        });
    }
    
    if (botones_Transacciones.boton_pagar) {
        botones_Transacciones.boton_pagar.addEventListener('click', () => {
            const valor = parseFloat(input_transacciones.input_pago.value);
            const servicio = input_transacciones.input_servicio.value.trim();
            
            if (!validarTransaccion(valor, input_transacciones.input_pago)) return;
            if (!servicio) {
                Swal.fire({
                    icon: 'error',
                    title: 'Servicio no especificado',
                    text: 'Por favor ingrese el nombre del servicio',
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            if (valor > Usuario.Saldo) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fondos insuficientes',
                    text: 'No tiene suficiente dinero para realizar el pago',
                    timer: 3000,
                    showConfirmButton: false
                });
                input_transacciones.input_pago.value = '';
                if (input_transacciones.input_servicio) input_transacciones.input_servicio.value = ''; 
                return;
            }

            Usuario.Saldo -= valor;
            actualizar_saldo(); // Ya formatea el saldo en la UI
            const transaccion = {
                Tipo: 'PAGO',
                Servicio: servicio,
                Monto: valor,
                Fecha: obtenerFechaHoraActual()
            };
            
            Historial.push(transaccion);
            guardarDatosUsuario();
            
            generarPDF('Pago de Servicio', valor, servicio);
            
            Swal.fire({
                icon: 'success',
                title: 'Pago Exitoso',
                timer: 1500,
                showConfirmButton: false
            });
            
            input_transacciones.input_pago.value = '';
            if (input_transacciones.input_servicio) input_transacciones.input_servicio.value = ''; 
        });
    }

    const mostrarHistorial = () => {
        if (!transactionList) {
            console.log("No se encontró el elemento de lista de transacciones");
            return;
        }
        
        console.log("Mostrando historial de", Historial.length, "transacciones");
        transactionList.innerHTML = '';
        
        if (!Historial || Historial.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'transaction-item empty';
            emptyMessage.textContent = 'No hay transacciones recientes';
            transactionList.appendChild(emptyMessage);
            return;
        }
        
        const transaccionesRecientes = [...Historial].reverse();
        const transaccionesMostrar = transaccionesRecientes.slice(0, 10);
        
        transaccionesMostrar.forEach(transaccion => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            const transactionType = document.createElement('span');
            transactionType.className = 'transaction-type';
            
            const transactionAmount = document.createElement('span');
            transactionAmount.className = 'transaction-amount';

          
            const montoFormateado = (parseFloat(transaccion.Monto) || 0).toFixed(2);
            
            switch(transaccion.Tipo.toUpperCase()) {
                case 'DEPÓSITO':
                    transactionType.classList.add('deposit');
                    transactionType.textContent = 'Depósito';
                    transactionAmount.classList.add('positive');
                    transactionAmount.textContent = '+$' + montoFormateado;
                    break;
                case 'RETIRO':
                    transactionType.classList.add('withdrawal');
                    transactionType.textContent = 'Retiro';
                    transactionAmount.classList.add('negative');
                    transactionAmount.textContent = '-$' + montoFormateado;
                    break;
                case 'PAGO':
                    transactionType.classList.add('payment');
                    transactionType.textContent = `Pago`;
                    transactionAmount.classList.add('negative');
                    transactionAmount.textContent = '-$' + montoFormateado;
                    break;
                default:
                    transactionType.textContent = transaccion.Tipo;
                    transactionAmount.textContent = '$' + montoFormateado;
            }
            
            transactionItem.appendChild(transactionType);
            transactionItem.appendChild(transactionAmount);
                        
            if (transaccion.Fecha) {
                const transactionDate = document.createElement('div');
                transactionDate.className = 'transaction-date';
                transactionDate.textContent = transaccion.Fecha;
                transactionItem.appendChild(transactionDate);
            }
            
            transactionList.appendChild(transactionItem);
        });
    };
    
    mostrarHistorial();
});