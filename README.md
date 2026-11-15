# 🌐 Sitio Web Oficial • Prof. Rosana (TecnoEduca)

> **Plataforma web profesional y educativa de Rosana María Luján Zunino**  
> Docente de Matemática, Física y Química con casi 30 años de trayectoria en el nivel secundario técnico, estudiante universitaria en Ciencias de Datos (UNLu) y diseñadora web para profesionales, instituciones y emprendimientos.

---

## 📋 Descripción General

Este proyecto contiene el sitio web público responsive, moderno y optimizado para la actividad docente y profesional de Rosana. Conecta la experiencia pedagógica de tres décadas con herramientas digitales modernas, ofreciendo clases particulares, cursos de capacitación práctica (Canva e Inteligencia Artificial en Educación) y servicios de diseño y desarrollo web a medida.

---

## 🎨 Identidad Visual & Paleta Cromática

El diseño visual está fielmente inspirado en los afiches promocionales institucionales:

| Elemento | Color / Valor HEX | Función en el Sitio |
| :--- | :--- | :--- |
| **Verde Petróleo Profundo** | `#1A464F` – `#225A65` | Fondo del encabezado (header) y pie de página (footer) para un enmarcado sólido. |
| **Verde Petróleo Institucional** | `#205A65` – `#276E7B` | Botones de acción principal (`.btn-primary`), títulos de secciones y tarjetas. |
| **Aqua Luminoso** | `#70BFCE` | Acentos interactivos, enlaces activos, bordes de botones secundarios y badges. |
| **Lila / Violeta Floral** | `#7E569B` – `#D8C6F6` | Corazones ornamentales (`♡`), detalles manuscritos (`.highlight-script`) y bordes de tarjetas. |
| **Blanco Puro** | `#FFFFFF` | Superficies de lectura limpia en secciones alternadas (`.section-white`) y tarjetas. |
| **Tinte Floral Suave** | `#F8F1FD` a `#EEF8F7` | Secciones alternadas (`.section-alt`) para brindar ritmo visual y clara división. |

---

## 📁 Estructura del Repositorio

```
├── index.html            # Portada principal: Presentación, materias, blog, recursos, diseño web y contacto.
├── sobre-mi.html         # Perfil pedagógico: Trayectoria docente (1997-hoy), formación UNLu y credenciales.
├── materias.html         # Especialidades: Matemática, Física y Química, Cursos de Canva e IA, modalidades.
├── diseno-web.html       # Propuesta web: Pilares, planes, características técnicas, proceso de trabajo y presupuestos.
├── contacto.html         # Formulario directo (Supabase), canales directos (WhatsApp/email) y mapa Centro de Luján.
├── blog.html             # Blog pedagógico: Artículos clasificados por materia con buscador en vivo y lector modal.
├── biblioteca.html       # Biblioteca digital: Libros y manuales con visor embebido desde Google Drive.
├── recursos.html         # Banco didáctico: Simuladores, apps interactivas, guías descargables y plantillas Canva.
├── styles.css            # Hoja de estilos CSS unificada (responsive, variables CSS, layout Grid/Flexbox).
├── script.js             # Lógica cliente: Carga dinámica de artículos, filtros, modales y validación de formularios.
├── supabase-client.js    # Conexión cliente con la base de datos Supabase (consultas, artículos, biblioteca).
└── Recursos/             # Activos multimedia: Afiches promocionales, capturas, CV en PDF e imágenes.
```

---

## 🚀 Características Principales

1. **Diseño 100% Adaptable (*Mobile-First*)**:
   - Menú hamburguesa optimizado para celulares.
   - Barra lateral flotante (*dock*) con accesos directos a WhatsApp, LinkedIn, Instagram, TikTok, YouTube, etc.
   - Botón directo de llamada a la acción en todas las secciones.

2. **Formulario de Contacto Directo con Base de Datos**:
   - Envía consultas en tiempo real directamente al **Panel Administrativo** a través de Supabase.
   - Campos de validación: Nombre, Apellido, Correo Electrónico, Teléfono/WhatsApp, Motivo y Mensaje.

3. **División Alternada de Secciones**:
   - Contraste armónico entre bloques blancos (`section-white`) y fondos con degradé floral tenue (`section-alt`), evitando la monotonía de lectura.

4. **Zona de Cobertura y Mapa en Luján**:
   - Referencia clara al Centro de Luján (Basílica de Luján, Cuartel de Bomberos y Plaza Colón) para clases presenciales, y mención a la modalidad virtual para todo el país.

5. **Espacio para Proyectos de Diseño Web**:
   - Sección dedicada (`diseno-web.html`) orientada a captar clientes para desarrollo de sitios profesionales, landing pages y presencia digital.

---

## 💻 Tecnologías Utilizadas

- **HTML5**: Marcado semántico, accesible y estructurado.
- **CSS3 Moderno**: Variables personalizadas (`:root`), Grid Layout, Flexbox, degradados lineales y *glassmorphism*.
- **JavaScript (Vanilla ES6+)**: Sin librerías pesadas externas para garantizar máxima velocidad de carga.
- **Supabase**: Backend serverless para persistencia de mensajes de contacto, artículos del blog y recursos.
- **Google Fonts**: Tipografías *Nunito* (lectura moderna y limpia) y *Caveat* (acento manuscrito cálido).

---

## 🛠️ Cómo Ejecutar el Proyecto en Local

1. Cloná o descargá este repositorio.
2. Abrí la carpeta `github/` en tu editor de código preferido (por ejemplo, **VS Code**).
3. Hacé clic derecho sobre `web/index.html` y seleccioná **Open with Live Server** (o abrí el archivo directamente en cualquier navegador web moderno).
4. Navegá por las distintas páginas utilizando el menú superior.

---

## 🌐 Despliegue en Producción

El sitio es completamente estático en el frontend, lo que permite publicarlo de forma gratuita y rápida en:
- **GitHub Pages**: Configurando la rama principal apuntando a la carpeta `/web` o raíz.
- **Vercel / Netlify**: Conectando el repositorio de GitHub con despliegues automáticos ante cada cambio.

---

© 2026 **Rosana • TecnoEduca**. Profesora de Matemática, Física y Química. Todos los derechos reservados.

