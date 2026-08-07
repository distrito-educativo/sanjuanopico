// =========================================================================
// SISTEMA DE GESTIÓN ESCOLAR - DISTRITO SAN JUAN OPICO
// ARCHIVO CENTRAL DE LÓGICA Y NAVEGACIÓN (script.js)
// =========================================================================

const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbyHJ2NmRMrIiXsje0E4FeqcHsBgfAum67rj9mFqJvWzchRrx3oPCkr-0HOVGIFxkTrmvw/exec';

// -------------------------------------------------------------------------
// 1. CONTROL DE NAVEGACIÓN SPA Y MENÚ LATERAL
// -------------------------------------------------------------------------
function irASeccionInterna(target) {
    const dynamicArea = document.getElementById('dynamic-content-area');
    if (!dynamicArea) return;

    if (target === 'inicio') {
        window.location.reload();
        return;
    }

    if (contentRegistry && contentRegistry[target]) {
        dynamicArea.innerHTML = contentRegistry[target];
        window.scrollTo(0, 0);
    } else {
        dynamicArea.innerHTML = `<div class="page-header"><h1>${target}</h1><p>Sección en actualización constante.</p></div>`;
    }

    // Cerrar menú en móvil
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (window.innerWidth <= 1024 && sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Subfunciones de acceso directo
function irASoporteTecnico() { irASeccionInterna('soporte-tecnico'); }
function irABibliotecaDocumental() { irASeccionInterna('biblioteca-home'); }
function irADirectorioTelefonico() { irASeccionInterna('directorio-home'); }
function irAPrimeraInfancia() { irASeccionInterna('primera-infancia-home'); }
function irANoticias() { irASeccionInterna('noticias-home'); }
function irAOrientacionesPedagogicas() { irASeccionInterna('orientaciones-home'); }
function irAAprendamosAEstudiar() { irASeccionInterna('estudiar-home'); }
function irACalendarioEscolar() { irASeccionInterna('calendario-home'); }

// -------------------------------------------------------------------------
// 2. CONTADOR DE VISITAS E INTERFAZ
// -------------------------------------------------------------------------
function iniciarContadorPremium() {
    let baseCount = 19560;
    let tiempoExacto = new Date().getTime();
    let accion = 'get';
    
    if (!sessionStorage.getItem('visita_contada_nube')) {
        accion = 'hit';
        sessionStorage.setItem('visita_contada_nube', 'true');
    }

    let ultimoConteo = localStorage.getItem('contador_cache_local') || baseCount;
    let paddedCache = ultimoConteo.toString().padStart(7, '0').split('');
    for (let i = 0; i < 7; i++) {
        let el = document.getElementById('digit-' + i);
        if (el) el.innerText = paddedCache[i];
    }

    let urlConectada = 'https://abacus.jasoncameron.dev/' + accion + '/sanjuanopico_distrito/visitas?t=' + tiempoExacto;

    fetch(urlConectada, { cache: 'no-store', mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            let totalVisits = baseCount + data.value;
            localStorage.setItem('contador_cache_local', totalVisits);
            let digits = totalVisits.toString().padStart(7, '0').split('');
            for (let i = 0; i < 7; i++) {
                let el = document.getElementById('digit-' + i);
                if (el) el.innerText = digits[i];
            }
        })
        .catch(err => console.log("Contador en modo offline."));
}

// -------------------------------------------------------------------------
// 3. ASISTENTE VIRTUAL OPICO
// -------------------------------------------------------------------------
let contadorOfensas = 0;

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

function procesarRespuestaBot(entrada) {
    let text = entrada.toLowerCase().trim();
    let respuesta = "";

    if (text.includes("mision") || text.includes("misión")) {
        respuesta = "📄 <strong>Solicitud de Misión Oficial Distrital:</strong><br><br><a href='https://docs.google.com/document/d/1Ra1PJ4idnXuYPmKOO8OUU5QmXzCNAlNX/edit?usp=drive_link' target='_blank' class='opico-link-btn'>📝 Descargar Word Editable</a>";
    } else if (text.includes("biblioteca")) {
        respuesta = "📚 <strong>Biblioteca Documental:</strong><br><br><button onclick='irABibliotecaDocumental()' class='opico-link-btn'>📚 Abrir Biblioteca</button>";
    } else {
        respuesta = `🤖 Te sugiero consultar nuestro menú principal o ingresar a la sección de soporte técnico.`;
    }

    setTimeout(() => { agregarMensaje(respuesta, false); }, 300);
}

// -------------------------------------------------------------------------
// 4. REGISTRO DE VISTAS DE CONTENIDO (SPA)
// -------------------------------------------------------------------------
const contentRegistry = {
    'soporte-tecnico': `<div class="opico-soporte-container"><div class="soporte-header"><h2>Mesa de Ayuda y Soporte</h2><p>Centro de asistencia técnica distrital San Juan Opico.</p></div></div>`,
    'noticias-home': `<div class="news-hero-container"><h1 class="news-title">Sección Oficial de Noticias</h1><p>Información y eventos relevantes del Distrito de San Juan Opico.</p></div>`,
    'estudiar-home': `<div class="ae-main-container"><h2>Estrategia Aprendamos a Estudiar</h2></div>`,
    'biblioteca-home': `<div class="opico-binaes-container"><h1 class="biblioteca-titulo">BIBLIOTECA DOCUMENTAL</h1></div>`,
    'calendario-home': `<div class="opico-binaes-container"><h2>Calendario Escolar 2026</h2></div>`,
    'derechos-home': `<div class="dh-hero-container"><h1 class="dh-title">Derechos Humanos</h1></div>`,
    'directorio-home': `<div class="dir-header"><h1>Directorio Telefónico</h1></div>`,
    'fiction-home': `<div class="fh-container"><h1>Fiction Express</h1></div>`,
    'primera-infancia-home': `<div class="page-header"><h1>Primera Infancia</h1></div>`
};

// -------------------------------------------------------------------------
// 5. INICIALIZACIÓN AL CARGAR LA PÁGINA
// -------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    iniciarContadorPremium();

    // Toggle para menú responsive en móvil
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => { sidebar.classList.add('active'); overlay.classList.add('active'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });
    }

    // Submenús desplegables
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const parent = this.parentElement;
            if (parent.querySelector('.submenu')) {
                parent.classList.toggle('open');
            }
        });
    });
});
