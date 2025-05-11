document.addEventListener('DOMContentLoaded', function() {

    const modalContainer = document.getElementById('modal-container');

    const botones = {
        depositar: document.getElementById('btn-depositar'),
        retirar: document.getElementById('btn-retirar'),
        consultar: document.getElementById('btn-consultar'),
        servicios: document.getElementById('btn-pagar-servicios')
    };

    const ventanas = {
        deposito: document.getElementById('Modal-deposito'),
        retiro: document.getElementById('Modal-Retiro'),
        balance: document.getElementById('Modal-Balance'),
        servicios: document.getElementById('Modal-Servicios')
    };

    function abrirVentana(ventana) {
        if (!ventana) return;
        modalContainer.classList.add('visible');
        ventana.classList.add('modal-visible');
    }

    function cerrarVentanas() {
        modalContainer.classList.remove('visible');
        document.querySelectorAll('.modal-contenido.modal-visible').forEach(function(ventana) {
            ventana.classList.remove('modal-visible');
        });
    }

    if (botones.depositar) botones.depositar.addEventListener('click', function() { abrirVentana(ventanas.deposito); });
    if (botones.retirar) botones.retirar.addEventListener('click', function() { abrirVentana(ventanas.retiro); });
    if (botones.consultar) botones.consultar.addEventListener('click', function() { abrirVentana(ventanas.balance); });
    if (botones.servicios) botones.servicios.addEventListener('click', function() { abrirVentana(ventanas.servicios); });

    document.querySelectorAll('.btn-cerrar, .btn-cancelar').forEach(function(boton) {
        boton.addEventListener('click', cerrarVentanas);
    });

    if (modalContainer) {
        modalContainer.addEventListener('click', function(event) {
            if (event.target === modalContainer) {
                cerrarVentanas();
            }
        });
    }
});