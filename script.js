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

    // DESCARGA DE PDF DIRECTA: SIN VENTANAS EMERGENTES Y COMPRIMIDO
    btnDownload.addEventListener("click", () => {
        const areaCaptura = document.getElementById("comprobanteCaptureArea");
        
        btnDownload.textContent = "Generando PDF...";
        btnDownload.disabled = true;

        const { jsPDF } = window.jspdf;

        html2canvas(areaCaptura, {
            backgroundColor: "#ffffff",
            scale: 1.5, // Balance ideal entre nitidez y ligereza para que el móvil procese rápido
            useCORS: true,
            allowTaint: true,
            logging: false
        }).then(canvas => {
            // Convertir la tabla en imagen JPEG comprimida para ahorrar memoria ram en el celular
            const imgData = canvas.toDataURL("image/jpeg", 0.85);
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190; 
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10; 

            // Agregar la primera página
            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            // Manejar paginación automática si la lista de prendas es muy larga
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }

            // TRUCO DE DESCARGA DIRECTA (Nativa de Android para saltarse bloqueos)
            const blobPDF = pdf.output('blob');
            const urlDescarga = URL.createObjectURL(blobPDF);
            
            const enlaceInvisible = document.createElement("a");
            enlaceInvisible.href = urlDescarga;
            enlaceInvisible.download = `Produccion_PimientaKids_${hoy.toISOString().split('T')}.pdf`;
            
            document.body.appendChild(enlaceInvisible);
            enlaceInvisible.click(); // Descarga al instante
            document.body.removeChild(enlaceInvisible);

            // Restablecer interfaz
            btnDownload.textContent = "Descargar Comprobante (PDF)";
            btnDownload.disabled = false;
            URL.revokeObjectURL(urlDescarga);
        }).catch(err => {
            console.error("Error al generar el PDF:", err);
            alert("Ocurrió un error al procesar las fotos. Intenta usar imágenes más ligeras.");
            btnDownload.textContent = "Descargar Comprobante (PDF)";
            btnDownload.disabled = false;
        });
    });
});

function limpiarTabla() {
    window.location.reload();
}
