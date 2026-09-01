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
        const file = e.target.files;
        if (file && file[0]) {
            fileStatus.textContent = `📸 Cargada: ${file[0].name.substring(0, 12)}...`;
            uploadBox.style.borderColor = "#2e7d32";
            
            const reader = new FileReader();
            reader.onload = function(event) {
                fotoTemporalBase64 = event.target.result;
            };
            reader.readAsDataURL(file[0]);
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

    // NUEVO MOTOR DE CAPTURA DE IMAGEN DIRECTA ULTRA COMPATIBLE
    btnDownload.addEventListener("click", () => {
        const areaCaptura = document.getElementById("comprobanteCaptureArea");
        
        btnDownload.textContent = "Guardando...";
        btnDownload.disabled = true;

        html2canvas(areaCaptura, {
            backgroundColor: "#ffffff",
            scale: 2, // Resolucion nitida para ver bien los textos pequeños
            useCORS: true,
            allowTaint: true,
            logging: false
        }).then(canvas => {
            // Convierte el HTML en un enlace de imagen común (.png)
            const imageURI = canvas.toDataURL("image/png");
            
            // Forzar descarga nativa directa en el portapapeles/descargas de Android
            const linkDescarga = document.createElement("a");
            linkDescarga.href = imageURI;
            linkDescarga.download = `Produccion_PimientaKids_${hoy.toISOString().split('T')[0]}.png`;
            
            document.body.appendChild(linkDescarga);
            linkDescarga.click(); 
            document.body.removeChild(linkDescarga);

            btnDownload.textContent = "Descargar Comprobante";
            btnDownload.disabled = false;
        }).catch(err => {
            console.error("Error al generar imagen:", err);
            btnDownload.textContent = "Descargar Comprobante";
            btnDownload.disabled = false;
        });
    });
});

function limpiarTabla() {
    window.location.reload();
}
