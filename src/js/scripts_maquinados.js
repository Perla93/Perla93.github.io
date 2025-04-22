// =============================================
// FUNCIONALIDAD DE NAVEGACIÓN ENTRE PÁGINAS
// =============================================

document.addEventListener("DOMContentLoaded", function () {
    // Mapeo de botones y sus páginas destino
    const botonesNavegacion = {
        "btn_aceptar_tipoMaterial": "MAQUINADOS_4_dimencionesAcero.html",
        "btn_aceptar_depreciacionMaquina": "MAQUINADOS_9_costoOperacion.html",
        "btn_siguiente_costosOperacion": "MAQUINADOS_10_costosGenerales.html",
        "btn_aceptar_costoGeneral": "MAQUINADOS_11_resumenCostos.html",
        "btn_Regresar_Menu": "index.html"
    };

    // Configurar event listeners para navegación
    Object.entries(botonesNavegacion).forEach(([id, pagina]) => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener("click", () => window.location.href = pagina);
        }
    });
});

// =============================================
// MANEJO DE CHECKBOXES PARA TIPO DE MAQUINADO
// =============================================
document.addEventListener("DOMContentLoaded", function () {
    const btnAceptar = document.getElementById("btn_aceptar_tipoMaquinado");
    const btnLimpiar = document.getElementById("btn_limpiar_tipoMaquinado");

    // Función para obtener los checkboxes seleccionados
    const getCheckboxesSeleccionados = () => {
        return Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent);
    };

    // Evento para el botón aceptar
    if (btnAceptar) {
        btnAceptar.addEventListener("click", function () {
            const seleccionados = getCheckboxesSeleccionados();

            if (seleccionados.length === 0) {
                Swal.fire({
                    title: '¡Atención!',
                    text: 'Por favor selecciona al menos un tipo de maquinado.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            const especialesSeleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .filter(cb => cb.value === '2')
            .map(cb => cb.id);
        localStorage.setItem('acabadosEspeciales', JSON.stringify(especialesSeleccionados));

            Swal.fire({
                title: 'Tipos de maquinado seleccionados',
                html: `Has seleccionado:<br>• ${seleccionados.join('<br>• ')}`,
                icon: 'info',
                showDenyButton: true,
                confirmButtonText: 'Siguiente',
                denyButtonText: 'Borrar selección',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    denyButton: 'btn btn-danger'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "MAQUINADOS_3_tipoMaterial.html";
                    // window.location.href = "MAQUINADOS_10_costosGenerales.html";
                } else if (result.isDenied) {
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                }
            });
        });
    }

    // Evento para el botón limpiar
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", function () {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            Swal.fire({
                title: '¡Listo!',
                text: 'Todos los checkboxes han sido deseleccionados.',
                icon: 'success',
                confirmButtonText: 'Entendido'
            });
        });
    }
   
});

// Selectores de tipos de material
document.addEventListener("DOMContentLoaded", function () {
    // Selectores del DOM
    const selectorTipoMaterial = document.getElementById("selector1");
    const selectorProveedor = document.getElementById("selector2");
    const selectorSubtipoMaterial = document.getElementById("selector3");

    // Datos de la tabla (estructurados como objetos)
    const datosMateriales = {
        "Aceros para trabajo en frio": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["ARNE", "RIGOR", "SVERKER21", "CALMAX", "CALDIE", "VANADIS 4 EXTRA"],
                BOHLER: ["K 460", "K 305", "K 110", "K 353", "K 340 ISODUR", "K 360 ISODUR", "K 294", "K 390 MICROCLEAN", "K 490 MICROCLEAN", "K 890 MICROCLEAN"],
                AISI: ["O1", "A2", "D2", "A11"]
            }
        },
        "Aceros para moldes plasticos": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["HOLDAX / HOLDER", "IMPAX SUPREME", "NIMAX", "STAVAX", "RAMAX HH", "CORRAX", "MIRRAX", "MIRRAX 40", "UDDEHOLM ROYALLOY", "MOLDMAXHH", "P - 20", "ALUMEC89"],
                BOHLER: ["M 200", "M238", "M315"],
                AISI: ["4140M", "P20M", "420ESR", "420 M"]
            }
        },
        "Aceros para trabajo en caliente": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["ORVAR-2M", "ORVAR SUPREME", "DIEVAR", "W360 ISOBLOC", "QRO-90 SUPREME", "VEX"],
                BOHLER: ["W302", "W302 ISOBLOC", "W360 ISOBLOC", "W400"],
                AISI: ["H13", "H13 PREMIUM", "H11"]
            }
        },
        "Aceros a alta velocidad": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["VANADIS 23"],
                BOHLER: ["S 600", "S 500", "S 705", "S 290 MICROCLEAN", "S 390 MICROCLEAN", "S 692 MICROCLEAN", "S 790 MICROCLEAN"],
                AISI: ["M2", "M-42", "M-35", "M3:2"]
            }
        },
        "Aceros para construccion mecanica": {
            proveedores: ["BOHLER", "AISI"],
            subtipos: {
                BOHLER: ["4140 TRATADO", "4140 RECOCIDO", "1045", "ALUMINIO 5083"],
                AISI: ["4140", "1045"]
            }
        },
        "Aceros inoxidables": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["410", "416", "440C", "304/310", "316/321"]
            }
        },
        "Cobre": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["ELECTROLITICO", "PURO", "SIN OXIGENO"]
            }
        },
        "Bronce": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["SAE 62", "SAE 64", "SAE 65", "SAE 660", "SAE 688"]
            }
        },
        "Laton": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["ALFA", "BETA", "ROJO", "AMARILLO", "MANGANESO"]
            }
        },
        "Aluminio": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["3003", "7075", "1050", "SERIES 1000", "SERIES 2000", "SERIES 3004", "SERIES 4000", "SERIES 5000", "SERIES 6000", "SERIES 7000"]
            }
        },
        "Plasticos de ingenieria": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["POLICARBONATOS", "ACETAL NYLAMID", "SANALITE", "PVC", "PTFE"]
            }
        },
        "Placa comercial": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["A36"]
            }
        },
        "Acero estructural": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["PTR", "IPR", "HSS", "CPS", "POLIN O MONTEN", "LAMINA"]
            }
        }
    };

    // Evento para actualizar los proveedores según el tipo de material seleccionado
    selectorTipoMaterial.addEventListener("change", function () {
        const tipoMaterial = selectorTipoMaterial.value;
        const proveedores = datosMateriales[tipoMaterial]?.proveedores || [];

        // Limpiar y actualizar el selector de proveedores
        selectorProveedor.innerHTML = '<option selected>Elige una opción...</option>';
        proveedores.forEach((proveedor) => {
            const option = document.createElement("option");
            option.value = proveedor;
            option.textContent = proveedor;
            selectorProveedor.appendChild(option);
        });

        // Limpiar el selector de subtipos de material
        selectorSubtipoMaterial.innerHTML = '<option selected>Elige una opción...</option>';
    });

    // Evento para actualizar los subtipos de material según el proveedor seleccionado
    selectorProveedor.addEventListener("change", function () {
        const tipoMaterial = selectorTipoMaterial.value;
        const proveedor = selectorProveedor.value;
        const subtipos = datosMateriales[tipoMaterial]?.subtipos[proveedor] || [];

        // Limpiar y actualizar el selector de subtipos de material
        selectorSubtipoMaterial.innerHTML = '<option selected>Elige una opción...</option>';
        subtipos.forEach((subtipo) => {
            const option = document.createElement("option");
            option.value = subtipo;
            option.textContent = subtipo;
            selectorSubtipoMaterial.appendChild(option);
        });
    });
});


// ========================================================
// DEPRECIACION MAQUINARIA HORA - HOMBRE
// ========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Variables locales solo para mostrar
    let wo = 0;

    // Página 1 – Calcular valorM y guardar
    function calcularvalorM() {
        const sueldoSemanal = parseFloat(document.getElementById('txt_sueldo').value) || 0;
        const porcentaje_wo = parseFloat(document.getElementById('txt_porcentajeTrabajador').value) || 0;
        const costoMaquinaria = parseFloat(document.getElementById('txt_costoMaquina').value) || 0;
        const porcentaje_mt = parseFloat(document.getElementById('txt_porcentajeMaquinaria').value) || 0;

        const horasPorSemana = 48;
        const minutosPorHora = 60;
        wo = sueldoSemanal / (horasPorSemana * minutosPorHora); // Pago por minuto

        const minutosEnUnAnio = 365 * 24 * 60;
        const mt = costoMaquinaria / minutosEnUnAnio; // Costo máquina por minuto

        const valorM = wo + (porcentaje_wo / 100) * wo + mt + (porcentaje_mt / 100) * mt;

        // Guardar sin redondear
        // Página 1 – Al guardar en localStorage
        localStorage.setItem("valorM", parseFloat(valorM.toFixed(3)));
        localStorage.setItem("mt", parseFloat(mt.toFixed(3)));

        console.log("mt guardado:", mt);
        console.log("valorM guardado:", valorM);

        // Mostrar con redondeo visual
        const campoSueldoMin = document.getElementById('txt_sueldoMinuto');
        if (campoSueldoMin) campoSueldoMin.value = wo.toFixed(3);

        const campoMaquinaMin = document.getElementById('txt_costoHoraHombre');
        if (campoMaquinaMin) campoMaquinaMin.value = mt.toFixed(3);

        const campoM = document.getElementById('txt_valorM');
        if (campoM) campoM.value = valorM.toFixed(3);
    }
    function redondear(num, decimales) {
        const factor = Math.pow(10, decimales);
        return Math.floor(num * factor) / factor;
    }

    // Página 2 – Calcular el costo total usando los valores guardados
    function calcularCostosOperacion() {
        const valorM = parseFloat(localStorage.getItem("valorM")) || 0;
        const mt = parseFloat(localStorage.getItem("mt")) || 0;
        console.log("mt recuperado:", mt);
        console.log("valorM recuperado:", valorM);
        const tiempoOcio = parseFloat(document.getElementById('txt_tiempoOcio').value) || 0;
        const tiempoCambio = parseFloat(document.getElementById('txt_tiempoCambio').value) || 0;
        const numeroPzs = parseFloat(document.getElementById('txt_numeroPzs').value) || 0;
        const numeroHerramientas = parseFloat(document.getElementById('txt_numeroHerramientas').value) || 0;
        const costoHerramientas = parseFloat(document.getElementById('txt_costoHerramientas').value) || 0;
        const riesgo = parseFloat(document.getElementById('txt_riesgo').value) || 0;

        const tiempoTotal = (numeroPzs * tiempoOcio) + (numeroPzs * mt) + (numeroHerramientas * tiempoCambio);
        const costoTotal = (valorM * tiempoTotal) + (numeroHerramientas * costoHerramientas) + riesgo;

        const campoCostosOperacion = document.getElementById('txt_costoTotal_costoOperacion');
        if (campoCostosOperacion) {
            campoCostosOperacion.value = redondear(costoTotal, 4);
            localStorage.setItem('costoOperacion', costoTotal)
        } else {
            console.error("Elemento txt_costoTotal_costoOperacion no encontrado");
        }
    }

    // Listeners para actualizar los valores al cambiar inputs
    const camposMetodo1 = ['txt_sueldo', 'txt_porcentajeTrabajador', 'txt_costoMaquina', 'txt_porcentajeMaquinaria'];
    camposMetodo1.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function () {
                calcularvalorM();
                calcularCostosOperacion();
            });
        }
    });

    const camposMetodo2 = ['txt_tiempoOcio', 'txt_tiempoCambio',
        'txt_numeroPzs', 'txt_numeroHerramientas', 'txt_costoHerramientas', 'txt_riesgo'];
    camposMetodo2.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calcularCostosOperacion);
        }
    });

    // Cálculo inicial
    calcularvalorM();
    calcularCostosOperacion();
});



// ========================================================
// COSTOS GENERALES
// ========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del formulario
    const costoKgInput = document.getElementById('txt_costoKg');
    const costoTotalInput = document.getElementById('txt_costoTotal');
    const metalGralInput = document.getElementById('txt_metalGral');
    const costoGralInput = document.getElementById('txt_costoGral');
    const utilidadInput = document.getElementById('txt_utilidad');
    const costoFinalInput = document.getElementById('txt_costoFinal');
    const metalGralLabel = document.getElementById('metalGral');
    const container = document.getElementById('contenedor-acabados');

    // Recuperar datos de localStorage
    function recuperarDatos() {
        // Recuperar Costo KG dimenciones acero
        const costoKg = parseFloat(localStorage.getItem('costoKg')) || 0;
        costoKgInput.value = costoKg.toFixed(3);

        // Recuperar costo total de operación de la página anterior
        const costoOperacion = parseFloat(localStorage.getItem('costoOperacion')) || 0;
        costoTotalInput.value = costoOperacion.toFixed(3);

        // Recuperar tipo de material seleccionado
        const tipoMaterial = localStorage.getItem('tipoMaterial') || '';

        // Calcular automáticamente al cargar
        calcularCostosGenerales();
    }
function generarAcabadoespecial() {
    const container = document.getElementById('contenedor-acabados');
    if (!container) return;

    const idsGuardados = JSON.parse(localStorage.getItem('acabadosEspeciales')) || [];

    idsGuardados.forEach(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) return;

        const nombreElemento = label.textContent.trim();

        const div = document.createElement('div');
        div.className = 'col-md-6';

        div.innerHTML = `
            <label class="form-label">Ingrese ${nombreElemento.toLowerCase()}</label>
            <div class="input-group">
                <input type="number" class="form-control" placeholder="Ingrese dato" id="${nombreElemento.toLowerCase()}">
            </div>
        `;

        container.appendChild(div);
    });
}

    

    // Función para calcular costos generales
    function calcularCostosGenerales() {
        const costoKg = parseFloat(costoKgInput.value) || 0;
        const costoTotal = parseFloat(costoTotalInput.value) || 0;
        const metalGral = parseFloat(metalGralInput.value) || 0;
        const costoGral = parseFloat(costoGralInput.value) || 0;
        const utilidad = parseFloat(utilidadInput.value) || 0;

        // Calcular costo base (costo total + costo por kg)
        const costoBase = costoTotal + (costoTotal * costoKg / 100);

        // Calcular costo con acabado especial
        const costoConAcabado = costoBase + metalGral;

        // Calcular costo con gastos generales
        const costoConGastos = costoConAcabado + (costoConAcabado * costoGral / 100);

        // Calcular costo final con utilidad
        const costoFinal = costoConGastos + (costoConGastos * utilidad / 100);

        // Mostrar resultado
        costoFinalInput.value = costoFinal.toFixed(2);
    }

    // Event listeners para cálculo en tiempo real
    [costoKgInput, costoTotalInput, metalGralInput, costoGralInput, utilidadInput].forEach(input => {
        input.addEventListener('input', calcularCostosGenerales);
    });

    // Botón de navegación
    const btnAceptar = document.getElementById('btn_aceptar_costoGeneral');
    if (btnAceptar) {
        btnAceptar.addEventListener('click', function () {
            // Guardar el costo final en localStorage
            localStorage.setItem('costoFinal', costoFinalInput.value);

            // Navegar a la siguiente página
            window.location.href = "MAQUINADOS_11_resumenCostos.html";
        });
    }

    // Inicializar
    recuperarDatos();
    generarAcabadoespecial();
});

// ========================================================
// RESUMEN COSTOS
// ========================================================

document.addEventListener("DOMContentLoaded", function () {

    function calcularTiempoMaquinado() {
        // Obtener valores y unidades
        const txt_costoTotalGral = parseFloat(document.getElementById('txt_costoTotalGral').value) || 0;
    }
});
