// =============================================
// FUNCIONALIDAD DE NAVEGACIÓN ENTRE PÁGINAS
// =============================================

document.addEventListener("DOMContentLoaded", function() {
    // Mapeo de botones y sus páginas destino
    const botonesNavegacion = {
        "btn_aceptar_tipoMaterial": "MAQUINADOS_4_dimencionesAcero.html",
        "btn_aceptar_dimencionesAcero": "volumenInicial.html",
        "btn_aceptar_volumenInicial": "volumenFinal.html",
        "btn_aceptar_volumenFinal": "tiempoMaquina.html"
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

document.addEventListener("DOMContentLoaded", function() {
    const btnAceptar = document.getElementById("btn_aceptar_tipoMaquinado");
    const btnLimpiar = document.getElementById("btn_limpiar_tipoMaquinado");

    // Función para obtener los checkboxes seleccionados
    const getCheckboxesSeleccionados = () => {
        return Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent);
    };

    // Evento para el botón aceptar
    if (btnAceptar) {
        btnAceptar.addEventListener("click", function() {
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
                } else if (result.isDenied) {
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                }
            });
        });
    }

    // Evento para el botón limpiar
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", function() {
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
                UDDEHOLM: ["ORVAR-2M", "ORVAR SUPREME", "DIEVAR","W360 ISOBLOC","QRO-90 SUPREME", "VEX"],
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
        

    // =============================================
    // CALCULADORA DE DIMENSIONES DE ACERO
    // =============================================
document.addEventListener("DOMContentLoaded", function() {
    // =============================================
    // CONFIGURACIONES Y CONSTANTES
    // =============================================
    const CONFIG = {
        imagenes: {
            1: '../img/hexagono.png',
            2: '../img/cilindro.jpeg',
            3: '../img/tubo_redondo.jpg',
            4: '../img/cuadrado.png',
            5: '../img/tubo_cuadrado.jpg',
            6: '../img/perfil_t.png',
            7: '../img/perfil_doble_t.png',
            8: '../img/perfil_u.png',
            9: '../img/angulo.png',
            10: '../img/pletina.avif',
            11: '../img/chapa.jpg'
        },
        densidades: {
            'acero': 7.85,
            'aluminio': 2.73,
            'laton': 8.55,
            'cobre': 8.93,
            'bronce': 8.88,
            'zinc': 7.2,
            'chromo': 7.1,
            'dirigir': 11.37,
            'hierro': 7.86,
            'oro': 19.36,
            'magnesio': 1.7,
            'niquel': 8.85,
            'titanio': 4.5,
            'estano': 7.26,
            'teflon': 2.2,
            'plata': 10.5,
            'platino': 21.45,
            'inox_304_310': 7.92,
            'inox_316_321': 7.94,
            'inox_410_430': 7.71,
            'circonio': 6.51,
            'molibdeno': 10.28
        },
        camposPorFigura: {
            1: { // HEXÁGONO
                longitud: ['ancho B', 'longitud', 'cantidad'],
                peso: ['ancho B', 'peso', 'cantidad']
            },
            2: { // REDONDO
                longitud: ['diametro D', 'longitud', 'cantidad'],
                peso: ['diametro D', 'peso', 'cantidad']
            },
            3: { // TUBO REDONDO
                longitud: ['diametro D', 'espesor T', 'longitud', 'cantidad'],
                peso: ['diametro D', 'espesor T', 'peso', 'cantidad']
            },
            4: { // CUADRADO
                longitud: ['alto A', 'longitud', 'cantidad'],
                peso: ['alto A', 'peso', 'cantidad']
            },
            5: { // TUBO CUADRADO
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            },
            6: { // PERFIL T
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            },
            7: { // PERFIL DOBLE T
                longitud: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'peso', 'cantidad']
            },
            8: { // PERFIL U
                longitud: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'peso', 'cantidad']
            },
            9: { // ANGULO
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            },
            10: { // PLETINA
                longitud: ['alto A', 'ancho B', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'peso', 'cantidad']
            },
            11: { // CHAPA
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            }
        },
        conversionUnidades: {
            '1': val => val,       // mm
            '2': val => val * 10,   // cm
            '3': val => val * 25.4,  // in
            '4': val => val * 304.8  // ft
        }
    };

    // =============================================
    // ELEMENTOS DEL DOM
    // =============================================
    const elementos = {
        selecFigura: document.getElementById('selec_figura'),
        imgFigura: document.getElementById('img_figura'),
        btnLimpiar: document.getElementById('btn_limpiar_dimencionAcero'),
        inputs: {
            diametro: document.getElementById('number_diametro'),
            alto: document.getElementById('number_alto'),
            ancho: document.getElementById('number_ancho'),
            espesorT: document.getElementById('number_espesorT'),
            espesorS: document.getElementById('number_espesorS'),
            longitud: document.getElementById('number_longitud'),
            peso: document.getElementById('number_peso'),
            cantidad: document.getElementById('number_cantidad'),
            precio: document.getElementById('number_precio')
        },
        botonesModo: {
            longitud: document.getElementById('btn_por_longitud'),
            peso: document.getElementById('btn_por_peso')
        },
        densidadMaterial: document.getElementById('densidad_material'),
        selecMaterial: document.getElementById('selec_material'),
        resultados: {
            longitud: document.getElementById('resultados_longitud'),
            peso: document.getElementById('resultados_peso')
        }
    };

    // =============================================
    // ESTADO DE LA APLICACIÓN
    // =============================================
    let estado = {
        modoCalculo: 'longitud',
        figuraActual: '1',
        materialActual: 'acero'
    };

    // =============================================
    // FUNCIONES UTILITARIAS
    // =============================================
    const getValorInput = (input, conUnidad = false) => {
        const valor = parseFloat(input.value) || 0;
        if (!conUnidad) return valor;

        const unidad = document.querySelector(`#${input.id} + select`)?.value || '1';
        return CONFIG.conversionUnidades[unidad](valor);
    };

    const mostrarElementos = (elementosMostrar) => {
        document.querySelectorAll('.input-dinamico').forEach(el => el.style.display = 'none');
        elementosMostrar.forEach(campo => {
            const elemento = document.querySelector(`[data-campo="${campo}"]`);
            if (elemento) elemento.style.display = 'block';
        });
    };

    // =============================================
    // FUNCIONES PRINCIPALES
    // =============================================
    const actualizarInterfaz = () => {
        // Actualizar campos visibles
        const campos = CONFIG.camposPorFigura[estado.figuraActual][estado.modoCalculo];
        mostrarElementos([...campos, 'cantidad']);

        // Actualizar visibilidad de resultados
        elementos.resultados.longitud.style.display = estado.modoCalculo === 'longitud' ? 'block' : 'none';
        elementos.resultados.peso.style.display = estado.modoCalculo === 'peso' ? 'block' : 'none';

        // Actualizar visibilidad de precio
        document.getElementById('precio-kg-container').style.display = estado.modoCalculo === 'peso' ? 'none' : 'block';
    };

    const calcularPorLongitud = (valores, densidad) => {
        const { altoA, anchoB, diametro, espesorT, espesorS, longitud, cantidad, precioKg } = valores;
        let pesoUnitario = 0;

        switch(estado.figuraActual) {
            case '1': // HEXÁGONO
                pesoUnitario = (2.598 * (anchoB ** 2) * longitud * densidad) / 1000000;
                break;
            case '2': // REDONDO
                pesoUnitario = (Math.PI * (diametro ** 2) / 4 * longitud * densidad) / 1000000;
                break;
            case '3': // TUBO REDONDO
                const diametroInterior = diametro - 2 * espesorT;
                pesoUnitario = (Math.PI * (diametro ** 2 - diametroInterior ** 2) / 4 * longitud * densidad) / 1000000;
                break;
            case '4': // CUADRADO
                pesoUnitario = (altoA * altoA * longitud * densidad) / 1000000;
                break;
            case '5': // TUBO CUADRADO
                const areaExterior = altoA * anchoB;
                const areaInterior = (altoA - 2*espesorT) * (anchoB - 2*espesorT);
                pesoUnitario = ((areaExterior - areaInterior) * longitud * densidad) / 1000000;
                break;
            case '6': // PERFIL T
            case '9': // ANGULO
                pesoUnitario = ((altoA * espesorT) + ((anchoB - espesorT) * espesorT)) * longitud * densidad / 1000000;
                break;
            case '7': // PERFIL DOBLE T
                pesoUnitario = ((anchoB * espesorS * 2) + ((altoA - 2*espesorS) * espesorT)) * longitud * densidad / 1000000;
                break;
            case '8': // PERFIL U
                pesoUnitario = ((anchoB * espesorS * 2) + ((altoA - espesorS) * espesorT)) * longitud * densidad / 1000000;
                break;
            case '10': // PLETINA
                pesoUnitario = (altoA * anchoB * longitud * densidad) / 1000000;
                break;
            case '11': // CHAPA
                pesoUnitario = (altoA * anchoB * espesorT * densidad) / 1000;
                break;
        }

        const pesoTotal = pesoUnitario * cantidad;
        const precioTotal = pesoTotal * precioKg;

        // Actualizar resultados
        document.getElementById('resultado_peso').value = pesoUnitario.toFixed(2);
        document.getElementById('resultado_peso_total').value = pesoTotal.toFixed(2);
        document.getElementById('resultado_precio_total').value = precioTotal.toFixed(2);
    };

    const calcularPorPeso = (valores, densidad) => {
        const { altoA, anchoB, diametro, espesorT, espesorS, peso, cantidad } = valores;
        let longitud = 0;

        switch(estado.figuraActual) {
            case '1': // HEXÁGONO
                longitud = (peso * 1000000) / (2.598 * (anchoB ** 2) * densidad);
                break;
            case '2': // REDONDO
                longitud = (peso * 1000000) / (Math.PI * (diametro ** 2) / 4 * densidad);
                break;
            case '3': // TUBO REDONDO
                const diametroInterior = diametro - 2 * espesorT;
                longitud = (peso * 1000000) / (Math.PI * (diametro ** 2 - diametroInterior ** 2) / 4 * densidad);
                break;
            case '4': // CUADRADO
                longitud = (peso * 1000000) / (altoA * altoA * densidad);
                break;
            case '5': // TUBO CUADRADO
                const areaExterior = altoA * anchoB;
                const areaInterior = (altoA - 2*espesorT) * (anchoB - 2*espesorT);
                longitud = (peso * 1000000) / ((areaExterior - areaInterior) * densidad);
                break;
            case '6': // PERFIL T
            case '9': // ANGULO
                longitud = (peso * 1000000) / (((altoA * espesorT) + ((anchoB - espesorT) * espesorT)) * densidad);
                break;
            case '7': // PERFIL DOBLE T
                longitud = (peso * 1000000) / (((anchoB * espesorS * 2) + ((altoA - 2*espesorS) * espesorT)) * densidad);
                break;
            case '8': // PERFIL U
                longitud = (peso * 1000000) / (((anchoB * espesorS * 2) + ((altoA - espesorS) * espesorT)) * densidad);
                break;
            case '10': // PLETINA
                longitud = (peso * 1000000) / (altoA * anchoB * densidad);
                break;
            case '11': // CHAPA
                longitud = (peso * 1000) / (altoA * anchoB * espesorT * densidad);
                break;
        }

        // Convertir de mm a metros
        longitud = longitud / 1000;
        const longitudTotal = longitud * cantidad;

        // Actualizar resultados
        document.getElementById('resultado_longitud').value = longitud.toFixed(2);
        document.getElementById('resultado_longitud_total').value = longitudTotal.toFixed(2);
    };

    const calcularResultados = () => {
        const valores = {
            altoA: getValorInput(elementos.inputs.alto, true),
            anchoB: getValorInput(elementos.inputs.ancho, true),
            diametro: getValorInput(elementos.inputs.diametro, true),
            espesorT: getValorInput(elementos.inputs.espesorT, true),
            espesorS: getValorInput(elementos.inputs.espesorS, true),
            longitud: getValorInput(elementos.inputs.longitud, true),
            peso: getValorInput(elementos.inputs.peso),
            cantidad: getValorInput(elementos.inputs.cantidad),
            precioKg: getValorInput(elementos.inputs.precio)
        };

        const densidad = parseFloat(elementos.densidadMaterial.value) || 0;

        if (estado.modoCalculo === 'longitud') {
            calcularPorLongitud(valores, densidad);
        } else {
            calcularPorPeso(valores, densidad);
        }
    };

    const limpiarFormulario = () => {
        // Limpiar inputs
        Object.values(elementos.inputs).forEach(input => {
            if (input) input.value = input.id === 'number_cantidad' ? '1' : '';
        });

        // Restablecer estado inicial
        estado = {
            modoCalculo: 'longitud',
            figuraActual: '1',
            materialActual: 'acero'
        };

        // Actualizar interfaz
        elementos.selecFigura.value = '1';
        elementos.imgFigura.src = CONFIG.imagenes['1'];
        elementos.selecMaterial.value = 'acero';
        elementos.densidadMaterial.value = CONFIG.densidades['acero'];
        elementos.botonesModo.longitud.classList.add('active');
        elementos.botonesModo.peso.classList.remove('active');

        // Limpiar resultados
        document.querySelectorAll('#resultados_longitud input, #resultados_peso input').forEach(input => {
            input.value = '';
        });

        actualizarInterfaz();
    };

    // =============================================
    // EVENT LISTENERS
    // =============================================
    elementos.selecFigura.addEventListener('change', function() {
        estado.figuraActual = this.value;
        elementos.imgFigura.src = CONFIG.imagenes[this.value] || '';
        actualizarInterfaz();
        calcularResultados();
    });

    elementos.selecMaterial.addEventListener('change', function() {
        estado.materialActual = this.value;
        elementos.densidadMaterial.value = CONFIG.densidades[this.value] || '0';
        calcularResultados();
    });

    elementos.botonesModo.longitud.addEventListener('click', () => {
        estado.modoCalculo = 'longitud';
        elementos.botonesModo.longitud.classList.add('active');
        elementos.botonesModo.peso.classList.remove('active');
        actualizarInterfaz();
        calcularResultados();
    });

    elementos.botonesModo.peso.addEventListener('click', () => {
        estado.modoCalculo = 'peso';
        elementos.botonesModo.peso.classList.add('active');
        elementos.botonesModo.longitud.classList.remove('active');
        actualizarInterfaz();
        calcularResultados();
    });

    // Eventos para inputs (cálculos en tiempo real)
    document.querySelectorAll('#campos_dimensiones input, #campos_dimensiones select').forEach(input => {
        input.addEventListener('input', calcularResultados);
    });


    elementos.btnLimpiar.addEventListener('click', limpiarFormulario);

    // =============================================
    // INICIALIZACIÓN
    // =============================================
    elementos.densidadMaterial.value = CONFIG.densidades['acero'];
    actualizarInterfaz();
    calcularResultados(); // Calcular resultados iniciales
});