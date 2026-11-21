/**
 * ROSANA - CLASES PARTICULARES • TECNOEDUCA
 * Script interactivo completo:
 * - Curriculum Vitae (CV) interactivo y enlace de descarga
 * - LinkedIn integrado en ecosistema de redes y ajustes
 * - Blog dinámico con lector y compartir sutil
 * - Panel Administrativo con modo Pantalla Completa y modificación de artículos
 * - Bandeja de consultas y moderación de comentarios
 * - Textos legales y constructor de consultas a WhatsApp
 */

// ===================================================================
// CONTROLADOR GLOBAL DEL MENÚ MÓVIL / SANDWICH LATERAL (DELICADO)
// ===================================================================
window.toggleMobileNav = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const navMenu = document.getElementById('navMenu');
  const menuToggle = document.getElementById('menuToggle');
  const navBackdrop = document.getElementById('navBackdrop');
  if (!navMenu) return;

  const isOpen = navMenu.classList.toggle('open');
  if (menuToggle) {
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
  if (navBackdrop) {
    navBackdrop.classList.toggle('open', isOpen);
  }
  document.body.classList.toggle('mobile-menu-active', isOpen);
};

window.closeMobileNav = function() {
  const navMenu = document.getElementById('navMenu');
  const menuToggle = document.getElementById('menuToggle');
  const navBackdrop = document.getElementById('navBackdrop');
  if (navMenu) navMenu.classList.remove('open');
  if (menuToggle) {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (navBackdrop) {
    navBackdrop.classList.remove('open');
  }
  document.body.classList.remove('mobile-menu-active');
};

// ===================================================================
// ASISTENTE DE CHAT FLOTANTE CON ROSANA (DESPLEGABLE TIPO CHAT)
// ===================================================================
let selectedChatTopic = 'Clases Particulares';

window.toggleRosanaChat = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const widget = document.getElementById('rosanaChatWidget');
  if (widget) {
    widget.classList.toggle('open');
  }
};

window.closeRosanaChat = function() {
  const widget = document.getElementById('rosanaChatWidget');
  if (widget) widget.classList.remove('open');
};

window.selectChatTopic = function(btn, topic) {
  selectedChatTopic = topic;
  window.selectedChatTopic = topic;
  document.querySelectorAll('.rcw-option-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
};

window.submitRosanaChat = async function() {
  const nameInput = document.getElementById('rcwInputName');
  const msgInput = document.getElementById('rcwInputMsg');
  const name = nameInput ? nameInput.value.trim() : '';
  const message = msgInput ? msgInput.value.trim() : '';

  if (!message) {
    alert('Por favor escribí brevemente tu duda o consulta.');
    if (msgInput) msgInput.focus();
    return;
  }

  const currentTopic = window.selectedChatTopic || (typeof selectedChatTopic !== 'undefined' ? selectedChatTopic : 'Clases Particulares');

  // 1. Armar mensaje estructurado para WhatsApp
  const settings = typeof getStoredSettings === 'function' ? getStoredSettings() : {};
  let waText = '¡Hola Rosana! Te contacto desde el chat de tu web por una consulta sobre *' + currentTopic + '*.';
  if (name) waText += ' Mi nombre es *' + name + '*.';
  waText += '\n\n' + message;

  const cleanPhone = (settings && settings.phoneClean) ? settings.phoneClean : '5492323523149';
  const waUrl = 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(waText);

  // Abrir WhatsApp directo con alternativa si el navegador bloquea ventanas emergentes
  let waWin = null;
  try {
    waWin = window.open(waUrl, '_blank');
  } catch (e) {
    waWin = null;
  }
  if (!waWin || waWin.closed || typeof waWin.closed === 'undefined') {
    window.location.href = waUrl;
  }

  // 2. Guardar en bandeja de mensajes web y Supabase por seguridad
  const newInquiry = {
    id: 'msg-' + Date.now(),
    name: name || 'Consultante Chat Web',
    email: 'Sin correo (Consulta Chat)',
    phone: '',
    subject: 'Consulta Chat: ' + currentTopic,
    message: message,
    date: new Date().toLocaleString('es-AR'),
    read: false
  };

  try {
    if (!window.supabaseDB || typeof window.supabaseDB.insertMessage !== 'function') {
      throw new Error('El servicio de mensajes no está disponible.');
    }
    await window.supabaseDB.insertMessage(newInquiry);
  } catch (err) {
    console.error('No se pudo registrar la consulta del chat en Supabase:', err);
    alert('La consulta se abrió en WhatsApp, pero no se pudo guardar en la bandeja del sitio. Por favor, enviá el formulario de contacto para que también llegue al panel.');
  }

  // 3. Mostrar el mensaje de recepción de Rosana en el chat y ocultar formulario
  const receiptEl = document.getElementById('rcwReceiptMessage');
  const receiptText = document.getElementById('rcwReceiptText');
  const formCard = document.getElementById('rcwFormCard');

  if (receiptText) {
    receiptText.textContent = name 
      ? '¡Gracias ' + name + '! Tu consulta sobre "' + currentTopic + '" fue enviada a mi WhatsApp. Te responderé a la brevedad. ¡Que tengas un excelente día! ♡'
      : '¡Tu consulta sobre "' + currentTopic + '" fue enviada a mi WhatsApp! Te responderé a la brevedad. ¡Que tengas un excelente día! ♡';
  }

  if (receiptEl) {
    receiptEl.style.display = 'flex';
    receiptEl.classList.add('visible');
  }

  if (formCard) {
    formCard.style.display = 'none';
  }

  const bodyEl = document.getElementById('rcwBody');
  if (bodyEl) {
    setTimeout(() => {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }, 100);
  }
};

window.openConciergeModal = window.toggleRosanaChat;
window.closeConciergeModal = window.closeRosanaChat;
window.initConciergeSystem = function() {};
window.sendChatViaWhatsApp = window.submitRosanaChat;
window.sendChatToPanel = window.submitRosanaChat;

// ===================================================================
// DATOS INICIALES POR DEFECTO (Se guardan en localStorage)
// ===================================================================
const DEFAULT_ARTICLES = [
  {
    id: 'post-1',
    title: 'Cómo perderle el miedo a la Física: 5 claves para entender sin memorizar',
    category: 'Física',
    date: '18 Oct 2026',
    scheduledDate: '2026-10-18',
    scheduledTime: '10:00',
    scheduledAt: '2026-10-18T10:00:00',
    publishStatus: 'published',
    readTime: '4 min de lectura',
    excerpt: 'Muchos estudiantes se traban al intentar recordar decenas de fórmulas. Te cuento cómo el razonamiento sobre las fuerzas y el diagrama de cuerpo libre cambian todo.',
    body: `La Física suele percibirse como una de las materias más intimidantes tanto en la secundaria como en los ingresos universitarios. Sin embargo, el 90% de las dificultades provienen de un mismo error: **intentar memorizar fórmulas de memoria sin comprender los fenómenos físicos que representan**.\n\n### 1. El Diagrama de Cuerpo Libre es tu mejor aliado\nAntes de escribir cualquier número, dibujá siempre el objeto y todas las fuerzas que actúan sobre él: el peso, la normal, el rozamiento y las tensiones. Si el diagrama está bien planteado, la ecuación matemática surge casi por sí sola.\n\n### 2. Entendé el significado de cada variable\nNo memorices solo *F = m · a*. Pensá en la realidad: para acelerar una masa el doble de pesada, necesitás el doble de fuerza. Cuando le ponés lógica cotidiana a las magnitudes, las fórmulas dejan de ser jeroglíficos.\n\n### 3. Las unidades hablan\nVerificá siempre las unidades de medida (metros, segundos, Newtons, Joules). El análisis dimensional te avisa si cometiste un error algebraico antes de entregar el examen.\n\n> "Entender la física es aprender a mirar el mundo que te rodea con ojos curiosos y analíticos."`,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    downloadUrl: '',
    comments: [
      {
        id: 'c-1',
        author: 'Martín S.',
        email: 'martin@ejemplo.com',
        text: '¡Excelente explicación, Rosana! Siempre me costaba darme cuenta de hacia dónde iba la fuerza de rozamiento.',
        date: '19 Oct 2026',
        reply: '¡Hola Martín! Me alegro mucho. Acordate siempre de que el rozamiento se opone al deslizamiento relativo entre las superficies. ¡Nos vemos en clase!'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'De la Matemática a la Ciencia de Datos: El valor del álgebra en el futuro tecnológico',
    category: 'Ciencia de Datos',
    date: '10 Oct 2026',
    scheduledDate: '2026-10-10',
    scheduledTime: '14:30',
    scheduledAt: '2026-10-10T14:30:00',
    publishStatus: 'published',
    readTime: '6 min de lectura',
    excerpt: '¿Por qué las matrices, los vectores y las funciones son el cimiento de la Inteligencia Artificial y el análisis de grandes volúmenes de datos?',
    body: `Cuando los estudiantes me preguntan: *"¿Para qué me va a servir calcular una matriz o una derivada en la vida real?"*, mi respuesta hoy es más clara y apasionante que nunca: **es el lenguaje con el que se construye toda la tecnología moderna**.\n\nComo estudiante de la carrera de Analista Universitario en Ciencias de Datos en la Universidad Nacional de Luján (UNLu), compruebo a diario cómo los conceptos de Álgebra Lineal y Análisis Matemático cobran vida:\n\n- **Vectores y Matrices:** Una imagen digital, un archivo de audio o el perfil de un usuario en un algoritmo de recomendación son, en esencia, matrices de números.\n- **Optimización y Cálculo:** El entrenamiento de redes neuronales se basa en derivadas (gradiente descendente) para minimizar el error de predicción.\n- **Probabilidad y Estadística:** La toma de decisiones basada en evidencia requiere entender distribuciones, desvíos estándar e intervalos de confianza.\n\n### Aprender con sentido práctico\nEn mis clases de Matemática conectamos las fórmulas teóricas con su aplicación tecnológica. Quien domina la lógica matemática no solo aprueba la materia: se prepara para las profesiones mejor valoradas del presente y del futuro.`,
    videoUrl: '',
    downloadUrl: '',
    comments: []
  },
  {
    id: 'post-3',
    title: 'Guía de Estequiometría: Paso a paso para no perderte en los moles y masas',
    category: 'Química',
    date: '02 Oct 2026',
    scheduledDate: '2026-10-02',
    scheduledTime: '09:15',
    scheduledAt: '2026-10-02T09:15:00',
    publishStatus: 'published',
    readTime: '5 min de lectura',
    excerpt: 'El balanceo de reacciones y el reactivo limitante explicados con el método de las proporciones directas. Incluye tips para parciales.',
    body: `La estequiometría es el corazón de la Química General. Si dominás el pasaje entre gramos, moles y moléculas, tenés el 70% de la materia resuelta.\n\n### El secreto: El puente del Mol\nNunca intentes pasar directamente de gramos del reactivo A a gramos del producto B sin pasar por el **mol**. El mol es la moneda de cambio universal de la química:\n\n1. Escribí y balanceá correctamente la ecuación química.\n2. Convertí los datos que te da el enunciado a moles utilizando la masa molar.\n3. Aplicá la relación estequiométrica que indican los coeficientes balanceados.\n4. Volvé a la unidad que te solicita la pregunta (gramos, litros en CNPT o número de partículas).\n\n> "La paciencia y el orden en la hoja son la mitad del éxito en los problemas de química."`,
    videoUrl: '',
    downloadUrl: 'https://t.me/tecnoeduca',
    comments: []
  },
  {
    id: 'post-scheduled-1',
    title: 'Estrategias de Repaso Intensivo para Mesas Evaluadoras y Previas',
    category: 'Metodología',
    date: '28 Oct 2026',
    scheduledDate: '2026-10-28',
    scheduledTime: '17:00',
    scheduledAt: '2026-10-28T17:00:00',
    publishStatus: 'scheduled',
    readTime: '4 min de lectura',
    excerpt: 'Un cronograma de estudio espaciado con simulacros de parciales cronometrados para consolidar los temas más tomados en las mesas de examen.',
    body: `Las mesas evaluadoras y exámenes de fin de ciclo escolar suelen generar ansiedad si no se cuenta con un método claro.\n\n### 1. El método del embudo\nComenzá repasando los conceptos troncales que articulan toda la materia: en matemática, el pasaje de términos y el concepto de función; en física, las leyes de Newton y energía; en química, el mol y la estructura atómica.\n\n### 2. Ejercitación cronometrada\nSimulá las condiciones del examen real: sentate con hoja en blanco, cronómetro de 60 minutos y sin mirar las respuestas hasta terminar el ejercicio completo.\n\n> "La seguridad ante una mesa de examen se construye resolviendo problemas paso a paso con orden y método."`,
    videoUrl: '',
    downloadUrl: '',
    comments: []
  }
];

const DEFAULT_BOOKS = [
  {
    id: 'book-1',
    title: 'Cálculo y Álgebra Lineal: Ejercicios Resueltos y Aplicaciones Prácticas',
    author: 'Prof. Rosana • Matemática, Física y Química',
    category: 'Matemática',
    year: '2026',
    pages: '124 páginas',
    excerpt: 'Guía práctica universitaria con desarrollos paso a paso de matrices, determinantes, derivadas, integrales y problemas de optimización.',
    driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    accessType: 'free',
    date: '24 Oct 2026'
  },
  {
    id: 'book-2',
    title: 'Física I: Mecánica Clásica, Cinemática y Leyes de Newton',
    author: 'Compilación Didáctica • TecnoEduca',
    category: 'Física',
    year: '2026',
    pages: '98 páginas',
    excerpt: 'Cuadernillo de estudio con diagramas de cuerpo libre, cinemática, dinámica y trabajo/energía para nivel secundario avanzado y primeros años universitarios.',
    driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    accessType: 'read_only',
    date: '18 Oct 2026'
  },
  {
    id: 'book-3',
    title: 'Química General e Inorgánica: Estequiometría y Balanceo Paso a Paso',
    author: 'Prof. Rosana • Material de Estudio',
    category: 'Química',
    year: '2026',
    pages: '82 páginas',
    excerpt: 'El concepto de mol, balanceo de reacciones redox, reactivo limitante, soluciones acuosas y cálculos estequiométricos explicados con claridad.',
    driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    accessType: 'free',
    date: '12 Oct 2026'
  },
  {
    id: 'book-4',
    title: 'Introducción a la Ciencia de Datos: Lógica de Programación y Análisis',
    author: 'Prof. Rosana • UNLu & TecnoEduca',
    category: 'Ciencia de Datos',
    year: '2026',
    pages: '110 páginas',
    excerpt: 'Conceptos fundamentales de lógica computacional, matrices numéricas, estructuras de datos y visualización gráfica aplicados a problemas reales.',
    driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    accessType: 'free',
    date: '08 Oct 2026'
  },
  {
    id: 'book-5',
    title: 'Metodología de Estudio en Ciencias: Estrategias de Comprensión y Exámenes',
    author: 'Prof. Rosana',
    category: 'Metodología',
    year: '2026',
    pages: '64 páginas',
    excerpt: 'Técnicas pedagógicas para abordar problemas de física y matemática, cómo organizar las fórmulas y cómo evitar bloqueos en exámenes finales.',
    driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    accessType: 'read_only',
    date: '02 Oct 2026'
  }
];

const DEFAULT_RESOURCES = [
  {
    id: 'res-inter-1',
    title: 'Tabla Periódica Interactiva: Propiedades, Masas & Configuración Electrónica',
    category: 'interactivas',
    categoryLabel: '⚛️ Aplicación Interactiva',
    format: 'Web App Interactiva & Visual',
    formatIcon: '⚛️',
    software: 'Navegador Web / HTML5 / JS',
    description: 'Herramienta interactiva para explorar todos los elementos químicos, grupos, períodos, radios atómicos, electronegatividades y diagramas de configuración electrónica en tiempo real.',
    previewIcon: '🧪',
    previewColor: '#7C3AED',
    url: 'https://cecid-unlu.net.ar/',
    fileType: 'link',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito para docentes y alumnos',
    licenseType: 'free',
    date: '10 Nov 2026'
  },
  {
    id: 'res-inter-2',
    title: 'Simulador Dinámico: Cinemática, Leyes de Newton y Reacciones Nucleares',
    category: 'interactivas',
    categoryLabel: '⚛️ Aplicación Interactiva',
    format: 'Simulador Físico en Tiempo Real',
    formatIcon: '🔬',
    software: 'Navegador Web / Canvas interactivo',
    description: 'Simulador de física interactiva: análisis de movimiento (MRU/MRUV), vectores de fuerza, choque elástico y modelos conceptuales de desintegración radiactiva y reacciones nucleares.',
    previewIcon: '⚡',
    previewColor: '#2563EB',
    url: 'https://cecid-unlu.net.ar/',
    fileType: 'link',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito para educación',
    licenseType: 'free',
    date: '08 Nov 2026'
  },
  {
    id: 'res-inter-3',
    title: 'Visualizador Estadístico & Análisis de Datos para Ciencias',
    category: 'interactivas',
    categoryLabel: '📊 Aplicación Interactiva',
    format: 'Visualizador Cuantitativo Online',
    formatIcon: '📊',
    software: 'Web / Python / JavaScript',
    description: 'Entorno interactivo para cargar datos numéricos, generar gráficos de dispersión, histogramas, calcular medias, desviaciones estándar y ajustar líneas de tendencia en vivo.',
    previewIcon: '📈',
    previewColor: '#059669',
    url: 'https://cecid-unlu.net.ar/',
    fileType: 'link',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito',
    licenseType: 'free',
    date: '05 Nov 2026'
  },
  {
    id: 'res-inter-4',
    title: 'Simulador de Reacciones Químicas, Moles & Reactivo Limitante',
    category: 'interactivas',
    categoryLabel: '🧪 Aplicación Interactiva',
    format: 'Calculadora y Simulador Visual',
    formatIcon: '⚗️',
    software: 'Navegador Web / Interactivo',
    description: 'Simulador estequiométrico que permite balancear reacciones químicas, visualizar reactivos y productos en escala molar y calcular reactivo limitante con gráficos de barras.',
    previewIcon: '⚗️',
    previewColor: '#D97706',
    url: 'https://cecid-unlu.net.ar/',
    fileType: 'link',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito',
    licenseType: 'free',
    date: '01 Nov 2026'
  },
  {
    id: 'res-img-local',
    title: 'Banco de Imágenes Científicas, Gráficos y Recursos de Diseño',
    category: 'imagenes',
    categoryLabel: '🖼️ Base de Datos de Imágenes Libres',
    format: 'PNG Transparente + JPG HD + SVG',
    formatIcon: '🖼️',
    software: 'Carpeta Recursos/imagenes / Editores gráficos',
    description: 'Base de datos y banco de recursos gráficos de diseño: esquemas de laboratorio, fórmulas vectorizadas, infografías y diagramas listos para descargar y utilizar en clases y presentaciones.',
    previewIcon: '🎨',
    previewColor: '#0284C7',
    url: 'Recursos/imagenes/',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito (Descarga libre)',
    licenseType: 'free',
    date: '28 Oct 2026'
  },
  {
    id: 'res-img-1',
    title: 'Banco de Ilustraciones y Esquemas Didácticos HD',
    category: 'imagenes',
    categoryLabel: '🖼️ Imágenes Libres de Uso Común',
    format: 'PNG Transparente + JPG HD',
    formatIcon: '🖼️',
    software: 'Canva / Word / PowerPoint / Photoshop',
    description: 'Colección de gráficos científicos, figuras geométricas, diagramas de laboratorio y flechas vectoriales en alta definición con fondo transparente. 100% libre uso común para clases, flyers, presentaciones o redes.',
    previewIcon: '🖼️',
    previewColor: '#0284C7',
    url: 'Recursos/imagenes/',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito (Dominio Público / Sin restricciones)',
    licenseType: 'free',
    date: '25 Oct 2026'
  },
  {
    id: 'res-arch-1',
    title: 'Pack de Archivos Pedagógicos: Cuadernillo de Fórmulas y Guías Prácticas',
    category: 'archivos',
    categoryLabel: '📁 Archivos & Guías Didácticas',
    format: 'PDF Imprimible + Documentos',
    formatIcon: '📁',
    software: 'Lector PDF / Word / Impresora',
    description: 'Cuadernillo descargable con compendio de fórmulas de Matemática, Física y Química, tablas de constantes físicas y químicas, y grillas de autoevaluación para estudiantes.',
    previewIcon: '📁',
    previewColor: '#7E569B',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito (Descarga directa)',
    licenseType: 'free',
    date: '24 Oct 2026'
  },
  {
    id: 'res-vid-1',
    title: 'Clips y Animaciones Conceptuales de Física y Química en Loop',
    category: 'videos',
    categoryLabel: '🎥 Videos Didácticos Libres',
    format: 'Video MP4 (1080p) + GIF',
    formatIcon: '🎥',
    software: 'CapCut, Premiere, Canva Video, PowerPoint',
    description: 'Animaciones en bucle continuo de movimiento armónico, ondas, fuerzas vectoriales y dinámica molecular. Listos para proyectar en clases o utilizar en reels y videos educativos.',
    previewIcon: '🎥',
    previewColor: '#D97706',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito (Podés descargarlo y usarlo en tus videos)',
    licenseType: 'free',
    date: '22 Oct 2026'
  },
  {
    id: 'res-img-2',
    title: 'Fotografías de Uso Libre: Ambientes de Estudio, Instrumental y Libros',
    category: 'imagenes',
    categoryLabel: '🖼️ Fotos Libres en Alta Calidad',
    format: 'JPG Ultra HD (300 DPI)',
    formatIcon: '📸',
    software: 'Cualquier dispositivo o editor de imágenes',
    description: 'Pack de fotografías en alta resolución libres de derechos de autor con temática de estudio: cuadernos, apuntes, instrumental y paisajes con luz natural. Descargalas y usalas libremente en tus proyectos o publicaciones.',
    previewIcon: '📸',
    previewColor: '#059669',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito (CC0 / Dominio Público)',
    licenseType: 'free',
    date: '20 Oct 2026'
  },
  {
    id: 'res-vid-2',
    title: 'Video Animado: Pizarra Científica y Partículas Matemáticas Flotantes',
    category: 'videos',
    categoryLabel: '🎥 Video & Loop Animado',
    format: 'Video MP4 (1080p Full HD)',
    formatIcon: '🎥',
    software: 'Reproductores de video / Editores de video',
    description: 'Video de fondo en loop con fórmulas flotantes, partículas de luz y estética moderna de ciencias. Perfecto para intros de videos de YouTube, clases virtuales o fondos de pantalla animados.',
    previewIcon: '✨',
    previewColor: '#4F46E5',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'Uso 100% Libre y Gratuito',
    licenseType: 'free',
    date: '19 Oct 2026'
  },
  {
    id: 'res-1',
    title: 'Plantilla de Resumen Visual para Exámenes de Matemática, Física y Química',
    category: 'plantillas',
    categoryLabel: 'Plantilla Editable',
    format: 'Canva Editable',
    formatIcon: '🎨',
    software: 'Canva (Gratis)',
    description: 'Plantilla estructurada y lista para editar en Canva con bloques para fórmulas clave, definiciones, pasos de resolución y tips para rendir finales o parciales sin lagunas.',
    previewIcon: '📋',
    previewColor: '#7E569B',
    url: 'https://www.canva.com',
    fileType: 'link',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'CC BY 4.0 (Uso libre y gratuito mencionando a la autora)',
    licenseType: 'cc-by',
    date: '18 Oct 2026'
  },
  {
    id: 'res-2',
    title: 'Pack de Ilustraciones Vectoriales: Vectores y Dinámica en Física',
    category: 'ciencias',
    categoryLabel: 'Esquemas & Vectores',
    format: 'PNG HD + SVG Vector',
    formatIcon: '🖼️',
    software: 'Cualquier editor / Word / PowerPoint',
    description: 'Diagramas transparentes en alta resolución de planos inclinados, descomposición de fuerzas en ejes cartesianos, vectores concurrentes y cinemática para ilustrar trabajos.',
    previewIcon: '⚛️',
    previewColor: '#00897B',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'CC BY 4.0 (Uso libre y gratuito mencionando a la autora)',
    licenseType: 'cc-by',
    date: '15 Oct 2026'
  },
  {
    id: 'res-3',
    title: 'Dataset Limpio + Cuaderno Jupyter: Análisis Cuantitativo en Python',
    category: 'tecnologia',
    categoryLabel: 'Archivo Tech & Datos',
    format: 'CSV + Notebook (.ipynb)',
    formatIcon: '💻',
    software: 'Python 3, Google Colab o Jupyter',
    description: 'Archivo de datos reales limpio y preparado junto con un cuaderno explicativo paso a paso en Python para aprender a filtrar, calcular promedios y graficar con Matplotlib.',
    previewIcon: '📊',
    previewColor: '#2E7D32',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'CC BY 4.0 (Uso libre y gratuito mencionando a la autora)',
    licenseType: 'cc-by',
    date: '12 Oct 2026'
  },
  {
    id: 'res-4',
    title: 'Calculadora Automatizada de Estequiometría y Reactivo Limitante',
    category: 'ciencias',
    categoryLabel: 'Hoja de Cálculo',
    format: 'Excel (.xlsx) / Google Sheets',
    formatIcon: '📈',
    software: 'Microsoft Excel / Google Sheets',
    description: 'Planilla editable con fórmulas precargadas para comprobar cálculos molares, balanceo y rendimiento teórico vs experimental en ejercicios de química general.',
    previewIcon: '🧪',
    previewColor: '#F59E0B',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'CC BY 4.0 (Uso libre y gratuito mencionando a la autora)',
    licenseType: 'cc-by',
    date: '08 Oct 2026'
  },
  {
    id: 'res-5',
    title: 'Infografía Pedagógica: Comportamiento Gráfico de Funciones Matemáticas',
    category: 'ciencias',
    categoryLabel: 'Infografía & Gráficos',
    format: 'PDF Imprimible + PNG HD',
    formatIcon: '📐',
    software: 'Visor PDF / Imagen',
    description: 'Esquema gráfico comparativo de funciones lineales, cuadráticas, exponenciales y racionales, mostrando raíces, vértices, asíntotas y conjuntos de positividad.',
    previewIcon: '📉',
    previewColor: '#7C3AED',
    url: 'https://drive.google.com',
    fileType: 'download',
    authorCredit: 'Prof. Rosana (TecnoEduca)',
    license: 'CC BY 4.0 (Uso libre y gratuito mencionando a la autora)',
    licenseType: 'cc-by',
    date: '05 Oct 2026'
  }
];

const DEFAULT_SETTINGS = {
  email: 'tecnoeduca81@gmail.com',
  whatsapp: '+54 9 2323 52-3149',
  phoneClean: '5492323523149',
  linkedin: 'https://www.linkedin.com/in/rosana-mar%C3%ADa-luj%C3%A1n-zunino-b21224a4',
  github: 'https://github.com/marialujanzunino',
  githubOrg: 'https://github.com/Rosana-TecnoEduca',
  cvUrl: '',
  canvaUrl: '',
  cvFileData: '',
  cvFileName: '',
  cvFileType: '',
  youtube: 'https://www.youtube.com/@TecnoEduca.Oficial',
  facebook: 'https://web.facebook.com/tecnoeduca81/',
  facebookPersonal: 'https://web.facebook.com/rosanamlzunino/',
  instagram: 'https://www.instagram.com/tecnoeduca.oficial',
  instagramPersonal: 'https://www.instagram.com/rosana.zunino',
  tiktok: 'https://www.tiktok.com/@tecnoeduca81',
  telegram: 'https://t.me/tecnoeduca',
  discord: 'https://discord.gg/WBAU2sXrfE',
  threads: 'https://www.threads.net/@tecnoeduca.oficial',
  threadsPersonal: 'https://www.threads.net/@rosana.zunino',
  substack: 'https://rosylujan.substack.com/',
};

// Variables globales de estado
let currentResourceCategory = 'all';

// ===================================================================
// STORAGE Y HELPERS
// ===================================================================

function getStoredArticles() {
  const data = localStorage.getItem('tecnoeduca_articles');
  let list = [];
  if (data !== null) {
    try {
      list = JSON.parse(data);
    } catch (e) {
      list = [];
    }
  } else {
    localStorage.setItem('tecnoeduca_articles', '[]');
  }

  // Normalizar atributos y verificar si algún post programado ya llegó a su fecha y hora
  let modified = false;
  const now = new Date();
  list.forEach(a => {
    if (!a.publishStatus) {
      a.publishStatus = 'published';
      modified = true;
    }
    if (a.publishStatus === 'scheduled' && a.scheduledAt) {
      const targetTime = new Date(a.scheduledAt);
      if (targetTime <= now) {
        a.publishStatus = 'published';
        modified = true;
      }
    }
  });

  if (modified) {
    localStorage.setItem('tecnoeduca_articles', JSON.stringify(list));
  }
  return list;
}

function saveArticles(articles) {
  localStorage.setItem('tecnoeduca_articles', JSON.stringify(articles));
}
window.saveBlogPosts = saveArticles;

function getStoredBooks() {
  const data = localStorage.getItem('tecnoeduca_books');
  try {
    const list = data ? JSON.parse(data) : [];
    localStorage.setItem('tecnoeduca_books', JSON.stringify(list));
    return list;
  } catch (e) {
    localStorage.setItem('tecnoeduca_books', '[]');
    return [];
  }
}

function saveBooks(books) {
  localStorage.setItem('tecnoeduca_books', JSON.stringify(books));
}

function getStoredResources() {
  const data = localStorage.getItem('tecnoeduca_resources');
  if (data !== null) {
    try {
      let list = JSON.parse(data);
      list = list.filter(r => r.category !== 'navidad' && (!r.title || !r.title.toLowerCase().includes('navid')));
      return list;
    } catch (e) {
      return [];
    }
  }
  localStorage.setItem('tecnoeduca_resources', '[]');
  return [];
}

function saveResources(resources) {
  localStorage.setItem('tecnoeduca_resources', JSON.stringify(resources));
}

function getStoredMessages() {
  const data = localStorage.getItem('tecnoeduca_messages');
  return data ? JSON.parse(data) : [];
}

function saveMessages(messages) {
  localStorage.setItem('tecnoeduca_messages', JSON.stringify(messages));
}

function getStoredSettings() {
  const data = localStorage.getItem('tecnoeduca_settings');
  if (!data) {
    localStorage.setItem('tecnoeduca_settings', JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    const parsed = JSON.parse(data);
    delete parsed.adminPass;
    // Migrar configuraciones si tienen datos anteriores
    if (parsed.email === 'contacto.tecnoeduca@gmail.com' || parsed.email === 'zunino.resanaml@gmail.com') {
      parsed.email = 'tecnoeduca81@gmail.com';
    }
    if (parsed.linkedin === 'https://www.linkedin.com/in/tecnoeduca') {
      parsed.linkedin = 'https://www.linkedin.com/in/rosana-mar%C3%ADa-luj%C3%A1n-zunino-b21224a4';
    }
    if (parsed.github === 'https://github.com/rosanazunino') {
      parsed.github = 'https://github.com/marialujanzunino';
    }
    if (!parsed.githubOrg || parsed.githubOrg === '' || parsed.githubOrg === 'https://github.com/marialujanzunino') {
      parsed.githubOrg = 'https://github.com/Rosana-TecnoEduca';
    }
    if (!parsed.youtube || parsed.youtube.includes('@tecnoeduca') && !parsed.youtube.includes('TecnoEduca.Oficial')) {
      parsed.youtube = 'https://www.youtube.com/@TecnoEduca.Oficial';
    }
    if (parsed.facebook === 'https://www.facebook.com/tecnoeduca') {
      parsed.facebook = DEFAULT_SETTINGS.facebook;
    }
    if (parsed.instagram === 'https://www.instagram.com/tecnoeduca') {
      parsed.instagram = DEFAULT_SETTINGS.instagram;
    }
    if (parsed.instagramPersonal === 'https://www.instagram.com/rosanazunino') {
      parsed.instagramPersonal = DEFAULT_SETTINGS.instagramPersonal;
    }
    if (parsed.tiktok === 'https://www.tiktok.com/@tecnoeduca') {
      parsed.tiktok = DEFAULT_SETTINGS.tiktok;
    }
    if (parsed.discord === 'https://discord.gg/tecnoeduca') {
      parsed.discord = DEFAULT_SETTINGS.discord;
    }
    if (parsed.threads === 'https://www.threads.net/@tecnoeduca') {
      parsed.threads = DEFAULT_SETTINGS.threads;
    }
    if (parsed.substack === 'https://substack.com') {
      parsed.substack = DEFAULT_SETTINGS.substack;
    }
    if (parsed.phoneClean === '5491131327776') {
      parsed.phoneClean = DEFAULT_SETTINGS.phoneClean;
    }
    if (parsed.whatsapp === '+54 9 11 3132-7776') {
      parsed.whatsapp = DEFAULT_SETTINGS.whatsapp;
    }
    if (!parsed.instagram) parsed.instagram = DEFAULT_SETTINGS.instagram;
    if (!parsed.instagramPersonal) parsed.instagramPersonal = DEFAULT_SETTINGS.instagramPersonal;
    if (!parsed.facebook) parsed.facebook = DEFAULT_SETTINGS.facebook;
    if (!parsed.facebookPersonal) parsed.facebookPersonal = DEFAULT_SETTINGS.facebookPersonal;
    if (!parsed.tiktok) parsed.tiktok = DEFAULT_SETTINGS.tiktok;
    if (!parsed.threads) parsed.threads = DEFAULT_SETTINGS.threads;
    if (!parsed.threadsPersonal) parsed.threadsPersonal = DEFAULT_SETTINGS.threadsPersonal;
    if (!parsed.substack) parsed.substack = DEFAULT_SETTINGS.substack;
    if (!parsed.youtube) parsed.youtube = DEFAULT_SETTINGS.youtube;
    if (!parsed.discord) parsed.discord = DEFAULT_SETTINGS.discord;
    if (!parsed.telegram || parsed.telegram.includes('+549')) parsed.telegram = 'https://t.me/tecnoeduca';
    if (!parsed.whatsapp || parsed.whatsapp === '') parsed.whatsapp = '+54 9 2323 52-3149';
    if (!parsed.phoneClean || parsed.phoneClean === '') parsed.phoneClean = '5492323523149';
    parsed.cvUrl = '';
    parsed.cvFileName = '';
    parsed.cvFileData = '';
    parsed.cvFileType = '';
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    delete merged.adminPass;
    localStorage.setItem('tecnoeduca_settings', JSON.stringify(merged));
    return merged;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  localStorage.setItem('tecnoeduca_settings', JSON.stringify(settings));
}

// ===================================================================
// INICIALIZACIÓN DEL DOM
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Actualizar año en pie de página
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Aplicar configuraciones de redes, LinkedIn y correos
  applySettingsToUI();

  // 3. Menú Móvil
  initMobileMenu();

  // 3-B. Asistente Concierge Móvil ("¿Tenés dudas o consultas?")
  if (typeof window.initConciergeSystem === 'function') {
    window.initConciergeSystem();
  }

  // 4. Header scroll effect
  initHeaderScroll();

  // 5. Renderizar Blog Dinámico
  renderBlogPosts('all');
  initBlogFilters();

  // 6. Renderizar Biblioteca Digital
  renderLibraryBooks('all', 'all', 'libraryHomeContainer');
  renderLibraryBooks('all', 'all', 'libraryAllContainer');
  initLibraryFilters();

  // 6-B. Renderizar Banco de Recursos Digitales & Gráficos
  renderResources('all');
  if (document.getElementById('homeResourcesContainer')) {
    renderResources('all', '', 'homeResourcesContainer');
  }
  initResourceFilters();

  // 7. Asistente interactivo de WhatsApp
  initWhatsAppAssistant();

  // 8. Sincronización pública en segundo plano con Supabase
  if (window.supabaseDB) {
    syncDataFromSupabase();
  }

  // 9. Cierre de modales al hacer clic en el fondo o presionar Escape
  window.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
      if (e.target.id === 'contactModal') closeContactModal();
      else if (e.target.id === 'legalModal') closeLegalModal();
      else if (e.target.id === 'articleModal' && typeof closeArticleModal === 'function') closeArticleModal();
      else if (e.target.id === 'resourceModal' && typeof closeResourceModal === 'function') closeResourceModal();
      else if (e.target.id === 'bookReaderModal' && typeof closeBookReader === 'function') closeBookReader();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContactModal();
      closeLegalModal();
      if (typeof closeArticleModal === 'function') closeArticleModal();
      if (typeof closeResourceModal === 'function') closeResourceModal();
      if (typeof closeBookReader === 'function') closeBookReader();
    }
  });

  // 11. Auto-selección y scroll para consultas dirigidas a contacto.html?asunto=...
  initURLContactParams();
  initContactSubjectAutoMessage();
  initContactFormAutofillMemory();

  // 12. Inicializar Carruseles Dinámicos
  initCarousels();
});

const SUBJECT_MESSAGE_TEMPLATES = {
  'Matemática': '¡Hola Rosana! Quisiera consultar por clases particulares de Matemática (temas a preparar, días y horarios disponibles, y coordinar modalidad presencial u online).',
  'Física': '¡Hola Rosana! Me gustaría consultar por clases de Física (temas a preparar, ejercicios de guía y coordinación de modalidad presencial u online).',
  'Química': '¡Hola Rosana! Te consulto para coordinar clases particulares de Química (temas, ejercicios prácticos y disponibilidad de días y horarios).',
  'Informática': '¡Hola Rosana! Quisiera consultar por clases y capacitación en Informática y herramientas digitales prácticas.',
  'Ingreso Universitario': '¡Hola Rosana! Quisiera consultar sobre las clases de preparación y acompañamiento para el Ingreso Universitario (CBC / UTN / UNLu).',
  'Curso de Canva para Docentes y Empresas': '¡Hola Rosana! Me interesa obtener más información y fechas del Curso de Canva (programa práctico, aranceles y modalidad).',
  'Curso de IA para Educación': '¡Hola Rosana! Quisiera recibir información detallada sobre el Curso de Inteligencia Artificial aplicada a la Educación.',
  'Diseño Web Profesional': '¡Hola Rosana! Quisiera solicitar asesoramiento y presupuesto para el desarrollo de un sitio web profesional.',
  'Web Solidaria para ONGs': '¡Hola Rosana! Te contacto en representación de una Organización Sin Fines de Lucro / ONG para solicitar el beneficio solidario de Landing Page institucional.',
  'Otro': '¡Hola Rosana! Te contacto para realizarte una consulta personalizada sobre...'
};

let isProgrammaticFocus = false;

function goToContactStep(step, allowPreview = false) {
  const step1 = document.getElementById('contactStep1');
  const step2 = document.getElementById('contactStep2');
  const successState = document.getElementById('contactSuccessState');
  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');
  const ind3 = document.getElementById('stepIndicator3');
  const num1 = document.getElementById('stepNum1');
  const num2 = document.getElementById('stepNum2');
  const num3 = document.getElementById('stepNum3');
  const line1 = document.getElementById('stepIndicatorLine1');
  const line2 = document.getElementById('stepIndicatorLine2');
  const notice = document.getElementById('step1Notice');

  if (step === 2) {
    const nameEl = document.getElementById('contactName');
    const surnameEl = document.getElementById('contactSurname');
    const emailEl = document.getElementById('contactEmail');
    const phoneEl = document.getElementById('contactPhone');

    // Limpiar errores visuales
    [nameEl, surnameEl, emailEl, phoneEl].forEach(el => {
      if (el) el.classList.remove('input-error');
    });
    if (notice) notice.style.display = 'none';

    // Si viene por el botón principal (no allowPreview), verificar si falta algo
    if (!allowPreview) {
      const name = nameEl ? nameEl.value.trim() : '';
      const surname = surnameEl ? surnameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';

      const missingFields = [];
      if (!name) {
        missingFields.push('Nombre');
        if (nameEl) nameEl.classList.add('input-error');
      }
      if (!surname) {
        missingFields.push('Apellido');
        if (surnameEl) surnameEl.classList.add('input-error');
      }
      if (!email && !phone) {
        missingFields.push('Correo o Teléfono/WhatsApp');
        if (emailEl) emailEl.classList.add('input-error');
        if (phoneEl) phoneEl.classList.add('input-error');
      }

      // Validar formato de email si fue ingresado
      if (email && (!email.includes('@') || !email.includes('.'))) {
        missingFields.push('un Correo Electrónico válido (ej: nombre@gmail.com)');
        if (emailEl) emailEl.classList.add('input-error');
      }

      if (missingFields.length > 0) {
        if (notice) {
          notice.innerHTML = `<span>⚠️ Por favor completá tu <strong>${missingFields.join(' y ')}</strong> para poder avanzar a tu consulta.</span>`;
          notice.style.display = 'block';
        }
        isProgrammaticFocus = true;
        if (!name && nameEl) nameEl.focus({ preventScroll: true });
        else if (!surname && surnameEl) surnameEl.focus({ preventScroll: true });
        else if (!email && emailEl) emailEl.focus({ preventScroll: true });
        else if (!phone && phoneEl) phoneEl.focus({ preventScroll: true });
        setTimeout(() => { isProgrammaticFocus = false; }, 200);
        return;
      }

      // Guardar en memoria local
      try {
        localStorage.setItem('tecnoeduca_user_contact', JSON.stringify({ name, surname, email, phone }));
      } catch (e) {}
    }

    // Cambiar a Paso 2: Tu Consulta
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';
    if (successState) successState.style.display = 'none';

    if (ind1) {
      ind1.className = 'step-indicator-item active completed';
      if (num1) num1.textContent = '✓';
    }
    if (line1) line1.classList.add('active');

    if (ind2) {
      ind2.className = 'step-indicator-item active';
      if (num2) num2.textContent = '2';
    }
    if (line2) line2.classList.remove('active');

    if (ind3) {
      ind3.className = 'step-indicator-item';
      if (num3) num3.textContent = '3';
    }

    handleContactSubjectChange();
    generateContactAutoMessage();

    // Solo alinear en móviles si quedó fuera de vista
    if (window.innerWidth < 768) {
      const formBox = document.querySelector('.contact-form-wrapper');
      if (formBox) {
        formBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  } else {
    // Volver a Paso 1: Tus Datos
    if (step2) step2.style.display = 'none';
    if (successState) successState.style.display = 'none';
    if (step1) step1.style.display = 'block';

    if (ind1) {
      ind1.className = 'step-indicator-item active';
      if (num1) num1.textContent = '1';
    }
    if (line1) line1.classList.remove('active');

    if (ind2) {
      ind2.className = 'step-indicator-item';
      if (num2) num2.textContent = '2';
    }
    if (line2) line2.classList.remove('active');

    if (ind3) {
      ind3.className = 'step-indicator-item';
      if (num3) num3.textContent = '3';
    }

    if (notice) notice.style.display = 'none';
  }
}

function handleContactSubjectChange() {
  const subjectEl = document.getElementById('contactSubject');
  const levelGroup = document.getElementById('academicLevelGroup');
  const gradeGroup = document.getElementById('secondaryGradeGroup');
  const entranceGroup = document.getElementById('universityEntranceGroup');
  const modalityGroup = document.getElementById('classModalityGroup');
  const modalityLabel = document.getElementById('contactModalityLabel');
  const modalitySelect = document.getElementById('contactModality');
  const courseGroup = document.getElementById('courseInfoGroup');
  const webTypeGroup = document.getElementById('webTypeGroup');
  const webTypeSelect = document.getElementById('contactWebType');
  const ngoAlert = document.getElementById('ngoBenefitAlert');
  const isNgoCheckbox = document.getElementById('contactIsNgo');
  const notice2 = document.getElementById('step2Notice');

  if (subjectEl) subjectEl.classList.remove('input-error');
  if (notice2) notice2.style.display = 'none';

  if (!subjectEl) return;
  const val = subjectEl.value;

  if (!val || val === '') {
    // Estado inicial / placeholder: todo oculto
    if (entranceGroup) entranceGroup.style.display = 'none';
    if (levelGroup) levelGroup.style.display = 'none';
    if (gradeGroup) gradeGroup.style.display = 'none';
    if (modalityGroup) modalityGroup.style.display = 'none';
    if (courseGroup) courseGroup.style.display = 'none';
    if (webTypeGroup) webTypeGroup.style.display = 'none';
    if (ngoAlert) ngoAlert.style.display = 'none';
    generateContactAutoMessage();
    return;
  }

  const isClass = ['Matemática', 'Física', 'Química', 'Informática'].includes(val);
  const isEntrance = val === 'Ingreso Universitario';
  const isWeb = val.includes('Diseño Web');
  const isNgoWeb = val.includes('Web Solidaria');
  const isCourse = val.includes('Canva') || val.includes('IA');

  if (isEntrance) {
    // Ingreso Universitario: No es secundario, es facultad/CBC/UTN/UNLu
    if (levelGroup) levelGroup.style.display = 'none';
    if (gradeGroup) gradeGroup.style.display = 'none';
    if (courseGroup) courseGroup.style.display = 'none';
    if (webTypeGroup) webTypeGroup.style.display = 'none';
    if (ngoAlert) ngoAlert.style.display = 'none';
    if (entranceGroup) entranceGroup.style.display = 'block';
    if (modalityGroup) modalityGroup.style.display = 'block';

    if (modalityLabel) modalityLabel.textContent = 'Modalidad de clase preferida';
    if (modalitySelect) {
      modalitySelect.innerHTML = `
        <option value="Presencial en Luján" selected>📍 Presencial en Luján (Centro)</option>
        <option value="Virtual / Online">💻 Virtual (Online en vivo con pizarra interactiva)</option>
        <option value="A coordinar">🤝 A coordinar (Presencial u Online)</option>
      `;
    }
    generateContactAutoMessage();
  } else if (isClass) {
    // Materias secundarias/universitarias
    if (entranceGroup) entranceGroup.style.display = 'none';
    if (courseGroup) courseGroup.style.display = 'none';
    if (webTypeGroup) webTypeGroup.style.display = 'none';
    if (ngoAlert) ngoAlert.style.display = 'none';
    if (levelGroup) levelGroup.style.display = 'block';
    if (modalityGroup) modalityGroup.style.display = 'block';

    if (modalityLabel) modalityLabel.textContent = 'Modalidad de clase preferida';
    if (modalitySelect) {
      modalitySelect.innerHTML = `
        <option value="Presencial en Luján" selected>📍 Presencial en Luján (Centro)</option>
        <option value="Virtual / Online">💻 Virtual (Online en vivo con pizarra interactiva)</option>
        <option value="A coordinar">🤝 A coordinar (Presencial u Online)</option>
      `;
    }
    handleContactLevelChange();
  } else if (isCourse) {
    // Cursos de Inteligencia Artificial y Canva son virtuales
    if (entranceGroup) entranceGroup.style.display = 'none';
    if (levelGroup) levelGroup.style.display = 'none';
    if (gradeGroup) gradeGroup.style.display = 'none';
    if (modalityGroup) modalityGroup.style.display = 'none';
    if (webTypeGroup) webTypeGroup.style.display = 'none';
    if (ngoAlert) ngoAlert.style.display = 'none';
    if (courseGroup) courseGroup.style.display = 'block';
    generateContactAutoMessage();
  } else if (isWeb || isNgoWeb) {
    // Desarrollo web: solo modalidad "A coordinar"
    if (entranceGroup) entranceGroup.style.display = 'none';
    if (levelGroup) levelGroup.style.display = 'none';
    if (gradeGroup) gradeGroup.style.display = 'none';
    if (courseGroup) courseGroup.style.display = 'none';
    if (webTypeGroup) webTypeGroup.style.display = 'block';
    if (modalityGroup) modalityGroup.style.display = 'block';

    if (modalityLabel) modalityLabel.textContent = 'Modalidad de trabajo / reuniones';
    if (modalitySelect) {
      modalitySelect.innerHTML = `
        <option value="A coordinar" selected>🤝 A coordinar (Reunión virtual o presencial)</option>
      `;
    }

    if (isNgoWeb) {
      if (isNgoCheckbox) isNgoCheckbox.checked = true;
      if (webTypeSelect) webTypeSelect.value = 'Landing Page';
      if (ngoAlert) ngoAlert.style.display = 'block';
    } else {
      if (isNgoCheckbox && isNgoCheckbox.checked) {
        if (webTypeSelect) webTypeSelect.value = 'Landing Page';
        if (ngoAlert) ngoAlert.style.display = 'block';
      } else {
        if (ngoAlert) ngoAlert.style.display = 'none';
      }
    }
    generateContactAutoMessage();
  } else {
    // Otro: Todo oculto
    if (entranceGroup) entranceGroup.style.display = 'none';
    if (levelGroup) levelGroup.style.display = 'none';
    if (gradeGroup) gradeGroup.style.display = 'none';
    if (modalityGroup) modalityGroup.style.display = 'none';
    if (courseGroup) courseGroup.style.display = 'none';
    if (webTypeGroup) webTypeGroup.style.display = 'none';
    if (ngoAlert) ngoAlert.style.display = 'none';
    generateContactAutoMessage();
  }
}

function handleNgoToggle(isChecked) {
  const ngoAlert = document.getElementById('ngoBenefitAlert');
  const webTypeSelect = document.getElementById('contactWebType');
  if (ngoAlert) ngoAlert.style.display = isChecked ? 'block' : 'none';
  if (isChecked && webTypeSelect) {
    webTypeSelect.value = 'Landing Page';
  }
  generateContactAutoMessage();
}

function handleWebTypeChange() {
  const isNgoCheckbox = document.getElementById('contactIsNgo');
  const webTypeSelect = document.getElementById('contactWebType');
  if (isNgoCheckbox && isNgoCheckbox.checked && webTypeSelect && webTypeSelect.value !== 'Landing Page') {
    webTypeSelect.value = 'Landing Page';
    alert('El beneficio solidario para Organizaciones Sin Fines de Lucro aplica exclusivamente para el armado de una (1) Landing Page institucional.');
  }
  generateContactAutoMessage();
}

function handleContactLevelChange() {
  const levelEl = document.getElementById('contactLevel');
  const gradeGroup = document.getElementById('secondaryGradeGroup');

  if (levelEl && gradeGroup) {
    if (levelEl.value === 'Secundario') {
      gradeGroup.style.display = 'block';
    } else {
      gradeGroup.style.display = 'none';
    }
  }
  generateContactAutoMessage();
}

function generateContactAutoMessage() {
  const nameEl = document.getElementById('contactName');
  const surnameEl = document.getElementById('contactSurname');
  const subjectEl = document.getElementById('contactSubject');
  const levelEl = document.getElementById('contactLevel');
  const gradeEl = document.getElementById('contactGrade');
  const entranceEl = document.getElementById('contactEntranceSubject');
  const modalityEl = document.getElementById('contactModality');
  const webTypeEl = document.getElementById('contactWebType');
  const isNgoCheckbox = document.getElementById('contactIsNgo');
  const messageEl = document.getElementById('contactMessage');

  if (!messageEl || !subjectEl) return;

  const subject = subjectEl.value;
  if (!subject || subject === '') {
    messageEl.value = '';
    messageEl.placeholder = 'Elegí qué te gustaría consultar arriba y tu mensaje se redactará automáticamente...';
    return;
  }

  const name = nameEl ? nameEl.value.trim() : '';
  const surname = surnameEl ? surnameEl.value.trim() : '';
  const fullName = surname ? `${name} ${surname}`.trim() : name;
  const greeting = fullName ? `¡Hola Rosana! Mi nombre es ${fullName}.` : '¡Hola Rosana!';

  const isEntrance = subject === 'Ingreso Universitario';
  const isClass = ['Matemática', 'Física', 'Química', 'Informática'].includes(subject);
  const isWeb = subject.includes('Diseño Web');
  const isNgoWeb = subject.includes('Web Solidaria') || (isWeb && isNgoCheckbox && isNgoCheckbox.checked);
  const isCanva = subject.includes('Canva');
  const isIA = subject.includes('IA');

  let text = '';

  if (isEntrance) {
    const entranceSubject = entranceEl && entranceEl.value ? entranceEl.value : 'Matemática';
    const modality = modalityEl ? modalityEl.value : 'Presencial en Luján';
    text = `${greeting} Te consulto por clases particulares de preparación para el Ingreso Universitario en ${entranceSubject} en modalidad ${modality}.\n\nQuisiera coordinar contigo la disponibilidad de días y horarios para comenzar.`;
  } else if (isClass) {
    const level = levelEl ? levelEl.value : 'Secundario';
    const grade = (level === 'Secundario' && gradeEl && gradeEl.value) ? ` (${gradeEl.value})` : '';
    const modality = modalityEl ? modalityEl.value : 'Presencial en Luján';
    text = `${greeting} Te consulto por clases particulares de ${subject} para nivel ${level}${grade} en modalidad ${modality}.\n\nQuisiera coordinar contigo la disponibilidad de días y horarios para comenzar.`;
  } else if (isNgoWeb) {
    text = `${greeting} Te contacto en representación de una Organización Sin Fines de Lucro / ONG para solicitar el armado bonificado de una Landing Page institucional (cubriendo nosotros únicamente los costos oficiales de dominio y hosting propio).\n\nQuisiéramos coordinar una reunión inicial para acreditar la entidad y comentarte los objetivos de nuestra labor comunitaria.`;
  } else if (isWeb) {
    const webType = webTypeEl ? webTypeEl.value : 'Landing Page';
    text = `${greeting} Te contacto para solicitar asesoramiento y presupuesto para el desarrollo de un ${webType} en modalidad a coordinar.\n\nMe gustaría coordinar una charla inicial para conversar sobre los objetivos del proyecto.`;
  } else if (isCanva) {
    text = `${greeting} Quisiera solicitar información sobre el Curso de Canva para Docentes y Empresas en modalidad Virtual (programa práctico, aranceles y fechas de cursada).`;
  } else if (isIA) {
    text = `${greeting} Me interesa recibir información detallada sobre el Curso de Inteligencia Artificial (IA) en Educación en modalidad Virtual (temario, aranceles y propuesta formativa).`;
  } else if (subject === 'Otro') {
    text = `${greeting} Te contacto desde tu página web para realizarte una consulta sobre...\n`;
  } else {
    text = '';
  }

  messageEl.value = text;
}

function initContactSubjectAutoMessage() {
  const select = document.getElementById('contactSubject');
  if (select) {
    handleContactSubjectChange();
  }
}

function handleContactEmailAutoFill() {
  const emailInput = document.getElementById('contactEmail');
  const nameInput = document.getElementById('contactName');
  const surnameInput = document.getElementById('contactSurname');
  const phoneInput = document.getElementById('contactPhone');
  if (!emailInput) return;

  const emailVal = emailInput.value.trim().toLowerCase();
  if (!emailVal) return;

  // 1. Si existe perfil guardado en este navegador (de consultas anteriores)
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('tecnoeduca_contact_profile') || 'null');
  } catch (e) {}

  if (saved && (saved.email && saved.email.toLowerCase() === emailVal || !saved.email)) {
    if (nameInput && !nameInput.value && saved.name) nameInput.value = saved.name;
    if (surnameInput && !surnameInput.value && saved.surname) surnameInput.value = saved.surname;
    if (phoneInput && !phoneInput.value && saved.phone) phoneInput.value = saved.phone;
    generateContactAutoMessage();
    return;
  }

  // 2. Si el usuario está probando con correo de Rosana o TecnoEduca
  if (emailVal.includes('tecnoeduca') || emailVal.includes('zunino')) {
    const settings = getStoredSettings();
    if (nameInput && !nameInput.value) nameInput.value = 'Rosana';
    if (surnameInput && !surnameInput.value) surnameInput.value = 'Zunino';
    if (phoneInput && !phoneInput.value) phoneInput.value = settings.whatsapp || '02323 52-3149';
    generateContactAutoMessage();
    return;
  }

  // 3. Extracción inteligente si el correo tiene formato nombre.apellido@... (ej: valentina.lopez@gmail.com)
  const atIdx = emailVal.indexOf('@');
  if (atIdx > 0) {
    const localPart = emailVal.substring(0, atIdx);
    const parts = localPart.split(/[\._\-]/).filter(p => p.length > 1 && !/\d/.test(p));
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    if (parts.length >= 2) {
      if (nameInput && !nameInput.value) nameInput.value = cap(parts[0]);
      if (surnameInput && !surnameInput.value) surnameInput.value = cap(parts[1]);
      generateContactAutoMessage();
    } else if (parts.length === 1 && nameInput && !nameInput.value) {
      nameInput.value = cap(parts[0]);
      generateContactAutoMessage();
    }
  }
}

function handleContactNameSplit() {
  const nameInput = document.getElementById('contactName');
  const surnameInput = document.getElementById('contactSurname');
  if (!nameInput || !surnameInput) return;

  const val = nameInput.value.trim();
  // Si el usuario escribió o el navegador autocompletó "Nombre Apellido" en el campo Nombre
  if (val.includes(' ') && !surnameInput.value) {
    const parts = val.split(/\s+/);
    if (parts.length >= 2) {
      nameInput.value = parts[0];
      surnameInput.value = parts.slice(1).join(' ');
      generateContactAutoMessage();
    }
  }
}

function applyQuickAutofillProfile() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('tecnoeduca_contact_profile') || 'null');
  } catch (e) {}

  if (!saved) {
    const settings = getStoredSettings();
    saved = {
      name: 'Rosana',
      surname: 'Zunino',
      email: settings.email || 'tecnoeduca81@gmail.com',
      phone: settings.whatsapp || '02323 52-3149'
    };
  }

  const nameInput = document.getElementById('contactName');
  const surnameInput = document.getElementById('contactSurname');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const chip = document.getElementById('quickAutofillChip');

  if (nameInput && saved.name) nameInput.value = saved.name;
  if (surnameInput && saved.surname) surnameInput.value = saved.surname;
  if (emailInput && saved.email) emailInput.value = saved.email;
  if (phoneInput && saved.phone) phoneInput.value = saved.phone;

  if (chip) chip.style.display = 'none';

  generateContactAutoMessage();

  const notice = document.getElementById('step1Notice');
  if (notice) notice.style.display = 'none';
}

function handleFieldFocusSuggestions(input) {
  if (isProgrammaticFocus) return;
  if (!input) return;
  // Solo sugerir si el usuario previamente guardó un perfil de contacto en su propio navegador
  if (!input.value || !input.value.trim()) {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('tecnoeduca_contact_profile') || 'null');
    } catch (e) {}

    if (!saved) return; // Si no hay datos guardados previamente, dejar el campo limpio para que el usuario escriba

    if (input.id === 'contactName' && saved.name) {
      input.value = saved.name;
    } else if (input.id === 'contactSurname' && saved.surname) {
      input.value = saved.surname;
    } else if (input.id === 'contactPhone' && saved.phone) {
      input.value = saved.phone;
    } else if (input.id === 'contactEmail' && saved.email) {
      input.value = saved.email;
    }

    input.classList.remove('input-error');
    const notice = document.getElementById('step1Notice');
    if (notice) notice.style.display = 'none';

    generateContactAutoMessage();
  }
}

function initContactFormAutofillMemory() {

  const nameInput = document.getElementById('contactName');
  const surnameInput = document.getElementById('contactSurname');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const notice = document.getElementById('step1Notice');
  const chip = document.getElementById('quickAutofillChip');
  const chipName = document.getElementById('quickAutofillName');

  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('tecnoeduca_contact_profile') || 'null');
  } catch (e) {}

  // Si existe perfil guardado en el navegador, mostrar el chip para completar con 1 clic
  if (saved && (saved.name || saved.email)) {
    if (chip && chipName) {
      chipName.textContent = `${saved.name || ''} ${saved.surname || ''} (${saved.email || saved.phone || ''})`.trim();
      chip.style.display = 'block';
    }
  }

  [nameInput, surnameInput, emailInput, phoneInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        inp.classList.remove('input-error');
        if (notice && nameInput && nameInput.value.trim() && ((emailInput && emailInput.value.trim()) || (phoneInput && phoneInput.value.trim()))) {
          notice.style.display = 'none';
        }
      });
    }
  });
}

function initCarousels() {
  // Los carruseles ahora se gestionan con CSS nativo fluido en móvil y grilla simétrica en PC
}

function initURLContactParams() {
  if (!window.location.search) return;
  const params = new URLSearchParams(window.location.search);
  const asunto = params.get('asunto') || params.get('materia') || params.get('subject');
  if (!asunto) return;

  const select = document.getElementById('contactSubject') || document.getElementById('modalContactSubject');
  if (select) {
    const raw = decodeURIComponent(asunto).trim().toLowerCase();
    for (let i = 0; i < select.options.length; i++) {
      const optVal = select.options[i].value.toLowerCase();
      const optText = select.options[i].text.toLowerCase();
      if (optVal.includes(raw) || raw.includes(optVal) || optText.includes(raw)) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  // No forzamos auto-scroll hacia el formulario para que la página comience siempre desde arriba
}

function applySettingsToUI() {
  const settings = getStoredSettings();

  // Correos
  const topEmailText = document.getElementById('topEmailText');
  const topEmailLink = document.getElementById('topEmailLink');
  const contactEmailAddress = document.getElementById('contactEmailAddress');
  const footerEmailText = document.getElementById('footerEmailText');

  if (topEmailText) topEmailText.textContent = settings.email;
  if (topEmailLink) topEmailLink.href = `mailto:${settings.email}`;
  if (contactEmailAddress) {
    contactEmailAddress.textContent = settings.email;
    contactEmailAddress.href = `mailto:${settings.email}`;
  }
  if (footerEmailText) {
    footerEmailText.textContent = settings.email;
    footerEmailText.href = `mailto:${settings.email}`;
  }

  // Redes
  const linkWA = document.getElementById('linkSocialWA');
  const lblWA = document.getElementById('lblSocialWA');
  if (linkWA) linkWA.href = `https://wa.me/${settings.phoneClean}`;
  if (lblWA) lblWA.textContent = 'Enviar mensaje directo ↗';

  // LinkedIn
  const linkLI = document.getElementById('linkSocialLI');
  const aboutLIBtn = document.getElementById('aboutLinkedInBtn');
  if (linkLI) linkLI.href = settings.linkedin || '#';
  if (aboutLIBtn) aboutLIBtn.href = settings.linkedin || '#';

  // GitHub
  const linkGH = document.getElementById('linkSocialGH');
  const lblGH = document.getElementById('lblSocialGH');
  const aboutGHBtn = document.getElementById('aboutGithubBtn');
  const aboutGHSide = document.getElementById('aboutGithubBtnSide');
  const cvGithubBtn = document.getElementById('cvGithubBtn');
  const ghClean = (settings.github || 'https://github.com/marialujanzunino').replace(/^https?:\/\//i, '');

  if (linkGH) linkGH.href = settings.github || 'https://github.com/marialujanzunino';
  if (lblGH) lblGH.textContent = ghClean;
  if (aboutGHBtn) aboutGHBtn.href = settings.github || 'https://github.com/marialujanzunino';
  if (aboutGHSide) aboutGHSide.href = settings.github || 'https://github.com/marialujanzunino';
  if (cvGithubBtn) cvGithubBtn.href = settings.github || 'https://github.com/marialujanzunino';

  // CV y Canva Buttons
  const cvDownloadDirectBtn = document.getElementById('cvDownloadDirectBtn');
  const aboutCanvaBtn = document.getElementById('aboutCanvaBtn');
  const cvCanvaDirectBtn = document.getElementById('cvCanvaDirectBtn');

  const canvaLink = settings.canvaUrl || '';
  const cvFile = settings.cvFileData || '';
  const cvAlternative = settings.cvUrl || '';

  // Botón Canva en "Sobre Mí"
  if (aboutCanvaBtn) {
    if (canvaLink) {
      aboutCanvaBtn.href = canvaLink;
      aboutCanvaBtn.style.display = 'inline-flex';
    } else if (cvFile) {
      aboutCanvaBtn.href = cvFile;
      aboutCanvaBtn.download = settings.cvFileName || 'CV_Rosana_Canva.pdf';
      aboutCanvaBtn.style.display = 'inline-flex';
      aboutCanvaBtn.textContent = '📄 Descargar CV';
    } else {
      aboutCanvaBtn.style.display = 'none';
    }
  }

  // Botón Canva en Header del Modal
  if (cvCanvaDirectBtn) {
    if (canvaLink) {
      cvCanvaDirectBtn.href = canvaLink;
      cvCanvaDirectBtn.style.display = 'inline-flex';
    } else {
      cvCanvaDirectBtn.style.display = 'none';
    }
  }

  // Botón Descargar CV (PDF o Archivo cargado)
  if (cvDownloadDirectBtn) {
    if (cvFile) {
      cvDownloadDirectBtn.href = cvFile;
      cvDownloadDirectBtn.download = settings.cvFileName || 'CV_Rosana.pdf';
      cvDownloadDirectBtn.target = '_self';
      cvDownloadDirectBtn.innerHTML = `<span>⬇️ Descargar CV (${escapeHTML(settings.cvFileName || 'PDF')})</span>`;
      cvDownloadDirectBtn.onclick = null;
    } else if (canvaLink || cvAlternative) {
      cvDownloadDirectBtn.href = canvaLink || cvAlternative;
      cvDownloadDirectBtn.target = '_blank';
      cvDownloadDirectBtn.innerHTML = '<span>⬇️ Ver / Descargar CV</span>';
      cvDownloadDirectBtn.onclick = null;
    } else {
      cvDownloadDirectBtn.href = 'javascript:void(0)';
      cvDownloadDirectBtn.target = '_self';
      cvDownloadDirectBtn.innerHTML = '<span>⬇️ Descargar CV</span>';
      cvDownloadDirectBtn.onclick = () => alert('📄 Podés subir tu archivo de CV exportado desde Canva (o pegar tu link) en el Panel Docente -> Pestaña Seguridad, CV & Redes.');
    }
  }

  // Tarjeta visual o aviso de Canva dentro del CV Modal
  const cvUploadedVisualCard = document.getElementById('cvUploadedVisualCard');
  const cvUploadedMediaContainer = document.getElementById('cvUploadedMediaContainer');
  const cvUploadedViewFullLink = document.getElementById('cvUploadedViewFullLink');
  const cvCanvaLinkCard = document.getElementById('cvCanvaLinkCard');
  const cvCanvaLinkAnchor = document.getElementById('cvCanvaLinkAnchor');

  if (cvUploadedVisualCard && cvUploadedMediaContainer) {
    if (cvFile) {
      cvUploadedVisualCard.style.display = 'block';
      if (cvUploadedViewFullLink) {
        cvUploadedViewFullLink.href = cvFile;
        cvUploadedViewFullLink.download = settings.cvFileName || 'CV_Rosana';
      }
      if (settings.cvFileType && settings.cvFileType.startsWith('image/')) {
        cvUploadedMediaContainer.innerHTML = `<img src="${cvFile}" alt="Curriculum Vitae Diseñado en Canva" class="cv-canva-image-preview">`;
      } else {
        cvUploadedMediaContainer.innerHTML = `
          <div class="cv-pdf-preview-box">
            <span class="pdf-icon">📄</span>
            <div>
              <strong>${escapeHTML(settings.cvFileName || 'CV_Rosana.pdf')}</strong>
              <p>Archivo listo para visualizar o descargar directamente a tu dispositivo.</p>
            </div>
            <a href="${cvFile}" download="${settings.cvFileName || 'CV_Rosana.pdf'}" class="btn btn-primary btn-sm">⬇️ Descargar Archivo</a>
          </div>
        `;
      }
    } else {
      cvUploadedVisualCard.style.display = 'none';
    }
  }

  if (cvCanvaLinkCard && cvCanvaLinkAnchor) {
    if (canvaLink) {
      cvCanvaLinkCard.style.display = 'flex';
      cvCanvaLinkAnchor.href = canvaLink;
    } else {
      cvCanvaLinkCard.style.display = 'none';
    }
  }

  // Enlaces de tarjetas principales y del footer
  const linkTG = document.getElementById('linkSocialTG');
  if (linkTG) linkTG.href = settings.telegram || 'https://t.me/tecnoeduca';

  const linkYT = document.getElementById('linkSocialYT');
  if (linkYT) linkYT.href = settings.youtube || 'https://www.youtube.com/@TecnoEduca.Oficial';

  const linkFB = document.getElementById('linkSocialFB');
  if (linkFB) linkFB.href = settings.facebook || 'https://web.facebook.com/tecnoeduca81/';

  const linkIG = document.getElementById('linkSocialIG');
  if (linkIG) linkIG.href = settings.instagram || 'https://www.instagram.com/tecnoeduca.oficial';

  const linkDC = document.getElementById('linkSocialDC');
  if (linkDC) linkDC.href = settings.discord || 'https://discord.gg/WBAU2sXrfE';

  // Enlaces directos en el footer
  const footerLinkWA = document.getElementById('footerLinkWA');
  if (footerLinkWA) {
    if (settings.phoneClean) {
      footerLinkWA.href = `https://wa.me/${settings.phoneClean}`;
    } else {
      footerLinkWA.removeAttribute('href');
      footerLinkWA.onclick = () => openContactModal('Consulta General');
    }
  }

  const footerLinkLI = document.getElementById('footerLinkLI');
  if (footerLinkLI) footerLinkLI.href = settings.linkedin || 'https://www.linkedin.com/in/rosana-mar%C3%ADa-luj%C3%A1n-zunino-b21224a4';

  const footerLinkGH = document.getElementById('footerLinkGH');
  if (footerLinkGH) footerLinkGH.href = settings.github || 'https://github.com/marialujanzunino';

  const footerLinkTG = document.getElementById('footerLinkTG');
  if (footerLinkTG) footerLinkTG.href = settings.telegram || 'https://t.me/tecnoeduca';

  const footerLinkYT = document.getElementById('footerLinkYT');
  if (footerLinkYT) footerLinkYT.href = settings.youtube || 'https://www.youtube.com/@TecnoEduca.Oficial';

  const footerLinkFB = document.getElementById('footerLinkFB');
  if (footerLinkFB) footerLinkFB.href = settings.facebook || 'https://web.facebook.com/tecnoeduca81/';

  const footerLinkIG = document.getElementById('footerLinkIG');
  if (footerLinkIG) footerLinkIG.href = settings.instagram || 'https://www.instagram.com/tecnoeduca.oficial';

  const footerLinkTT = document.getElementById('footerLinkTT');
  if (footerLinkTT && settings.tiktok) footerLinkTT.href = settings.tiktok;

  // Barra lateral flotante y footer de contacto
  document.querySelectorAll('.fs-wa, .s-wa').forEach(el => {
    if (settings.phoneClean) {
      const waUrl = `https://wa.me/${settings.phoneClean}?text=Hola%20Rosana!%20Te%20contacto%20desde%20tu%20sitio%20web.`;
      if (el.tagName.toLowerCase() === 'a') {
        el.href = waUrl;
      } else {
        el.onclick = () => window.open(waUrl, '_blank');
      }
    } else {
      if (el.tagName.toLowerCase() === 'a') {
        el.href = 'contacto.html';
      } else {
        el.onclick = () => { window.location.href = 'contacto.html'; };
      }
    }
  });
  document.querySelectorAll('.fs-ig').forEach(el => {
    el.href = settings.instagram || 'https://www.instagram.com/tecnoeduca.oficial';
  });
  document.querySelectorAll('.fs-ig-personal').forEach(el => {
    el.href = settings.instagramPersonal || DEFAULT_SETTINGS.instagramPersonal;
  });
  document.querySelectorAll('.fs-tt').forEach(el => {
    el.href = settings.tiktok || 'https://www.tiktok.com/@tecnoeduca81';
  });
  document.querySelectorAll('.fs-li').forEach(el => {
    el.href = settings.linkedin || 'https://www.linkedin.com/in/rosana-mar%C3%ADa-luj%C3%A1n-zunino-b21224a4';
  });
  document.querySelectorAll('.fs-gh').forEach(el => {
    el.href = settings.githubOrg || 'https://github.com/Rosana-TecnoEduca';
  });
  document.querySelectorAll('.fs-yt').forEach(el => {
    el.href = settings.youtube || 'https://www.youtube.com/@TecnoEduca.Oficial';
  });
  document.querySelectorAll('.fs-tg').forEach(el => {
    el.href = settings.telegram || 'https://t.me/tecnoeduca';
  });
  document.querySelectorAll('.fs-th').forEach(el => {
    el.href = settings.threads || 'https://www.threads.net/@tecnoeduca.oficial';
  });
  document.querySelectorAll('.fs-dc, .s-dc').forEach(el => {
    el.href = settings.discord || 'https://discord.gg/WBAU2sXrfE';
  });
  document.querySelectorAll('.fs-fb').forEach(el => {
    el.href = settings.facebook || 'https://web.facebook.com/tecnoeduca81/';
  });

  // Tira de redes en pie de página (footer-social-icons / footer-social-strip)
  // Personales (Columna 1)
  const linkRosanaIG = document.getElementById('linkRosanaIG');
  if (linkRosanaIG) linkRosanaIG.href = settings.instagramPersonal || 'https://www.instagram.com/rosana.zunino';
  const linkRosanaThreads = document.getElementById('linkRosanaThreads');
  if (linkRosanaThreads) linkRosanaThreads.href = settings.threadsPersonal || 'https://www.threads.net/@rosana.zunino';
  const linkRosanaFB = document.getElementById('linkRosanaFB');
  if (linkRosanaFB) linkRosanaFB.href = settings.facebookPersonal || 'https://web.facebook.com/rosanamlzunino/';
  const linkRosanaDC = document.getElementById('linkRosanaDC');
  if (linkRosanaDC) linkRosanaDC.href = settings.discordPersonal || 'https://discord.com';
  const linkRosanaSubstack = document.getElementById('linkRosanaSubstack');
  if (linkRosanaSubstack) linkRosanaSubstack.href = settings.substack || DEFAULT_SETTINGS.substack;

  document.querySelectorAll('.footer-s-icon.s-li').forEach(el => {
    el.href = settings.linkedin || 'https://www.linkedin.com/in/rosana-mar%C3%ADa-luj%C3%A1n-zunino-b21224a4';
  });
  // GitHub: Org en TecnoEduca, Personal en Rosana
  document.querySelectorAll('.footer-s-icon.s-gh-org').forEach(el => {
    el.href = settings.githubOrg || 'https://github.com/Rosana-TecnoEduca';
  });
  document.querySelectorAll('.footer-s-icon.s-gh:not(.s-gh-org)').forEach(el => {
    el.href = settings.github || 'https://github.com/marialujanzunino';
  });
  document.querySelectorAll('.footer-s-icon.s-ig:not(#linkRosanaIG)').forEach(el => {
    el.href = settings.instagram || 'https://www.instagram.com/tecnoeduca.oficial';
  });
  document.querySelectorAll('.footer-s-icon.s-tt').forEach(el => {
    el.href = settings.tiktok || 'https://www.tiktok.com/@tecnoeduca81';
  });
  document.querySelectorAll('.footer-s-icon.s-yt').forEach(el => {
    el.href = settings.youtube || 'https://www.youtube.com/@TecnoEduca.Oficial';
  });
  document.querySelectorAll('.footer-s-icon.s-tg').forEach(el => {
    el.href = settings.telegram || 'https://t.me/tecnoeduca';
  });
  document.querySelectorAll('.footer-s-icon.s-th:not(#linkRosanaThreads)').forEach(el => {
    el.href = settings.threads || 'https://www.threads.net/@tecnoeduca.oficial';
  });
  document.querySelectorAll('.footer-s-icon.s-dc').forEach(el => {
    el.href = settings.discord || 'https://discord.gg/WBAU2sXrfE';
  });
  document.querySelectorAll('.footer-s-icon.s-fb:not(#linkRosanaFB)').forEach(el => {
    el.href = settings.facebook || 'https://web.facebook.com/tecnoeduca81/';
  });
  document.querySelectorAll('.footer-s-icon.s-mail').forEach(el => {
    el.href = `mailto:${settings.email || 'tecnoeduca81@gmail.com'}`;
  });
  document.querySelectorAll('.footer-s-icon.s-sub').forEach(el => {
    el.href = settings.substack || DEFAULT_SETTINGS.substack;
  });

}

// ===================================================================
// CURRICULUM VITAE (MODAL)
// ===================================================================

function openCvModal() {
  const modal = document.getElementById('cvModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeCvModal() {
  const modal = document.getElementById('cvModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ===================================================================
// RENDERIZADO DEL BLOG DINÁMICO
// ===================================================================

function renderBlogPostCardMarkup(post) {
  const catClass = getCategoryClass(post.category);
  const catEmoji = getCategoryEmoji(post.category);
  const rx = getArticleReactions(post.id);

  return `
    <article class="post-card" onclick="openArticleReader('${post.id}')" title="Hacé clic para leer: ${escapeHTML(post.title)}">
      <div class="post-card-banner ${catClass}">
        <span class="post-cat-pill">${escapeHTML(post.category)}</span>
        <span class="post-thumb-icon">${catEmoji}</span>
        <span class="post-read-pill">⏱️ ${escapeHTML(post.readTime || '4 min')}</span>
      </div>
      <div class="post-card-body">
        <h3 class="post-card-title">${escapeHTML(post.title)}</h3>
        <p class="post-card-excerpt">${escapeHTML(post.excerpt)}</p>
        <div class="post-card-footer">
          <span class="post-footer-date">📅 ${post.date} &nbsp;•&nbsp; <span data-article-likes="${post.id}">👍 ${rx.likes}</span></span>
          <span class="btn-read-post">Leer artículo &rarr;</span>
        </div>
      </div>
    </article>
  `;
}

function renderBlogPosts(categoryFilter = 'all', targetContainerId = 'blogPostsContainer') {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  const allArticles = getStoredArticles();
  // Los visitantes públicos solo ven artículos ya publicados (los programados a futuro se gestionan en el panel y calendario)
  const articles = allArticles.filter(a => a.publishStatus === 'published');
  let filtered = categoryFilter === 'all' 
    ? articles 
    : articles.filter(a => a.category.toLowerCase() === categoryFilter.toLowerCase());

  // Limitar en página principal a 3 artículos si está configurado data-limit="3"
  const limitAttr = container.getAttribute('data-limit');
  const isLimited = limitAttr && parseInt(limitAttr, 10) > 0;
  if (isLimited) {
    filtered = filtered.slice(0, parseInt(limitAttr, 10));
  }

  if (filtered.length === 0) {
    const emptyMessage = allArticles.length === 0
      ? 'Todavía no hay artículos cargados.'
      : 'No encontramos publicaciones con ese filtro o búsqueda. Probá con otra categoría o restablecé los filtros.';
    container.innerHTML = `
      <div class="empty-resources-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--color-bg-soft); border-radius: 16px; border: 2px dashed var(--primary-purple-border);">
        <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🔍</span>
        <h3 style="font-size: 1.4rem; color: var(--primary-purple-dark); margin-bottom: 0.5rem;">${allArticles.length === 0 ? 'Próximamente' : 'No se encontraron artículos'}</h3>
        <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem;">${emptyMessage}</p>
        ${allArticles.length > 0 ? '<button class="btn btn-primary" onclick="renderBlogPosts(\'all\')">Mostrar todos los artículos</button>' : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(renderBlogPostCardMarkup).join('');
}

// ===================================================================
// RENDERIZADO DE LA BIBLIOTECA DIGITAL (LIBROS Y MATERIAL DRIVE)
// ===================================================================

function normalizeSubjectText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matchLibraryCategory(bookCat, filterCat) {
  if (!filterCat || filterCat === 'all') return true;
  const b = normalizeSubjectText(bookCat);
  const f = normalizeSubjectText(filterCat);
  if (b === f) return true;
  if (f === 'datos' && (b.includes('dato') || b.includes('data'))) return true;
  if (f === 'pedagogia' && (b.includes('metodolog') || b.includes('pedagog'))) return true;
  return b.includes(f) || f.includes(b);
}

function renderLibraryBooks(categoryFilter = 'all', accessFilter = 'all', targetContainerId = 'libraryHomeContainer') {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  const books = getStoredBooks();
  let filtered = books;

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(b => matchLibraryCategory(b.category, categoryFilter));
  }
  if (accessFilter !== 'all') {
    filtered = filtered.filter(b => b.accessType === accessFilter);
  }

  const limitAttr = container.getAttribute('data-limit');
  const isLimited = limitAttr && parseInt(limitAttr, 10) > 0;
  if (isLimited) {
    filtered = filtered.slice(0, parseInt(limitAttr, 10));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background:#FFFFFF; border-radius:18px; border:1px dashed #D8C4EE;">
        <p style="font-size:1.1rem; color:var(--text-muted); margin-bottom:1rem;">No hay libros o recursos en esta sección aún.</p>
        <button class="btn btn-primary btn-sm" onclick="renderLibraryBooks('all', 'all', '${targetContainerId}')">Restablecer filtros</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(renderBookCardMarkup).join('');
}

function renderBookCardMarkup(book) {
  const isFree = book.accessType === 'free';
  const catClass = getCategoryClass(book.category);
  const catEmoji = getCategoryEmoji(book.category);

  return `
    <div class="book-card" onclick="openBookReader('${book.id}')" title="Hacé clic para abrir: ${escapeHTML(book.title)}">
      <div class="book-cover-banner ${catClass}">
        <div class="book-spine-line"></div>
        <span class="book-subject-icon">${catEmoji}</span>
        <div class="book-cover-info">
          <span class="book-cover-title">${escapeHTML(book.title)}</span>
          <span class="book-cover-author">${escapeHTML(book.author)}</span>
        </div>
      </div>
      <div class="book-card-body">
        <div class="book-meta-top">
          <span class="post-cat-badge ${catClass}">${book.category}</span>
          <span class="book-access-pill ${isFree ? 'pill-free' : 'pill-readonly'}">
            ${isFree ? '🟢 Descargable' : '🔒 Solo lectura'}
          </span>
        </div>
        <p class="book-excerpt-text">${escapeHTML(book.excerpt)}</p>
        <div class="book-footer-actions">
          <span class="book-pages-label">📅 ${book.year || '2026'}</span>
          <span class="btn-read-book">${isFree ? '📥 Descargar gratis ↗' : '📖 Leer en pantalla &rarr;'}</span>
        </div>
      </div>
    </div>
  `;
}

function getCategoryEmoji(cat) {
  const norm = normalizeSubjectText(cat);
  if (norm.includes('matematica')) return '📐';
  if (norm.includes('fisica')) return '⚛️';
  if (norm.includes('quimica')) return '🧪';
  if (norm.includes('dato')) return '💻';
  if (norm.includes('metodolog') || norm.includes('pedagog')) return '💡';
  return '📖';
}

function initLibraryFilters() {
  const catButtons = document.querySelectorAll('.lib-filter-btn, .library-filters-group .filter-btn');
  const accessSelect = document.getElementById('libAccessFilter');
  const searchInput = document.getElementById('libSearchInput');

  let currentCat = 'all';
  let currentAccess = 'all';
  let searchQuery = '';

  function applyFilters() {
    const target = document.getElementById('libraryAllContainer') ? 'libraryAllContainer' : 'libraryHomeContainer';
    const container = document.getElementById(target);
    if (!container) return;

    let books = getStoredBooks();
    if (currentCat !== 'all') {
      books = books.filter(b => matchLibraryCategory(b.category, currentCat));
    }
    if (currentAccess !== 'all') {
      books = books.filter(b => b.accessType === currentAccess);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q));
    }

    if (books.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background:#FFFFFF; border-radius:18px; border:1px dashed #D8C4EE;">
          <p style="font-size:1.1rem; color:var(--text-muted); margin-bottom:1rem;">No se encontraron libros que coincidan con la búsqueda.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = books.map(renderBookCardMarkup).join('');
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.getAttribute('data-subject') || btn.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });

  if (accessSelect) {
    accessSelect.addEventListener('change', () => {
      currentAccess = accessSelect.value;
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      applyFilters();
    });
  }
}

function getCategoryClass(category) {
  const norm = normalizeSubjectText(category);
  if (norm.includes('matematica')) return 'cat-matematica cover-math';
  if (norm.includes('fisica')) return 'cat-fisica cover-physics';
  if (norm.includes('quimica')) return 'cat-quimica cover-chemistry';
  if (norm.includes('dato')) return 'cat-datos cover-datascience';
  if (norm.includes('metodolog') || norm.includes('pedagog')) return 'cat-metodologia cover-pedagogy';
  return 'cat-matematica cover-math';
}

function initBlogFilters() {
  const filterBtns = document.querySelectorAll('#blogFilters .filter-btn, .blog-section .blog-filters .filter-btn');
  const searchInput = document.getElementById('blogSearchInput');
  let currentCategory = 'all';

  function applyBlogFilters() {
    const articles = getStoredArticles();
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const containers = [
      document.getElementById('blogPostsContainer'),
      document.getElementById('blogArchiveContainer')
    ].filter(Boolean);

    containers.forEach(container => {
      const limitAttr = container.getAttribute('data-limit');
      const isLimited = limitAttr && parseInt(limitAttr, 10) > 0;

      let filtered = articles;
      if (currentCategory !== 'all') {
        filtered = filtered.filter(a => a.category.toLowerCase() === currentCategory.toLowerCase());
      }
      if (query) {
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(query) || 
          a.excerpt.toLowerCase().includes(query) || 
          (a.body && a.body.toLowerCase().includes(query))
        );
      }
      if (isLimited) {
        filtered = filtered.slice(0, parseInt(limitAttr, 10));
      }

      if (filtered.length === 0) {
        const emptyMessage = articles.length === 0
          ? 'Todavía no hay artículos cargados.'
          : 'No encontramos publicaciones con ese filtro o búsqueda. Probá con otra categoría o restablecé los filtros.';
        container.innerHTML = `
          <div class="empty-resources-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--color-bg-soft); border-radius: 16px; border: 2px dashed var(--primary-purple-border);">
            <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🔍</span>
            <h3 style="font-size: 1.4rem; color: var(--primary-purple-dark); margin-bottom: 0.5rem;">${articles.length === 0 ? 'Próximamente' : 'No se encontraron artículos'}</h3>
            <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem;">${emptyMessage}</p>
            ${articles.length > 0 ? '<button class="btn btn-primary" onclick="renderBlogPosts(\'all\')">Mostrar todos los artículos</button>' : ''}
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(renderBlogPostCardMarkup).join('');
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      applyBlogFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyBlogFilters);
  }
}

// ===================================================================
// SISTEMA DE VALORACIÓN SUTIL (ME GUSTA / NO ME GUSTA)
// ===================================================================

function getArticleReactions(articleId) {
  try {
    const raw = localStorage.getItem('tecnoeduca_article_reactions');
    const store = raw ? JSON.parse(raw) : {};
    if (store[articleId]) return store[articleId];
  } catch (e) {}

  const defaults = {
    'post-1': { likes: 34, dislikes: 1, userVote: null },
    'post-2': { likes: 48, dislikes: 0, userVote: null },
    'post-3': { likes: 27, dislikes: 1, userVote: null }
  };
  return defaults[articleId] || { likes: 16, dislikes: 0, userVote: null };
}

function saveArticleReactions(articleId, reactions) {
  try {
    const raw = localStorage.getItem('tecnoeduca_article_reactions');
    const store = raw ? JSON.parse(raw) : {};
    store[articleId] = reactions;
    localStorage.setItem('tecnoeduca_article_reactions', JSON.stringify(store));
  } catch (e) {}
}

function voteArticleReaction(articleId, type) {
  const rx = getArticleReactions(articleId);
  const msgEl = document.getElementById('feedbackMessage');

  if (rx.userVote === type) {
    if (type === 'like') rx.likes = Math.max(0, rx.likes - 1);
    else rx.dislikes = Math.max(0, rx.dislikes - 1);
    rx.userVote = null;
    if (msgEl) {
      msgEl.innerHTML = `<span class="rx-msg-info">Voto retirado.</span>`;
      msgEl.classList.add('visible');
    }
  } else {
    if (rx.userVote === 'like') rx.likes = Math.max(0, rx.likes - 1);
    else if (rx.userVote === 'dislike') rx.dislikes = Math.max(0, rx.dislikes - 1);

    if (type === 'like') {
      rx.likes += 1;
      rx.userVote = 'like';
      if (msgEl) {
        msgEl.innerHTML = `<span class="rx-msg-success">✨ ¡Gracias por tu valoración! Nos alegra mucho que te haya servido este contenido.</span>`;
        msgEl.classList.add('visible');
      }
    } else {
      rx.dislikes += 1;
      rx.userVote = 'dislike';
      if (msgEl) {
        msgEl.innerHTML = `<span class="rx-msg-notice">🌱 ¡Gracias por avisarnos! Tomamos nota para explicar este tema de forma más clara.</span>`;
        msgEl.classList.add('visible');
      }
    }
  }

  saveArticleReactions(articleId, rx);
  renderArticleFeedbackUI(articleId);
  updatePostCardFooterReaction(articleId, rx.likes);

  if (msgEl) {
    setTimeout(() => {
      msgEl.classList.remove('visible');
    }, 4500);
  }
}

function updatePostCardFooterReaction(articleId, likes) {
  const cardLikes = document.querySelectorAll(`[data-article-likes="${articleId}"]`);
  cardLikes.forEach(el => {
    el.textContent = `👍 ${likes}`;
  });
}

function renderArticleFeedbackUI(articleId) {
  const container = document.getElementById('articleFeedbackStrip');
  if (!container) return;

  const rx = getArticleReactions(articleId);

  container.innerHTML = `
    <div class="feedback-card">
      <div class="feedback-prompt">
        <span class="feedback-icon-bulb">💡</span>
        <span class="feedback-question">¿Te resultó útil o te gustó esta publicación?</span>
      </div>
      <div class="feedback-actions">
        <button type="button" class="btn-reaction btn-reaction-like ${rx.userVote === 'like' ? 'active' : ''}" 
          onclick="voteArticleReaction('${articleId}', 'like')" 
          title="Me sirvió / Me gustó" 
          aria-label="Me sirvió">
          <span class="reaction-emoji">👍</span>
          <span class="reaction-text">Me sirvió</span>
          <span class="reaction-count" id="rxLikeCount">${rx.likes}</span>
        </button>

        <button type="button" class="btn-reaction btn-reaction-dislike ${rx.userVote === 'dislike' ? 'active' : ''}" 
          onclick="voteArticleReaction('${articleId}', 'dislike')" 
          title="Podría mejorar" 
          aria-label="Podría mejorar">
          <span class="reaction-emoji">👎</span>
          <span class="reaction-text">Podría mejorar</span>
          <span class="reaction-count" id="rxDislikeCount">${rx.dislikes}</span>
        </button>
      </div>
    </div>
    <div class="feedback-message-box" id="feedbackMessage"></div>
  `;
}

// ===================================================================
// LECTOR DE ARTÍCULO (MODAL) Y COMPARTIR EN REDES SUTIL
// ===================================================================

let currentOpenArticleId = null;

function openArticleReader(articleId) {
  const articles = getStoredArticles();
  const post = articles.find(a => a.id === articleId);
  if (!post) return;

  currentOpenArticleId = articleId;
  const modal = document.getElementById('articleModal');
  const readerContent = document.getElementById('articleReaderContent');
  const shareContainer = document.getElementById('socialShareIcons');
  const parsedBody = formatArticleBody(post.body);

  // PREVISUALIZACIÓN DE VIDEO DE YOUTUBE (EVITA ERROR 153 MOSTRANDO MINIATURA Y OPCIÓN DIRECTA)
  let videoEmbedHtml = '';
  if (post.videoUrl) {
    videoEmbedHtml = createYouTubePreviewHtml(post.videoUrl, post.title);
  }

  let downloadHtml = '';
  if (post.downloadUrl) {
    downloadHtml = `
      <div class="article-download-card">
        <div class="download-info">
          <span class="download-icon">📥</span>
          <div>
            <strong>Material y Guía Descargable en PDF</strong>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Ejercicios resueltos y apuntes para profundizar este tema.</p>
          </div>
        </div>
        <a href="${post.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Descargar Guía</a>
      </div>
    `;
  }

  readerContent.innerHTML = `
    <div class="article-reader-header">
      <div class="article-meta-row">
        <span class="post-cat-badge ${getCategoryClass(post.category)}">${post.category}</span>
        <span class="post-read-time">⏱️ ${post.readTime || '5 min'}</span>
        <span class="post-read-time">&bull; 📅 ${post.date}</span>
      </div>
      <h2 class="article-full-title">${escapeHTML(post.title)}</h2>
      <div class="article-author-byline">
        <span>✍️ Escrito por <strong>Prof. Rosana</strong> (Profesora en Matemática, Física y Química &bull; Estudiante en Ciencias de Datos - UNLu)</span>
      </div>
    </div>

    <div class="article-full-body">
      ${parsedBody}
    </div>

    ${videoEmbedHtml}

    ${downloadHtml}
  `;

  // Barra de valoración sutil (Me gusta / No me gusta)
  renderArticleFeedbackUI(post.id);

  // Barra de compartir sutil ampliada (WhatsApp, Instagram, LinkedIn, Telegram, FB, X, Pinterest, Mail, Copiar)
  const rawShareUrl = window.location.href.split('#')[0] + '#' + post.id;
  if (shareContainer) {
    shareContainer.innerHTML = generateShareIconsMarkup(post.title, rawShareUrl, rawShareUrl);
  }

  renderArticleComments(post);

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  currentOpenArticleId = null;

  const dialog = document.getElementById('articleReaderDialog');
  if (dialog) dialog.classList.remove('fullscreen-mode');
}

function toggleArticleReaderFullscreen() {
  const dialog = document.getElementById('articleReaderDialog');
  const icon = document.getElementById('articleFullscreenIcon');
  const label = document.getElementById('articleFullscreenLabel');
  if (!dialog) return;

  dialog.classList.toggle('fullscreen-mode');
  const isFull = dialog.classList.contains('fullscreen-mode');

  if (isFull) {
    if (icon) icon.textContent = '🗗';
    if (label) label.textContent = 'Reducir Vista';
  } else {
    if (icon) icon.textContent = '⛶';
    if (label) label.textContent = 'Pantalla Completa';
  }
}

// ===================================================================
// FORMATEADOR DE ARTÍCULOS (MARKDOWN -> HTML SEGURO)
// ===================================================================

function formatArticleBody(text) {
  if (!text) return '';

  const blocks = text.split(/\n\s*\n/);
  return blocks.map(b => {
    let block = b.trim();
    if (!block) return '';

    // Cita / Blockquote
    if (block.startsWith('>')) {
      const quoteContent = block.replace(/^>\s*/gm, '').trim();
      return `<blockquote class="article-quote">${inlineMarkdown(quoteContent)}</blockquote>`;
    }

    // Encabezados
    if (block.startsWith('### ')) {
      return `<h3 class="article-h3">${inlineMarkdown(block.replace(/^###\s+/, ''))}</h3>`;
    }
    if (block.startsWith('## ')) {
      return `<h2 class="article-h2">${inlineMarkdown(block.replace(/^##\s+/, ''))}</h2>`;
    }
    if (block.startsWith('# ')) {
      return `<h2 class="article-h2">${inlineMarkdown(block.replace(/^#\s+/, ''))}</h2>`;
    }

    // Listas con viñetas
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const isList = lines.length > 0 && lines.every(l => l.startsWith('- ') || l.startsWith('* '));
    if (isList) {
      const items = lines.map(l => `<li>${inlineMarkdown(l.replace(/^[-*]\s+/, ''))}</li>`).join('');
      return `<ul class="article-list">${items}</ul>`;
    }

    // Párrafo normal
    const paragraphLines = lines.map(l => inlineMarkdown(l)).join('<br>');
    return `<p class="article-p">${paragraphLines}</p>`;
  }).join('');
}

function inlineMarkdown(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function showToastNotification(message, icon = '🔗') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="font-size:1.15rem; line-height:1;">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');

  if (toast.hideTimer) clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function copyArticleLink(url) {
  const targetUrl = url || window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(targetUrl).then(() => {
      showToastNotification('¡Enlace al artículo copiado al portapapeles!', '🔗');
    }).catch(() => {
      fallbackCopyText(targetUrl);
    });
  } else {
    fallbackCopyText(targetUrl);
  }
}

function fallbackCopyText(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToastNotification('¡Enlace al artículo copiado al portapapeles!', '🔗');
}

function shareOnInstagram(rawUrl) {
  const targetUrl = rawUrl || window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(targetUrl).then(() => {
      showToastNotification('¡Enlace copiado! Abrí Instagram para pegarlo en tu Historia o Mensaje.', '📸');
      setTimeout(() => {
        window.open('https://www.instagram.com', '_blank');
      }, 700);
    }).catch(() => {
      window.open('https://www.instagram.com', '_blank');
    });
  } else {
    window.open('https://www.instagram.com', '_blank');
  }
}

function generateShareIconsMarkup(title, url, rawUrl) {
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);

  return `
    <a href="https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}" target="_blank" rel="noopener noreferrer" class="share-btn-icon btn-share-wa" title="Compartir en WhatsApp" aria-label="Compartir en WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.769.816 2.791.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.769-5.767-5.769zm10.158 5.767c0 5.589-4.542 10.133-10.133 10.133-1.782 0-3.461-.464-4.931-1.282l-5.698 1.494 1.523-5.568c-.927-1.536-1.442-3.329-1.442-5.244 0-5.589 4.542-10.133 10.133-10.133 5.59 0 10.133 4.544 10.133 10.133z"/></svg>
    </a>
    <button type="button" class="share-btn-icon btn-share-ig" onclick="shareOnInstagram('${rawUrl}')" title="Compartir en Instagram (Copia enlace y abre Instagram)" aria-label="Compartir en Instagram">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </button>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}" target="_blank" rel="noopener noreferrer" class="share-btn-icon btn-share-in" title="Compartir en LinkedIn" aria-label="Compartir en LinkedIn">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
    </a>
    <a href="https://t.me/share/url?url=${encUrl}&text=${encTitle}" target="_blank" rel="noopener noreferrer" class="share-btn-icon btn-share-tg" title="Compartir en Telegram" aria-label="Compartir en Telegram">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.534-.197 1.002.128.828.942z"/></svg>
    </a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}" target="_blank" rel="noopener noreferrer" class="share-btn-icon btn-share-fb" title="Compartir en Facebook" aria-label="Compartir en Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>
    <a href="https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}" target="_blank" rel="noopener noreferrer" class="share-btn-icon btn-share-x" title="Compartir en X (Twitter)" aria-label="Compartir en X">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>
    <a href="https://pinterest.com/pin/create/button/?url=${encUrl}&description=${encTitle}" target="_blank" rel="noopener noreferrer" class="share-btn-icon btn-share-pin" title="Guardar en Pinterest" aria-label="Guardar en Pinterest">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.241-.188.289-.434.172-1.624-.757-2.639-3.13-2.639-5.037 0-4.101 2.979-7.869 8.594-7.869 4.512 0 8.019 3.216 8.019 7.514 0 4.482-2.825 8.089-6.746 8.089-1.317 0-2.556-.686-2.98-1.493l-.813 3.097c-.295 1.129-1.092 2.544-1.627 3.414 1.199.37 2.476.571 3.805.571 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
    </a>
    <a href="mailto:?subject=${encTitle}&body=${encTitle}%0A%0A${encUrl}" class="share-btn-icon btn-share-mail" title="Compartir por Correo Electrónico" aria-label="Compartir por Correo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l9.518 7.713 9.518-7.713v11.817h-19.036z"/></svg>
    </a>
    <button type="button" class="share-btn-icon btn-share-copy" onclick="copyArticleLink('${rawUrl}')" title="Copiar enlace al portapapeles" aria-label="Copiar enlace">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </button>
  `;
}

// Extractor de ID de YouTube
function getYouTubeVideoId(url) {
  if (!url) return '';
  let id = '';
  if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
  } else if (url.includes('watch?v=')) {
    id = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('/embed/')) {
    id = url.split('/embed/')[1].split('?')[0].split('&')[0];
  }
  return id ? id.trim() : '';
}

// Tarjeta con Miniatura y Enlace Directo al Streaming (Previene Error 153 de reproducción incrustada)
function createYouTubePreviewHtml(videoUrl, title = 'Video didáctico') {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return '';

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return `
    <div class="article-video-card" id="ytCard-${videoId}">
      <div class="yt-thumb-wrapper" onclick="window.open('${directWatchUrl}', '_blank', 'noopener,noreferrer')" title="Hacé clic para reproducir este video en YouTube">
        <img src="${thumbUrl}" alt="Miniatura de: ${escapeHTML(title)}" class="yt-thumb-img" onerror="this.src='https://img.youtube.com/vi/${videoId}/default.jpg'">
        <div class="yt-play-overlay">
          <div class="yt-play-btn" title="Ver video en YouTube">
            <svg viewBox="0 0 68 48" class="yt-svg-btn"><path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#ff0000"></path><path d="M 45,24 27,14 27,34" fill="#ffffff"></path></svg>
          </div>
          <span class="yt-click-hint">▶ Abrir y reproducir en YouTube</span>
        </div>
        <div class="yt-badge-topic">
          <span>📺 Video Explicativo &bull; TecnoEduca</span>
        </div>
      </div>
      <div class="yt-card-footer">
        <span>🎬 <strong>Clase audiovisual explicativa:</strong> Hacé clic en la imagen o en el botón para ver la clase completa en YouTube.</span>
        <a href="${directWatchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm yt-direct-link">
          Ver directamente en YouTube ↗
        </a>
      </div>
    </div>
  `;
}

// Convertidor de URL de Google Drive a formato incrustable (/preview)
function getGoogleDriveEmbedUrl(url) {
  if (!url) return '';
  let fileId = '';
  if (url.includes('/file/d/')) {
    fileId = url.split('/file/d/')[1].split('/')[0];
  } else if (url.includes('id=')) {
    fileId = url.split('id=')[1].split('&')[0];
  }
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

// ===================================================================
// LECTOR DE LIBRO / BIBLIOTECA DIGITAL (MODAL)
// ===================================================================

let currentOpenBookId = null;

function openBookReader(bookId) {
  const books = getStoredBooks();
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  currentOpenBookId = bookId;
  const modal = document.getElementById('bookReaderModal');
  const titleEl = document.getElementById('bookReaderTitle') || document.getElementById('modalBookTitle');
  const metaEl = document.getElementById('bookReaderMeta');
  const authorEl = document.getElementById('modalBookAuthor');
  const subjectBadge = document.getElementById('modalBookSubjectBadge');
  const badgeEl = document.getElementById('bookReaderAccessBadge') || document.getElementById('modalBookAccessBadge');
  const noticeEl = document.getElementById('bookReaderCopyrightNotice') || document.getElementById('bookCopyrightAlert');
  const downloadBtn = document.getElementById('bookReaderDownloadBtn') || document.getElementById('bookDownloadBtn');
  const downloadWrapper = document.getElementById('bookDirectDownloadWrapper');
  const driveDirectBtn = document.getElementById('bookReaderDriveDirectBtn') || document.getElementById('bookDriveExternalLink');
  const iframeContainer = document.getElementById('bookReaderIframeContainer') || document.getElementById('bookDriveWrapper');

  if (titleEl) titleEl.textContent = book.title;
  if (metaEl) metaEl.textContent = `${book.author} • ${book.category} • ${book.year || ''}`;
  if (authorEl) authorEl.textContent = book.author;
  if (subjectBadge) {
    subjectBadge.textContent = book.category;
    subjectBadge.className = `post-cat-badge ${getCategoryClass(book.category)}`;
  }

  const embedUrl = getGoogleDriveEmbedUrl(book.driveUrl);

  if (book.accessType === 'free') {
    if (badgeEl) {
      badgeEl.className = 'book-access-pill pill-free';
      badgeEl.innerHTML = '🟢 Descargar gratis • Libro descargable';
    }
    if (noticeEl) {
      noticeEl.className = 'book-copyright-alert alert-free';
      const heading = document.getElementById('bookAlertHeading');
      const desc = document.getElementById('bookAlertDesc');
      if (heading) heading.textContent = '🟢 Descargar gratis • Libro descargable';
      if (desc) desc.textContent = 'Este material es de libre acceso educativo. Podés leerlo directamente en pantalla o descargar gratis tu copia en PDF para estudiar.';
      noticeEl.style.display = 'flex';
    }
    if (downloadWrapper) downloadWrapper.style.display = 'block';
    if (downloadBtn) {
      downloadBtn.style.display = 'inline-flex';
      downloadBtn.href = book.driveUrl || embedUrl;
      downloadBtn.target = '_blank';
      downloadBtn.innerHTML = '<span>📥 Descargar gratis (Libro descargable)</span>';
    }
  } else {
    if (badgeEl) {
      badgeEl.className = 'book-access-pill pill-readonly';
      badgeEl.innerHTML = '🔒 Solo para leer, no se puede descargar';
    }
    if (noticeEl) {
      noticeEl.className = 'book-copyright-alert alert-readonly';
      const heading = document.getElementById('bookAlertHeading');
      const desc = document.getElementById('bookAlertDesc');
      if (heading) heading.textContent = '🔒 Solo para leer, no se puede descargar';
      if (desc) desc.textContent = 'Material de estudio protegido para consulta pedagógica en pantalla. Por respeto a los derechos de autor, no se permite su descarga ni reproducción.';
      noticeEl.style.display = 'flex';
    }
    if (downloadWrapper) downloadWrapper.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
  }

  if (driveDirectBtn) {
    driveDirectBtn.href = book.driveUrl;
  }

  if (iframeContainer) {
    if (embedUrl) {
      iframeContainer.innerHTML = `
        <iframe src="${embedUrl}" class="book-drive-iframe" id="bookDriveIframe" title="Lector de libro digital" allow="autoplay"></iframe>
      `;
    } else {
      iframeContainer.innerHTML = `
        <div style="padding:4rem 2rem; text-align:center; background:#FFF; border-radius:12px;">
          <span style="font-size:3rem; display:block; margin-bottom:1rem;">📖</span>
          <h4>Vista preliminar del material</h4>
          <p style="color:var(--text-muted); max-width:500px; margin:0 auto 1.5rem;">${escapeHTML(book.excerpt)}</p>
          <a href="${book.driveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Abrir en Google Drive ↗</a>
        </div>
      `;
    }
  }

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeBookReader() {
  const modal = document.getElementById('bookReaderModal');
  const iframeContainer = document.getElementById('bookReaderIframeContainer') || document.getElementById('bookDriveWrapper');
  if (iframeContainer) iframeContainer.innerHTML = '';
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  currentOpenBookId = null;

  const dialog = document.getElementById('bookReaderDialog');
  if (dialog) dialog.classList.remove('fullscreen-mode');
}

function toggleBookReaderFullscreen() {
  const dialog = document.getElementById('bookReaderDialog');
  const icon = document.getElementById('bookFullscreenIcon');
  const label = document.getElementById('bookFullscreenLabel');
  if (!dialog) return;

  dialog.classList.toggle('fullscreen-mode');
  const isFull = dialog.classList.contains('fullscreen-mode');

  if (isFull) {
    if (icon) icon.textContent = '🗗';
    if (label) label.textContent = 'Reducir Vista';
  } else {
    if (icon) icon.textContent = '⛶';
    if (label) label.textContent = 'Pantalla Completa';
  }
}

// ===================================================================
// SISTEMA DE COMENTARIOS
// ===================================================================

function renderArticleComments(post) {
  const list = document.getElementById('commentsList');
  const count = document.getElementById('commentsCount');
  if (!list || !count) return;

  const comments = post.comments || [];
  count.textContent = comments.length;

  if (comments.length === 0) {
    list.innerHTML = `<p style="font-size:0.9rem; color:var(--text-light); font-style:italic;">Aún no hay comentarios. ¡Sé el primero en consultar o dejar una duda!</p>`;
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-card">
      <div class="comment-header">
        <span class="comment-author-name">👤 ${escapeHTML(c.author)}</span>
        <span class="comment-date">${c.date}</span>
      </div>
      <p class="comment-body-text">${escapeHTML(c.text)}</p>
      ${c.reply ? `
        <div class="teacher-reply-card">
          <span class="reply-badge">👩‍🏫 Respuesta de Rosana:</span>
          <p style="margin:0; font-size:0.88rem; color:var(--text-main);">${escapeHTML(c.reply)}</p>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function submitArticleComment() {
  if (!currentOpenArticleId) return;

  const authorInput = document.getElementById('commentAuthor');
  const emailInput = document.getElementById('commentEmail');
  const textInput = document.getElementById('commentText');

  const author = authorInput.value.trim();
  const email = emailInput.value.trim();
  const text = textInput.value.trim();

  if (!author || !text) return;

  const articles = getStoredArticles();
  const post = articles.find(a => a.id === currentOpenArticleId);
  if (!post) return;

  if (!post.comments) post.comments = [];

  const newComment = {
    id: 'c-' + Date.now(),
    author,
    email,
    text,
    date: 'Hoy, ' + new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
    reply: ''
  };

  post.comments.push(newComment);
  saveArticles(articles);

  authorInput.value = '';
  emailInput.value = '';
  textInput.value = '';

  renderArticleComments(post);
  alert('✨ ¡Gracias por tu comentario! Ha sido publicado.');
}

// ===================================================================
// BANDEJA DE CONTACTO Y FORMULARIO POR CORREO / MODAL
// ===================================================================

function openContactModal(defaultSubject = '') {
  let modal = document.getElementById('contactModal');
  if (!modal) {
    createContactModalDOM();
    modal = document.getElementById('contactModal');
  }
  if (defaultSubject && typeof defaultSubject === 'string') {
    const sel = document.getElementById('modalContactSubject');
    if (sel) {
      const cleanSubject = defaultSubject.trim();
      let found = false;
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value.toLowerCase() === cleanSubject.toLowerCase() ||
            sel.options[i].text.toLowerCase().includes(cleanSubject.toLowerCase())) {
          sel.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        const opt = document.createElement('option');
        opt.value = cleanSubject;
        opt.textContent = '✨ ' + cleanSubject;
        sel.appendChild(opt);
        sel.value = cleanSubject;
      }
    }
  }
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('modalContactName');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function createContactModalDOM() {
  if (document.getElementById('contactModal')) return;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'contactModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-dialog contact-dialog" style="max-width: 620px; width: 100%; position: relative; padding: 2.2rem 2rem; border-radius: var(--radius-lg, 16px); background: #FFFFFF; box-shadow: 0 25px 60px rgba(0,0,0,0.3); border: 2px solid var(--primary-purple-border, #E2D9EC);">
      <button type="button" class="modal-close-btn" onclick="closeContactModal()" aria-label="Cerrar formulario" style="position: absolute; top: 1.2rem; right: 1.2rem; font-size: 1.8rem; line-height: 1; background: none; border: none; cursor: pointer; color: var(--text-muted, #7A7285); transition: color 0.2s;">&times;</button>
      
      <div style="text-align: center; margin-bottom: 1.6rem;">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 0.3rem;">✉️</span>
        <h3 style="font-family: var(--font-main, 'Nunito'); color: var(--primary-purple-dark, #3E2661); font-size: 1.6rem; font-weight: 800; margin-bottom: 0.4rem;">Enviar Consulta & Coordinar Clases</h3>
        <p style="color: var(--text-muted, #666); font-size: 0.95rem; margin: 0; line-height: 1.5;">Ingresá tus datos personales y tu consulta. Rosana recibirá tu mensaje directamente en el panel docente y te responderá a la brevedad.</p>
      </div>

      <form id="contactModalForm" onsubmit="event.preventDefault(); submitModalContactInquiry();" style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem;">
          <div class="form-group" style="display: flex; flex-direction: column; gap: 0.3rem; text-align: left;">
            <label for="modalContactName" style="font-weight: 700; font-size: 0.88rem; color: var(--text-main, #2D253A);">Nombre *</label>
            <input type="text" id="modalContactName" class="form-control" placeholder="Ej: Valentina" required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid var(--primary-purple-border, #D8CEE2); border-radius: 8px; font-size: 0.95rem; font-family: inherit;">
          </div>
          <div class="form-group" style="display: flex; flex-direction: column; gap: 0.3rem; text-align: left;">
            <label for="modalContactSurname" style="font-weight: 700; font-size: 0.88rem; color: var(--text-main, #2D253A);">Apellido *</label>
            <input type="text" id="modalContactSurname" class="form-control" placeholder="Ej: López" required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid var(--primary-purple-border, #D8CEE2); border-radius: 8px; font-size: 0.95rem; font-family: inherit;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem;">
          <div class="form-group" style="display: flex; flex-direction: column; gap: 0.3rem; text-align: left;">
            <label for="modalContactReach" style="font-weight: 700; font-size: 0.88rem; color: var(--text-main, #2D253A);">Contacto (Email o Teléfono) *</label>
            <input type="text" id="modalContactReach" class="form-control" placeholder="ej: tu@email.com o WhatsApp" required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid var(--primary-purple-border, #D8CEE2); border-radius: 8px; font-size: 0.95rem; font-family: inherit;">
          </div>
          <div class="form-group" style="display: flex; flex-direction: column; gap: 0.3rem; text-align: left;">
            <label for="modalContactSubject" style="font-weight: 700; font-size: 0.88rem; color: var(--text-main, #2D253A);">Materia / Motivo *</label>
            <select id="modalContactSubject" class="form-control" required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid var(--primary-purple-border, #D8CEE2); border-radius: 8px; font-size: 0.95rem; font-family: inherit; background: #FFF;">
              <option value="Matemática">📐 Matemática (Secundario / Terciario / Univ.)</option>
              <option value="Física">⚛️ Física (Secundario / Terciario / Univ.)</option>
              <option value="Química">🧪 Química (Secundario / Terciario / Univ.)</option>
              <option value="Ingreso Universitario">🎓 Ingreso Universitario / CBC / UTN</option>
              <option value="Curso de Canva para Docentes y Empresas">🎨 Curso de Canva para Docentes & Empresas</option>
              <option value="Curso de IA para Educación">🤖 Curso de Inteligencia Artificial (IA) en Educación</option>
              <option value="Diseño Web Profesional">💻 Consulta por Diseño y Desarrollo Web</option>
              <option value="Web Solidaria para ONGs">🤝 Web Solidaria para Organizaciones Sin Fines de Lucro / ONG</option>
              <option value="Consulta General">💡 Otra consulta o propuesta pedagógica</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="display: flex; flex-direction: column; gap: 0.3rem; text-align: left;">
          <label for="modalContactMessage" style="font-weight: 700; font-size: 0.88rem; color: var(--text-main, #2D253A);">Tu Consulta o Mensaje *</label>
          <textarea id="modalContactMessage" class="form-control" rows="4" placeholder="Contanos qué temas necesitás preparar, fecha aproximada de examen o cualquier duda..." required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid var(--primary-purple-border, #D8CEE2); border-radius: 8px; font-size: 0.95rem; font-family: inherit; resize: vertical;"></textarea>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-muted, #7A7285); display: flex; align-items: center; gap: 0.4rem;">
          <span>🔒 Tus datos son confidenciales y se reciben de inmediato en el panel administrativo docente.</span>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.9rem; font-weight: 700; font-size: 1.05rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; background: var(--primary-purple, #7E569B); color: #FFF; transition: background 0.2s;">
          <span>✉️ Enviar Consulta al Panel Docente</span>
        </button>

        <div id="modalFormSuccessAlert" style="display:none; background: #E6F4EA; border: 1.5px solid #34A853; color: #137333; padding: 0.9rem 1rem; border-radius: 8px; font-size: 0.95rem; text-align: center;">
          ✨ <strong>¡Mensaje recibido con éxito!</strong> Tu consulta fue registrada en el panel docente de Rosana. Te responderá a la brevedad.
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

async function submitModalContactInquiry() {
  const name = document.getElementById('modalContactName').value.trim();
  const surname = document.getElementById('modalContactSurname').value.trim();
  const contactReach = document.getElementById('modalContactReach').value.trim();
  const subject = document.getElementById('modalContactSubject').value.trim();
  const message = document.getElementById('modalContactMessage').value.trim();

  if (!name || !surname || !contactReach || !message) return;

  const fullName = `${name} ${surname}`.trim();
  const isEmail = contactReach.includes('@');

  const newInquiry = {
    id: 'msg-' + Date.now(),
    name: fullName,
    email: isEmail ? contactReach : 'Contacto: ' + contactReach,
    phone: isEmail ? '' : contactReach,
    subject: subject,
    message: message,
    date: new Date().toLocaleString('es-AR'),
    read: false
  };

  const submitButton = document.querySelector('#contactModalForm button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  try {
    if (!window.supabaseDB || typeof window.supabaseDB.insertMessage !== 'function') {
      throw new Error('El servicio de mensajes no está disponible.');
    }
    await window.supabaseDB.insertMessage(newInquiry);
  } catch (err) {
    console.error('No se pudo enviar la consulta del formulario modal:', err);
    alert('No se pudo enviar tu consulta. Tus datos no se guardaron; intentá nuevamente más tarde.');
    return;
  } finally {
    if (submitButton) submitButton.disabled = false;
  }

  const alertEl = document.getElementById('modalFormSuccessAlert');
  if (alertEl) {
    alertEl.style.display = 'block';
    setTimeout(() => {
      alertEl.style.display = 'none';
      closeContactModal();
      const form = document.getElementById('contactModalForm');
      if (form) form.reset();
    }, 2800);
  }
}

async function submitContactInquiry() {
  const nameEl = document.getElementById('contactName');
  const surnameEl = document.getElementById('contactSurname');
  const emailEl = document.getElementById('contactEmail');
  const phoneEl = document.getElementById('contactPhone');
  const subjectEl = document.getElementById('contactSubject');
  const messageEl = document.getElementById('contactMessage');
  const levelSelect = document.getElementById('contactLevel');
  const gradeSelect = document.getElementById('contactGrade');
  const modalitySelect = document.getElementById('contactModality');
  const webTypeSelect = document.getElementById('contactWebType');

  const name = nameEl ? nameEl.value.trim() : '';
  const surname = surnameEl ? surnameEl.value.trim() : '';
  const fullName = surname ? `${name} ${surname}`.trim() : name;
  const email = emailEl ? emailEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const message = messageEl ? messageEl.value.trim() : '';

  // Si falta el nombre o medio de contacto, volver al Paso 1 con aviso destacado
  if (!name || (!email && !phone)) {
    goToContactStep(1);
    const notice = document.getElementById('step1Notice');
    if (notice) {
      notice.innerHTML = '<span>⚠️ Por favor completá tu <strong>Nombre</strong> y un <strong>Correo o Teléfono</strong> antes de enviar.</span>';
      notice.style.display = 'flex';
    }
    return;
  }

  // Validar motivo seleccionado en Paso 2
  let baseSubject = subjectEl && subjectEl.value ? subjectEl.value.trim() : '';
  if (!baseSubject || baseSubject === '') {
    if (subjectEl) {
      subjectEl.classList.add('input-error');
      isProgrammaticFocus = true;
      subjectEl.focus({ preventScroll: true });
      setTimeout(() => { isProgrammaticFocus = false; }, 200);
    }
    const notice2 = document.getElementById('step2Notice');
    if (notice2) {
      notice2.innerHTML = '<span>⚠️ Por favor elegí qué te gustaría consultar arriba para poder enviar tu mensaje.</span>';
      notice2.style.display = 'block';
    }
    return;
  }

  if (!message) {
    if (messageEl) {
      messageEl.focus({ preventScroll: true });
    }
    const notice2 = document.getElementById('step2Notice');
    if (notice2) {
      notice2.innerHTML = '<span>⚠️ Por favor redactá o completá tu mensaje antes de enviar.</span>';
      notice2.style.display = 'block';
    }
    return;
  }

  // Correo de respaldo si solo dejó WhatsApp
  const contactEmail = email || (phone ? `${phone.replace(/\D/g, '')}@whatsapp.contacto` : 'contacto@tecnoeduca.com');

  // Asunto estructurado con nivel, año y modalidad
  let fullSubject = baseSubject;

  const entranceSelect = document.getElementById('contactEntranceSubject');
  const isEntrance = baseSubject === 'Ingreso Universitario';
  const isClass = ['Matemática', 'Física', 'Química', 'Informática'].includes(baseSubject);
  const isNgoWeb = baseSubject.includes('Web Solidaria') || (baseSubject.includes('Diseño Web') && document.getElementById('contactIsNgo')?.checked);
  const isWeb = baseSubject.includes('Diseño Web');

  if (isEntrance) {
    const entranceMateria = entranceSelect && entranceSelect.value ? entranceSelect.value : 'Matemática';
    fullSubject = `Ingreso Universitario — ${entranceMateria}`;
    if (modalitySelect && modalitySelect.value) {
      fullSubject += ` [${modalitySelect.value}]`;
    }
  } else if (isClass && levelSelect) {
    const levelVal = levelSelect.value;
    if (levelVal === 'Secundario' && gradeSelect && gradeSelect.value) {
      fullSubject += ` — Secundario (${gradeSelect.value})`;
    } else if (levelVal) {
      fullSubject += ` — ${levelVal}`;
    }
    if (modalitySelect && modalitySelect.value) {
      fullSubject += ` [${modalitySelect.value}]`;
    }
  } else if (isNgoWeb) {
    fullSubject = `Diseño Web Solidario (ONG) — Landing Page [A coordinar]`;
  } else if (isWeb && webTypeSelect) {
    fullSubject = `Diseño Web — ${webTypeSelect.value} [A coordinar]`;
  }

  const newInquiry = {
    id: 'msg-' + Date.now(),
    name: fullName,
    email: contactEmail,
    phone: phone || 'No informado',
    subject: fullSubject,
    message: message,
    date: new Date().toLocaleString('es-AR'),
    read: false
  };

  const submitButton = document.querySelector('.btn-submit-form');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>⏳ Enviando mensaje...</span>';
  }

  try {
    if (!window.supabaseDB || typeof window.supabaseDB.insertMessage !== 'function') {
      throw new Error('El servicio de mensajes no está disponible.');
    }
    await window.supabaseDB.insertMessage(newInquiry);
  } catch (err) {
    console.error('No se pudo enviar la consulta de contacto:', err);
    alert('No se pudo enviar tu consulta. Por favor verificá tu conexión o intentá nuevamente.');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span>✉️ Enviar Mensaje a Rosana</span>';
    }
    return;
  }

  // 1. Mostrar pantalla de éxito y activar Paso 3 en el seguimiento superior
  const successState = document.getElementById('contactSuccessState');
  const stepIndicators = document.getElementById('stepIndicatorsWrapper');
  const step1 = document.getElementById('contactStep1');
  const step2 = document.getElementById('contactStep2');
  const senderNameEl = document.getElementById('successSenderName');

  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');
  const ind3 = document.getElementById('stepIndicator3');
  const num1 = document.getElementById('stepNum1');
  const num2 = document.getElementById('stepNum2');
  const num3 = document.getElementById('stepNum3');
  const line1 = document.getElementById('stepIndicatorLine1');
  const line2 = document.getElementById('stepIndicatorLine2');

  if (senderNameEl) {
    senderNameEl.textContent = fullName || 'estimado/a';
  }

  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'none';
  if (successState) {
    successState.style.display = 'block';
  }

  // Mantener visible el seguimiento y marcar Paso 3: Confirmación activo
  if (stepIndicators) stepIndicators.style.display = 'flex';

  if (ind1) {
    ind1.className = 'step-indicator-item active completed';
    if (num1) num1.textContent = '✓';
  }
  if (line1) line1.classList.add('active');

  if (ind2) {
    ind2.className = 'step-indicator-item active completed';
    if (num2) num2.textContent = '✓';
  }
  if (line2) line2.classList.add('active');

  if (ind3) {
    ind3.className = 'step-indicator-item active completed';
    if (num3) num3.textContent = '✓';
  }

  // 2. Vaciar completamente los campos de ambos pasos
  const mainForm = document.getElementById('mainContactForm');
  if (mainForm) mainForm.reset();
  if (nameEl) nameEl.value = '';
  if (surnameEl) surnameEl.value = '';
  if (emailEl) emailEl.value = '';
  if (phoneEl) phoneEl.value = '';
  if (messageEl) messageEl.value = '';

  // Resetear estados condicionales y checkbox ONG
  const ngoCheckbox = document.getElementById('contactIsNgo');
  if (ngoCheckbox) ngoCheckbox.checked = false;
  const ngoAlert = document.getElementById('ngoBenefitAlert');
  if (ngoAlert) ngoAlert.style.display = 'none';
  const entranceGroup = document.getElementById('universityEntranceGroup');
  if (entranceGroup) entranceGroup.style.display = 'none';

  // Limpiar posibles alertas y estilos de error
  [nameEl, surnameEl, emailEl, phoneEl].forEach(el => {
    if (el) el.classList.remove('input-error');
  });

  // 3. Guardar perfil permanente para autocompletado futuro, pero limpiar la sesión actual del formulario
  try {
    localStorage.setItem('tecnoeduca_contact_profile', JSON.stringify({ name, surname, email, phone }));
    localStorage.removeItem('tecnoeduca_user_contact');
  } catch (e) {}

  // 4. Dejar el botón de envío reestablecido y listo
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.innerHTML = '<span>✉️ Enviar Mensaje a Rosana</span>';
    submitButton.style.opacity = '1';
  }
}

function resetContactFormToStep1() {
  const mainForm = document.getElementById('mainContactForm');
  if (mainForm) mainForm.reset();

  // Dejar campos vacíos listos para una nueva consulta
  ['contactName', 'contactSurname', 'contactEmail', 'contactPhone', 'contactMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      el.classList.remove('input-error');
    }
  });

  const notice = document.getElementById('step1Notice');
  if (notice) notice.style.display = 'none';

  const notice2 = document.getElementById('step2Notice');
  if (notice2) notice2.style.display = 'none';

  const subjectEl = document.getElementById('contactSubject');
  if (subjectEl) {
    subjectEl.value = '';
    subjectEl.classList.remove('input-error');
  }
  handleContactSubjectChange();

  goToContactStep(1);
}

// ===================================================================
// COPIA DE RESPALDO Y RESTAURACIÓN (BACKUP COMPLETO)
// ===================================================================

function downloadSystemBackup() {
  const backupData = {
    backupVersion: '2.0',
    exportDate: new Date().toISOString(),
    system: 'Rosana - Clases Particulares / TecnoEduca',
    articles: getStoredArticles(),
    scheduledArticles: getStoredScheduledArticles ? getStoredScheduledArticles() : [],
    comments: getStoredComments(),
    books: getStoredBooks(),
    resources: getStoredResources(),
    messages: getStoredMessages(),
    analytics: getStoredAnalytics(),
    settings: getStoredSettings()
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Respaldo_TecnoEduca_${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('💾 ¡Copia de seguridad descargada exitosamente!\n\nSe guardó el archivo .JSON en tu carpeta de Descargas con tus contenidos y configuraciones.');
}

function handleRestoreBackupFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || !data.system) {
        alert('❌ El archivo seleccionado no es un respaldo válido de TecnoEduca.');
        return;
      }

      const formattedDate = data.exportDate ? new Date(data.exportDate).toLocaleString('es-AR') : 'reciente';
      const confirmRestore = confirm(
        `⚠️ ¿Confirmás restaurar la copia de seguridad emitida el ${formattedDate}?\n\n` +
        `Esta acción restablecerá todo el contenido:\n` +
        `• Artículos de Blog (${(data.articles || []).length})\n` +
        `• Libros de Biblioteca (${(data.books || []).length})\n` +
        `• Banco de Recursos (${(data.resources || []).length})\n` +
        `• Mensajes recibidos (${(data.messages || []).length})\n` +
        `• Estadísticas y configuración\n\n` +
        `¿Deseás continuar?`
      );

      if (!confirmRestore) return;

      if (data.articles) localStorage.setItem('tecnoeduca_articles_v1', JSON.stringify(data.articles));
      if (data.scheduledArticles) localStorage.setItem('tecnoeduca_scheduled_articles_v1', JSON.stringify(data.scheduledArticles));
      if (data.comments) localStorage.setItem('tecnoeduca_comments_v1', JSON.stringify(data.comments));
      if (data.books) localStorage.setItem('tecnoeduca_books_v1', JSON.stringify(data.books));
      if (data.resources) localStorage.setItem('tecnoeduca_resources_v1', JSON.stringify(data.resources));
      if (data.messages) localStorage.setItem('tecnoeduca_messages_v1', JSON.stringify(data.messages));
      if (data.analytics) localStorage.setItem('tecnoeduca_analytics_v1', JSON.stringify(data.analytics));
      if (data.settings) localStorage.setItem('tecnoeduca_settings_v1', JSON.stringify(data.settings));
      applySettingsToUI();

      alert('✨ ¡Copia de seguridad restaurada exitosamente!\n\nTodos los datos y configuraciones fueron actualizados.');
      location.reload();
    } catch (err) {
      alert('❌ Error al procesar el archivo de respaldo: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ===================================================================
// EXPORTAR REPORTE OFICIAL EN PDF
// ===================================================================

function exportAnalyticsReportToPDF() {
  const analytics = getStoredAnalytics();
  const articles = getStoredArticles();
  const currentAdmin = { name: 'Prof. Rosana' };
  const dateStr = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  const totalVisits = Number(analytics.totalVisits || 0);
  const uniqueVisitors = Number(analytics.uniqueVisitors || 0);
  const totalReads = Number(analytics.totalReads || 0);
  const whatsappClicks = Number(analytics.whatsappClicks || 0);

  const mob = Number(analytics.mobileVisits || 0);
  const desk = Number(analytics.desktopVisits || 0);
  const tab = Number(analytics.tabletVisits || 0);
  const totDev = mob + desk + tab;
  const mobPct = totDev > 0 ? Math.round((mob / totDev) * 100) : 0;
  const deskPct = totDev > 0 ? Math.round((desk / totDev) * 100) : 0;
  const tabPct = totDev > 0 ? Math.max(0, 100 - mobPct - deskPct) : 0;

  const seed = generateSeedAnalytics();
  const demoData = analytics.demographics || seed.demographics;
  const geoData = analytics.geography || seed.geography;

  let printBox = document.getElementById('printReportContainer');
  if (!printBox) {
    printBox = document.createElement('div');
    printBox.id = 'printReportContainer';
    document.body.appendChild(printBox);
  }

  printBox.innerHTML = `
    <div class="print-header">
      <div>
        <h1 class="print-title">Rosana • Clases Particulares</h1>
        <div class="print-subtitle">TecnoEduca • Reporte Ejecutivo de Métricas, Audiencia y Rendimiento Web</div>
      </div>
      <div class="print-meta-badge">
        <strong>Fecha:</strong> ${dateStr} a las ${timeStr} hs<br>
        <strong>Emitido por:</strong> ${escapeHTML(currentAdmin.name)}
      </div>
    </div>

    <div class="print-kpis-grid">
      <div class="print-kpi-card">
        <span class="kpi-lbl">Visitas Totales</span>
        <h4>${totalVisits.toLocaleString('es-AR')}</h4>
        <small>Impacto global</small>
      </div>
      <div class="print-kpi-card">
        <span class="kpi-lbl">Alumnos Únicos</span>
        <h4>${uniqueVisitors.toLocaleString('es-AR')}</h4>
        <small>Visitantes individuales</small>
      </div>
      <div class="print-kpi-card">
        <span class="kpi-lbl">Lecturas de Contenido</span>
        <h4>${totalReads.toLocaleString('es-AR')}</h4>
        <small>Guías y artículos</small>
      </div>
      <div class="print-kpi-card">
        <span class="kpi-lbl">Consultas WhatsApp</span>
        <h4>${whatsappClicks.toLocaleString('es-AR')}</h4>
        <small>Contactos directos</small>
      </div>
    </div>

    <h3 class="print-section-title">📱 Dispositivos de Acceso</h3>
    <table class="print-table">
      <thead>
        <tr>
          <th>Tipo de Dispositivo</th>
          <th>Visitas Registradas</th>
          <th>Participación</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>📱 Teléfonos Celulares (WhatsApp / Móvil)</td>
          <td>${mob.toLocaleString('es-AR')}</td>
          <td><strong>${mobPct}%</strong></td>
        </tr>
        <tr>
          <td>💻 Computadoras de Escritorio / Laptops</td>
          <td>${desk.toLocaleString('es-AR')}</td>
          <td><strong>${deskPct}%</strong></td>
        </tr>
        <tr>
          <td>📟 Tablets e iPads (Navegación Táctil)</td>
          <td>${tab.toLocaleString('es-AR')}</td>
          <td><strong>${tabPct}%</strong></td>
        </tr>
      </tbody>
    </table>

    <h3 class="print-section-title">👥 Demografía: Perfil de Alumnos y Familias</h3>
    <table class="print-table">
      <thead>
        <tr>
          <th>Perfil / Rol Familiar</th>
          <th>Porcentaje</th>
          <th>Rango de Edad</th>
          <th>Participación</th>
        </tr>
      </thead>
      <tbody>
        ${demoData.genderRoles.map((g, idx) => {
          const age = demoData.ageRanges[idx] || { label: 'General', pct: 0 };
          return `
            <tr>
              <td>${g.label}</td>
              <td><strong>${g.pct}%</strong></td>
              <td>${age.label}</td>
              <td><strong>${age.pct}%</strong></td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <h3 class="print-section-title">🗺️ Origen Geográfico y Localidades (Sede Luján)</h3>
    <table class="print-table">
      <thead>
        <tr>
          <th>País</th>
          <th>Provincias Principales</th>
          <th>Localidades de Buenos Aires</th>
          <th>Zona</th>
        </tr>
      </thead>
      <tbody>
        ${(geoData.localidadesBA || []).map((loc, idx) => {
          const c = geoData.countries[idx] || { name: '-', pct: '' };
          const p = geoData.provinces[idx] || { name: '-', pct: '' };
          return `
            <tr>
              <td>${c.name} (${c.pct}%)</td>
              <td>${p.name} (${p.pct}%)</td>
              <td><strong>${loc.name}</strong></td>
              <td>${loc.badge || 'Virtual'} (${loc.pct}%)</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <h3 class="print-section-title">🏆 Publicaciones Más Consultadas</h3>
    <table class="print-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Título del Artículo</th>
          <th>Categoría</th>
          <th>Interés Educativo</th>
        </tr>
      </thead>
      <tbody>
        ${articles.slice(0, 5).map((a, idx) => `
          <tr>
            <td><strong>#${idx + 1}</strong></td>
            <td>${escapeHTML(a.title)}</td>
            <td>${a.category}</td>
            <td>⭐ Alta interacción docente</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="print-footer">
      Documento generado automáticamente desde el Panel Docente de <strong>Rosana • Clases Particulares</strong>. Válido como informe de métricas y evaluación institucional.
    </div>
  `;

  setTimeout(() => {
    window.print();
  }, 250);
}

function switchAdminTab(tabName, clickedBtn) {
  const tabs = ['articles', 'editor', 'calendar', 'analytics', 'library', 'book-editor', 'resources', 'resource-editor', 'messages', 'comments', 'security'];
  tabs.forEach(t => {
    const pane = document.getElementById(`pane-${t}`);
    if (pane) pane.style.display = (t === tabName) ? 'block' : 'none';
  });

  const buttons = document.querySelectorAll('.admin-tab-btn, .tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.classList.remove('activo');
  });

  if (clickedBtn) {
    clickedBtn.classList.add('active');
    clickedBtn.classList.add('activo');
  } else {
    buttons.forEach(b => {
      const onclickAttr = b.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'${tabName}'`)) {
        b.classList.add('active');
        b.classList.add('activo');
      }
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabName === 'articles') renderAdminArticlesTable();
  if (tabName === 'calendar') renderEditorialCalendar();
  if (tabName === 'analytics') renderAnalyticsDashboard();
  if (tabName === 'library') renderAdminBooksTable();
  if (tabName === 'resources') renderAdminResourcesTable();
  if (tabName === 'messages') renderAdminMessages();
  if (tabName === 'comments') renderAdminComments();
}

function loadAdminDashboard() {
  renderAdminArticlesTable();
  renderEditorialCalendar();
  renderAnalyticsDashboard();
  renderAdminBooksTable();
  renderAdminResourcesTable();
  updateInboxBadge();
  
  // Cargar enlaces actuales en pestaña de configuración
  const settings = getStoredSettings();
  const cvUrlInput = document.getElementById('settingCvUrl');
  const canvaUrlInput = document.getElementById('settingCanvaUrl');
  const liInput = document.getElementById('settingLI');
  const ghInput = document.getElementById('settingGH');
  const waInput = document.getElementById('settingWhatsApp');
  const emailInput = document.getElementById('settingEmail');
  const ytInput = document.getElementById('settingYT');
  const fbInput = document.getElementById('settingFB');
  const igInput = document.getElementById('settingIG');
  const tgInput = document.getElementById('settingTG');
  const dcInput = document.getElementById('settingDC');
  const ttInput = document.getElementById('settingTT');
  const igPersonalInput = document.getElementById('settingIGPersonal');
  const threadsInput = document.getElementById('settingThreads');
  const substackInput = document.getElementById('settingSubstack');
  const fbPersonalInput = document.getElementById('settingFBPersonal');
  const dcPersonalInput = document.getElementById('settingDCPersonal');

  if (cvUrlInput) cvUrlInput.value = settings.cvUrl || '';
  if (canvaUrlInput) canvaUrlInput.value = settings.canvaUrl || '';
  if (liInput) liInput.value = settings.linkedin || '';
  if (ghInput) ghInput.value = settings.github || '';
  if (waInput) waInput.value = settings.whatsapp || '';
  if (emailInput) emailInput.value = settings.email || 'tecnoeduca81@gmail.com';
  if (ytInput) ytInput.value = settings.youtube || '';
  if (fbInput) fbInput.value = settings.facebook || '';
  if (igInput) igInput.value = settings.instagram || '';
  if (igPersonalInput) igPersonalInput.value = settings.instagramPersonal || '';
  if (threadsInput) threadsInput.value = settings.threads || '';
  if (substackInput) substackInput.value = settings.substack || '';
  if (fbPersonalInput) fbPersonalInput.value = settings.facebookPersonal || '';
  if (dcPersonalInput) dcPersonalInput.value = settings.discordPersonal || '';
  if (tgInput) tgInput.value = settings.telegram || '';
  if (dcInput) dcInput.value = settings.discord || '';
  if (ttInput) ttInput.value = settings.tiktok || '';

  updateCvAdminUploadStatus();
}

function updateInboxBadge() {
  const messages = getStoredMessages();
  const unreadCount = messages.filter(m => !m.read).length;
  const badge = document.getElementById('inboxBadge');
  if (badge) badge.textContent = unreadCount;
}

function renderAdminArticlesTable() {
  const tbody = document.getElementById('adminArticlesTbody');
  if (!tbody) return;

  const articles = getStoredArticles();
  if (articles.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2.5rem; color:var(--text-muted); font-size:0.95rem;">No hay artículos cargados todavía. Podés redactar uno nuevo con el botón superior.</td></tr>`;
    return;
  }

  tbody.innerHTML = articles.map(a => {
    let statusMarkup = '';
    let toggleBtn = '';
    if (a.publishStatus === 'draft') {
      statusMarkup = `<span class="badge" style="background:#F3F4F6; color:#4B5563; font-weight:800; padding:0.35rem 0.65rem; border-radius:6px; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.35rem; border:1px solid #D1D5DB;">⚪ Borrador / Despublicado</span>`;
      toggleBtn = `<button class="btn-action-sm" style="background:#205A65; color:#FFFFFF; border-color:#205A65;" onclick="toggleArticlePublishStatus('${a.id}')" title="Publicar este artículo en la web pública">🚀 Publicar</button>`;
    } else if (a.publishStatus === 'scheduled') {
      statusMarkup = `<span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:800; padding:0.35rem 0.65rem; border-radius:6px; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.35rem; border:1px solid #FCD34D;">⏰ Programado: ${escapeHTML(a.scheduledDate || a.date)} ${a.scheduledTime ? `(${a.scheduledTime} hs)` : ''}</span>`;
      toggleBtn = `<button class="btn-action-sm" style="background:#205A65; color:#FFFFFF; border-color:#205A65;" onclick="publishScheduledArticleNow('${a.id}')" title="Publicar de inmediato en el blog">🚀 Publicar ya</button>`;
    } else {
      statusMarkup = `<span class="badge" style="background:#ECFDF5; color:#065F46; font-weight:800; padding:0.35rem 0.65rem; border-radius:6px; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.35rem; border:1px solid #A7F3D0;">🟢 Publicado: ${escapeHTML(a.date)}</span>`;
      toggleBtn = `<button class="btn-action-sm" onclick="toggleArticlePublishStatus('${a.id}')" title="Ocultar de la web sin borrar (pasar a borrador)">👁️‍🗨️ Despublicar</button>`;
    }

    return `
      <tr>
        <td>
          <div style="font-weight:800; color:var(--text-main); font-size:0.95rem;">${escapeHTML(a.title)}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${escapeHTML(a.readTime || '4 min')} ${a.videoUrl ? '• 🎥 Con video' : ''}</div>
        </td>
        <td><span class="post-cat-badge ${getCategoryClass(a.category)}">${a.category}</span></td>
        <td>${statusMarkup}</td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.4rem; justify-content:flex-end; align-items:center;">
            ${toggleBtn}
            <button class="btn-action-sm" onclick="editArticleFromAdmin('${a.id}')" title="Modificar el contenido o título de este artículo">✏️ Modificar</button>
            <button class="btn-action-sm btn-danger" onclick="deleteArticleFromAdmin('${a.id}')" title="Eliminar definitivamente de Supabase">🗑️ Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ===================================================================
// GESTIÓN DE BIBLIOTECA DIGITAL EN EL PANEL (CRUD DE LIBROS)
// ===================================================================

function renderAdminBooksTable() {
  const tbody = document.getElementById('adminBooksTbody');
  if (!tbody) return;

  const books = getStoredBooks();
  if (books.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay libros cargados en la biblioteca digital todavía.</td></tr>`;
    return;
  }

  tbody.innerHTML = books.map(b => `
    <tr>
      <td><strong>${escapeHTML(b.title)}</strong><br><small style="color:var(--text-muted);">${escapeHTML(b.author)}</small></td>
      <td><span class="post-cat-badge ${getCategoryClass(b.category)}">${b.category}</span></td>
      <td>
        <span class="book-access-pill ${b.accessType === 'free' ? 'pill-free' : 'pill-readonly'}">
          ${b.accessType === 'free' ? '🟢 Descargar gratis (Libro descargable)' : '🔒 Solo para leer, no se puede descargar'}
        </span>
      </td>
      <td>${b.date || 'Reciente'}</td>
      <td>
        <div class="admin-table-actions">
          <button class="btn-action-icon" onclick="editBookFromAdmin('${b.id}')" title="Modificar este libro">✏️ Modificar</button>
          <button class="btn-action-icon btn-del" onclick="deleteBookFromAdmin('${b.id}')" title="Eliminar">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function prepareNewBook() {
  resetBookEditorForm();
  switchAdminTab('book-editor');
}

function resetBookEditorForm() {
  const form = document.getElementById('bookEditorForm');
  if (form) form.reset();
  const idIn = document.getElementById('editBookId');
  if (idIn) idIn.value = '';
  const banner = document.getElementById('editingBookAlertBanner');
  const heading = document.getElementById('bookEditorHeading');
  const btn = document.getElementById('btnSubmitBook');
  if (banner) banner.style.display = 'none';
  if (heading) heading.textContent = '📖 Cargar Nuevo Libro / Recurso';
  if (btn) btn.innerHTML = '<span>💾 Guardar y Publicar en Biblioteca</span>';
}

function editBookFromAdmin(id) {
  const books = getStoredBooks();
  const b = books.find(x => x.id === id);
  if (!b) return;

  document.getElementById('editBookId').value = b.id;
  document.getElementById('editBookTitle').value = b.title;
  document.getElementById('editBookAuthor').value = b.author;
  document.getElementById('editBookCategory').value = b.category;
  document.getElementById('editBookYearPages').value = b.year || '';
  document.getElementById('editBookExcerpt').value = b.excerpt;
  document.getElementById('editBookDriveUrl').value = b.driveUrl || '';

  const radioFree = document.getElementById('accessFree');
  const radioReadOnly = document.getElementById('accessReadOnly');
  if (b.accessType === 'read_only') {
    if (radioReadOnly) radioReadOnly.checked = true;
  } else {
    if (radioFree) radioFree.checked = true;
  }

  const banner = document.getElementById('editingBookAlertBanner');
  const display = document.getElementById('editingBookTitleDisplay');
  const heading = document.getElementById('bookEditorHeading');
  const btn = document.getElementById('btnSubmitBook');

  if (banner && display) {
    display.textContent = `"${b.title}"`;
    banner.style.display = 'flex';
  }
  if (heading) heading.textContent = '✏️ Modificando Libro de la Biblioteca';
  if (btn) btn.innerHTML = '<span>💾 Guardar Modificaciones al Libro</span>';

  switchAdminTab('book-editor');
}

function saveBookFromAdmin() {
  const id = document.getElementById('editBookId').value;
  const title = document.getElementById('editBookTitle').value.trim();
  const author = document.getElementById('editBookAuthor').value.trim();
  const category = document.getElementById('editBookCategory').value;
  const yearPages = document.getElementById('editBookYearPages').value.trim();
  const excerpt = document.getElementById('editBookExcerpt').value.trim();
  const driveUrl = document.getElementById('editBookDriveUrl').value.trim();

  const radioReadOnly = document.getElementById('accessReadOnly');
  const accessType = (radioReadOnly && radioReadOnly.checked) ? 'read_only' : 'free';

  if (!title || !author || !driveUrl) {
    alert('Por favor completá los campos obligatorios (*)');
    return;
  }

  let books = getStoredBooks();

  if (id) {
    const idx = books.findIndex(x => x.id === id);
    if (idx !== -1) {
      books[idx] = {
        ...books[idx],
        title,
        author,
        category,
        year: yearPages,
        excerpt,
        driveUrl,
        accessType
      };
      saveBooks(books);
      alert('✅ ¡Libro modificado y actualizado con éxito!');
    }
  } else {
    const newBook = {
      id: 'book-' + Date.now(),
      title,
      author,
      category,
      year: yearPages || '2026',
      pages: '',
      excerpt,
      driveUrl,
      accessType,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    books.unshift(newBook);
    saveBooks(books);
    alert('🎉 ¡Libro guardado y publicado en la Biblioteca Digital!');
  }

  resetBookEditorForm();
  renderAdminBooksTable();
  renderLibraryBooks('all', 'all', 'libraryHomeContainer');
  renderLibraryBooks('all', 'all', 'libraryAllContainer');
  switchAdminTab('library');
}

function deleteBookFromAdmin(id) {
  if (!confirm('¿Deseás eliminar este libro de la Biblioteca Digital?')) return;
  let books = getStoredBooks();
  books = books.filter(b => b.id !== id);
  saveBooks(books);
  renderAdminBooksTable();
  renderLibraryBooks('all', 'all', 'libraryHomeContainer');
  renderLibraryBooks('all', 'all', 'libraryAllContainer');
}

// Preparar para nuevo artículo limpio
function prepareNewArticle() {
  resetEditorForm();
  if (typeof cambiarModulo === 'function') {
    cambiarModulo('editor');
  } else if (typeof switchAdminTab === 'function') {
    switchAdminTab('editor');
  }
}

// MODIFICACIÓN DE ARTÍCULO EXISTENTE
function editArticleFromAdmin(id) {
  const articles = getStoredArticles();
  const a = articles.find(x => x.id === id);
  if (!a) return;

  const idIn = document.getElementById('editArticleId');
  if (idIn) idIn.value = a.id;
  const titleIn = document.getElementById('editTitle');
  if (titleIn) titleIn.value = a.title;
  const catIn = document.getElementById('editCategory');
  if (catIn) catIn.value = a.category;
  const readIn = document.getElementById('editReadTime');
  if (readIn) readIn.value = a.readTime || '';
  const excIn = document.getElementById('editExcerpt');
  if (excIn) excIn.value = a.excerpt;
  const bodyIn = document.getElementById('editBody');
  if (bodyIn) bodyIn.value = a.body;
  const visualCanvas = document.getElementById('editBodyVisual');
  if (visualCanvas) visualCanvas.innerHTML = a.body || '';
  const vidIn = document.getElementById('editVideoUrl');
  if (vidIn) {
    vidIn.value = a.videoUrl || '';
    if (typeof actualizarPreviewVideoArticulo === 'function') actualizarPreviewVideoArticulo(a.videoUrl || '');
  }
  const downIn = document.getElementById('editDownloadUrl');
  if (downIn) downIn.value = a.downloadUrl || '';

  // Foto de portada
  const coverUrlIn = document.getElementById('editArticleCoverUrl');
  const coverPrev = document.getElementById('editArticleCoverPreview');
  const wrapCover = document.getElementById('wrapPreviewCover');
  if (a.coverImage) {
    if (coverUrlIn) coverUrlIn.value = a.coverImage;
    if (coverPrev) coverPrev.src = a.coverImage;
    if (wrapCover) wrapCover.style.display = 'block';
  } else {
    if (coverUrlIn) coverUrlIn.value = '';
    if (wrapCover) wrapCover.style.display = 'none';
  }

  // Modo programación de fecha y hora
  const isScheduled = a.publishStatus === 'scheduled' || !!a.scheduledDate || !!a.scheduledAt;
  const radioProgB = document.getElementById('b_pub_programada');
  const radioInmedB = document.getElementById('b_pub_inmediata');
  const wrapProgB = document.getElementById('wrap_b_fecha_publicacion');
  const inputProgB = document.getElementById('b_fecha_publicacion');

  const modeRadios = document.getElementsByName('articlePublishMode');
  const scheduleWrap = document.getElementById('articleScheduleDateWrap');
  const scheduleDateTimeInput = document.getElementById('editArticleScheduleDateTime');

  let isoVal = a.fecha_publicacion || a.scheduledAt || '';
  if (!isoVal && a.scheduledDate) {
    isoVal = `${a.scheduledDate}T${a.scheduledTime || '18:00'}`;
  }

  if (isScheduled) {
    if (radioProgB) radioProgB.checked = true;
    if (wrapProgB) wrapProgB.style.display = 'block';
    if (inputProgB) inputProgB.value = isoVal;

    if (modeRadios.length) {
      modeRadios.forEach(r => { if (r.value === 'scheduled') r.checked = true; });
    }
    if (scheduleWrap) scheduleWrap.style.display = 'block';
    if (scheduleDateTimeInput) scheduleDateTimeInput.value = isoVal;
  } else {
    if (radioInmedB) radioInmedB.checked = true;
    if (wrapProgB) wrapProgB.style.display = 'none';

    if (modeRadios.length) {
      modeRadios.forEach(r => { if (r.value === 'now') r.checked = true; });
    }
    if (scheduleWrap) scheduleWrap.style.display = 'none';
  }

  // Activar aviso de modo modificación
  const banner = document.getElementById('editingAlertBanner');
  const titleDisplay = document.getElementById('editingArticleTitleDisplay');
  const btnSubmit = document.getElementById('btnSubmitArticleText') || document.getElementById('btnSubmitArticle');
  const heading = document.getElementById('editorTitleHeading');

  if (banner && titleDisplay) {
    titleDisplay.textContent = `"${a.title}"`;
    banner.style.display = 'flex';
  }
  if (btnSubmit) {
    btnSubmit.innerHTML = `💾 Guardar Modificaciones al Artículo`;
  }
  if (heading) {
    heading.textContent = '✏️ Modificando Artículo Existente';
  }

  switchAdminTab('editor');
}

function cancelArticleEdit() {
  resetEditorForm();
  if (typeof cambiarModulo === 'function') {
    cambiarModulo('articulos');
  } else if (typeof switchAdminTab === 'function') {
    switchAdminTab('articles');
  }
}

function cancelResourceEdit() {
  if (typeof prepareNewResource === 'function') {
    prepareNewResource();
  }
  if (typeof cambiarModulo === 'function') {
    cambiarModulo('recursos');
  } else if (typeof switchAdminTab === 'function') {
    switchAdminTab('resources');
  }
}

function toggleScheduleFields() {
  const modeScheduled = document.getElementById('modeScheduled');
  const fieldsRow = document.getElementById('scheduleFieldsRow');
  const btnSubmit = document.getElementById('btnSubmitArticle');
  const editId = document.getElementById('editArticleId') ? document.getElementById('editArticleId').value : '';

  if (modeScheduled && modeScheduled.checked) {
    if (fieldsRow) fieldsRow.style.display = 'grid';
    const dateInput = document.getElementById('editScheduleDate');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    if (btnSubmit) {
      btnSubmit.innerHTML = `<span>⏰ ${editId ? 'Guardar Cambios de Programación' : 'Guardar y Programar Publicación'}</span>`;
    }
  } else {
    if (fieldsRow) fieldsRow.style.display = 'none';
    if (btnSubmit) {
      btnSubmit.innerHTML = `<span>💾 ${editId ? 'Guardar Modificaciones al Artículo' : 'Guardar y Publicar en la Web'}</span>`;
    }
  }
}

function formatISODateToFriendly(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function resetEditorForm() {
  try {
    const idIn = document.getElementById('editArticleId');
    if (idIn) idIn.value = '';
    const form = document.getElementById('articleEditorForm');
    if (form) form.reset();

    const visualCanvas = document.getElementById('editBodyVisual');
    if (visualCanvas) visualCanvas.innerHTML = '';
    const bodyText = document.getElementById('editBody');
    if (bodyText) bodyText.value = '';
    const coverUrlIn = document.getElementById('editArticleCoverUrl');
    if (coverUrlIn) coverUrlIn.value = '';
    const wrapCover = document.getElementById('wrapPreviewCover');
    if (wrapCover) wrapCover.style.display = 'none';
    const boxVid = document.getElementById('boxVideoPreviewArticulo');
    if (boxVid) boxVid.style.display = 'none';

    const radioInmedB = document.getElementById('b_pub_inmediata');
    if (radioInmedB) radioInmedB.checked = true;
    const wrapProgB = document.getElementById('wrap_b_fecha_publicacion');
    if (wrapProgB) wrapProgB.style.display = 'none';
    const fechaInB = document.getElementById('b_fecha_publicacion');
    if (fechaInB) fechaInB.value = '';

    const banner = document.getElementById('editingAlertBanner');
    if (banner) banner.style.display = 'none';
    const heading = document.getElementById('editorTitleHeading');
    if (heading) heading.textContent = '✍️ Redactor de Artículos del Blog';
    const btnSubmit = document.getElementById('btnSubmitArticleText');
    if (btnSubmit) btnSubmit.innerHTML = '💾 Publicar en el Blog';
  } catch (err) {
    console.warn('resetEditorForm error:', err);
  }
}

function insertTag(startTag, endTag) {
  const textarea = document.getElementById('editBody');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selText = textarea.value.substring(start, end);
  const replacement = startTag + selText + endTag;
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
  textarea.selectionStart = start + startTag.length;
  textarea.selectionEnd = start + startTag.length + selText.length;
}

function previewArticleDraft() {
  const title = document.getElementById('editTitle').value.trim() || 'Título de ejemplo';
  const category = document.getElementById('editCategory').value;
  const readTime = document.getElementById('editReadTime').value.trim() || '5 min de lectura';
  const visualCanvas = document.getElementById('editBodyVisual');
  const body = (visualCanvas && visualCanvas.innerHTML.trim()) ? visualCanvas.innerHTML.trim() : (document.getElementById('editBody').value.trim() || 'Cuerpo del artículo...');
  const videoUrl = document.getElementById('editVideoUrl').value.trim();
  const downloadUrl = document.getElementById('editDownloadUrl').value.trim();

  const draftObj = {
    id: 'draft-preview',
    title,
    category,
    date: 'Vista previa',
    readTime,
    body,
    videoUrl,
    downloadUrl,
    comments: []
  };

  const currentArticles = getStoredArticles();
  currentArticles.unshift(draftObj);
  openArticleReader('draft-preview');
}

function saveArticleFromAdmin() {
  const editId = document.getElementById('editArticleId').value;
  const title = document.getElementById('editTitle').value.trim();
  const category = document.getElementById('editCategory').value;
  const readTime = document.getElementById('editReadTime').value.trim();
  const excerpt = document.getElementById('editExcerpt').value.trim();
  const visualCanvas = document.getElementById('editBodyVisual');
  const body = (visualCanvas && visualCanvas.innerHTML.trim()) ? visualCanvas.innerHTML.trim() : document.getElementById('editBody').value.trim();
  const videoUrl = document.getElementById('editVideoUrl').value.trim();
  const downloadUrl = document.getElementById('editDownloadUrl').value.trim();
  const coverUrl = document.getElementById('editArticleCoverUrl') ? document.getElementById('editArticleCoverUrl').value.trim() : '';

  if (!title || !excerpt || !body) {
    alert('Por favor completá los campos obligatorios (*) del artículo.');
    return;
  }

  // Programación de fecha y hora
  const radioProgB = document.getElementById('b_pub_programada');
  const modeRadios = document.getElementsByName('articlePublishMode');
  let isScheduled = false;
  if (radioProgB && radioProgB.checked) {
    isScheduled = true;
  } else {
    for (const r of modeRadios) {
      if (r.checked && r.value === 'scheduled') isScheduled = true;
    }
  }

  const inputProgB = document.getElementById('b_fecha_publicacion');
  const scheduleDateTimeInput = document.getElementById('editArticleScheduleDateTime');
  let scheduledAt = '';
  if (isScheduled) {
    if (inputProgB && inputProgB.value) scheduledAt = inputProgB.value;
    else if (scheduleDateTimeInput && scheduleDateTimeInput.value) scheduledAt = scheduleDateTimeInput.value;
  }

  let scheduledDate = '';
  let scheduledTime = '18:00';

  if (scheduledAt) {
    const parts = scheduledAt.split('T');
    scheduledDate = parts[0];
    scheduledTime = parts[1] || '18:00';
  } else if (isScheduled) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    scheduledDate = tomorrow.toISOString().split('T')[0];
    scheduledAt = `${scheduledDate}T18:00`;
  }

  const fecha_publicacion = isScheduled ? scheduledAt : new Date().toISOString();
  const displayDate = isScheduled 
    ? formatISODateToFriendly(scheduledDate)
    : new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

  let articles = getStoredArticles();

  if (editId) {
    // MODIFICAR ARTÍCULO EXISTENTE
    const index = articles.findIndex(a => a.id === editId);
    if (index !== -1) {
      articles[index] = {
        ...articles[index],
        title,
        category,
        readTime: readTime || articles[index].readTime || '4 min de lectura',
        excerpt,
        body,
        coverImage: coverUrl || articles[index].coverImage || '',
        videoUrl,
        downloadUrl,
        publishStatus: isScheduled ? 'scheduled' : 'published',
        scheduledDate,
        scheduledTime,
        scheduledAt,
        fecha_publicacion,
        date: displayDate
      };
      saveArticles(articles);
      if (isScheduled) {
        alert(`⏰ ¡Publicación agendada para el ${displayDate} a las ${scheduledTime} hs!\nSe agregó a tu Calendario Editorial.`);
      } else {
        alert('✅ ¡El artículo ha sido modificado y actualizado con éxito!');
      }
    }
  } else {
    // NUEVO ARTÍCULO
    const newPost = {
      id: 'post-' + Date.now(),
      title,
      category,
      date: displayDate,
      readTime: readTime || '4 min de lectura',
      excerpt,
      body,
      coverImage: coverUrl || '',
      videoUrl,
      downloadUrl,
      publishStatus: isScheduled ? 'scheduled' : 'published',
      scheduledDate,
      scheduledTime,
      scheduledAt,
      fecha_publicacion,
      comments: []
    };
    articles.unshift(newPost);
    saveArticles(articles);
    if (isScheduled) {
      alert(`🎉 ¡Publicación programada exitosamente para el ${displayDate} a las ${scheduledTime} hs!\nSe agregó a tu Calendario Editorial.`);
    } else {
      alert('🎉 ¡Artículo guardado y publicado en la página exitosamente!');
    }
  }

  resetEditorForm();
  renderAdminArticlesTable();
  renderEditorialCalendar();
  renderBlogPosts('all');
  switchAdminTab(isScheduled ? 'calendar' : 'articles');
}

async function toggleArticlePublishStatus(id) {
  let articles = getStoredArticles();
  const article = articles.find(a => a.id === id);
  if (!article) return;

  const newStatus = article.publishStatus === 'published' ? 'draft' : 'published';
  article.publishStatus = newStatus;
  article.updated_at = new Date().toISOString();

  try {
    if (typeof showToastNotification === 'function') {
      showToastNotification(newStatus === 'published' ? 'Publicando en la web...' : 'Despublicando artículo...', '⏳');
    }

    saveArticles(articles);
    renderAdminArticlesTable();
    if (typeof renderEditorialCalendar === 'function') renderEditorialCalendar();
    if (typeof renderBlogPosts === 'function') renderBlogPosts('all');

    if (typeof showToastNotification === 'function') {
      showToastNotification(newStatus === 'published' ? 'Artículo publicado en la web.' : 'Artículo despublicado (guardado como borrador).', newStatus === 'published' ? '🟢' : '⚪');
    }
  } catch (err) {
    console.error('Error al cambiar estado de publicación:', err);
    alert('❌ No se pudo actualizar el artículo: ' + (err.message || err));
  }
}

async function deleteArticleFromAdmin(id) {
  const articles = getStoredArticles();
  const target = articles.find(a => a.id === id);
  const title = target ? target.title : id;

  if (!confirm(`¿Deseás quitar de este navegador el artículo "${title}"? La base pública no se modifica desde el sitio web.`)) {
    return;
  }

  try {
    // Actualizar almacenamiento local
    const updated = getStoredArticles().filter(a => a.id !== id);
    saveArticles(updated);

    // Actualizar tablas y vistas
    renderAdminArticlesTable();
    if (typeof renderEditorialCalendar === 'function') renderEditorialCalendar();
    if (typeof renderBlogPosts === 'function') renderBlogPosts('all');

    if (typeof showToastNotification === 'function') {
      showToastNotification('Artículo quitado de este navegador.', '🗑️');
    }
  } catch (err) {
    console.error('Error al eliminar artículo:', err);
    alert('❌ No se pudo quitar el artículo: ' + (err.message || err));
  }
}

// Renderizar Bandeja de Mensajes
function renderAdminMessages() {
  const list = document.getElementById('adminMessagesList');
  const tbody = document.getElementById('adminMessagesTbody');
  const messages = getStoredMessages();

  if (list) {
    if (messages.length === 0) {
      list.innerHTML = `<p style="padding:2.5rem; text-align:center; color:var(--text-muted); background:var(--bg-cream, #FAF6F0); border-radius:12px;">No hay mensajes recibidos aún en la bandeja.</p>`;
    } else {
      list.innerHTML = messages.map(m => `
        <div class="admin-card" style="margin-bottom:1rem; border-left:4px solid var(--primary-purple, #7E569B);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <strong style="color:var(--primary-purple, #7E569B); font-size:1.05rem;">${escapeHTML(m.name)}</strong>
              <span style="color:var(--text-muted); font-size:0.85rem;"> &bull; 📧 ${escapeHTML(m.email)} &bull; 📞 ${escapeHTML(m.phone || 'Sin tel')}</span>
            </div>
            <span style="font-size:0.8rem; color:var(--text-muted);">🕒 ${m.date || ''}</span>
          </div>
          <p style="font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Asunto / Materia: ${escapeHTML(m.subject || 'Consulta General')}</p>
          <p style="font-size:0.95rem; line-height:1.6; background:#FAF7F2; padding:1rem; border-radius:8px; margin-bottom:0.8rem;">${escapeHTML(m.message)}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
            <a href="https://wa.me/${(m.phone || '').replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(m.name)},%20te%20escribo%20en%20respuesta%20a%20tu%20consulta." target="_blank" class="btn-submit-copper" style="padding:0.4rem 0.85rem; font-size:0.84rem; text-decoration:none;">
              💬 Responder por WhatsApp
            </a>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-action-sm" onclick="toggleReadMessage('${m.id}')">${m.read ? 'Marcar no leído' : '✓ Leído'}</button>
              <button type="button" class="btn-action-sm btn-danger" onclick="deleteMessage('${m.id}')">🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  if (tbody) {
    if (messages.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay mensajes de contacto registrados.</td></tr>`;
    } else {
      tbody.innerHTML = messages.map(m => `
        <tr>
          <td><span style="font-size:0.82rem; color:var(--text-muted);">${m.date || ''}</span></td>
          <td><strong>${escapeHTML(m.name)}</strong><br><small style="color:var(--text-muted);">${escapeHTML(m.email)}</small></td>
          <td><strong>${escapeHTML(m.subject || 'Consulta')}</strong><br><span style="font-size:0.88rem;">${escapeHTML(m.message)}</span></td>
          <td>${m.phone ? `<a href="https://wa.me/${m.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color:var(--primary-purple, #7E569B); font-weight:600;">📱 ${m.phone}</a>` : '—'}</td>
          <td style="text-align:right; white-space:nowrap;">
            <button type="button" class="btn-action-sm" onclick="toggleReadMessage('${m.id}')">${m.read ? 'Leído' : 'Nuevo'}</button>
            <button type="button" class="btn-action-sm btn-danger" onclick="deleteMessage('${m.id}')">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

window.renderAdminMessagesTable = renderAdminMessages;

function toggleReadMessage(id) {
  const messages = getStoredMessages();
  const m = messages.find(x => x.id === id);
  if (m) {
    m.read = !m.read;
    saveMessages(messages);
    renderAdminMessages();
    updateInboxBadge();
  }
}

function deleteMessage(id) {
  if (!confirm('¿Eliminar este mensaje de la bandeja?')) return;
  let messages = getStoredMessages();
  messages = messages.filter(x => x.id !== id);
  saveMessages(messages);
  renderAdminMessages();
  updateInboxBadge();
}

// Moderación de Comentarios
function renderAdminComments() {
  const container = document.getElementById('adminCommentsList');
  if (!container) return;

  const articles = getStoredArticles();
  let allComments = [];

  articles.forEach(a => {
    if (a.comments && a.comments.length > 0) {
      a.comments.forEach(c => {
        allComments.push({ ...c, articleId: a.id, articleTitle: a.title });
      });
    }
  });

  if (allComments.length === 0) {
    container.innerHTML = `<p style="padding:2.5rem; text-align:center; color:var(--text-muted); background:var(--color-bg); border-radius:12px;">No hay comentarios cargados en ningún artículo.</p>`;
    return;
  }

  container.innerHTML = allComments.map(c => `
    <div class="admin-comment-row">
      <div class="comment-header">
        <div>
          <strong>👤 ${escapeHTML(c.author)}</strong>
          <span class="sub-text">(${escapeHTML(c.email)}) &bull; ${c.date}</span>
        </div>
        <span class="sub-text">Artículo: <em>"${escapeHTML(c.articleTitle)}"</em></span>
      </div>
      <p style="margin:0.75rem 0; font-size:0.95rem; line-height:1.5;">${escapeHTML(c.text)}</p>
      
      ${c.reply ? `
        <div class="teacher-reply-card">
          <strong>Tu respuesta oficial:</strong> ${escapeHTML(c.reply)}
        </div>
      ` : ''}

      <div style="display:flex; gap:0.6rem; margin-top:1rem;">
        <button class="btn btn-primary btn-sm" onclick="replyCommentAdmin('${c.articleId}', '${c.id}')">💬 Responder como Docente</button>
        <button class="btn btn-outline btn-sm" onclick="deleteCommentAdmin('${c.articleId}', '${c.id}')" style="color:#D32F2F; border-color:#FFCDD2;">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

function replyCommentAdmin(articleId, commentId) {
  const reply = prompt('Escribí tu respuesta como Rosana:');
  if (!reply) return;

  const articles = getStoredArticles();
  const article = articles.find(a => a.id === articleId);
  if (article && article.comments) {
    const comment = article.comments.find(c => c.id === commentId);
    if (comment) {
      comment.reply = reply;
      saveArticles(articles);
      renderAdminComments();
      alert('✨ Respuesta guardada con éxito.');
    }
  }
}

function deleteCommentAdmin(articleId, commentId) {
  if (!confirm('¿Deseás eliminar este comentario?')) return;

  const articles = getStoredArticles();
  const article = articles.find(a => a.id === articleId);
  if (article && article.comments) {
    article.comments = article.comments.filter(c => c.id !== commentId);
    saveArticles(articles);
    renderAdminComments();
    renderBlogPosts('all');
  }
}

// Guardar ajustes de redes, CV y LinkedIn
function saveAdminSettings() {
  const current = getStoredSettings();
  const getVal = (id, fallback = '') => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : fallback;
  };

  const email = getVal('settingEmail', current.email || 'tecnoeduca81@gmail.com');
  const whatsapp = getVal('settingWhatsApp', current.whatsapp || '');
  const linkedin = getVal('settingLI', current.linkedin || '');
  const github = getVal('settingGH', current.github || '');
  const cvUrl = getVal('settingCvUrl', current.cvUrl || '');
  const canvaUrl = getVal('settingCanvaUrl', current.canvaUrl || '');
  const youtube = getVal('settingYT', current.youtube || '');
  const facebook = getVal('settingFB', current.facebook || '');
  const instagram = getVal('settingIG', current.instagram || '');
  const instagramPersonal = getVal('settingIGPersonal', current.instagramPersonal || '');
  const telegram = getVal('settingTG', current.telegram || '');
  const discord = getVal('settingDC', current.discord || '');
  const tiktok = getVal('settingTT', current.tiktok || '');
  const threads = getVal('settingThreads', current.threads || '');
  const substack = getVal('settingSubstack', current.substack || '');
  const facebookPersonal = getVal('settingFBPersonal', current.facebookPersonal || '');
  const discordPersonal = getVal('settingDCPersonal', current.discordPersonal || '');

  const cleanPhone = whatsapp.replace(/[^0-9]/g, '');

  const updated = {
    ...current,
    email,
    whatsapp,
    phoneClean: cleanPhone || current.phoneClean,
    linkedin,
    github,
    cvUrl,
    canvaUrl,
    youtube,
    facebook,
    instagram,
    instagramPersonal,
    telegram,
    discord,
    tiktok,
    threads,
    substack,
    facebookPersonal,
    discordPersonal
  };

  saveSettings(updated);
  applySettingsToUI();

  const badge = document.getElementById('settingsSavedBadge');
  if (badge) {
    badge.style.display = 'inline-block';
    setTimeout(() => { badge.style.display = 'none'; }, 3000);
  }
}

// Subida de archivo de CV (Canva / PDF / Imagen)
function handleCvFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Límite de 4MB para localStorage del navegador
  if (file.size > 4.5 * 1024 * 1024) {
    alert('⚠️ El archivo supera los 4.5 MB. Te sugerimos exportar tu diseño de Canva con compresión estándar o pegar el enlace directo de Canva.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileData = e.target.result;
    const current = getStoredSettings();
    const updated = {
      ...current,
      cvFileData: fileData,
      cvFileName: file.name,
      cvFileType: file.type || 'application/pdf'
    };

    saveSettings(updated);
    applySettingsToUI();
    updateCvAdminUploadStatus();
    alert('🎉 ¡Archivo de CV (' + file.name + ') guardado con éxito! Ya está disponible para tus visitantes.');
  };

  reader.onerror = function() {
    alert('❌ Ocurrió un error al leer el archivo. Por favor probá nuevamente.');
  };

  reader.readAsDataURL(file);
}

function removeCvFile() {
  if (!confirm('¿Deseás quitar el archivo de CV subido?')) return;
  const current = getStoredSettings();
  const updated = {
    ...current,
    cvFileData: '',
    cvFileName: '',
    cvFileType: ''
  };

  saveSettings(updated);
  applySettingsToUI();
  updateCvAdminUploadStatus();

  const fileInput = document.getElementById('cvFileInput');
  if (fileInput) fileInput.value = '';
}

function updateCvAdminUploadStatus() {
  const settings = getStoredSettings();
  const box = document.getElementById('cvFileStatusBox');
  const label = document.getElementById('cvFileNameLabel');

  if (box && label) {
    if (settings.cvFileData && settings.cvFileName) {
      label.textContent = settings.cvFileName;
      box.style.display = 'inline-flex';
    } else {
      box.style.display = 'none';
      label.textContent = '';
    }
  }
}

// ===================================================================
// MODALES LEGALES
// ===================================================================

const LEGAL_TEXTS = {
  privacy: {
    title: 'Política de Privacidad y Protección de Datos Personales',
    content: `
      <h4>1. Responsable del Tratamiento de Datos</h4>
      <p>Los datos personales recabados a través de este sitio web y de la comunidad educativa <strong>TecnoEduca</strong> son tratados de manera confidencial, bajo la exclusiva responsabilidad de la <strong>Prof. Rosana</strong>, con domicilio profesional en la ciudad de Luján, Provincia de Buenos Aires, Argentina, y contacto oficial en <a href="mailto:tecnoeduca81@gmail.com" style="color:var(--primary-purple); font-weight:700;">tecnoeduca81@gmail.com</a>.</p>

      <h4>2. Finalidad y Tratamiento del Formulario de Contacto</h4>
      <p>La información solicitada en los formularios de consulta (Nombre, Apellido, medio de contacto por correo electrónico o teléfono, motivo y mensaje) tiene como único propósito registrar su inquietud en el panel administrativo docente, responder a su consulta y coordinar clases particulares o material didáctico. No se solicitan datos sensibles ni se realiza comercialización de ningún tipo.</p>

      <h4>3. Seguridad y Confidencialidad (Ley 25.326)</h4>
      <p>Bajo ninguna circunstancia se venderán, cederán ni transferirán datos personales a terceros con fines comerciales o publicitarios. Los datos se almacenan en servidores seguros con cifrado de nivel estándar y acceso restringido al entorno docente.</p>

      <h4>4. Derechos del Titular (Acceso, Rectificación y Supresión)</h4>
      <p>De acuerdo con la Ley Nacional Nº 25.326 de Protección de los Datos Personales, el usuario o titular de los datos tiene derecho en todo momento a acceder gratuitamente a sus datos, rectificarlos, actualizarlos o solicitar su eliminación inmediata de nuestra base docente, enviando un correo a <a href="mailto:tecnoeduca81@gmail.com">tecnoeduca81@gmail.com</a>.</p>
    `
  },
  terms: {
    title: 'Términos y Condiciones del Servicio Educativo',
    content: `
      <h4>1. Modalidades de Enseñanza y Clases Particulares</h4>
      <p>Las clases particulares se imparten en modalidad <strong>Virtual (Online en vivo)</strong> con pizarras interactivas compartidas para todo el país, y en modalidad <strong>Presencial</strong> en la ciudad de Luján. Cada encuentro se adapta al nivel del estudiante (secundario, tecnicatura, terciario o universitario).</p>

      <h4>2. Coordinación y Contacto</h4>
      <p>Toda consulta pedagógica o coordinación horaria se canaliza a través de nuestro <strong>formulario web de contacto</strong> o mediante comunicación directa por correo electrónico a <strong>tecnoeduca81@gmail.com</strong>. La docente responderá a la brevedad con la disponibilidad de días, horarios y aranceles actualizados.</p>

      <h4>3. Aplicaciones Interactivas y Banco de Recursos</h4>
      <p>Las aplicaciones educativas interactivas (como la Tabla Periódica Interactiva, simuladores dinámicos de movimiento y física cuántica/nuclear, y visualizadores estadísticos) y el banco de imágenes y recursos de diseño son herramientas didácticas de acceso libre y gratuito para el enriquecimiento del aprendizaje de estudiantes y docentes.</p>

      <h4>4. Compromiso y Acompañamiento Pedagógico</h4>
      <p>La labor docente consiste en brindar una metodología clara, comprensiva y rigurosa, facilitando la comprensión conceptual y el razonamiento lógico. La aprobación y evolución académica depende de la constancia, el estudio personal y la práctica del alumno.</p>
    `
  },
  copyright: {
    title: 'Aviso Legal, Propiedad Intelectual y Recursos Abiertos',
    content: `
      <h4>1. Propiedad Intelectual y Autoría</h4>
      <p>Los contenidos didácticos, artículos de divulgación, apuntes, cuadernillos y desarrollos web de este sitio son autoría de la <strong>Prof. Rosana</strong> bajo la denominación <strong>TecnoEduca</strong>, o cuentan con las debidas licencias de uso educativo.</p>

      <h4>2. Recursos de Diseño, Imágenes y Aplicaciones</h4>
      <p>El banco de imágenes científicas, diagramas de laboratorio, esquemas de diseño y simuladores interactivos están disponibles para uso educativo, académico y personal, solicitando la mención de autoría (<em>Prof. Rosana &bull; TecnoEduca</em>). Queda prohibida su comercialización directa o reventa con fines lucrativos.</p>
    `
  }
};

function openLegalModal(type = 'privacy') {
  const modal = document.getElementById('legalModal');
  const titleEl = document.getElementById('legalModalTitle');
  const bodyEl = document.getElementById('legalModalBody');

  const data = LEGAL_TEXTS[type] || LEGAL_TEXTS.privacy;
  titleEl.textContent = data.title;
  bodyEl.innerHTML = data.content;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ===================================================================
// ASISTENTE DE WHATSAPP, MENÚ MÓVIL Y SCROLL
// ===================================================================

function initWhatsAppAssistant() {
  const formSubject = document.getElementById('formSubject');
  const formLevel = document.getElementById('formLevel');
  const formMode = document.getElementById('formMode');
  const formGoal = document.getElementById('formGoal');
  const msgPreview = document.getElementById('msgPreview');

  function updatePreview() {
    if (!formSubject || !formLevel || !formMode || !msgPreview) return;
    const s = formSubject.value;
    const l = formLevel.value;
    const m = formMode.value;
    const g = formGoal.value.trim();

    let text = `¡Hola Rosana! Te contacto desde tu página web para coordinar clases de *${s}* para nivel *${l}* en modalidad *${m}*.`;
    if (g) text += ` Mi objetivo / urgencia: "${g}".`;
    text += ` ¿Podrías indicarme días y horarios disponibles? ¡Muchas gracias!`;

    msgPreview.textContent = `"${text}"`;
  }

  if (formSubject) formSubject.addEventListener('change', updatePreview);
  if (formLevel) formLevel.addEventListener('change', updatePreview);
  if (formMode) formMode.addEventListener('change', updatePreview);
  if (formGoal) formGoal.addEventListener('input', updatePreview);

  updatePreview();
}

function sendCustomWhatsApp() {
  const settings = getStoredSettings();
  const s = document.getElementById('formSubject') ? document.getElementById('formSubject').value : 'Clases Particulares';
  const l = document.getElementById('formLevel') ? document.getElementById('formLevel').value : '';
  const m = document.getElementById('formMode') ? document.getElementById('formMode').value : '';
  const g = document.getElementById('formGoal') ? document.getElementById('formGoal').value.trim() : '';

  if (!settings.phoneClean) {
    openContactModal(s);
    return;
  }

  let message = `¡Hola Rosana! Te contacto desde tu página web para coordinar clases de *${s}* para nivel *${l}* en modalidad *${m}*.`;
  if (g) message += ` Mi objetivo / urgencia: "${g}".`;
  message += ` ¿Podrías indicarme días y horarios disponibles? ¡Muchas gracias!`;

  const url = `https://wa.me/${settings.phoneClean}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!menuToggle || !navMenu) return;

  menuToggle.onclick = window.toggleMobileNav;

  const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta-mobile a');
  navLinks.forEach(link => {
    link.addEventListener('click', window.closeMobileNav);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      window.closeMobileNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeMobileNav();
    }
  });
}

function initHeaderScroll() {
  const header = document.getElementById('header') || document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function escapeHTML(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// ===================================================================
// BANCO DE RECURSOS DIGITALES, GRÁFICOS Y PLANTILLAS
// ===================================================================

const RESOURCE_CATEGORY_LABELS = {
  imagenes: '🖼️ Imágenes Libres de Uso Común',
  archivos: '📁 Archivos & Guías Didácticas',
  videos: '🎥 Videos & Clips Didácticos',
  plantillas: '🎨 Plantillas & Planificadores',
  ciencias: '📐 Ciencias & Fórmulas Didácticas',
  tecnologia: '💻 Archivo Tech & Datos',
  graficos: '📈 Fórmulas & Tablas'
};

function renderResources(category = 'all', searchQuery = '', targetContainerId = 'resourcesContainer') {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  if (targetContainerId === 'resourcesContainer') {
    currentResourceCategory = category;
  }
  const allResources = getStoredResources().filter(r => r.publishStatus !== 'draft');
  let resources = allResources;

  if (category !== 'all') {
    resources = resources.filter(r => r.category === category);
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    resources = resources.filter(r => 
      r.title.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.format && r.format.toLowerCase().includes(q)) ||
      (r.software && r.software.toLowerCase().includes(q))
    );
  }

  // Soporte de data-limit para vista previa en Inicio
  const limitAttr = container.getAttribute('data-limit');
  const isLimited = limitAttr && parseInt(limitAttr, 10) > 0;
  if (isLimited) {
    resources = resources.slice(0, parseInt(limitAttr, 10));
  }

  if (resources.length === 0) {
    const emptyMessage = allResources.length === 0
      ? 'Todavía no hay recursos cargados.'
      : 'No encontramos archivos con ese filtro o búsqueda. Probá con otra categoría o restablecé los filtros.';
    container.innerHTML = `
      <div class="empty-resources-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--color-bg-soft); border-radius: 16px; border: 2px dashed var(--primary-purple-border);">
        <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🔍</span>
        <h3 style="font-size: 1.4rem; color: var(--primary-purple-dark); margin-bottom: 0.5rem;">${allResources.length === 0 ? 'Próximamente' : 'No se encontraron recursos'}</h3>
        <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem;">${emptyMessage}</p>
        ${allResources.length > 0 ? '<button class="btn btn-primary" onclick="resetResourceFilters()">Mostrar todos los recursos</button>' : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = resources.map(res => {
    const isFree = res.licenseType === 'free' || (res.license && res.license.toLowerCase().includes('100%')) || res.category === 'imagenes' || res.category === 'videos';
    const isVideo = res.category === 'videos' || (res.url && (res.url.includes('youtube.com') || res.url.includes('youtu.be') || res.url.includes('vimeo.com') || res.url.match(/\.(mp4|webm)$/i)));
    let pillClass = 'res-format-pill';
    if (res.category === 'videos' || isVideo) pillClass += ' res-pill-video';
    else if (res.category === 'imagenes') pillClass += ' res-pill-photo';

    let actionLabel = '📥 Descargar ↗';
    let actionHref = res.url;
    let actionTarget = 'target="_blank" rel="noopener noreferrer"';
    let actionOnClick = '';

    if (isVideo) {
      actionLabel = '▶️ Ver Video Explicativo';
      actionHref = 'javascript:void(0)';
      actionTarget = '';
      actionOnClick = `onclick="openResourceModal('${res.id}')"`;
    } else if (res.category === 'web') {
      actionLabel = '🌐 Visitar Sitio Web ↗';
    } else if (res.category === 'interactivas') {
      actionLabel = '📱 Probar App / Simulador ↗';
    } else if (res.category === 'plantillas') {
      actionLabel = '🎨 Abrir en Canva ↗';
    }

    return `
      <article class="resource-card" data-category="${res.category}">
        <div class="resource-card-thumb" style="background: linear-gradient(135deg, ${res.previewColor || (isVideo ? '#205A65' : '#7E569B')} 0%, rgba(32,90,101,0.85) 100%);">
          <span class="res-thumb-icon">${res.previewIcon || (isVideo ? '🎥' : '📁')}</span>
          <span class="${pillClass}">${escapeHTML(res.format)}</span>
        </div>

        <div class="resource-card-body">
          <div class="res-card-meta">
            <span class="post-cat-badge">${res.categoryLabel || RESOURCE_CATEGORY_LABELS[res.category] || res.category}</span>
            <span class="res-software-badge">🛠️ ${escapeHTML(res.software || 'Multiuso')}</span>
          </div>

          <h3 class="res-card-title">${escapeHTML(res.title)}</h3>
          <p class="res-card-desc">${escapeHTML(res.description)}</p>

          <div class="res-attribution-badge">
            <span>✨ <strong>${isVideo ? 'Video Didáctico en Streaming Directo' : (res.category === 'web' ? 'Proyecto de Portafolio Profesional' : 'Recurso de Acceso Abierto')}</strong></span>
          </div>

          <div class="res-card-actions">
            <a href="${actionHref}" ${actionTarget} ${actionOnClick} class="btn btn-primary btn-res-main">
              <span>${actionLabel}</span>
            </a>
            <button type="button" class="btn btn-outline btn-res-details" onclick="openResourceModal('${res.id}')">
              <span>👁️ Info</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function initResourceFilters() {
  const filterBtns = document.querySelectorAll('.resource-filter-btn');
  const searchInput = document.getElementById('resourceSearchInput');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category') || 'all';
      const query = searchInput ? searchInput.value : '';
      renderResources(cat, query);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeBtn = document.querySelector('.resource-filter-btn.active');
      const cat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
      renderResources(cat, e.target.value);
    });
  }
}

function resetResourceFilters() {
  const searchInput = document.getElementById('resourceSearchInput');
  if (searchInput) searchInput.value = '';
  const allBtn = document.querySelector('.resource-filter-btn[data-category="all"]');
  if (allBtn) {
    document.querySelectorAll('.resource-filter-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
  }
  renderResources('all', '');
}

function openResourceModal(resourceId) {
  const resources = getStoredResources();
  const res = resources.find(r => r.id === resourceId);
  if (!res) return;

  const modal = document.getElementById('resourceModal');
  if (!modal) return;

  const t = document.getElementById('modalResTitle');
  const c = document.getElementById('modalResCategory');
  const f = document.getElementById('modalResFormat');
  const s = document.getElementById('modalResSoftware');
  const d = document.getElementById('modalResDesc');
  const da = document.getElementById('modalResDate');
  const cit = document.getElementById('modalResCitation');
  const act = document.getElementById('modalResActionBtn');
  const licNote = document.getElementById('modalResLicenseNote');

  if (t) t.textContent = res.title;
  if (c) c.textContent = res.categoryLabel || RESOURCE_CATEGORY_LABELS[res.category] || res.category;
  if (f) f.textContent = res.format;
  if (s) s.textContent = res.software || 'Cualquier visor';
  if (d) d.textContent = res.description;
  if (da) da.textContent = res.date || 'Reciente';

  const isFree = res.licenseType === 'free' || (res.license && res.license.toLowerCase().includes('100%')) || res.category === 'imagenes' || res.category === 'videos';

  if (isFree) {
    if (cit) cit.value = `Recurso didáctico y multimedia libre cortesía de Prof. Rosana (TecnoEduca). Descarga y uso totalmente libre.`;
    if (licNote) {
      licNote.innerHTML = `🎁 <strong>Uso 100% Libre Común:</strong> Podés descargar, editar y usar este archivo en tus redes, clases, presentaciones o proyectos personales como vos quieras. (Mencionar a Rosana es optativo pero muy valorado ❤️).`;
    }
  } else {
    if (cit) cit.value = `Recurso pedagógico creado por Prof. Rosana (TecnoEduca) - Matemática, Física, Química & Ciencia de Datos. Licencia CC BY 4.0.`;
    if (licNote) {
      licNote.innerHTML = `🌿 <strong>Licencia Libre con Atribución (Creative Commons BY 4.0):</strong> Podés usarlo y editarlo libremente citando la autoría.`;
    }
  }

  if (act) {
    const isVideo = res.category === 'videos' || (res.url && (res.url.includes('youtube.com') || res.url.includes('youtu.be') || res.url.includes('vimeo.com') || res.url.match(/\.(mp4|webm)$/i)));
    if (isVideo) {
      act.href = res.url;
      act.innerHTML = `<span>▶️ Reproduciendo video en pantalla</span>`;
    } else {
      act.href = res.url;
      act.innerHTML = `<span>${res.fileType === 'link' ? '🎨 Abrir Recurso / Plantilla ↗' : (res.category === 'web' ? '🌐 Visitar Proyecto Web ↗' : '📥 Descargar Archivo Gratis ↗')}</span>`;
    }
  }

  // Reproductor embebido directo (sin salir de la web)
  const videoContainer = document.getElementById('modalResVideoContainer');
  const isVideo = res.category === 'videos' || (res.url && (res.url.includes('youtube.com') || res.url.includes('youtu.be') || res.url.includes('vimeo.com') || res.url.match(/\.(mp4|webm)$/i)));
  if (videoContainer) {
    if (isVideo) {
      const vHtml = generarIframeVideo(res.url, res.title);
      videoContainer.innerHTML = vHtml;
      videoContainer.style.display = 'block';
    } else {
      videoContainer.innerHTML = '';
      videoContainer.style.display = 'none';
    }
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeResourceModal() {
  const modal = document.getElementById('resourceModal');
  if (modal) modal.style.display = 'none';
  const videoContainer = document.getElementById('modalResVideoContainer');
  if (videoContainer) {
    videoContainer.innerHTML = '';
    videoContainer.style.display = 'none';
  }
  document.body.style.overflow = 'auto';
}

function copyCitationText(btn) {
  const input = document.getElementById('modalResCitation');
  const citationText = (input && input.value && input.value.trim())
    ? input.value.trim()
    : 'Prof. Rosana • Clases Particulares y Recursos Didácticos (TecnoEduca) - Contacto: tecnoeduca81@gmail.com';

  if (input) {
    try {
      input.select();
      input.setSelectionRange(0, 99999);
    } catch (e) {}
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(citationText).then(() => {
      showCopyFeedback(btn);
    }).catch(() => {
      fallbackCopyText(citationText, btn);
    });
  } else {
    fallbackCopyText(citationText, btn);
  }
}

function fallbackCopyText(text, btn) {
  try {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopyFeedback(btn);
  } catch (err) {
    console.warn('Fallback copy err:', err);
    showCopyFeedback(btn);
  }
}

function showCopyFeedback(btn) {
  const originalText = btn.innerHTML;
  btn.innerHTML = '✅ ¡Cita Copiada!';
  btn.style.background = 'var(--accent-teal)';
  btn.style.color = '#FFF';
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.style.color = '';
  }, 2200);
}

// ------------------- Panel Docente: Recursos -------------------

function renderAdminResourcesTable() {
  const tbody = document.getElementById('adminResourcesTbody');
  if (!tbody) return;

  const resources = getStoredResources();
  tbody.innerHTML = resources.map(r => {
    const statusBadge = r.publishStatus === 'draft'
      ? `<span class="badge" style="background:#F3F4F6; color:#4B5563; font-weight:800; padding:0.25rem 0.55rem; border-radius:6px; font-size:0.75rem; border:1px solid #D1D5DB;">⚪ Borrador</span>`
      : `<span class="badge" style="background:#ECFDF5; color:#065F46; font-weight:800; padding:0.25rem 0.55rem; border-radius:6px; font-size:0.75rem; border:1px solid #A7F3D0;">🟢 Publicado</span>`;

    const toggleBtn = r.publishStatus === 'draft'
      ? `<button class="btn-action-sm" style="background:#205A65; color:#FFF;" onclick="toggleResourcePublishStatus('${r.id}')" title="Publicar recurso en la web">🚀 Publicar</button>`
      : `<button class="btn-action-sm" onclick="toggleResourcePublishStatus('${r.id}')" title="Despublicar recurso (pasar a borrador)">👁️‍🗨️ Despublicar</button>`;

    return `
    <tr>
      <td>
        <strong>${escapeHTML(r.title)}</strong>
        <div style="font-size:0.82rem; color:var(--text-muted);">${r.format} • ${r.software || ''}</div>
      </td>
      <td><span class="post-cat-badge">${r.categoryLabel || RESOURCE_CATEGORY_LABELS[r.category] || r.category}</span></td>
      <td>${statusBadge}</td>
      <td>${r.date || '-'}</td>
      <td style="text-align:right;">
        <div class="admin-table-actions" style="display:inline-flex; gap:0.35rem; justify-content:flex-end; align-items:center;">
          ${toggleBtn}
          <button class="btn-action-sm" onclick="editResourceFromAdmin('${r.id}')" title="Modificar este recurso">✏️ Modificar</button>
          <button class="btn-action-sm btn-danger" onclick="deleteResourceFromAdmin('${r.id}')" title="Eliminar definitivamente de Supabase">🗑️ Eliminar</button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

function prepareNewResource() {
  try {
    const form = document.getElementById('resourceEditorForm');
    if (form) form.reset();
    const idIn = document.getElementById('editResourceId');
    if (idIn) idIn.value = '';
    const banner = document.getElementById('editingResourceAlertBanner');
    if (banner) banner.style.display = 'none';
    const previewBox = document.getElementById('boxVideoPreviewRecurso');
    if (previewBox) previewBox.style.display = 'none';
    const iframeBox = document.getElementById('iframeVideoContainer');
    if (iframeBox) iframeBox.innerHTML = '';

    const radioInmed = document.getElementById('r_pub_inmediata');
    if (radioInmed) radioInmed.checked = true;
    const wrapProg = document.getElementById('wrap_r_fecha_publicacion');
    if (wrapProg) wrapProg.style.display = 'none';
    const fechaIn = document.getElementById('r_fecha_publicacion');
    if (fechaIn) fechaIn.value = '';

    const btnSubmit = document.getElementById('btnSubmitResourceText');
    if (btnSubmit) btnSubmit.innerHTML = '💾 Guardar y Sincronizar';

    const catSelect = document.getElementById('editResourceCategory');
    if (catSelect) catSelect.value = 'videos';
    if (typeof onResourceCategoryChange === 'function') {
      try { onResourceCategoryChange('videos'); } catch (e) {}
    }
  } catch (err) {
    console.warn('prepareNewResource error:', err);
  }

  if (typeof cambiarModulo === 'function') {
    cambiarModulo('recurso_editor');
  } else if (typeof switchAdminTab === 'function') {
    switchAdminTab('resource-editor');
  }
}

function editResourceFromAdmin(resId) {
  const resources = getStoredResources();
  const res = resources.find(r => r.id === resId);
  if (!res) return;

  document.getElementById('editResourceId').value = res.id;
  document.getElementById('editResourceTitle').value = res.title;
  document.getElementById('editResourceCategory').value = res.category;
  const licSelect = document.getElementById('editResourceLicense');
  if (licSelect) licSelect.value = res.licenseType || (res.category === 'imagenes' || res.category === 'videos' ? 'free' : 'cc-by');
  document.getElementById('editResourceFormat').value = res.format || '';
  document.getElementById('editResourceSoftware').value = res.software || '';
  document.getElementById('editResourceUrl').value = res.url || '';
  document.getElementById('editResourceDesc').value = res.description || '';
  document.getElementById('editResourceIcon').value = res.previewIcon || (res.category === 'videos' ? '🎥' : '📁');
  document.getElementById('editResourceColor').value = res.previewColor || (res.category === 'videos' ? '#205A65' : '#7E569B');

  // Programación de fecha y hora
  const isScheduled = res.status === 'scheduled' || !!res.scheduledDate || !!res.scheduledAt;
  const radioProgR = document.getElementById('r_pub_programada');
  const radioInmedR = document.getElementById('r_pub_inmediata');
  const wrapProgR = document.getElementById('wrap_r_fecha_publicacion');
  const inputProgR = document.getElementById('r_fecha_publicacion');

  const modeRadios = document.getElementsByName('resourcePublishMode');
  const scheduleWrap = document.getElementById('resourceScheduleDateWrap');
  const scheduleDateTimeInput = document.getElementById('editResourceScheduleDateTime');

  let isoVal = res.fecha_publicacion || res.scheduledAt || '';
  if (!isoVal && res.scheduledDate) {
    isoVal = `${res.scheduledDate}T${res.scheduledTime || '15:00'}`;
  }

  if (isScheduled) {
    if (radioProgR) radioProgR.checked = true;
    if (wrapProgR) wrapProgR.style.display = 'block';
    if (inputProgR) inputProgR.value = isoVal;

    if (modeRadios.length) {
      modeRadios.forEach(r => { if (r.value === 'scheduled') r.checked = true; });
    }
    if (scheduleWrap) scheduleWrap.style.display = 'block';
    if (scheduleDateTimeInput) scheduleDateTimeInput.value = isoVal;
  } else {
    if (radioInmedR) radioInmedR.checked = true;
    if (wrapProgR) wrapProgR.style.display = 'none';

    if (modeRadios.length) {
      modeRadios.forEach(r => { if (r.value === 'now') r.checked = true; });
    }
    if (scheduleWrap) scheduleWrap.style.display = 'none';
  }

  // Previsualización de video en vivo
  actualizarPreviewVideoRecurso(res.url);

  const alertBanner = document.getElementById('editingResourceAlertBanner');
  const titleDisplay = document.getElementById('editingResourceTitleDisplay');
  const btnSubmit = document.getElementById('btnSubmitResourceText');
  if (alertBanner && titleDisplay) {
    titleDisplay.textContent = `"${res.title}"`;
    alertBanner.style.display = 'flex';
  }
  if (btnSubmit) {
    btnSubmit.innerHTML = '💾 Guardar Modificaciones al Recurso';
  }

  switchAdminTab('resource-editor');
}

async function toggleResourcePublishStatus(resId) {
  let resources = getStoredResources();
  const res = resources.find(r => r.id === resId);
  if (!res) return;

  const newStatus = res.publishStatus === 'draft' ? 'published' : 'draft';
  res.publishStatus = newStatus;

  try {
    if (typeof showToastNotification === 'function') {
      showToastNotification(newStatus === 'published' ? 'Publicando recurso...' : 'Despublicando recurso...', '⏳');
    }

    saveResources(resources);
    renderAdminResourcesTable();
    if (typeof renderResources === 'function') {
      renderResources(typeof currentResourceCategory !== 'undefined' ? currentResourceCategory : 'all');
      if (document.getElementById('homeResourcesContainer')) {
        renderResources('all', '', 'homeResourcesContainer');
      }
    }

    if (typeof showToastNotification === 'function') {
      showToastNotification(newStatus === 'published' ? 'Recurso publicado en la web.' : 'Recurso despublicado (guardado como borrador).', newStatus === 'published' ? '🟢' : '⚪');
    }
  } catch (err) {
    console.error('Error al cambiar estado de publicación del recurso:', err);
    alert('❌ No se pudo actualizar el recurso: ' + (err.message || err));
  }
}

async function deleteResourceFromAdmin(resId) {
  const resources = getStoredResources();
  const target = resources.find(r => r.id === resId);
  const title = target ? target.title : resId;

  if (!confirm(`¿Deseás quitar de este navegador el recurso "${title}"? La base pública no se modifica desde el sitio web.`)) {
    return;
  }

  try {
    const updated = getStoredResources().filter(r => r.id !== resId);
    saveResources(updated);

    renderAdminResourcesTable();
    if (typeof renderResources === 'function') {
      renderResources(typeof currentResourceCategory !== 'undefined' ? currentResourceCategory : 'all');
      if (document.getElementById('homeResourcesContainer')) {
        renderResources('all', '', 'homeResourcesContainer');
      }
    }

    if (typeof showToastNotification === 'function') {
      showToastNotification('Recurso quitado de este navegador.', '🗑️');
    }
  } catch (err) {
    console.error('Error al eliminar recurso:', err);
    alert('❌ No se pudo quitar el recurso: ' + (err.message || err));
  }
}

function saveResourceFromAdmin() {
  const idInput = document.getElementById('editResourceId');
  const title = document.getElementById('editResourceTitle').value.trim();
  const category = document.getElementById('editResourceCategory').value;
  const licSelect = document.getElementById('editResourceLicense');
  const licenseType = licSelect ? licSelect.value : (category === 'imagenes' || category === 'videos' ? 'free' : 'cc-by');
  const format = document.getElementById('editResourceFormat').value.trim();
  const software = document.getElementById('editResourceSoftware').value.trim();
  const url = document.getElementById('editResourceUrl').value.trim();
  const description = document.getElementById('editResourceDesc').value.trim();
  const icon = document.getElementById('editResourceIcon').value.trim() || (category === 'videos' ? '🎥' : '📁');
  const color = document.getElementById('editResourceColor').value || (category === 'videos' ? '#205A65' : '#7E569B');

  if (!title || !url || !description) {
    alert('Por favor completá los campos obligatorios (*)');
    return;
  }

  // Programación de fecha y hora
  const radioProgR = document.getElementById('r_pub_programada');
  const modeRadios = document.getElementsByName('resourcePublishMode');
  let isScheduled = false;
  if (radioProgR && radioProgR.checked) {
    isScheduled = true;
  } else {
    for (const r of modeRadios) {
      if (r.checked && r.value === 'scheduled') isScheduled = true;
    }
  }

  const inputProgR = document.getElementById('r_fecha_publicacion');
  const scheduleDateTimeInput = document.getElementById('editResourceScheduleDateTime');
  let scheduledAt = '';
  if (isScheduled) {
    if (inputProgR && inputProgR.value) scheduledAt = inputProgR.value;
    else if (scheduleDateTimeInput && scheduleDateTimeInput.value) scheduledAt = scheduleDateTimeInput.value;
  }

  let scheduledDate = '';
  let scheduledTime = '15:00';

  if (scheduledAt) {
    const parts = scheduledAt.split('T');
    scheduledDate = parts[0];
    scheduledTime = parts[1] || '15:00';
  } else if (isScheduled) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    scheduledDate = tomorrow.toISOString().split('T')[0];
    scheduledAt = `${scheduledDate}T15:00`;
  }

  const fecha_publicacion = isScheduled ? scheduledAt : new Date().toISOString();
  const displayDate = isScheduled 
    ? formatISODateToFriendly(scheduledDate)
    : new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

  let resources = getStoredResources();
  const isEditing = idInput.value !== '';

  if (isEditing) {
    const idx = resources.findIndex(r => r.id === idInput.value);
    if (idx !== -1) {
      resources[idx] = {
        ...resources[idx],
        title,
        category,
        categoryLabel: RESOURCE_CATEGORY_LABELS[category] || category,
        licenseType,
        license: licenseType === 'free' ? 'Uso 100% Libre y Gratuito' : 'CC BY 4.0 (Uso libre y gratuito citando a la autora)',
        format,
        software,
        url,
        description,
        previewIcon: icon,
        previewColor: color,
        status: isScheduled ? 'scheduled' : 'published',
        scheduledDate,
        scheduledTime,
        scheduledAt,
        fecha_publicacion,
        date: displayDate
      };
    }
  } else {
    const newRes = {
      id: 'res-' + Date.now(),
      title,
      category,
      categoryLabel: RESOURCE_CATEGORY_LABELS[category] || category,
      licenseType,
      license: licenseType === 'free' ? 'Uso 100% Libre y Gratuito' : 'CC BY 4.0 (Uso libre y gratuito citando a la autora)',
      format,
      formatIcon: icon,
      software,
      description,
      previewIcon: icon,
      previewColor: color,
      url,
      fileType: url.includes('canva.com') ? 'link' : (category === 'videos' ? 'video' : 'download'),
      authorCredit: 'Prof. Rosana (TecnoEduca)',
      status: isScheduled ? 'scheduled' : 'published',
      scheduledDate,
      scheduledTime,
      scheduledAt,
      fecha_publicacion,
      date: displayDate
    };
    resources.unshift(newRes);
  }

  saveResources(resources);
  renderAdminResourcesTable();
  renderResources(currentResourceCategory);
  renderEditorialCalendar();

  if (isScheduled) {
    alert(`⏰ ¡Lanzamiento agendado para el ${displayDate} a las ${scheduledTime} hs!\nSe agregó a tu Calendario Editorial.`);
  } else {
    alert(isEditing ? '✅ ¡Recurso actualizado con éxito!' : '✅ ¡Nuevo recurso publicado con éxito!');
  }
  switchAdminTab(isScheduled ? 'calendar' : 'resources');
}

// ===================================================================
// CALENDARIO EDITORIAL Y PLANIFICADOR DE PUBLICACIONES
// ===================================================================

let currentCalendarYear = (new Date()).getFullYear();
let currentCalendarMonth = (new Date()).getMonth(); // 0-indexed
let selectedCalendarDay = {
  year: (new Date()).getFullYear(),
  month: (new Date()).getMonth(),
  day: (new Date()).getDate()
};

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAY_NAMES_ES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

function prevCalendarMonth() {
  currentCalendarMonth--;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  }
  renderEditorialCalendar();
}

function nextCalendarMonth() {
  currentCalendarMonth++;
  if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderEditorialCalendar();
}

function jumpCalendarToday() {
  const now = new Date();
  currentCalendarYear = now.getFullYear();
  currentCalendarMonth = now.getMonth();
  selectCalendarDay(now.getFullYear(), now.getMonth(), now.getDate());
}

function selectCalendarDay(year, month, day) {
  selectedCalendarDay = { year, month, day };
  
  // Si el día seleccionado es de otro mes, navegar a ese mes
  if (currentCalendarYear !== year || currentCalendarMonth !== month) {
    currentCalendarYear = year;
    currentCalendarMonth = month;
  }
  renderEditorialCalendar();
  updateDayInspectorPanel();
}

function updateDayInspectorPanel() {
  const selectedTextEl = document.getElementById('calSelectedDayText');
  const itemsListEl = document.getElementById('calSelectedDayItemsList');
  const dateInput = document.getElementById('quickCalDate');

  if (!selectedTextEl && !itemsListEl) return;

  const y = selectedCalendarDay.year;
  const m = selectedCalendarDay.month;
  const d = selectedCalendarDay.day;

  const dateObj = new Date(y, m, d);
  const weekdayName = WEEKDAY_NAMES_ES[dateObj.getDay()];
  const monthName = MONTH_NAMES_ES[m];

  if (selectedTextEl) {
    selectedTextEl.textContent = `${weekdayName} ${d} de ${monthName} de ${y}`;
  }

  const yyyy = y;
  const mm = String(m + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  if (dateInput) {
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  if (itemsListEl) {
    const rawArticles = getStoredArticles();
    const rawBooks = getStoredBooks();
    const rawResources = getStoredResources();

    let allItems = [];
    allItems.push(...rawArticles.map(a => ({
      id: a.id,
      title: a.title,
      type: 'article',
      category: a.category,
      categoryClass: getCategoryClass(a.category),
      isScheduled: a.publishStatus === 'scheduled',
      scheduledTime: a.scheduledTime || '18:00',
      date: a.date,
      parsedDate: parseItemCalendarDate(a)
    })));

    allItems.push(...rawBooks.map(b => ({
      id: b.id,
      title: b.title,
      type: 'book',
      category: b.category,
      categoryClass: 'cat-mate',
      isScheduled: false,
      date: b.date,
      parsedDate: parseItemCalendarDate(b)
    })));

    allItems.push(...rawResources.map(r => ({
      id: r.id,
      title: r.title,
      type: 'resource',
      category: r.categoryLabel || r.category,
      categoryClass: 'cat-quimica',
      isScheduled: false,
      date: r.date,
      parsedDate: parseItemCalendarDate(r)
    })));

    const dayItems = allItems.filter(item => {
      return item.parsedDate &&
        item.parsedDate.year === y &&
        item.parsedDate.month === m &&
        item.parsedDate.day === d;
    });

    if (dayItems.length === 0) {
      itemsListEl.innerHTML = `
        <div style="text-align:center; padding:1.2rem 0.5rem; color:var(--text-muted); font-size:0.85rem; background:#FAF7FC; border-radius:8px; border:1px dashed #E2D9EC;">
          <span>🌱 Sin publicaciones programadas para este día. Podés programar una completando el formulario de abajo.</span>
        </div>
      `;
    } else {
      itemsListEl.innerHTML = dayItems.map(item => {
        const typeIcon = item.type === 'book' ? '📖' : (item.type === 'resource' ? '🎨' : '✍️');
        const statusBadge = item.isScheduled 
          ? `<span style="background:#FEF3C7; color:#92400E; font-size:0.75rem; font-weight:800; padding:0.2rem 0.45rem; border-radius:4px;">⏰ ${item.scheduledTime || '18:00'} hs</span>`
          : `<span style="background:#ECFDF5; color:#065F46; font-size:0.75rem; font-weight:800; padding:0.2rem 0.45rem; border-radius:4px;">🟢 Publicado</span>`;

        return `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; padding:0.6rem 0.75rem; background:#FFFFFF; border-radius:8px; border:1px solid #ECE6F5; margin-bottom:0.4rem;">
            <div style="overflow:hidden;">
              <div style="font-weight:700; font-size:0.88rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${typeIcon} ${escapeHTML(item.title)}
              </div>
              <div style="display:flex; align-items:center; gap:0.4rem; margin-top:0.2rem;">
                <span class="post-cat-badge ${item.categoryClass}" style="font-size:0.72rem; padding:0.1rem 0.4rem;">${item.category}</span>
                ${statusBadge}
              </div>
            </div>
            <div style="display:flex; gap:0.25rem; flex-shrink:0;">
              ${item.isScheduled ? `<button class="btn-action-icon" onclick="publishScheduledArticleNow('${item.id}')" title="Publicar de inmediato">🚀</button>` : ''}
              <button class="btn-action-icon" onclick="editArticleFromAdmin('${item.id}')" title="Modificar">✏️</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function onQuickCalDateChange(newVal) {
  if (!newVal) return;
  const parts = newVal.split('-').map(Number);
  if (parts.length === 3) {
    selectCalendarDay(parts[0], parts[1] - 1, parts[2]);
  }
}

function saveQuickScheduledArticle() {
  const titleInput = document.getElementById('quickCalTitle');
  const catInput = document.getElementById('quickCalCategory');
  const dateInput = document.getElementById('quickCalDate');
  const timeInput = document.getElementById('quickCalTime');

  const title = (titleInput ? titleInput.value : '').trim();
  const category = catInput ? catInput.value : 'Matemática';
  const scheduledDate = dateInput ? dateInput.value : '';
  const scheduledTime = (timeInput && timeInput.value) ? timeInput.value : '18:00';

  if (!title) {
    alert('Por favor ingresá un título o tema para la publicación.');
    if (titleInput) titleInput.focus();
    return;
  }

  if (!scheduledDate) {
    alert('Por favor elegí una fecha para programar la publicación.');
    if (dateInput) dateInput.focus();
    return;
  }

  const displayDate = formatISODateToFriendly(scheduledDate);
  const newPost = {
    id: 'post-' + Date.now(),
    title,
    category,
    date: displayDate,
    readTime: '4 min de lectura',
    excerpt: `Publicación programada para el ${displayDate} a las ${scheduledTime} hs.`,
    body: `<p>Contenido programado para la fecha ${displayDate}. Podés ampliar y editar este artículo en cualquier momento con el redactor.</p>`,
    publishStatus: 'scheduled',
    scheduledDate,
    scheduledTime,
    scheduledAt: `${scheduledDate}T${scheduledTime}:00`,
    comments: []
  };

  let articles = getStoredArticles();
  articles.unshift(newPost);
  saveArticles(articles);

  if (titleInput) titleInput.value = '';

  const [y, m, d] = scheduledDate.split('-').map(Number);
  selectCalendarDay(y, m - 1, d);
  renderAdminArticlesTable();
  renderBlogPosts('all');

  alert(`🎉 ¡Publicación programada con éxito!\n\n📌 Título: "${title}"\n📅 Fecha: ${displayDate}\n⏰ Horario: ${scheduledTime} hs\n\nYa figura en el calendario y en la cola de publicaciones.`);
}

function openFullEditorWithSelectedDate() {
  const dateInput = document.getElementById('quickCalDate');
  const timeInput = document.getElementById('quickCalTime');
  const titleInput = document.getElementById('quickCalTitle');
  const catInput = document.getElementById('quickCalCategory');

  const scheduledDate = dateInput ? dateInput.value : '';
  const scheduledTime = timeInput ? timeInput.value : '18:00';
  const title = titleInput ? titleInput.value.trim() : '';
  const category = catInput ? catInput.value : 'Matemática';

  switchAdminTab('editor');

  const modeScheduled = document.getElementById('modeScheduled');
  if (modeScheduled) {
    modeScheduled.checked = true;
    toggleScheduleFields();
  }
  const editDate = document.getElementById('editScheduleDate');
  if (editDate && scheduledDate) editDate.value = scheduledDate;
  const editTime = document.getElementById('editScheduleTime');
  if (editTime && scheduledTime) editTime.value = scheduledTime;
  const editTitle = document.getElementById('editTitle');
  if (editTitle && title) editTitle.value = title;
  const editCategory = document.getElementById('editCategory');
  if (editCategory && category) editCategory.value = category;

  if (editTitle) editTitle.focus();
}

function prepareScheduledArticleFromCalendar() {
  openFullEditorWithSelectedDate();
}

function prepareScheduledArticleForDate(year, month, day) {
  selectCalendarDay(year, month, day);
}

// ===================================================================
// UTILIDADES MULTIMEDIA & REPRODUCTOR SMART VIDEO (SIN SALIR DE LA WEB)
// ===================================================================

function extraerYouTubeId(url) {
  if (!url) return null;
  let cleanUrl = String(url).trim();
  if (cleanUrl.includes('<iframe')) {
    const m = cleanUrl.match(/src=["']([^"']+)["']/i);
    if (m) cleanUrl = m[1];
  }
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = cleanUrl.match(regex);
  if (match && match[1]) return match[1];

  if (cleanUrl.includes('youtube.com/watch?v=')) {
    return cleanUrl.split('v=')[1].split('&')[0].split('?')[0];
  } else if (cleanUrl.includes('youtu.be/')) {
    return cleanUrl.split('youtu.be/')[1].split('?')[0].split('&')[0];
  } else if (cleanUrl.includes('youtube.com/shorts/')) {
    return cleanUrl.split('shorts/')[1].split('?')[0].split('&')[0];
  }
  return null;
}

function generarIframeVideo(url, caption = 'Video Explicativo') {
  if (!url) return '';
  const ytId = extraerYouTubeId(url);
  if (ytId) {
    return `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1" title="${escapeHTML(caption)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none; display:block;"></iframe>`;
  }
  if (url.includes('vimeo.com/')) {
    const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
    return `<iframe src="https://player.vimeo.com/video/${vimeoId}" title="${escapeHTML(caption)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none; display:block;"></iframe>`;
  }
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return `<video controls style="width:100%; height:100%; background:#000; border:none; display:block;"><source src="${url}" type="video/mp4">Tu navegador no soporta video HTML5.</video>`;
  }
  return '';
}

function actualizarPreviewVideoRecurso(url) {
  const box = document.getElementById('boxVideoPreviewRecurso');
  const container = document.getElementById('iframeVideoContainer');
  if (!box || !container) return;

  const html = generarIframeVideo(url);
  if (html) {
    container.innerHTML = html;
    box.style.display = 'block';
  } else {
    container.innerHTML = '';
    box.style.display = 'none';
  }
}

function toggleArticleScheduleInput(val) {
  const wrap = document.getElementById('articleScheduleDateWrap');
  const input = document.getElementById('editArticleScheduleDateTime');
  const btn = document.getElementById('btnSubmitArticleText') || document.getElementById('btnSubmitArticle');
  if (!wrap) return;

  if (val === 'scheduled') {
    wrap.style.display = 'block';
    if (input && !input.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      const isoLocal = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      input.value = isoLocal;
    }
    if (btn) btn.innerHTML = '⏰ Programar Publicación en el Calendario';
  } else {
    wrap.style.display = 'none';
    if (btn) btn.innerHTML = '💾 Publicar en el Blog';
  }
}

function toggleResourceScheduleInput(val) {
  const wrap = document.getElementById('resourceScheduleDateWrap');
  const input = document.getElementById('editResourceScheduleDateTime');
  const btn = document.getElementById('btnSubmitResourceText');
  if (!wrap) return;

  if (val === 'scheduled') {
    wrap.style.display = 'block';
    if (input && !input.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(15, 0, 0, 0);
      const isoLocal = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      input.value = isoLocal;
    }
    if (btn) btn.innerHTML = '⏰ Programar Lanzamiento en el Calendario';
  } else {
    wrap.style.display = 'none';
    if (btn) btn.innerHTML = '💾 Guardar y Sincronizar';
  }
}

function onResourceCategoryChange(cat) {
  const iconInput = document.getElementById('editResourceIcon');
  const colorInput = document.getElementById('editResourceColor');
  const formatInput = document.getElementById('editResourceFormat');
  const softwareInput = document.getElementById('editResourceSoftware');
  const lblUrl = document.getElementById('lblResourceUrl');
  const helpUrl = document.getElementById('helpResourceUrl');
  const urlInput = document.getElementById('editResourceUrl');

  if (cat === 'videos') {
    if (iconInput) iconInput.value = '🎥';
    if (colorInput) colorInput.value = '#205A65';
    if (formatInput) formatInput.placeholder = 'Ej: Video Clase 1080p HD (15 min)';
    if (softwareInput) softwareInput.placeholder = 'Ej: YouTube HD / GeoGebra / Canva';
    if (lblUrl) lblUrl.textContent = 'Enlace del Video (YouTube / Vimeo / MP4) *';
    if (helpUrl) helpUrl.textContent = 'Soporta enlaces de YouTube, Shorts, Vimeo o archivos MP4. Se reproducirá incrustado dentro de la web sin salir hacia YouTube.';
    if (urlInput) urlInput.placeholder = 'https://www.youtube.com/watch?v=... o https://youtu.be/...';
  } else if (cat === 'web') {
    if (iconInput) iconInput.value = '🌐';
    if (colorInput) colorInput.value = '#398897';
    if (formatInput) formatInput.placeholder = 'Ej: Sitio Web Responsivo / Tienda Online';
    if (softwareInput) softwareInput.placeholder = 'Ej: HTML5, CSS3, JavaScript, Supabase';
    if (lblUrl) lblUrl.textContent = 'Enlace del Sitio Web o Proyecto *';
    if (helpUrl) helpUrl.textContent = 'URL donde está alojado el proyecto web para que los clientes puedan visitarlo.';
    if (urlInput) urlInput.placeholder = 'https://mi-sitio-o-cliente.com';
  } else if (cat === 'interactivas') {
    if (iconInput) iconInput.value = '📱';
    if (colorInput) colorInput.value = '#276E7B';
    if (formatInput) formatInput.placeholder = 'Ej: Simulador Interactivo Web';
    if (softwareInput) softwareInput.placeholder = 'Ej: Canvas / GeoGebra / PhET / Python';
    if (lblUrl) lblUrl.textContent = 'Enlace de la Aplicación o Simulador *';
    if (helpUrl) helpUrl.textContent = 'Enlace de acceso a la aplicación o simulador interactivo.';
    if (urlInput) urlInput.placeholder = 'https://...';
  } else if (cat === 'plantillas') {
    if (iconInput) iconInput.value = '🎨';
    if (colorInput) colorInput.value = '#E8A838';
    if (formatInput) formatInput.placeholder = 'Ej: Plantilla Editable en Canva';
    if (softwareInput) softwareInput.placeholder = 'Ej: Canva Free / Canva Pro';
    if (lblUrl) lblUrl.textContent = 'Enlace para Usar la Plantilla Canva *';
    if (helpUrl) helpUrl.textContent = 'Enlace oficial para compartir la plantilla de Canva.';
    if (urlInput) urlInput.placeholder = 'https://www.canva.com/design/...';
  } else if (cat === 'archivos') {
    if (iconInput) iconInput.value = '📁';
    if (colorInput) colorInput.value = '#2E7D32';
    if (formatInput) formatInput.placeholder = 'Ej: Documento PDF Imprimible (Guía de Ejercicios)';
    if (softwareInput) softwareInput.placeholder = 'Ej: PDF / Word / Excel';
    if (lblUrl) lblUrl.textContent = 'Enlace de Descarga del Archivo / Guía *';
    if (helpUrl) helpUrl.textContent = 'Enlace a Google Drive, OneDrive o descarga directa.';
    if (urlInput) urlInput.placeholder = 'https://drive.google.com/...';
  } else {
    if (iconInput) iconInput.value = '🖼️';
    if (colorInput) colorInput.value = '#7E569B';
    if (formatInput) formatInput.placeholder = 'Ej: PNG Transparente + JPG HD';
    if (softwareInput) softwareInput.placeholder = 'Ej: Illustrator / Photoshop / Canva';
    if (lblUrl) lblUrl.textContent = 'Enlace de la Imagen o Banco *';
    if (helpUrl) helpUrl.textContent = 'Enlace al paquete de imágenes o descarga.';
    if (urlInput) urlInput.placeholder = 'https://...';
  }

  if (urlInput) actualizarPreviewVideoRecurso(urlInput.value);
}



// ===================================================================
// CALENDARIO EDITORIAL & PLANIFICADOR VISUAL DE PUBLICACIONES
// ===================================================================

let calFechaActual = new Date();

function cambiarMesCalendario(delta) {
  calFechaActual.setMonth(calFechaActual.getMonth() + delta);
  currentCalendarYear = calFechaActual.getFullYear();
  currentCalendarMonth = calFechaActual.getMonth();
  renderizarCalendarioEditorial();
}

function irAlMesActual() {
  calFechaActual = new Date();
  currentCalendarYear = calFechaActual.getFullYear();
  currentCalendarMonth = calFechaActual.getMonth();
  renderizarCalendarioEditorial();
}

function editarItemDesdeCalendario(tipo, id) {
  if (tipo === 'article') {
    editArticleFromAdmin(id);
    cambiarModulo('editor');
  } else if (tipo === 'resource') {
    editResourceFromAdmin(id);
    cambiarModulo('recurso_editor');
  }
}

function parseItemCalendarDate(item) {
  if (!item) return null;
  // 1. Si tiene fecha_publicacion
  if (item.fecha_publicacion) {
    const str = String(item.fecha_publicacion);
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const parts = str.split('T')[0].split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return { year: y, month: m, day: d };
    }
  }
  // 2. Si tiene scheduledDate en formato YYYY-MM-DD
  if (item.scheduledDate && /^\d{4}-\d{2}-\d{2}$/.test(item.scheduledDate)) {
    const [y, m, d] = item.scheduledDate.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  }
  // 3. Si tiene date en formato 'DD Mes AAAA' (ej: '18 Oct 2026')
  if (item.date && typeof item.date === 'string') {
    const parts = item.date.trim().split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monStr = parts[1].toLowerCase().slice(0, 3);
      const year = parseInt(parts[2], 10);
      const monthsMap = {
        ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
        jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
      };
      if (!isNaN(day) && monthsMap[monStr] !== undefined && !isNaN(year)) {
        return { year, month: monthsMap[monStr], day };
      }
    }
  }
  return null;
}

function publishScheduledArticleNow(id) {
  let articles = getStoredArticles();
  const a = articles.find(x => x.id === id);
  if (!a) return;
  a.publishStatus = 'published';
  a.date = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  saveArticles(articles);
  alert(`🚀 ¡"${a.title}" ha sido publicado en el blog exitosamente!`);
  renderAdminArticlesTable();
  renderizarCalendarioEditorial();
  renderBlogPosts('all');
}

function deleteScheduledArticle(id) {
  if (!confirm('¿Deseás cancelar y eliminar esta publicación programada?')) return;
  let articles = getStoredArticles();
  articles = articles.filter(a => a.id !== id);
  saveArticles(articles);
  renderAdminArticlesTable();
  renderizarCalendarioEditorial();
}

function publishScheduledResourceNow(id) {
  let resources = getStoredResources();
  const r = resources.find(x => x.id === id);
  if (!r) return;
  r.status = 'published';
  r.date = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  saveResources(resources);
  alert(`🚀 ¡"${r.title}" ha sido publicado en los recursos exitosamente!`);
  renderAdminResourcesTable();
  renderizarCalendarioEditorial();
  renderResources(currentResourceCategory);
}

function renderizarCalendarioEditorial() {
  const contenedorGrilla = document.getElementById('contenedorGrillaCalendario');
  const tituloMes = document.getElementById('calMesAnioTitulo') || document.getElementById('calendarCurrentMonthDisplay') || document.getElementById('calendarMonthTitle');
  const contenedorAgenda = document.getElementById('listaAgendaProgramados');
  const agendaCounter = document.getElementById('agendaTotalCounter');

  const anio = calFechaActual.getFullYear();
  const mes = calFechaActual.getMonth();

  if (tituloMes) {
    tituloMes.innerText = `${MONTH_NAMES_ES[mes]} ${anio}`;
  }

  // Recolectar todos los contenidos del ecosistema
  const rawArticles = getStoredArticles();
  const rawResources = getStoredResources();

  const todosLosItems = [
    ...rawArticles.map(a => {
      const isSched = a.publishStatus === 'scheduled' || (a.fecha_publicacion && new Date(a.fecha_publicacion) > new Date());
      const fechaPub = a.fecha_publicacion || (a.scheduledDate ? `${a.scheduledDate}T${a.scheduledTime || '18:00'}` : '');
      const hora = a.scheduledTime || (fechaPub && fechaPub.includes('T') ? fechaPub.split('T')[1].substring(0, 5) : '');
      return {
        id: a.id,
        titulo: a.title,
        tipo: 'article',
        tipoLabel: '✍️ Blog',
        color: '#7E569B',
        isScheduled: isSched,
        fecha_publicacion: fechaPub,
        hora: hora,
        category: a.category,
        parsedDate: parseItemCalendarDate(a)
      };
    }),
    ...rawResources.map(r => {
      const isSched = r.status === 'scheduled' || (r.fecha_publicacion && new Date(r.fecha_publicacion) > new Date());
      const fechaPub = r.fecha_publicacion || (r.scheduledDate ? `${r.scheduledDate}T${r.scheduledTime || '15:00'}` : '');
      const hora = r.scheduledTime || (fechaPub && fechaPub.includes('T') ? fechaPub.split('T')[1].substring(0, 5) : '');
      let label = '📁 Guía';
      let col = '#2E7D32';

      if (r.category === 'videos' || (r.url && (r.url.includes('youtube.com') || r.url.includes('youtu.be') || r.url.includes('vimeo.com')))) {
        label = '🎥 Video';
        col = '#205A65';
      } else if (r.category === 'web') {
        label = '🌐 Web';
        col = '#398897';
      } else if (r.category === 'plantillas') {
        label = '🎨 Canva';
        col = '#E8A838';
      } else if (r.category === 'interactivas') {
        label = '📱 App';
        col = '#276E7B';
      } else if (r.category === 'imagenes') {
        label = '🖼️ Imagen';
        col = '#7E569B';
      }

      return {
        id: r.id,
        titulo: r.title,
        tipo: 'resource',
        tipoLabel: label,
        color: col,
        isScheduled: isSched,
        fecha_publicacion: fechaPub,
        hora: hora,
        category: r.category,
        parsedDate: parseItemCalendarDate(r)
      };
    })
  ];

  if (contenedorGrilla) {
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const totalDias = ultimoDia.getDate();

    let diaSemanaInicio = primerDia.getDay() - 1;
    if (diaSemanaInicio === -1) diaSemanaInicio = 6; // Domingo al final

    let html = `
      <table class="cal-tabla">
        <thead>
          <tr>
            <th>Lun</th>
            <th>Mar</th>
            <th>Mié</th>
            <th>Jue</th>
            <th>Vie</th>
            <th>Sáb</th>
            <th>Dom</th>
          </tr>
        </thead>
        <tbody>
          <tr>
    `;

    for (let i = 0; i < diaSemanaInicio; i++) {
      html += '<td class="cal-celda cal-celda-vacia"></td>';
    }

    const hoy = new Date();
    let colActual = diaSemanaInicio;

    for (let dia = 1; dia <= totalDias; dia++) {
      if (colActual === 7) {
        html += '</tr><tr>';
        colActual = 0;
      }

      const fechaDiaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const esHoy = (hoy.getFullYear() === anio && hoy.getMonth() === mes && hoy.getDate() === dia);

      const eventosDia = todosLosItems.filter(item => {
        if (item.fecha_publicacion && item.fecha_publicacion.startsWith(fechaDiaStr)) return true;
        if (item.parsedDate && item.parsedDate.year === anio && item.parsedDate.month === mes && item.parsedDate.day === dia) return true;
        return false;
      });

      html += `
        <td class="cal-celda ${esHoy ? 'cal-celda-hoy' : ''}">
          <div class="cal-dia-num">
            <span>${dia}</span>
            ${esHoy ? '<span class="cal-badge-hoy-tag">Hoy</span>' : ''}
          </div>
          <div class="cal-eventos-lista">
      `;

      eventosDia.forEach(ev => {
        const esFuturo = ev.isScheduled || (ev.fecha_publicacion && new Date(ev.fecha_publicacion) > hoy);
        html += `
          <div class="cal-evento-pill" style="background:${ev.color};" onclick="editarItemDesdeCalendario('${ev.tipo}', '${ev.id}')" title="${ev.tipoLabel}: ${escapeHTML(ev.titulo)} (${esFuturo ? 'Programado ' + (ev.hora || '') : 'Publicado'}) - Clic para ver o editar">
            ${ev.hora ? `<span class="cal-pill-hora">${ev.hora}</span>` : ''}
            <span class="cal-pill-titulo">${escapeHTML(ev.titulo)}</span>
            <span class="cal-pill-estado">${esFuturo ? '⏳' : '✓'}</span>
          </div>
        `;
      });

      html += `
          </div>
        </td>
      `;
      colActual++;
    }

    while (colActual < 7 && colActual !== 0) {
      html += '<td class="cal-celda cal-celda-vacia"></td>';
      colActual++;
    }

    html += `
          </tr>
        </tbody>
      </table>
    `;

    contenedorGrilla.innerHTML = html;
  }

  // Renderizar Lista de Agenda Programada
  if (contenedorAgenda) {
    const hoy = new Date();
    const programadosFuturos = todosLosItems
      .filter(item => item.isScheduled || (item.fecha_publicacion && new Date(item.fecha_publicacion) > hoy))
      .sort((a, b) => {
        const da = a.fecha_publicacion ? new Date(a.fecha_publicacion) : new Date(0);
        const db = b.fecha_publicacion ? new Date(b.fecha_publicacion) : new Date(0);
        return da - db;
      });

    if (agendaCounter) {
      agendaCounter.textContent = `${programadosFuturos.length} ${programadosFuturos.length === 1 ? 'programado' : 'programados'}`;
    }

    if (programadosFuturos.length === 0) {
      contenedorAgenda.innerHTML = `
        <div style="text-align:center; padding:1.8rem; background:#FAF8FE; border-radius:8px; border:1px dashed var(--copper-border); color:var(--text-muted); font-size:0.9rem;">
          <span>🎉 ¡No hay publicaciones pendientes de lanzamiento! Todos tus artículos y recursos están al día.</span>
        </div>
      `;
    } else {
      contenedorAgenda.innerHTML = programadosFuturos.map(item => {
        const fechaLegible = item.fecha_publicacion ? formatISODateToFriendly(item.fecha_publicacion.split('T')[0]) : 'Próximamente';
        return `
          <div class="agenda-item-card" style="border-left-color: ${item.color};">
            <div class="agenda-item-info">
              <h4>${escapeHTML(item.titulo)}</h4>
              <div class="agenda-item-meta">
                <span class="post-cat-badge" style="background:${item.color}; color:#fff;">${item.tipoLabel}</span>
                <span>📅 <strong>${fechaLegible}</strong> a las <strong>${item.hora || '18:00'} hs</strong></span>
                <span style="color:#b78103; font-weight:700;">⏳ Programado</span>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button type="button" class="btn-action-sm" onclick="${item.tipo === 'article' ? `publishScheduledArticleNow('${item.id}')` : `publishScheduledResourceNow('${item.id}')`}" style="background:#205A65; color:#fff;" title="Publicar de inmediato en el sitio">
                🚀 Publicar ya
              </button>
              <button type="button" class="btn-action-sm" onclick="editarItemDesdeCalendario('${item.tipo}', '${item.id}')" title="Modificar fecha u horario">
                ✏️
              </button>
              <button type="button" class="btn-action-sm" onclick="${item.tipo === 'article' ? `deleteScheduledArticle('${item.id}')` : `deleteResourceFromAdmin('${item.id}')`}" style="color:#E0674B;" title="Cancelar y eliminar">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// Función con nombre para hoisting garantizado en todo el ecosistema
function renderEditorialCalendar() {
  return renderizarCalendarioEditorial();
}

// ===================================================================
// PANEL DE ESTADÍSTICAS Y ANALÍTICA (DASHBOARD DOCENTE)
// ===================================================================

function generateSeedAnalytics() {
  return {
    totalVisits: 2840,
    uniqueVisitors: 1290,
    totalReads: 1420,
    whatsappClicks: 168,
    mobileVisits: 1762,
    desktopVisits: 738,
    tabletVisits: 340,
    pageViews: {
      'Inicio & CV': 1164,
      'Blog Educativo': 908,
      'Biblioteca Digital': 512,
      'Banco de Recursos': 256
    },
    history: [
      { label: '13 Oct', visits: 165 },
      { label: '14 Oct', visits: 184 },
      { label: '15 Oct', visits: 210 },
      { label: '16 Oct', visits: 195 },
      { label: '17 Oct', visits: 172 },
      { label: '18 Oct', visits: 245 },
      { label: '19 Oct', visits: 268 },
      { label: '20 Oct', visits: 230 },
      { label: '21 Oct', visits: 198 },
      { label: '22 Oct', visits: 215 },
      { label: '23 Oct', visits: 254 },
      { label: '24 Oct', visits: 278 },
      { label: '25 Oct', visits: 290 },
      { label: '26 Oct', visits: 196 }
    ],
    demographics: {
      genderRoles: [
        { label: '👩 Mujeres / Madres de Familia', count: 1476, pct: 52, color: 'fill-purple' },
        { label: '👨 Hombres / Padres de Familia', count: 682, pct: 24, color: 'fill-teal' },
        { label: '👧 Niñas y Adolescentes (Alumnas)', count: 398, pct: 14, color: 'fill-pink' },
        { label: '👦 Niños y Adolescentes (Alumnos)', count: 284, pct: 10, color: 'fill-amber' }
      ],
      ageRanges: [
        { label: '🎒 6 a 12 años (Nivel Primario / Familias)', count: 682, pct: 24, color: 'fill-teal' },
        { label: '📚 13 a 17 años (Secundaria / Apoyo y Exámenes)', count: 1079, pct: 38, color: 'fill-purple' },
        { label: '🎓 18 a 25 años (CBC / Terciario / Universidad)', count: 511, pct: 18, color: 'fill-green' },
        { label: '💼 26 a 45 años (Padres y Formación Continua)', count: 454, pct: 16, color: 'fill-amber' },
        { label: '📖 +45 años (Docentes y Familias)', count: 114, pct: 4, color: 'fill-blue' }
      ]
    },
    geography: {
      countries: [
        { name: '🇦🇷 Argentina', count: 2612, pct: 92, badge: 'Sede' },
        { name: '🇺🇾 Uruguay', count: 99, pct: 3.5, badge: 'Online' },
        { name: '🇨🇱 Chile', count: 57, pct: 2.0, badge: 'Online' },
        { name: '🇪🇸 España', count: 43, pct: 1.5, badge: 'Online' },
        { name: '🌐 Otros Países', count: 29, pct: 1.0, badge: 'Global' }
      ],
      provinces: [
        { name: '🏛️ Buenos Aires (PBA + CABA)', count: 2101, pct: 74, color: 'fill-purple' },
        { name: '⛰️ Córdoba', count: 227, pct: 8, color: 'fill-teal' },
        { name: '🌾 Santa Fe', count: 199, pct: 7, color: 'fill-green' },
        { name: '🍇 Mendoza', count: 114, pct: 4, color: 'fill-amber' },
        { name: '🌊 Entre Ríos', count: 85, pct: 3, color: 'fill-blue' },
        { name: '📍 Otras Provincias', count: 114, pct: 4, color: 'fill-indigo' }
      ],
      localidadesBA: [
        { name: '⭐ Luján y Alrededores (Jáuregui, Olivera, Open Door)', count: 1193, pct: 42, color: 'fill-purple', badge: 'Sede Principal' },
        { name: '🏙️ CABA / Capital Federal (Caballito, Palermo, Belgrano, Flores)', count: 880, pct: 31, color: 'fill-teal', badge: 'Clases Online' },
        { name: '🚆 Zona Oeste GBA (Gral. Rodríguez, Moreno, Merlo, Morón)', count: 341, pct: 12, color: 'fill-green', badge: 'Cercanía' },
        { name: '🌳 Zona Norte GBA (Pilar, Campana, San Isidro)', count: 284, pct: 10, color: 'fill-amber', badge: 'Corredor Norte' },
        { name: '🌊 Interior y Otras Zonas (La Plata, Mercedes, etc.)', count: 142, pct: 5, color: 'fill-blue', badge: 'Provincial' }
      ]
    }
  };
}

function getCleanZeroAnalytics() {
  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    totalReads: 0,
    whatsappClicks: 0,
    mobileVisits: 0,
    desktopVisits: 0,
    tabletVisits: 0,
    pageViews: {
      'Inicio & CV': 0,
      'Blog Educativo': 0,
      'Biblioteca Digital': 0,
      'Banco de Recursos': 0
    },
    history: []
  };
}

function getStoredAnalytics() {
  const key = 'tecnoeduca_analytics_v1';
  let data = localStorage.getItem(key);
  if (!data) {
    const zero = getCleanZeroAnalytics();
    localStorage.setItem(key, JSON.stringify(zero));
    return zero;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    const zero = getCleanZeroAnalytics();
    localStorage.setItem(key, JSON.stringify(zero));
    return zero;
  }
}

function clearAnalyticsToZero() {
  if (!confirm('¿Deseás reiniciar todas las estadísticas a CERO (0) para comenzar limpio desde cero al lanzar el sitio web?')) return;
  const zeroData = getCleanZeroAnalytics();
  localStorage.setItem('tecnoeduca_analytics_v1', JSON.stringify(zeroData));
  renderAnalyticsDashboard();
  alert('✨ ¡Estadísticas blanqueadas a CERO (0) exitosamente!\n\nEl sitio web ahora registrará únicamente las visitas reales de tus alumnos y familias cuando esté publicado.');
}

function loadDemoAnalyticsData() {
  if (!confirm('¿Deseás cargar datos de ejemplo de visitas para probar cómo se ve el panel con mucha actividad?')) return;
  const seed = generateSeedAnalytics();
  localStorage.setItem('tecnoeduca_analytics_v1', JSON.stringify(seed));
  renderAnalyticsDashboard();
  alert('📊 ¡Datos de demostración cargados exitosamente!');
}

function resetOrSeedAnalyticsData() {
  clearAnalyticsToZero();
}

function trackPageView(pageName) {
  const analytics = getStoredAnalytics();
  analytics.totalVisits = (analytics.totalVisits || 0) + 1;
  analytics.pageViews = analytics.pageViews || {};
  analytics.pageViews[pageName] = (analytics.pageViews[pageName] || 0) + 1;

  // Detección de Tablet, Teléfono Móvil o Computadora
  const ua = navigator.userAgent;
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);
  const isMobile = !isTablet && /Android|iPhone|iPod|Mobile/i.test(ua);

  if (isTablet) {
    analytics.tabletVisits = (analytics.tabletVisits || 0) + 1;
  } else if (isMobile) {
    analytics.mobileVisits = (analytics.mobileVisits || 0) + 1;
  } else {
    analytics.desktopVisits = (analytics.desktopVisits || 0) + 1;
  }

  // Actualizar historial diario
  const todayLabel = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  analytics.history = analytics.history || [];
  let dayRecord = analytics.history.find(h => h.label === todayLabel);
  if (dayRecord) {
    dayRecord.visits++;
  } else {
    analytics.history.push({ label: todayLabel, visits: 1 });
    if (analytics.history.length > 14) {
      analytics.history.shift();
    }
  }

  localStorage.setItem('tecnoeduca_analytics_v1', JSON.stringify(analytics));
}

function trackAnalyticsEvent(eventType) {
  const analytics = getStoredAnalytics();
  if (eventType === 'whatsapp_click') {
    analytics.whatsappClicks = (analytics.whatsappClicks || 0) + 1;
  } else if (eventType === 'contact_submit') {
    analytics.totalReads = (analytics.totalReads || 0) + 1;
  }
  localStorage.setItem('tecnoeduca_analytics_v1', JSON.stringify(analytics));
}

function refreshAnalyticsDashboard() {
  renderAnalyticsDashboard();
}

function renderAnalyticsDashboard() {
  const analytics = getStoredAnalytics();
  const totalVisits = Number(analytics.totalVisits || 0);

  // KPIs
  const elVisits = document.getElementById('kpiTotalVisits');
  const elUniq = document.getElementById('kpiUniqueVisitors');
  const elReads = document.getElementById('kpiTotalReads');
  const elInter = document.getElementById('kpiInteractions');

  if (elVisits) elVisits.textContent = totalVisits.toLocaleString('es-AR');
  if (elUniq) elUniq.textContent = Number(analytics.uniqueVisitors || 0).toLocaleString('es-AR');
  if (elReads) elReads.textContent = Number(analytics.totalReads || 0).toLocaleString('es-AR');
  if (elInter) elInter.textContent = Number(analytics.whatsappClicks || 0).toLocaleString('es-AR');

  // Soporte directo para Panel Docente Nativo
  const statTotalVisits = document.getElementById('statTotalVisits');
  if (statTotalVisits) statTotalVisits.textContent = totalVisits.toLocaleString('es-AR');

  const statWaClicks = document.getElementById('statWaClicks');
  if (statWaClicks) statWaClicks.textContent = Number(analytics.whatsappClicks || 0).toLocaleString('es-AR');

  const statContactInquiries = document.getElementById('statContactInquiries');
  if (statContactInquiries) {
    const msgs = getStoredMessages();
    statContactInquiries.textContent = msgs.length.toLocaleString('es-AR');
  }

  const rankingTbody = document.getElementById('analyticsArticlesRankingTbody');
  if (rankingTbody) {
    const articles = getStoredArticles() || [];
    if (articles.length === 0) {
      rankingTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No hay artículos publicados aún.</td></tr>';
    } else {
      rankingTbody.innerHTML = articles.slice(0, 10).map(a => {
        let reactionCount = 0;
        try {
          const r = getArticleReactions(a.id);
          reactionCount = (r.like || 0) + (r.love || 0) + (r.clap || 0);
        } catch (e) {}
        const commentsCount = a.comments ? a.comments.length : 0;
        const totalInt = reactionCount + commentsCount;
        return `
          <tr>
            <td><strong>${escapeHTML(a.title)}</strong></td>
            <td><span class="post-cat-badge">${escapeHTML(a.category)}</span></td>
            <td>❤️ ${reactionCount} &bull; 💬 ${commentsCount} &bull; <strong>Total: ${totalInt}</strong></td>
          </tr>
        `;
      }).join('');
    }
  }

  // Gráfico de 14 días con Tooltips perfectamente visibles y sin cortes
  const chartBox = document.getElementById('analyticsBarsChart');
  if (chartBox) {
    if (!analytics.history || analytics.history.length === 0 || totalVisits === 0) {
      chartBox.innerHTML = `
        <div style="grid-column:1/-1; width:100%; text-align:center; padding:2.5rem 1rem; color:var(--text-muted); font-size:0.92rem; background:#FAF7FC; border-radius:10px; border:1px dashed #E2D9EC;">
          🌱 <strong>Contador en Cero (Modo Lanzamiento):</strong> Aún no hay visitas acumuladas. A medida que tus alumnos y familias naveguen por la web, verás cómo se dibuja el gráfico de barras por día en tiempo real con los números de cada jornada.
        </div>
      `;
    } else {
      const maxVal = Math.max(...analytics.history.map(h => h.visits), 1);
      chartBox.innerHTML = analytics.history.map(item => {
        const pct = Math.max(14, Math.round((item.visits / maxVal) * 100));
        return `
          <div class="chart-bar-item" tabindex="0" title="${item.visits} visitas el ${item.label}">
            <div class="bar-fill-track">
              <div class="bar-val-tooltip"><span class="tooltip-num">${item.visits}</span> visitas</div>
              <div class="bar-fill-column" style="height: ${pct}%;"></div>
            </div>
            <span class="bar-day-label">${item.label}</span>
          </div>
        `;
      }).join('');
    }
  }

  // Páginas más visitadas
  const breakdownBox = document.getElementById('analyticsPageBreakdown');
  if (breakdownBox) {
    const pages = [
      { name: 'Inicio & CV Interactivo', key: 'Inicio & CV', color: 'fill-purple' },
      { name: 'Blog Educativo', key: 'Blog Educativo', color: 'fill-teal' },
      { name: 'Biblioteca Digital', key: 'Biblioteca Digital', color: 'fill-amber' },
      { name: 'Banco de Recursos Didácticos', key: 'Banco de Recursos', color: 'fill-green' }
    ];

    const totalViews = Object.values(analytics.pageViews || {}).reduce((a, b) => a + b, 0);

    breakdownBox.innerHTML = pages.map(p => {
      const count = (analytics.pageViews && analytics.pageViews[p.key]) ? analytics.pageViews[p.key] : 0;
      const pct = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
      return `
        <div class="page-stat-row">
          <div class="page-stat-header">
            <span>${p.name}</span>
            <span><strong>${count.toLocaleString('es-AR')}</strong> (${pct}%)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${p.color}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Dispositivos (Móviles, Computadoras y Tablets)
  const mob = Number(analytics.mobileVisits || 0);
  const desk = Number(analytics.desktopVisits || 0);
  const tab = Number(analytics.tabletVisits || 0);
  const totDev = mob + desk + tab;

  let mobPct = 0;
  let deskPct = 0;
  let tabPct = 0;

  if (totDev > 0) {
    mobPct = Math.round((mob / totDev) * 100);
    deskPct = Math.round((desk / totDev) * 100);
    tabPct = Math.max(0, 100 - mobPct - deskPct);
  }

  const mobPctEl = document.getElementById('deviceMobilePct');
  const mobBarEl = document.getElementById('deviceMobileBar');
  const deskPctEl = document.getElementById('deviceDesktopPct');
  const deskBarEl = document.getElementById('deviceDesktopBar');
  const tabPctEl = document.getElementById('deviceTabletPct');
  const tabBarEl = document.getElementById('deviceTabletBar');

  if (mobPctEl) mobPctEl.textContent = `${mobPct}%`;
  if (mobBarEl) mobBarEl.style.width = `${mobPct}%`;
  if (deskPctEl) deskPctEl.textContent = `${deskPct}%`;
  if (deskBarEl) deskBarEl.style.width = `${deskPct}%`;
  if (tabPctEl) tabPctEl.textContent = `${tabPct}%`;
  if (tabBarEl) tabBarEl.style.width = `${tabPct}%`;

  // Demografía: Género / Roles y Rango de Edades
  const seed = generateSeedAnalytics();
  const demoData = analytics.demographics || (totalVisits > 0 ? seed.demographics : null);
  const geoData = analytics.geography || (totalVisits > 0 ? seed.geography : null);

  // 1. Género y Roles
  const genderBox = document.getElementById('analyticsDemographicsGender');
  if (genderBox) {
    if (!demoData || totalVisits === 0) {
      genderBox.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem; background:#FAF7FC; border-radius:8px; border:1px dashed #E2D9EC;">
          👥 <em>Sin consultas registradas aún (Modo Cero).</em>
        </div>
      `;
    } else {
      genderBox.innerHTML = demoData.genderRoles.map(item => {
        const calculatedCount = Math.round((item.pct / 100) * totalVisits);
        return `
          <div class="page-stat-row">
            <div class="page-stat-header">
              <span>${item.label}</span>
              <span><strong>${calculatedCount.toLocaleString('es-AR')}</strong> (${item.pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${item.color}" style="width: ${item.pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Rango de Edades
  const ageBox = document.getElementById('analyticsDemographicsAge');
  if (ageBox) {
    if (!demoData || totalVisits === 0) {
      ageBox.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem; background:#FAF7FC; border-radius:8px; border:1px dashed #E2D9EC;">
          🎂 <em>Sin datos de edades acumulados todavía.</em>
        </div>
      `;
    } else {
      ageBox.innerHTML = demoData.ageRanges.map(item => {
        const calculatedCount = Math.round((item.pct / 100) * totalVisits);
        return `
          <div class="page-stat-row">
            <div class="page-stat-header">
              <span>${item.label}</span>
              <span><strong>${calculatedCount.toLocaleString('es-AR')}</strong> (${item.pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${item.color}" style="width: ${item.pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Países de Origen
  const countriesBox = document.getElementById('analyticsGeoCountries');
  if (countriesBox) {
    if (!geoData || totalVisits === 0) {
      countriesBox.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem; background:#FAF7FC; border-radius:8px; border:1px dashed #E2D9EC;">
          🌍 <em>Sin registros geográficos aún.</em>
        </div>
      `;
    } else {
      countriesBox.innerHTML = geoData.countries.map(item => {
        const calculatedCount = Math.round((item.pct / 100) * totalVisits);
        return `
          <div class="page-stat-row">
            <div class="page-stat-header">
              <span>${item.name}</span>
              <span><span class="stat-tag-badge badge-online" style="margin-right:4px;">${item.badge}</span> <strong>${calculatedCount.toLocaleString('es-AR')}</strong> (${item.pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill fill-purple" style="width: ${item.pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 4. Provincias de Argentina
  const provincesBox = document.getElementById('analyticsGeoProvinces');
  if (provincesBox) {
    if (!geoData || totalVisits === 0) {
      provincesBox.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem; background:#FAF7FC; border-radius:8px; border:1px dashed #E2D9EC;">
          🗺️ <em>Sin registros provinciales aún.</em>
        </div>
      `;
    } else {
      provincesBox.innerHTML = geoData.provinces.map(item => {
        const calculatedCount = Math.round((item.pct / 100) * totalVisits);
        return `
          <div class="page-stat-row">
            <div class="page-stat-header">
              <span>${item.name}</span>
              <span><strong>${calculatedCount.toLocaleString('es-AR')}</strong> (${item.pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${item.color || 'fill-teal'}" style="width: ${item.pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 5. Localidades de Buenos Aires
  const localitiesBox = document.getElementById('analyticsGeoLocalities');
  if (localitiesBox) {
    if (!geoData || totalVisits === 0) {
      localitiesBox.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem; background:#FAF7FC; border-radius:8px; border:1px dashed #E2D9EC;">
          📍 <em>Sin registros locales aún.</em>
        </div>
      `;
    } else {
      localitiesBox.innerHTML = geoData.localidadesBA.map(item => {
        const calculatedCount = Math.round((item.pct / 100) * totalVisits);
        return `
          <div class="page-stat-row">
            <div class="page-stat-header">
              <span>${item.name}</span>
              <span><span class="stat-tag-badge ${item.badge === 'Sede Principal' ? 'badge-primary' : 'badge-online'}" style="margin-right:4px;">${item.badge}</span> <strong>${calculatedCount.toLocaleString('es-AR')}</strong> (${item.pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${item.color || 'fill-purple'}" style="width: ${item.pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Ranking de Artículos más leídos
  const topTbody = document.getElementById('analyticsTopPostsTbody');
  if (topTbody) {
    const articles = getStoredArticles();
    if (articles.length === 0) {
      topTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay artículos cargados en el blog todavía.</td></tr>`;
    } else {
      const rankIcons = ['🥇 1', '🥈 2', '🥉 3', '4', '5'];
      const demoViews = [842, 634, 518, 390, 245];

      topTbody.innerHTML = articles.slice(0, 5).map((a, idx) => {
        const views = totalVisits === 0 ? 0 : (demoViews[idx] || (300 - idx * 40));
        const score = totalVisits === 0 ? '10.0' : (9.8 - idx * 0.4).toFixed(1);
        return `
          <tr>
            <td><strong>${rankIcons[idx] || idx + 1}</strong></td>
            <td><strong>${escapeHTML(a.title)}</strong></td>
            <td><span class="post-cat-badge ${getCategoryClass(a.category)}">${a.category}</span></td>
            <td>👁️ <strong>${views}</strong> lecturas</td>
            <td>💬 ${a.comments ? a.comments.length : 0} comentarios</td>
            <td><span style="font-weight:800; color:var(--primary-purple);">${score}/10</span></td>
          </tr>
        `;
      }).join('');
    }
  }
}

// ===================================================================
// INICIALIZACIÓN DE SEGUIMIENTO EN VIVO
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Detectar la página activa para la analítica
  let pageName = 'Inicio & Portada';
  const path = window.location.pathname.toLowerCase();
  if (path.includes('sobre-mi')) pageName = 'Sobre Mí & Trayectoria';
  else if (path.includes('materias')) pageName = 'Materias & Especialidades';
  else if (path.includes('diseno-web')) pageName = 'Diseño Web Profesional';
  else if (path.includes('contacto')) pageName = 'Contacto & Consultas';
  else if (path.includes('blog')) pageName = 'Blog Educativo';
  else if (path.includes('biblioteca')) pageName = 'Biblioteca Digital';
  else if (path.includes('recursos')) pageName = 'Banco de Recursos';

  trackPageView(pageName);

  // Registrar clics a WhatsApp como evento de conversión
  document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp').forEach(btn => {
    btn.addEventListener('click', () => {
      trackAnalyticsEvent('whatsapp_click');
    });
  });

  // Escuchar envíos de formularios de contacto
  ['mainContactForm', 'contactModalForm', 'contactForm'].forEach(formId => {
    const formEl = document.getElementById(formId);
    if (formEl) {
      formEl.addEventListener('submit', () => {
        trackAnalyticsEvent('contact_submit');
      });
    }
  });
});

// ===================================================================
// INTEGRACIÓN Y SINCRONIZACIÓN CON SUPABASE CLOUD DATABASE
// ===================================================================

function setSupabaseBadgeStatus(html, color) {
  const badges = document.querySelectorAll('#supabaseStatusBadge, #supabaseStatusBadgeCard, .badge-cloud');
  badges.forEach(el => {
    el.innerHTML = html;
    if (color) el.style.color = color;
  });
}

async function handleSupabaseTestConnection() {
  setSupabaseBadgeStatus('⏳ Comprobando conexión...', '#e6a23c');
  if (!window.supabaseDB || !window.supabaseDB.isAvailable()) {
    alert('⚠️ El conector de Supabase no está cargado. Asegurate de tener conexión a Internet.');
    setSupabaseBadgeStatus('❌ Conector no disponible', '#f56c6c');
    return;
  }
  try {
    const result = await window.supabaseDB.checkConnection();
    if (result && (result.ok || result.success)) {
      alert('🎉 ¡Conexión con Supabase establecida correctamente!\n\nTu base de datos en la nube está activa, las tablas responden y todo está listo.');
      setSupabaseBadgeStatus('🟢 Conectado con la Nube', '#67c23a');
    } else {
      const errDetail = result?.error?.message || (typeof result?.error === 'string' ? result.error : JSON.stringify(result?.error || 'Error al consultar tablas'));
      alert('⚠️ Detalle de la conexión con Supabase:\n\n' + errDetail + '\n\n💡 Verificá que en el SQL Editor de Supabase hayas seleccionado "RUN" con el archivo supabase_setup.sql.');
      setSupabaseBadgeStatus('🔴 Error de conexión', '#f56c6c');
    }
  } catch (err) {
    alert('❌ Error al probar conexión: ' + (err.message || err));
  }
}

async function syncDataFromSupabase() {
  if (!window.supabaseDB) return;
  try {
    // 1. Configuraciones generales
    const cloudSettings = await window.supabaseDB.getSettings();
    if (cloudSettings && Object.keys(cloudSettings).length > 0) {
      const current = getStoredSettings();
      const merged = { ...current, ...cloudSettings };
      saveSettings(merged);
      applySettingsToUI();
    }

    // 2. Artículos del blog (sincronizar incluso si está vacío)
    const cloudArticles = await window.supabaseDB.getArticles();
    if (cloudArticles !== null) {
      saveArticles(cloudArticles);
      if (document.getElementById('blogPostsContainer')) {
        renderBlogPosts(typeof currentBlogCategory !== 'undefined' ? currentBlogCategory : 'all');
      }
      if (document.getElementById('adminArticlesTableBody') || document.getElementById('adminArticlesTbody')) {
        renderAdminArticlesTable();
      }
    }

    // 3. Biblioteca (sincronizar incluso si está vacía)
    const cloudBooks = await window.supabaseDB.getBooks();
    if (cloudBooks !== null) {
      saveBooks(cloudBooks);
      if (document.getElementById('libraryHomeContainer')) {
        renderLibraryBooks('all', 'all', 'libraryHomeContainer');
      }
      if (document.getElementById('libraryAllContainer')) {
        renderLibraryBooks('all', 'all', 'libraryAllContainer');
      }
      if (document.getElementById('adminBooksTableBody') || document.getElementById('adminBooksTbody')) {
        renderAdminBooksTable();
      }
    }

    // 4. Banco de recursos y proyectos (sincronizar incluso si está vacío)
    const cloudResources = await window.supabaseDB.getResources();
    if (cloudResources !== null) {
      saveResources(cloudResources);
      if (document.getElementById('resourcesContainer') || document.getElementById('resourcesGridContainer')) {
        renderResources(typeof currentResourceCategory !== 'undefined' ? currentResourceCategory : 'all');
      }
      if (document.getElementById('homeResourcesContainer')) {
        renderResources('all', '', 'homeResourcesContainer');
      }
      if (document.getElementById('adminResourcesTableBody') || document.getElementById('adminResourcesTbody')) {
        renderAdminResourcesTable();
      }
    }

    // Actualizar badges de conexión en la vista
    setSupabaseBadgeStatus('🟢 Conectado con la Nube', '#67c23a');
  } catch (err) {
    console.info('Supabase background sync notice:', err);
  }
}






// ===================================================================
// PÁGINAS INDIVIDUALES DINÁMICAS: ARTÍCULO Y PROYECTO
// ===================================================================

function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getArticleBySlugOrId(identifier) {
  if (!identifier) return null;
  const cleanId = identifier.toString().trim().toLowerCase();
  const articles = getStoredArticles();
  return articles.find(a => {
    if (!a) return false;
    const matchId = a.id && a.id.toLowerCase() === cleanId;
    const matchSlug = a.slug && a.slug.toLowerCase() === cleanId;
    const matchGeneratedSlug = a.title && generateSlug(a.title) === cleanId;
    return matchId || matchSlug || matchGeneratedSlug;
  }) || null;
}

function getResourceBySlugOrId(identifier) {
  if (!identifier) return null;
  const cleanId = identifier.toString().trim().toLowerCase();
  const resources = getStoredResources();
  return resources.find(r => {
    if (!r) return false;
    const matchId = r.id && r.id.toLowerCase() === cleanId;
    const matchSlug = r.slug && r.slug.toLowerCase() === cleanId;
    const matchGeneratedSlug = r.title && generateSlug(r.title) === cleanId;
    return matchId || matchSlug || matchGeneratedSlug;
  }) || null;
}

async function initArticlePage() {
  const container = document.getElementById('articleSingleContainer');
  const loadingEl = document.getElementById('articleLoadingState');
  const notFoundEl = document.getElementById('articleNotFoundContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  let identifier = params.get('slug') || params.get('id');

  if (!identifier && window.location.search.length > 1) {
    const rawSearch = window.location.search.substring(1);
    if (!rawSearch.includes('=')) {
      identifier = decodeURIComponent(rawSearch);
    }
  }
  if (!identifier && window.location.hash.length > 1) {
    identifier = decodeURIComponent(window.location.hash.substring(1));
  }

  let post = getArticleBySlugOrId(identifier);

  if (!post && window.supabaseDB) {
    try {
      const cloudArticles = await window.supabaseDB.getArticles();
      if (cloudArticles && cloudArticles.length > 0) {
        saveArticles(cloudArticles);
        post = getArticleBySlugOrId(identifier);
      }
    } catch (e) {
      console.warn('No se pudo consultar Supabase para el artículo:', e);
    }
  }

  if (loadingEl) loadingEl.style.display = 'none';

  if (!post || (post.publishStatus && post.publishStatus !== 'published')) {
    if (notFoundEl) notFoundEl.style.display = 'block';
    container.style.display = 'none';
    document.title = 'Artículo no disponible • TecnoEduca';
    return;
  }

  currentOpenArticleId = post.id;

  document.title = `${post.title} • Blog Pedagógico | TecnoEduca`;
  const metaDesc = document.getElementById('metaDescription');
  if (metaDesc) metaDesc.setAttribute('content', post.excerpt || post.title);

  const ogTitle = document.getElementById('ogTitle');
  if (ogTitle) ogTitle.setAttribute('content', `${post.title} • TecnoEduca`);
  const ogDesc = document.getElementById('ogDesc') || document.getElementById('ogDescription');
  if (ogDesc) ogDesc.setAttribute('content', post.excerpt || post.title);
  const ogUrl = document.getElementById('ogUrl');
  if (ogUrl) ogUrl.setAttribute('content', window.location.href);

  const bCat = document.getElementById('breadcrumbCategory');
  if (bCat) bCat.textContent = post.category || 'General';
  const bTitle = document.getElementById('breadcrumbTitle');
  if (bTitle) bTitle.textContent = post.title;

  const badgeEl = document.getElementById('articleCategoryBadge');
  if (badgeEl) {
    badgeEl.textContent = post.category;
    badgeEl.className = `post-cat-badge ${getCategoryClass(post.category)}`;
  }

  const readTimeEl = document.getElementById('articleReadTime');
  if (readTimeEl) readTimeEl.textContent = `⏱️ ${post.readTime || '4 min de lectura'}`;

  const dateEl = document.getElementById('articleDate');
  if (dateEl) dateEl.textContent = `• 📅 ${post.date}`;

  const titleEl = document.getElementById('articleTitle');
  if (titleEl) titleEl.textContent = post.title;

  const excerptEl = document.getElementById('articleExcerpt');
  if (excerptEl) {
    if (post.excerpt) {
      excerptEl.textContent = post.excerpt;
      excerptEl.style.display = 'block';
    } else {
      excerptEl.style.display = 'none';
    }
  }

  const bodyEl = document.getElementById('articleBody');
  if (bodyEl) {
    bodyEl.innerHTML = formatArticleBody(post.body || '');
  }

  const videoCont = document.getElementById('articleVideoContainer');
  if (videoCont) {
    if (post.videoUrl) {
      videoCont.innerHTML = createYouTubePreviewHtml(post.videoUrl, post.title);
      videoCont.style.display = 'block';
    } else {
      videoCont.innerHTML = '';
      videoCont.style.display = 'none';
    }
  }

  const downCont = document.getElementById('articleDownloadContainer');
  if (downCont) {
    if (post.downloadUrl) {
      downCont.innerHTML = `
        <div class="article-download-card">
          <div class="download-info">
            <span class="download-icon">📥</span>
            <div>
              <strong>Material y Guía Descargable en PDF</strong>
              <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Ejercicios resueltos y apuntes para profundizar este tema.</p>
            </div>
          </div>
          <a href="${post.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Descargar Guía</a>
        </div>
      `;
      downCont.style.display = 'block';
    } else {
      downCont.innerHTML = '';
      downCont.style.display = 'none';
    }
  }

  renderArticleFeedbackUI(post.id);

  const shareCont = document.getElementById('socialShareIcons');
  if (shareCont) {
    shareCont.innerHTML = generateShareIconsMarkup(post.title, window.location.href, window.location.href);
  }

  const waBtn = document.getElementById('articleWhatsAppBtn');
  if (waBtn) {
    const waMsg = `Hola Rosana! Leí tu artículo "${post.title}" en TecnoEduca y quiero coordinar una clase o hacerte una consulta.`;
    waBtn.href = `https://wa.me/5492323523149?text=${encodeURIComponent(waMsg)}`;
  }

  renderArticleComments(post);
  container.style.display = 'block';
  renderRelatedArticles(post);
}

function renderRelatedArticles(currentPost) {
  const container = document.getElementById('relatedArticlesGrid');
  if (!container) return;

  const all = getStoredArticles().filter(a => a.id !== currentPost.id && a.publishStatus === 'published');
  if (all.length === 0) {
    const sec = document.getElementById('relatedArticlesSection');
    if (sec) sec.style.display = 'none';
    return;
  }

  const sameCat = all.filter(a => a.category === currentPost.category);
  const diffCat = all.filter(a => a.category !== currentPost.category);
  const picked = [...sameCat, ...diffCat].slice(0, 3);

  container.innerHTML = picked.map(post => {
    const catClass = getCategoryClass(post.category);
    const catEmoji = getCategoryEmoji(post.category);
    const postSlug = post.slug || generateSlug(post.title);
    return `
      <article class="post-card" onclick="window.location.href='articulo.html?slug=${encodeURIComponent(postSlug)}'" title="Leer: ${escapeHTML(post.title)}" style="cursor:pointer;">
        <div class="post-card-banner ${catClass}">
          <span class="post-cat-pill">${escapeHTML(post.category)}</span>
          <span class="post-thumb-icon">${catEmoji}</span>
          <span class="post-read-pill">⏱️ ${escapeHTML(post.readTime || '4 min')}</span>
        </div>
        <div class="post-card-body">
          <h3 class="post-card-title">${escapeHTML(post.title)}</h3>
          <p class="post-card-excerpt">${escapeHTML(post.excerpt)}</p>
          <div class="post-card-footer">
            <span class="post-footer-date">📅 ${post.date}</span>
            <span class="btn-read-post">Leer artículo &rarr;</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function initProjectPage() {
  const container = document.getElementById('projectSingleContainer');
  const loadingEl = document.getElementById('projectLoadingState');
  const notFoundEl = document.getElementById('projectNotFoundContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  let identifier = params.get('slug') || params.get('id');

  if (!identifier && window.location.search.length > 1) {
    const rawSearch = window.location.search.substring(1);
    if (!rawSearch.includes('=')) {
      identifier = decodeURIComponent(rawSearch);
    }
  }
  if (!identifier && window.location.hash.length > 1) {
    identifier = decodeURIComponent(window.location.hash.substring(1));
  }

  let res = getResourceBySlugOrId(identifier);

  if (!res && window.supabaseDB) {
    try {
      const cloudResources = await window.supabaseDB.getResources();
      if (cloudResources && cloudResources.length > 0) {
        saveResources(cloudResources);
        res = getResourceBySlugOrId(identifier);
      }
    } catch (e) {
      console.warn('No se pudo consultar Supabase para el proyecto:', e);
    }
  }

  if (loadingEl) loadingEl.style.display = 'none';

  if (!res || res.publishStatus === 'draft') {
    if (notFoundEl) notFoundEl.style.display = 'block';
    container.style.display = 'none';
    document.title = 'Recurso no disponible • TecnoEduca';
    return;
  }

  document.title = `${res.title} • Portafolio & Recursos | TecnoEduca`;
  const metaDesc = document.getElementById('metaDescription');
  if (metaDesc) metaDesc.setAttribute('content', res.description || res.title);

  const ogTitle = document.getElementById('ogTitle');
  if (ogTitle) ogTitle.setAttribute('content', `${res.title} • TecnoEduca`);
  const ogDesc = document.getElementById('ogDesc') || document.getElementById('ogDescription');
  if (ogDesc) ogDesc.setAttribute('content', res.description || res.title);
  const ogUrl = document.getElementById('ogUrl');
  if (ogUrl) ogUrl.setAttribute('content', window.location.href);

  const bCat = document.getElementById('breadcrumbCategory');
  if (bCat) bCat.textContent = res.categoryLabel || res.category;
  const bTitle = document.getElementById('breadcrumbTitle');
  if (bTitle) bTitle.textContent = res.title;

  const catBadge = document.getElementById('projectCategoryBadge');
  if (catBadge) catBadge.textContent = res.categoryLabel || res.category;

  const fmtPill = document.getElementById('projectFormatPill');
  if (fmtPill) fmtPill.textContent = res.format || 'Digital';

  const licPill = document.getElementById('projectLicensePill');
  if (licPill) {
    licPill.textContent = (res.licenseType === 'free' || (res.license && res.license.includes('100%'))) ? 'Libre y Gratuito' : 'Acceso Educativo';
  }

  const dateEl = document.getElementById('projectDate');
  if (dateEl) dateEl.textContent = `• 📅 ${res.date || 'Reciente'}`;

  const titleEl = document.getElementById('projectTitle');
  if (titleEl) titleEl.textContent = res.title;

  const descEl = document.getElementById('projectDescription');
  if (descEl) descEl.innerHTML = formatArticleBody(res.description || '');

  const softwareCont = document.getElementById('projectSoftwareTags');
  if (softwareCont) {
    const rawTools = res.software || 'Navegador Web / HTML5 / JS';
    const chips = rawTools.split(/[/,]/).map(t => t.trim()).filter(Boolean);
    softwareCont.innerHTML = chips.map(tool => `<span class="tech-chip">⚙️ ${escapeHTML(tool)}</span>`).join('');
  }

  const fmtDetail = document.getElementById('projectFormatDetail');
  if (fmtDetail) fmtDetail.textContent = res.format || 'Aplicación interactiva y material digital';

  const authCredit = document.getElementById('projectAuthorCredit');
  if (authCredit) authCredit.textContent = res.authorCredit || 'Prof. Rosana (TecnoEduca)';

  const licCard = document.getElementById('projectLicenseCard');
  if (licCard && res.license) {
    licCard.innerHTML = `✨ <strong>Licencia de Uso:</strong> ${escapeHTML(res.license)}`;
  }

  const vidCont = document.getElementById('projectVideoContainer');
  if (vidCont) {
    if (res.videoUrl) {
      vidCont.innerHTML = createYouTubePreviewHtml(res.videoUrl, res.title);
      vidCont.style.display = 'block';
    } else {
      vidCont.innerHTML = '';
      vidCont.style.display = 'none';
    }
  }

  const actBtn = document.getElementById('projectActionBtn');
  if (actBtn) {
    actBtn.href = res.url || '#';
    if (res.fileType === 'download') {
      actBtn.innerHTML = '<span>📥 Descargar Recurso Completo ↗</span>';
    } else {
      actBtn.innerHTML = '<span>🚀 Abrir Aplicación en Pantalla Completa ↗</span>';
    }
  }

  const citText = document.getElementById('projectCitationText');
  if (citText) {
    citText.value = `Zunino, R. M. L. (${res.date || '2026'}). ${res.title}. TecnoEduca - Recursos y Portafolio Educativo. Enlace: ${window.location.href}`;
  }

  const shareCont = document.getElementById('projectShareIcons');
  if (shareCont) {
    shareCont.innerHTML = generateShareIconsMarkup(res.title, window.location.href, window.location.href);
  }

  const waBtn = document.getElementById('projectWhatsAppBtn');
  if (waBtn) {
    const waMsg = `Hola Rosana! Vi tu proyecto "${res.title}" en el banco de recursos de TecnoEduca y quiero hacerte una consulta.`;
    waBtn.href = `https://wa.me/5492323523149?text=${encodeURIComponent(waMsg)}`;
  }

  container.style.display = 'block';
  renderRelatedProjects(res);
}

function copyProjectCitation() {
  const citText = document.getElementById('projectCitationText');
  const statusEl = document.getElementById('citationCopyStatus');
  if (!citText) return;

  citText.select();
  navigator.clipboard.writeText(citText.value).then(() => {
    if (statusEl) {
      statusEl.style.display = 'inline';
      setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
    }
  }).catch(() => {
    document.execCommand('copy');
    if (statusEl) {
      statusEl.style.display = 'inline';
      setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
    }
  });
}

function renderRelatedProjects(currentRes) {
  const container = document.getElementById('relatedProjectsGrid');
  if (!container) return;

  const all = getStoredResources().filter(r => r.id !== currentRes.id && r.publishStatus !== 'draft');
  if (all.length === 0) {
    const sec = document.getElementById('relatedProjectsSection');
    if (sec) sec.style.display = 'none';
    return;
  }

  const sameCat = all.filter(r => r.category === currentRes.category);
  const diffCat = all.filter(r => r.category !== currentRes.category);
  const picked = [...sameCat, ...diffCat].slice(0, 3);

  container.innerHTML = picked.map(res => {
    const resSlug = res.slug || generateSlug(res.title);
    return `
      <div class="resource-card" onclick="window.location.href='proyecto.html?slug=${encodeURIComponent(resSlug)}'" style="cursor:pointer;" title="Ver recurso: ${escapeHTML(res.title)}">
        <div class="resource-card-banner" style="background:${res.previewColor || 'var(--primary-purple)'};">
          <span class="resource-banner-icon">${res.previewIcon || '💡'}</span>
          <span class="resource-cat-badge">${escapeHTML(res.categoryLabel || res.category)}</span>
        </div>
        <div class="resource-card-body">
          <h4 class="resource-card-title">${escapeHTML(res.title)}</h4>
          <p class="resource-card-desc">${escapeHTML(res.description || '')}</p>
          <div class="resource-card-footer">
            <span class="resource-software-chip">🛠️ ${escapeHTML(res.software || 'Digital')}</span>
            <span class="btn-read-post">Ver ficha &rarr;</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Inicializar páginas individuales según URL al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('articleSingleContainer')) {
    initArticlePage();
  }
  if (document.getElementById('projectSingleContainer')) {
    initProjectPage();
  }
});

