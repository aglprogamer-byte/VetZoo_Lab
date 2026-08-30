/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: PastureLab.js - Laboratorio Universitario de Agrostología, Pastos, Forrajes,
 * Manejo de Pastoreo Voisin, Simulador de Fertilización con Reacción Biológica y Aforo en Vivo
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";
import { FertilizerEngine, FERTILIZERS_DATABASE } from "./FertilizerEngine.js";
import { achievements } from "../core/Achievements.js";

/**
 * Catálogo Agrostológico de Especies Forrajeras Tropicales y Templadas
 */
export const FORAGE_SPECIES_DATABASE = [
  {
    id: "brachiaria_brizantha",
    name: "Brachiaria brizantha cv. Marandú",
    scientificName: "Urochloa brizantha (Hochst. ex A. Rich.) R.D. Webster",
    family: "Poaceae (Gramínea tropical perenne)",
    origin: "África Tropical",
    crudeProtein: { min: 8.5, max: 13.0, avg: 10.5 },
    fdn: 58.0,
    fda: 34.5,
    digestibility: 58.0,
    yieldTonMsPerHaYear: 18.0,
    optimalRestDays: 35,
    minGrazingHeightCm: 15,
    entryHeightCm: 35,
    climate: "Trópico bajo y medio (0 - 1800 msnm)",
    precipitationMinMm: 800,
    soilReq: "Suelos de fertilidad media a alta, buen drenaje",
    antinutritional: "Contiene saponinas esteroidales (fotosensibilización en terneros y ovinos).",
    description: "Gramínea macollosa erecta de altísimo valor en ganadería de carne y doble propósito. Excelente respuesta a fertilización nitrogenada."
  },
  {
    id: "panicum_maximum",
    name: "Pasto Guinea / Mombaza",
    scientificName: "Megathyrsus maximus (Jacq.) B.K. Simon & S.W.L. Jacobs",
    family: "Poaceae (Gramínea tropical de macolla)",
    origin: "África Oriental",
    crudeProtein: { min: 11.0, max: 16.0, avg: 13.5 },
    fdn: 55.0,
    fda: 32.0,
    digestibility: 64.0,
    yieldTonMsPerHaYear: 28.0,
    optimalRestDays: 30,
    minGrazingHeightCm: 25,
    entryHeightCm: 70,
    climate: "Trópico bajo (0 - 1200 msnm), temperatura > 22°C",
    precipitationMinMm: 1000,
    soilReq: "Suelos profundos, muy fértiles y bien drenados (alta demanda de P y K)",
    antinutritional: "Bajo calcio en relación a oxalatos; cuidado en equinos.",
    description: "Forrajera reina de alta producción de biomasa y excelente palatabilidad para ganado lechero y engorde intensivo."
  },
  {
    id: "pennisetum_purpureum",
    name: "Pasto Elefante / King Grass / Maralfalfa",
    scientificName: "Cenchrus purpureus (Schumach.) Morrone",
    family: "Poaceae (Gramínea gigante de corte)",
    origin: "África Tropical",
    crudeProtein: { min: 9.0, max: 15.0, avg: 11.5 },
    fdn: 60.0,
    fda: 36.0,
    digestibility: 60.0,
    yieldTonMsPerHaYear: 45.0,
    optimalRestDays: 50,
    minGrazingHeightCm: 10,
    entryHeightCm: 180,
    climate: "Trópico bajo a medio (0 - 2200 msnm)",
    precipitationMinMm: 1200,
    soilReq: "Suelos francos y fértiles con abundante materia orgánica",
    antinutritional: "Acumulación de nitratos si se fertiliza con exceso de N en sequía.",
    description: "Forraje de corte por excelencia para estabulación, ensilaje y picado en fresco con rendimientos masivos."
  },
  {
    id: "lolium_perenne",
    name: "Rye Grass Perenne / Ballico Inglés",
    scientificName: "Lolium perenne L.",
    family: "Poaceae (Gramínea templada / clima frío)",
    origin: "Europa y Norte de África",
    crudeProtein: { min: 18.0, max: 24.0, avg: 21.0 },
    fdn: 42.0,
    fda: 22.0,
    digestibility: 76.0,
    yieldTonMsPerHaYear: 16.0,
    optimalRestDays: 28,
    minGrazingHeightCm: 6,
    entryHeightCm: 22,
    climate: "Trópico alto andino (2000 - 3200 msnm)",
    precipitationMinMm: 900,
    soilReq: "Suelos fértiles, ricos en humedad y materia orgánica, pH 5.8 - 7.0",
    antinutritional: "Peligro de timpanismo o exceso de MUN en leche si falta energía fermentable.",
    description: "Gramínea de referencia mundial en cuencas lecheras de alta producción. Extraordinaria digestibilidad."
  },
  {
    id: "medicago_sativa",
    name: "Alfalfa (Reina de las Leguminosas)",
    scientificName: "Medicago sativa L.",
    family: "Fabaceae (Leguminosa perenne fijadora de N₂)",
    origin: "Asia Menor y Cáucaso",
    crudeProtein: { min: 20.0, max: 26.0, avg: 23.5 },
    fdn: 38.0,
    fda: 26.0,
    digestibility: 72.0,
    yieldTonMsPerHaYear: 20.0,
    optimalRestDays: 32,
    minGrazingHeightCm: 5,
    entryHeightCm: 45,
    climate: "Valles interandinos y zonas templadas (1500 - 2800 msnm)",
    precipitationMinMm: 600,
    soilReq: "Suelos profundos, calcáreos, neutros (pH 6.5 - 7.5), sin compactación",
    antinutritional: "ALTO RIESGO DE TIMPANISMO ESPUMOSO si se pastorea con rocío matutino.",
    description: "Leguminosa forrajera de altísimo valor biológico, rica en Calcio, Fósforo, Vitaminas A y E."
  },
  {
    id: "pennisetum_clandestinum",
    name: "Pasto Kikuyo",
    scientificName: "Cenchrus clandestinus (Hochst. ex Chiov.) Morrone",
    family: "Poaceae (Gramínea estolonífera perenne)",
    origin: "África Oriental (Tierras altas de Kenia)",
    crudeProtein: { min: 14.0, max: 20.0, avg: 16.5 },
    fdn: 52.0,
    fda: 28.0,
    digestibility: 65.0,
    yieldTonMsPerHaYear: 15.0,
    optimalRestDays: 32,
    minGrazingHeightCm: 6,
    entryHeightCm: 22,
    climate: "Trópico alto andino (1800 - 3200 msnm)",
    precipitationMinMm: 800,
    soilReq: "Suelos de fertilidad media-alta con buena humedad",
    antinutritional: "Rico en oxalatos de calcio insolubles; acumula nitratos tras heladas.",
    description: "Base forrajera tradicional del trópico alto lechero. Muy resistente al pisoteo pero susceptible a heladas."
  }
];

/**
 * Banco de Problemas Zootécnicos y Casos de Pasturas
 */
export const PASTURE_EXAM_CASES = [
  {
    id: "prob_carrying_capacity",
    title: "Problema Zootécnico: Capacidad de Carga y Días de Ocupación",
    vignette: "Un potrero de 2.0 Ha de Brachiaria brizantha tiene una disponibilidad neta de 2,600 kg MS/Ha (descontando 20% de pérdidas por pisoteo). El lote a ingresar está compuesto por 40 novillos de 380 kg (Consumo diario = 3.0% del PV en MS).",
    question: "¿Cuántos días de ocupación puede permanecer el lote en este potrero antes de que la altura remanente baje de 15 cm?",
    formulaText: "Consumo diario lote = 40 novillos × (380 kg × 0.03) = 456 kg MS/día. Forraje total potrero = 2.0 Ha × 2,600 kg MS/Ha = 5,200 kg MS. Días = 5,200 / 456 = 11.4 días.",
    expectedNumber: 11.4,
    unit: "días",
    tolerance: 1.0,
    explanation: "Días de ocupación = (Área potrero × Biomasa neta MS/Ha) / (Número de animales × Consumo diario MS/animal)."
  },
  {
    id: "prob_voisin_paddocks",
    title: "Problema PRV: Dimensionamiento Matemático de Potreros (Leyes de Voisin)",
    vignette: "En una ganadería de leche en trópico alto, el Rye Grass requiere 32 días de descanso en época de lluvias para alcanzar su Punto Óptimo de Reposo (POR). El zootecnista establece un período de ocupación estricto de 1 día por potrero, manejando 2 lotes (Despunte y Repaso).",
    question: "Aplica la 1ª y 2ª Ley de Voisin: ¿Cuántos potreros totales (N) se deben delimitar en la finca?",
    formulaText: "N = (Días de Descanso / Días de Ocupación) + Número de Lotes = (32 / 1) + 2 = 34 potreros.",
    expectedNumber: 34,
    unit: "potreros",
    tolerance: 0,
    explanation: "Ecuación de Voisin: N = (D / O) + L. Con 34 potreros, cuando el lote de despunte regresa al potrero #1, este ha tenido exactamente 32 días de reposo."
  },
  {
    id: "prob_fertilizer_urea",
    title: "Problema Agronómico: Cálculo de Nitrógeno Puro y Dosis de Urea",
    vignette: "Se requiere aplicar 50 kg de Nitrógeno puro (N) por Hectárea en un potrero de 3.5 Ha de Pasto Guinea. Se dispone de Urea Agrícola (46% N).",
    question: "¿Cuántos bultos de Urea de 50 kg se deben adquirir en total para fertilizar las 3.5 Hectáreas?",
    formulaText: "Urea por Ha = 50 kg N / 0.46 = 108.7 kg Urea/Ha. Total 3.5 Ha = 108.7 × 3.5 = 380.4 kg de Urea. Bultos de 50 kg = 380.4 / 50 = 7.6 (Aprox. 8 bultos).",
    expectedNumber: 7.6,
    unit: "bultos (50kg)",
    tolerance: 0.5,
    explanation: "Dosis de producto comercial = (Dosis N deseada / % N del fertilizante) × Área en Ha."
  }
];

export class PastureLab {
  constructor(containerId, { storeInstance = store } = {}) {
    this.container = document.getElementById(containerId);
    this.store = storeInstance;

    this.selectedSpecies = FORAGE_SPECIES_DATABASE[0];
    this.activeSubTab = "fertilizer"; // "fertilizer", "paddocks", "cases", "herbarium", "sampling", "voisin", "silage"
    
    // Potreros de la Granja Escuela (8 Potreros)
    this.paddocks = [
      { id: 1, name: "Potrero 1 (Loma Alta)",   areaHa: 1.5, species: "Brachiaria brizantha", heightCm: 36, restDays: 35, dryMatterKgHa: 2800, state: "ready",   fertilized: true,  soilPh: 5.8, lastFertilizer: "NPK 15-15-15" },
      { id: 2, name: "Potrero 2 (Bajo Húmedo)", areaHa: 1.2, species: "Brachiaria brizantha", heightCm: 14, restDays: 6,  dryMatterKgHa: 950,  state: "growing", fertilized: false, soilPh: 5.2, lastFertilizer: "Ninguno" },
      { id: 3, name: "Potrero 3 (Corral Sur)",  areaHa: 1.4, species: "Brachiaria brizantha", heightCm: 18, restDays: 12, dryMatterKgHa: 1350, state: "growing", fertilized: false, soilPh: 4.8, lastFertilizer: "Ninguno" },
      { id: 4, name: "Potrero 4 (La Quebrada)", areaHa: 1.6, species: "Brachiaria brizantha", heightCm: 24, restDays: 20, dryMatterKgHa: 1900, state: "growing", fertilized: true,  soilPh: 6.0, lastFertilizer: "Urea 46%" },
      { id: 5, name: "Potrero 5 (El Mirador)",  areaHa: 1.3, species: "Brachiaria brizantha", heightCm: 29, restDays: 28, dryMatterKgHa: 2300, state: "growing", fertilized: false, soilPh: 5.5, lastFertilizer: "Ninguno" },
      { id: 6, name: "Potrero 6 (Plano Norte)", areaHa: 1.5, species: "Brachiaria brizantha", heightCm: 38, restDays: 38, dryMatterKgHa: 2950, state: "ready",   fertilized: true,  soilPh: 6.2, lastFertilizer: "Compost Orgánico" },
      { id: 7, name: "Potrero 7 (Reserva Silo)",areaHa: 2.0, species: "Pennisetum purpureum", heightCm: 160,restDays: 52, dryMatterKgHa: 6800, state: "ready",   fertilized: true,  soilPh: 6.1, lastFertilizer: "DAP 18-46-0" },
      { id: 8, name: "Potrero 8 (Babilla)",     areaHa: 1.0, species: "Brachiaria brizantha", heightCm: 8,  restDays: 2,  dryMatterKgHa: 500,  state: "occupied",fertilized: false, soilPh: 5.0, lastFertilizer: "Ninguno" }
    ];

    // Estado del Simulador de Fertilización
    this.fertState = {
      selectedFertilizerId: "urea",
      doseKgHa: 120,
      soilPh: 5.6,
      soilMoisture: "humedo", // "humedo", "sequia"
      soilDeficiency: "nitrogeno", // "nitrogeno", "fosforo", "potasio", "acidez"
      targetPaddockId: 1,
      lastEvaluation: null
    };

    // Aforo Virtual (5 Puntos con Cuadrante 1 m²)
    this.samplingPoints = [
      { point: "P1 (Alto)",   freshWeightG: 480, heightCm: 38 },
      { point: "P2 (Medio)",  freshWeightG: 420, heightCm: 34 },
      { point: "P3 (Bajo)",   freshWeightG: 310, heightCm: 26 },
      { point: "P4 (Sombra)", freshWeightG: 390, heightCm: 32 },
      { point: "P5 (Control)",freshWeightG: 450, heightCm: 36 }
    ];
    this.dryMatterPercent = 22.0;
    this.lossPercent = 20.0;

    // Silo de Reserva
    this.silageTonsAvailable = 14.5;
    this.silageQuality = { ph: 4.0, dryMatter: 32, lacticAcid: "Óptimo (Fermentación Láctica)" };

    // Casos
    this.activeStudyCase = PASTURE_EXAM_CASES[0];
    this.userCaseAnswer = "";
    this.caseValidationResult = null;

    this.init();
  }

  init() {
    this.fertState.lastEvaluation = FertilizerEngine.evaluateApplication({
      fertilizerId: this.fertState.selectedFertilizerId,
      doseKgHa: this.fertState.doseKgHa,
      soilPh: this.fertState.soilPh,
      soilMoisture: this.fertState.soilMoisture,
      soilDeficiency: this.fertState.soilDeficiency
    });

    this.render();
    this.store.on("action:ROTATE_PASTURE", () => this.rotateHerdToOptimal());
    this.store.on("change:day", () => this.advancePastureDays(1));
  }

  advancePastureDays(days = 1) {
    this.paddocks.forEach(p => {
      if (p.state === "occupied") {
        p.heightCm = Math.max(8, p.heightCm - (days * 6));
        p.dryMatterKgHa = Math.max(400, p.dryMatterKgHa - (days * 600));
      } else {
        p.restDays += days;
        p.heightCm = Math.min(60, p.heightCm + (days * 0.8));
        p.dryMatterKgHa = Math.min(3400, p.dryMatterKgHa + (days * 65));
        if (p.restDays >= 32 && p.heightCm >= 32) {
          p.state = "ready";
        }
      }
    });
    this.render();
  }

  rotateHerdToOptimal() {
    const current = this.paddocks.find(p => p.state === "occupied") || this.paddocks[0];
    current.state = "growing";
    current.restDays = 0;

    const candidates = this.paddocks.filter(p => p.id !== current.id && p.state === "ready");
    const next = candidates.length > 0
      ? candidates.sort((a, b) => b.dryMatterKgHa - a.dryMatterKgHa)[0]
      : this.paddocks[(current.id % this.paddocks.length)];

    next.state = "occupied";
    AudioFx.success();
    this.store.emit("toast:show", { msg: `🐄 <b>Hato Rotado:</b> Ingreso exitoso al <b>${next.name}</b> (${next.dryMatterKgHa} kg MS/Ha disponibles).` });
    this.render();
  }

  generateRandomStudyCase() {
    const idx = Math.floor(Math.random() * PASTURE_EXAM_CASES.length);
    this.activeStudyCase = PASTURE_EXAM_CASES[idx];
    this.userCaseAnswer = "";
    this.caseValidationResult = null;
    AudioFx.success();
    this.store.emit("toast:show", { msg: `🌱 <b>Nuevo Problema Agrostológico:</b> ${this.activeStudyCase.title}` });
    this.render();
  }

  render() {
    if (!this.container) return;

    const totalArea = this.paddocks.reduce((acc, p) => acc + p.areaHa, 0).toFixed(1);
    const avgHeight = (this.paddocks.reduce((acc, p) => acc + p.heightCm, 0) / this.paddocks.length).toFixed(1);
    const totalBiomass = Math.round(this.paddocks.reduce((acc, p) => acc + (p.dryMatterKgHa * p.areaHa), 0));
    const activePaddock = this.paddocks.find(p => p.state === "occupied") || this.paddocks[0];
    const herdUGM = 2.35;
    const instantaneousStockingRate = (herdUGM / activePaddock.areaHa).toFixed(2);

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- 1. Encabezado & Navegación de Sub-Pestañas -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="display font-bold text-lg md:text-xl text-white flex items-center gap-2 m-0">
                <span>🌱</span> Pastos, Forrajes & Nutrición Vegetal
              </h2>
              <span class="text-[10px] mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                Simulador de Campo
              </span>
            </div>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">
              Evaluación de fertilizantes con respuesta biológica (Excelente/Medio/Mal), aforo 1m², leyes de Voisin y herbario.
            </p>
          </div>

          <!-- Pestañas internas -->
          <div class="flex flex-wrap gap-1 bg-black/40 p-1.5 rounded-2xl border border-[var(--border)]">
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'fertilizer' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="fertilizer">
              🧪 Fertilización & Reacciones
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'paddocks' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="paddocks">
              🗺️ 8 Potreros en Vivo
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'sampling' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="sampling">
              📐 Aforo Cuadrante 1m²
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'herbarium' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="herbarium">
              🌿 Herbario Forrajero
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'voisin' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="voisin">
              🧠 Leyes de Voisin
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'silage' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="silage">
              🌾 Ensilaje & Heno
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeSubTab === 'cases' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-subtab="cases">
              🎲 Problemas de Examen
            </button>
          </div>
        </div>

        <!-- 2. Métricas Forrajeras Globales -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Área Total Pasturas</span>
            <b class="mono text-white text-base">${totalArea} Ha</b>
            <small class="text-[9px] text-emerald-400 block">${this.paddocks.length} Potreros Rotacionales</small>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Altura Media del Dosel</span>
            <b class="mono text-emerald-300 text-base">${avgHeight} cm</b>
            <small class="text-[9px] text-gray-400 block">Punto Óptimo: 32 - 38 cm</small>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Reserva Total de Biomasa</span>
            <b class="mono text-amber-300 text-base">${(totalBiomass / 1000).toFixed(1)} Ton MS</b>
            <small class="text-[9px] text-amber-200/80 block">${Math.round(totalBiomass / totalArea)} kg MS/Ha prom.</small>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Carga Instantánea</span>
            <b class="mono text-blue-300 text-base">${instantaneousStockingRate} UGM/Ha</b>
            <small class="text-[9px] text-blue-200 block">Potrero Ocupado: #${activePaddock.id}</small>
          </div>
        </div>

        <!-- 3. Contenedor Dinámico de Sub-Pestañas -->
        <div id="pastureSubtabContent">
          ${this.renderSubTabContent(activePaddock)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderSubTabContent(activePaddock) {
    if (this.activeSubTab === "fertilizer") {
      return this.renderFertilizerSimulator();
    } else if (this.activeSubTab === "paddocks") {
      return this.renderPaddocksLiveGrid(activePaddock);
    } else if (this.activeSubTab === "cases") {
      return this.renderProblemsGenerator();
    } else if (this.activeSubTab === "herbarium") {
      return this.renderScientificHerbarium();
    } else if (this.activeSubTab === "sampling") {
      return this.renderSamplingCalculator();
    } else if (this.activeSubTab === "voisin") {
      return this.renderVoisinLaws();
    } else if (this.activeSubTab === "silage") {
      return this.renderSilageModule();
    }
    return "";
  }

  /**
   * VISTA: SIMULADOR INTERACTIVO DE FERTILIZANTES CON RESPUESTA BIOLÓGICA
   */
  renderFertilizerSimulator() {
    const fs = this.fertState;
    const ev = fs.lastEvaluation || FertilizerEngine.evaluateApplication({
      fertilizerId: fs.selectedFertilizerId,
      doseKgHa: fs.doseKgHa,
      soilPh: fs.soilPh,
      soilMoisture: fs.soilMoisture,
      soilDeficiency: fs.soilDeficiency
    });

    const isExc = ev.verdict === "excelente";
    const isMed = ev.verdict === "medio";
    const isBad = ev.verdict === "mal";

    const reactionClass = isExc ? "reaction-excellent" : (isMed ? "reaction-medium" : "reaction-bad");
    const verdictBadge = isExc
      ? '<span class="badge-tag bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">🟢 REACCIÓN EXCELENTE</span>'
      : (isMed ? '<span class="badge-tag bg-amber-500/20 text-amber-300 border border-amber-500/50">🟡 REACCIÓN REGULAR / MEDIA</span>' : '<span class="badge-tag bg-red-500/20 text-red-300 border border-red-500/50">🔴 REACCIÓN MALA / FITOTÓXICO</span>');

    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <!-- Columna Izquierda: Configuración de Fertilizante y Suelo -->
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-4 md:p-5 rounded-2xl border border-[var(--border)]">
          <div class="border-b border-[var(--border)] pb-3">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>🧪</span> Configuración de Fertilización & Suelo
            </h3>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">Selecciona el fertilizante y las condiciones edafoclimáticas para simular la respuesta.</p>
          </div>

          <!-- 1. Selección de Fertilizante -->
          <div class="space-y-1.5 text-xs">
            <label class="text-gray-300 font-semibold flex items-center justify-between">
              <span>1. Tipo de Fertilizante o Enmienda:</span>
              <span class="text-emerald-400 mono text-[11px]">${ev.fertilizer.category}</span>
            </label>
            <select id="selectFertilizer" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 text-xs font-bold text-white">
              ${FERTILIZERS_DATABASE.map(f => `
                <option value="${f.id}" ${f.id === fs.selectedFertilizerId ? 'selected' : ''}>
                  ${f.icon} ${f.name}
                </option>
              `).join("")}
            </select>
            <p class="text-[11px] text-[var(--muted)] italic pt-0.5">${ev.fertilizer.desc}</p>
          </div>

          <!-- 2. Dosis por Hectárea -->
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between items-center">
              <label class="text-gray-300 font-semibold">2. Dosis a Aplicar:</label>
              <b class="mono text-emerald-300 text-sm" id="lblFertDose">${fs.doseKgHa} kg / Ha</b>
            </div>
            <input type="range" id="rngFertDose" min="${ev.fertilizer.minDoseKgHa}" max="${ev.fertilizer.maxDoseKgHa}" step="10" value="${fs.doseKgHa}" class="w-full">
            <div class="flex justify-between text-[10px] text-gray-400 mono">
              <span>Mín: ${ev.fertilizer.minDoseKgHa} kg/Ha</span>
              <span>Recomendado: ${ev.fertilizer.recommendedDoseKgHa} kg/Ha</span>
              <span>Máx: ${ev.fertilizer.maxDoseKgHa} kg/Ha</span>
            </div>
          </div>

          <!-- 3. Parámetros del Suelo & Clima -->
          <div class="grid grid-cols-2 gap-3 text-xs pt-1">
            <div class="space-y-1">
              <label class="text-gray-300 font-semibold">pH del Suelo:</label>
              <select id="selectSoilPh" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-xs text-white">
                <option value="4.5" ${fs.soilPh == 4.5 ? 'selected' : ''}>4.5 (Muy Ácido / Al³⁺)</option>
                <option value="5.2" ${fs.soilPh == 5.2 ? 'selected' : ''}>5.2 (Ácido)</option>
                <option value="5.8" ${fs.soilPh == 5.8 ? 'selected' : ''}>5.8 (Moderadamente ácido)</option>
                <option value="6.5" ${fs.soilPh == 6.5 ? 'selected' : ''}>6.5 (Neutro / Óptimo)</option>
                <option value="7.5" ${fs.soilPh == 7.5 ? 'selected' : ''}>7.5 (Alcalino)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-gray-300 font-semibold">Humedad / Clima:</label>
              <select id="selectSoilMoisture" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-xs text-white">
                <option value="humedo" ${fs.soilMoisture === 'humedo' ? 'selected' : ''}>💧 Lluvias / Suelo Húmedo</option>
                <option value="sequia" ${fs.soilMoisture === 'sequia' ? 'selected' : ''}>☀️ Sequía / Suelo Seco</option>
              </select>
            </div>
          </div>

          <div class="space-y-1 text-xs">
            <label class="text-gray-300 font-semibold">Deficiencia Principal del Lote:</label>
            <select id="selectSoilDeficiency" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-xs text-white">
              <option value="nitrogeno" ${fs.soilDeficiency === 'nitrogeno' ? 'selected' : ''}>🍂 Deficiencia de Nitrógeno (Hojas amarillentas)</option>
              <option value="fosforo" ${fs.soilDeficiency === 'fosforo' ? 'selected' : ''}>🟣 Deficiencia de Fósforo (Poco enraizamiento / Púrpura)</option>
              <option value="acidez" ${fs.soilDeficiency === 'acidez' ? 'selected' : ''}>⚠️ Suelo Ácido con Aluminio bloqueante</option>
            </select>
          </div>

          <!-- Destino de Aplicación -->
          <div class="pt-2 border-t border-[var(--border)] flex items-center justify-between">
            <span class="text-xs text-gray-300">Aplicar en Potrero:</span>
            <select id="selectTargetPaddock" class="p-2 rounded-xl border border-[var(--border)] bg-black/60 text-xs text-emerald-300 font-bold">
              ${this.paddocks.map(p => `
                <option value="${p.id}" ${p.id === fs.targetPaddockId ? 'selected' : ''}>
                  Lote #${p.id} - ${p.name} (${p.soilPh} pH)
                </option>
              `).join("")}
            </select>
          </div>

          <button id="btnApplyFertilizerToPaddock" class="btn w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-center gap-2">
            <span>🚀</span> Aplicar Tratamiento al Potrero Seleccionado
          </button>
        </div>

        <!-- Columna Derecha: Panel de Diagnóstico & Reacción Agronómica -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Tarjeta de Veredicto de Reacción -->
          <div class="${reactionClass} p-5 rounded-2xl space-y-4">
            <div class="flex flex-wrap justify-between items-start gap-2 border-b border-white/10 pb-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${ev.fertilizer.icon}</span>
                  <h4 class="display text-lg font-bold text-white m-0">Dictamen Biológico de la Pastura</h4>
                </div>
                <span class="text-xs text-gray-300 mono mt-0.5 block">Respuesta de ${this.selectedSpecies.name}</span>
              </div>
              <div class="text-right">
                ${verdictBadge}
                <span class="text-[10px] mono text-gray-300 block mt-1">Puntaje Eficiencia: <b>${ev.score}/100</b></span>
              </div>
            </div>

            <!-- Métricas de Impacto Cuantitativo -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="p-3 rounded-xl bg-black/40 border border-white/10">
                <span class="text-[9px] text-[var(--muted)] block uppercase">Biomasa Ganada</span>
                <b class="mono text-emerald-300 text-base">+${ev.biomassDeltaKgHa}</b>
                <small class="text-[9px] text-gray-400 block">kg MS / Ha</small>
              </div>

              <div class="p-3 rounded-xl bg-black/40 border border-white/10">
                <span class="text-[9px] text-[var(--muted)] block uppercase">Proteína Foliar (PC)</span>
                <b class="mono text-blue-300 text-base">+${ev.proteinDeltaPct}%</b>
                <small class="text-[9px] text-gray-400 block">Aumento en hoja</small>
              </div>

              <div class="p-3 rounded-xl bg-black/40 border border-white/10">
                <span class="text-[9px] text-[var(--muted)] block uppercase">Costo Tratamiento</span>
                <b class="mono text-amber-300 text-base">$${ev.costTotal}</b>
                <small class="text-[9px] text-gray-400 block">Inversión / Ha</small>
              </div>
            </div>

            <!-- Explicación Científica -->
            <div class="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <b class="text-white text-[11px] uppercase tracking-wider mono block">🔬 Fundamento Bioquímico & Agronómico:</b>
              
              ${ev.notes.length > 0 ? `
                <div class="space-y-1 text-gray-200">
                  ${ev.notes.map(n => `<div class="p-2 rounded bg-emerald-950/40 border border-emerald-500/20">${n}</div>`).join("")}
                </div>
              ` : ''}

              ${ev.warnings.length > 0 ? `
                <div class="space-y-1 text-rose-200">
                  ${ev.warnings.map(w => `<div class="p-2 rounded bg-red-950/50 border border-red-500/30">${w}</div>`).join("")}
                </div>
              ` : ''}

              <p class="text-[11px] text-gray-300 pt-1 leading-relaxed">
                ${isExc ? 'El plan nutricional armoniza perfectamente con la capacidad de intercambio catiónico y humedad del suelo, maximizando el rebrote y la calidad nutricional para el hato.' : (isMed ? 'Se observa respuesta parcial; existen factores limitantes como pH o desbalance de nutrientes que restringen la asimilación completa (Ley del Mínimo de Liebig).' : 'Tratamiento desfavorable o riesgoso. Existe peligro de pérdida económica por volatilización, bloqueo químico o riesgo de fitotoxicidad / nitratos para los animales.')}
              </p>
            </div>
          </div>

          <!-- Guía Rápida de Buenas Prácticas Agronómicas -->
          <div class="p-4 rounded-2xl bg-black/30 border border-[var(--border)] space-y-2 text-xs">
            <h5 class="font-bold text-white uppercase tracking-wider mono text-[11px] flex items-center gap-1.5">
              <span>💡</span> Recomendaciones Universitarias de Fertilización Forrajera
            </h5>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
              <li><b>Encalado preventivo:</b> Si el pH es menor a 5.2, aplicar Cal Dolomítica 30-45 días antes de fertilizar con N-P-K para evitar la fijación del fósforo por óxidos de aluminio.</li>
              <li><b>Aplicación de Urea:</b> Nunca aplicar urea sobre pastura seca en días de sol intenso; esperar a que el suelo esté húmedo o llueva para evitar pérdidas por volatilización de NH₃.</li>
              <li><b>Periodo de Retiro:</b> Dejar reposar el potrero al menos 21 a 35 días tras aplicar fertilizantes nitrogenados antes de reingresar al ganado, previniendo intoxicación por nitratos.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA: POTREROS EN VIVO (MAPA & ACCIONES)
   */
  renderPaddocksLiveGrid(activePaddock) {
    return `
      <div class="space-y-4">
        <div class="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-[var(--border)]">
          <div>
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono flex items-center gap-1.5 m-0">
              <span>📍</span> Estado de los 8 Potreros de la Finca Escuela
            </h4>
            <p class="text-[11px] text-[var(--muted)] m-0">Supervisión en vivo de descanso, altura de dosel, pH del suelo y fertilizaciones previas.</p>
          </div>
          <button id="btnExecuteHerdRotation" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex items-center gap-1.5">
            <span>🐄</span> Rotar Hato al Potrero Óptimo
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${this.paddocks.map(p => {
            const isOcc = p.state === "occupied";
            const isReady = p.state === "ready";
            const stateBorder = isOcc ? 'border-blue-500/60 bg-blue-950/40 ring-2 ring-blue-500/50' : (isReady ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-white/10 bg-black/20');
            const stateBadge = isOcc ? '<span class="px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 font-bold">OCUPADO</span>' : (isReady ? '<span class="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">PUNTO ÓPTIMO</span>' : '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">EN REPOSO</span>');

            return `
              <div class="p-4 rounded-2xl border ${stateBorder} space-y-2.5 transition hover:bg-white/5">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="mono text-[10px] text-[var(--muted)] block">LOTE #${p.id} · ${p.areaHa} Ha</span>
                    <b class="text-xs text-white block">${p.name}</b>
                  </div>
                  <div class="text-[10px] mono">${stateBadge}</div>
                </div>

                <div class="text-[11px] text-[var(--muted)] flex justify-between">
                  <span>Especie: <b class="text-gray-200">${p.species}</b></span>
                  <span>pH: <b class="text-amber-300 mono">${p.soilPh || 5.5}</b></span>
                </div>

                <div class="text-[10px] text-gray-400">
                  Última labor: <b class="text-emerald-300">${p.lastFertilizer || 'Ninguna'}</b>
                </div>

                <div>
                  <div class="flex justify-between text-[10px] mono mb-1">
                    <span class="text-gray-400">Altura: <b>${p.heightCm} cm</b></span>
                    <span class="text-emerald-400"><b>${p.dryMatterKgHa}</b> kg MS/Ha</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                    <div class="h-full ${isOcc ? 'bg-blue-500' : (isReady ? 'bg-emerald-400' : 'bg-amber-400')}" style="width:${Math.min(100, (p.heightCm / 40) * 100)}%"></div>
                  </div>
                </div>

                <div class="text-[10px] text-[var(--muted)] flex justify-between pt-1 border-t border-[var(--border)]">
                  <span>Días Descanso: <b class="text-white">${p.restDays}d</b></span>
                  <span>Disponibilidad: <b class="text-emerald-300">${Math.round(p.dryMatterKgHa * p.areaHa)} kg MS</b></span>
                </div>

                <div class="grid grid-cols-2 gap-1.5 pt-1">
                  <button class="btn btn-quick-fert p-1.5 rounded-lg border border-[var(--border)] bg-black/30 hover:bg-emerald-950 text-[10px] font-semibold text-emerald-300" data-paddock-id="${p.id}">
                    🧪 Fertilizar
                  </button>
                  <button class="btn btn-harvest-silo p-1.5 rounded-lg border border-[var(--border)] bg-black/30 hover:bg-amber-950 text-[10px] font-semibold text-amber-300" data-paddock-id="${p.id}">
                    🌾 Cosechar Silo
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  /**
   * VISTA: GENERADOR DE PROBLEMAS ZOOTÉCNICOS
   */
  renderProblemsGenerator() {
    const c = this.activeStudyCase;

    return `
      <div class="space-y-4 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-5 rounded-2xl border border-emerald-500/40">
        <div class="flex justify-between items-center border-b border-[var(--border)] pb-3">
          <div>
            <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
              <span>🎲</span> Generador de Problemas de Pastoreo & Aforo en Vivo
            </h4>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">Resuelve problemas reales de capacidad de carga, leyes de Voisin y fertilización para tus exámenes.</p>
          </div>
          <button id="btnGeneratePastureProblem" class="btn px-4 py-2 rounded-xl border border-emerald-400/40 bg-emerald-900/60 hover:bg-emerald-800/70 text-xs font-bold text-emerald-200 flex items-center gap-1.5 shadow">
            <span>🔄</span> Nuevo Problema
          </button>
        </div>

        <div class="p-4 rounded-xl bg-black/50 border border-emerald-400/30 space-y-3 text-xs">
          <div class="flex justify-between items-center">
            <b class="text-sm text-white">${c.title}</b>
            <span class="mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">EVALUACIÓN AGROSTOLÓGICA</span>
          </div>

          <p class="text-gray-200 text-xs leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
            ${c.vignette}
          </p>

          <div class="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 font-semibold">
            ❓ <b>Pregunta:</b> ${c.question}
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <label class="text-gray-300 font-medium">Ingresa tu cálculo:</label>
            <input type="number" id="inputCaseAnswer" step="0.01" placeholder="Ej. 11.4" value="${this.userCaseAnswer}" class="p-2 w-32 rounded-xl border border-[var(--border)] bg-black/60 text-xs font-bold text-emerald-300 text-center">
            <span class="text-gray-400 font-mono">${c.unit}</span>
            <button id="btnSubmitCaseAnswer" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1">
              <span>💡</span> Comprobar Solución
            </button>
          </div>
        </div>

        ${this.caseValidationResult ? `
          <div class="p-4 rounded-xl border ${this.caseValidationResult.passed ? 'border-emerald-500/50 bg-emerald-950/40' : 'border-rose-500/50 bg-rose-950/40'} space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <b class="text-sm ${this.caseValidationResult.passed ? 'text-emerald-300' : 'text-rose-300'}">
                ${this.caseValidationResult.passed ? '🎉 ¡Cálculo Correcto! Aprobado' : '❌ Respuesta Incorrecta'}
              </b>
              <span class="mono text-white text-xs">Respuesta esperada: <b>${c.expectedNumber} ${c.unit}</b></span>
            </div>
            <div class="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1 text-gray-200 text-[11px]">
              <b>Paso a paso de la fórmula zootécnica:</b>
              <div class="mono text-emerald-300">${c.formulaText}</div>
              <p class="text-gray-300 mt-1 mb-0">${c.explanation}</p>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * VISTA: HERBARIO CIENTÍFICO
   */
  renderScientificHerbarium() {
    const s = this.selectedSpecies;

    return `
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-1 space-y-2 bg-black/30 p-3 rounded-2xl border border-[var(--border)] max-h-[520px] overflow-y-auto">
          <h4 class="font-bold text-xs text-white uppercase tracking-wider mono mb-2">
            🌿 Especies Forrajeras
          </h4>
          ${FORAGE_SPECIES_DATABASE.map(spec => `
            <div class="btn p-3 rounded-xl border ${spec.id === s.id ? 'border-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-400' : 'border-white/5 bg-black/20 hover:bg-white/5'} text-left cursor-pointer species-card" data-species-id="${spec.id}">
              <div class="flex justify-between items-center">
                <b class="text-xs text-white block">${spec.name}</b>
                <span class="mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 font-bold">${spec.crudeProtein.avg}% PC</span>
              </div>
              <i class="text-[10px] text-[var(--muted)] block mt-0.5">${spec.scientificName}</i>
              <span class="text-[9px] text-gray-400 block mt-1">${spec.family}</span>
            </div>
          `).join("")}
        </div>

        <div class="lg:col-span-2 space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
          <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ${s.family}
                </span>
                <span class="text-[10px] text-[var(--muted)] mono">Origen: ${s.origin}</span>
              </div>
              <h3 class="display text-lg font-bold text-white mt-1 mb-0">${s.name}</h3>
              <i class="text-xs text-emerald-400 mono">${s.scientificName}</i>
            </div>
            <button id="btnSowSelectedSpecies" class="btn px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-xs font-bold text-emerald-300 flex items-center gap-1">
              <span>🌱</span> Sembrar en Potrero Activo
            </button>
          </div>

          <p class="text-xs text-gray-200 leading-relaxed">${s.description}</p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">PROTEÍNA CRUDA (PC)</span>
              <b class="mono text-emerald-400 text-sm">${s.crudeProtein.avg}%</b>
              <small class="text-[8px] text-[var(--muted)] block">Rango: ${s.crudeProtein.min}–${s.crudeProtein.max}%</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">FIBRA DETERGENTE NEUTRO</span>
              <b class="mono text-amber-300 text-sm">${s.fdn}% FDN</b>
              <small class="text-[8px] text-[var(--muted)] block">FDA: ${s.fda}%</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">DIGESTIBILIDAD IN VITRO</span>
              <b class="mono text-blue-300 text-sm">${s.digestibility}%</b>
              <small class="text-[8px] text-[var(--muted)] block">Tasa de degradación</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">RENDIMIENTO ESTIMADO</span>
              <b class="mono text-purple-300 text-sm">${s.yieldTonMsPerHaYear} Ton/Ha/año</b>
              <small class="text-[8px] text-[var(--muted)] block">Materia Seca</small>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <b class="text-emerald-300 text-[11px] uppercase tracking-wider block mono">Manejo del Pastoreo:</b>
              <div class="flex justify-between"><span class="text-[var(--muted)]">Días de descanso óptimo:</span><b class="text-white">${s.optimalRestDays} días</b></div>
              <div class="flex justify-between"><span class="text-[var(--muted)]">Altura de entrada (POR):</span><b class="text-white">${s.entryHeightCm} cm</b></div>
              <div class="flex justify-between"><span class="text-[var(--muted)]">Altura de salida / remanente:</span><b class="text-white">${s.minGrazingHeightCm} cm</b></div>
            </div>

            <div class="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <b class="text-blue-300 text-[11px] uppercase tracking-wider block mono">Requerimientos Edafo-Climáticos:</b>
              <div class="flex justify-between"><span class="text-[var(--muted)]">Piso térmico:</span><span class="text-gray-300">${s.climate}</span></div>
              <div class="flex justify-between"><span class="text-[var(--muted)]">Precipitación mínima:</span><b class="text-white">${s.precipitationMinMm} mm/año</b></div>
              <div class="text-[10px] text-gray-400 mt-1">Suelos: ${s.soilReq}</div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1">
            <b class="text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider mono">
              <span>⚠️</span> Toxicología & Factores Antinutricionales
            </b>
            <p class="text-gray-300 text-[11px] leading-relaxed mb-0">${s.antinutritional}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA: AFORO Y MUESTREO 1m²
   */
  renderSamplingCalculator() {
    const avgFresh = this.samplingPoints.reduce((acc, p) => acc + p.freshWeightG, 0) / this.samplingPoints.length;
    const freshTonHa = (avgFresh * 10) / 1000;
    const dryMatterKgHa = Math.round((avgFresh * 10) * (this.dryMatterPercent / 100));
    const availableDryMatterKgHa = Math.round(dryMatterKgHa * (1 - (this.lossPercent / 100)));

    return `
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-1 space-y-3 bg-black/30 p-4 rounded-2xl border border-[var(--border)]">
          <div class="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono m-0">
              📐 5 Puntos de Aforo (1 m²)
            </h4>
            <span class="text-[10px] text-emerald-400 mono">Doble Muestreo</span>
          </div>

          <div class="space-y-2" id="samplingList">
            ${this.samplingPoints.map((sp, idx) => `
              <div class="p-2.5 rounded-xl border border-white/5 bg-black/30 flex items-center justify-between text-xs">
                <div>
                  <b class="text-white block">${sp.point}</b>
                  <span class="text-[10px] text-[var(--muted)] mono">Altura: ${sp.heightCm} cm</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="number" value="${sp.freshWeightG}" min="50" max="1500" step="10" class="input-sampling-point w-20 p-1.5 rounded-lg border border-[var(--border)] bg-black/60 text-xs font-bold text-emerald-300 text-right" data-index="${idx}">
                  <span class="text-[10px] text-gray-400">g/m²</span>
                </div>
              </div>
            `).join("")}
          </div>

          <button id="btnRandomizeSampling" class="btn w-full p-2 rounded-xl border border-[var(--border)] bg-black/40 text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5">
            <span>🎲</span> Simular Nuevo Muestreo en Campo
          </button>
        </div>

        <div class="lg:col-span-2 space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
          <h4 class="font-bold text-sm text-white uppercase tracking-wider mono flex items-center gap-1.5 m-0">
            <span>📊</span> Resultados del Aforo & Balance de Pastoreo
          </h4>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">PROMEDIO FORRAJE VERDE</span>
              <b class="mono text-white text-base">${Math.round(avgFresh)} g / m²</b>
              <small class="text-[8px] text-emerald-400 block">${freshTonHa.toFixed(1)} Ton FV / Ha</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">BIOMASA SECA TOTAL</span>
              <b class="mono text-amber-300 text-base">${dryMatterKgHa}</b>
              <small class="text-[8px] text-gray-400 block">kg MS / Ha (${this.dryMatterPercent}% MS)</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">DISPONIBILIDAD NETA</span>
              <b class="mono text-emerald-400 text-base">${availableDryMatterKgHa}</b>
              <small class="text-[8px] text-emerald-300 block">kg MS / Ha (Desc. ${this.lossPercent}% pérdida)</small>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 text-xs">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Materia Seca estimada (% MS):</span>
                <b class="mono text-amber-300" id="lblMsPercent">${this.dryMatterPercent}%</b>
              </div>
              <input type="range" id="rngMsPercent" min="15" max="35" step="0.5" value="${this.dryMatterPercent}" class="w-full">
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Pérdida por Pisoteo y Bosteas (%):</span>
                <b class="mono text-blue-300" id="lblLossPercent">${this.lossPercent}%</b>
              </div>
              <input type="range" id="rngLossPercent" min="10" max="40" step="1" value="${this.lossPercent}" class="w-full">
            </div>
          </div>

          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs">
            <b class="text-emerald-300 uppercase tracking-wider block mono text-[11px]">
              🎯 Capacidad de Carga del Lote (1.5 Ha)
            </b>
            <p class="text-gray-200 m-0">
              Con <b>${availableDryMatterKgHa} kg MS/Ha</b> netos, un potrero de 1.5 Ha ofrece <b>${Math.round(availableDryMatterKgHa * 1.5)} kg MS disponibles</b>.
              El hato consume <b>${(2.35 * 13.5).toFixed(1)} kg MS/día</b>.
            </p>
            <div class="flex justify-between items-center pt-2 border-t border-emerald-500/30 text-[11px]">
              <span>Días de pastoreo que soporta sin sobrepastoreo:</span>
              <b class="mono text-emerald-300 text-sm">${(Math.round(availableDryMatterKgHa * 1.5) / (2.35 * 13.5)).toFixed(1)} Días</b>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA: LEYES DE VOISIN
   */
  renderVoisinLaws() {
    return `
      <div class="space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
        <div class="border-b border-[var(--border)] pb-3">
          <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
            <span>🧠</span> Las 4 Leyes Universales del Pastoreo Racional Voisin (PRV)
          </h4>
          <p class="text-xs text-[var(--muted)] mt-1 mb-0">Fundamentos bio-fisiológicos para maximizar la cosecha de forraje y triplicar la fertilidad del suelo.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3 text-xs">
          <div class="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1.5">
            <b class="text-emerald-300 text-xs block mono">1ª Ley: Ley del Reposo</b>
            <p class="text-gray-300 text-[11px] leading-relaxed m-0">
              Para que un pasto dé su máxima productividad, es indispensable que entre dos cortes sucesivos transcurra suficiente tiempo para acumular reservas en sus raíces y lograr su "Llamarada de Crecimiento".
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-blue-500/30 space-y-1.5">
            <b class="text-blue-300 text-xs block mono">2ª Ley: Ley de la Ocupación</b>
            <p class="text-gray-300 text-[11px] leading-relaxed m-0">
              El tiempo global de estancia en un potrero debe ser lo suficientemente corto (máx. 1 a 3 días) para que ningún animal paste el rebrote de la misma hierba nacida en el mismo período.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
            <b class="text-amber-300 text-xs block mono">3ª Ley: Ley del Rendimiento Máximo</b>
            <p class="text-gray-300 text-[11px] leading-relaxed m-0">
              Es necesario ayudar a los animales con mayores exigencias nutricionales (vacas en pico de lactancia) a cosechar la mayor cantidad de hierba de mejor calidad posible mediante despunte.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-purple-500/30 space-y-1.5">
            <b class="text-purple-300 text-xs block mono">4ª Ley: Ley del Rendimiento Regular</b>
            <p class="text-gray-300 text-[11px] leading-relaxed m-0">
              Para que una vaca dé rendimientos regulares de leche, no debe permanecer más de 3 días en un mismo potrero; los rendimientos serán máximos si la estancia es de 1 día.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA: CONSERVACIÓN DE FORRAJES
   */
  renderSilageModule() {
    return `
      <div class="space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
        <div class="flex justify-between items-center border-b border-[var(--border)] pb-3">
          <div>
            <h4 class="display font-bold text-base text-white flex items-center gap-2 m-0">
              <span>🌾</span> Conservación Forrajera (Ensilaje & Henificación)
            </h4>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">Reserva estratégica de biomasa para mitigar déficits en épocas de sequía o heladas.</p>
          </div>
          <span class="mono text-xs px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold">
            Silo Trinchera Activo
          </span>
        </div>

        <div class="grid sm:grid-cols-3 gap-3 text-xs">
          <div class="chip text-center">
            <span class="text-[9px] text-[var(--muted)] block">RESERVA DE ENSILAJE</span>
            <b class="mono text-emerald-400 text-lg">${this.silageTonsAvailable.toFixed(1)} Ton</b>
            <small class="text-[9px] text-gray-400 block">Maíz + Pasto de Corte</small>
          </div>
          <div class="chip text-center">
            <span class="text-[9px] text-[var(--muted)] block">pH DEL SILO</span>
            <b class="mono text-amber-300 text-lg">${this.silageQuality.ph}</b>
            <small class="text-[9px] text-emerald-300 block">${this.silageQuality.lacticAcid}</small>
          </div>
          <div class="chip text-center">
            <span class="text-[9px] text-[var(--muted)] block">MATERIA SECA DEL SILO</span>
            <b class="mono text-blue-300 text-lg">${this.silageQuality.dryMatter}%</b>
            <small class="text-[9px] text-blue-200 block">Óptimo: 30 - 35% MS</small>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 text-xs">
          <h5 class="font-bold text-white uppercase tracking-wider mono text-[11px] m-0">Fases de Fermentación Anaerobia:</h5>
          <ol class="list-decimal list-inside space-y-1.5 text-gray-300 m-0">
            <li><b>Fase Aerobia (0-24h):</b> Consumo de oxígeno remanente por respiración celular. Compactación clave.</li>
            <li><b>Fase Anaerobia (1-21 días):</b> Proliferación de *Lactobacillus plantarum*, caída de pH a < 4.0.</li>
            <li><b>Fase de Estabilidad:</b> Conservación anaeróbica prolongada.</li>
          </ol>
        </div>

        <div class="flex justify-between items-center pt-2">
          <span class="text-xs text-[var(--muted)]">Capacidad para alimentar al hato durante 45 días de sequía.</span>
          <button id="btnProduceMoreSilage" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-emerald-600 text-white flex items-center gap-1.5 shadow">
            <span>🚜</span> Cosechar Potrero #7 para Nuevo Silo (+5 Ton)
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Pestañas
    document.querySelectorAll(".pasture-subtab").forEach(tab => {
      tab.onclick = () => {
        this.activeSubTab = tab.dataset.subtab;
        AudioFx.click();
        this.render();
      };
    });

    // Simulador de fertilizantes
    const selFert = document.getElementById("selectFertilizer");
    if (selFert) {
      selFert.onchange = (e) => {
        this.fertState.selectedFertilizerId = e.target.value;
        const found = FERTILIZERS_DATABASE.find(f => f.id === e.target.value);
        if (found) this.fertState.doseKgHa = found.recommendedDoseKgHa;
        this.fertState.lastEvaluation = FertilizerEngine.evaluateApplication(this.fertState);
        AudioFx.click();
        this.render();
      };
    }

    const rngDose = document.getElementById("rngFertDose");
    if (rngDose) {
      rngDose.oninput = (e) => {
        this.fertState.doseKgHa = parseFloat(e.target.value);
        this.fertState.lastEvaluation = FertilizerEngine.evaluateApplication(this.fertState);
        const lbl = document.getElementById("lblFertDose");
        if (lbl) lbl.textContent = `${this.fertState.doseKgHa} kg / Ha`;
        this.render();
      };
    }

    const selPh = document.getElementById("selectSoilPh");
    if (selPh) {
      selPh.onchange = (e) => {
        this.fertState.soilPh = parseFloat(e.target.value);
        this.fertState.lastEvaluation = FertilizerEngine.evaluateApplication(this.fertState);
        this.render();
      };
    }

    const selMoist = document.getElementById("selectSoilMoisture");
    if (selMoist) {
      selMoist.onchange = (e) => {
        this.fertState.soilMoisture = e.target.value;
        this.fertState.lastEvaluation = FertilizerEngine.evaluateApplication(this.fertState);
        this.render();
      };
    }

    const selDef = document.getElementById("selectSoilDeficiency");
    if (selDef) {
      selDef.onchange = (e) => {
        this.fertState.soilDeficiency = e.target.value;
        this.fertState.lastEvaluation = FertilizerEngine.evaluateApplication(this.fertState);
        this.render();
      };
    }

    const selTargetP = document.getElementById("selectTargetPaddock");
    if (selTargetP) {
      selTargetP.onchange = (e) => {
        this.fertState.targetPaddockId = parseInt(e.target.value, 10);
      };
    }

    const btnApplyFert = document.getElementById("btnApplyFertilizerToPaddock");
    if (btnApplyFert) {
      btnApplyFert.onclick = () => {
        const ev = this.fertState.lastEvaluation;
        const p = this.paddocks.find(item => item.id === this.fertState.targetPaddockId);
        if (p && ev) {
          p.fertilized = true;
          p.lastFertilizer = `${ev.fertilizer.name} (${this.fertState.doseKgHa} kg/Ha)`;
          p.dryMatterKgHa = Math.min(3800, p.dryMatterKgHa + ev.biomassDeltaKgHa);
          p.heightCm = Math.min(65, p.heightCm + (ev.verdict === "excelente" ? 8 : (ev.verdict === "medio" ? 4 : 1)));

          if (ev.verdict === "excelente") {
            AudioFx.success();
            this.store.emit("toast:show", { msg: `🎉 <b>¡Fertilización Magistral en ${p.name}!</b> Reacción Excelente: +${ev.biomassDeltaKgHa} kg MS/Ha (+${ev.proteinDeltaPct}% Proteína).` });
          } else if (ev.verdict === "medio") {
            AudioFx.click();
            this.store.emit("toast:show", { msg: `⚠️ <b>Fertilización Aplicada en ${p.name}:</b> Reacción Regular: +${ev.biomassDeltaKgHa} kg MS/Ha.` });
          } else {
            AudioFx.warning();
            this.store.emit("toast:show", { msg: `🔴 <b>Advertencia Agronómica en ${p.name}:</b> Reacción deficiente o fitotóxica. Revisa el pH y la humedad.` });
          }

          this.render();
        }
      };
    }

    // Botones en lista de potreros
    document.querySelectorAll(".btn-quick-fert").forEach(btn => {
      btn.onclick = () => {
        const pid = parseInt(btn.dataset.paddockId, 10);
        this.fertState.targetPaddockId = pid;
        this.activeSubTab = "fertilizer";
        AudioFx.click();
        this.render();
      };
    });

    document.querySelectorAll(".btn-harvest-silo").forEach(btn => {
      btn.onclick = () => {
        const pid = parseInt(btn.dataset.paddockId, 10);
        const p = this.paddocks.find(item => item.id === pid);
        if (p) {
          const harvestedTons = (p.dryMatterKgHa * p.areaHa * 3.5) / 1000;
          this.silageTonsAvailable += harvestedTons;
          p.heightCm = 10;
          p.dryMatterKgHa = 500;
          p.restDays = 0;
          p.state = "growing";
          AudioFx.success();
          this.store.emit("toast:show", { msg: `🚜 <b>Cosecha de Silo:</b> +${harvestedTons.toFixed(1)} Toneladas de forraje desde ${p.name}.` });
          this.render();
        }
      };
    });

    const btnRot = document.getElementById("btnExecuteHerdRotation");
    if (btnRot) {
      btnRot.onclick = () => this.rotateHerdToOptimal();
    }

    // Herbario
    document.querySelectorAll(".species-card").forEach(card => {
      card.onclick = () => {
        const specId = card.dataset.speciesId;
        const found = FORAGE_SPECIES_DATABASE.find(s => s.id === specId);
        if (found) {
          this.selectedSpecies = found;
          AudioFx.click();
          this.render();
        }
      };
    });

    const btnSow = document.getElementById("btnSowSelectedSpecies");
    if (btnSow) {
      btnSow.onclick = () => {
        const activeP = this.paddocks.find(p => p.state === "occupied") || this.paddocks[0];
        activeP.species = this.selectedSpecies.name;
        AudioFx.success();
        this.store.emit("toast:show", { msg: `🌱 <b>Siembra Realizada:</b> Has sembrado <b>${this.selectedSpecies.name}</b> en el ${activeP.name}.` });
        this.activeSubTab = "paddocks";
        this.render();
      };
    }

    // Muestreo Aforo
    document.querySelectorAll(".input-sampling-point").forEach(inp => {
      inp.onchange = (e) => {
        const idx = parseInt(inp.dataset.index, 10);
        const val = parseFloat(e.target.value) || 300;
        this.samplingPoints[idx].freshWeightG = val;
        this.render();
      };
    });

    const btnRand = document.getElementById("btnRandomizeSampling");
    if (btnRand) {
      btnRand.onclick = () => {
        this.samplingPoints.forEach(sp => {
          sp.freshWeightG = Math.round(280 + Math.random() * 320);
          sp.heightCm = Math.round(25 + Math.random() * 18);
        });
        AudioFx.click();
        this.render();
      };
    }

    const rngMs = document.getElementById("rngMsPercent");
    if (rngMs) {
      rngMs.oninput = (e) => {
        this.dryMatterPercent = parseFloat(e.target.value);
        this.render();
      };
    }
    const rngLoss = document.getElementById("rngLossPercent");
    if (rngLoss) {
      rngLoss.oninput = (e) => {
        this.lossPercent = parseFloat(e.target.value);
        this.render();
      };
    }

    // Problemas
    const btnGenProb = document.getElementById("btnGeneratePastureProblem");
    if (btnGenProb) {
      btnGenProb.onclick = () => this.generateRandomStudyCase();
    }

    const btnSubCase = document.getElementById("btnSubmitCaseAnswer");
    if (btnSubCase) {
      btnSubCase.onclick = () => {
        const inp = document.getElementById("inputCaseAnswer");
        const val = parseFloat(inp ? inp.value : 0);
        this.userCaseAnswer = val;

        const c = this.activeStudyCase;
        const diff = Math.abs(val - c.expectedNumber);
        const passed = diff <= c.tolerance;

        this.caseValidationResult = { passed, diff };

        if (passed) {
          AudioFx.success();
          this.store.emit("toast:show", { msg: `🎉 <b>¡Excelente!</b> Respuesta zootécnica correcta: ${c.expectedNumber} ${c.unit}.` });
        } else {
          AudioFx.warning();
        }

        this.render();
      };
    }

    const btnSil = document.getElementById("btnProduceMoreSilage");
    if (btnSil) {
      btnSil.onclick = () => {
        this.silageTonsAvailable += 5.0;
        AudioFx.success();
        this.store.emit("toast:show", { msg: `🌾 <b>Silo Producido:</b> +5.0 Toneladas añadidas a la reserva estratégica.` });
        this.render();
      };
    }
  }
}
