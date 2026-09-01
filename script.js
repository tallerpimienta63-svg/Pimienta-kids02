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
    let listaProductosMemoria = []; 

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

        listaProductosMemoria.push({
            nombre: nombre,
            cantidad: cantidad,
            detalles: notasCompletas,
            foto: fotoTemporalBase64 
        });

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

    // DESCARGA PARCHADA PARA NAVEGADORES MÓVILES
    btnDownload.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabecera del Documento PDF
        doc.setFillColor(251, 238, 224); 
        doc.rect(0, 0, 220, 40, 'F');

        doc.setTextColor(139, 58, 27); 
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Pimienta Kids", 14, 18);

        doc.setFontSize(9);
        doc.setTextColor(161, 136, 127);
        doc.text("GESTIÓN & SISTEMA", 14, 23);

        doc.setTextColor(86, 35, 15); 
        doc.setFontSize(12);
        doc.text("COMPROBANTE DE PRODUCCIÓN", 14, 34);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Fecha: ${comprobanteFecha.textContent}`, 130, 34);

        let yPos = 55;
        doc.setFillColor(241, 228, 211);
        doc.rect(14, yPos - 6, 182, 8, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(86, 35, 15);
        doc.text("MUESTRA", 16, yPos - 1);
        doc.text("PRENDA", 45, yPos - 1);
        doc.text("CANT.", 100, yPos - 1);
        doc.text("DETALLES Y DESCRIPCIÓN", 120, yPos - 1);

        doc.setDrawColor(139, 58, 27);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;

        listaProductosMemoria.forEach((prod) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(33, 33, 33);

            if (prod.foto) {
                try {
                    doc.addImage(prod.foto, 'JPEG', 16, yPos - 6, 12, 12);
                } catch (e) {
                    doc.text("[Foto]", 16, yPos);
                }
            } else {
                doc.text("[Sin Foto]", 16, yPos);
            }

            doc.setFont("helvetica", "bold");
            doc.text(prod.nombre, 45, yPos);
            
            doc.setTextColor(139, 58, 27);
            doc.text(prod.cantidad.toString(), 103, yPos);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(86, 35, 15);
            
            let detallesCortados = doc.splitTextToSize(prod.detalles, 70);
            doc.text(detallesCortados, 120, yPos);

            yPos += 16; 
        });

        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPos - 6, 196, yPos - 6);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(86, 35, 15);
        doc.text("TOTAL GENERAL SALIDA:", 45, yPos);
        doc.setTextColor(46, 125, 50); 
        doc.text(`${sumaTotalPrendas} prendas`, 100, yPos);

        // ⬇️ SOLUCIÓN PARA MÓVILES: Abre el PDF en una pestaña nativa independiente para forzar la visualización/guardado
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    });
});

function limpiarTabla() {
    window.location.reload();
}
