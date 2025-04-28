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

    if (btnAceptar) {
        btnAceptar.addEventListener("click", function () {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

            if (checkboxes.length === 0) {
                Swal.fire({
                    title: '¡Atención!',
                    text: 'Por favor selecciona al menos un tipo de maquinado.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            const todosSeleccionados = [];
            const value2Seleccionados = [];

            checkboxes.forEach(cb => {
                const label = cb.nextElementSibling?.textContent.trim() || "Opción sin nombre";
                todosSeleccionados.push(label);
                if (cb.value === "2") {
                    value2Seleccionados.push(label);
                }
            });

            Swal.fire({
                title: 'Tipos de maquinado seleccionados',
                html: `Has seleccionado:<br>• ${todosSeleccionados.join('<br>• ')}`,
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
                    localStorage.setItem("acabadosEspeciales", JSON.stringify(value2Seleccionados));
                    localStorage.setItem("tiposmaquinados", JSON.stringify(todosSeleccionados));
                    window.location.href = "MAQUINADOS_3_tipoMaterial.html";
                    // window.location.href = "MAQUINADOS_10_costosGenerales.html";
                } else if (result.isDenied) {
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                }
            });
        });
    }

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
    selectorSubtipoMaterial.addEventListener("change", function () {
        if (selectorTipoMaterial.value && selectorSubtipoMaterial.value) {
            localStorage.setItem("materialSeleccionado",
                `${selectorTipoMaterial.value} : ${selectorSubtipoMaterial.value}`);
        }
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

        const minutosEnUnAnio = 52 * 48 * 60;
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

    // Costos Operación

    function calcularCostosOperacion() {
        const valorM = parseFloat(localStorage.getItem("valorM")) || 0;
        const mt = parseFloat(localStorage.getItem("mt")) || 0;  //tiempo de maquinado, de volumen 
        const tiempoOcio = parseFloat(document.getElementById('txt_tiempoOcio').value) || 0;
        const tiempoCambio = parseFloat(document.getElementById('txt_tiempoCambio').value) || 0;
        const numeroPzs = parseFloat(document.getElementById('txt_numeroPzs').value) || 0;
        const numeroHerramientas = parseFloat(document.getElementById('txt_numeroHerramientas').value) || 0;
        const costoHerramientas = parseFloat(document.getElementById('txt_costoHerramientas').value) || 0;
        const riesgo = parseFloat(document.getElementById('txt_riesgo').value) || 0;
        const costoTotal = ((valorM * ((numeroPzs * tiempoOcio) + (numeroPzs * mt) + (numeroHerramientas * tiempoCambio))) + (numeroHerramientas * costoHerramientas)) * (riesgo / 100);

        localStorage.setItem('costoHerramientas', costoHerramientas.toFixed(3));

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
    const contenedorAcabados = document.getElementById("inputs-acabados");
    const logistica = document.getElementById('txt_logistica');
    const administracion = document.getElementById('txt_administracion');
    const utilidadInput = document.getElementById('txt_utilidad');
    const IVAInput = document.getElementById('txt_IVA');
    const costoFinalsinIVAInput = document.getElementById('txt_costoFinalsinIVA');
    const costoFinalconIVAInput = document.getElementById('txt_costoFinalconIVA');

 

    // Recuperar datos de localStorage
    function recuperarDatos() {
        const costoKg = parseFloat(localStorage.getItem('costoKg')) || 0;
        costoKgInput.value = costoKg.toFixed(3);

        const costoOperacion = parseFloat(localStorage.getItem('costoOperacion')) || 0;
        costoTotalInput.value = costoOperacion.toFixed(3);

        const acabados = JSON.parse(localStorage.getItem("acabadosEspeciales")) || [];

        // Limpia antes de volver a generar (por si acaso)
        contenedorAcabados.innerHTML = '';

        acabados.forEach(nombre => {
            const div = document.createElement("div");
            div.className = "col-md-6 mb-3"; // Mejor que tenga márgenes

            const label = document.createElement("label");
            label.className = "form-label";
            label.textContent = nombre;

            const input = document.createElement("input");
            input.type = "number";
            input.className = "form-control";
            input.placeholder = "Ingrese el costo";
            input.id = "txt_" + nombre.replace(/\s+/g, '_'); // Corrige si hay espacios

            div.appendChild(label);
            div.appendChild(input);
            contenedorAcabados?.appendChild(div);

            // Agrega el evento de input
            input.addEventListener('input', calcularCostosGenerales);
        });

        calcularCostosGenerales();
 
    }

    function calcularCostosGenerales() {
        const costoKg = parseFloat(costoKgInput.value) || 0;
        const costoOperacion = parseFloat(costoTotalInput.value) || 0;
        const logisticaCosto = parseFloat(logistica.value) || 0;
        const administracionCosto = parseFloat(administracion.value) || 0;
        const utilidadPorcentaje = parseFloat(utilidadInput.value) || 0;
        const ivaPorcentaje = parseFloat(IVAInput.value) || 0;

        let costoBase = costoKg + costoOperacion + logisticaCosto + administracionCosto;

        // Sumar costos de los inputs de acabados especiales
        const inputsAcabados = document.querySelectorAll("#inputs-acabados input");
        inputsAcabados.forEach(input => {
            const valor = parseFloat(input.value);
            if (!isNaN(valor)) {
                costoBase += valor;
            }
        });

        let costoConUtilidad = costoBase + (costoBase * utilidadPorcentaje / 100);

        costoFinalsinIVAInput.value = costoConUtilidad.toFixed(2);

        let costoConIVA = costoConUtilidad + (costoConUtilidad * ivaPorcentaje / 100);
        costoFinalconIVAInput.value = costoConIVA.toFixed(2);
    }

    // Inputs fijos con eventos
    [costoKgInput, costoTotalInput, utilidadInput, logistica, administracion, IVAInput].forEach(input => {
        input.addEventListener('input', calcularCostosGenerales);
    });

    const btnAceptar = document.getElementById('btn_aceptar_costoGeneral');
if (btnAceptar) {
    btnAceptar.addEventListener('click', function () {
        // Guardar el costo final
        localStorage.setItem('logistica', parseFloat(logistica.value).toString());
        localStorage.setItem('administracion', administracion.toFixed(3));
        localStorage.setItem('costoFinalsinIVA', costoFinalsinIVAInput.value);
        localStorage.setItem('costoFinalconIVA', costoFinalconIVAInput.value);

        // Guardar los costos de acabados
        const inputsAcabados = document.querySelectorAll("#inputs-acabados input");
        const costosAcabados = [];

        inputsAcabados.forEach(input => {
            const nombre = input.previousElementSibling.textContent.trim(); // el label anterior
            const costo = parseFloat(input.value) || 0;
            costosAcabados.push({ nombre, costo });
        });

        localStorage.setItem('costosAcabados', JSON.stringify(costosAcabados));

        // Ir al resumen
        window.location.href = "MAQUINADOS_11_resumenCostos.html";
    });
}

    recuperarDatos();
});




// ========================================================
// RESUMEN COSTOS
// ========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del formulario
    const costoExtras = document.getElementById('txt_CostoExtras');
    const costoTotalGral = document.getElementById('txt_costoTotalGral');


    function recuperarDatos() {
        const listaMaquinados = document.getElementById("lista-maquinados");
        const maquinados = JSON.parse(localStorage.getItem("tiposmaquinados")) || [];
        // Mostrar los tipos de maquinado en una lista
        if (listaMaquinados && maquinados.length > 0) {
            maquinados.forEach(nombre => {
                const li = document.createElement("li");
                li.className = "list-group-item"; // opcional para estilo Bootstrap
                li.textContent = nombre;
                listaMaquinados.appendChild(li);
            });
        }

        // Recuperar costos del localStorage y colocarlos en sus inputs
        const costoKgInput = document.getElementById('txt_CostoKg');
        const costoTotalInput = document.getElementById('txt_costoTotal');
        const tiempoMaquinado = document.getElementById("txt_TiempoMaquinado");

        const costoKg = parseFloat(localStorage.getItem('costoKg')) || 0;
        if (costoKgInput) costoKgInput.value = costoKg.toFixed(3);

        const costoOperacion = parseFloat(localStorage.getItem('costoOperacion')) || 0;
        if (costoTotalInput) costoTotalInput.value = costoOperacion.toFixed(3);

        const materialGuardado = localStorage.getItem("materialSeleccionado");
        if (materialGuardado) {
            const elementoResultado = document.getElementById("txt_tipoMaterial");
            elementoResultado.textContent = materialGuardado;
            // Opcional: limpiar el localStorage después de usarlo
            localStorage.removeItem("materialSeleccionado");
        }
        const tiempoGuardado = parseFloat(localStorage.getItem('tiempoMaquinadoGuardado'));
        if (tiempoGuardado) {
            // Mostrarlo en un elemento HTML (ej: <span id="tiempoMostrado"></span>)
            document.getElementById('txt_TiempoMaquinado').textContent = tiempoGuardado;
        }

        const valorM = parseFloat(localStorage.getItem("valorM")) || 0;
        if (tiempoMaquinado) tiempoMaquinado.value = valorM.toFixed(3);

        const volumenFinal = localStorage.getItem('volumenFinalGuardado');

        if (volumenFinal) {
            // Mostrar en un elemento HTML (ej: <span id="volumenFinalMostrado"></span>)
            document.getElementById('volumenFinalMostrado').textContent = volumenFinal;
        }

        const avanceData = JSON.parse(localStorage.getItem('avanceGuardado'));
        if (avanceData) {
            const mensajeAvance = `Avance: ${avanceData.valor} ${avanceData.unidad}`;
            document.getElementById('txt_avance').textContent = mensajeAvance;
        }

        const costoHerramientasGuardado = parseFloat(localStorage.getItem('costoHerramientas')) || 0;
        document.getElementById('txt_CostoTotalHerramienta').value = costoHerramientasGuardado.toFixed(3);
        
        const logistica = parseFloat(localStorage.getItem('logistica')) || 0;
        document.getElementById('txt_logistica').value = logistica.toFixed(3);

        const administracion = parseFloat(localStorage.getItem('administracion')) || 0;
        document.getElementById('txt_administracion').value = administracion.toFixed(3);

        // Mostrar la tabla de costos de acabados
const costosAcabados = JSON.parse(localStorage.getItem('costosAcabados')) || [];
const tablaCostos = document.getElementById('tabla-costos-acabados').querySelector('tbody');

costosAcabados.forEach(item => {
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = item.nombre;

    const tdCosto = document.createElement('td');
    tdCosto.textContent = `$${item.costo.toFixed(2)}`;

    tr.appendChild(tdNombre);
    tr.appendChild(tdCosto);
    tablaCostos.appendChild(tr);
});



    }

    recuperarDatos();
});
