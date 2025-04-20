//direccionamiento a tipos de maquinados
document.addEventListener("DOMContentLoaded", function () { 
    // Seleccionar el botón por su ID correcto
    const btnMaquinados = document.getElementById("btn_maquinados"); 

    if (btnMaquinados) {
        btnMaquinados.addEventListener("click", function () {
            window.location.href = "MAQUINADOS_2_tipoMaquinados.html";
        });
    }
});

