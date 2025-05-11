
export const Usuario = {
    Nombre: 'Ash Ketchum',
    Pin: 1234,
    Ncuenta: '0987654321',
    Saldo: 500
};

document.addEventListener('DOMContentLoaded', function() {
    let Almacenador = '';
    const input_pin = document.getElementById('pin-contenedor');

    const constraints = {
        pin: {
            presence: true,
            length: {
                is: 4,
            },
            numericality: {
                onlyInteger: true,
                message: "debe contener solo números"
            }
        }
    };

    let botones = document.querySelectorAll("button.boton");
    const botonEntrar = document.querySelector('.boton-entrar');
    const botonBorrar = document.querySelector('.boton-delete');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            let valor_boton = boton.textContent;
            
            if(Almacenador.length < 4) {
                Almacenador += valor_boton;
                input_pin.textContent = '*'.repeat(Almacenador.length);
            }
        });
    });

    botonEntrar.addEventListener('click', () => {
        const validation = validate({pin: Almacenador}, constraints);
        
        if (validation) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: validation.pin.join(', '),
                confirmButtonText: 'Entendido'
            });
            return;
        }
        
        if (parseInt(Almacenador) === Usuario.Pin) {
            Swal.fire({
                icon: 'success',
                title: 'Inicio Exitoso',
                timer: 1500,
                showConfirmButton: false 
            }).then(() => {
                window.location.href = 'Banco-principal.html';
            });
        } else {
            Almacenador = '';
            input_pin.textContent = '';
            Swal.fire({
                icon: 'error',
                title: 'Pin Incorrecto',
                confirmButtonText: 'Entendido'
            });
        }
    });

    botonBorrar.addEventListener('click', () => {
        Almacenador = Almacenador.slice(0, -1);
        input_pin.textContent = '*'.repeat(Almacenador.length);
    });
});
