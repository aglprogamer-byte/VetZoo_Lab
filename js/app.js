/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Main Application Bootstrap con Contenedor de Inyección de Dependencias (DI Container)
 */

import { container } from "./core/Container.js";
import { Store, store as globalStore, ACTION_TYPES } from "./core/Store.js";
import { SimEngine, simEngine as globalSimEngine } from "./core/SimEngine.js";
import { Farm3D } from "./farm/Farm3D.js";
import { AnimalManager } from "./farm/AnimalManager.js";
import { HUD } from "./ui/HUD.js";
import { AnimalCardModal } from "./ui/AnimalCardModal.js";
import { StudentProfileModal } from "./ui/StudentProfileModal.js";
import { NutritionLab } from "./modules/NutritionLab.js";
import { ClinicalLab } from "./modules/ClinicalLab.js";
import { PastureLab } from "./modules/PastureLab.js";
import { CaseEngine } from "./modules/CaseEngine.js";

export class ApplicationBootstrap {
  constructor() {
    this.container = container;
  }

  /**
   * Registro e Inyección de Servicios en el Contenedor
   */
  configureServices() {
    // 1. Núcleo de Estado & Simulación — Reusar los singletons del módulo
    this.container.singleton("store", () => globalStore);
    this.container.singleton("simEngine", () => globalSimEngine);

    // 2. Gráficos 3D & Entidades WebGL
    this.container.singleton("farm3D", (c) => new Farm3D("scene3d", { storeInstance: c.get("store") }));
    this.container.singleton("animalManager", (c) => new AnimalManager(c.get("farm3D"), { storeInstance: c.get("store") }));

    // 3. Laboratorios de Zootecnia & Veterinaria
    this.container.singleton("nutritionLab", (c) => new NutritionLab("nutritionLabContainer", {
      storeInstance: c.get("store"),
      simEngineInstance: c.get("simEngine")
    }));
    this.container.singleton("clinicalLab", (c) => new ClinicalLab("anatomy3d", "clinicalLabControls", {
      storeInstance: c.get("store"),
      simEngineInstance: c.get("simEngine")
    }));
    this.container.singleton("pastureLab", (c) => new PastureLab("pastureLabContainer", {
      storeInstance: c.get("store")
    }));
    this.container.singleton("caseEngine", (c) => new CaseEngine({
      storeInstance: c.get("store"),
      simEngineInstance: c.get("simEngine")
    }));

    // 4. UI y Modales Académicos
    this.container.singleton("hud", (c) => new HUD("hudContainer", {
      storeInstance: c.get("store"),
      simEngineInstance: c.get("simEngine")
    }));
    this.container.singleton("animalCardModal", (c) => new AnimalCardModal("animalCardModalContainer", {
      storeInstance: c.get("store")
    }));
    this.container.singleton("studentProfileModal", (c) => new StudentProfileModal("studentProfileModalContainer", {
      storeInstance: c.get("store")
    }));
  }

  /**
   * Inicialización del ciclo de vida
   */
  start() {
    console.log("[Zootecnia 3D] Inicializando servicios mediante DI Container...");
    this.configureServices();

    // Resolver instancias
    const store = this.container.get("store");
    const farm3D = this.container.get("farm3D");
    const animalManager = this.container.get("animalManager");
    const nutritionLab = this.container.get("nutritionLab");
    const clinicalLab = this.container.get("clinicalLab");
    const pastureLab = this.container.get("pastureLab");
    const caseEngine = this.container.get("caseEngine");
    const hud = this.container.get("hud");
    const animalCardModal = this.container.get("animalCardModal");
    const studentProfileModal = this.container.get("studentProfileModal");

    // Renderizar Caso Activo
    this.renderCaseModule(caseEngine, store);

    // Conectar Eventos Globales
    this.bindGlobalEvents(store, farm3D, animalManager, clinicalLab);
  }

  bindGlobalEvents(store, farm3D, animalManager, clinicalLab) {
    store.on("navigation:changed", (tabId) => {
      const panels = ["tab-overview", "tab-nutrition", "tab-clinic", "tab-pasture", "tab-cases"];
      panels.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.classList.add("hidden");
      });

      const targetPanel = document.getElementById(tabId);
      if (targetPanel) targetPanel.classList.remove("hidden");

      if (tabId === "tab-overview") {
        farm3D.setZone("overview");
      } else if (tabId === "tab-nutrition") {
        farm3D.setZone("feeder");
      } else if (tabId === "tab-clinic") {
        setTimeout(() => {
          if (clinicalLab && typeof clinicalLab.setupCanvas === "function") {
            clinicalLab.setupCanvas();
          }
        }, 50);
      } else if (tabId === "tab-pasture") {
        farm3D.setZone("pasture");
      }

      setTimeout(() => farm3D.onResize(), 60);
    });

    store.on("diet:served", (animal) => {
      animalManager.setAnimation(animal.id, "walk", 2000);
      setTimeout(() => animalManager.setAnimation(animal.id, "idle"), 2000);
      this.showToast(`🍽️ <b>Ración servida:</b> Los animales se alimentan con la fórmula calculada.`);
    });

    store.on("procedure:success", (data) => this.showToast(`✅ ${data.msg}`, "ok"));
    store.on("procedure:failed", (data) => {
      animalManager.setAnimation(data.animal.id, "attack", 1500);
      this.showToast(`❌ ${data.msg}`, "bad");
    });
    store.on("toast:show", (data) => this.showToast(data.msg, data.type || "ok"));
    store.on("simulation:advanced", (data) => {
      this.showToast(`📅 <b>Simulación avanzada:</b> +${data.days} día(s). Día actual: ${data.newDay}/30.`);
    });

    // Delegación de eventos para tarjetas de animales y navegación de zonas
    document.addEventListener("click", (e) => {
      const animalCard = e.target.closest("[data-animal-id]");
      if (animalCard) {
        const animalId = animalCard.dataset.animalId;
        const animal = store.get("animals")[animalId];
        if (animal) {
          store.dispatch(ACTION_TYPES.SELECT_ANIMAL, { animalId });
          this.container.get("animalCardModal").open(animal);
        }
      }

      const zoneBtn = e.target.closest("[data-zone-id]");
      if (zoneBtn) {
        const zoneId = zoneBtn.dataset.zoneId;
        farm3D.setZone(zoneId);
      }
    });
  }

  renderCaseModule(caseEngine, store) {
    const container = document.getElementById("caseModuleContainer");
    if (!container) return;

    const c = caseEngine.activeCase;

    container.innerHTML = `
      <div class="glass hud-card rounded-2xl p-6 border border-amber-500/30 space-y-6">
        <div class="flex justify-between items-start border-b border-[var(--border)] pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ${c.difficulty}
              </span>
              <span class="text-xs text-[var(--muted)] mono">${c.category}</span>
            </div>
            <h3 class="display text-xl font-bold text-white mt-1">${c.code}</h3>
            <p class="text-sm text-gray-300 mt-0.5">${c.title}</p>
          </div>
          <button id="btnOpenPatientCard" class="btn px-3 py-1.5 rounded-xl border border-[var(--border)] bg-black/40 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <span>📋</span> Abrir Ficha Paciente
          </button>
        </div>

        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-2">
          <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider mono flex items-center gap-1.5">
            <span>🔍</span> 1. Contexto & Hallazgos Clínicos
          </h4>
          <p class="text-xs text-gray-200 leading-relaxed">${c.context}</p>
          <div class="text-[11px] text-[var(--muted)] pt-2 border-t border-[var(--border)]">
            <b>Hallazgos semiológicos:</b> ${c.anamnesis.symptoms} | <b>Dieta actual:</b> ${c.anamnesis.dietIssue}
          </div>
        </div>

        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-3">
          <h4 class="text-xs font-bold text-blue-300 uppercase tracking-wider mono flex items-center gap-1.5">
            <span>🧠</span> 2. Hipótesis Diagnóstica (Selecciona tu diagnóstico presuntivo)
          </h4>
          <div class="space-y-2" id="hypothesesOptions">
            ${c.hypotheses.map(h => `
              <label class="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-black/20 hover:bg-white/5 cursor-pointer text-xs transition">
                <input type="radio" name="hypothesis" value="${h.id}" class="accent-emerald-400">
                <span class="text-gray-200 font-medium">${h.label}</span>
              </label>
            `).join("")}
          </div>
        </div>

        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] text-xs space-y-2">
          <h4 class="text-xs font-bold text-emerald-300 uppercase tracking-wider mono flex items-center gap-1.5">
            <span>⚡</span> 3. Plan de Acción Zootécnico & Terapéutico
          </h4>
          <ol class="list-decimal list-inside space-y-1 text-gray-300">
            <li>Dirígete a la pestaña <b>🌾 Estación de Nutrición</b> y reajusta la ración aumentando fibra efectiva (>24% FDN) y disminuyendo maíz.</li>
            <li>En <b>💉 Consultorio</b>, verifica las constantes vitales del paciente.</li>
            <li>Pulsa <b>Evaluar Caso</b> para generar tu informe académico y rúbrica de desempeño.</li>
          </ol>
        </div>

        <div class="flex justify-between items-center pt-2">
          <span class="text-xs text-[var(--muted)]">Rúbrica de evaluación: Diagnóstico (30%) · Nutrición (35%) · Clínica (20%) · Economía (15%)</span>
          <button id="btnSubmitCaseReport" class="btn px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg flex items-center gap-2">
            <span>📊</span> Evaluar Caso & Emitir Informe
          </button>
        </div>

        <div id="caseResultReportContainer" class="hidden"></div>
      </div>
    `;

    document.querySelectorAll("input[name='hypothesis']").forEach(radio => {
      radio.onchange = e => caseEngine.submitHypothesis(e.target.value);
    });

    document.getElementById("btnOpenPatientCard").onclick = () => {
      const animal = store.get("animals")[c.targetAnimalId];
      store.emit("animal:selected", animal);
    };

    document.getElementById("btnSubmitCaseReport").onclick = () => {
      const rep = caseEngine.evaluateStudentReport();
      this.displayStudentReport(rep);
    };
  }

  displayStudentReport(report) {
    const reportBox = document.getElementById("caseResultReportContainer");
    if (!reportBox) return;

    reportBox.classList.remove("hidden");
    reportBox.innerHTML = `
      <div class="p-5 rounded-xl border ${report.passed ? 'border-emerald-500/40 bg-emerald-950/40' : 'border-red-500/40 bg-red-950/40'} space-y-4 mt-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="display font-bold text-base text-white">INFORME ACADÉMICO DEL ESTUDIANTE</h4>
            <span class="text-xs text-[var(--muted)] mono">Fecha: ${report.date} · ${report.caseCode}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-[var(--muted)] uppercase block">Calificación Final</span>
            <span class="display text-2xl font-bold ${report.passed ? 'text-emerald-400' : 'text-red-400'}">
              ${report.studentScore} / 100
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block">DIAGNÓSTICO</span>
            <b class="mono text-white">${report.breakdown.diagnostico} / 30</b>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block">FORMULACIÓN</span>
            <b class="mono text-white">${report.breakdown.nutricion} / 35</b>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block">CLÍNICA</span>
            <b class="mono text-white">${report.breakdown.clinica} / 20</b>
          </div>
          <div class="chip">
            <span class="text-[9px] text-[var(--muted)] block">BIENESTAR/ECON</span>
            <b class="mono text-white">${report.breakdown.bienestar} / 15</b>
          </div>
        </div>

        <div class="space-y-1.5 text-xs text-gray-200">
          ${report.feedback.map(fb => `<div class="p-2 rounded bg-black/30 border border-white/5">${fb}</div>`).join("")}
        </div>
      </div>
    `;

    reportBox.scrollIntoView({ behavior: "smooth" });
  }

  showToast(htmlMsg, type = "info") {
    const el = document.createElement("div");
    const border = type === "ok" ? "#10b981" : type === "bad" ? "#ef4444" : "#3b82f6";
    el.style.cssText = `background:rgba(10,25,34,.95);border-left:4px solid ${border};padding:12px 16px;border-radius:12px;box-shadow:0 15px 35px #0009;font-size:13px;transform:translateX(20px);opacity:0;transition:.25s;backdrop-filter:blur(10px);color:#fff;`;
    el.innerHTML = htmlMsg;
    const container = document.getElementById("toast");
    if (container) {
      container.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = "translateX(0)";
        el.style.opacity = "1";
      });
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 250);
      }, 4000);
    }
  }
}

// Inicializar mediante DI Container al cargar el DOM
window.addEventListener("DOMContentLoaded", () => {
  const bootstrap = new ApplicationBootstrap();
  bootstrap.start();
  window.appInstance = bootstrap;
});
