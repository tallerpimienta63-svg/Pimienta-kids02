document.addEventListener("DOMContentLoaded", () => {
    const prendaForm = document.getElementById("prendaForm");
    const fotoPrendaInput = document.getElementById("fotoPrenda");
    const uploadBox = document.getElementById("uploadBox");
    const fileStatus = document.getElementById("fileStatus");
    const tablaCuerpo = document.getElementById("tablaCuerpoPrendas");
    const btnDownload = document.getElementById("btnDownload");
    const comprobanteFecha = document.getElementById("comprobanteFecha");

    let fotoTemporalBase64 = "";
    let totalFilas = 0;
    let sumaTotalPrendas = 0;

    // Configurar la fecha de hoy automáticamente en español
    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const hoy = new Date();
    comprobanteFecha.textContent = hoy.toLocaleDateString('es-PE', opcionesFecha);

    // Leer imagen local desde la cámara o galería del taller
    fotoPrendaInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            fileStatus.textContent = `📸 Cargada: ${file.name.substring(0, 12)}...`;
            uploadBox.style.borderColor = "#2e7d32";

            const reader = new FileReader();
            reader.onload = function(event) {
                fotoTemporalBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Añadir fila a la tabla dinámicamente
    prendaForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombrePrenda").value.toUpperCase();
        const cantidad = parseInt(document.getElementById("cantidad").value);
        const colorTalla = document.getElementById("colorTalla").value; // Talla y Color
        const descripcion = document.getElementById("descripcion").value;

        if (totalFilas === 0) {
            tablaCuerpo.innerHTML = "";
            btnDownload.disabled = false;
        }

        const imgSrc = fotoTemporalBase64 ? fotoTemporalBase64 : "https://placeholder.com";
        
        // 📌 Aplicamos negrita a la talla y color, seguido de la observación adicional si existe
        const notasCompletas = descripcion 
            ? `<strong>${colorTalla}</strong> — Obs: ${descripcion}` 
            : `<strong>${colorTalla}</strong>`;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${imgSrc}" class="table-thumb" alt="Prenda"></td>
            <td class="col-prenda">${nombre}</td>
            <td class="col-cantidad">${cantidad}</td>
            <td class="col-detalles">${notasCompletas}</td>
        `;
        tablaCuerpo.appendChild(fila);

        totalFilas++;
        sumaTotalPrendas += cantidad;

        const filaTotalAnterior = document.getElementById("filaTotalGeneral");
        if (filaTotalAnterior) {
            filaTotalAnterior.remove();
        }

        const filaTotal = document.createElement("tr");
        filaTotal.id = "filaTotalGeneral";
        filaTotal.innerHTML = `
            <td colspan="2" style="text-align: right; color: #56230f;">TOTAL GENERAL:</td>
            <td style="text-align: center; color: #8b3a1b; font-size: 1rem;">${sumaTotalPrendas}</td>
            <td>prendas de salida</td>
        `;
        tablaCuerpo.appendChild(filaTotal);

        prendaForm.reset();
        fotoTemporalBase64 = "";
        fileStatus.textContent = "📸 Seleccionar foto de muestra";
        uploadBox.style.borderColor = "#8b3a1b";
    });

    // Método de asistencia nativa para imprimir / guardar PDF
    btnDownload.addEventListener("click", () => {
        window.print();
    });
});

function limpiarTabla() {
    window.location.reload();
}
