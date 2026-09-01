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

    // Leer imagen local desde la cámara/galería
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
        const detalles = document.getElementById("colorTalla").value;
        const descripcion = document.getElementById("descripcion").value;

        if (totalFilas === 0) {
            tablaCuerpo.innerHTML = "";
            btnDownload.disabled = false;
        }

        const imgSrc = fotoTemporalBase64 ? fotoTemporalBase64 : "https://placeholder.com";
        const notasCompletas = descripcion ? `${detalles} — Obs: ${descripcion}` : detalles;

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
        filaTotal.style.backgroundColor = "#fbeee0";
        filaTotal.style.fontWeight = "bold";
        filaTotal.innerHTML = `
            <td colspan="2" style="text-align: right; color: #56230f;">TOTAL GENERAL:</td>
            <td style="text-align: center; color: #8b3a1b; font-size: 1.1rem;">${sumaTotalPrendas}</td>
            <td>prendas de salida</td>
        `;
        tablaCuerpo.appendChild(filaTotal);

        prendaForm.reset();
        fotoTemporalBase64 = "";
        fileStatus.textContent = "📸 Seleccionar foto de muestra";
        uploadBox.style.borderColor = "#8b3a1b";
    });

    // SISTEMA DE EXPORTACIÓN DIRECTA COMPRIMIDA USANDO HTML2PDF
    btnDownload.addEventListener("click", () => {
        const elementoACapturar = document.getElementById("comprobanteCaptureArea");
        
        // Deshabilitar temporalmente el botón para evitar clics dobles mientras procesa
        btnDownload.textContent = "Procesando PDF...";
        btnDownload.disabled = true;

        // Configuración de compresión y renderizado nativo para teléfonos móviles
        const opcionesConfig = {
            margin:       10,
            filename:     `Produccion_PimientaKids_${hoy.toISOString().split('T')[0]}.pdf`,
            image:        { type: 'jpeg', quality: 0.95 }, // Comprime las fotos pesadas de la cámara para no saturar memoria
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Ejecutar la exportación directa como descarga de archivo nativa en Android
        html2pdf().set(opcionesConfig).from(elementoACapturar).save().then(() => {
            // Reestablecer el estado del botón una vez terminada la descarga
            btnDownload.textContent = "Descargar Comprobante (PDF)";
            btnDownload.disabled = false;
        }).catch(err => {
            console.error("Error al procesar el archivo:", err);
            btnDownload.textContent = "Descargar Comprobante (PDF)";
            btnDownload.disabled = false;
        });
    });
});

function limpiarTabla() {
    window.location.reload();
}
