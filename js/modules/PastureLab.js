/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: PastureLab.js - Laboratorio Universitario de Agrostología, Pastos, Forrajes,
 * Manejo de Pastoreo Voisin y Generador de Casos/Problemas de Campo en Vivo
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";

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
    crudeProtein: { min: 8.5, max: 13.0, avg: 10.5 }, // % PC
    fdn: 58.0, // % Fibra Detergente Neutro
    fda: 34.5, // % Fibra Detergente Ácido
    digestibility: 58.0, // % Digestibilidad
    yieldTonMsPerHaYear: 18.0, // Toneladas MS / Ha / año
    optimalRestDays: 35, // Días de descanso recomendados
    minGrazingHeightCm: 15,
    entryHeightCm: 35,
    climate: "Trópico bajo y medio (0 - 1800 msnm)",
    precipitationMinMm: 800,
    soilReq: "Suelos de fertilidad media a alta, buen drenaje (susceptible a encharcamiento)",
    antinutritional: "Contiene saponinas esteroidales (puede causar fotosensibilización hepatógena en ovinos y terneros jóvenes).",
    description: "Gramínea macollosa erecta de altísimo valor en ganadería de carne y doble propósito. Excelente respuesta a fertilización nitrogenada y tolerancia al salivazo (*Aeneolamia spp.*)."
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
    antinutritional: "Bajo contenido de calcio soluble en relación a oxalatos; puede causar hiperparatiroidismo secundario en equinos si es monocultivo.",
    description: "Forrajera reina de alta producción de biomasa y excelente palatabilidad para ganado lechero y engorde intensivo. Exige rotaciones estrictas para evitar encañado."
  },
  {
    id: "pennisetum_purpureum",
    name: "Pasto Elefante / Maralfalfa / King Grass",
    scientificName: "Cenchrus purpureus (Schumach.) Morrone",
    family: "Poaceae (Gramínea gigante de corte y acarreo)",
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
    antinutritional: "Acumulación de nitratos si se fertiliza con exceso de N en sequía; hojas con tricomas ásperos que pueden reducir consumo si madura.",
    description: "Forraje de corte por excelencia para estabulación, ensilaje y picado en fresco. Capacidad fotosintética C4 sobresaliente con producciones de hasta 200 ton Forraje Verde/ha/año."
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
    climate: "Trópico alto y zonas templadas (2000 - 3200 msnm)",
    precipitationMinMm: 900,
    soilReq: "Suelos fértiles, ricos en humedad y materia orgánica, pH 5.8 - 7.0",
    antinutritional: "Peligro de timpanismo o exceso de nitrógeno ureico en leche (MUN) si la energía fermentable en rumen no balancea su alta proteína soluble.",
    description: "Gramínea de referencia mundial en cuencas lecheras de alta producción. Extraordinaria digestibilidad y rápida tasa de pasaje ruminal."
  },
  {
    id: "medicago_sativa",
    name: "Alfalfa (La Reina de las Leguminosas)",
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
    soilReq: "Suelos profundos, calcáreos, neutros (pH 6.5 - 7.5), sin compactación (raíz pivotante hasta 4m)",
    antinutritional: "ALTO RIESGO DE TIMPANISMO ESPUMOSO (Meteorismo ruminal) por contenido de saponinas y proteínas solubles citoplasmáticas si se pastorea con rocío.",
    description: "Leguminosa forrajera de altísimo valor biológico, rica en Calcio, Fósforo, Vitaminas A y E. Fija más de 200 kg N/ha/año en simbiosis con *Sinorhizobium meliloti*."
  },
  {
    id: "trifolium_repens",
    name: "Trébol Blanco",
    scientificName: "Trifolium repens L.",
    family: "Fabaceae (Leguminosa estolonífera perenne)",
    origin: "Europa",
    crudeProtein: { min: 22.0, max: 28.0, avg: 25.0 },
    fdn: 32.0,
    fda: 20.0,
    digestibility: 80.0,
    yieldTonMsPerHaYear: 10.0,
    optimalRestDays: 28,
    minGrazingHeightCm: 4,
    entryHeightCm: 18,
    climate: "Trópico alto y clima templado frío",
    precipitationMinMm: 800,
    soilReq: "Suelos húmedos y fértiles con disponibilidad de Fósforo",
    antinutritional: "Riesgo moderado de timpanismo espumoso; presencia de glucósidos cianogénicos en concentraciones bajas no tóxicas.",
    description: "Excelente leguminosa rastrera que coloniza mediante estolones. Forma una asociación consociada perfecta con Rye Grass para pastoreo directo de vacas élite."
  },
  {
    id: "leucaena_leucocephala",
    name: "Leucaena (Silvopastoreo Intensivo SSPi)",
    scientificName: "Leucaena leucocephala (Lam.) de Wit",
    family: "Fabaceae (Leguminosa arbórea / arbustiva)",
    origin: "Centroamérica y México",
    crudeProtein: { min: 22.0, max: 29.0, avg: 26.0 },
    fdn: 36.0,
    fda: 22.0,
    digestibility: 68.0,
    yieldTonMsPerHaYear: 14.0,
    optimalRestDays: 45,
    minGrazingHeightCm: 40,
    entryHeightCm: 160,
    climate: "Trópico bajo y cálido (0 - 1500 msnm)",
    precipitationMinMm: 700,
    soilReq: "Suelos bien drenados, neutros o alcalinos (intolerante a suelos con alto Aluminio Al³⁺)",
    antinutritional: "Contiene mimosina (aminoácido tóxico que puede causar caída del pelo si los rumiantes carecen de la bacteria ruminal *Synergistes jonesii*).",
    description: "Pilar de la ganadería sostenible y sistemas silvopastoriles intensivos (SSPi). Sus taninos condensados fijan la proteína para que sobrepase el rumen y reducen hasta un 25% las emisiones entéricas de metano (CH₄)."
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
    antinutritional: "Rico en oxalatos de calcio insolubles; puede provocar deficiencia de calcio en equinos. Acumula nitratos tras heladas.",
    description: "Base forrajera tradicional del trópico alto lechero. Muy resistente al pisoteo pero susceptible a heladas nocturnas y a la chinche de los pastos (*Collaria scenica*)."
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
    explanation: "Días de ocupación = (Área potrero × Biomasa neta MS/Ha) / (Número de animales × Consumo diario MS/animal). En pastoreo rotacional intensivo se recomienda subdividir este potrero en 6 franjas de 2 días para evitar el segundo bocado."
  },
  {
    id: "prob_voisin_paddocks",
    title: "Problema PRV: Dimensionamiento Matemático de Potreros (Leyes de Voisin)",
    vignette: "En una ganadería de leche en trópico alto, el Rye Grass requiere 32 días de descanso en época de lluvias para alcanzar su Punto Óptimo de Reposo (POR). El zootecnista establece un período de ocupación estricto de 1 día por potrero para maximizar la producción, manejando 2 lotes (Despunte y Repaso).",
    question: "Aplica la 1ª y 2ª Ley de Voisin: ¿Cuántos potreros totales (N) se deben delimitar en la finca?",
    formulaText: "N = (Días de Descanso / Días de Ocupación) + Número de Lotes = (32 / 1) + 2 = 34 potreros.",
    expectedNumber: 34,
    unit: "potreros",
    tolerance: 0,
    explanation: "Ecuación de Voisin: N = (D / O) + L. Con 34 potreros, cuando el lote de despunte regresa al potrero #1, este ha tenido exactamente 32 días ininterrumpidos de descanso y acúmulo de reservas en raíces."
  },
  {
    id: "prob_silage_balance",
    title: "Problema de Conservación: Reserva Estratégica de Ensilaje para Sequía",
    vignette: "Se planifica una sequía de 75 días para un hato de 30 vacas. Cada vaca requiere una ración suplementaria de 9.0 kg MS/día de ensilaje de maíz. Si el cultivo rinde 10.5 Ton MS/Ha y se estima una pérdida de fermentación del 15% en el silo...",
    question: "¿Cuántas hectáreas de maíz forrajero se deben sembrar y cosechar para cubrir exactamente la demanda?",
    formulaText: "Demanda total = 30 vacas × 9 kg MS/día × 75 días = 20,250 kg MS (20.25 Ton MS). Rendimiento neto = 10.5 Ton/Ha × 0.85 = 8.925 Ton MS/Ha. Hectáreas = 20.25 / 8.925 = 2.27 Ha.",
    expectedNumber: 2.27,
    unit: "Hectáreas",
    tolerance: 0.2,
    explanation: "Se deben cultivar 2.27 Ha de maíz forrajero de alta densidad para garantizar los 20.25 Toneladas de Materia Seca que mantendrán la producción láctea durante los 75 días de verano crítico."
  }
];

export class PastureLab {
  constructor(containerId, { storeInstance = store } = {}) {
    this.container = document.getElementById(containerId);
    this.store = storeInstance;

    // Estado del Laboratorio Agrostológico
    this.selectedSpecies = FORAGE_SPECIES_DATABASE[0];
    this.activeSubTab = "paddocks"; // "paddocks", "herbarium", "sampling", "voisin", "silage", "cases"
    
    // Potreros de la Granja Escuela (8 Potreros Rotacionales)
    this.paddocks = [
      { id: 1, name: "Potrero 1 (Loma Alta)",   areaHa: 1.5, species: "Brachiaria brizantha", heightCm: 36, restDays: 35, dryMatterKgHa: 2800, state: "ready",   fertilized: true  },
      { id: 2, name: "Potrero 2 (Bajo Húmedo)", areaHa: 1.2, species: "Brachiaria brizantha", heightCm: 14, restDays: 6,  dryMatterKgHa: 950,  state: "growing", fertilized: false },
      { id: 3, name: "Potrero 3 (Corral Sur)",  areaHa: 1.4, species: "Brachiaria brizantha", heightCm: 18, restDays: 12, dryMatterKgHa: 1350, state: "growing", fertilized: false },
      { id: 4, name: "Potrero 4 (La Quebrada)", areaHa: 1.6, species: "Brachiaria brizantha", heightCm: 24, restDays: 20, dryMatterKgHa: 1900, state: "growing", fertilized: true  },
      { id: 5, name: "Potrero 5 (El Mirador)",  areaHa: 1.3, species: "Brachiaria brizantha", heightCm: 29, restDays: 28, dryMatterKgHa: 2300, state: "growing", fertilized: false },
      { id: 6, name: "Potrero 6 (Plano Norte)", areaHa: 1.5, species: "Brachiaria brizantha", heightCm: 38, restDays: 38, dryMatterKgHa: 2950, state: "ready",   fertilized: true  },
      { id: 7, name: "Potrero 7 (Reserva Silo)",areaHa: 2.0, species: "Pennisetum purpureum", heightCm: 160,restDays: 52, dryMatterKgHa: 6800, state: "ready",   fertilized: true  },
      { id: 8, name: "Potrero 8 (Babilla)",     areaHa: 1.0, species: "Brachiaria brizantha", heightCm: 8,  restDays: 2,  dryMatterKgHa: 500,  state: "occupied",fertilized: false }
    ];

    // Muestreo de aforo virtual (5 Puntos con Cuadrante 1 m²)
    this.samplingPoints = [
      { point: "P1 (Alto)",   freshWeightG: 480, heightCm: 38 },
      { point: "P2 (Medio)",  freshWeightG: 420, heightCm: 34 },
      { point: "P3 (Bajo)",   freshWeightG: 310, heightCm: 26 },
      { point: "P4 (Sombra)", freshWeightG: 390, heightCm: 32 },
      { point: "P5 (Control)",freshWeightG: 450, heightCm: 36 }
    ];
    this.dryMatterPercent = 22.0; // % MS promedio
    this.lossPercent = 20.0; // % Pérdida por pisoteo y bosteas

    // Silo de Reserva
    this.silageTonsAvailable = 14.5; // Toneladas de ensilaje listas
    this.silageQuality = { ph: 4.0, dryMatter: 32, lacticAcid: "Óptimo (Fermentación Láctica)" };

    // Caso de estudio de pasturas activo
    this.activeStudyCase = PASTURE_EXAM_CASES[0];
    this.userCaseAnswer = "";
    this.caseValidationResult = null;

    this.init();
  }

  init() {
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
        <!-- 1. Encabezado & Navegación de Sub-Pestañas Agrostológicas -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="display font-bold text-lg text-white flex items-center gap-2">
                <span>🌱</span> Laboratorio de Agrostología, Pastos & Forrajes
              </h3>
              <span class="text-[10px] mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                Pastoreo Racional Voisin (PRV)
              </span>
            </div>
            <p class="text-xs text-[var(--muted)] mt-0.5">
              Evaluación botánica de gramíneas y leguminosas, aforo de biomasa, leyes de pastoreo y conservación de forrajes.
            </p>
          </div>

          <!-- Pestañas internas -->
          <div class="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-xl border border-[var(--border)]">
            <button class="pasture-subtab btn px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeSubTab === 'paddocks' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'}" data-subtab="paddocks">
              🗺️ Potreros en Vivo
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeSubTab === 'cases' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'}" data-subtab="cases">
              🎲 Problemas Zootécnicos
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeSubTab === 'herbarium' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'}" data-subtab="herbarium">
              🌿 Herbario Científico
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeSubTab === 'sampling' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'}" data-subtab="sampling">
              📐 Aforo & Muestreo (1m²)
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeSubTab === 'voisin' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'}" data-subtab="voisin">
              🧠 Leyes de Voisin
            </button>
            <button class="pasture-subtab btn px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeSubTab === 'silage' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'}" data-subtab="silage">
              🌾 Ensilaje & Heno
            </button>
          </div>
        </div>

        <!-- 2. Tarjetas de Métricas Forrajeras Globales -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Área Total Pastoreo</span>
            <b class="mono text-white text-base">${totalArea} Ha</b>
            <small class="text-[9px] text-emerald-400 block">${this.paddocks.length} Potreros Rotacionales</small>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Altura Media del Dosel</span>
            <b class="mono text-emerald-300 text-base">${avgHeight} cm</b>
            <small class="text-[9px] text-gray-400 block">POR Óptimo: 30 - 38 cm</small>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Reserva Forrajera Total</span>
            <b class="mono text-amber-300 text-base">${(totalBiomass / 1000).toFixed(1)} Ton MS</b>
            <small class="text-[9px] text-amber-200/80 block">${Math.round(totalBiomass / totalArea)} kg MS / Ha prom.</small>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block uppercase">Carga Instantánea</span>
            <b class="mono text-blue-300 text-base">${instantaneousStockingRate} UGM / Ha</b>
            <small class="text-[9px] text-blue-200 block">Potrero Ocupado: #${activePaddock.id}</small>
          </div>
        </div>

        <!-- 3. Contenedor Dinámico según Sub-Pestaña Activa -->
        <div id="pastureSubtabContent">
          ${this.renderSubTabContent(activePaddock)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderSubTabContent(activePaddock) {
    if (this.activeSubTab === "paddocks") {
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
   * VISTA: GENERADOR DE PROBLEMAS ZOOTÉCNICOS DE PASTURAS EN VIVO
   */
  renderProblemsGenerator() {
    const c = this.activeStudyCase;

    return `
      <div class="space-y-4 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-5 rounded-2xl border border-emerald-500/40">
        <div class="flex justify-between items-center border-b border-[var(--border)] pb-3">
          <div>
            <h4 class="display font-bold text-base text-white flex items-center gap-2">
              <span>🎲</span> Generador de Problemas de Pastoreo & Aforo en Vivo
            </h4>
            <p class="text-xs text-[var(--muted)]">Resuelve problemas reales de capacidad de carga, leyes de Voisin y conservación para tus exámenes universitarios.</p>
          </div>
          <button id="btnGeneratePastureProblem" class="btn px-4 py-2 rounded-xl border border-emerald-400/40 bg-emerald-900/60 hover:bg-emerald-800/70 text-xs font-bold text-emerald-200 flex items-center gap-1.5 shadow">
            <span>🔄</span> Generar Nuevo Problema
          </button>
        </div>

        <div class="p-4 rounded-xl bg-black/50 border border-emerald-400/30 space-y-3 text-xs">
          <div class="flex justify-between items-center">
            <b class="text-sm text-white">${c.title}</b>
            <span class="mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">ENUNCIADO DE EVALUACIÓN</span>
          </div>

          <p class="text-gray-200 text-xs leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
            ${c.vignette}
          </p>

          <div class="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 font-semibold">
            ❓ <b>Pregunta a resolver:</b> ${c.question}
          </div>

          <!-- Formulario de Respuesta del Estudiante -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <label class="text-gray-300 font-medium">Ingresa tu cálculo:</label>
            <input type="number" id="inputCaseAnswer" step="0.01" placeholder="Ej. 11.4" value="${this.userCaseAnswer}" class="p-2 w-32 rounded-xl border border-[var(--border)] bg-black/60 text-xs font-bold text-emerald-300 text-center">
            <span class="text-gray-400 font-mono">${c.unit}</span>
            <button id="btnSubmitCaseAnswer" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1">
              <span>💡</span> Comprobar Solución
            </button>
          </div>
        </div>

        <!-- Dictamen del Problema -->
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
              <p class="text-gray-300 mt-1">${c.explanation}</p>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * VISTA 1: POTREROS EN VIVO (MAPA & ACCIONES AGRONÓMICAS)
   */
  renderPaddocksLiveGrid(activePaddock) {
    return `
      <div class="space-y-4">
        <div class="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-[var(--border)]">
          <div>
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono flex items-center gap-1.5">
              <span>📍</span> Estado de Potreros en Tiempo Real (8 Lotes de Rotación)
            </h4>
            <p class="text-[11px] text-[var(--muted)]">Haz clic en cualquier potrero para inspeccionarlo, fertilizarlo o cosechar excedentes forrajeros.</p>
          </div>
          <button id="btnExecuteHerdRotation" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg flex items-center gap-1.5">
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
                  <span>${p.fertilized ? '🌱 Fertilizado' : '🍂 Sin fertilizar'}</span>
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
                  <button class="btn btn-fertilize-paddock p-1.5 rounded-lg border border-[var(--border)] bg-black/30 hover:bg-emerald-950 text-[10px] font-semibold text-emerald-300" data-paddock-id="${p.id}">
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
   * VISTA 2: HERBARIO CIENTÍFICO Y BASE DE DATOS DE FORRAJES
   */
  renderScientificHerbarium() {
    const s = this.selectedSpecies;

    return `
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-1 space-y-2 bg-black/30 p-3 rounded-2xl border border-[var(--border)] max-h-[520px] overflow-y-auto">
          <h4 class="font-bold text-xs text-white uppercase tracking-wider mono mb-2">
            🌿 Especies Forrajeras Universitarias
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
              <h3 class="display text-lg font-bold text-white mt-1">${s.name}</h3>
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
            <p class="text-gray-300 text-[11px] leading-relaxed">${s.antinutritional}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 3: SIMULADOR DE AFORO EN VIVO (MÉTODO DEL CUADRANTE 1 m²)
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
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono">
              📐 5 Puntos de Aforo (Cuadro 1 m²)
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
            <span>🎲</span> Simular Nuevo Muestreo de Campo
          </button>
        </div>

        <div class="lg:col-span-2 space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
          <h4 class="font-bold text-sm text-white uppercase tracking-wider mono flex items-center gap-1.5">
            <span>📊</span> Resultados del Aforo & Balance Forrajero
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
              <span class="text-[9px] text-[var(--muted)] block">DISPONIBILIDAD REAL NETA</span>
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
              <input type="range" id="rngMsPercent" min="15" max="35" step="0.5" value="${this.dryMatterPercent}" style="accent-color:#f59e0b; width:100%;">
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Factor de Pérdida por Pisoteo y Bosteas (%):</span>
                <b class="mono text-blue-300" id="lblLossPercent">${this.lossPercent}%</b>
              </div>
              <input type="range" id="rngLossPercent" min="10" max="40" step="1" value="${this.lossPercent}" style="accent-color:#38bdf8; width:100%;">
            </div>
          </div>

          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs">
            <b class="text-emerald-300 uppercase tracking-wider block mono text-[11px]">
              🎯 Capacidad de Carga del Potrero (1.5 Ha)
            </b>
            <p class="text-gray-200">
              Con <b>${availableDryMatterKgHa} kg MS/Ha</b> netos, un potrero de 1.5 Ha ofrece <b>${Math.round(availableDryMatterKgHa * 1.5)} kg MS disponibles</b>.
              El hato de la Granja consume <b>${(2.35 * 13.5).toFixed(1)} kg MS/día</b>.
            </p>
            <div class="flex justify-between items-center pt-1 border-t border-emerald-500/30 text-[11px]">
              <span>Días de pastoreo que soporta este lote sin degradarse:</span>
              <b class="mono text-emerald-300 text-sm">${(Math.round(availableDryMatterKgHa * 1.5) / (2.35 * 13.5)).toFixed(1)} Días</b>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 4: LEYES DEL PASTOREO RACIONAL VOISIN (PRV)
   */
  renderVoisinLaws() {
    return `
      <div class="space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
        <div class="border-b border-[var(--border)] pb-3">
          <h4 class="display font-bold text-base text-white flex items-center gap-2">
            <span>🧠</span> Las 4 Leyes Universales del Pastoreo Racional Voisin (André Voisin)
          </h4>
          <p class="text-xs text-[var(--muted)]">Fundamentos bio-fisiológicos para maximizar la cosecha de forraje y triplicar la fertilidad del suelo sin químicos.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3 text-xs">
          <div class="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">1</span>
              <b class="text-emerald-300 font-bold text-xs">1ª Ley: Ley del Reposo</b>
            </div>
            <p class="text-gray-300 leading-relaxed">
              Para que un pasto dé su máximo rendimiento, debe transcurrir entre dos cortes o pastoreos sucesivos un tiempo suficiente que le permita acumular reservas hidrocarbonadas en sus raíces y coronas (<b>Punto Óptimo de Reposo - POR</b>).
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-blue-500/30 space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">2</span>
              <b class="text-blue-300 font-bold text-xs">2ª Ley: Ley de la Ocupación</b>
            </div>
            <p class="text-gray-300 leading-relaxed">
              El tiempo global de ocupación de un potrero debe ser lo suficientemente corto (máximo 1 a 3 días) para que una brizna de hierba cortada en el primer día no vuelva a ser comida por el animal antes de salir del potrero (<b>Evitar el segundo bocado</b>).
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">3</span>
              <b class="text-amber-300 font-bold text-xs">3ª Ley: Rendimientos Máximos</b>
            </div>
            <p class="text-gray-300 leading-relaxed">
              Es necesario ayudar a los animales con mayores exigencias nutricionales (vacas de alta producción o animales en ceba) para que puedan cosechar la mayor cantidad de hierba de mejor calidad (<b>Lote de despunte vs Lote de repaso</b>).
            </p>
          </div>

          <div class="p-4 rounded-xl bg-black/40 border border-purple-500/30 space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">4</span>
              <b class="text-purple-300 font-bold text-xs">4ª Ley: Rendimiento Regular</b>
            </div>
            <p class="text-gray-300 leading-relaxed">
              Para que una vaca produzca un rendimiento lácteo regular y constante, no debe permanecer más de 3 días en un mismo potrero; los rendimientos máximos se obtienen cuando la vaca solo permanece <b>un solo día por potrero</b>.
            </p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
          <b class="text-white uppercase tracking-wider mono block text-[11px]">📐 Ecuación Matemática de Voisin:</b>
          <div class="mono text-emerald-300 p-2.5 rounded-lg bg-black/60 border border-white/5 text-center text-sm font-bold">
            Número de Potreros (N) = [ Días de Descanso (35) / Días de Ocupación (1) ] + Número de Grupos (1) = 36 Potreros
          </div>
        </div>
      </div>
    `;
  }

  /**
   * VISTA 5: CONSERVACIÓN DE FORRAJES (ENSILAJE & HENIFICACIÓN)
   */
  renderSilageModule() {
    return `
      <div class="space-y-4 bg-black/30 p-5 rounded-2xl border border-[var(--border)]">
        <div class="flex justify-between items-center border-b border-[var(--border)] pb-3">
          <div>
            <h4 class="display font-bold text-base text-white flex items-center gap-2">
              <span>🌾</span> Módulo de Conservación Forrajera (Ensilaje & Henificación)
            </h4>
            <p class="text-xs text-[var(--muted)]">Reserva estratégica de biomasa para mitigar déficits en épocas de sequía o heladas.</p>
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
          <h5 class="font-bold text-white uppercase tracking-wider mono text-[11px]">Proceso Bioquímico de Ensilabilidad:</h5>
          <ol class="list-decimal list-inside space-y-1.5 text-gray-300">
            <li><b>Fase Aerobia (0-24h):</b> Consumo de oxígeno remanente por respiración vegetal. Compactación clave.</li>
            <li><b>Fase Anaerobia & Fermentativa (1-21 días):</b> Proliferación de bacterias ácido-lácticas (*Lactobacillus plantarum*), descenso del pH a < 4.2 para inhibir bacterias clostrídicas y mohos.</li>
            <li><b>Fase de Estabilidad:</b> Conservación anaeróbica indefinida hasta su apertura y suministro en comedero.</li>
          </ol>
        </div>

        <div class="flex justify-between items-center pt-2">
          <span class="text-xs text-[var(--muted)]">Capacidad para alimentar al hato durante 45 días de sequía crítica.</span>
          <button id="btnProduceMoreSilage" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-emerald-600 text-white flex items-center gap-1.5 shadow">
            <span>🚜</span> Cosechar Potrero #7 para Nuevo Silo (+5 Ton)
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    document.querySelectorAll(".pasture-subtab").forEach(tab => {
      tab.onclick = () => {
        this.activeSubTab = tab.dataset.subtab;
        AudioFx.click();
        this.render();
      };
    });

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

        this.caseValidationResult = {
          passed,
          diff
        };

        if (passed) {
          AudioFx.success();
          this.store.emit("toast:show", { msg: `🎉 <b>¡Excelente!</b> Respuesta zootécnica correcta: ${c.expectedNumber} ${c.unit}.` });
        } else {
          AudioFx.error();
        }

        this.render();
      };
    }

    const btnRot = document.getElementById("btnExecuteHerdRotation");
    if (btnRot) {
      btnRot.onclick = () => this.rotateHerdToOptimal();
    }

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

    document.querySelectorAll(".btn-fertilize-paddock").forEach(btn => {
      btn.onclick = () => {
        const pid = parseInt(btn.dataset.paddockId, 10);
        const p = this.paddocks.find(item => item.id === pid);
        if (p) {
          p.fertilized = true;
          p.dryMatterKgHa = Math.min(3500, p.dryMatterKgHa + 450);
          p.heightCm = Math.min(60, p.heightCm + 5);
          AudioFx.success();
          this.store.emit("toast:show", { msg: `🧪 <b>Fertilización:</b> Aplicado abono orgánico y nitrógeno en ${p.name}. (+450 kg MS/Ha).` });
          this.render();
        }
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
          this.store.emit("toast:show", { msg: `🚜 <b>Cosecha de Silo:</b> Obtenidas +${harvestedTons.toFixed(1)} Toneladas de forraje para ensilaje desde ${p.name}.` });
          this.render();
        }
      };
    });

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
