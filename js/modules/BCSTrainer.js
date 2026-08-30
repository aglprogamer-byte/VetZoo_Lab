/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: BCSTrainer.js — Entrenador de Condición Corporal (BCS)
 *
 * Simulador de evaluación semiológica de reservas energéticas en bovinos (1-5),
 * equinos (1-9 Henneke) y ovinos (1-5 Russell) con modo práctica y examen.
 */

import { achievements } from "../core/Achievements.js";

export const BCS_SPECIES_DATA = {
  bovino: {
    name: "Bovinos Lecheros (Escala Edmonson 1 - 5)",
    icon: "🐄",
    scaleRange: { min: 1.0, max: 5.0, step: 0.25 },
    benchmarks: {
      parto: "3.25 - 3.50",
      pico_lactancia: "2.75 - 3.00 (Pérdida max 0.5-0.75 pts)",
      secado: "3.25 - 3.50"
    },
    anatomicalPoints: [
      "Apófisis espinosas y transversas de vértebras lumbares",
      "Tuberosidad coxal (punta de cadera / Ilion)",
      "Tuberosidad isquiática (punta de nalga / Isquion)",
      "Depresión entre coxal e isquial (Ángulo 'V' en flacas, 'U' en óptimas, plano en obesas)",
      "Fosa del ijar y ligamento sacroilíaco",
      "Inserción de la base de la cola"
    ],
    scenarios: [
      {
        id: "bov_1",
        title: "Vaca Holstein de 3er parto, 45 días en leche (Pico de lactancia)",
        description: "Apófisis lumbares visibles como sierra suave pero cubiertas de ligera grasa. La cavidad entre cadera e isquion forma una 'U' abierta. Ligamentos sacros visibles pero no afilados. Pliegues de piel suaves en la base de la cola.",
        targetBCS: 3.0,
        tolerance: 0.25,
        clinicalComment: "Condición corporal óptima para el pico de producción (3.0). Permite alta producción sin entrar en cetosis clínica ni balance energético negativo severo."
      },
      {
        id: "bov_2",
        title: "Vaca Jersey de 1er parto, 20 días posparto",
        description: "Apófisis transversas claramente individuales y cortantes al tacto. Forma de 'V' profunda y angulosa entre coxal e isquial. Ausencia total de grasa en la base de la cola. Fosa del ijar muy profunda.",
        targetBCS: 2.0,
        tolerance: 0.25,
        clinicalComment: "Condición corporal deficiente (2.0) — Balance Energético Negativo (BEN) severo. Alto riesgo de cetosis, metritis, anestro posparto e inmunosupresión."
      },
      {
        id: "bov_3",
        title: "Vaca al momento del secado (Día -60 preparto)",
        description: "Línea dorsal continua y plana. Tuberosidades coxal e isquiática redondeadas y difíciles de delimitar por manto graso uniforme. Ángulo plano entre caderas. Depósito evidente de grasa en la base de la cola.",
        targetBCS: 4.0,
        tolerance: 0.25,
        clinicalComment: "Sobrecondición corporal al secado (4.0). Alto riesgo de Síndrome de Hígado Graso, cetosis posparto, hipocalcemia y retención de placenta."
      }
    ]
  },
  equino: {
    name: "Equinos (Escala Henneke 1 - 9)",
    icon: "🐎",
    scaleRange: { min: 1, max: 9, step: 0.5 },
    benchmarks: {
      deporte_alto_rendimiento: "5.0 - 5.5",
      yegua_cria: "5.5 - 6.5",
      mantenimiento: "5.0"
    },
    anatomicalPoints: [
      "Cuello y cresta nucal (presencia de grasa acumulada)",
      "Cruz (apófisis dorsales)",
      "Línea del lomo y grupa",
      "Inserción de la cola (grasa blanda peri-coccígea)",
      "Costillas y espacio intercostal",
      "Detrás del hombro y escápula"
    ],
    scenarios: [
      {
        id: "eq_1",
        title: "Caballo Criollo Colombiano en competencia activa",
        description: "Costillas no visibles a la vista pero fácilmente palpables con suave presión digital. Lomo plano sin canal dorsal ni cresta afilada. Cruz redondeada y cuello flexible sin cresta adiposa dura.",
        targetBCS: 5.0,
        tolerance: 0.5,
        clinicalComment: "Condición atlética ideal (5.0/9). Excelente equilibrio entre reservas de glucógeno y agilidad biomecánica sin sobrecarga articular."
      },
      {
        id: "eq_2",
        title: "Yegua Pura Sangre en pastoreo extensivo de sequía",
        description: "Costillas, apófisis espinosas y tuberosidades ilíacas prominentemente visibles. Cuello en 'tabla', cruz muy afilada. Hombros y escápula marcadamente delimitados. Falta visible de masa muscular.",
        targetBCS: 2.5,
        tolerance: 0.5,
        clinicalComment: "Emaciación moderada a severa (2.5/9). Requiere evaluación odontológica, perfil coprológico McMaster e incremento gradual de energía digestible con heno de calidad."
      }
    ]
  }
};

export class BCSTrainer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedSpeciesKey = "bovino";
    this.currentScenarioIndex = 0;
    this.userScoreInput = 3.0;
    this.sessionScore = { correct: 0, total: 0 };
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const spData = BCS_SPECIES_DATA[this.selectedSpeciesKey];
    const scenario = spData.scenarios[this.currentScenarioIndex];

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
              🐄
            </div>
            <div>
              <h2 class="display text-xl sm:text-2xl font-bold text-white m-0">Entrenador Semiológico de Condición Corporal (BCS)</h2>
              <p class="text-xs text-[var(--muted)] m-0">Evaluación estandarizada de reservas de grasa corporal y masa muscular en campo.</p>
            </div>
          </div>

          <!-- Selector de Especie -->
          <div class="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-2xl border border-[var(--border)]">
            ${Object.keys(BCS_SPECIES_DATA).map(k => `
              <button class="btn-sp btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.selectedSpeciesKey === k ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'}" data-sp="${k}">
                ${BCS_SPECIES_DATA[k].icon} ${BCS_SPECIES_DATA[k].name.split("(")[0].trim()}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="grid lg:grid-cols-12 gap-6">
          <!-- Columna Izquierda: Puntos Anatómicos y Parámetros -->
          <div class="lg:col-span-5 space-y-4">
            <div class="glass p-5 rounded-2xl border border-[var(--border)] space-y-3">
              <h3 class="display font-bold text-white text-sm m-0">🎯 Puntos Anatómicos Clave de Evaluación</h3>
              <ul class="space-y-1.5 text-xs text-gray-300 m-0 pl-4 list-disc">
                ${spData.anatomicalPoints.map(pt => `<li>${pt}</li>`).join("")}
              </ul>
            </div>

            <div class="glass p-5 rounded-2xl border border-amber-500/30 bg-black/40 space-y-2 text-xs">
              <h4 class="font-bold text-amber-300 mono text-xs uppercase m-0">Metas Zootécnicas Recomendadas:</h4>
              <div class="space-y-1 text-gray-200">
                ${Object.keys(spData.benchmarks).map(bk => `
                  <div class="flex justify-between border-b border-white/5 py-1">
                    <span class="text-gray-400 capitalize">${bk.replace(/_/g, " ")}:</span>
                    <b class="mono text-white">${spData.benchmarks[bk]}</b>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Caso Clínico y Slider Interactivo -->
          <div class="lg:col-span-7 space-y-4">
            <div class="glass p-6 rounded-2xl border border-amber-500/40 bg-black/50 space-y-4 shadow-xl">
              <div class="flex justify-between items-center border-b border-white/10 pb-2">
                <span class="mono text-[10px] text-amber-400 uppercase tracking-wider">CASO CLÍNICO #${this.currentScenarioIndex + 1} DE ${spData.scenarios.length}</span>
                <span class="mono text-xs text-white font-bold">Aciertos: ${this.sessionScore.correct} / ${this.sessionScore.total}</span>
              </div>

              <div>
                <h3 class="display text-base font-bold text-white m-0">${scenario.title}</h3>
                <div class="p-4 rounded-xl bg-black/60 border border-white/5 text-xs text-gray-300 mt-2 leading-relaxed">
                  ${scenario.description}
                </div>
              </div>

              <!-- Control Slider -->
              <div class="space-y-3 pt-2">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold text-gray-200">Tu Dictamen de Condición Corporal (BCS):</label>
                  <span class="display text-3xl font-extrabold text-amber-400 mono" id="bcsValueDisplay">${this.userScoreInput.toFixed(2)}</span>
                </div>

                <input type="range" id="bcsRangeInput" min="${spData.scaleRange.min}" max="${spData.scaleRange.max}" step="${spData.scaleRange.step}" value="${this.userScoreInput}" class="w-full accent-amber-400 cursor-pointer">

                <div class="flex justify-between text-[10px] mono text-gray-500">
                  <span>${spData.scaleRange.min} (Emaciado)</span>
                  <span>${(spData.scaleRange.min + spData.scaleRange.max) / 2} (Óptimo)</span>
                  <span>${spData.scaleRange.max} (Obeso)</span>
                </div>
              </div>

              <div class="flex gap-2 pt-2">
                <button id="btnSubmitBCS" class="btn flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold text-xs shadow-lg">
                  ⚖️ Emitir Dictamen Semiológico
                </button>
                <button id="btnNextBCS" class="btn px-4 py-3 rounded-xl bg-black/40 border border-white/10 hover:bg-white/10 text-white text-xs font-bold">
                  Siguiente ➡️
                </button>
              </div>

              <!-- Feedback Box -->
              <div id="bcsFeedbackBox" class="hidden p-4 rounded-xl text-xs space-y-2"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll(".btn-sp").forEach(btn => {
      btn.onclick = () => {
        this.selectedSpeciesKey = btn.dataset.sp;
        this.currentScenarioIndex = 0;
        const spData = BCS_SPECIES_DATA[this.selectedSpeciesKey];
        this.userScoreInput = (spData.scaleRange.min + spData.scaleRange.max) / 2;
        this.render();
      };
    });

    const range = this.container.querySelector("#bcsRangeInput");
    const display = this.container.querySelector("#bcsValueDisplay");
    if (range && display) {
      range.oninput = (e) => {
        this.userScoreInput = parseFloat(e.target.value);
        display.textContent = this.userScoreInput.toFixed(2);
      };
    }

    const btnSubmit = this.container.querySelector("#btnSubmitBCS");
    if (btnSubmit) {
      btnSubmit.onclick = () => {
        const spData = BCS_SPECIES_DATA[this.selectedSpeciesKey];
        const scenario = spData.scenarios[this.currentScenarioIndex];
        const fb = this.container.querySelector("#bcsFeedbackBox");
        if (!fb) return;

        this.sessionScore.total++;
        const delta = Math.abs(this.userScoreInput - scenario.targetBCS);
        const isCorrect = delta <= scenario.tolerance;

        achievements.recordBCSEvaluation(isCorrect);
        if (isCorrect) this.sessionScore.correct++;

        fb.classList.remove("hidden", "bg-emerald-950/80", "border-emerald-500/40", "bg-red-950/80", "border-red-500/40");

        if (isCorrect) {
          fb.classList.add("bg-emerald-950/80", "border", "border-emerald-500/40", "text-emerald-200");
          fb.innerHTML = `
            <div class="font-bold flex items-center gap-1.5 text-sm">
              <span>✅</span> ¡Excelente ojo clínico! Dictamen correcto (BCS ${scenario.targetBCS})
            </div>
            <p class="text-xs text-gray-200 m-0">${scenario.clinicalComment}</p>
          `;
        } else {
          fb.classList.add("bg-red-950/80", "border", "border-red-500/40", "text-red-200");
          fb.innerHTML = `
            <div class="font-bold flex items-center gap-1.5 text-sm">
              <span>❌</span> Desviación en el dictamen (Objetivo: BCS ${scenario.targetBCS} ± ${scenario.tolerance})
            </div>
            <p class="text-xs text-gray-300 m-0">${scenario.clinicalComment}</p>
          `;
        }
      };
    }

    const btnNext = this.container.querySelector("#btnNextBCS");
    if (btnNext) {
      btnNext.onclick = () => {
        const spData = BCS_SPECIES_DATA[this.selectedSpeciesKey];
        this.currentScenarioIndex = (this.currentScenarioIndex + 1) % spData.scenarios.length;
        this.render();
      };
    }
  }
}
