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
        const cantidad = document.getElementById("cantidad").value;
        const detalles = document.getElementById("colorTalla").value;
        const descripcion = document.getElementById("descripcion").value;

        // Limpiar fila inicial de "Tabla vacía"
        if (totalFilas === 0) {
            tablaCuerpo.innerHTML = "";
            btnDownload.disabled = false;
        }

        // Definir miniatura de imagen
        const imgSrc = fotoTemporalBase64 ? fotoTemporalBase64 : "https://placeholder.com";

        // Unificar los textos de detalles y notas adicionales
        const notasCompletas = descripcion ? `${detalles} — Obs: ${descripcion}` : detalles;

        // Inyectar el tr de la tabla
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${imgSrc}" class="table-thumb" alt="Prenda"></td>
            <td class="col-prenda">${nombre}</td>
            <td class="col-cantidad">${cantidad}</td>
            <td class="col-detalles">${notasCompletas}</td>
        `;

        tablaCuerpo.appendChild(fila);
        totalFilas++;

        // Limpiar campos del formulario para el siguiente registro
        prendaForm.reset();
        fotoTemporalBase64 = "";
        fileStatus.textContent = "📸 Seleccionar foto de muestra";
        uploadBox.style.borderColor = "#8b3a1b";
    });

    // Descarga de comprobante
    btnDownload.addEventListener("click", () => {
        const areaCaptura = document.getElementById("comprobanteCaptureArea");

        html2canvas(areaCaptura, {
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement("a");
            link.download = `Produccion_Tabla_${hoy.toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }).catch(err => {
            alert("Nota: La descarga se completará sin problemas al subir los archivos a GitHub.");
            console.error(err);
        });
    });
});

// Función para vaciar completamente la tabla
function limpiarTabla() {
    window.location.reload(); // Recarga rápida para limpiar variables locales y reajustar estados de forma limpia
}
