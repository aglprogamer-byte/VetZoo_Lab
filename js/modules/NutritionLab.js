/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: NutritionLab.js - Laboratorio de Formulación Bromatológica y Generador de Casos en Vivo
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";

export const NUTRITION_EXAM_CASES = [
  {
    id: "case_sara_prevention",
    title: "Caso Nutricional: Prevención de Acidosis Ruminal (SARA) en Vaca Lechera",
    species: "vaca",
    targetAnimalId: "cow_017",
    vignette: "El hato lechero presenta caída del 20% en producción y pH ruminal de 5.4. Se sospecha Acidosis Ruminal Subaguda (SARA) por exceso de carbohidratos fermentables y falta de fibra efectiva.",
    goalText: "Formula una ración TMR con FDN > 28% y Maíz molido < 35% para restablecer el pH ruminal sin sacrificar más de 16% de Proteína Cruda.",
    criteria: {
      minFiber: 28.0,
      maxMaiz: 35,
      minProtein: 15.5
    }
  },
  {
    id: "case_high_yield_cow",
    title: "Caso Nutricional: Pico de Lactancia (30 L/día) en Vaca Holstein",
    species: "vaca",
    targetAnimalId: "cow_017",
    vignette: "Vaca élite 'Margarita' (525 kg) se encuentra en el día 45 posparto y requiere alta densidad energética y proteica para sostener 30 L de leche al día sin perder condición corporal.",
    goalText: "Formula una ración con Energía > 2.80 Mcal/kg, Proteína Cruda entre 16.5% y 18.5%, y FDN mínima de 24% para mantener la grasa láctea.",
    criteria: {
      minEnergy: 2.80,
      minProtein: 16.5,
      maxProtein: 19.5,
      minFiber: 24.0
    }
  },
  {
    id: "case_sport_horse",
    title: "Caso Nutricional: Dieta para Equino de Deporte en Entrenamiento",
    species: "caballo",
    targetAnimalId: "horse_004",
    vignette: "Equino 'Relámpago' (460 kg) realiza rutinas diarias de salto y adiestramiento. El exceso de granos concentrados puede causarle cólicos e infosura.",
    goalText: "Formula una dieta equina basada en forraje de alta calidad con Heno > 60%, Maíz molido < 20% y Proteína Cruda entre 11.5% y 14.0%.",
    criteria: {
      minHeno: 60,
      maxMaiz: 20,
      minProtein: 11.5,
      maxProtein: 15.0
    }
  },
  {
    id: "case_growing_pig",
    title: "Caso Nutricional: Cerdos de Crecimiento (FCR Óptimo)",
    species: "cerdo",
    targetAnimalId: "pig_088",
    vignette: "Lote de cerdos de 36.5 kg en transición de crecimiento a ceba. Se busca maximizar la ganancia diaria de peso (GDP > 800 g/día) con bajo costo por kg.",
    goalText: "Formula una ración monogástrica concentrada con Proteína Cruda > 17.5%, Fibra (FDN) < 8.0% y Energía > 3.30 Mcal/kg.",
    criteria: {
      minProtein: 17.5,
      maxFiber: 8.0,
      minEnergy: 3.30
    }
  },
  {
    id: "case_twin_pregnancy_sheep",
    title: "Caso Nutricional: Oveja en Gestación Avanzada (Gestación Doble)",
    species: "oveja",
    targetAnimalId: "sheep_031",
    vignette: "Oveja Hampshire en el último tercio de gestación con mellizos. El útero grávido comprime el rumen, reduciendo la capacidad volumétrica de consumo.",
    goalText: "Formula una ración densa y palatable con Proteína Cruda > 14.0%, Energía > 2.65 Mcal/kg y FDN entre 26% y 38%.",
    criteria: {
      minProtein: 14.0,
      minEnergy: 2.65,
      minFiber: 26.0,
      maxFiber: 40.0
    }
  }
];

export class NutritionLab {
  constructor(containerId, { storeInstance = store, simEngineInstance = simEngine } = {}) {
    this.container = document.getElementById(containerId);
    this.store = storeInstance;
    this.simEngine = simEngineInstance;
    this.ingredients = [
      { id: "maiz",     name: "Maíz molido",       type: "Energético",  color: "#f59e0b" },
      { id: "soya",     name: "Harina de Soya 48%",type: "Proteico",    color: "#3b82f6" },
      { id: "ensilaje", name: "Ensilaje de Maíz",  type: "Forraje",     color: "#10b981" },
      { id: "heno",     name: "Heno de Alfalfa",   type: "Fibra/Prot.", color: "#84cc16" },
      { id: "melaza",   name: "Melaza de Caña",    type: "Energético",  color: "#d97706" },
      { id: "nuc",      name: "Núcleo Mineral/Vit",type: "Mineral",     color: "#ec4899" }
    ];

    this.activeStudyCase = null;
    this.lastEvaluation = null;
    this.decisionChallenge = this.getDecisionChallenge();
    this.challengeSelection = null;

    this.init();
  }

  getDecisionChallenge() {
    const scenarios = [
      {
        prompt: "La vaca presenta caída de producción y la ración actual tiene exceso de maíz. ¿Cuál es la corrección más adecuada?",
        options: [
          { id: "a", text: "Aumentar fibra efectiva y ajustar el maíz para evitar acidosis ruminal.", correct: true, explanation: "La fibra efectiva mejora la rumia, el pH y la producción del hato." },
          { id: "b", text: "Disminuir la proteína y aumentar más maíz para ganar energía rápida.", correct: false, explanation: "Eso empeora la acidosis y el equilibrio ruminal." },
          { id: "c", text: "No cambiar nada y esperar al siguiente chequeo.", correct: false, explanation: "El problema se mantiene y la producción sigue cayendo." }
        ]
      },
      {
        prompt: "Un equino de deporte tiene trabajo intenso; ¿qué estrategia nutricional prioriza su salud digestiva?",
        options: [
          { id: "a", text: "Base forrajera alta con granos controlados y ración balanceada.", correct: true, explanation: "El forraje y el control del cereal evitan cólicos e infosura." },
          { id: "b", text: "Máxima carga de granos para mejorar desempeño inmediato.", correct: false, explanation: "El exceso de granos incrementa riesgo digestivo." },
          { id: "c", text: "Reducir totalmente el consumo de fibra para mejorar la velocidad.", correct: false, explanation: "Eso afecta la motilidad digestiva y la salud del caballo." }
        ]
      }
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  evaluateDecision(choiceId) {
    const selected = this.decisionChallenge.options.find(option => option.id === choiceId);
    this.challengeSelection = { choiceId, correct: !!selected?.correct, explanation: selected?.explanation || "" };
    if (selected?.correct) {
      this.store.emit("toast:show", { msg: "🌾 <b>Decisión acertada:</b> tu criterio nutricional está alineado con la salud animal.", type: "success" });
    }
    this.render();
  }

  init() {
    this.render();
    this.store.on("action:SELECT_ANIMAL", () => this.updateRequirementsView());
    this.store.on("action:UPDATE_DIET", () => this.updateCalculations());
  }

  generateRandomStudyCase() {
    const idx = Math.floor(Math.random() * NUTRITION_EXAM_CASES.length);
    this.activeStudyCase = NUTRITION_EXAM_CASES[idx];
    
    if (this.activeStudyCase.targetAnimalId) {
      this.store.dispatch(ACTION_TYPES.SELECT_ANIMAL, { animalId: this.activeStudyCase.targetAnimalId });
    }
    
    this.lastEvaluation = null;
    AudioFx.success();
    this.store.emit("toast:show", { msg: `🌾 <b>Nuevo Desafío Nutricional:</b> ${this.activeStudyCase.title}` });
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-4">
        <!-- 0. Generador de Casos y Enunciados Bromatológicos en Vivo -->
        <div class="bg-gradient-to-r from-emerald-950/40 to-blue-950/40 p-4 rounded-2xl border border-emerald-500/40 space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-xs text-emerald-300 uppercase tracking-wider mono flex items-center gap-1.5">
              <span>🎲</span> Generador de Enunciados Nutricionales en Vivo
            </h4>
            <button id="btnGenerateNutritionCase" class="btn px-3 py-1.5 rounded-xl border border-emerald-400/40 bg-emerald-900/50 hover:bg-emerald-800/60 text-xs font-bold text-emerald-200 flex items-center gap-1.5 shadow">
              <span>🔄</span> Generar Nuevo Enunciado
            </button>
          </div>

          ${this.activeStudyCase ? `
            <div class="p-3.5 rounded-xl bg-black/50 border border-emerald-400/30 space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <b class="text-white text-xs">${this.activeStudyCase.title}</b>
                <span class="mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">DESAFÍO ACTIVO</span>
              </div>
              <p class="text-gray-200 text-[11px] leading-relaxed">${this.activeStudyCase.vignette}</p>
              <div class="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-200">
                <b>🎯 Meta de Formulación:</b> ${this.activeStudyCase.goalText}
              </div>
            </div>
          ` : `
            <p class="text-[11px] text-[var(--muted)]">
              Pulsa <b>Generar Nuevo Enunciado</b> para recibir un problema bromatológico de campo (SARA, pico de lactancia, cólico equino, ceba porcina) y poner a prueba tu cálculo de ración.
            </p>
          `}
        </div>

        <div class="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h4 class="font-bold text-xs text-amber-200 uppercase tracking-wider mono m-0">🧠 Decisión nutricional rápida</h4>
            <span class="chip text-[10px] uppercase mono">Reto práctico</span>
          </div>
          <p class="text-sm text-gray-200 m-0">${this.decisionChallenge.prompt}</p>
          <div class="grid gap-2">
            ${this.decisionChallenge.options.map(option => {
              const selected = this.challengeSelection?.choiceId === option.id;
              const success = this.challengeSelection && option.correct;
              const danger = this.challengeSelection && selected && !option.correct;
              return `
                <button data-nutri-decision="${option.id}" class="btn nutrition-decision-btn text-left p-3 rounded-xl border ${success ? 'border-emerald-500/50 bg-emerald-950/30' : danger ? 'border-rose-500/50 bg-rose-950/30' : 'border-white/10 bg-black/30'} ${selected ? 'ring-1 ring-white/20' : ''}">
                  <span class="text-xs text-gray-200">${option.text}</span>
                </button>
              `;
            }).join("")}
          </div>
          ${this.challengeSelection ? `
            <div class="p-3 rounded-xl border ${this.challengeSelection.correct ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100' : 'border-rose-500/40 bg-rose-950/30 text-rose-100'} text-xs leading-relaxed">
              <b>${this.challengeSelection.correct ? '✅ Decisión correcta' : '⚠️ Ajusta el criterio'}</b>: ${this.decisionChallenge.options.find(opt => opt.id === this.challengeSelection.choiceId)?.explanation || this.challengeSelection.explanation}
            </div>
          ` : ""}
        </div>

        <!-- 1. Encabezado de la Estación -->
        <div class="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h3 class="display font-bold text-base text-white flex items-center gap-2">
              <span>🌾</span> Laboratorio de Formulación Bromatológica
            </h3>
            <p class="text-xs text-[var(--muted)]">Calcula el balance nutricional según especie, peso vivo y meta zootécnica.</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-[var(--muted)] mono block uppercase">Balance de Ración</span>
            <span id="labDietScore" class="mono text-sm font-bold text-emerald-400">0%</span>
          </div>
        </div>

        <!-- 2. Requerimientos del Animal Seleccionado -->
        <div id="speciesReqBox" class="bg-black/30 p-3 rounded-xl border border-[var(--border)] text-xs"></div>

        <!-- 3. Sliders de Ingredientes -->
        <div class="space-y-2.5" id="ingredientsList"></div>

        <!-- 4. Tabla Bromatológica en Tiempo Real -->
        <div class="bg-black/40 rounded-xl p-3 border border-[var(--border)]">
          <div class="text-[10px] mono text-[var(--muted)] uppercase mb-2">Composición Calculada vs Requerimiento</div>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">ENERGÍA</span>
              <b id="nutriEnergy" class="mono text-amber-300">—</b>
              <small class="text-[8px] text-[var(--muted)] block">Mcal/kg</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">PROTEÍNA</span>
              <b id="nutriProtein" class="mono text-blue-300">—</b>
              <small class="text-[8px] text-[var(--muted)] block">% PC</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">FIBRA (FDN)</span>
              <b id="nutriFiber" class="mono text-emerald-300">—</b>
              <small class="text-[8px] text-[var(--muted)] block">%</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">CALCIO (Ca)</span>
              <b id="nutriCa" class="mono text-purple-300">—</b>
              <small class="text-[8px] text-[var(--muted)] block">%</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">FÓSFORO (P)</span>
              <b id="nutriP" class="mono text-pink-300">—</b>
              <small class="text-[8px] text-[var(--muted)] block">%</small>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">COSTO DÍA</span>
              <b id="nutriCost" class="mono text-yellow-300">—</b>
              <small class="text-[8px] text-[var(--muted)] block">USD/kg</small>
            </div>
          </div>
        </div>

        <!-- 5. Botones de Acción: Validar Desafío & Servir Ración -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${this.activeStudyCase ? `
            <button id="btnEvaluateNutritionCase" class="btn rounded-xl py-3 font-bold text-xs bg-blue-700 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center gap-2">
              <span>📊</span> Evaluar Mi Ración contra el Enunciado
            </button>
          ` : ''}
          <button id="btnServeDiet" class="btn ${this.activeStudyCase ? '' : 'sm:col-span-2'} rounded-xl py-3 font-bold text-sm bg-gradient-to-r from-[#2d6a4f] to-[#1b4965] hover:from-[#357a5b] hover:to-[#22577a] text-white shadow-lg flex items-center justify-center gap-2">
            <span>🍽️</span> Servir Ración al Hato
          </button>
        </div>

        <!-- 6. Informe de Evaluación Nutricional -->
        <div id="nutritionEvaluationReport" class="${this.lastEvaluation ? '' : 'hidden'}">
          ${this.lastEvaluation ? this.renderReportHTML(this.lastEvaluation) : ''}
        </div>
      </div>
    `;

    this.renderSliders();
    this.updateRequirementsView();
    this.updateCalculations();
    this.setupEvents();
  }

  renderSliders() {
    const list = document.getElementById("ingredientsList");
    if (!list) return;

    const animal = store.getSelectedAnimal();
    const diet = store.get("diets")[animal.species] || {};

    list.innerHTML = this.ingredients.map(ing => {
      const val = diet[ing.id] || 0;
      return `
        <div class="bg-black/20 px-3 py-2 rounded-xl border border-[var(--border)] flex items-center gap-3">
          <div class="w-32 text-xs">
            <span class="font-semibold text-white block">${ing.name}</span>
            <span class="text-[9px] text-[var(--muted)] mono">${ing.type}</span>
          </div>
          <input type="range" min="0" max="100" value="${val}" data-ing="${ing.id}" class="flex-1 ing-slider" style="accent-color: ${ing.color}">
          <div class="w-12 text-right">
            <b id="val_${ing.id}" class="mono text-xs text-white">${val}%</b>
          </div>
        </div>
      `;
    }).join("");
  }

  updateRequirementsView() {
    const animal = store.getSelectedAnimal();
    const reqBox = document.getElementById("speciesReqBox");
    if (!reqBox || !animal) return;

    const req = simEngine.getSpeciesRequirements(animal.species, animal.weight);
    reqBox.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="font-bold text-white">${animal.tag} — ${animal.breed}</span>
        <span class="mono text-emerald-400 font-semibold">${animal.weight} kg · BCS ${animal.bcs}</span>
      </div>
      <div class="text-[11px] text-[var(--muted)]">
        Requerimiento objetivo: <b>${req.energyMin}–${req.energyMax} Mcal/kg</b> ED · <b>${req.proteinMin}–${req.proteinMax}%</b> PC · <b>${req.fiberMin}–${req.fiberMax}%</b> FDN
      </div>
    `;

    this.renderSliders();
    this.updateCalculations();
  }

  updateCalculations() {
    const animal = store.getSelectedAnimal();
    const diets = store.get("diets");
    const currentDiet = diets[animal.species] || {};

    const metrics = simEngine.computeDietMetrics(currentDiet);
    const req = simEngine.getSpeciesRequirements(animal.species, animal.weight);

    const energyScore = simEngine.scoreMetric(metrics.energy, req.energyMin, req.energyMax);
    const proteinScore = simEngine.scoreMetric(metrics.protein, req.proteinMin, req.proteinMax);
    const fiberScore = simEngine.scoreMetric(metrics.fiber, req.fiberMin, req.fiberMax);
    const overallScore = Math.round((0.4 * energyScore + 0.4 * proteinScore + 0.2 * fiberScore) * 100);

    const scoreEl = document.getElementById("labDietScore");
    if (scoreEl) {
      scoreEl.textContent = `${overallScore}%`;
      scoreEl.className = overallScore >= 80 ? "mono text-sm font-bold text-emerald-400" : overallScore >= 50 ? "mono text-sm font-bold text-amber-400" : "mono text-sm font-bold text-red-400";
    }

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setTxt("nutriEnergy", metrics.energy);
    setTxt("nutriProtein", `${metrics.protein}%`);
    setTxt("nutriFiber", `${metrics.fiber}%`);
    setTxt("nutriCa", `${metrics.ca}%`);
    setTxt("nutriP", `${metrics.p}%`);
    setTxt("nutriCost", `$${metrics.cost}`);
  }

  evaluateActiveCase() {
    if (!this.activeStudyCase) return;
    const c = this.activeStudyCase;
    const animal = store.getSelectedAnimal();
    const diets = store.get("diets");
    const currentDiet = diets[animal.species] || {};
    const metrics = simEngine.computeDietMetrics(currentDiet);

    const crit = c.criteria;
    const errors = [];

    if (crit.minFiber && metrics.fiber < crit.minFiber) {
      errors.push(`Déficit de Fibra FDN: La ración tiene ${metrics.fiber}% FDN (Se requería mínimo ${crit.minFiber}%).`);
    }
    if (crit.maxFiber && metrics.fiber > crit.maxFiber) {
      errors.push(`Exceso de Fibra: La ración tiene ${metrics.fiber}% FDN (Máximo admitido ${crit.maxFiber}%).`);
    }
    if (crit.maxMaiz && (currentDiet.maiz || 0) > crit.maxMaiz) {
      errors.push(`Exceso de Maíz molido: Asignaste ${currentDiet.maiz}% (Máximo permitido ${crit.maxMaiz}%).`);
    }
    if (crit.minHeno && (currentDiet.heno || 0) < crit.minHeno) {
      errors.push(`Falta de Heno de calidad: Asignaste ${currentDiet.heno || 0}% (Mínimo exigido ${crit.minHeno}%).`);
    }
    if (crit.minProtein && metrics.protein < crit.minProtein) {
      errors.push(`Déficit Proteico: La ración aporta ${metrics.protein}% PC (Mínimo requerido ${crit.minProtein}%).`);
    }
    if (crit.maxProtein && metrics.protein > crit.maxProtein) {
      errors.push(`Exceso Proteico: La ración aporta ${metrics.protein}% PC (Máximo permitido ${crit.maxProtein}%).`);
    }
    if (crit.minEnergy && metrics.energy < crit.minEnergy) {
      errors.push(`Déficit Energético: La ración aporta ${metrics.energy} Mcal/kg (Mínimo requerido ${crit.minEnergy}).`);
    }

    const passed = errors.length === 0;
    this.lastEvaluation = {
      title: c.title,
      passed,
      errors,
      metrics,
      timestamp: new Date().toLocaleTimeString()
    };

    if (passed) {
      AudioFx.success();
      store.emit("toast:show", { msg: `🌟 <b>¡Enhorabuena!</b> Has resuelto con éxito el desafío nutricional.` });
    } else {
      AudioFx.error();
    }

    this.render();
    const repEl = document.getElementById("nutritionEvaluationReport");
    if (repEl) repEl.scrollIntoView({ behavior: "smooth" });
  }

  renderReportHTML(rep) {
    return `
      <div class="p-4 rounded-xl border ${rep.passed ? 'border-emerald-500/50 bg-emerald-950/40' : 'border-rose-500/50 bg-rose-950/40'} space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="display font-bold text-sm text-white">DICTAMEN BROMATOLÓGICO DEL DESAFÍO</h4>
            <span class="text-[10px] text-[var(--muted)] mono">${rep.title} · ${rep.timestamp}</span>
          </div>
          <span class="display text-lg font-bold ${rep.passed ? 'text-emerald-400' : 'text-rose-400'}">
            ${rep.passed ? 'APROBADO (100/100)' : 'NO CONFORME'}
          </span>
        </div>

        ${rep.passed ? `
          <div class="p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-xs text-emerald-200">
            🌟 <b>Excelente Balance Nutricional:</b> Cumpliste con precisión todos los requerimientos de Energía (${rep.metrics.energy} Mcal), Proteína (${rep.metrics.protein}%) y Fibra FDN (${rep.metrics.fiber}%).
          </div>
        ` : `
          <div class="space-y-1 text-xs">
            <b class="text-amber-300 text-[11px] block">Ajustes Requeridos para Aprobar:</b>
            ${rep.errors.map(e => `<div class="p-2 rounded bg-black/40 border border-white/5 text-gray-200">❌ ${e}</div>`).join("")}
          </div>
        `}
      </div>
    `;
  }

  setupEvents() {
    const btnGenCase = document.getElementById("btnGenerateNutritionCase");
    if (btnGenCase) {
      btnGenCase.onclick = () => this.generateRandomStudyCase();
    }

    const btnEvalCase = document.getElementById("btnEvaluateNutritionCase");
    if (btnEvalCase) {
      btnEvalCase.onclick = () => this.evaluateActiveCase();
    }

    this.container.querySelectorAll(".nutrition-decision-btn").forEach(btn => {
      btn.onclick = () => this.evaluateDecision(btn.dataset.nutriDecision);
    });

    this.container.addEventListener("input", e => {
      if (e.target.classList.contains("ing-slider")) {
        const ingId = e.target.dataset.ing;
        const val = +e.target.value;

        const animal = store.getSelectedAnimal();
        const diets = store.get("diets");
        const diet = { ...(diets[animal.species] || {}) };

        // Ajuste proporcional para mantener suma de ingredientes
        diet[ingId] = val;
        const otherKeys = this.ingredients.map(i => i.id).filter(k => k !== ingId);
        const rem = Math.max(0, 100 - val);
        const curOtherSum = otherKeys.reduce((acc, k) => acc + (diet[k] || 0), 0);

        otherKeys.forEach(k => {
          diet[k] = curOtherSum > 0 ? Math.round((diet[k] / curOtherSum) * rem) : Math.round(rem / otherKeys.length);
          const valEl = document.getElementById(`val_${k}`);
          const sliderEl = document.querySelector(`.ing-slider[data-ing="${k}"]`);
          if (valEl) valEl.textContent = `${diet[k]}%`;
          if (sliderEl) sliderEl.value = diet[k];
        });

        const targetValEl = document.getElementById(`val_${ingId}`);
        if (targetValEl) targetValEl.textContent = `${val}%`;

        diets[animal.species] = diet;
        store.set("diets", diets);
        this.updateCalculations();
      }
    });

    const serveBtn = document.getElementById("btnServeDiet");
    if (serveBtn) {
      serveBtn.onclick = () => {
        AudioFx.success();
        store.emit("diet:served", store.getSelectedAnimal());
      };
    }
  }
}
