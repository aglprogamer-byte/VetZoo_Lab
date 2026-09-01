/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: FieldNotebook.js — Cuaderno de Campo Digital & Bitácora SOAP
 *
 * Sistema de registro clínico veterinario bajo formato SOAP (Subjetivo,
 * Objetivo, Análisis, Plan) con historial cronológico y exportación.
 */

import { achievements } from "../core/Achievements.js";

const NOTEBOOK_STORAGE_KEY = "vetzoo_field_notebook_entries";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed.slice(0, 2500) : fallback;
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const soap = entry.soap && typeof entry.soap === "object" ? entry.soap : {};
  const animalName = normalizeText(entry.animalName, "Paciente sin nombre");
  const species = normalizeText(entry.species, "Sin especie");
  const type = ["clinica", "odontologia", "pastos"].includes(entry.type) ? entry.type : "clinica";

  return {
    id: typeof entry.id === "string" ? entry.id : `note_${Date.now()}`,
    date: typeof entry.date === "string" ? entry.date : new Date().toISOString(),
    animalId: typeof entry.animalId === "string" ? entry.animalId : "custom",
    animalName,
    species,
    type,
    soap: {
      s: normalizeText(soap.s, "Sin observaciones subjetivas."),
      o: normalizeText(soap.o, "Sin constantes registradas."),
      a: normalizeText(soap.a, "Diagnóstico presuntivo pendiente."),
      p: normalizeText(soap.p, "Conducta de soporte.")
    }
  };
}

const INITIAL_ENTRIES = [
  {
    id: "note_1",
    date: "2026-08-28 08:30",
    animalId: "cow_017",
    animalName: "Vaca #017 (Margarita)",
    species: "Bovino Holstein",
    type: "clinica",
    soap: {
      s: "Vaca presenta decúbito esternal a las 12h posparto de parto gemelar. Cabeza desviada hacia el flanco derecho.",
      o: "T: 36.8°C (Hipotermia), FC: 96 lpm (Taquicardia débil), FR: 18 rpm. Hipotonía ruminal (0 mov/2min). Midriasis moderada pupilar, reflejo pupilar lento. Extremidades frías al tacto.",
      a: "Hipocalcemia Puerperal Aguda (Fiebre de Leche / Paresia Puerperal) Grado II.",
      p: "Infusión IV lenta de 500 mL de Borogluconato de Calcio al 23% + 500 mL SC de soporte. Monitoreo auscultatorio cardíaco estricto durante la administración."
    }
  },
  {
    id: "note_2",
    date: "2026-08-29 11:15",
    animalId: "horse_004",
    animalName: "Equino #004 (Relámpago)",
    species: "Caballo Criollo",
    type: "odontologia",
    soap: {
      s: "Caballo tira de la rienda derecha y bota granos enteros de avena en el comedero (quidding).",
      o: "Examen con abrebocas Haussmann: presencia de puntas de muela agudas en arcada superior vestibular y arcada inferior lingual. Úlcera superficial en mucosa yugal derecha.",
      a: "Odontalgia por desbalance oclusal (puntas de esmalte).",
      p: "Sedación con Xilacina 2% (0.5 mg/kg IV) + Odontoplastia y nivelación con escofinas motorizadas de carburo de tungsteno. Lavado con clorhexidina 0.12%."
    }
  }
];

export class FieldNotebook {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.entries = this.loadEntries();
    this.activeFilter = "all";
    this.init();
  }

  loadEntries() {
    try {
      const raw = localStorage.getItem(NOTEBOOK_STORAGE_KEY);
      if (!raw) return INITIAL_ENTRIES.map(entry => normalizeEntry(entry)).filter(Boolean);

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return INITIAL_ENTRIES.map(entry => normalizeEntry(entry)).filter(Boolean);

      const validEntries = parsed.map(normalizeEntry).filter(Boolean);
      return validEntries.length ? validEntries : INITIAL_ENTRIES.map(entry => normalizeEntry(entry)).filter(Boolean);
    } catch (e) {
      console.warn("FieldNotebook: los datos guardados están corruptos o no son válidos; se restauran los valores iniciales.", e);
      return INITIAL_ENTRIES.map(entry => normalizeEntry(entry)).filter(Boolean);
    }
  }

  saveEntries() {
    try {
      const safeEntries = this.entries.map(normalizeEntry).filter(Boolean);
      localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(safeEntries));
      this.entries = safeEntries;
    } catch (e) {
      console.warn("FieldNotebook: no se pudo guardar la bitácora. El contenido sigue activo en memoria.", e);
    }
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const filtered = this.activeFilter === "all" ? this.entries : this.entries.filter(e => e.type === this.activeFilter);
    const safeEntries = filtered.map(entry => ({
      ...entry,
      animalName: escapeHtml(entry.animalName),
      species: escapeHtml(entry.species),
      type: escapeHtml(entry.type),
      soap: {
        s: escapeHtml(entry.soap.s),
        o: escapeHtml(entry.soap.o),
        a: escapeHtml(entry.soap.a),
        p: escapeHtml(entry.soap.p)
      }
    }));

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shadow-inner">
              📓
            </div>
            <div>
              <h2 class="display text-xl sm:text-2xl font-bold text-white m-0">Cuaderno de Campo & Bitácora Clínica SOAP</h2>
              <p class="text-xs text-[var(--muted)] m-0">Registro protocolario de historias clínicas, evolución de pacientes y terapéutica de hato.</p>
            </div>
          </div>

          <div class="flex gap-2">
            <button id="btnOpenNewNoteModal" class="btn px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5" type="button" aria-label="Crear nueva nota del cuaderno SOAP">
              <span aria-hidden="true">✍️</span> Nueva Entrada SOAP
            </button>
            <button id="btnExportNotesTxt" class="btn px-4 py-2 rounded-xl bg-black/40 border border-white/10 hover:bg-white/10 text-gray-200 text-xs font-semibold flex items-center gap-1.5" type="button" aria-label="Exportar el cuaderno a archivo de texto">
              <span aria-hidden="true">📄</span> Exportar Bitácora
            </button>
          </div>
        </div>

        <!-- Filtros y Resumen -->
        <div class="glass p-4 rounded-2xl border border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-gray-400 font-bold">Filtrar entradas:</span>
            <button class="btn-filter-note btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'all' ? 'bg-white/10 text-white border-white/20' : 'text-gray-400 border-white/5'}" data-f="all" type="button" aria-label="Mostrar todas las entradas del cuaderno">Todas (${this.entries.length})</button>
            <button class="btn-filter-note btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'clinica' ? 'bg-purple-950 text-purple-300 border-purple-500/40' : 'text-gray-400 border-white/5'}" data-f="clinica" type="button" aria-label="Filtrar entradas clínicas">🩺 Clínica</button>
            <button class="btn-filter-note btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'odontologia' ? 'bg-blue-950 text-blue-300 border-blue-500/40' : 'text-gray-400 border-white/5'}" data-f="odontologia" type="button" aria-label="Filtrar entradas de odontología">🦷 Odontología</button>
            <button class="btn-filter-note btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'pastos' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'text-gray-400 border-white/5'}" data-f="pastos" type="button" aria-label="Filtrar entradas de pasturas y campo">🌿 Campo & Pasturas</button>
          </div>
          <span class="mono text-xs text-purple-300 font-bold">${this.entries.length} Registros Guardados</span>
        </div>

        <!-- Formulario Modal / Inline para Nueva Entrada (Oculto por defecto) -->
        <div id="newNoteFormContainer" class="hidden glass p-6 rounded-3xl border border-purple-500/40 bg-black/70 space-y-4 shadow-2xl">
          <div class="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 class="display font-bold text-white text-base m-0">Registrar Nueva Nota Clínica (Estructura SOAP)</h3>
            <button id="btnCloseNoteForm" class="btn p-1 text-gray-400 hover:text-white" type="button" aria-label="Cerrar formulario de nueva nota">✕</button>
          </div>

          <div class="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label class="font-bold text-gray-300 block mb-1">Nombre / ID del Animal:</label>
              <input type="text" id="inputNoteAnimal" placeholder="Ej. Vaca #017 o Lote 3" class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white">
            </div>
            <div>
              <label class="font-bold text-gray-300 block mb-1">Especie:</label>
              <select id="selectNoteSpecies" class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white">
                <option value="Bovino">Bovino</option>
                <option value="Equino">Equino</option>
                <option value="Ovino">Ovino</option>
                <option value="Porcino">Porcino</option>
                <option value="Canino">Canino</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-gray-300 block mb-1">Tipo de Evento:</label>
              <select id="selectNoteType" class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white">
                <option value="clinica">🩺 Clínica Médica</option>
                <option value="odontologia">🦷 Odontología / Manejo</option>
                <option value="pastos">🌿 Pasturas & Nutrición</option>
              </select>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-amber-300 block mb-1">S — Subjetivo (Anamnesis, motivo de consulta, signos reportados por el operario):</label>
              <textarea id="inputSoapS" rows="2" placeholder="Describir lo que relata el encargado..." class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white"></textarea>
            </div>
            <div>
              <label class="font-bold text-blue-300 block mb-1">O — Objetivo (Constantes vitales, inspección física, auscultación, laboratorio):</label>
              <textarea id="inputSoapO" rows="2" placeholder="T, FC, FR, motilidad ruminal, hidratación, hallazgos físicos..." class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white"></textarea>
            </div>
            <div>
              <label class="font-bold text-emerald-300 block mb-1">A — Análisis / Diagnóstico (Hipótesis presuntiva o definitiva y diagnósticos diferenciales):</label>
              <textarea id="inputSoapA" rows="2" placeholder="Diagnóstico definitivo y justificación..." class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white"></textarea>
            </div>
            <div>
              <label class="font-bold text-purple-300 block mb-1">P — Plan Terapéutico (Fármacos, dosis, vías, tiempos de retiro y recomendaciones de manejo):</label>
              <textarea id="inputSoapP" rows="2" placeholder="Medicamentos, dosis en mg y mL, vía, días de retiro y seguimiento..." class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button id="btnCancelNoteForm" class="btn px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-xs" type="button" aria-label="Cancelar la nueva nota">Cancelar</button>
            <button id="btnSaveNoteSubmit" class="btn px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg" type="button" aria-label="Guardar la entrada en el cuaderno SOAP">Guardar Entrada en Bitácora</button>
          </div>
        </div>

        <!-- Lista Cronológica de Entradas -->
        <div class="space-y-4">
          ${safeEntries.map(entry => `
            <div class="glass p-5 rounded-2xl border border-[var(--border)] bg-black/40 space-y-3 hover:border-purple-500/40 transition">
              <div class="flex flex-wrap justify-between items-start gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <div class="flex items-center gap-2">
                    <b class="text-sm text-white">${entry.animalName}</b>
                    <span class="badge-tag bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">${entry.species}</span>
                    <span class="chip text-[9px] uppercase mono py-0.5 px-2">${entry.type}</span>
                  </div>
                  <span class="mono text-[10px] text-gray-400 block mt-0.5">📅 ${escapeHtml(entry.date)}</span>
                </div>
                <button class="btn-delete-note btn text-gray-500 hover:text-rose-400 text-xs p-1" data-id="${escapeHtml(entry.id)}" title="Eliminar entrada" type="button" aria-label="Eliminar entrada del cuaderno">🗑️</button>
              </div>

              <div class="grid sm:grid-cols-2 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <b class="text-amber-300 mono text-[10px] uppercase block">S (Subjetivo):</b>
                  <p class="text-gray-300 leading-relaxed m-0">${entry.soap.s}</p>
                </div>
                <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <b class="text-blue-300 mono text-[10px] uppercase block">O (Objetivo):</b>
                  <p class="text-gray-300 leading-relaxed m-0">${entry.soap.o}</p>
                </div>
                <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <b class="text-emerald-300 mono text-[10px] uppercase block">A (Análisis):</b>
                  <p class="text-gray-300 leading-relaxed m-0">${entry.soap.a}</p>
                </div>
                <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <b class="text-purple-300 mono text-[10px] uppercase block">P (Plan):</b>
                  <p class="text-gray-300 leading-relaxed m-0">${entry.soap.p}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const modalForm = this.container.querySelector("#newNoteFormContainer");
    const btnOpen = this.container.querySelector("#btnOpenNewNoteModal");
    const btnClose = this.container.querySelector("#btnCloseNoteForm");
    const btnCancel = this.container.querySelector("#btnCancelNoteForm");

    if (btnOpen && modalForm) btnOpen.onclick = () => modalForm.classList.remove("hidden");
    if (btnClose && modalForm) btnClose.onclick = () => modalForm.classList.add("hidden");
    if (btnCancel && modalForm) btnCancel.onclick = () => modalForm.classList.add("hidden");

    this.container.querySelectorAll(".btn-filter-note").forEach(btn => {
      btn.onclick = () => {
        this.activeFilter = btn.dataset.f;
        this.render();
      };
    });

    const btnSave = this.container.querySelector("#btnSaveNoteSubmit");
    if (btnSave) {
      btnSave.onclick = () => {
        const aName = normalizeText(this.container.querySelector("#inputNoteAnimal").value, "Paciente S/N");
        const sp = normalizeText(this.container.querySelector("#selectNoteSpecies").value, "Sin especie");
        const tp = ["clinica", "odontologia", "pastos"].includes(this.container.querySelector("#selectNoteType").value)
          ? this.container.querySelector("#selectNoteType").value
          : "clinica";
        const s = normalizeText(this.container.querySelector("#inputSoapS").value, "Sin observaciones subjetivas.");
        const o = normalizeText(this.container.querySelector("#inputSoapO").value, "Sin constantes registradas.");
        const a = normalizeText(this.container.querySelector("#inputSoapA").value, "Diagnóstico presuntivo pendiente.");
        const p = normalizeText(this.container.querySelector("#inputSoapP").value, "Conducta de soporte.");

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newEntry = {
          id: `note_${Date.now()}`,
          date: dateStr,
          animalId: "custom",
          animalName: aName,
          species: sp,
          type: tp,
          soap: { s, o, a, p }
        };

        this.entries.unshift(newEntry);
        this.saveEntries();
        achievements.recordFieldNote();
        this.render();
      };
    }

    this.container.querySelectorAll(".btn-delete-note").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const confirmed = typeof window !== "undefined" && typeof window.confirm === "function"
          ? window.confirm("¿Seguro que quieres eliminar esta entrada del cuaderno? Esta acción no se puede deshacer.")
          : true;

        if (!confirmed) return;

        this.entries = this.entries.filter(e => e.id !== id);
        this.saveEntries();
        this.render();
      };
    });

    const btnExport = this.container.querySelector("#btnExportNotesTxt");
    if (btnExport) {
      btnExport.onclick = () => {
        const text = this.entries.map(e => `
================================================================
EXPEDIENTE CLÍNICO: ${e.animalName} (${e.species})
FECHA: ${e.date} | TIPO: ${e.type.toUpperCase()}
================================================================
[S] SUBJETIVO:
${e.soap.s}

[O] OBJETIVO:
${e.soap.o}

[A] ANÁLISIS / DIAGNÓSTICO:
${e.soap.a}

[P] PLAN TERAPÉUTICO:
${e.soap.p}
        `).join("\n\n");

        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Bitacora_Clinica_Veterinaria_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
  }
}
