// FUNCIONALIDAD DE NAVEGACIÓN ENTRE PÁGINAS Y ALMACENAMIENTO
// ========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Mapeo de botones y sus páginas destino
    const botonesNavegacion = {
        "btn_siguiene_volumenInicial": "MAQUINADOS_6_volumenFinal.html",
        "btn_aceptar_volumenFinal": "MAQUINADOS_7_tiempoMaquinado.html",
        "btn_aceptar_tiempoMaquina": "MAQUINADOS_8_depreciacionMaquinaria.html"
    };

    // Configurar event listeners para navegación
    Object.entries(botonesNavegacion).forEach(([id, pagina]) => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener("click", function () {
                // Guardar datos antes de navegar
                if (id === "btn_siguiene_volumenInicial") {
                    const volumenInicial = document.getElementById('txt_volumenI').value;

                    localStorage.setItem('volumenInicial', volumenInicial);
                    localStorage.setItem('volumenFinalAcumulado', '0'); // Inicializar acumulador
                }
                window.location.href = pagina;
            });
        }
    });

    // Verificar si estamos en la página de volumen final
    if (window.location.href.includes("MAQUINADOS_6_volumenFinal.html")) {
        const checkOtroVolumen = document.getElementById('btn_otroVolumen');
        const btnAceptar = document.getElementById('btn_aceptar_volumenFinal');

        if (checkOtroVolumen && btnAceptar) {
            btnAceptar.addEventListener("click", function () {
                // Obtener el volumen actual
                const volumenActual = parseFloat(document.getElementById('txt_volumenI').value) || 0;

                // Obtener el acumulado actual
                let acumulado = parseFloat(localStorage.getItem('volumenFinalAcumulado')) || 0;

                // Sumar el volumen actual al acumulado
                acumulado += volumenActual;

                // Guardar el nuevo acumulado
                localStorage.setItem('volumenFinalAcumulado', acumulado.toString());
                localStorage.setItem('volumenFinalGuardado', document.getElementById('mostrar_volumenFinal').value);

                // Verificar si necesita añadir otro volumen
                if (checkOtroVolumen.checked) {
                    // Recargar la página para nuevo volumen
                    window.location.reload();
                } else {
                    // Navegar a la siguiente página
                    window.location.href = botonesNavegacion["btn_aceptar_volumenFinal"];
                }
            });
        }
    }

    if (window.location.href.includes("MAQUINADOS_7_tiempoMaquinado.html")) {
        // Obtener los valores guardados
        const volumenInicial = parseFloat(localStorage.getItem('volumenInicial')) || 0;
        const volumenFinal = parseFloat(localStorage.getItem('volumenFinalAcumulado')) || 0;
        const diferencia = volumenInicial - volumenFinal;
        // Factores de conversión para volumen (de mm³ a la unidad seleccionada)
        const factoresVolumen = {
            '1e-9': 1,                   // mm³ (sin conversión)
            '1e-6': 1e3,                  // cm³
            '0.001': 1e6,                  // dm³
            '1': 1e9,                      // m³
            '1.6387064e-5': 1 / 1.6387064e-5,// in³
            '0.028316846592': 1 / 0.028316846592, // ft³
            '0.764554857984': 1 / 0.764554857984, // yd³
            '1e-3': 1e3,                   // ml
            '0.001': 1e6                   // l
        };

        // Función para convertir y mostrar los volúmenes
        function convertirVolumenes() {
            const factor = parseFloat(document.getElementById('unidad_volumen').value);
            const factorConversion = factoresVolumen[factor.toString()] || 1;

            document.getElementById('mostrar_volumenInicial').value = (volumenInicial * factorConversion).toFixed(3);
            document.getElementById('mostrar_volumenFinal').value = (volumenFinal * factorConversion).toFixed(3);
            document.getElementById('mostrar_diferencia').value = (diferencia * factorConversion).toFixed(3);
        }

        // Configurar event listener para cambios en la unidad de volumen
        document.querySelectorAll('#unidad_volumen').forEach(select => {
            select.addEventListener('change', convertirVolumenes);
        });

        // Mostrar los valores iniciales
        convertirVolumenes();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Factores de conversión para avance
    const unidadesAvance = {
        mm_rev: 1,           // milímetros por revolución (estándar)
        mm_min: null,        // se calcula con las RPM
        in_rev: 25.4,        // 1 pulgada = 25.4 mm
        in_min: null         // se calcula con las RPM
    };

    // Factores de conversión para velocidad de corte
    const unidadesVelocidad = {
        m_min: 1,            // metros por minuto (estándar)
        mm_min: 0.001,       // 1 mm/min = 0.001 m/min
        ft_min: 0.3048,      // 1 pie = 0.3048 metros
        in_min: 0.0254       // 1 pulgada = 0.0254 metros
    };

    // Función para convertir avance a mm/rev
    function convertirAvance(valor, unidad, rpm) {
        switch (unidad) {
            case "mm_rev":
                return valor;
            case "in_rev":
                return valor * 25.4; // Pulgadas a mm
            case "mm_min":
                return rpm > 0 ? valor / rpm : 0; // mm/min → mm/rev
            case "in_min":
                return rpm > 0 ? (valor * 25.4) / rpm : 0; // pulg/min → mm/rev
            default:
                return valor;
        }
    }

    // Función para convertir velocidad a m/min
    function convertirVelocidad(valor, unidad) {
        return valor * (unidadesVelocidad[unidad] || 1);
    }

    // Función principal de cálculo
    function calcularTiempoMaquinado() {
        // Obtener valores y unidades
        const avance = parseFloat(document.getElementById('txt_avance').value) || 0;
        const velocidad = parseFloat(document.getElementById('txt_velocidadCorte').value) || 0;
        const unidadAvance = document.getElementById('unidad_avance').value;
        const unidadVelocidad = document.getElementById('unidad_velocidad').value;
        const diferencia = parseFloat(document.getElementById('mostrar_diferencia').value) || 0; // [mm³]

        // Convertir velocidad a mm/min (ya que el volumen está en mm³)
        const velocidadConvertida = convertirVelocidad(velocidad, unidadVelocidad) * 100;

        // Convertir avance a mm/min
        const avanceConvertido = convertirAvance(avance, unidadAvance, 1) * 10;

        // Calcular tiempoMaquinado para torneado cilíndrico
        // Fórmula corregida: tiempo = diferencia / (avance * velocidad)
        const tiempoMaquinado = (avanceConvertido > 0 && velocidadConvertida > 0)
            ? diferencia / (avanceConvertido * velocidadConvertida)
            : 0;
            
            if (!isNaN(avance)) {
                localStorage.setItem('avanceGuardado', JSON.stringify({
                    valor: avance,
                    unidad: unidadAvance
                }));
            }

        // Mostrar resultado en 'txt_tiempoMaquinado' si el elemento existe
        const campoTiempo = document.getElementById('txt_tiempoMaquinado');
        if (campoTiempo) {
            campoTiempo.value = tiempoMaquinado.toFixed(3); // Más decimales para precisión
            if (!isNaN(campoTiempo)) { // Solo guardar si es un número válido
                localStorage.setItem('tiempoMaquinadoGuardado', campoTiempo);
            }
        }
    }


    // Configurar event listeners para cálculo en tiempo real
    const campos = [
        'txt_avance', 'txt_velocidadCorte',
        'mostrar_diferencia', 'unidad_avance', 'unidad_velocidad'
    ];

    campos.forEach(id => {
        document.getElementById(id).addEventListener('input', calcularTiempoMaquinado);
    });

    // Ejecutar cálculo inicial (opcional)
    calcularTiempoMaquinado();
});




document.addEventListener("DOMContentLoaded", function () {
    const figuraSelect = document.getElementById('selec_figura');
    const container = document.getElementById('dimensiones-container');
    const txtVolumenI = document.getElementById('txt_volumenI');
    const unidadVolumenSelect = document.getElementById('unidad_volumen');
    let figuraActual = '';
    const imagenes = {
        cubo: '../img/cubo.png',
        prisma_rectangular: '../img/prisma_rectangular.png',
        esfera: '../img/esfera.png',
        hemisferio: '../img/hemisferio.png',
        casquete_esferico: '../img/casquete_esferico.png',
        elipsoide: '../img/elipsoide.png',
        cilindro: '../img/cilindro.png',
        cilindro_hueco: '../img/cilindro_hueco.png',
        capsula: '../img/capsula.png',
        cono: '../img/cono.png',
        tronco_conico: '../img/tronco_conico.png',
        piramide: '../img/piramide.png',
        piramide_truncada: '../img/piramide_truncada.png',
        prisma_triangular: '../img/base_altura.png', // valor por defecto, luego se cambia según método
    };
    const imagenesTriangulo = {
        base_altura: '../img/base_altura.png',
        tres_lados: '../img/tres_lados.png',
        dos_lados_angulo: '../img/dos_lado_un_angulo.png',
        lado_dos_angulos: '../img/dos_angulos_un_lado.png'
    };
    // Valores de conversión a metros (unidad base)
    const unidades = {
        longitud: [
            { value: '0.001', text: 'milímetros (mm)', selected: true },
            { value: '0.01', text: 'centímetros (cm)' },
            { value: '1', text: 'metros (m)' },
            { value: '0.0254', text: 'pulgadas (in)' },
            { value: '0.3048', text: 'pies (ft)' },
            { value: '1000', text: 'kilómetros (km)' },
            { value: '1609.344', text: 'millas (mi)' },
            { value: '1852', text: 'millas náuticas (nmi)' },
            { value: '28316.8466', text: 'pies / pulgadas (ft / in)' },
            { value: '1000000', text: 'metros / centímetros (m / cm)' }
        ],
        volumen: [
            { value: '1e-9', text: 'milímetros cúbicos (mm³)', selected: true },
            { value: '1e-6', text: 'centímetros cúbicos (cm³)' },
            { value: '0.001', text: 'decímetros cúbicos (dm³)' },
            { value: '1', text: 'metros cúbicos (m³)' },
            { value: '1.6387064e-5', text: 'pulgadas cúbicas (in³)' },
            { value: '0.028316846592', text: 'pies cúbicos (ft³)' },
            { value: '0.764554857984', text: 'yardas cúbicas (yd³)' },
            { value: '0.001', text: 'litros (l)' }
        ],
        angulo: [
            { value: 'deg', text: 'grados (º)', selected: true },
            { value: 'rad', text: 'radianes (rad)' },
            { value: 'gradian', text: 'grados centesimales (gon)' },
            { value: 'turn', text: 'revoluciones (rev)' },
            { value: 'minute_of_arc', text: 'minutos de arco (arcmin)' },
            { value: 'second_of_arc', text: 'segundos de arco (arcseg)' },
            { value: 'miliradian', text: 'milliradianes (mrad)' },
            { value: 'microradian', text: 'microradianes (μrad)' },
            { value: 'pirad', text: 'π radianes (× π rad)' }
        ]

    };

    const figurasConfig = {
        cubo: [
            { id: 'lado', label: 'Lado (a)', unidad: 'longitud' }
        ],
        prisma_rectangular: [
            { id: 'longitud', label: 'Longitud (l)', unidad: 'longitud' },
            { id: 'anchura', label: 'Anchura (w)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        esfera: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' }
        ],
        hemisferio: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' }
        ],
        casquete_esferico: [
            { id: 'radioBase', label: 'Radio de la base (a)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' },
            { id: 'radioEsfera', label: 'Radio de la esfera (r)', unidad: 'longitud' }
        ],
        elipsoide: [
            { id: 'semiejeA', label: 'Semieje a', unidad: 'longitud' },
            { id: 'semiejeB', label: 'Semieje b', unidad: 'longitud' },
            { id: 'semiejeC', label: 'Semieje c', unidad: 'longitud' }
        ],
        cilindro: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        cilindro_hueco: [
            { id: 'radioExterior', label: 'Radio exterior (R)', unidad: 'longitud' },
            { id: 'radioInterior', label: 'Radio interior (r)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        capsula: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' },
            { id: 'alturaCilindro', label: 'Altura (h)', unidad: 'longitud' }
        ],
        cono: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        tronco_conico: [
            { id: 'radioSuperior', label: 'Radio superior (r)', unidad: 'longitud' },
            { id: 'radioInferior', label: 'Radio inferior (R)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        piramide: [
            { id: 'ladoBase', label: 'Lado de la base (a)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        piramide_truncada: [
            { id: 'ladoBase', label: 'Lado de la base (a)', unidad: 'longitud' },
            { id: 'ladoSuperior', label: 'Lado superior (b)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        prisma_triangular: [
            { id: 'altura_prisma', label: 'Altura (h)', unidad: 'longitud' }
        ]
    };

    const formulasVolumen = {
        cubo: (v) => Math.pow(v.lado, 3),
        prisma_rectangular: (v) => v.longitud * v.anchura * v.altura,
        esfera: (v) => (4 / 3) * Math.PI * Math.pow(v.radio, 3),
        hemisferio: (v) => (2 / 3) * Math.PI * Math.pow(v.radio, 3),
        casquete_esferico: (v) => (Math.PI * Math.pow(v.altura, 2) * (3 * v.radioEsfera - v.altura)) / 3,
        elipsoide: (v) => (4 / 3) * Math.PI * v.semiejeA * v.semiejeB * v.semiejeC,
        cilindro: (v) => Math.PI * Math.pow(v.radio, 2) * v.altura,
        cilindro_hueco: (v) => Math.PI * v.altura * (Math.pow(v.radioExterior, 2) - Math.pow(v.radioInterior, 2)),
        capsula: (v) => {
            const volumenEsfera = (4 / 3) * Math.PI * Math.pow(v.radio, 3);
            const volumenCilindro = Math.PI * Math.pow(v.radio, 2) * v.alturaCilindro;
            return volumenCilindro + volumenEsfera;
        },
        cono: (v) => (1 / 3) * Math.PI * Math.pow(v.radio, 2) * v.altura,
        tronco_conico: (v) => {
            const termino = Math.pow(v.radioSuperior, 2) + Math.pow(v.radioInferior, 2) + (v.radioSuperior * v.radioInferior);
            return (1 / 3) * Math.PI * v.altura * termino;
        },
        piramide: (v) => (1 / 3) * Math.pow(v.ladoBase, 2) * v.altura,
        piramide_truncada: (v) => {
            const termino = Math.pow(v.ladoBase, 2) + Math.pow(v.ladoSuperior, 2) + (v.ladoBase * v.ladoSuperior);
            return (1 / 3) * v.altura * termino;
        },
        prisma_triangular: (v) => {
            const metodo = document.getElementById('metodo_base')?.value;
            if (!metodo || !v.altura_prisma) return 0;

            switch (metodo) {
                case 'base_altura':
                    if (!v.base || !v.altura_base) return 0;
                    return 0.5 * v.base * v.altura_base * v.altura_prisma;
                case 'tres_lados':
                    if (!v.lado1 || !v.lado2 || !v.lado3) return 0;
                    const s = (v.lado1 + v.lado2 + v.lado3) / 2;
                    const area = Math.sqrt(s * (s - v.lado1) * (s - v.lado2) * (s - v.lado3));
                    return area * v.altura_prisma;
                case 'dos_lados_angulo':
                    if (!v.lado_a || !v.lado_b || !v.angulo || !v.unidad_angulo) return 0;
                    const rad = convertirAngulo(v.angulo, v.unidad_angulo);
                    return 0.5 * v.lado_a * v.lado_b * Math.sin(rad) * v.altura_prisma;
                case 'lado_dos_angulos':
                    if (!v.lado || !v.angulo1 || !v.angulo2 || !v.unidad_angulo) return 0;
                    const ang1 = convertirAngulo(v.angulo1, v.unidad_angulo);
                    const ang2 = convertirAngulo(v.angulo2, v.unidad_angulo);
                    const ang3 = Math.PI - ang1 - ang2;
                    const area2 = (Math.pow(v.lado, 2) * Math.sin(ang1) * Math.sin(ang2)) / (2 * Math.sin(ang3));
                    return area2 * v.altura_prisma;
                default:
                    return 0;
            }
        }

    };

    figuraSelect.addEventListener('change', function () {
        figuraActual = this.value;
        container.innerHTML = '';
        txtVolumenI.value = '';

        updateFiguraImage(figuraActual);


        if (!figuraActual) return;

        if (figuraActual === 'prisma_triangular') {
            agregarSelectorMetodoTriangular();
        } else if (figurasConfig[figuraActual]) {
            figurasConfig[figuraActual].forEach(campo => {
                crearCampo(campo.id, campo.label, campo.unidad);
            });
        }
    });
    updateFiguraImage(null);
    // Función para actualizar la imagen de la figura
    function updateFiguraImage(figura) {
        const imgFigura = document.getElementById('img_figura');
        if (!imgFigura) return;

        if (!figura) {
            // Cuando no hay figura seleccionada
            imgFigura.src = '../img/vidfig.gif';
            imgFigura.alt = 'Imagen por defecto';
            return;
        }

        if (figura === 'prisma_triangular') {
            // Tomar en cuenta el método seleccionado
            const metodo = document.getElementById('metodo_base')?.value;
            imgFigura.src = imagenesTriangulo[metodo] || imagenesTriangulo.base_altura;
            imgFigura.alt = `Imagen de prisma triangular (${metodo || 'base_altura'})`;
        } else {
            imgFigura.src = imagenes[figura] || '../img/vidfig.gif';
            imgFigura.alt = `Imagen de ${figura}`;
        }
    }


    function crearCampo(id, label, unidad) {
        const div = document.createElement('div');
        div.className = 'col-md-6 mt-2';
        div.innerHTML = `
                <label class="form-label">${label}</label>
                <div class="input-group">
                    <input type="number" class="form-control dimension-input" id="${figuraActual}_${id}" 
                        placeholder="Ingrese valor" step="any" min="0">
                    <select class="form-select unidad-${unidad}">
                        ${unidades[unidad].map(u =>
            `<option value="${u.value}" ${u.selected ? 'selected' : ''}>${u.text}</option>`
        ).join('')}
                    </select>
                </div>
            `;
        container.appendChild(div);

        const input = div.querySelector('input');
        const select = div.querySelector('select');
        input.addEventListener('input', actualizarResultadoVolumen);
        select.addEventListener('change', actualizarResultadoVolumen);
    }

    function agregarSelectorMetodoTriangular() {
        const metodoDiv = document.createElement('div');
        metodoDiv.className = 'col-md-12 mt-2';
        metodoDiv.innerHTML = `
                <label class="form-label">Método para calcular el área de la base</label>
                <select class="form-select" id="metodo_base">
                    <option value="base_altura" selected>Base y altura</option>
                    <option value="tres_lados">Tres lados (Herón)</option>
                    <option value="dos_lados_angulo">Dos lados y un ángulo</option>
                    <option value="lado_dos_angulos">Un lado y dos ángulos</option>
                </select>
            `;
        container.appendChild(metodoDiv);

        // Crear campo de altura primero (siempre visible)
        crearCampo('altura_prisma', 'Altura (h)', 'longitud');

        const metodoSelect = metodoDiv.querySelector('select');
        metodoSelect.addEventListener('change', mostrarCamposTriangulo);
        mostrarCamposTriangulo();
    }
    function mostrarCamposTriangulo() {
        // Eliminar todos los campos excepto el selector de método y la altura
        while (container.children.length > 2) {
            container.removeChild(container.lastChild);
        }

        const metodo = document.getElementById('metodo_base').value;

        // Actualizar la imagen cuando cambia el método
        updateFiguraImage('prisma_triangular');

        switch (metodo) {
            case 'base_altura':
                crearCampo('base', 'Base (b)', 'longitud');
                crearCampo('altura_base', 'Altura base (hb)', 'longitud');
                break;
            case 'tres_lados':
                crearCampo('lado1', 'Lado a', 'longitud');
                crearCampo('lado2', 'Lado b', 'longitud');
                crearCampo('lado3', 'Lado c', 'longitud');
                break;
            case 'dos_lados_angulo':
                crearCampo('lado_a', 'Lado a', 'longitud');
                crearCampo('lado_b', 'Lado b', 'longitud');
                crearCampo('angulo', 'Ángulo entre a y b (γ)', 'angulo');
                break;
            case 'lado_dos_angulos':
                crearCampo('lado', 'Lado conocido', 'longitud');
                crearCampo('angulo1', 'Ángulo 1 (β)', 'angulo');
                crearCampo('angulo2', 'Ángulo 2 (α)', 'angulo');
                break;
        }
    }

    function convertirAngulo(valor, unidad) {
        const conversiones = {
            deg: (x) => x * Math.PI / 180,
            rad: (x) => x,
            gradian: (x) => x * Math.PI / 200,
            turn: (x) => x * 2 * Math.PI,
            minute_of_arc: (x) => x * Math.PI / (180 * 60),
            second_of_arc: (x) => x * Math.PI / (180 * 3600),
            miliradian: (x) => x / 1000,
            microradian: (x) => x / 1_000_000,
            pirad: (x) => x * Math.PI
        };
        return conversiones[unidad]?.(valor) ?? valor;
    }

    function actualizarResultadoVolumen() {
        if (!figuraActual) return;

        const inputs = container.querySelectorAll('.dimension-input');
        const valores = {};
        let camposCompletos = true;

        inputs.forEach(input => {
            // Obtener el ID limpio del input
            let id = input.id;
            if (figuraActual === 'prisma_triangular') {
                id = id.replace('prisma_triangular_', '');
            } else {
                id = id.split('_').pop();
            }

            const valor = parseFloat(input.value);
            const unidadSelect = input.parentElement.querySelector('select');
            const factor = parseFloat(unidadSelect.value);
            const esAngulo = unidadSelect.classList.contains('unidad-angulo');

            if (isNaN(valor)) {
                camposCompletos = false;
                return;
            }

            // Guardar el valor convertido o directo si es ángulo
            if (esAngulo) {
                valores[id] = valor;
                valores.unidad_angulo = unidadSelect.value; // solo si la fórmula necesita saber la unidad del ángulo
            } else {
                valores[id] = valor * factor;
            }
        });

        // Si falta algún campo, limpiar y salir
        if (!camposCompletos) {
            txtVolumenI.value = '';
            return;
        }

        // Aplicar la fórmula correspondiente
        let volumenMetrosCubicos = 0;
        if (formulasVolumen[figuraActual]) {
            volumenMetrosCubicos = formulasVolumen[figuraActual](valores);
        }

        // Mostrar el resultado si es válido
        if (volumenMetrosCubicos > 0) {
            const factorConversion = parseFloat(unidadVolumenSelect.value);
            const volumenConvertido = volumenMetrosCubicos / factorConversion;
            txtVolumenI.value = volumenConvertido.toFixed(4);
        } else {
            txtVolumenI.value = '';
        }

    }


    unidadVolumenSelect.addEventListener('change', actualizarResultadoVolumen);
});