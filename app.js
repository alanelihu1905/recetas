/* 
   ========================================================
   CONTROLADOR LÓGICO DE LA APLICACIÓN
   ======================================================== 
*/

// VARIABLES DE ESTADO GLOBAL
let recetasList = [];
let activeEditId = null;

// DECLARACIÓN DE VECTORES SVG Y LOGOS

// 1. LOGO DE RESPALDO (VECTORES CUADRANTES DE HUESOS)
const SVG_LOGO_BACKUP = `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#0f172a" />
    <line x1="60" y1="10" x2="60" y2="110" stroke="#ffffff" stroke-width="1.5" opacity="0.25" />
    <line x1="10" y1="60" x2="110" y2="60" stroke="#ffffff" stroke-width="1.5" opacity="0.25" />
    <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.15" />
    
    <!-- Costillas -->
    <g fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.95">
      <path d="M 28,34 Q 40,38 52,28" />
      <path d="M 23,44 Q 38,50 52,40" />
      <path d="M 25,54 Q 38,58 52,52" />
    </g>
    
    <!-- Vertebras -->
    <g fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.95">
      <line x1="72" y1="20" x2="72" y2="52" stroke-width="3" />
      <path d="M 65,24 L 79,24" />
      <path d="M 65,31 L 79,31" />
      <path d="M 65,38 L 79,38" />
      <path d="M 65,45 L 79,45" />
    </g>
    
    <!-- Pelvis -->
    <g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">
      <path d="M 24,72 C 30,66 42,66 48,76 C 54,84 50,102 42,106 C 32,108 26,96 24,84 Z" />
      <path d="M 48,76 C 51,80 54,86 52,94 M 42,100 Q 48,96 48,90" />
    </g>
    
    <!-- Mano -->
    <g fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.95">
      <path d="M 72,100 L 76,88 L 78,76 L 76,70" />
      <path d="M 78,101 L 82,87 L 85,73 L 83,67" stroke-width="2" />
      <path d="M 84,102 L 90,88 L 94,76 L 92,69" stroke-width="1.8" />
      <path d="M 89,101 L 95,90 L 100,81 L 98,76" stroke-width="1.5" />
      <path d="M 66,88 Q 69,84 74,80" />
    </g>
  </svg>
`;

// 2. LOGO MARCA DE AGUA
// El watermark utiliza la imagen local logo.jpg con transparencia y blending controlados por CSS.

// 4. ICONOS REDONDOS (LLENOS) PARA LA BARRA NEGRA Rx
const ICON_PHONE_CIRCLE = `
  <svg viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="#ffffff" />
    <path d="M9.5 13.5c1.4 2.8 3.7 5.1 6.5 6.5l1.8-1.8c.2-.2.5-.3.8-.2.9.3 1.9.5 2.9.5.4 0 .8.4.8.8v2.8c0 .4-.4.8-.8.8-7.7 0-14-6.3-14-14 0-.4.4-.8.8-.8h2.8c.4 0 .8.4.8.8 0 1 .2 2 .5 2.9.1.3 0 .6-.2.8l-1.8 1.8z" fill="#0f172a"/>
  </svg>
`;
const ICON_PIN_CIRCLE = `
  <svg viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="#ffffff" />
    <path d="M16 8c-3.3 0-6 2.7-6 6 0 4.2 6 10 6 10s6-5.8 6-10c0-3.3-2.7-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#0f172a"/>
  </svg>
`;
const ICON_WHATSAPP_CIRCLE = `
  <svg viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="#ffffff" />
    <path d="M16.1 9.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.2.3 2.3.9 3.3L9.5 22.7l3.5-.9c.9.5 2 .8 3.1.8 3.6 0 6.5-2.9 6.5-6.5 0-1.7-.7-3.4-1.9-4.6-1.2-1.3-2.9-2-4.6-2zm0 1.1c1.4 0 2.7.5 3.7 1.5.9 1 1.5 2.3 1.5 3.7 0 3-2.5 5.5-5.5 5.5-1 0-2.1-.3-3-.9l-.2-.1-2 .5.5-2-.1-.2c-.6-.9-.9-1.9-.9-3 0-3 2.5-5.5 5.5-5.5z" fill="#0f172a"/>
  </svg>
`;

// 5. ICONOS OUTLINE (LÍNEAS) PARA LA FICHA DE DIAGNÓSTICO
const ICON_PHONE_OUTLINE = `
  <svg viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
`;
const ICON_PIN_OUTLINE = `
  <svg viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
`;
const ICON_WHATSAPP_OUTLINE = `
  <svg viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
`;

// FORMATEADOR DE FECHAS (YYYY-MM-DD -> DD/MM/YYYY)
function formatoFecha(fechaISO) {
  if (!fechaISO) return "";
  if (fechaISO.includes("/")) return fechaISO; // ya formateada
  const parts = fechaISO.split("-");
  if (parts.length !== 3) return fechaISO;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatRichText(value = "") {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function parseCredentialEntry(rawValue = "", fallbackLabel = "") {
  const compact = String(rawValue).replace(/\s+/g, " ").trim();
  if (!compact) {
    return { label: fallbackLabel, number: "", institution: "" };
  }

  const withoutLabel = compact
    .replace(/^C\.?\s*P\.?\s*E\.?\s*/i, "")
    .replace(/^C\.?\s*P\.?\s*/i, "")
    .trim();

  const tokens = withoutLabel.split(" ").filter(Boolean);
  let institution = "";

  if (tokens.length > 1 && /^[A-ZÁÉÍÓÚÜÑ]{2,}$/.test(tokens[tokens.length - 1])) {
    institution = tokens.pop();
  }

  return {
    label: fallbackLabel,
    number: tokens.join(" ") || withoutLabel || compact,
    institution
  };
}

function getDoctorPrintData() {
  const name = localStorage.getItem("cfg_med_name") || "Dr. Salvador Zamorano Solis";
  const specialty = localStorage.getItem("cfg_med_spec") || "";
  const rawCed = localStorage.getItem("cfg_med_ced") || "";
  const rawCedEsp = localStorage.getItem("cfg_med_cedesp") || "";
  const rawTel = localStorage.getItem("cfg_med_tel") || "";
  const rawDir = localStorage.getItem("cfg_med_dir") || "";

  const telParts = rawTel.split("|").map(part => part.trim()).filter(Boolean);
  const consultorioTel = telParts[0] || rawTel.trim();
  const whatsappTel = telParts[1] || "";

  const dirParts = rawDir.split(",").map(part => part.trim()).filter(Boolean);
  const dirPrimary = dirParts[0] || "";
  const dirSecondary = dirParts.slice(1).join(" | ");

  return {
    name,
    specialty,
    specialtyCaps: specialty ? specialty.toUpperCase() : "",
    cedula: parseCredentialEntry(rawCed, "C.P."),
    cedulaEsp: parseCredentialEntry(rawCedEsp, "C.P.E."),
    consultorioTel,
    whatsappTel,
    dirPrimary,
    dirSecondary
  };
}

function templateUsesMedications(template = "diagnostico") {
  return template === "diagnostico";
}

function normalizeNoteMode(template = "diagnostico", noteMode = "indicaciones") {
  if (!templateUsesMedications(template)) return "indicaciones";
  return noteMode === "diagnostico" ? "diagnostico" : "indicaciones";
}

function getActiveNoteMode() {
  const template = document.getElementById("form-template").value;
  return normalizeNoteMode(template, document.getElementById("form-note-mode").value);
}

function getTemplateMeta(template = "diagnostico", noteMode = "indicaciones") {
  const normalizedNoteMode = normalizeNoteMode(template, noteMode);

  if (templateUsesMedications(template)) {
    const isDiagnosticMode = normalizedNoteMode === "diagnostico";
    return {
      key: "diagnostico",
      label: "Receta Médica",
      shortLabel: "Receta",
      noteMode: normalizedNoteMode,
      noteLabel: isDiagnosticMode ? "Diagnóstico" : "Indicaciones médicas",
      notePlaceholder: isDiagnosticMode
        ? "Ej. Gonartrosis, lumbalgia mecánica, tendinitis del manguito rotador..."
        : "Ej. Dolor lumbar, reposo relativo y control en 7 días...",
      notePrintTitle: isDiagnosticMode ? "Diagnóstico" : "Indicaciones",
      observationsLabel: isDiagnosticMode ? "Indicaciones (opcional)" : "Observaciones Adicionales",
      observationsPlaceholder: isDiagnosticMode
        ? "Ej. Reposo relativo, fisioterapia, control en 7 días..."
        : "Indicaciones de reposo, fisioterapia, signos de alarma...",
      observationsPrintTitle: isDiagnosticMode ? "Indicaciones" : "Observaciones",
      medsLabel: "Medicamentos / Tratamiento",
      modeCopy: isDiagnosticMode
        ? "Captura el diagnóstico, los medicamentos y, si hace falta, agrega indicaciones debajo."
        : "Captura medicamentos, indicaciones y observaciones de la receta.",
      detailEmptyNote: isDiagnosticMode ? "Sin diagnóstico registrado." : "Sin indicaciones registradas.",
      detailEmptyObs: isDiagnosticMode ? "Sin indicaciones registradas." : "Sin observaciones."
    };
  }

  return {
    key: "receta",
    label: "Solicitud de Rx / Radiografías",
    shortLabel: "Rx",
    noteMode: "indicaciones",
    noteLabel: "Indicaciones clínicas",
    notePlaceholder: "Ej. Rx AP y lateral de rodilla derecha, incluir apoyo monopodal...",
    notePrintTitle: "Solicitud",
    observationsLabel: "Notas adicionales",
    observationsPlaceholder: "Ej. Prioridad, región a valorar o comentarios para el paciente...",
    observationsPrintTitle: "Notas adicionales",
    medsLabel: "",
    modeCopy: "Este formato se usa para solicitar radiografías o estudios, sin medicamentos.",
    detailEmptyNote: "Sin estudio solicitado.",
    detailEmptyObs: "Sin notas adicionales."
  };
}

function updateFormModeUI() {
  const template = document.getElementById("form-template").value;
  const noteMode = document.getElementById("form-note-mode").value;
  const meta = getTemplateMeta(template, noteMode);
  const isPrescription = templateUsesMedications(template);

  const noteLabel = document.getElementById("form-diagnostico-label");
  const noteField = document.getElementById("form-diagnostico");
  const obsLabel = document.getElementById("form-observaciones-label");
  const obsField = document.getElementById("form-observaciones");
  const medsPanel = document.getElementById("meds-panel");
  const medsLabel = document.getElementById("form-meds-label");
  const addMedBtn = document.getElementById("btn-add-med-row");
  const modeBadge = document.getElementById("template-mode-badge");
  const modeCopy = document.getElementById("template-mode-copy");
  const submitBtn = document.getElementById("btn-submit-form");
  const printBtn = document.getElementById("btn-print-current");
  const noteModePanel = document.getElementById("note-mode-panel");
  const noteModeField = document.getElementById("form-note-mode");

  if (noteModeField) {
    noteModeField.value = normalizeNoteMode(template, noteModeField.value);
  }

  if (noteLabel) noteLabel.textContent = meta.noteLabel;
  if (noteField) noteField.placeholder = meta.notePlaceholder;
  if (obsLabel) obsLabel.textContent = meta.observationsLabel;
  if (obsField) obsField.placeholder = meta.observationsPlaceholder;
  if (modeBadge) modeBadge.textContent = meta.label;
  if (modeCopy) modeCopy.textContent = meta.modeCopy;

  if (medsLabel) medsLabel.textContent = meta.medsLabel;
  if (medsPanel) medsPanel.classList.toggle("is-hidden", !isPrescription);
  if (noteModePanel) noteModePanel.classList.toggle("is-hidden", !isPrescription);
  if (addMedBtn) addMedBtn.disabled = !isPrescription;

  if (submitBtn) {
    submitBtn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 3v5h8M17 21v-8H7v8"/></svg>
      ${activeEditId ? `Actualizar ${meta.shortLabel}` : `Guardar ${meta.shortLabel}`}
    `;
  }

  if (printBtn) {
    printBtn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2m2 4h10a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm8-12V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4"/></svg>
      Imprimir ${meta.shortLabel} Actual
    `;
  }
}

function collectMedicationRows({ keepBlankRows = false } = {}) {
  const medicamentos = [];
  const medRows = document.querySelectorAll("#meds-rows-list .med-row-item");

  medRows.forEach(row => {
    const nombre = row.querySelector(".med-nombre").value.trim();
    const dosis = row.querySelector(".med-dosis").value.trim();
    const frecuencia = row.querySelector(".med-frecuencia").value.trim();
    const duracion = row.querySelector(".med-duracion").value.trim();
    const indicaciones = row.querySelector(".med-indicaciones").value.trim();

    if (keepBlankRows || nombre !== "") {
      medicamentos.push({ nombre, dosis, frecuencia, duracion, indicaciones });
    }
  });

  return medicamentos;
}

function buildSectionTitleHTML(title = "") {
  if (!title || !title.trim()) return "";
  return `<div class="print-section-label">${escapeHtml(title)}</div>`;
}

function buildMedicationListHTML(medsData = []) {
  if (!Array.isArray(medsData) || medsData.length === 0) return "";

  const items = medsData.map((med, index) => {
    const detailParts = [med.dosis, med.frecuencia, med.duracion].filter(Boolean);
    const details = detailParts.length > 0
      ? `<span class="med-print-details">${escapeHtml(detailParts.join(" | "))}</span>`
      : "";

    const instructions = med.indicaciones
      ? `<div class="med-print-instructions">Indicaciones: ${formatRichText(med.indicaciones)}</div>`
      : "";

    return `
      <div class="med-print-item">
        <div class="med-print-topline">
          <span class="med-print-idx">${index + 1}.</span>
          <span class="med-print-name">${escapeHtml(med.nombre || "")}</span>
          ${details}
        </div>
        ${instructions}
      </div>
    `;
  }).join("");

  return `<div class="med-print-list">${items}</div>`;
}

function buildPrimaryTextHTML(template, text = "", noteMode = "indicaciones") {
  const cleanText = String(text || "").trim();
  if (!cleanText) return "";
  const meta = getTemplateMeta(template, noteMode);

  if (templateUsesMedications(template)) {
    const label = meta.noteMode === "diagnostico"
      ? buildSectionTitleHTML(meta.notePrintTitle)
      : "";
    return `
      <div class="notes-print-block">
        ${label}
        <div class="notes-print-text">${formatRichText(cleanText)}</div>
      </div>
    `;
  }

  return `<div class="rx-request-text">${formatRichText(cleanText)}</div>`;
}

function buildObservationsHTML(observaciones = "", template = "diagnostico", noteMode = "indicaciones") {
  if (!observaciones || !observaciones.trim()) return "";
  const meta = getTemplateMeta(template, noteMode);

  return `
    <div class="observations-print-section">
      <div class="observations-print-title">${escapeHtml(meta.observationsPrintTitle)}</div>
      <div class="observations-print-text">${formatRichText(observaciones)}</div>
    </div>
  `;
}

function applyContentDensity(recipeEl, payload) {
  if (!recipeEl) return;

  const { template, diagnostico = "", observaciones = "", medsData = [] } = payload;
  const medsWeight = medsData.reduce((total, med) => {
    const medText = [med.nombre, med.dosis, med.frecuencia, med.duracion, med.indicaciones].join(" ");
    return total + medText.length;
  }, 0);

  const score = diagnostico.length + observaciones.length + medsWeight + (medsData.length * 80);
  const dense = templateUsesMedications(template)
    ? score > 320 || medsData.length >= 4
    : score > 220;
  const compact = templateUsesMedications(template)
    ? score > 520 || medsData.length >= 6
    : score > 360;

  recipeEl.querySelectorAll(".recipe").forEach(sheet => {
    sheet.classList.toggle("content-dense", dense);
    sheet.classList.toggle("content-compact", compact);
  });
}

function injectRecipeData(recipeEl, payload) {
  if (!recipeEl) return;

  const {
    template,
    noteMode = "indicaciones",
    paciente,
    edad,
    sexo,
    fecha,
    diagnostico,
    observaciones,
    medsData,
    doctorData
  } = payload;

  const setText = (selector, value) => {
    recipeEl.querySelectorAll(selector).forEach(el => {
      el.textContent = value;
    });
  };

  setText(".doctor-name", doctorData.name);
  setText(".doctor-subtitle", doctorData.specialtyCaps);
  setText(".specialty", doctorData.specialty);
  setText(".val-doc-ced", doctorData.cedula.number);
  setText(".val-doc-cedesp", doctorData.cedulaEsp.number);
  setText(".val-doc-ced-inst", doctorData.cedula.institution);
  setText(".val-doc-cedesp-inst", doctorData.cedulaEsp.institution);
  setText(".val-doc-tel", doctorData.consultorioTel);
  setText(".val-doc-cel", doctorData.whatsappTel);
  setText(".val-doc-dir-primary", doctorData.dirPrimary);
  setText(".val-doc-dir-secondary", doctorData.dirSecondary);

  setText(".val-paciente", paciente || "_________________________________");
  setText(".val-edad", edad || "______");
  setText(".val-sexo", sexo || "___");
  setText(".val-fecha", fecha || "____/____/______");
  setText(".val-fecha-simple", fecha || "____/____/______");

  const diagContainer = recipeEl.querySelector(".val-diagnostico-print");
  if (diagContainer) {
    diagContainer.innerHTML = buildPrimaryTextHTML(template, diagnostico, noteMode);
  }

  const medsContainer = recipeEl.querySelector(".val-meds-print-list");
  if (medsContainer) {
    medsContainer.innerHTML = templateUsesMedications(template)
      ? buildMedicationListHTML(medsData)
      : "";
  }

  const obsContainer = recipeEl.querySelector(".val-obs-print-section");
  if (obsContainer) {
    obsContainer.innerHTML = buildObservationsHTML(observaciones, template, noteMode);
  }

  applyContentDensity(recipeEl, payload);
}

// SISTEMA DE NOTIFICACIONES TOAST (MÉTODO MODERNO NO BLOQUEANTE)
function showToast(message, type = 'info') {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast-message toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  
  // Animación de entrada
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);
  
  // Auto-eliminar
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// INICIALIZACIÓN DE LA APLICACIÓN
window.addEventListener("load", () => {
  // 1. Cargar fecha de hoy por defecto en el input
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("form-fecha").value = hoy;
  
  // Mostrar fecha larga actual en el encabezado
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("date-label").textContent = new Date().toLocaleDateString('es-ES', options);

  // 2. Cargar datos del doctor (por defecto el que corresponda a la página abierta)
  const defaultDoc = "salvador";
  
  if (!localStorage.getItem("cfg_med_name")) {
    loadDefaultDoctorData(defaultDoc, false);
  } else {
    loadDoctorConfigFromStorage();
  }

  // 3. Cargar la lista de recetas desde localStorage
  cargarRecetasFromStorage();

  // 4. Agregar el primer renglón dinámico de medicamentos
  addMedRow();

  // 5. Cargar borrador de recuperación si existe
  cargarBorradorActual();

  // 6. Sincronizar layouts y vista previa
  updateFormModeUI();
  changePrintLayout();
  syncPreview();
});

// PESTAÑAS (TAB SWITCHING)
function clickTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.remove("active");
  });

  const activeBtn = Array.from(document.querySelectorAll(".tab-btn")).find(btn => 
    btn.getAttribute("onclick").includes(tabId)
  );
  if (activeBtn) activeBtn.classList.add("active");

  document.getElementById(tabId).classList.add("active");

  if (tabId === "tab-history") {
    renderTable();
  }
}

// PRECARGA DE DATOS POR DEFECTO DEL DOCTOR
function loadDefaultDoctorData(docType, showAlert = true) {
  if (docType === "salvador") {
    document.getElementById("cfg-doc-nombre").value = "Dr. Salvador Zamorano Solis";
    document.getElementById("cfg-doc-especialidades").value = "Traumatología y Ortopedia";
    document.getElementById("cfg-doc-cedula").value = "2336570 UADY";
    document.getElementById("cfg-doc-ced-esp").value = "3223396 UNAM";
    document.getElementById("cfg-doc-tel").value = "Tel. (981) 8139730 | Cel. (981) 8193972";
    document.getElementById("cfg-doc-direccion").value = "Hospital Maria Costanza, Av. Lázaro Cárdenas 86, CP. 24097, Consultorio 214";
  }

  saveConfigAndSync(false);
  if (showAlert) {
    showToast("Credenciales de doctor cargadas correctamente.", "success");
  }
}

// GUARDAR CONFIGURACIÓN Y SINCRONIZAR
function saveConfigAndSync(showAlert = true) {
  const nombre = document.getElementById("cfg-doc-nombre").value;
  const especialidad = document.getElementById("cfg-doc-especialidades").value;
  const cedula = document.getElementById("cfg-doc-cedula").value;
  const cedEsp = document.getElementById("cfg-doc-ced-esp").value;
  const tel = document.getElementById("cfg-doc-tel").value;
  const direccion = document.getElementById("cfg-doc-direccion").value;

  localStorage.setItem("cfg_med_name", nombre);
  localStorage.setItem("cfg_med_spec", especialidad);
  localStorage.setItem("cfg_med_ced", cedula);
  localStorage.setItem("cfg_med_cedesp", cedEsp);
  localStorage.setItem("cfg_med_tel", tel);
  localStorage.setItem("cfg_med_dir", direccion);

  document.getElementById("head-doc-title").textContent = nombre;

  syncPreview();
  if (showAlert) {
    showToast("Configuración guardada correctamente.", "success");
  }
}

// LEER CONFIGURACIÓN DESDE STORAGE
function loadDoctorConfigFromStorage() {
  document.getElementById("cfg-doc-nombre").value = localStorage.getItem("cfg_med_name") || "";
  document.getElementById("cfg-doc-especialidades").value = localStorage.getItem("cfg_med_spec") || "";
  document.getElementById("cfg-doc-cedula").value = localStorage.getItem("cfg_med_ced") || "";
  document.getElementById("cfg-doc-ced-esp").value = localStorage.getItem("cfg_med_cedesp") || "";
  document.getElementById("cfg-doc-tel").value = localStorage.getItem("cfg_med_tel") || "";
  document.getElementById("cfg-doc-direccion").value = localStorage.getItem("cfg_med_dir") || "";
  
  document.getElementById("head-doc-title").textContent = localStorage.getItem("cfg_med_name") || "Dr. Salvador Zamorano Solis";
}

// AGREGAR / ELIMINAR RENGLONES DE MEDICAMENTO DINÁMICO
function addMedRow(nombre = "", dosis = "", frecuencia = "", duracion = "", indicaciones = "") {
  const container = document.getElementById("meds-rows-list");
  const rowId = "med-row-" + Date.now() + Math.random().toString(36).substr(2, 5);

  const row = document.createElement("div");
  row.className = "med-row-item";
  row.id = rowId;
  row.innerHTML = `
    <div class="med-row-inputs-grid">
      <div class="form-group">
        <label>Medicamento</label>
        <input type="text" class="med-nombre" value="${nombre}" placeholder="Ej. Paracetamol" oninput="syncPreview()">
      </div>
      <div class="form-group">
        <label>Dosis</label>
        <input type="text" class="med-dosis" value="${dosis}" placeholder="Ej. 500 mg" oninput="syncPreview()">
      </div>
      <div class="form-group">
        <label>Frecuencia</label>
        <input type="text" class="med-frecuencia" value="${frecuencia}" placeholder="Ej. C/8 horas" oninput="syncPreview()">
      </div>
    </div>
    <div class="med-row-inputs-grid-secondary">
      <div class="form-group">
        <label>Duración</label>
        <input type="text" class="med-duracion" value="${duracion}" placeholder="Ej. 5 días" oninput="syncPreview()">
      </div>
      <div class="form-group">
        <label>Instrucciones de Uso</label>
        <input type="text" class="med-indicaciones" value="${indicaciones}" placeholder="Ej. Después de comer" oninput="syncPreview()">
      </div>
    </div>
    <button type="button" class="btn-delete-row" title="Eliminar medicamento" onclick="deleteMedRow('${rowId}')">✕</button>
  `;

  container.appendChild(row);
  syncPreview();
}

function deleteMedRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    syncPreview();
  }
}

// CONSTRUCTOR DINÁMICO DE HOJA DE RECETA (HTML STRING)
function buildPrescriptionHTML(idSuffix, customTemplate = null) {
  const template = customTemplate || document.getElementById("form-template").value;
  const templateClass = `template-${template}`;
  const doctorData = getDoctorPrintData();

  return `
    <div class="recipe ${templateClass}" id="rec-sheet-${idSuffix}">
      <div class="watermark-container" aria-hidden="true">
        <img src="logo-clean.png" class="watermark-img" alt="" onerror="this.src='logo.jpg'">
      </div>

      <div class="header">
        <div class="header-left">
          <div class="doctor-logo">
            <img src="logo-clean.png" class="doctor-logo-img" alt="Logo" onerror="this.onerror=function(){this.outerHTML=SVG_LOGO_BACKUP;};this.src='logo.jpg';">
          </div>
          <div class="doctor-title">
            <span class="doctor-name">${escapeHtml(doctorData.name)}</span>
            <span class="doctor-subtitle">${escapeHtml(doctorData.specialtyCaps)}</span>
          </div>
        </div>

        <div class="header-right">
          <div class="specialty">${escapeHtml(doctorData.specialty)}</div>
          <div class="credentials-caption">CEDULAS PROFESIONALES</div>
          <div class="credentials">
            <div class="credential-row">
              <span class="credential-main">${doctorData.cedula.label} <span class="val-doc-ced">${escapeHtml(doctorData.cedula.number)}</span></span>
              <span class="credential-inst val-doc-ced-inst">${escapeHtml(doctorData.cedula.institution)}</span>
            </div>
            <div class="credential-row">
              <span class="credential-main">${doctorData.cedulaEsp.label} <span class="val-doc-cedesp">${escapeHtml(doctorData.cedulaEsp.number)}</span></span>
              <span class="credential-inst val-doc-cedesp-inst">${escapeHtml(doctorData.cedulaEsp.institution)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="header-rule">
        <div class="header-rule-main"></div>
        <div class="header-rule-accent"></div>
      </div>

      <div class="info-row">
        <div class="line-field field-paciente">
          <strong>Paciente</strong>
          <div class="line-value val-paciente"></div>
        </div>
        <div class="line-field field-edad">
          <strong>Edad</strong>
          <div class="line-value val-edad"></div>
        </div>
        <div class="line-field field-sexo">
          <strong>Sexo</strong>
          <div class="line-value val-sexo"></div>
        </div>
        <div class="line-field field-fecha">
          <strong>Fecha</strong>
          <div class="line-value val-fecha"></div>
        </div>
      </div>

      <div class="body-section">
        <div class="body-content-area">
          <div class="body-grid">
            <div class="rx-symbol">Rx</div>
            <div class="body-copy">
              <div class="body-title"></div>
              <div class="diagnosis-label">Notas clínicas</div>
              <div class="val-diagnostico-print"></div>
              <div class="val-meds-print-list"></div>
              <div class="val-obs-print-section"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-dark-bar">
        <div class="dark-bar">
          <div class="dark-bar-item contact-block">
            <div class="contact-label">TELEFONO CONSULTORIO</div>
            <span class="contact-value val-doc-tel">${escapeHtml(doctorData.consultorioTel)}</span>
          </div>
          <div class="dark-bar-item item-address contact-block">
            <div class="contact-label">UBICACION</div>
            <div class="address-text">
              <div class="contact-value val-doc-dir-primary">${escapeHtml(doctorData.dirPrimary)}</div>
              <div class="contact-subvalue val-doc-dir-secondary">${escapeHtml(doctorData.dirSecondary)}</div>
            </div>
          </div>
          <div class="dark-bar-item contact-block">
            <div class="contact-label">WHATSAPP</div>
            <span class="contact-value val-doc-cel">${escapeHtml(doctorData.whatsappTel)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// CAMBIO DE DISEÑO DE PAPEL EN PREVISUALIZACIÓN
function changePrintLayout() {
  const layout = document.getElementById("form-print-layout").value;
  const pvHalf = document.getElementById("pv-half");
  const pvFull = document.getElementById("pv-full");
  const pvTwoUp = document.getElementById("pv-two-up");
  const toolbarStatus = document.getElementById("preview-toolbar-status");

  pvHalf.style.display = "none";
  pvFull.style.display = "none";
  pvTwoUp.style.display = "none";

  if (layout === "half") {
    pvHalf.innerHTML = `<div class="sheet half-letter">${buildPrescriptionHTML("half")}</div>`;
    pvHalf.style.display = "block";
    toolbarStatus.textContent = "Vista Previa: Media Carta Horizontal (8.5\" x 5.5\")";
  } else if (layout === "full") {
    pvFull.innerHTML = `<div class="sheet full-letter">${buildPrescriptionHTML("full")}</div>`;
    pvFull.querySelector(".recipe").classList.add("layout-full");
    pvFull.style.display = "block";
    toolbarStatus.textContent = "Vista Previa: Carta Completa Horizontal (11\" x 8.5\")";
  } else if (layout === "two") {
    document.getElementById("pv-slot-top").innerHTML = buildPrescriptionHTML("two-top");
    document.getElementById("pv-slot-bottom").innerHTML = buildPrescriptionHTML("two-bottom");
    pvTwoUp.style.display = "block";
    toolbarStatus.textContent = "Vista Previa: 2 Media Carta apiladas en hoja Carta";
  }

  syncPreview();
}

// SINCRONIZAR VALORES DEL FORMULARIO CON PREVISUALIZACIÓN
function syncPreview() {
  updateFormModeUI();

  const paciente = document.getElementById("form-paciente").value;
  const edad = document.getElementById("form-edad").value;
  const sexo = document.getElementById("form-sexo").value;
  const fechaRaw = document.getElementById("form-fecha").value;
  const fecha = formatoFecha(fechaRaw);
  const diagnostico = document.getElementById("form-diagnostico").value;
  const observaciones = document.getElementById("form-observaciones").value;
  const template = document.getElementById("form-template").value;
  const noteMode = getActiveNoteMode();
  const layout = document.getElementById("form-print-layout").value;
  const doctorData = getDoctorPrintData();

  const medsData = templateUsesMedications(template) ? collectMedicationRows() : [];

  // Inyectar en los elementos correspondientes
  if (layout === "two") {
    const slotTop = document.getElementById("pv-slot-top");
    const slotBottom = document.getElementById("pv-slot-bottom");

    rebuildPreviewRecipeIfNeeded(slotTop, template, "two-top");
    rebuildPreviewRecipeIfNeeded(slotBottom, template, "two-bottom");

    injectRecipeData(slotTop, { template, noteMode, paciente, edad, sexo, fecha, diagnostico, observaciones, medsData, doctorData });
    injectRecipeData(slotBottom, { template, noteMode, paciente, edad, sexo, fecha, diagnostico, observaciones, medsData, doctorData });
  } else {
    const activeContainer = (layout === "half") ? document.getElementById("pv-half") : document.getElementById("pv-full");
    if (activeContainer) {
      rebuildPreviewRecipeIfNeeded(activeContainer, template, layout);
      injectRecipeData(activeContainer, { template, noteMode, paciente, edad, sexo, fecha, diagnostico, observaciones, medsData, doctorData });
    }
  }

  // Guardar en caliente borrador actual
  guardarBorradorActual();
}

function rebuildPreviewRecipeIfNeeded(container, requiredTemplate, suffix) {
  const currentRecipe = container.querySelector(".recipe");
  const requiredClass = `template-${requiredTemplate}`;
  if (!currentRecipe || !currentRecipe.classList.contains(requiredClass)) {
    if (suffix === "half") {
      container.innerHTML = `<div class="sheet half-letter">${buildPrescriptionHTML(suffix, requiredTemplate)}</div>`;
    } else if (suffix === "full") {
      container.innerHTML = `<div class="sheet full-letter">${buildPrescriptionHTML(suffix, requiredTemplate)}</div>`;
      container.querySelector(".recipe").classList.add("layout-full");
    } else {
      container.innerHTML = buildPrescriptionHTML(suffix, requiredTemplate);
    }
  }
}

// ZOOM DE LA VISTA PREVIA
function updateCanvasZoom(val) {
  document.getElementById("zoom-slider-percent").textContent = `${Math.round(val * 100)}%`;
  document.documentElement.style.setProperty("--zoom-scale", val);
}

function adjustZoomSlider(diff) {
  const slider = document.getElementById("zoom-slider-ctrl");
  let val = parseFloat(slider.value) + diff;
  val = Math.max(0.4, Math.min(1.5, val));
  slider.value = val;
  updateCanvasZoom(val);
}

// PERSISTENCIA LOCAL DE HISTORIAL (LOCALSTORAGE)
function cargarRecetasFromStorage() {
  try {
    const raw = localStorage.getItem("recetas_historico_db");
    recetasList = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error al cargar local storage", e);
    recetasList = [];
  }
}

function guardarRecetasInStorage() {
  localStorage.setItem("recetas_historico_db", JSON.stringify(recetasList));
}

// PERSISTENCIA DE BORRADOR (AUTOGUARDADO EN CALIENTE)
function guardarBorradorActual() {
  const medicamentos = collectMedicationRows({ keepBlankRows: true });
  const template = document.getElementById("form-template").value;

  const draftObj = {
    paciente: document.getElementById("form-paciente").value,
    edad: document.getElementById("form-edad").value,
    sexo: document.getElementById("form-sexo").value,
    fecha: document.getElementById("form-fecha").value,
    diagnostico: document.getElementById("form-diagnostico").value,
    observaciones: document.getElementById("form-observaciones").value,
    template,
    noteMode: normalizeNoteMode(template, document.getElementById("form-note-mode").value),
    printLayout: document.getElementById("form-print-layout").value,
    medicamentos,
    activeEditId
  };
  localStorage.setItem("receta_live_draft", JSON.stringify(draftObj));
}

function cargarBorradorActual() {
  const raw = localStorage.getItem("receta_live_draft");
  if (raw) {
    try {
      const r = JSON.parse(raw);
      document.getElementById("form-paciente").value = r.paciente || "";
      document.getElementById("form-edad").value = r.edad || "";
      document.getElementById("form-sexo").value = r.sexo || "M";
      document.getElementById("form-fecha").value = r.fecha || new Date().toISOString().split("T")[0];
      document.getElementById("form-diagnostico").value = r.diagnostico || "";
      document.getElementById("form-observaciones").value = r.observaciones || "";
      document.getElementById("form-template").value = r.template || "diagnostico";
      document.getElementById("form-note-mode").value = normalizeNoteMode(r.template || "diagnostico", r.noteMode || "indicaciones");
      document.getElementById("form-print-layout").value = r.printLayout || "two";
      activeEditId = r.activeEditId || null;

      const container = document.getElementById("meds-rows-list");
      container.innerHTML = "";
      if (r.medicamentos && r.medicamentos.length > 0) {
        r.medicamentos.forEach(m => {
          addMedRow(m.nombre, m.dosis, m.frecuencia, m.duracion, m.indicaciones);
        });
      } else {
        addMedRow();
      }

      if (activeEditId) {
        document.getElementById("btn-submit-form").innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 3v5h8M17 21v-8H7v8"/></svg>
          Actualizar Receta
        `;
      }

      updateFormModeUI();
    } catch (e) {
      console.error("Error al recuperar borrador", e);
    }
  }
}

// GUARDAR / CREAR HISTORIAL DESDE EL FORMULARIO
function guardarRecetaDesdeForm(showAlert = true) {
  const paciente = document.getElementById("form-paciente").value.trim();
  const edad = document.getElementById("form-edad").value.trim();
  const sexo = document.getElementById("form-sexo").value;
  const fecha = document.getElementById("form-fecha").value;
  const diagnostico = document.getElementById("form-diagnostico").value.trim();
  const observaciones = document.getElementById("form-observaciones").value.trim();
  const template = document.getElementById("form-template").value;
  const noteMode = normalizeNoteMode(template, document.getElementById("form-note-mode").value);
  const templateMeta = getTemplateMeta(template, noteMode);
  const printLayout = document.getElementById("form-print-layout").value;

  if (!paciente) {
    showToast("Por favor, introduce el nombre del paciente antes de guardar o imprimir.", "warning");
    return null;
  }

  const medicamentos = templateUsesMedications(template) ? collectMedicationRows() : [];

  let recetaGuardada = null;

  if (activeEditId) {
    const index = recetasList.findIndex(r => r.id === activeEditId);
    if (index !== -1) {
      recetasList[index] = {
        id: activeEditId,
        paciente, edad, sexo, fecha, diagnostico, observaciones, template, noteMode, printLayout, medicamentos,
        updatedAt: new Date().toISOString()
      };
      recetaGuardada = recetasList[index];
      if (showAlert) showToast(`Se actualizó ${templateMeta.shortLabel.toLowerCase()} en el historial.`, "success");
    }
    activeEditId = null;
    document.getElementById("btn-submit-form").innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 3v5h8M17 21v-8H7v8"/></svg>
      Guardar Receta
    `;
  } else {
    const nuevaReceta = {
      id: Date.now().toString(),
      paciente, edad, sexo, fecha, diagnostico, observaciones, template, noteMode, printLayout, medicamentos,
      createdAt: new Date().toISOString()
    };
    recetasList.unshift(nuevaReceta);
    recetaGuardada = nuevaReceta;
    if (showAlert) showToast(`Se guardó ${templateMeta.shortLabel.toLowerCase()} en el historial.`, "success");
  }

  guardarRecetasInStorage();
  limpiarFormulario();
  clickTab("tab-history");
  return recetaGuardada;
}

function guardarRecetaForm() {
  guardarRecetaDesdeForm(true);
}

function limpiarFormulario() {
  activeEditId = null;
  document.getElementById("form-paciente").value = "";
  document.getElementById("form-edad").value = "";
  document.getElementById("form-sexo").value = "M";
  document.getElementById("form-fecha").value = new Date().toISOString().split("T")[0];
  document.getElementById("form-diagnostico").value = "";
  document.getElementById("form-observaciones").value = "";
  document.getElementById("form-template").value = "diagnostico";
  document.getElementById("form-note-mode").value = "indicaciones";
  document.getElementById("form-print-layout").value = "two";

  document.getElementById("meds-rows-list").innerHTML = "";
  addMedRow();

  document.getElementById("btn-submit-form").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 3v5h8M17 21v-8H7v8"/></svg>
    Guardar Receta
  `;

  updateFormModeUI();
  changePrintLayout();
  syncPreview();
}

function formatSexoLabel(sexo = "") {
  if (sexo === "M") return "Masculino";
  if (sexo === "F") return "Femenino";
  return sexo || "No registrado";
}

function formatLayoutLabel(layout = "") {
  if (layout === "half") return "Media carta";
  if (layout === "full") return "Carta completa";
  return "2 por hoja";
}

function buildMedicationSummaryChips(meds = [], limit = 3) {
  if (!meds.length) {
    return `<span class="history-chip history-chip-muted">Sin medicamentos capturados</span>`;
  }

  const visible = meds.slice(0, limit).map(m => `
    <span class="history-chip">${escapeHtml(m.nombre || "Medicamento")}</span>
  `).join("");

  const extra = meds.length > limit
    ? `<span class="history-chip history-chip-muted">+${meds.length - limit} más</span>`
    : "";

  return visible + extra;
}

function buildHistoryCardContent(recipe) {
  const meta = getTemplateMeta(recipe.template, recipe.noteMode);
  const meds = recipe.medicamentos || [];

  if (templateUsesMedications(recipe.template)) {
    const noteSummary = recipe.diagnostico
      ? `<p class="history-note">${escapeHtml(recipe.diagnostico)}</p>`
      : `<p class="history-note is-muted">${escapeHtml(meta.detailEmptyNote)}</p>`;

    return `
      <div class="history-section">
        <span class="history-section-label">${escapeHtml(meta.noteLabel)}</span>
        ${noteSummary}
      </div>
      <div class="history-section">
        <span class="history-section-label">Medicamentos</span>
        <div class="history-chip-row">
          ${buildMedicationSummaryChips(meds)}
        </div>
      </div>
    `;
  }

  const requestText = recipe.diagnostico
    ? escapeHtml(recipe.diagnostico)
    : escapeHtml(meta.detailEmptyNote);

  const observations = recipe.observaciones
    ? `<p class="history-note">${escapeHtml(recipe.observaciones)}</p>`
    : `<p class="history-note is-muted">${escapeHtml(meta.detailEmptyObs)}</p>`;

  return `
    <div class="history-section">
      <span class="history-section-label">${escapeHtml(meta.noteLabel)}</span>
      <p class="history-note">${requestText}</p>
    </div>
    <div class="history-section">
      <span class="history-section-label">${escapeHtml(meta.observationsLabel)}</span>
      ${observations}
    </div>
  `;
}

// RENDERIZADO DEL HISTORIAL
function renderTable() {
  const list = document.getElementById("db-history-list");
  const summary = document.getElementById("history-summary");
  const searchInput = document.getElementById("db-search");
  const searchVal = searchInput.value.toLowerCase().trim();
  const searchField = document.getElementById("db-search-field").value;
  const typeFilter = document.getElementById("db-type-filter").value;

  const placeholderMap = {
    all: "Buscar por paciente, medicamento, estudio o fecha...",
    paciente: "Buscar por nombre del paciente...",
    fecha: "Buscar por fecha, por ejemplo 26/06/2026...",
    medicamento: "Buscar por medicamento...",
    nota: "Buscar por diagnóstico, indicaciones o solicitud..."
  };
  searchInput.placeholder = placeholderMap[searchField] || placeholderMap.all;

  const filtradas = recetasList.filter(r => {
    if (typeFilter !== "all" && r.template !== typeFilter) {
      return false;
    }

    const meds = r.medicamentos || [];
    const medsString = meds.map(m => `${m.nombre} ${m.dosis} ${m.frecuencia} ${m.duracion} ${m.indicaciones}`).join(" ");
    const noteString = `${r.diagnostico || ""} ${r.observaciones || ""}`.toLowerCase();
    const patientString = `${r.paciente || ""}`.toLowerCase();
    const formattedDate = formatoFecha(r.fecha).toLowerCase();
    const isoDate = `${r.fecha || ""}`.toLowerCase();
    const fullString = `${patientString} ${noteString} ${(r.template || "").toLowerCase()} ${medsString.toLowerCase()} ${formattedDate} ${isoDate}`;

    if (!searchVal) return true;

    if (searchField === "paciente") return patientString.includes(searchVal);
    if (searchField === "fecha") return formattedDate.includes(searchVal) || isoDate.includes(searchVal);
    if (searchField === "medicamento") return medsString.toLowerCase().includes(searchVal);
    if (searchField === "nota") return noteString.includes(searchVal);
    return fullString.includes(searchVal);
  });

  const recetaCount = recetasList.filter(r => templateUsesMedications(r.template)).length;
  const rxCount = recetasList.length - recetaCount;

  summary.innerHTML = `
    <div class="history-stat-card">
      <span class="history-stat-label">Total</span>
      <strong class="history-stat-value">${recetasList.length}</strong>
    </div>
    <div class="history-stat-card">
      <span class="history-stat-label">Recetas</span>
      <strong class="history-stat-value">${recetaCount}</strong>
    </div>
    <div class="history-stat-card">
      <span class="history-stat-label">Rx</span>
      <strong class="history-stat-value">${rxCount}</strong>
    </div>
    <div class="history-stat-card">
      <span class="history-stat-label">Resultados</span>
      <strong class="history-stat-value">${filtradas.length}</strong>
    </div>
  `;

  list.innerHTML = "";

  if (filtradas.length === 0) {
    list.innerHTML = `
      <div class="history-empty-card">
        <strong>No se encontraron registros.</strong>
        <p>Prueba con otro nombre, medicamento, estudio o fecha.</p>
      </div>
    `;
    return;
  }

  filtradas.forEach(r => {
    const meta = getTemplateMeta(r.template, r.noteMode);
    const article = document.createElement("article");
    article.className = "history-card";
    article.onclick = () => verDetalleReceta(r.id);
    article.innerHTML = `
      <div class="history-card-top">
        <div>
          <div class="history-card-title-row">
            <h3 class="history-card-title">${escapeHtml(r.paciente || "Paciente sin nombre")}</h3>
            <span class="history-type-badge ${templateUsesMedications(r.template) ? "is-prescription" : "is-rx"}">${escapeHtml(meta.shortLabel)}</span>
          </div>
          <div class="history-card-meta">
            <span>${escapeHtml(r.edad || "Edad no registrada")}</span>
            <span>${escapeHtml(formatSexoLabel(r.sexo))}</span>
            <span>${escapeHtml(formatoFecha(r.fecha))}</span>
            <span>${escapeHtml(formatLayoutLabel(r.printLayout))}</span>
          </div>
        </div>
        <button class="history-open-btn" type="button" onclick="event.stopPropagation(); verDetalleReceta('${r.id}')">Ver detalle</button>
      </div>

      <div class="history-card-body">
        ${buildHistoryCardContent(r)}
      </div>

      <div class="history-actions">
        <button class="btn btn-secondary btn-small" type="button" onclick="event.stopPropagation(); editarReceta('${r.id}')">Editar</button>
        <button class="btn btn-secondary btn-small" type="button" onclick="event.stopPropagation(); duplicarReceta('${r.id}')">Duplicar</button>
        <button class="btn btn-success btn-small" type="button" onclick="event.stopPropagation(); imprimirDesdeID('${r.id}')">Imprimir</button>
        <button class="btn btn-danger btn-small" type="button" onclick="event.stopPropagation(); eliminarReceta('${r.id}')">Eliminar</button>
      </div>
    `;

    list.appendChild(article);
  });
}

// CRUD ACCIONES
function editarReceta(id) {
  const r = recetasList.find(item => item.id === id);
  if (!r) return;

  activeEditId = r.id;

  document.getElementById("form-paciente").value = r.paciente;
  document.getElementById("form-edad").value = r.edad;
  document.getElementById("form-sexo").value = r.sexo;
  document.getElementById("form-fecha").value = r.fecha;
  document.getElementById("form-diagnostico").value = r.diagnostico;
  document.getElementById("form-observaciones").value = r.observaciones;
  document.getElementById("form-template").value = r.template;
  document.getElementById("form-note-mode").value = normalizeNoteMode(r.template, r.noteMode);
  document.getElementById("form-print-layout").value = r.printLayout;

  const container = document.getElementById("meds-rows-list");
  container.innerHTML = "";
  
  if (r.medicamentos && r.medicamentos.length > 0) {
    r.medicamentos.forEach(m => {
      addMedRow(m.nombre, m.dosis, m.frecuencia, m.duracion, m.indicaciones);
    });
  } else {
    addMedRow();
  }

  document.getElementById("btn-submit-form").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 3v5h8M17 21v-8H7v8"/></svg>
    Actualizar Receta
  `;

  clickTab("tab-form");
  changePrintLayout();
  syncPreview();
}

function duplicarReceta(id) {
  const r = recetasList.find(item => item.id === id);
  if (!r) return;

  activeEditId = null; 
  document.getElementById("form-paciente").value = r.paciente;
  document.getElementById("form-edad").value = r.edad;
  document.getElementById("form-sexo").value = r.sexo;
  document.getElementById("form-fecha").value = new Date().toISOString().split("T")[0]; 
  document.getElementById("form-diagnostico").value = r.diagnostico;
  document.getElementById("form-observaciones").value = r.observaciones;
  document.getElementById("form-template").value = r.template;
  document.getElementById("form-note-mode").value = normalizeNoteMode(r.template, r.noteMode);
  document.getElementById("form-print-layout").value = r.printLayout;

  const container = document.getElementById("meds-rows-list");
  container.innerHTML = "";
  if (r.medicamentos && r.medicamentos.length > 0) {
    r.medicamentos.forEach(m => {
      addMedRow(m.nombre, m.dosis, m.frecuencia, m.duracion, m.indicaciones);
    });
  } else {
    addMedRow();
  }

  document.getElementById("btn-submit-form").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 3v5h8M17 21v-8H7v8"/></svg>
    Guardar Receta
  `;

  clickTab("tab-form");
  changePrintLayout();
  syncPreview();
  showToast("Copia cargada en borrador para un nuevo registro.", "info");
}

function eliminarReceta(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta receta permanentemente?")) {
    recetasList = recetasList.filter(item => item.id !== id);
    guardarRecetasInStorage();
    renderTable();
    showToast("Receta eliminada del historial.", "success");
  }
}

function buildDetailSection(title, content, emptyText, extraClass = "") {
  const safeContent = String(content || "").trim();
  const body = safeContent
    ? formatRichText(safeContent)
    : `<span class="detail-empty-text">${escapeHtml(emptyText)}</span>`;

  return `
    <section class="detail-section ${extraClass}">
      <span class="detail-section-label">${escapeHtml(title)}</span>
      <div class="detail-section-box">${body}</div>
    </section>
  `;
}

function buildDetailMedicationList(medicamentos = []) {
  if (!medicamentos.length) {
    return `<span class="detail-empty-text">Sin medicamentos registrados.</span>`;
  }

  return `
    <div class="detail-med-list">
      ${medicamentos.map((m, index) => {
        const detailLine = [m.dosis, m.frecuencia, m.duracion].filter(Boolean).join(" | ");
        const indications = m.indicaciones
          ? `<div class="detail-med-indications">${escapeHtml(m.indicaciones)}</div>`
          : "";

        return `
          <div class="detail-med-item">
            <div class="detail-med-head">
              <span class="detail-med-index">${index + 1}.</span>
              <strong>${escapeHtml(m.nombre || "Medicamento")}</strong>
              ${detailLine ? `<span class="detail-med-meta">${escapeHtml(detailLine)}</span>` : ""}
            </div>
            ${indications}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// MODAL DE DETALLE
function verDetalleReceta(id) {
  const r = recetasList.find(item => item.id === id);
  if (!r) return;

  const modal = document.getElementById("detail-modal");
  const meta = getTemplateMeta(r.template, r.noteMode);
  const isPrescription = templateUsesMedications(r.template);
  const meds = r.medicamentos || [];

  document.getElementById("modal-patient-name").textContent = r.paciente || "Detalle";

  document.getElementById("modal-details-body").innerHTML = `
    <div class="detail-hero">
      <div>
        <div class="detail-hero-top">
          <span class="history-type-badge ${isPrescription ? "is-prescription" : "is-rx"}">${escapeHtml(meta.label)}</span>
          <span class="detail-hero-date">${escapeHtml(formatoFecha(r.fecha))}</span>
        </div>
        <div class="detail-hero-meta">
          <span>${escapeHtml(r.edad || "Edad no registrada")}</span>
          <span>${escapeHtml(formatSexoLabel(r.sexo))}</span>
          <span>${escapeHtml(formatLayoutLabel(r.printLayout))}</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      ${buildDetailSection(meta.noteLabel, r.diagnostico, meta.detailEmptyNote)}
      ${isPrescription ? `
        <section class="detail-section">
          <span class="detail-section-label">Medicamentos / Tratamiento</span>
          <div class="detail-section-box">
            ${buildDetailMedicationList(meds)}
          </div>
        </section>
      ` : ""}
      ${buildDetailSection(meta.observationsLabel, r.observaciones, meta.detailEmptyObs)}
    </div>
  `;

  document.getElementById("modal-btn-print").onclick = () => {
    closeDetailModal();
    imprimirDesdeObjeto(r);
  };

  document.getElementById("modal-btn-edit").onclick = () => {
    closeDetailModal();
    editarReceta(r.id);
  };

  modal.classList.add("active");
}

function closeDetailModal() {
  document.getElementById("detail-modal").classList.remove("active");
}

function imprimirActual() {
  const recetaObj = guardarRecetaDesdeForm(false);
  if (recetaObj) {
    imprimirDesdeObjeto(recetaObj);
  }
}

function imprimirDesdeID(id) {
  const r = recetasList.find(item => item.id === id);
  if (r) {
    imprimirDesdeObjeto(r);
  }
}

function imprimirDesdeObjeto(recetaObj) {
  const printCanvas = document.getElementById("print-canvas");
  const printStyle = document.getElementById("dynamic-print-style");

  const layout = recetaObj.printLayout;
  const template = recetaObj.template;

  if (layout === "half") {
    printStyle.innerHTML = "@page { size: 8.5in 5.5in; margin: 0; }";
    document.body.className = "print-half";
    printCanvas.innerHTML = `
      <div class="sheet half-letter">
        ${buildPrescriptionHTML("print", template)}
      </div>
    `;
  } else if (layout === "full") {
    printStyle.innerHTML = "@page { size: 11in 8.5in; margin: 0; }";
    document.body.className = "print-full";
    printCanvas.innerHTML = `
      <div class="sheet full-letter">
        ${buildPrescriptionHTML("print", template)}
      </div>
    `;
    printCanvas.querySelector(".recipe").classList.add("layout-full");
  } else if (layout === "two") {
    printStyle.innerHTML = "@page { size: 8.5in 11in; margin: 0; }";
    document.body.className = "print-two";
    
    printCanvas.innerHTML = `
      <div class="two-up-wrapper">
        <div class="page-letter">
          <div class="slot top" id="print-slot-top">
            ${buildPrescriptionHTML("print-top", template)}
          </div>
          <div class="cut-line"></div>
          <div class="slot bottom" id="print-slot-bottom">
            ${buildPrescriptionHTML("print-bottom", template)}
          </div>
        </div>
      </div>
    `;
  }

  const doctorData = getDoctorPrintData();

  if (layout === "two") {
    injectRecipeData(document.getElementById("print-slot-top"), {
      template,
      noteMode: recetaObj.noteMode || "indicaciones",
      paciente: recetaObj.paciente || "",
      edad: recetaObj.edad || "",
      sexo: recetaObj.sexo || "",
      fecha: formatoFecha(recetaObj.fecha) || "",
      diagnostico: recetaObj.diagnostico || "",
      observaciones: recetaObj.observaciones || "",
      medsData: recetaObj.medicamentos || [],
      doctorData
    });
    injectRecipeData(document.getElementById("print-slot-bottom"), {
      template,
      noteMode: recetaObj.noteMode || "indicaciones",
      paciente: recetaObj.paciente || "",
      edad: recetaObj.edad || "",
      sexo: recetaObj.sexo || "",
      fecha: formatoFecha(recetaObj.fecha) || "",
      diagnostico: recetaObj.diagnostico || "",
      observaciones: recetaObj.observaciones || "",
      medsData: recetaObj.medicamentos || [],
      doctorData
    });
  } else {
    injectRecipeData(printCanvas, {
      template,
      noteMode: recetaObj.noteMode || "indicaciones",
      paciente: recetaObj.paciente || "",
      edad: recetaObj.edad || "",
      sexo: recetaObj.sexo || "",
      fecha: formatoFecha(recetaObj.fecha) || "",
      diagnostico: recetaObj.diagnostico || "",
      observaciones: recetaObj.observaciones || "",
      medsData: recetaObj.medicamentos || [],
      doctorData
    });
  }

  // Lanzar la impresión del sistema operativo
  setTimeout(() => {
    window.print();
  }, 50);
}

// RESPALDOS DE INFORMACIÓN (JSON EXPORT/IMPORT)
function exportarBackupJSON() {
  if (recetasList.length === 0) {
    showToast("No hay recetas en el historial para exportar.", "warning");
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetasList, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `Respaldo_Recetas_Dr_Zamorano_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Copia de seguridad descargada correctamente.", "success");
}

function importarBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importadas = JSON.parse(e.target.result);
      if (Array.isArray(importadas)) {
        const currentIds = new Set(recetasList.map(r => r.id));
        let insertados = 0;

        importadas.forEach(r => {
          if (r.id && r.paciente && !currentIds.has(r.id)) {
            recetasList.push(r);
            insertados++;
          }
        });

        recetasList.sort((a,b) => b.id.localeCompare(a.id));

        guardarRecetasInStorage();
        renderTable();
        showToast(`Respaldo importado correctamente. Se agregaron ${insertados} recetas nuevas.`, "success");
      } else {
        showToast("El archivo JSON no corresponde a un formato de historial de recetas médicas válido.", "danger");
      }
    } catch (err) {
      showToast("Error al leer el archivo JSON. Verifica que sea un archivo de respaldo correcto.", "danger");
      console.error(err);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}
