/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: ParasiteAtlas.js — Atlas Parasitológico & Microscopio Virtual
 *
 * Simulación de cámara McMaster, identificación microscópica con escala FAMACHA,
 * morfometría de huevos/ooquistes y cálculo cuantitativo de carga parasitaria (HPG).
 */

import { achievements } from "../core/Achievements.js";

// ─── Base de Datos de Parásitos Veterinarios ───────────────────────────
export const PARASITES_DATABASE = [
  {
    id: "haemonchus_contortus",
    commonName: "Gusano Barbero / Haemonchus",
    scientificName: "Haemonchus contortus",
    group: "Nematodo gastrointestinal (Trichostrongylidae)",
    hosts: ["Ovinos", "Caprinos", "Bovinos"],
    organ: "Abomaso (hematófago estricto)",
    eggDimensions: "70-85 µm × 40-50 µm",
    eggShape: "Elíptico, cáscara fina y lisa, blastómeros numerosos (16-32 células)",
    pathogenesis: "Hematofagia severa (hasta 0.05 mL sangre/parásito/día), hipoproteinemia, edema submandibular (quijada de botella), anemia severa, muerte súbita.",
    famachaRisk: "Grados 4 y 5 (Mucosas pálidas / blancas)",
    treatment: "Levamisol, Ivermectina/Moxidectina, Closantel, Albendazol (verificar resistencia).",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-full h-full"><ellipse cx="50" cy="50" rx="35" ry="22" fill="#2d3748" stroke="#48bb78" stroke-width="3"/><circle cx="42" cy="46" r="6" fill="#68d391"/><circle cx="58" cy="46" r="6" fill="#68d391"/><circle cx="46" cy="56" r="5" fill="#68d391"/><circle cx="56" cy="56" r="5" fill="#68d391"/><circle cx="36" cy="50" r="5" fill="#48bb78"/><circle cx="64" cy="50" r="5" fill="#48bb78"/></svg>`
  },
  {
    id: "fasciola_hepatica",
    commonName: "Duela del Hígado / Fasciola",
    scientificName: "Fasciola hepatica",
    group: "Trematodo digéneo (Fasciolidae)",
    hosts: ["Bovinos", "Ovinos", "Equinos", "Humanos (Zoonosis)"],
    organ: "Canalículos biliares y parénquima hepático",
    eggDimensions: "130-150 µm × 60-90 µm (Grande)",
    eggShape: "Operculado en un polo, color amarillento-dorado, no segmentado al salir en heces",
    pathogenesis: "Migración de formas juveniles → hepatitis traumática aguda; adultos en ductos biliares → colangitis crónica hiperplásica, fibrosis hepática y calcificación en 'pipas de tabaco'.",
    famachaRisk: "Grados 3 a 5 en ovinos",
    treatment: "Triclabendazol (único eficaz contra inmaduros tempranos), Closantel, Nitroxinil.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-full h-full"><ellipse cx="50" cy="50" rx="42" ry="26" fill="#5b4816" stroke="#ecc94b" stroke-width="3"/><path d="M 88,50 Q 92,46 94,50 Q 92,54 88,50" fill="#ecc94b"/><ellipse cx="50" cy="50" rx="32" ry="18" fill="#744210" opacity="0.6"/></svg>`
  },
  {
    id: "eimeria_spp",
    commonName: "Coccidio / Ooquiste de Eimeria",
    scientificName: "Eimeria bovis / E. zuernii / E. ovinoidalis",
    group: "Protozoo Apicomplexa (Coccidia)",
    hosts: ["Bovinos", "Ovinos", "Aves", "Porcinos"],
    organ: "Enterocitos del intestino delgado e íleon / ciego",
    eggDimensions: "25-35 µm × 18-24 µm (Pequeño)",
    eggShape: "Ovoide o elíptico, doble pared refringente gruesa, micrópilo visible en E. bovis",
    pathogenesis: "Destrucción masiva de células epiteliales durante la esquizogonia y gametogonia → diarrea fétida sanguinolenta, tenesmo, deshidratación, retraso en crecimiento.",
    famachaRisk: "Variable, asociado a deshidratación severa",
    treatment: "Toltrazuril 5% (15 mg/kg PO dosis única), Sulfadimidina, Diclazuril.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-full h-full"><ellipse cx="50" cy="50" rx="28" ry="36" fill="#1a202c" stroke="#ed8936" stroke-width="4"/><circle cx="50" cy="50" r="14" fill="#dd6b20"/><ellipse cx="50" cy="18" rx="4" ry="2" fill="#ed8936"/></svg>`
  },
  {
    id: "cooperia_punctata",
    commonName: "Cooperia",
    scientificName: "Cooperia punctata / C. pectinata",
    group: "Nematodo gastrointestinal (Trichostrongylidae)",
    hosts: ["Bovinos (especialmente terneros de destete)"],
    organ: "Intestino delgado (primeros 5 metros)",
    eggDimensions: "70-85 µm × 30-38 µm",
    eggShape: "Paredes laterales casi paralelas, extremos redondeados, blastómeros en mórula",
    pathogenesis: "Atrofia de vellosidades intestinales, malabsorción de nutrientes, diarrea profusa acuosa, pérdida de peso y retardo severo de ganancia diaria.",
    famachaRisk: "Grados 2 a 3",
    treatment: "Levamisol, Benzimidazoles (resistencia extendida a lactonas macrocíclicas).",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-full h-full"><ellipse cx="50" cy="50" rx="38" ry="18" fill="#2d3748" stroke="#4299e1" stroke-width="3"/><circle cx="40" cy="50" r="7" fill="#63b3ed"/><circle cx="54" cy="50" r="7" fill="#63b3ed"/><circle cx="47" cy="44" r="5" fill="#63b3ed"/><circle cx="47" cy="56" r="5" fill="#63b3ed"/></svg>`
  },
  {
    id: "moniezia_expansa",
    commonName: "Tenis del Rumiante / Moniezia",
    scientificName: "Moniezia expansa / M. benedeni",
    group: "Cestodo Anoplocephalidae",
    hosts: ["Ovinos", "Caprinos", "Bovinos"],
    organ: "Intestino delgado",
    eggDimensions: "50-60 µm × 50-60 µm",
    eggShape: "Triangular (M. expansa) o cuadrangular (M. benedeni), con aparato piriforme y oncósfera con 6 ganchos",
    pathogenesis: "Competencia por nutrientes, obstrucción mecánica intestinal en altas cargas en corderos y terneros jóvenes, distensión abdominal.",
    famachaRisk: "Generalmente no afecta directamente la mucosa ocular",
    treatment: "Praziquantel, Albendazol a dosis doble (10 mg/kg), Fenbendazol.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="50,15 85,80 15,80" fill="#2d3748" stroke="#9f7aea" stroke-width="4"/><circle cx="50" cy="55" r="12" fill="#b794f4"/><circle cx="50" cy="55" r="5" fill="#805ad5"/></svg>`
  },
  {
    id: "toxocara_canis_vitulorum",
    commonName: "Ascaris / Toxocara",
    scientificName: "Toxocara vitulorum (bovinos) / T. canis",
    group: "Ascarididae",
    hosts: ["Bovinos jóvenes", "Caninos"],
    organ: "Intestino delgado (migración hepato-traqueal)",
    eggDimensions: "75-85 µm × 65-75 µm",
    eggShape: "Esférico a subgloboso, cáscara gruesa con superficie finamente reticulada u hoyuelos",
    pathogenesis: "Transmisión transmamaria. Causa cólico, diarrea blanca-grisácea con olor fétido ('olor a manteca'), distensión abdominal, posible perforación intestinal.",
    famachaRisk: "Grados 2 a 3",
    treatment: "Piperazina, Fenbendazol, Levamisol, Ivermectina.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="34" fill="#2d3748" stroke="#f56565" stroke-width="6" stroke-dasharray="4,2"/><circle cx="50" cy="50" r="22" fill="#e53e3e"/></svg>`
  }
];

// ─── Escala FAMACHA ───────────────────────────────────────────────────
export const FAMACHA_SCALE = [
  { grade: 1, label: "Óptimo (Rojo Brillante)", colorHex: "#dc2626", hctRange: "> 28%", action: "No desparasitar. Animal resistente.", eyeImage: "🔴" },
  { grade: 2, label: "Aceptable (Rosado Fuerte)", colorHex: "#f87171", hctRange: "23 - 27%", action: "No desparasitar en condiciones normales.", eyeImage: "🌸" },
  { grade: 3, label: "Peligro / Sospechoso (Rosado Pálido)", colorHex: "#fbcfe8", hctRange: "18 - 22%", action: "Evaluar rebaño. Desparasitar si es cordero, gestante o alto HPG.", eyeImage: "🩰" },
  { grade: 4, label: "Anémico (Blanco Rosáceo)", colorHex: "#fdf2f8", hctRange: "13 - 17%", action: "DESPARASITAR URGENTE. Animal en riesgo clínico alto.", eyeImage: "⚪" },
  { grade: 5, label: "Grave / Severo (Blanco Porcelana)", colorHex: "#ffffff", hctRange: "< 12%", action: "EMERGENCIA MÉDICA. Desparasitar + Terapia de soporte / transfusión.", eyeImage: "💀" }
];

export class ParasiteAtlas {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTab = "microscope"; // "microscope" | "famacha" | "mcmaster_calc" | "atlas"
    this.selectedParasiteId = PARASITES_DATABASE[0].id;
    this.activeQuizParasite = null;
    this.microscopeMagnification = "40x";
    this.quizScore = { correct: 0, total: 0 };
    this.init();
  }

  init() {
    this.pickNewRandomQuiz();
    this.render();
  }

  pickNewRandomQuiz() {
    const randomIndex = Math.floor(Math.random() * PARASITES_DATABASE.length);
    this.activeQuizParasite = PARASITES_DATABASE[randomIndex];
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Encabezado con Tabs -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-2xl shadow-inner">
              🦠
            </div>
            <div>
              <h2 class="display text-xl sm:text-2xl font-bold text-white m-0">Atlas Parasitológico & Microscopio McMaster</h2>
              <p class="text-xs text-[var(--muted)] m-0">Identificación morfométrica, conteo cuantitativo HPG y escala FAMACHA©.</p>
            </div>
          </div>

          <!-- Pestañas -->
          <div class="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-2xl border border-[var(--border)]">
            <button class="tab-btn btn px-3.5 py-1.5 rounded-xl text-xs font-semibold ${this.activeTab === 'microscope' ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'}" data-tab="microscope">
              🔬 Microscopio Virtual
            </button>
            <button class="tab-btn btn px-3.5 py-1.5 rounded-xl text-xs font-semibold ${this.activeTab === 'famacha' ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'}" data-tab="famacha">
              👁️ Escala FAMACHA
            </button>
            <button class="tab-btn btn px-3.5 py-1.5 rounded-xl text-xs font-semibold ${this.activeTab === 'mcmaster_calc' ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'}" data-tab="mcmaster_calc">
              📐 Cámara McMaster (HPG)
            </button>
            <button class="tab-btn btn px-3.5 py-1.5 rounded-xl text-xs font-semibold ${this.activeTab === 'atlas' ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'}" data-tab="atlas">
              📚 Catálogo Morfológico
            </button>
          </div>
        </div>

        <!-- Contenido Dinámico de la Pestaña -->
        <div id="parasiteTabContent"></div>
      </div>
    `;

    this.bindTabEvents();
    this.renderActiveTabContent();
  }

  bindTabEvents() {
    this.container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.render();
      };
    });
  }

  renderActiveTabContent() {
    const target = this.container.querySelector("#parasiteTabContent");
    if (!target) return;

    if (this.activeTab === "microscope") {
      this.renderMicroscopeTab(target);
    } else if (this.activeTab === "famacha") {
      this.renderFamachaTab(target);
    } else if (this.activeTab === "mcmaster_calc") {
      this.renderMcMasterTab(target);
    } else {
      this.renderAtlasTab(target);
    }
  }

  // 1. Microscopio Virtual de Identificación
  renderMicroscopeTab(target) {
    const p = this.activeQuizParasite;

    target.innerHTML = `
      <div class="grid lg:grid-cols-12 gap-6">
        <!-- Campo Visual del Microscopio (Óptica circular) -->
        <div class="lg:col-span-6 flex flex-col items-center justify-center p-6 glass rounded-3xl border border-teal-500/30 bg-black/60 relative overflow-hidden">
          <div class="text-xs mono text-teal-400 mb-3 flex items-center justify-between w-full px-4">
            <span>OCULAR 10X · OBJETIVO ${this.microscopeMagnification}</span>
            <span class="bg-teal-950/70 border border-teal-500/40 px-2 py-0.5 rounded text-[10px]">Luz LED: 5500K</span>
          </div>

          <!-- Lente circular con retícula McMaster -->
          <div class="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-gray-900 bg-[#07161b] shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-teal-500/30">
            <!-- Grilla / Retícula McMaster -->
            <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none border border-teal-400">
              ${Array(36).fill(0).map(() => `<div class="border border-teal-500/40"></div>`).join("")}
            </div>

            <!-- SVG del Huevo/Ooquiste -->
            <div class="w-36 h-36 sm:w-44 sm:h-44 transform hover:scale-105 transition duration-500 flex items-center justify-center">
              ${p.svgIcon}
            </div>

            <!-- Escala micrométrica -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 px-2.5 py-0.5 rounded text-[9px] mono text-teal-300 border border-teal-500/30">
              📏 ${p.eggDimensions}
            </div>
          </div>

          <!-- Controles de aumento óptico -->
          <div class="flex items-center gap-2 mt-5">
            <button class="btn-mag btn px-3 py-1 text-xs rounded-lg border ${this.microscopeMagnification === '10x' ? 'bg-teal-900 text-teal-200 border-teal-400' : 'bg-black/40 text-gray-400 border-white/5'}" data-mag="10x">10x (Panorámico)</button>
            <button class="btn-mag btn px-3 py-1 text-xs rounded-lg border ${this.microscopeMagnification === '40x' ? 'bg-teal-900 text-teal-200 border-teal-400' : 'bg-black/40 text-gray-400 border-white/5'}" data-mag="40x">40x (Morfometría)</button>
            <button class="btn-mag btn px-3 py-1 text-xs rounded-lg border ${this.microscopeMagnification === '100x' ? 'bg-teal-900 text-teal-200 border-teal-400' : 'bg-black/40 text-gray-400 border-white/5'}" data-mag="100x">100x (Inmersión)</button>
          </div>
        </div>

        <!-- Panel de Diagnóstico & Quiz de Identificación -->
        <div class="lg:col-span-6 space-y-4">
          <div class="glass p-5 rounded-2xl border border-[var(--border)] space-y-3">
            <div class="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 class="display text-base font-bold text-white m-0">Desafío de Identificación Parasitaria</h3>
              <span class="mono text-xs text-amber-300 font-bold">Aciertos: ${this.quizScore.correct} / ${this.quizScore.total}</span>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed m-0">
              Observa las características de la cáscara, dimensiones (<b>${p.eggDimensions}</b>) y contenido del espécimen bajo el microscopio. ¿A qué género/especie corresponde?
            </p>

            <!-- Opciones del quiz -->
            <div class="space-y-2 pt-2" id="parasiteQuizOptions">
              ${PARASITES_DATABASE.map(item => `
                <button class="btn-pick-parasite btn w-full p-3 rounded-xl border border-[var(--border)] bg-black/40 hover:bg-white/5 text-left text-xs flex justify-between items-center transition" data-id="${item.id}">
                  <span class="font-semibold text-gray-200">${item.scientificName} (${item.commonName})</span>
                  <span class="text-[10px] text-[var(--muted)] mono">${item.hosts.join(", ")}</span>
                </button>
              `).join("")}
            </div>

            <!-- Feedback Box -->
            <div id="parasiteQuizFeedback" class="hidden p-4 rounded-xl text-xs space-y-2 mt-3"></div>

            <div class="flex justify-end pt-2">
              <button id="btnNextParasiteSample" class="btn px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center gap-1.5">
                <span>🔄</span> Siguiente Muestra al Azar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Eventos de aumento
    target.querySelectorAll(".btn-mag").forEach(btn => {
      btn.onclick = () => {
        this.microscopeMagnification = btn.dataset.mag;
        this.renderMicroscopeTab(target);
      };
    });

    // Evento de selección de parásito
    target.querySelectorAll(".btn-pick-parasite").forEach(btn => {
      btn.onclick = () => {
        const pickedId = btn.dataset.id;
        const feedback = target.querySelector("#parasiteQuizFeedback");
        if (!feedback) return;

        this.quizScore.total++;
        feedback.classList.remove("hidden", "bg-emerald-950/80", "border-emerald-500/40", "bg-red-950/80", "border-red-500/40");

        if (pickedId === p.id) {
          this.quizScore.correct++;
          achievements.recordParasiteIdentified(p.scientificName);
          feedback.classList.add("bg-emerald-950/80", "border", "border-emerald-500/40", "text-emerald-200");
          feedback.innerHTML = `
            <div class="font-bold flex items-center gap-1.5 text-sm">
              <span>✅</span> ¡Diagnóstico Correcto! (${p.scientificName})
            </div>
            <p class="text-xs text-gray-200 m-0">${p.pathogenesis}</p>
            <div class="text-[11px] mono text-emerald-300"><b>Tratamiento electivo:</b> ${p.treatment}</div>
          `;
        } else {
          feedback.classList.add("bg-red-950/80", "border", "border-red-500/40", "text-red-200");
          feedback.innerHTML = `
            <div class="font-bold flex items-center gap-1.5 text-sm">
              <span>❌</span> Incorrecto. Era <i>${p.scientificName}</i>
            </div>
            <p class="text-xs text-gray-300 m-0"><b>Pistas morfométricas:</b> ${p.eggShape}. Dimensiones: ${p.eggDimensions}.</p>
          `;
        }
      };
    });

    const btnNext = target.querySelector("#btnNextParasiteSample");
    if (btnNext) {
      btnNext.onclick = () => {
        this.pickNewRandomQuiz();
        this.renderMicroscopeTab(target);
      };
    }
  }

  // 2. Escala FAMACHA interactiva
  renderFamachaTab(target) {
    target.innerHTML = `
      <div class="space-y-6">
        <div class="glass p-5 rounded-2xl border border-[var(--border)] space-y-2">
          <h3 class="display text-base font-bold text-white m-0">Sistema de Evaluación Clínica FAMACHA©</h3>
          <p class="text-xs text-gray-300 leading-relaxed m-0">
            Método semiológico visual para evaluar el grado de anemia causado por <i>Haemonchus contortus</i> mediante la inspección de la mucosa conjuntival ocular en pequeños rumiantes.
          </p>
        </div>

        <div class="grid sm:grid-cols-5 gap-3">
          ${FAMACHA_SCALE.map(f => `
            <div class="glass p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 hover:border-teal-500/50 transition">
              <div class="text-center space-y-2">
                <span class="text-3xl">${f.eyeImage}</span>
                <div class="w-full h-8 rounded-lg border border-black/40" style="background-color: ${f.colorHex};"></div>
                <b class="text-xs text-white block">Grado ${f.grade}</b>
                <span class="text-[11px] text-gray-300 leading-tight block">${f.label}</span>
              </div>

              <div class="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1 text-[10px] mono">
                <div><b>Hematocrito:</b> <span class="text-teal-300">${f.hctRange}</span></div>
                <div class="text-gray-300 leading-tight"><b>Conducta:</b> ${f.action}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // 3. Calculadora de Cámara McMaster
  renderMcMasterTab(target) {
    target.innerHTML = `
      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-6 glass p-6 rounded-2xl border border-[var(--border)] space-y-4">
          <h3 class="display text-base font-bold text-white m-0">Protocolo de Conteo Cuantitativo McMaster</h3>
          <p class="text-xs text-gray-300 leading-relaxed m-0">
            Técnica coprológica para cuantificar Huevos Por Gramo de heces (HPG). Dilución estandarizada: 4g de heces en 56 mL de solución sobresaturada (NaCl o Sulfato de Zinc, d=1.20).
          </p>

          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-gray-300 block mb-1">Huevos contados en Cámara 1:</label>
              <input type="number" id="mcmasterChamber1" value="12" min="0" max="500" class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white mono font-bold">
            </div>

            <div>
              <label class="font-bold text-gray-300 block mb-1">Huevos contados en Cámara 2:</label>
              <input type="number" id="mcmasterChamber2" value="14" min="0" max="500" class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white mono font-bold">
            </div>

            <div>
              <label class="font-bold text-gray-300 block mb-1">Especie animal evaluada:</label>
              <select id="mcmasterSpecies" class="w-full bg-black/50 border border-[var(--border)] rounded-xl p-2.5 text-white mono">
                <option value="ovino">Ovino / Caprino (Grave > 1000 HPG)</option>
                <option value="bovino">Bovino (Grave > 500 HPG)</option>
                <option value="equino">Equino (Grave > 500 HPG)</option>
              </select>
            </div>

            <button id="btnComputeMcMaster" class="btn w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs shadow-lg">
              📊 Calcular Carga Parasitaria (HPG)
            </button>
          </div>
        </div>

        <div class="lg:col-span-6 glass p-6 rounded-2xl border border-teal-500/30 bg-black/40 flex flex-col justify-between space-y-4" id="mcmasterResultCard">
          <div>
            <span class="mono text-[10px] text-teal-400 uppercase tracking-wider block">RESULTADO COPROLÓGICO</span>
            <div class="display text-4xl font-extrabold text-white mt-1" id="mcmasterHPGDisplay">1,300 HPG</div>
            <span class="text-xs text-gray-300" id="mcmasterFormulaDisplay">(12 + 14) × 50 = 1,300 Huevos / g heces</span>
          </div>

          <div class="p-4 rounded-xl bg-black/60 border border-teal-500/40 space-y-2 text-xs" id="mcmasterVerdictBox">
            <div class="font-bold text-rose-300 flex items-center gap-1.5">
              <span>⚠️</span> Carga Parasitaria Severa / Alta
            </div>
            <p class="text-gray-300 leading-relaxed m-0">
              Supera ampliamente el umbral de tratamiento táctico. Riesgo inminente de gastroenteritis parasitaria clínica y pérdidas productivas.
            </p>
          </div>
        </div>
      </div>
    `;

    const btn = target.querySelector("#btnComputeMcMaster");
    if (btn) {
      btn.onclick = () => {
        const c1 = parseInt(target.querySelector("#mcmasterChamber1").value) || 0;
        const c2 = parseInt(target.querySelector("#mcmasterChamber2").value) || 0;
        const sp = target.querySelector("#mcmasterSpecies").value;

        // Fórmula McMaster estándar con factor 50
        const hpg = (c1 + c2) * 50;

        target.querySelector("#mcmasterHPGDisplay").textContent = `${hpg.toLocaleString()} HPG`;
        target.querySelector("#mcmasterFormulaDisplay").textContent = `(${c1} + ${c2}) × 50 = ${hpg.toLocaleString()} Huevos / g heces`;

        const vBox = target.querySelector("#mcmasterVerdictBox");
        achievements.recordMcMaster();

        if (hpg < 200) {
          vBox.innerHTML = `<div class="font-bold text-emerald-300">✅ Carga Leve / Subclínica (< 200 HPG)</div><p class="text-gray-300 m-0">No requiere desparasitación táctica inmediata en animales adultos inmunocompetentes.</p>`;
        } else if (hpg <= (sp === "ovino" ? 1000 : 500)) {
          vBox.innerHTML = `<div class="font-bold text-amber-300">⚠️ Carga Moderada (200 - ${sp === "ovino" ? '1000' : '500'} HPG)</div><p class="text-gray-300 m-0">Monitorear animales vulnerables, terneros, corderos y hembras en periparto.</p>`;
        } else {
          vBox.innerHTML = `<div class="font-bold text-rose-300">🚨 Carga Severa / Alta (> ${sp === "ovino" ? '1000' : '500'} HPG)</div><p class="text-gray-300 m-0">DESPARASITACIÓN ESTRATÉGICA INMEDIATA requerida. Evaluar eficacia con Test de Reducción de HPG (FECRT).</p>`;
        }
      };
    }
  }

  // 4. Catálogo Morfológico Completo
  renderAtlasTab(target) {
    target.innerHTML = `
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${PARASITES_DATABASE.map(p => `
          <div class="glass p-5 rounded-2xl border border-[var(--border)] space-y-3 hover:border-teal-500/40 transition">
            <div class="flex items-center gap-3 border-b border-white/10 pb-3">
              <div class="w-12 h-12 rounded-xl bg-black/60 p-1 border border-teal-500/30 flex items-center justify-center">
                ${p.svgIcon}
              </div>
              <div>
                <b class="text-sm text-white block">${p.scientificName}</b>
                <span class="text-xs text-teal-300 mono">${p.commonName}</span>
              </div>
            </div>

            <div class="space-y-1.5 text-xs text-gray-300">
              <div><b>Órgano:</b> <span class="text-gray-200">${p.organ}</span></div>
              <div><b>Dimensiones:</b> <span class="mono text-teal-300">${p.eggDimensions}</span></div>
              <div><b>Forma:</b> <span class="text-gray-400 leading-tight block mt-0.5">${p.eggShape}</span></div>
              <div><b>Huéspedes:</b> <span class="text-gray-200">${p.hosts.join(", ")}</span></div>
            </div>

            <div class="pt-2 border-t border-white/5 text-[11px] text-gray-400">
              <b>Tratamiento:</b> ${p.treatment}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }
}
