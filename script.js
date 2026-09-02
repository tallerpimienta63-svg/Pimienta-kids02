let listaPrendas = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formSalida');
    const btnDescargar = document.getElementById('btnDescargar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Cargar fecha actual formateada
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormat = new Date().toLocaleDateString('es-ES', opcionesFecha);
    document.getElementById('fechaActual').textContent = fechaFormat;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombrePrenda').value.trim();
        const talla = document.getElementById('tallaPrenda').value.trim();
        const color = document.getElementById('colorPrenda').value.trim();
        const cantidad = parseInt(document.getElementById('cantidadPrenda').value) || 1;
        const observacion = document.getElementById('obsPrenda').value.trim();
        const inputFoto = document.getElementById('fotoPrenda');

        let fotoUrl = 'https://via.placeholder.com/40?text=Foto'; // Imagen por defecto si no suben archivo

        if (inputFoto.files && inputFoto.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                agregarItemLista(nombre, talla, color, cantidad, observacion, e.target.result);
                form.reset();
            };
            reader.readAsDataURL(inputFoto.files[0]);
        } else {
            agregarItemLista(nombre, talla, color, cantidad, observacion, fotoUrl);
            form.reset();
        }
    });

    function agregarItemLista(nombre, talla, color, cantidad, observacion, foto) {
        listaPrendas.push({ nombre, talla, color, cantidad, observacion, foto });
        actualizarTabla();
    }

    function actualizarTabla() {
        const tbody = document.getElementById('tablaCuerpo');
        const totalCantidadEl = document.getElementById('totalCantidad');
        
        tbody.innerHTML = '';

        if (listaPrendas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No hay registros agregados aún.</td></tr>`;
            totalCantidadEl.textContent = '0';
            btnDescargar.disabled = true;
            return;
        }

        let sumaTotal = 0;

        listaPrendas.forEach((item, index) => {
            sumaTotal += item.cantidad;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center;">
                    <div class="item-foto-nombre">
                        <img src="${item.foto}" alt="${item.nombre}" class="table-thumb">
                        <span class="col-prenda-mini">${item.nombre}</span>
                    </div>
                </td>
                <td class="col-talla">${item.talla}</td>
                <td class="col-cantidad">${item.cantidad}</td>
                <td class="col-detalles"><strong>${item.talla} - ${item.color}</strong><br>Obs: ${item.observacion || '-'}</td>
            `;
            tbody.appendChild(tr);
        });

        totalCantidadEl.textContent = sumaTotal;
        btnDescargar.disabled = false;
    }

    btnDescargar.addEventListener('click', () => {
        window.print();
    });

    btnLimpiar.addEventListener('click', () => {
        if (confirm('¿Deseas limpiar todos los registros de la lista?')) {
            listaPrendas = [];
            actualizarTabla();
        }
    });
});
