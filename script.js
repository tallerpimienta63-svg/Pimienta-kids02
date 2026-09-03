let listaPrendas = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formSalida');
    const btnDescargar = document.getElementById('btnDescargar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Cargar fecha actual formateada
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormat = new Date().toLocaleDateString('es-ES', opcionesFecha);
    const elemFecha = document.getElementById('fechaActual');
    if (elemFecha) {
        elemFecha.textContent = fechaFormat;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById('nombrePrenda');
            const tallaInput = document.getElementById('tallaPrenda');
            const colorInput = document.getElementById('colorPrenda');
            const cantidadInput = document.getElementById('cantidadPrenda');
            const obsInput = document.getElementById('obsPrenda');
            const inputFoto = document.getElementById('fotoPrenda');

            const nombre = nombreInput ? nombreInput.value.trim() : '';
            const talla = tallaInput ? tallaInput.value.trim() : '';
            const color = colorInput ? colorInput.value.trim() : '';
            const cantidad = cantidadInput ? (parseInt(cantidadInput.value) || 1) : 1;
            const observacion = obsInput ? obsInput.value.trim() : '';

            // Imagen por defecto si no sube ninguna
            let fotoUrl = 'https://via.placeholder.com/40?text=Foto';

            if (inputFoto && inputFoto.files && inputFoto.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    agregarItemLista(nombre, talla, color, cantidad, observacion, event.target.result);
                    form.reset();
                };
                reader.readAsDataURL(inputFoto.files[0]);
            } else {
                agregarItemLista(nombre, talla, color, cantidad, observacion, fotoUrl);
                form.reset();
            }
        });
    }

    function agregarItemLista(nombre, talla, color, cantidad, observacion, foto) {
        listaPrendas.push({ nombre, talla, color, cantidad, observacion, foto });
        actualizarTabla();
    }

    function actualizarTabla() {
        const tbody = document.getElementById('tablaCuerpo');
        const totalCantidadEl = document.getElementById('totalCantidad');
        
        if (!tbody) return;
        tbody.innerHTML = '';

        if (listaPrendas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No hay registros agregados aún.</td></tr>`;
            if (totalCantidadEl) totalCantidadEl.textContent = '0';
            if (btnDescargar) btnDescargar.disabled = true;
            return;
        }

        let sumaTotal = 0;

        listaPrendas.forEach((item) => {
            sumaTotal += item.cantidad;
            const tr = document.createElement('tr');
            
            // Solo color y observaciones (sin repetir la talla)
            let textoDetalles = `<strong>${item.color}</strong>`;
            if (item.observacion) {
                textoDetalles += `<br>Obs: ${item.observacion}`;
            }

            tr.innerHTML = `
                <td>
                    <div class="item-foto-nombre">
                        <img src="${item.foto}" alt="${item.nombre}" class="table-thumb">
                        <span class="col-prenda-mini">${item.nombre}</span>
                    </div>
                </td>
                <td class="col-talla">${item.talla}</td>
                <td class="col-cantidad">${item.cantidad}</td>
                <td class="col-detalles">${textoDetalles}</td>
            `;
            tbody.appendChild(tr);
        });

        if (totalCantidadEl) totalCantidadEl.textContent = sumaTotal;
        if (btnDescargar) btnDescargar.disabled = false;
    }

    if (btnDescargar) {
        btnDescargar.addEventListener('click', () => {
            window.print();
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (confirm('¿Deseas limpiar todos los registros de la lista?')) {
                listaPrendas = [];
                actualizarTabla();
            }
        });
    }
});
