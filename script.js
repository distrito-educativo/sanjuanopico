// =========================================================================
// SISTEMA DE GESTIÓN ESCOLAR - DISTRITO SAN JUAN OPICO
// ARCHIVO CENTRAL DE LÓGICA Y NAVEGACIÓN (script.js)
// =========================================================================

// -------------------------------------------------------------------------
// 1. CONFIGURACIÓN CENTRAL Y AUTENTICACIÓN GOOGLE
// -------------------------------------------------------------------------
const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbyHJ2NmRMrIiXsje0E4FeqcHsBgfAum67rj9mFqJvWzchRrx3oPCkr-0HOVGIFxkTrmvw/exec';

const directoresPermitidos = [
    "luz.bernarda.cabrera@clases.edu.sv",
    "raul.amilcar.landaverde@clases.edu.sv",
    "areli.elizabeth.guardado@clases.edu.sv",
    "elena.valdizon.echerria@clases.edu.sv",
    "laura.cecilia.mena@clases.edu.sv",
    "xiomara.guadalupe.caceres@clases.edu.sv",
    "rina.garcia@clases.edu.sv",
    "marcos.elmer.orellana@clases.edu.sv",
    "daniel.omar.melgar@clases.edu.sv",
    "blanca.lidia.penado@clases.edu.sv",
    "carlos.humberto.ruiz@clases.edu.sv",
    "cesar.rolando.ortiz@clases.edu.sv",
    "mirna.cristela.mena@clases.edu.sv",
    "ermelinda.aracely.garcia@clases.edu.sv",
    "clide.ruth.lopez@clases.edu.sv",
    "02521407-2@clases.edu.sv",
    "rosa.ester.yanes@clases.edu.sv",
    "julian.edgardo.galdamez@clases.edu.sv",
    "alejandra.daniela.abrego@clases.edu.sv",
    "claudia.evelyn.mendoza@clases.edu.sv",
    "roberto.antonio.guirola@clases.edu.sv",
    "reina.guadalupe.quintanilla@clases.edu.sv",
    "aura.lili.cortez@clases.edu.sv",
    "rosa.maria.urias@clases.edu.sv",
    "issa.lorena.perdomo@clases.edu.sv",
    "juan.pablo.olivares@clases.edu.sv",
    "jose.artiga.perez@clases.edu.sv"
];

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

window.handleCredentialResponse = function(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    const userEmail = responsePayload.email;
    const userName = responsePayload.name;

    if (directoresPermitidos.includes(userEmail)) {
        document.getElementById('login-wall').style.display = 'none';
        document.getElementById('private-dashboard').style.display = 'block';
        document.getElementById('director-name').innerText = userName;
        document.getElementById('director-email').innerText = userEmail;
    } else {
        alert("⛔ ACCESO DENEGADO ⛔\n\nEl correo " + userEmail + " no pertenece a la lista de directores autorizados.");
    }
};

// -------------------------------------------------------------------------
// 2. FUNCIONES GLOBALES PARA LA BIBLIOTECA Y CONTROLES DE INTERFAZ
// -------------------------------------------------------------------------
window.filterIndice = function() {
    var input = document.getElementById("indiceSearchInput");
    if(!input) return;
    var filter = input.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    var grid = document.getElementById("indiceGrid");
    var items = grid.getElementsByClassName("indice-item");

    for (var i = 0; i < items.length; i++) {
        var title = items[i].getAttribute("data-title").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (title.indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
};

window.toggleGuideWidget = function(widgetId) {
    var widget = document.getElementById(widgetId);
    if(!widget) return;
    widget.classList.toggle("widget-collapsed");
    
    var btnText = widget.querySelector('.btn-llamativo-text');
    if (widget.classList.contains("widget-collapsed")) {
        btnText.innerText = "LEER INFORMACIÓN";
    } else {
        btnText.innerText = "OCULTAR INFORMACIÓN";
    }
};

window.filtrarDocumentos = function() {
    var input = document.getElementById('inputBuscador');
    if(!input) return;
    var filtro = input.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    var categorias = document.getElementsByClassName('categoria-seccion');

    for (var i = 0; i < categorias.length; i++) {
        var tarjetas = categorias[i].getElementsByClassName('doc-card');
        var visibles = 0; 

        for (var j = 0; j < tarjetas.length; j++) {
            var titulo = tarjetas[j].getElementsByTagName('h3')[0].innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            var descripcion = tarjetas[j].getElementsByTagName('p')[0].innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            if (titulo.includes(filtro) || descripcion.includes(filtro)) {
                tarjetas[j].style.setProperty('display', 'flex', 'important');
                visibles++;
            } else {
                tarjetas[j].style.setProperty('display', 'none', 'important');
            }
        }

        var tituloCategoria = categorias[i].getElementsByClassName('categoria-titulo')[0];
        if (visibles === 0) {
            tituloCategoria.style.display = "none";
            categorias[i].style.display = "none";
        } else {
            tituloCategoria.style.display = "block";
            categorias[i].style.display = "block";
        }
    }
};

window.switchTab = function(evt, tabId) {
    var tabcontent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    var tablinks = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    var targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add("active");
    if(evt && evt.currentTarget) evt.currentTarget.classList.add("active");
};

window.toggleAccordion = function(button) {
    var item = button.parentElement;
    var icon = button.querySelector(".accordion-icon");
    if (item.classList.contains("active")) {
        item.classList.remove("active");
        icon.textContent = "+";
    } else {
        item.classList.add("active");
        icon.textContent = "−";
    }
};

// -------------------------------------------------------------------------
// 3. CARRUSELES Y VISORES MODALES
// -------------------------------------------------------------------------
window.misImagenesEmbarazo = [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800&h=400",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800&h=400",
    "https://images.unsplash.com/photo-1427504494785-319ce1473799?auto=format&fit=crop&q=80&w=800&h=400"
];
window.currentIndexEmbarazo = 0;

window.initCarousel = function() {
    const track = document.getElementById('carruselTrack');
    const indicadoresContainer = document.getElementById('carruselIndicadores');
    if(!track || !indicadoresContainer) return;

    track.innerHTML = '';
    indicadoresContainer.innerHTML = '';

    window.misImagenesEmbarazo.forEach((url, index) => {
        const li = document.createElement('li');
        li.className = 'carousel-slide';
        li.innerHTML = `<img src="${url}" alt="Imagen ${index + 1}">`;
        track.appendChild(li);

        const dot = document.createElement('button');
        dot.className = 'dot-indicator' + (index === 0 ? ' active' : '');
        dot.onclick = () => window.irAImagen(index);
        indicadoresContainer.appendChild(dot);
    });
};

window.moverCarrusel = function(direction) {
    const totalImagenes = window.misImagenesEmbarazo.length;
    window.currentIndexEmbarazo += direction;

    if (window.currentIndexEmbarazo < 0) {
        window.currentIndexEmbarazo = totalImagenes - 1; 
    } else if (window.currentIndexEmbarazo >= totalImagenes) {
        window.currentIndexEmbarazo = 0; 
    }
    window.actualizarCarrusel();
};

window.irAImagen = function(index) {
    window.currentIndexEmbarazo = index;
    window.actualizarCarrusel();
};

window.actualizarCarrusel = function() {
    const track = document.getElementById('carruselTrack');
    if(!track) return;
    const desplazamiento = -(window.currentIndexEmbarazo * 100);
    track.style.transform = `translateX(${desplazamiento}%)`;

    const dots = document.querySelectorAll('.dot-indicator');
    dots.forEach((dot, index) => {
        if (index === window.currentIndexEmbarazo) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
};

window.abrirModalImagen = function(elementoContenedor) {
    var modal = document.getElementById("modalImagenSiges");
    var modalImg = document.getElementById("imagenAmpliada");
    var imagenClickeada = elementoContenedor.querySelector("img");
    
    if (imagenClickeada && modal && modalImg) {
        modal.style.display = "flex"; 
        modalImg.src = imagenClickeada.src; 
        document.body.style.overflow = "hidden"; 
    }
};

window.cerrarModalImagen = function() {
    var modal = document.getElementById("modalImagenSiges");
    var modalImg = document.getElementById("imagenAmpliada");
    if(modal) modal.style.display = "none";
    if(modalImg) modalImg.src = ""; 
    document.body.style.overflow = "auto"; 
};

window.abrirModalCalendario = function(tarjeta) {
    var modal = document.getElementById("modalVisorCalendario");
    var modalImg = document.getElementById("imagenAmpliadaCalendario");
    var imagen = tarjeta.querySelector("img");
    
    if (imagen && modal && modalImg && imagen.src !== "" && !imagen.src.includes("URL_IMAGEN")) {
        modal.style.display = "flex"; 
        modalImg.src = imagen.src; 
        document.body.style.overflow = "hidden";

        if (modalImg.requestFullscreen) {
            modalImg.requestFullscreen();
        } else if (modalImg.mozRequestFullScreen) {
            modalImg.mozRequestFullScreen();
        } else if (modalImg.webkitRequestFullscreen) {
            modalImg.webkitRequestFullscreen();
        } else if (modalImg.msRequestFullscreen) {
            modalImg.msRequestFullscreen();
        }
    }
};

window.cerrarModalCalendario = function() {
    var modal = document.getElementById("modalVisorCalendario");
    var modalImg = document.getElementById("imagenAmpliadaCalendario");
    if(modal) modal.style.display = "none";
    if(modalImg) modalImg.src = ""; 
    document.body.style.overflow = "auto";
    
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        window.cerrarModalImagen();
        if (window.cerrarModalCalendario) window.cerrarModalCalendario();
    }
});

// -------------------------------------------------------------------------
// 4. MOTOR DE FICTION EXPRESS
// -------------------------------------------------------------------------
window.abrirTabFE = function(evt, tabId) {
    var tabContents = document.getElementsByClassName("fe-tab-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
        tabContents[i].classList.remove("active");
    }
    var tablinks = document.getElementsByClassName("fe-tab-btn");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabId).style.display = "block";
    document.getElementById(tabId).classList.add("active");
    if(evt) evt.currentTarget.classList.add("active");
};

window.toggleAcordeonFE = function(element) {
    var parentItem = element.parentElement;
    parentItem.classList.toggle("active");
};

window.filtrarNivelFE = function(nivelBuscado, btnElement) {
    var botonesFiltro = document.getElementsByClassName("fe-filtro-btn");
    for (var i = 0; i < botonesFiltro.length; i++) {
        botonesFiltro[i].classList.remove("active");
    }
    if(btnElement) btnElement.classList.add("active");

    var libros = document.getElementsByClassName("fe-libro-card");
    for (var i = 0; i < libros.length; i++) {
        var nivelLibro = libros[i].getAttribute("data-nivel");
        if (!nivelLibro) {
            libros[i].style.display = "flex";
            continue;
        }
        if (nivelBuscado === "Todos" || nivelLibro === nivelBuscado) {
            libros[i].style.display = "flex"; 
        } else {
            libros[i].style.display = "none";
        }
    }
};

window.iniciarDictado = function() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("⚠️ Tu navegador actual no soporta el dictado por voz. Te recomendamos usar Google Chrome o Edge.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-SV';
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;

    const btn = document.getElementById('btn-dictado');
    const textoBtn = document.getElementById('texto-btn-dictado');
    const textarea = document.getElementById('ticket-desc');
    const estado = document.getElementById('estado-dictado');

    recognition.onstart = function() {
        estado.style.display = 'block';
        btn.style.background = '#dc2626';
        textoBtn.innerText = 'Grabando...';
    };

    recognition.onresult = function(event) {
        const transcripcion = event.results[0][0].transcript;
        if(textarea.value.length > 0) {
            textarea.value += ' ' + transcripcion;
        } else {
            textarea.value = transcripcion;
        }
    };

    recognition.onerror = function(event) {
        if(event.error === 'not-allowed') {
            alert("🔒 Debes darle permiso al navegador para usar el micrófono.");
        }
    };

    recognition.onend = function() {
        estado.style.display = 'none';
        btn.style.background = '#16a34a';
        textoBtn.innerText = 'Dictar por voz';
    };

    recognition.start();
};

// -------------------------------------------------------------------------
// 5. SHORTS Y MEDIA DE PRIMERA INFANCIA
// -------------------------------------------------------------------------
function reproducirShort(idContenedor, idVideo) {
  const contenedor = document.getElementById(idContenedor);
  if (contenedor) {
    contenedor.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${idVideo}?autoplay=1&rel=0" 
        title="Short Informativo" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    `;
  }
}

// -------------------------------------------------------------------------
// 6. GALERÍA DE DERECHOS HUMANOS
// -------------------------------------------------------------------------
const videosDerechos = [
    "tp64vrtXdhI", "qo_wEQZYO4g", "kERwIqSqxMw", "WJaKn5isXdM", "wWHYq1uTyHI", 
    "YPDPwrW4Vo8", "-cceLjfBrJ8", "Gpo6nT-aAgQ", "-vfNZUn4RYE", "8F8yUUF_Yjw", 
    "z78n5hOrhRU", "TJjCOExjbM8", "PyjTsznEc2Y", "btfRgImPpgE", "uaGS9Ee2NEc", 
    "ngjW7Ls6dxw", "f-CiDn_TTc8", "TRM8RCFOubI", "f8RBzwx3d5c", "pAzVwgVwKoI", 
    "tnaqtzgxOt4", "Wj8H3a-EVrE", "uW2r_rYn7xY", "qyL9uwU3XWY", "r7-Ia8bncZ4", 
    "wEBxI8m9m-A", "R_2yaBVW5xw", "qTbPJhkE8KM", "1aZn6WRR8cs", "a2FWVJkevCE", 
    "dbJIfirZFGk"
];

function cargarGaleriaDerechos() {
    const contenedorGrid = document.getElementById('rightsGrid');
    if(!contenedorGrid) return;
    
    let htmlGaleria = '';
    videosDerechos.slice(1).forEach((idVideo, index) => {
        let numeroDerecho = index + 1;
        let titulo = `Derecho Humano N° ${numeroDerecho}`;
        let miniaturaUrl = `https://img.youtube.com/vi/${idVideo}/hqdefault.jpg`;
        
        htmlGaleria += `
            <div class="video-card" onclick="abrirVideoModal('${idVideo}')">
                <div class="video-thumbnail-container">
                    <img src="${miniaturaUrl}" alt="${titulo}" class="video-thumbnail" loading="lazy">
                    <div class="play-icon">
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
                <h3 class="video-title">${titulo}</h3>
            </div>
        `;
    });
    contenedorGrid.innerHTML = htmlGaleria;
}

function abrirVideoModal(idVideo) {
    const modalVideo = document.getElementById('ytVideoModal');
    const iframeVideo = document.getElementById('ytIframe');
    if(modalVideo && iframeVideo) {
        iframeVideo.src = `https://www.youtube.com/embed/${idVideo}?autoplay=1&rel=0`;
        modalVideo.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
}

function cerrarVideoModal(evento) {
    const modalVideo = document.getElementById('ytVideoModal');
    const iframeVideo = document.getElementById('ytIframe');
    if(modalVideo && (evento.target === modalVideo || evento.target.classList.contains('close-video-modal'))) {
        modalVideo.classList.remove('active');
        iframeVideo.src = ""; 
        document.body.style.overflow = 'auto'; 
    }
}

// -------------------------------------------------------------------------
// 7. ASISTENTE VIRTUAL OPICO (CHATBOT Y RUTAS)
// -------------------------------------------------------------------------
let contadorOfensas = 0;

const MAPA_RUTAS = {
    mision_doc: "https://docs.google.com/document/d/1Ra1PJ4idnXuYPmKOO8OUU5QmXzCNAlNX/edit?usp=drive_link&ouid=114427763563163743614&rtpof=true&sd=true",
    mision_pdf: "https://drive.google.com/file/d/1mQStKEP0M1vH6eipVzLtHBTLnppmX3tY/view?usp=drive_link",
    ley_carrera_docente: "https://drive.google.com/file/d/1pkA5nPRG4UtOwnO81laB_eV-WfEnncwr/view?usp=drive_link",
    ley_general_educacion: "https://drive.google.com/file/d/1BYRL67cvtqDfgYTPrGlrOgqjlS0Jfaah/view?usp=drive_link",
    manual_evaluacion: "https://drive.google.com/file/d/1AsFTioq8lAUTb07mPwKLJhlEOU1CtbLH/view?usp=drive_link",
    reglamento_carrera_docente: "https://drive.google.com/file/d/13wp9aCUos-ZCJhzzann_w-8n_64uPOu2/view?usp=drive_link",
    ley_asuetos_vacaciones: "https://drive.google.com/file/d/1arabPAxu0suamYLhfIiV_yG1YPho8ArP/view?usp=drive_link",
    ley_simbolos_patrios: "https://drive.google.com/file/d/1XSUuZbFhzt-HhbcM1sMwzIQJGMgbnKoJ/view?usp=drive_link",
    normativa_funcionamiento_5: "https://drive.google.com/file/d/1qy5u-qvLOGNcgPJTOdEXXoXeY-s9F-hW/view?usp=drive_link",
    codigo_trabajo: "https://drive.google.com/file/d/1f20i6RUlenNjA_oqp7dXYOBu0KjrbHEk/view?usp=drive_link",
    mined_ciencia: "https://www.mined.gob.sv/ciencia-educativa/",
    mined_esmate: "https://www.mined.gob.sv/esmate/",
    mined_lenguaje: "https://www.mined.gob.sv/lengua-y-literatura/",
    mined_ciudadania: "https://www.mined.gob.sv/ciudadania-y-valores/",
    mined_inicial_parvularia: "https://www.mined.gob.sv/materiales-educacion-inicial-y-parvularia/",
    mined_ingles: "https://www.mined.gob.sv/ingles/",
    mined_artes: "https://www.mined.gob.sv/artes/",
    mined_educacion_fisica: "https://www.mined.gob.sv/guias-metodologicas/",
    mined_tecnologia: "https://www.mined.gob.sv/orientaciones-uso-tecnologia/",
    mined_computacion: "https://www.mined.gob.sv/ciencias-de-la-computacion/",
    fiction: "https://es.fictionexpress.com/",
    siges: "https://siges.sv"
};

const PALABRAS_INAPROPIADAS = ["idiota", "estupido", "estúpido", "pendejo", "culero", "culera", "imbecil", "imbécil", "mierda", "puto", "puta", "cagon", "cagón", "cagado", "verga", "pija", "cabron", "cabrón", "cerote", "tonto", "inutil", "inútil", "inservible", "basura", "puerca", "porquería", "porqueria", "tarado", "tarada", "jugado", "jugada", "surumbo", "surumba", "pasmado", "pasmada", "terengo", "terenga"];
const PALABRAS_RETRACTACION = ["ok", "esta bien", "está bien", "de acuerdo", "listo", "ya", "no más", "no mas", "entendido", "entiendo", "comprendo"];
const PALABRAS_INSATISFACCION = ["no entiendo", "te equivocaste", "no me sirve", "no comprendo", "eso no era lo que pedí", "eso no era lo que pedi", "no estoy conforme", "no era lo que buscaba", "olvidalo", "olvídalos", "olvidalo", "no quiero eso"];
const PALABRAS_GRATITUD = ["gracias", "muchas gracias", "muy amable"];
const PALABRAS_SALUDO = ["hola", "buenos dias", "buenos días", "buenas tardes", "buenas noches", "hola que tal", "hola qué tal", "saludos", "que tal", "qué tal", "buenas"];
const PALABRAS_CREADOR = ["quien te creo", "quién te creó", "quien te creó", "quien te creo", "quien es tu creador", "quién es tu creador", "quien te diseño", "quién te diseñó", "quien te hizo", "quién te hizo", "quien es tu dueño", "quién es tu dueño", "quien te programo"];

function toggleOpicoChat() {
    const win = document.getElementById('opico-chat-window');
    if (win) win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
}

function detectarEnter(e) {
    if (e.key === 'Enter') enviarMensajeWeb();
}

function agregarMensaje(texto, esUsuario) {
    const body = document.getElementById('opico-chat-body');
    if (!body) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `opico-msg ${esUsuario ? 'opico-msg-user' : 'opico-msg-bot'}`;
    msgDiv.innerHTML = texto;
    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
}

function seleccionarOpcion(clave) {
    contadorOfensas = 0;
    const nombres = { mision: "Solicitar Misión Oficial", biblioteca: "Consultar Biblioteca Documental", fiction: "Información de Fiction Express", calendario: "Ver Calendario Escolar" };
    agregarMensaje(nombres[clave] || "Consultar sección", true);
    procesarRespuestaBot(clave);
}

function enviarMensajeWeb() {
    const input = document.getElementById('opico-user-input');
    if (!input) return;
    const texto = input.value.trim();
    if (!texto) return;

    agregarMensaje(texto, true);
    input.value = '';
    procesarRespuestaBot(texto.toLowerCase());
}

function irASeccionInterna(targetName, alternativeId) {
    toggleOpicoChat();
    const linkMenu = document.querySelector(`.nav-link[data-target="${targetName}"]`) || 
                     document.querySelector(`[data-target="${targetName}"]`) ||
                     document.querySelector(`[data-target="${alternativeId}"]`) ||
                     Array.from(document.querySelectorAll('.nav-link')).find(el => 
                       el.textContent.toLowerCase().includes(targetName.replace('-home', '').replace('-', ' '))
                     );

    if (linkMenu) {
        linkMenu.click();
    } else {
        const secciones = document.querySelectorAll('.page-section');
        secciones.forEach(sec => sec.style.display = 'none');
        const seccionDestino = document.getElementById(targetName) || document.getElementById(alternativeId);
        if (seccionDestino) seccionDestino.style.display = 'block';
    }
}

function irASoporteTecnico() { irASeccionInterna('soporte-home', 'soporte-tecnico'); }
function irABibliotecaDocumental() { irASeccionInterna('biblioteca-home', 'biblioteca-documental'); }
function irADirectorioTelefonico() { irASeccionInterna('directorio-home', 'directorio-telefonico'); }
function irAPrimeraInfancia() { irASeccionInterna('primera-infancia-home', 'primera-infancia'); }
function irANoticias() { irASeccionInterna('noticias-home', 'noticias'); }
function irAOrientacionesPedagogicas() { irASeccionInterna('orientaciones-home', 'orientaciones-pedagogicas'); }
function irAAprendamosAEstudiar() { irASeccionInterna('aprendamos-home', 'aprendamos-a-estudiar'); }
function irACalendarioEscolar() { irASeccionInterna('calendario-home', 'calendario-escolar'); }

function crearBotonAccionLocal(textoBoton, funcionJavascript) {
    return `<button onclick="${funcionJavascript}" class="opico-link-btn">${textoBoton}</button>`;
}

function crearBotonEnlace(url, textoBoton, enNuevaPestana = true) {
    const target = enNuevaPestana ? '_blank' : '_parent';
    return `<a href="${url}" target="${target}" class="opico-link-btn">${textoBoton}</a>`;
}

function obtenerNotaBibliotecaGlobal() {
    return "<br><br>📌 <em>Nota: Si buscas algún otro documento o normativa, te invitamos a explorar nuestra:</em><br>" + crearBotonAccionLocal("📚 Ir a Biblioteca Documental", "irABibliotecaDocumental()");
}

function obtenerPreguntaSiguiente() {
    return "<br><br>❓ <strong>¿Necesitas consultar algún otro programa o documento educativo?</strong> Quedo a tu disposición para colaborarte.";
}

function obtenerHtmlMenuPrincipal() {
    return "<br><br>📌 <strong>Menú Principal de Opciones:</strong><br><div style='display:flex; flex-direction:column; gap:4px; margin-top:8px;'><button class='opico-opt-btn' onclick=\"seleccionarOpcion('mision')\">📄 Solicitar Misión Oficial</button><button class='opico-opt-btn' onclick=\"seleccionarOpcion('biblioteca')\">📚 Biblioteca Documental</button><button class='opico-opt-btn' onclick=\"seleccionarOpcion('fiction')\">📖 Fiction Express</button><button class='opico-opt-btn' onclick=\"seleccionarOpcion('calendario')\">📅 Calendario Escolar</button></div>";
}

function procesarRespuestaBot(entrada) {
    let text = entrada.toLowerCase().trim();
    let respuesta = "";

    let contieneOfensa = PALABRAS_INAPROPIADAS.some(palabra => new RegExp("\\b" + palabra + "\\b", "i").test(text));
    let esRetractacion = PALABRAS_RETRACTACION.some(palabra => text === palabra || text.includes(palabra));
    let esInsatisfaccion = PALABRAS_INSATISFACCION.some(palabra => text.includes(palabra));
    let esGratitud = PALABRAS_GRATITUD.some(palabra => text.includes(palabra));
    let esSaludo = PALABRAS_SALUDO.some(palabra => text === palabra || text.includes(palabra));
    let esConsultaCreador = PALABRAS_CREADOR.some(palabra => text.includes(palabra));

    if (esConsultaCreador) {
        contadorOfensas = 0;
        respuesta = "💡 <strong>Esa es una respuesta muy simple:</strong><br><br>Fui diseñado y creado por el <strong>Monitor Educativo del Distrito de San Juan Opico</strong>.<br><br>Mi propósito es servir como una herramienta moderna, ágil e innovadora al servicio de directores, docentes, personal administrativo y la comunidad educativa de La Libertad.";
    } else if (text.includes("carrera docente") || text.includes("ley de la carrera docente")) {
        contadorOfensas = 0;
        respuesta = "📚 <strong>Ley de la Carrera Docente:</strong><br><br>Aquí tienes el enlace directo para consultar o descargar la Ley de la Carrera Docente vigente en formato PDF:<br><br>" + crearBotonEnlace(MAPA_RUTAS.ley_carrera_docente, "📕 Descargar Ley Carrera Docente (PDF)", true) + obtenerNotaBibliotecaGlobal();
    } else if (text.includes("codigo de trabajo") || text.includes("código de trabajo") || text.includes("ley laboral")) {
        contadorOfensas = 0;
        respuesta = "⚖️ <strong>Código de Trabajo de El Salvador:</strong><br><br>Accede al Código de Trabajo oficial vigente a través del siguiente enlace:<br><br>" + crearBotonEnlace(MAPA_RUTAS.codigo_trabajo, "📕 Descargar Código de Trabajo (PDF)", true) + obtenerNotaBibliotecaGlobal();
    } else if (text.includes("manual de evaluacion") || text.includes("manual de evaluación") || text.includes("servicio del aprendizaje")) {
        contadorOfensas = 0;
        respuesta = "📊 <strong>Manual de Evaluación al Servicio del Aprendizaje:</strong><br><br>Accede directamente al documento normativo para los procesos de evaluación escolar:<br><br>" + crearBotonEnlace(MAPA_RUTAS.manual_evaluacion, "📕 Descargar Manual de Evaluación (PDF)", true) + obtenerNotaBibliotecaGlobal();
    } else if (text.includes("misión") || text.includes("mision") || text.includes("salida") || text.includes("permiso de salida")) {
        contadorOfensas = 0;
        respuesta = "📄 <strong>Solicitud de Misión Oficial Distrital:</strong><br><br>Aquí tienes los formularios oficiales de Misión Oficial:<br><br>" + crearBotonEnlace(MAPA_RUTAS.mision_doc, "📝 Descargar Formato Word (Editable)", true) + crearBotonEnlace(MAPA_RUTAS.mision_pdf, "📕 Descargar Formato PDF", true) + obtenerNotaBibliotecaGlobal();
    } else if (text === "biblioteca" || text === "biblioteca documental" || text.includes("biblioteca") || text.includes("documentos") || text.includes("repositorio")) {
        contadorOfensas = 0;
        respuesta = "📚 <strong>Biblioteca Documental Distrital:</strong><br><br>Accede a nuestro repositorio central para consultar leyes, normativas, formularios, circulares y documentos vigentes del distrito:<br><br>" + crearBotonAccionLocal("📚 Ir a Biblioteca Documental", "irABibliotecaDocumental()") + obtenerPreguntaSiguiente();
    } else if (text.includes("telefono") || text.includes("teléfono") || text.includes("numero") || text.includes("número") || text.includes("celular") || text.includes("contacto telefonico") || text.includes("contacto telefónico") || text.includes("llamar") || text.includes("pbx") || text.includes("whatsapp") || text.includes("directorio telefonico") || text.includes("directorio telefónico") || text.includes("directorio")) {
        contadorOfensas = 0;
        respuesta = "📞 <strong>Directorio Telefónico Oficial:</strong><br><br>Para consultar los números telefónicos oficiales de contacto del distrito, dependencias y centros escolares, pulsa el siguiente botón:<br><br>" + crearBotonAccionLocal("☎️ Ir al Directorio Telefónico", "irADirectorioTelefonico()") + obtenerPreguntaSiguiente();
    } else if (text.includes("primera infancia") || text.includes("crecer juntos") || text.includes("nacer con carino") || text.includes("nacer con cariño") || text.includes("parvularia") || text.includes("inicial")) {
        contadorOfensas = 0;
        respuesta = "🧸 <strong>Estrategia de Primera Infancia:</strong><br><br>Conoce los pilares, normativas y nuestra galería interactiva de YouTube Shorts sobre la Ley Crecer Juntos y Nacer con Cariño:<br><br>" + crearBotonAccionLocal("🧸 Ir a Primera Infancia", "irAPrimeraInfancia()") + obtenerPreguntaSiguiente();
    } else if (text.includes("noticias") || text.includes("noticia") || text.includes("novedades") || text.includes("boletin") || text.includes("comunicados")) {
        contadorOfensas = 0;
        respuesta = "📰 <strong>Noticias y Comunicados Oficiales:</strong><br><br>Consulta los últimos acontecimientos, anuncios e informaciones relevantes de nuestro distrito educativo:<br><br>" + crearBotonAccionLocal("📰 Ver Sección de Noticias", "irANoticias()") + obtenerPreguntaSiguiente();
    } else if (text === "fiction" || text.includes("fiction express") || text.includes("fictionexpress") || text.includes("lectura digital")) {
        contadorOfensas = 0;
        respuesta = "📖 <strong>Plataforma Fiction Express:</strong><br><br>Accede al portal oficial de Fiction Express para disfrutar de los libros interactivos, recursos lectores y seguimiento para estudiantes y docentes:<br><br>" + crearBotonEnlace(MAPA_RUTAS.fiction, "🌐 Ir a Fiction Express", true) + obtenerPreguntaSiguiente();
    } else if (text === "calendario" || text.includes("calendario escolar") || text.includes("calendario de clases") || text.includes("fechas escolares") || text.includes("cronograma escolar")) {
        contadorOfensas = 0;
        respuesta = "📅 <strong>Calendario Escolar Distrital:</strong><br><br>Puedes consultar el cronograma oficial de actividades, asuetos y periodos lectivos directamente en nuestro portal:<br><br>" + crearBotonAccionLocal("📅 Ir al Calendario Escolar", "irACalendarioEscolar()") + obtenerPreguntaSiguiente();
    } else if (text.includes("computacion") || text.includes("computación") || text.includes("ciencias de la computacion") || text.includes("informatica")) {
        contadorOfensas = 0;
        respuesta = "💻 <strong>Programa de Ciencias de la Computación:</strong><br><br>Accede al sitio del MINEDUCYT dedicado a los contenidos y formación en Ciencias de la Computación:<br><br>" + crearBotonEnlace(MAPA_RUTAS.mined_computacion, "🌐 Abrir Ciencias de la Computación", true) + obtenerPreguntaSiguiente();
    } else if (text.includes("orientacion") || text.includes("orientaciones") || text.includes("lineamientos") || text.includes("planificacion")) {
        contadorOfensas = 0;
        respuesta = "📐 <strong>Orientaciones Pedagógicas:</strong><br><br>Consulta y descarga los lineamientos y criterios pedagógicos oficiales para la labor docente:<br><br>" + crearBotonAccionLocal("📐 Ver Orientaciones Pedagógicas", "irAOrientacionesPedagogicas()") + obtenerPreguntaSiguiente();
    } else if (text.includes("aprendamos") || text.includes("estudiar") || text.includes("refuerzo") || text.includes("tecnicas de estudio")) {
        contadorOfensas = 0;
        respuesta = "✍️ <strong>Estrategia 'Aprendamos a Estudiar':</strong><br><br>Accede a los módulos de refuerzo y guías académicas especiales:<br><br>" + crearBotonAccionLocal("✍️ Ir a 'Aprendamos a Estudiar'", "irAAprendamosAEstudiar()") + obtenerPreguntaSiguiente();
    } else if (esSaludo) {
        contadorOfensas = 0;
        respuesta = "👋 <strong>¡Hola! Un gusto saludarte.</strong><br><br>Te damos la bienvenida al asistente virtual del <strong>Distrito Educativo de San Juan Opico</strong>.<br><br>¿En qué trámite, normativa o consulta del portal te podemos apoyar hoy?" + obtenerHtmlMenuPrincipal();
    } else if (esGratitud) {
        contadorOfensas = 0;
        respuesta = "🙏 <strong>¡Con el mayor de los gustos!</strong><br><br>Es un placer servirte. En el <strong>Distrito Educativo de San Juan Opico</strong> estamos comprometidos en facilitarte la información y los trámites pedagógicos y administrativos que necesites.<br><br>Si tienes alguna otra duda, aquí estaré listo para ayudarte. ¡Que tengas un excelente día!";
    } else if (contadorOfensas > 0 && esRetractacion) {
        contadorOfensas = 0;
        respuesta = "🤝 <strong>¡Excelente! Agradezco tu disposición.</strong><br><br>Estamos 100% listos para comenzar a trabajar y ayudarte con los procesos, guías y trámites del <strong>Distrito Educativo de San Juan Opico</strong>.<br><br>¿En qué te podemos apoyar en este momento?" + obtenerHtmlMenuPrincipal();
    } else if (esInsatisfaccion) {
        contadorOfensas = 0;
        respuesta = "🙏 <strong>Lamento mucho la confusión o la respuesta imprecisa.</strong><br><br>Como sistema automatizado, sigo aprendiendo para brindarte la mejor orientación posible en el portal distrital.<br><br>Por favor, intenta escribir tu consulta con otras palabras específicas o con gusto te derivo con el equipo de soporte técnico:<br>" + crearBotonAccionLocal("🎫 Ir a Soporte Técnico", "irASoporteTecnico()");
    } else if (contieneOfensa) {
        contadorOfensas++;
        if (contadorOfensas === 1) {
            respuesta = "🛑 <strong>Aviso de Convivencia Digital:</strong><br><br>Te recuerdo que mi trabajo en este portal es exclusivamente orientar y guiar en los trámites, normativas y procesos del Distrito Educativo de San Juan Opico.<br><br>Mantenemos un trato profesional y respetuoso.<br><br>Si tienes un inconveniente o necesitas asistencia técnica, estoy a tu disposición:<br>" + crearBotonAccionLocal("🎫 Ir a Soporte Técnico", "irASoporteTecnico()");
        } else if (contadorOfensas === 2) {
            respuesta = "🕊️ <strong>Fomentando un Ambiente de Respeto:</strong><br><br>Entendemos que un trámite o proceso difícil puede causar frustración, pero te invitamos a continuar con un trato adecuado.<br><br>Cuéntanos con respeto, ¿cuál es el proceso específico en el que te podemos colaborar hoy?<br>" + crearBotonAccionLocal("🎫 Ir a Soporte Técnico", "irASoporteTecnico()");
        } else {
            respuesta = "🤖 <strong>Atención Automática Limitada:</strong><br><br>Debido al uso reiterado de lenguaje no apropiado, se ha desactivado el procesamiento de texto libre.<br><br>A partir de este momento, solo responderé mostrando las opciones principales del portal:" + obtenerHtmlMenuPrincipal();
        }
    } else if (text.includes("contacto") || text.includes("direccion departamental") || text.includes("dirección departamental") || text.includes("asesores") || text.includes("asesores pedagogicos") || text.includes("mesa de ayuda") || text.includes("soporte") || text.includes("soporte tecnico") || text.includes("soporte técnico")) {
        contadorOfensas = 0;
        respuesta = "📞 <strong>Soporte Técnico y Mesa de Ayuda Distrital:</strong><br><br>Puedes canalizar tus solicitudes de soporte técnico, reporte de fallas o consultas administrativas directamente en nuestra área especializada del portal:<br><br>" + crearBotonAccionLocal("🎫 Ir a Soporte Técnico", "irASoporteTecnico()") + obtenerPreguntaSiguiente();
    } else {
        contadorOfensas = 0;
        respuesta = `🤖 No dispongo del detalle exacto sobre "<em>${entrada}</em>" en este momento.<br><br>Te sugiero explorar las opciones del menú principal o contactar a nuestro equipo de soporte técnico:<br>` + crearBotonAccionLocal("🎫 Ir a Soporte Técnico", "irASoporteTecnico()");
    }

    setTimeout(() => { agregarMensaje(respuesta, false); }, 350);
}

// -------------------------------------------------------------------------
// 8. ESCUDO Y SEGURIDAD DOM
// -------------------------------------------------------------------------
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });

document.onkeydown = function(e) {
    if (e.keyCode == 123) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) return false;
};

function mantenerUrlInmaculada() {
    const urlBase = window.location.protocol + "//" + window.location.host + window.location.pathname;
    if (window.location.search || window.location.hash) {
        window.history.replaceState(null, '', urlBase);
    }
}

// -------------------------------------------------------------------------
// 9. INICIALIZADOR DE EVENTOS DOM (DOMContentLoaded)
// -------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    mantenerUrlInmaculada();
    window.addEventListener('hashchange', mantenerUrlInmaculada);
    setInterval(mantenerUrlInmaculada, 500);

    // Evento del botón para contraer el menú lateral
    const btnContraer = document.getElementById('btnContraerMenu');
    if (btnContraer) {
        btnContraer.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
            if(document.body.classList.contains('sidebar-collapsed')) {
                var openItems = document.querySelectorAll('.nav-item.open');
                openItems.forEach(function(item) { item.classList.remove('open'); });
            }
        });
    }

    // Persistencia de memoria de entrada de código escolar
    setInterval(() => {
        const input = document.getElementById('codigoEscolar') || document.getElementById('codigo') || document.getElementById('est-codigo');
        if (input && !input.hasAttribute('data-mem')) {
            input.setAttribute('data-mem', 'true');
            if(localStorage.getItem("codigo-escuela")) input.value = localStorage.getItem("codigo-escuela");
            input.addEventListener("input", () => localStorage.setItem("codigo-escuela", input.value));
        }
    }, 1000);
});
