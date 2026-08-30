/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: DiagnosticLab.js - Centro Universitario de Diagnóstico Clínico Multiespecie
 * Hemograma, Química Sanguínea, Coprología, Uroanálisis y Punción Tisular
 */

import { store } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";
import { PHARMACOPEIA, VET_ROUTES, NEEDLE_GAUGES } from "./ClinicalLab.js";
import { achievements } from "../core/Achievements.js";
import { withdrawalEngine } from "./WithdrawalEngine.js";

/**
 * Rangos de Referencia Hematológica y Bioquímica por Especie
 */
export const SPECIES_REFERENCE_RANGES = {
  bovino: {
    name: "Bovino (Bos taurus / indicus)",
    icon: "🐄",
    rbc: { min: 5.0, max: 10.0, unit: "x10⁶/μL" },
    hto: { min: 24.0, max: 38.0, unit: "%" },
    hb:  { min: 8.0, max: 15.0, unit: "g/dL" },
    vcm: { min: 40.0, max: 60.0, unit: "fL" },
    chcm:{ min: 30.0, max: 36.0, unit: "g/dL" },
    wbc: { min: 4000, max: 12000, unit: "/μL" },
    neut: { min: 1500, max: 4500, unit: "/μL" },
    band: { min: 0, max: 120, unit: "/μL" },
    lymph: { min: 2500, max: 7500, unit: "/μL" },
    eos: { min: 100, max: 1000, unit: "/μL" },
    mono: { min: 100, max: 800, unit: "/μL" },
    plt: { min: 100000, max: 800000, unit: "/μL" },
    // Química
    bun: { min: 10, max: 25, unit: "mg/dL" },
    crea: { min: 0.6, max: 1.8, unit: "mg/dL" },
    alt: { min: 11, max: 40, unit: "UI/L" },
    ast: { min: 45, max: 110, unit: "UI/L" },
    ggt: { min: 15, max: 40, unit: "UI/L" },
    protTot: { min: 6.0, max: 8.0, unit: "g/dL" },
    alb: { min: 2.7, max: 3.8, unit: "g/dL" },
    glucosa: { min: 45, max: 75, unit: "mg/dL" }
  },
  canino: {
    name: "Canino (Canis lupus familiaris)",
    icon: "🐕",
    rbc: { min: 5.5, max: 8.5, unit: "x10⁶/μL" },
    hto: { min: 37.0, max: 55.0, unit: "%" },
    hb:  { min: 12.0, max: 18.0, unit: "g/dL" },
    vcm: { min: 60.0, max: 77.0, unit: "fL" },
    chcm:{ min: 32.0, max: 36.0, unit: "g/dL" },
    wbc: { min: 6000, max: 17000, unit: "/μL" },
    neut: { min: 3000, max: 11500, unit: "/μL" },
    band: { min: 0, max: 300, unit: "/μL" },
    lymph: { min: 1000, max: 4800, unit: "/μL" },
    eos: { min: 100, max: 1200, unit: "/μL" },
    mono: { min: 150, max: 1350, unit: "/μL" },
    plt: { min: 200000, max: 500000, unit: "/μL" },
    bun: { min: 7, max: 28, unit: "mg/dL" },
    crea: { min: 0.5, max: 1.5, unit: "mg/dL" },
    alt: { min: 10, max: 100, unit: "UI/L" },
    ast: { min: 10, max: 50, unit: "UI/L" },
    ggt: { min: 1, max: 10, unit: "UI/L" },
    protTot: { min: 5.4, max: 7.5, unit: "g/dL" },
    alb: { min: 2.6, max: 3.8, unit: "g/dL" },
    glucosa: { min: 70, max: 110, unit: "mg/dL" }
  },
  felino: {
    name: "Felino (Felis catus)",
    icon: "🐈",
    rbc: { min: 5.0, max: 10.0, unit: "x10⁶/μL" },
    hto: { min: 24.0, max: 45.0, unit: "%" },
    hb:  { min: 8.0, max: 15.0, unit: "g/dL" },
    vcm: { min: 39.0, max: 55.0, unit: "fL" },
    chcm:{ min: 30.0, max: 36.0, unit: "g/dL" },
    wbc: { min: 5500, max: 19500, unit: "/μL" },
    neut: { min: 2500, max: 12500, unit: "/μL" },
    band: { min: 0, max: 300, unit: "/μL" },
    lymph: { min: 1500, max: 7000, unit: "/μL" },
    eos: { min: 100, max: 1500, unit: "/μL" },
    mono: { min: 50, max: 800, unit: "/μL" },
    plt: { min: 200000, max: 700000, unit: "/μL" },
    bun: { min: 16, max: 36, unit: "mg/dL" },
    crea: { min: 0.8, max: 2.1, unit: "mg/dL" },
    alt: { min: 12, max: 130, unit: "UI/L" },
    ast: { min: 10, max: 48, unit: "UI/L" },
    ggt: { min: 1, max: 5, unit: "UI/L" },
    protTot: { min: 5.7, max: 8.0, unit: "g/dL" },
    alb: { min: 2.5, max: 3.9, unit: "g/dL" },
    glucosa: { min: 70, max: 150, unit: "mg/dL" }
  },
  equino: {
    name: "Equino (Equus caballus)",
    icon: "🐎",
    rbc: { min: 6.5, max: 12.5, unit: "x10⁶/μL" },
    hto: { min: 32.0, max: 52.0, unit: "%" },
    hb:  { min: 11.0, max: 19.0, unit: "g/dL" },
    vcm: { min: 37.0, max: 55.0, unit: "fL" },
    chcm:{ min: 31.0, max: 37.0, unit: "g/dL" },
    wbc: { min: 5400, max: 14300, unit: "/μL" },
    neut: { min: 2260, max: 8580, unit: "/μL" },
    band: { min: 0, max: 100, unit: "/μL" },
    lymph: { min: 1500, max: 7700, unit: "/μL" },
    eos: { min: 0, max: 1000, unit: "/μL" },
    mono: { min: 0, max: 1000, unit: "/μL" },
    plt: { min: 100000, max: 400000, unit: "/μL" },
    bun: { min: 10, max: 24, unit: "mg/dL" },
    crea: { min: 0.9, max: 1.9, unit: "mg/dL" },
    alt: { min: 3, max: 25, unit: "UI/L" },
    ast: { min: 150, max: 350, unit: "UI/L" },
    ggt: { min: 5, max: 25, unit: "UI/L" },
    protTot: { min: 5.6, max: 7.6, unit: "g/dL" },
    alb: { min: 2.6, max: 3.7, unit: "g/dL" },
    glucosa: { min: 75, max: 115, unit: "mg/dL" }
  },
  ovino: {
    name: "Ovino / Caprino (Ovis aries / Capra hircus)",
    icon: "🐑",
    rbc: { min: 9.0, max: 15.0, unit: "x10⁶/μL" },
    hto: { min: 27.0, max: 45.0, unit: "%" },
    hb:  { min: 9.0, max: 15.0, unit: "g/dL" },
    vcm: { min: 28.0, max: 40.0, unit: "fL" },
    chcm:{ min: 31.0, max: 38.0, unit: "g/dL" },
    wbc: { min: 4000, max: 12000, unit: "/μL" },
    neut: { min: 700, max: 4000, unit: "/μL" },
    band: { min: 0, max: 100, unit: "/μL" },
    lymph: { min: 2000, max: 9000, unit: "/μL" },
    eos: { min: 0, max: 1000, unit: "/μL" },
    mono: { min: 0, max: 750, unit: "/μL" },
    plt: { min: 250000, max: 750000, unit: "/μL" },
    bun: { min: 8, max: 20, unit: "mg/dL" },
    crea: { min: 0.8, max: 1.8, unit: "mg/dL" },
    alt: { min: 10, max: 50, unit: "UI/L" },
    ast: { min: 60, max: 280, unit: "UI/L" },
    ggt: { min: 20, max: 50, unit: "UI/L" },
    protTot: { min: 6.0, max: 7.9, unit: "g/dL" },
    alb: { min: 2.4, max: 3.5, unit: "g/dL" },
    glucosa: { min: 50, max: 80, unit: "mg/dL" }
  },
  porcino: {
    name: "Porcino (Sus scrofa domesticus)",
    icon: "🐖",
    rbc: { min: 5.0, max: 8.0, unit: "x10⁶/μL" },
    hto: { min: 32.0, max: 50.0, unit: "%" },
    hb:  { min: 10.0, max: 16.0, unit: "g/dL" },
    vcm: { min: 50.0, max: 68.0, unit: "fL" },
    chcm:{ min: 30.0, max: 34.0, unit: "g/dL" },
    wbc: { min: 11000, max: 22000, unit: "/μL" },
    neut: { min: 3000, max: 10000, unit: "/μL" },
    band: { min: 0, max: 800, unit: "/μL" },
    lymph: { min: 4500, max: 13000, unit: "/μL" },
    eos: { min: 100, max: 2000, unit: "/μL" },
    mono: { min: 200, max: 1500, unit: "/μL" },
    plt: { min: 200000, max: 600000, unit: "/μL" },
    bun: { min: 10, max: 30, unit: "mg/dL" },
    crea: { min: 1.0, max: 2.7, unit: "mg/dL" },
    alt: { min: 15, max: 60, unit: "UI/L" },
    ast: { min: 15, max: 75, unit: "UI/L" },
    ggt: { min: 10, max: 60, unit: "UI/L" },
    protTot: { min: 5.8, max: 8.5, unit: "g/dL" },
    alb: { min: 2.5, max: 4.2, unit: "g/dL" },
    glucosa: { min: 65, max: 120, unit: "mg/dL" }
  }
};

/**
 * Casos Preconfigurados de Hemograma & Laboratorio
 */
export const HEMATOLOGY_PRESETS = [
  {
    id: "normal",
    title: "1. Paciente Sano (Valores Fisiológicos)",
    desc: "Valores hematológicos dentro de rangos normales de referencia para la especie.",
    species: "bovino",
    values: { rbc: 7.2, hto: 32.0, hb: 11.5, wbc: 8500, neut: 3200, band: 40, lymph: 4500, eos: 350, mono: 410, plt: 350000 }
  },
  {
    id: "anemia_babesia",
    title: "2. Anemia Hemolítica Aguda (Babesiosis / Piroplasmosis Bovina)",
    desc: "Caída drástica de hematocrito y hemoglobina por lisis eritrocitaria intravascular.",
    species: "bovino",
    values: { rbc: 3.2, hto: 14.5, hb: 4.8, wbc: 14200, neut: 7800, band: 380, lymph: 5100, eos: 200, mono: 720, plt: 85000 }
  },
  {
    id: "infection_pneumonia",
    title: "3. Infección Bacteriana con Desviación a la Izquierda (Neumonía)",
    desc: "Leucocitosis marcada con neutrofilia y presencia abundante de formas inmaduras (Bandas).",
    species: "bovino",
    values: { rbc: 6.8, hto: 31.0, hb: 10.8, wbc: 22500, neut: 14800, band: 1800, lymph: 4900, eos: 80, mono: 920, plt: 280000 }
  },
  {
    id: "dehydration",
    title: "4. Deshidratación Severa (Hemoconcentración)",
    desc: "Elevación artificial del hematocrito y proteínas por contracción de volumen plasmático.",
    species: "equino",
    values: { rbc: 13.8, hto: 58.0, hb: 20.2, wbc: 11500, neut: 6800, band: 50, lymph: 4100, eos: 250, mono: 300, plt: 220000 }
  },
  {
    id: "parasitism_haemonchus",
    title: "5. Parasitosis Gastrointestinal Grave (Haemonchosis en Ovino)",
    desc: "Anemia microcítica hipocrómica por hematofagia severa + Eosinofilia.",
    species: "ovino",
    values: { rbc: 4.5, hto: 12.0, hb: 3.8, wbc: 13800, neut: 4200, band: 80, lymph: 6200, eos: 2800, mono: 520, plt: 180000 }
  }
];

export class DiagnosticLab {
  constructor(containerId, { storeInstance = store } = {}) {
    this.container = document.getElementById(containerId);
    this.store = storeInstance;

    this.activeSpecies = "bovino";
    this.activeSubTab = "hemograma"; // "hemograma", "quimica", "coprologia", "uroanalisis", "puncion"

    // Estado Hemograma
    this.hemogramaValues = { ...HEMATOLOGY_PRESETS[0].values };
    
    // Estado Coprológico
    this.mcmasterChamber1 = 12;
    this.mcmasterChamber2 = 16;
    this.famachaGrade = 3;

    // Estado Punción e Inyectología
    this.punctureState = {
      selectedDrugId: "flunixin",
      selectedRouteId: "IV",
      selectedNeedle: "18G",
      depthMm: 16,
      angleDeg: 25,
      aspirated: false,
      aspirateBlood: false,
      bevelUp: true,
      lastResult: null
    };

    this.init();
  }

  init() {
    this.render();
  }

  setSpecies(spId) {
    if (SPECIES_REFERENCE_RANGES[spId]) {
      this.activeSpecies = spId;
      AudioFx.click();
      this.render();
    }
  }

  applyHematologyPreset(presetId) {
    const preset = HEMATOLOGY_PRESETS.find(p => p.id === presetId);
    if (preset) {
      this.activeSpecies = preset.species;
      this.hemogramaValues = { ...preset.values };
      AudioFx.success();
      this.store.emit("toast:show", { msg: `🩸 <b>Perfil cargado:</b> ${preset.title}` });
      this.render();
    }
  }

  render() {
    if (!this.container) return;

    const sp = SPECIES_REFERENCE_RANGES[this.activeSpecies];

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- 1. Barra de Encabezado & Selección de Especie Paciente -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="display font-bold text-lg md:text-xl text-white flex items-center gap-2 m-0">
                <span>🔬</span> Laboratorio Clínico & Diagnóstico Veterinario
              </h2>
              <span class="text-[10px] mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-300 font-bold uppercase">
                Multiespecie
              </span>
            </div>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">
              Interpretación automatizada de hemogramas, bioquímica sérica, coprología McMaster y simulador de inyectología tisular.
            </p>
          </div>

          <!-- Selector de Especie -->
          <div class="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-[var(--border)]">
            ${Object.keys(SPECIES_REFERENCE_RANGES).map(key => {
              const item = SPECIES_REFERENCE_RANGES[key];
              const isAct = key === this.activeSpecies;
              return `
                <button class="btn-species-sel btn px-2.5 py-1.5 rounded-xl text-xs font-semibold ${isAct ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow ring-1 ring-blue-500/30' : 'text-gray-400 hover:text-white'}" data-species="${key}">
                  <span>${item.icon}</span> <span class="hidden sm:inline">${item.name.split(" ")[0]}</span>
                </button>
              `;
            }).join("")}
          </div>
        </div>

        <!-- 2. Navegación de Sub-Laboratorios -->
        <div class="flex flex-wrap gap-1 bg-black/30 p-1.5 rounded-2xl border border-[var(--border)]">
          <button class="diag-subtab btn px-3.5 py-2 rounded-xl text-xs font-semibold ${this.activeSubTab === 'hemograma' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-tab="hemograma">
            🩸 Hemograma Completo
          </button>
          <button class="diag-subtab btn px-3.5 py-2 rounded-xl text-xs font-semibold ${this.activeSubTab === 'quimica' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-tab="quimica">
            🧪 Bioquímica Sérica
          </button>
          <button class="diag-subtab btn px-3.5 py-2 rounded-xl text-xs font-semibold ${this.activeSubTab === 'coprologia' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-tab="coprologia">
            🔬 Coprología & McMaster
          </button>
          <button class="diag-subtab btn px-3.5 py-2 rounded-xl text-xs font-semibold ${this.activeSubTab === 'uroanalisis' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-tab="uroanalisis">
            🟡 Uroanálisis & Sedimento
          </button>
          <button class="diag-subtab btn px-3.5 py-2 rounded-xl text-xs font-semibold ${this.activeSubTab === 'puncion' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-tab="puncion">
            💉 Punción Tisular & Farmacopea
          </button>
        </div>

        <!-- 3. Contenedor Dinámico -->
        <div id="diagnosticSubtabContent">
          ${this.renderSubTabContent(sp)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderSubTabContent(sp) {
    if (this.activeSubTab === "hemograma") return this.renderHemogramView(sp);
    if (this.activeSubTab === "quimica") return this.renderBiochemistryView(sp);
    if (this.activeSubTab === "coprologia") return this.renderCoprologyView(sp);
    if (this.activeSubTab === "uroanalisis") return this.renderUrinalysisView(sp);
    if (this.activeSubTab === "puncion") return this.renderPunctureSimulator();
    return "";
  }

  /**
   * VISTA 1: HEMOGRAMA COMPLETO INTERACTIVO
   */
  renderHemogramView(sp) {
    const val = this.hemogramaValues;

    // Evaluaciones automáticas de parámetros
    const checkStatus = (current, min, max) => {
      if (current < min) return { status: "low", label: "DISMINUIDO 🔻", color: "text-amber-400", bg: "bg-amber-950/30 border-amber-500/30" };
      if (current > max) return { status: "high", label: "ELEVADO 🔺", color: "text-rose-400", bg: "bg-rose-950/30 border-rose-500/30" };
      return { status: "normal", label: "NORMAL ✅", color: "text-emerald-400", bg: "bg-emerald-950/20 border-emerald-500/20" };
    };

    const rbcEval = checkStatus(val.rbc, sp.rbc.min, sp.rbc.max);
    const htoEval = checkStatus(val.hto, sp.hto.min, sp.hto.max);
    const hbEval  = checkStatus(val.hb, sp.hb.min, sp.hb.max);
    const wbcEval = checkStatus(val.wbc, sp.wbc.min, sp.wbc.max);
    const neutEval= checkStatus(val.neut, sp.neut.min, sp.neut.max);
    const bandEval= checkStatus(val.band, sp.band.min, sp.band.max);
    const lymphEval=checkStatus(val.lymph, sp.lymph.min, sp.lymph.max);
    const eosEval = checkStatus(val.eos, sp.eos.min, sp.eos.max);
    const pltEval = checkStatus(val.plt, sp.plt.min, sp.plt.max);

    // Diagnósticos diferenciales automáticos
    const dxList = [];
    if (htoEval.status === "low" || rbcEval.status === "low") {
      dxList.push("🔴 <b>Anemia:</b> Hematocrito y eritrocitos bajo el rango de referencia. Sospechar hemoparásitos (Babesia/Anaplasma), hemorragia aguda/crónica o parasitosis gastrointestinal severa.");
    }
    if (htoEval.status === "high") {
      dxList.push("💧 <b>Policitemia Relativa / Hemoconcentración:</b> Hematocrito elevado comúnmente asociado a deshidratación severa o choque hipovolémico.");
    }
    if (wbcEval.status === "high" && bandEval.status === "high") {
      dxList.push("⚡ <b>Leucocitosis con Desviación a la Izquierda:</b> Respuesta inflamatoria e infecciosa bacteriana aguda severa (ej. neumonía, peritonitis, metritis o mastitis coliforme).");
    }
    if (eosEval.status === "high") {
      dxList.push("🪱 <b>Eosinofilia:</b> Reacción inmunológica típicamente inducida por parasitosis tisulares/gastrointestinales o procesos alérgicos.");
    }
    if (pltEval.status === "low") {
      dxList.push("🩸 <b>Trombocitopenia:</b> Recuento plaquetario bajo con riesgo de sangrado o coagulopatía de consumo (CID / Ehrlichiosis / Babesiosis).");
    }
    if (dxList.length === 0) {
      dxList.push("✅ <b>Hemograma Fisiológico Normal:</b> Todos los parámetros se encuentran en equilibrio homeostático para la especie.");
    }

    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <!-- Columna Izquierda: Presets y Ajuste de Datos -->
        <div class="lg:col-span-4 space-y-4 bg-black/40 p-4 md:p-5 rounded-2xl border border-[var(--border)]">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono flex items-center gap-1.5 m-0">
              <span>📋</span> Casos Clínicos Hematológicos
            </h4>
            <p class="text-[11px] text-[var(--muted)] mt-1 mb-0">Selecciona un cuadro patológico predefinido o modifica los valores manualmente.</p>
          </div>

          <!-- Presets -->
          <div class="space-y-1.5" id="presetsList">
            ${HEMATOLOGY_PRESETS.map(p => `
              <div class="btn p-2.5 rounded-xl border border-white/5 bg-black/30 hover:bg-blue-950/40 text-left cursor-pointer preset-card" data-preset-id="${p.id}">
                <b class="text-xs text-white block">${p.title}</b>
                <span class="text-[10px] text-gray-400 block mt-0.5">${p.desc}</span>
              </div>
            `).join("")}
          </div>

          <!-- Ajuste Rápido de Valores -->
          <div class="space-y-3 pt-2 border-t border-[var(--border)] text-xs">
            <b class="text-gray-300 text-[11px] uppercase tracking-wider mono block">Edición de Analitos:</b>
            
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Hematocrito (Hto %):</span>
                <b class="mono ${htoEval.color}">${val.hto}%</b>
              </div>
              <input type="range" id="rngHto" min="10" max="65" step="0.5" value="${val.hto}" class="w-full">
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Leucocitos Totales (WBC /μL):</span>
                <b class="mono ${wbcEval.color}">${val.wbc}</b>
              </div>
              <input type="range" id="rngWbc" min="2000" max="35000" step="200" value="${val.wbc}" class="w-full">
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Neutrófilos en Banda (/μL):</span>
                <b class="mono ${bandEval.color}">${val.band}</b>
              </div>
              <input type="range" id="rngBand" min="0" max="3000" step="20" value="${val.band}" class="w-full">
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Eosinófilos (/μL):</span>
                <b class="mono ${eosEval.color}">${val.eos}</b>
              </div>
              <input type="range" id="rngEos" min="0" max="3500" step="50" value="${val.eos}" class="w-full">
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Reporte de Laboratorio & Interpretación -->
        <div class="lg:col-span-8 space-y-4">
          <!-- Tarjeta de Reporte Oficial -->
          <div class="glass hud-card p-5 rounded-2xl border border-blue-500/30 space-y-4">
            <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
              <div>
                <span class="text-[10px] mono text-blue-400 font-bold uppercase tracking-wider block">INFORME DE HEMOGRAMA VETERINARIO</span>
                <h3 class="display text-lg font-bold text-white m-0">Especie: ${sp.name}</h3>
              </div>
              <span class="chip mono text-xs text-emerald-300 font-bold">ANALIZADOR AUTOMÁTICO</span>
            </div>

            <!-- Tabla de Analitos -->
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="border-b border-white/10 text-[var(--muted)] font-mono text-[10px]">
                    <th class="py-2">PARÁMETRO</th>
                    <th class="py-2 text-right">VALOR PACIENTE</th>
                    <th class="py-2 text-center">RANGO REF.</th>
                    <th class="py-2 text-right">ESTADO</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5 mono">
                  <tr>
                    <td class="py-2 text-gray-200">Eritrocitos (RBC)</td>
                    <td class="py-2 text-right font-bold ${rbcEval.color}">${val.rbc} ${sp.rbc.unit}</td>
                    <td class="py-2 text-center text-gray-400">${sp.rbc.min} – ${sp.rbc.max}</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${rbcEval.bg} ${rbcEval.color}">${rbcEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Hematocrito (Hto)</td>
                    <td class="py-2 text-right font-bold ${htoEval.color}">${val.hto} %</td>
                    <td class="py-2 text-center text-gray-400">${sp.hto.min} – ${sp.hto.max} %</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${htoEval.bg} ${htoEval.color}">${htoEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Hemoglobina (Hb)</td>
                    <td class="py-2 text-right font-bold ${hbEval.color}">${val.hb} g/dL</td>
                    <td class="py-2 text-center text-gray-400">${sp.hb.min} – ${sp.hb.max} g/dL</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${hbEval.bg} ${hbEval.color}">${hbEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Leucocitos Totales (WBC)</td>
                    <td class="py-2 text-right font-bold ${wbcEval.color}">${val.wbc.toLocaleString()} /μL</td>
                    <td class="py-2 text-center text-gray-400">${sp.wbc.min.toLocaleString()} – ${sp.wbc.max.toLocaleString()}</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${wbcEval.bg} ${wbcEval.color}">${wbcEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Neutrófilos Segmentados</td>
                    <td class="py-2 text-right font-bold ${neutEval.color}">${val.neut.toLocaleString()} /μL</td>
                    <td class="py-2 text-center text-gray-400">${sp.neut.min} – ${sp.neut.max}</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${neutEval.bg} ${neutEval.color}">${neutEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Neutrófilos en Banda (Inmaduros)</td>
                    <td class="py-2 text-right font-bold ${bandEval.color}">${val.band} /μL</td>
                    <td class="py-2 text-center text-gray-400">${sp.band.min} – ${sp.band.max}</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${bandEval.bg} ${bandEval.color}">${bandEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Eosinófilos</td>
                    <td class="py-2 text-right font-bold ${eosEval.color}">${val.eos} /μL</td>
                    <td class="py-2 text-center text-gray-400">${sp.eos.min} – ${sp.eos.max}</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${eosEval.bg} ${eosEval.color}">${eosEval.label}</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 text-gray-200">Plaquetas</td>
                    <td class="py-2 text-right font-bold ${pltEval.color}">${val.plt.toLocaleString()} /μL</td>
                    <td class="py-2 text-center text-gray-400">${sp.plt.min.toLocaleString()} – ${sp.plt.max.toLocaleString()}</td>
                    <td class="py-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${pltEval.bg} ${pltEval.color}">${pltEval.label}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Diagnóstico y Análisis Clínico Automatizado -->
            <div class="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs">
              <b class="text-blue-300 font-bold uppercase tracking-wider mono flex items-center gap-1.5">
                <span>🧠</span> Interpretación Diagnóstica Automatizada
              </b>
              <div class="space-y-1.5 text-gray-200">
                ${dxList.map(item => `<div class="p-2 rounded bg-black/40 border border-white/5 leading-relaxed">${item}</div>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 2: BIOQUÍMICA SÉRICA
   */
  renderBiochemistryView(sp) {
    return `
      <div class="space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
        <div class="border-b border-[var(--border)] pb-3">
          <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
            <span>🧪</span> Perfil Bioquímico & Función Orgánica (${sp.name})
          </h4>
          <p class="text-xs text-[var(--muted)] mt-1 mb-0">Evaluación de la función renal, hepática y metabólica general.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <!-- Perfil Renal -->
          <div class="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2.5">
            <b class="text-emerald-300 uppercase tracking-wider mono text-[11px] block">💧 Perfil Renal & Electrolitos</b>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">Creatinina Sérica:</span>
              <span class="mono text-white font-bold">1.2 mg/dL <small class="text-gray-400">(${sp.crea.min}–${sp.crea.max})</small></span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">BUN / Urea:</span>
              <span class="mono text-white font-bold">18 mg/dL <small class="text-gray-400">(${sp.bun.min}–${sp.bun.max})</small></span>
            </div>
            <p class="text-[11px] text-gray-400 leading-relaxed pt-1">
              Filtración glomerular conservada. Sin signos de azotemia prerrenal ni renal.
            </p>
          </div>

          <!-- Perfil Hepático -->
          <div class="p-4 rounded-2xl bg-black/40 border border-blue-500/30 space-y-2.5">
            <b class="text-blue-300 uppercase tracking-wider mono text-[11px] block">🫀 Perfil Hepático & Biliar</b>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">ALT / GPT:</span>
              <span class="mono text-white font-bold">32 UI/L <small class="text-gray-400">(${sp.alt.min}–${sp.alt.max})</small></span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">AST / GOT:</span>
              <span class="mono text-white font-bold">78 UI/L <small class="text-gray-400">(${sp.ast.min}–${sp.ast.max})</small></span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">GGT (Colestasis):</span>
              <span class="mono text-white font-bold">24 UI/L <small class="text-gray-400">(${sp.ggt.min}–${sp.ggt.max})</small></span>
            </div>
            <p class="text-[11px] text-gray-400 leading-relaxed pt-1">
              Enzimas hepatocelulares y colestásicas en rangos normales.
            </p>
          </div>

          <!-- Perfil Proteico y Energético -->
          <div class="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2.5">
            <b class="text-amber-300 uppercase tracking-wider mono text-[11px] block">⚡ Metabolismo & Proteínas</b>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">Proteínas Totales:</span>
              <span class="mono text-white font-bold">6.8 g/dL <small class="text-gray-400">(${sp.protTot.min}–${sp.protTot.max})</small></span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">Albúmina:</span>
              <span class="mono text-white font-bold">3.2 g/dL <small class="text-gray-400">(${sp.alb.min}–${sp.alb.max})</small></span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-1">
              <span class="text-gray-300">Glucosa Sérica:</span>
              <span class="mono text-white font-bold">62 mg/dL <small class="text-gray-400">(${sp.glucosa.min}–${sp.glucosa.max})</small></span>
            </div>
            <p class="text-[11px] text-gray-400 leading-relaxed pt-1">
              Estado nutricional óptimo y balance osmótico coloidal adecuado.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 3: COPROLOGÍA & TÉCNICA MCMASTER
   */
  renderCoprologyView(sp) {
    const totalHpg = (this.mcmasterChamber1 + this.mcmasterChamber2) * 50;
    let severity = "Baja";
    let sevBadge = '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">CARGA LEVE (< 200 HPG)</span>';

    if (totalHpg > 800) {
      severity = "Alta / Crítica";
      sevBadge = '<span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">CARGA ALTA (> 800 HPG) ⚠️</span>';
    } else if (totalHpg >= 200) {
      severity = "Moderada";
      sevBadge = '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">CARGA MODERADA (200 - 800 HPG)</span>';
    }

    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <!-- Columna Izquierda: Calculadora McMaster -->
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)]">
          <div class="border-b border-[var(--border)] pb-3">
            <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
              <span>🔬</span> Conteo Cuantitativo McMaster
            </h4>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">Determinación de Huevos por Gramo de Heces (HPG).</p>
          </div>

          <div class="space-y-3 text-xs">
            <div class="space-y-1">
              <label class="text-gray-300">Conteo Cámara 1 (Cuadrícula McMaster):</label>
              <input type="number" id="inpMcMaster1" min="0" max="100" value="${this.mcmasterChamber1}" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-emerald-300 text-center">
            </div>

            <div class="space-y-1">
              <label class="text-gray-300">Conteo Cámara 2 (Cuadrícula McMaster):</label>
              <input type="number" id="inpMcMaster2" min="0" max="100" value="${this.mcmasterChamber2}" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-emerald-300 text-center">
            </div>

            <div class="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Fórmula McMaster:</span>
                <span class="mono text-[10px] text-emerald-400">(C1 + C2) × 50</span>
              </div>
              <div class="flex justify-between items-center pt-1 border-t border-white/10">
                <span class="text-xs text-white font-bold">Total HPG Calculado:</span>
                <b class="mono text-lg text-emerald-300">${totalHpg.toLocaleString()} HPG</b>
              </div>
              <div class="pt-1 text-center">${sevBadge}</div>
            </div>

            <!-- Escala FAMACHA para Ovinos / Caprinos -->
            <div class="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-200 font-bold">Escala FAMACHA (Mucosa Ocular):</span>
                <b class="mono text-amber-300">Grado ${this.famachaGrade} / 5</b>
              </div>
              <input type="range" id="rngFamacha" min="1" max="5" step="1" value="${this.famachaGrade}" class="w-full">
              <div class="flex justify-between text-[9px] text-gray-400 mono">
                <span>1 (Rojo óptimo)</span>
                <span>3 (Rosado pálido)</span>
                <span>5 (Blanco / Anemia letal)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Atlas Parasitológico Rápido -->
        <div class="lg:col-span-7 space-y-4">
          <div class="p-5 rounded-2xl bg-black/30 border border-[var(--border)] space-y-4">
            <h4 class="display font-bold text-sm text-white uppercase tracking-wider mono flex items-center gap-1.5 m-0">
              <span>🪱</span> Atlas de Diagnóstico Parasitológico de Campo
            </h4>

            <div class="grid sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <b class="text-emerald-300 block">Haemonchus contortus</b>
                <span class="text-[10px] text-gray-400 block mono">Nematodo Hematófago del Abomaso</span>
                <p class="text-[11px] text-gray-300 m-0">Causa anemia hipovolémica severa y edema submandibular (mandíbula en botella).</p>
              </div>

              <div class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <b class="text-amber-300 block">Fasciola hepatica</b>
                <span class="text-[10px] text-gray-400 block mono">Trematodo Hepático (Duela del Hígado)</span>
                <p class="text-[11px] text-gray-300 m-0">Huevo operculado dorado en zonas húmedas con caracoles *Lymnaea*.</p>
              </div>

              <div class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <b class="text-blue-300 block">Eimeria bovis / ovinis</b>
                <span class="text-[10px] text-gray-400 block mono">Protozoo Coccidio Intestinal</span>
                <p class="text-[11px] text-gray-300 m-0">Diarreas hemorrágicas con tenesmo en terneros y corderos en hacinamiento.</p>
              </div>

              <div class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <b class="text-purple-300 block">Toxocara canis / vitulorum</b>
                <span class="text-[10px] text-gray-400 block mono">Ascáride Gastrointestinal</span>
                <p class="text-[11px] text-gray-300 m-0">Transmisión transplacentaria y transmamaria con vientre abultado y neumonía.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 4: UROANÁLISIS
   */
  renderUrinalysisView(sp) {
    return `
      <div class="space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
        <div class="border-b border-[var(--border)] pb-3">
          <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
            <span>🟡</span> Uroanálisis & Examen del Sedimento Urinario (${sp.name})
          </h4>
          <p class="text-xs text-[var(--muted)] mt-1 mb-0">Evaluación físico-química y microscópica de la orina.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 text-xs">
          <!-- Tira Reactiva -->
          <div class="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
            <b class="text-amber-300 uppercase tracking-wider mono text-[11px] block">🧪 Tira Reactiva (Físico-Químico)</b>
            <div class="flex justify-between py-1 border-b border-white/5"><span>Densidad Urinaria:</span><b class="mono text-white">1.025 (Isostenuria: 1.008–1.012)</b></div>
            <div class="flex justify-between py-1 border-b border-white/5"><span>pH Urinario:</span><b class="mono text-white">7.8 (Alcalino normal en herbívoros)</b></div>
            <div class="flex justify-between py-1 border-b border-white/5"><span>Proteínas:</span><b class="mono text-emerald-400">Negativo / Trazas</b></div>
            <div class="flex justify-between py-1 border-b border-white/5"><span>Glucosa:</span><b class="mono text-emerald-400">Negativo</b></div>
            <div class="flex justify-between py-1"><span>Cuerpos Cetónicos:</span><b class="mono text-emerald-400">Negativo (Positivo en Cetosis bovina)</b></div>
          </div>

          <!-- Sedimento Microscópico -->
          <div class="p-4 rounded-2xl bg-black/40 border border-blue-500/30 space-y-2">
            <b class="text-blue-300 uppercase tracking-wider mono text-[11px] block">🔬 Sedimento Urinario (40x)</b>
            <div class="flex justify-between py-1 border-b border-white/5"><span>Cristales de Estruvita / Oxalato:</span><b class="mono text-gray-300">Escasos</b></div>
            <div class="flex justify-between py-1 border-b border-white/5"><span>Células Epiteliales:</span><b class="mono text-gray-300">0 - 2 por campo</b></div>
            <div class="flex justify-between py-1 border-b border-white/5"><span>Leucocitos / Piuria:</span><b class="mono text-emerald-400">0 - 1 por campo (Sin infección)</b></div>
            <div class="flex justify-between py-1"><span>Bacterias:</span><b class="mono text-emerald-400">Ausentes</b></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 5: SIMULADOR DE PUNCIÓN TISULAR & INYECTOLOGÍA
   */
  renderPunctureSimulator() {
    const ps = this.punctureState;
    const selectedDrug = PHARMACOPEIA.find(d => d.id === ps.selectedDrugId) || PHARMACOPEIA[0];
    const selectedRoute = VET_ROUTES[ps.selectedRouteId] || VET_ROUTES.IV;

    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <!-- Columna Izquierda: Controles del Procedimiento -->
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)]">
          <div class="border-b border-[var(--border)] pb-3">
            <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
              <span>💉</span> Protocolo de Inyección & Punción
            </h4>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">Configura el fármaco, la vía de administración, ángulo y profundidad anatómica.</p>
          </div>

          <!-- Fármaco -->
          <div class="space-y-1 text-xs">
            <label class="text-gray-300 font-semibold">1. Fármaco (Farmacopea DCI):</label>
            <select id="selPunctureDrug" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 text-xs font-bold text-white">
              ${PHARMACOPEIA.map(d => `
                <option value="${d.id}" ${d.id === ps.selectedDrugId ? 'selected' : ''}>
                  ${d.name} (${d.class.split("(")[0]})
                </option>
              `).join("")}
            </select>
          </div>

          <!-- Vía de Administración -->
          <div class="space-y-1 text-xs">
            <label class="text-gray-300 font-semibold">2. Vía de Inyección Objetivo:</label>
            <div class="grid grid-cols-4 gap-1.5">
              ${Object.keys(VET_ROUTES).map(rk => {
                const r = VET_ROUTES[rk];
                const isAct = rk === ps.selectedRouteId;
                return `
                  <button class="btn-route-sel btn p-2 rounded-xl text-xs font-bold border ${isAct ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' : 'bg-black/40 text-gray-400 border-white/5'}" data-route="${rk}">
                    ${r.name.split(" ")[0]}
                  </button>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Calibre de Aguja -->
          <div class="space-y-1 text-xs">
            <label class="text-gray-300 font-semibold">3. Calibre de Aguja (Gauge):</label>
            <select id="selNeedleGauge" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-xs text-white">
              ${NEEDLE_GAUGES.map(g => `
                <option value="${g.gauge}" ${g.gauge === ps.selectedNeedle ? 'selected' : ''}>
                  ${g.gauge} (${g.length}) — ${g.desc.split("—")[0]}
                </option>
              `).join("")}
            </select>
          </div>

          <!-- Ángulo y Profundidad -->
          <div class="space-y-3 pt-2 text-xs">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Ángulo de Inserción:</span>
                <b class="mono text-emerald-300" id="lblPuncAngle">${ps.angleDeg}° (Rango ideal: ${selectedRoute.angleRange[0]}°–${selectedRoute.angleRange[1]}°)</b>
              </div>
              <input type="range" id="rngPuncAngle" min="5" max="90" step="1" value="${ps.angleDeg}" class="w-full">
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Profundidad del Bisel:</span>
                <b class="mono text-blue-300" id="lblPuncDepth">${ps.depthMm} mm (Rango ideal: ${selectedRoute.depthRange[0]}–${selectedRoute.depthRange[1]} mm)</b>
              </div>
              <input type="range" id="rngPuncDepth" min="1" max="50" step="1" value="${ps.depthMm}" class="w-full">
            </div>
          </div>

          <!-- Prueba de Aspiración -->
          <div class="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <b class="text-white block">Prueba de Aspiración del Émbolo:</b>
              <span class="text-[10px] text-gray-400">Verificar reflujo venoso antes de inyectar.</span>
            </div>
            <button id="btnAspirateSyringe" class="btn px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-950/60 text-xs font-bold text-blue-200">
              ${ps.aspirated ? (ps.aspirateBlood ? '🔴 Sangre Positiva' : '⚪ Negativo (Sin sangre)') : '🔄 Aspirar'}
            </button>
          </div>

          <button id="btnExecuteInjection" class="btn w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg flex items-center justify-center gap-2">
            <span>💉</span> Inyectar Dosis Farmacológica
          </button>
        </div>

        <!-- Columna Derecha: Corte Anatómico & Dictamen Clínico -->
        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-[var(--border)] space-y-4">
            <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
              <div>
                <span class="text-[10px] mono text-emerald-400 font-bold uppercase">FICHA TÉCNICA DEL FÁRMACO</span>
                <h4 class="display text-base font-bold text-white m-0">${selectedDrug.name}</h4>
              </div>
              <span class="chip mono text-xs text-amber-300 font-bold">${selectedDrug.concentration} ${selectedDrug.unit}</span>
            </div>

            <div class="space-y-2 text-xs text-gray-300">
              <div><b>Indicación:</b> ${selectedDrug.indication}</div>
              <div><b>Vía Recomendada:</b> <span class="mono text-emerald-300 font-bold">${selectedDrug.preferredRoute}</span> (Permitidas: ${selectedDrug.allowedRoutes.join(", ")})</div>
              <div><b>Dosis Referencia:</b> ${selectedDrug.recommendedDose.label}</div>
              <div class="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                ⚠️ <b>Advertencia:</b> ${selectedDrug.warning}
              </div>
            </div>

            <!-- Resultado del Procedimiento -->
            ${ps.lastResult ? `
              <div class="p-4 rounded-xl border ${ps.lastResult.success ? 'border-emerald-500/50 bg-emerald-950/40' : 'border-rose-500/50 bg-rose-950/40'} space-y-2 text-xs">
                <b class="text-sm ${ps.lastResult.success ? 'text-emerald-300' : 'text-rose-300'} block">
                  ${ps.lastResult.success ? '🎉 ¡Inyección Exitosa y Segura!' : '❌ Error en la Administración'}
                </b>
                <p class="text-gray-200 m-0">${ps.lastResult.msg}</p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Especies
    document.querySelectorAll(".btn-species-sel").forEach(btn => {
      btn.onclick = () => this.setSpecies(btn.dataset.species);
    });

    // Pestañas
    document.querySelectorAll(".diag-subtab").forEach(tab => {
      tab.onclick = () => {
        this.activeSubTab = tab.dataset.tab;
        AudioFx.click();
        this.render();
      };
    });

    // Presets
    document.querySelectorAll(".preset-card").forEach(card => {
      card.onclick = () => this.applyHematologyPreset(card.dataset.presetId);
    });

    // Sliders Hemograma
    const rngHto = document.getElementById("rngHto");
    if (rngHto) {
      rngHto.oninput = (e) => {
        this.hemogramaValues.hto = parseFloat(e.target.value);
        this.hemogramaValues.rbc = +(this.hemogramaValues.hto / 4.4).toFixed(1);
        this.hemogramaValues.hb = +(this.hemogramaValues.hto / 3.0).toFixed(1);
        this.render();
      };
    }

    const rngWbc = document.getElementById("rngWbc");
    if (rngWbc) {
      rngWbc.oninput = (e) => {
        this.hemogramaValues.wbc = parseInt(e.target.value, 10);
        this.render();
      };
    }

    const rngBand = document.getElementById("rngBand");
    if (rngBand) {
      rngBand.oninput = (e) => {
        this.hemogramaValues.band = parseInt(e.target.value, 10);
        this.render();
      };
    }

    const rngEos = document.getElementById("rngEos");
    if (rngEos) {
      rngEos.oninput = (e) => {
        this.hemogramaValues.eos = parseInt(e.target.value, 10);
        this.render();
      };
    }

    // Coprología
    const inpMc1 = document.getElementById("inpMcMaster1");
    if (inpMc1) {
      inpMc1.onchange = (e) => {
        this.mcmasterChamber1 = parseInt(e.target.value, 10) || 0;
        this.render();
      };
    }
    const inpMc2 = document.getElementById("inpMcMaster2");
    if (inpMc2) {
      inpMc2.onchange = (e) => {
        this.mcmasterChamber2 = parseInt(e.target.value, 10) || 0;
        this.render();
      };
    }
    const rngFam = document.getElementById("rngFamacha");
    if (rngFam) {
      rngFam.oninput = (e) => {
        this.famachaGrade = parseInt(e.target.value, 10);
        this.render();
      };
    }

    // Punción
    const selPuncDrug = document.getElementById("selPunctureDrug");
    if (selPuncDrug) {
      selPuncDrug.onchange = (e) => {
        this.punctureState.selectedDrugId = e.target.value;
        const drug = PHARMACOPEIA.find(d => d.id === e.target.value);
        if (drug) {
          this.punctureState.selectedRouteId = drug.preferredRoute;
          const route = VET_ROUTES[drug.preferredRoute];
          if (route) {
            this.punctureState.angleDeg = Math.round((route.angleRange[0] + route.angleRange[1]) / 2);
            this.punctureState.depthMm = Math.round((route.depthRange[0] + route.depthRange[1]) / 2);
          }
        }
        this.render();
      };
    }

    document.querySelectorAll(".btn-route-sel").forEach(btn => {
      btn.onclick = () => {
        this.punctureState.selectedRouteId = btn.dataset.route;
        const route = VET_ROUTES[btn.dataset.route];
        if (route) {
          this.punctureState.angleDeg = Math.round((route.angleRange[0] + route.angleRange[1]) / 2);
          this.punctureState.depthMm = Math.round((route.depthRange[0] + route.depthRange[1]) / 2);
        }
        AudioFx.click();
        this.render();
      };
    });

    const rngPuncAngle = document.getElementById("rngPuncAngle");
    if (rngPuncAngle) {
      rngPuncAngle.oninput = (e) => {
        this.punctureState.angleDeg = parseInt(e.target.value, 10);
        this.render();
      };
    }

    const rngPuncDepth = document.getElementById("rngPuncDepth");
    if (rngPuncDepth) {
      rngPuncDepth.oninput = (e) => {
        this.punctureState.depthMm = parseInt(e.target.value, 10);
        this.render();
      };
    }

    const btnAsp = document.getElementById("btnAspirateSyringe");
    if (btnAsp) {
      btnAsp.onclick = () => {
        this.punctureState.aspirated = true;
        const isIV = this.punctureState.selectedRouteId === "IV";
        this.punctureState.aspirateBlood = isIV;
        AudioFx.click();
        this.render();
      };
    }

    const btnExecInj = document.getElementById("btnExecuteInjection");
    if (btnExecInj) {
      btnExecInj.onclick = () => {
        const ps = this.punctureState;
        const drug = PHARMACOPEIA.find(d => d.id === ps.selectedDrugId);
        const route = VET_ROUTES[ps.selectedRouteId];

        // Validar si la vía está permitida para el fármaco
        if (!drug.allowedRoutes.includes(ps.selectedRouteId)) {
          ps.lastResult = {
            success: false,
            msg: `¡VÍA CONTRAINDICADA! ${drug.name} no debe administrarse por vía ${ps.selectedRouteId}. Vías permitidas: ${drug.allowedRoutes.join(", ")}.`
          };
          AudioFx.warning();
          this.render();
          return;
        }

        // Validar ángulo y profundidad
        const angleOk = ps.angleDeg >= (route.angleRange[0] - 5) && ps.angleDeg <= (route.angleRange[1] + 5);
        const depthOk = ps.depthMm >= (route.depthRange[0] - 2) && ps.depthMm <= (route.depthRange[1] + 4);

        if (!angleOk || !depthOk) {
          ps.lastResult = {
            success: false,
            msg: `Bisel fuera del plano tisular objetivo (${route.layerName}). Ángulo actual: ${ps.angleDeg}° (Ideal: ${route.angleRange.join("-")}°), Profundidad: ${ps.depthMm}mm (Ideal: ${route.depthRange.join("-")}mm).`
          };
          AudioFx.warning();
          this.render();
          return;
        }

        // Validar aspiración en Penicilina
        if (drug.id === "penicillin_g" && ps.selectedRouteId === "IV") {
          ps.lastResult = {
            success: false,
            msg: `¡ERROR GRAVE! La Penicilina Procaínica por vía IV es letal. Se produce colapso respiratorio y shock inmediato.`
          };
          AudioFx.error();
          this.render();
          return;
        }

        ps.lastResult = {
          success: true,
          msg: `Administración exitosa de ${drug.name} por vía ${route.name}. Posición tisular perfecta en ${route.layerName}.`
        };
        AudioFx.success();
        this.render();
      };
    }
  }
}
