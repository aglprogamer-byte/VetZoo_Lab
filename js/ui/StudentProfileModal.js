/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * UI: StudentProfileModal.js - Expediente Académico, Matriz de Competencias y Evaluaciones
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { AudioFx } from "../core/SimEngine.js";

export class StudentProfileModal {
  constructor(modalId, { storeInstance = store } = {}) {
    this.modal = document.getElementById(modalId);
    this.store = storeInstance;
    this.lastFocusedElement = null;
    this.handleEscapeKey = (event) => {
      if (event.key === "Escape" && this.modal && !this.modal.classList.contains("hidden")) {
        this.close();
      }
    };
    this.init();
  }

  init() {
    this.store.on("modal:open_profile", () => this.open());
  }

  open() {
    if (!this.modal) return;

    const academic = this.store.get("academic");
    const scores = academic.scores || {};

    this.lastFocusedElement = document.activeElement;
    this.modal.classList.remove("hidden");
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.setAttribute("aria-label", "Expediente académico del estudiante");
    this.modal.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass hud-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] p-6 space-y-5 modal-panel" tabindex="-1">
          <!-- Encabezado del Perfil -->
          <div class="flex justify-between items-start border-b border-[var(--border)] pb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <h3 class="display text-xl font-bold text-white">${academic.studentName}</h3>
                <p class="text-xs text-[var(--muted)] mono">${academic.university} · ${academic.level}</p>
              </div>
            </div>
            <button id="btnCloseProfileModal" class="btn p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10" type="button" aria-label="Cerrar expediente académico">
              ✕
            </button>
          </div>

          <!-- Matriz de Competencias Universitarias -->
          <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-3">
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mono flex items-center justify-between">
              <span>📊 Matriz de Competencias Profesionales</span>
              <span class="text-emerald-400 font-semibold">Promedio: ${this.calcAverage(scores)}%</span>
            </h4>

            <div class="space-y-2.5 text-xs">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-gray-300">Nutrición & Formulación Bromatológica</span>
                  <b class="mono text-emerald-400">${scores.nutricion || 0}%</b>
                </div>
                <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: ${scores.nutricion || 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-gray-300">Semiología & Diagnóstico Clínico</span>
                  <b class="mono text-blue-400">${scores.semiologia || 0}%</b>
                </div>
                <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <div class="h-full bg-blue-500 rounded-full" style="width: ${scores.semiologia || 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-gray-300">Procedimientos Farmacológicos & Vías Inyectables</span>
                  <b class="mono text-purple-400">${scores.clinica || 0}%</b>
                </div>
                <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <div class="h-full bg-purple-500 rounded-full" style="width: ${scores.clinica || 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-gray-300">Manejo de Pastos, Forrajes & Carga Animal</span>
                  <b class="mono text-amber-400">${scores.pastos || 0}%</b>
                </div>
                <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <div class="h-full bg-amber-500 rounded-full" style="width: ${scores.pastos || 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-gray-300">Economía Agropecuaria & Eficiencia Productiva</span>
                  <b class="mono text-yellow-400">${scores.economia || 0}%</b>
                </div>
                <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <div class="h-full bg-yellow-500 rounded-full" style="width: ${scores.economia || 0}%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Historial de Casos Evaluados -->
          <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-2 text-xs">
            <h4 class="font-bold text-white uppercase tracking-wider mono text-[11px]">Informes de Prácticas y Misiones</h4>
            <div class="max-h-40 overflow-y-auto space-y-2 pr-1">
              ${academic.caseReports && academic.caseReports.length > 0 ? academic.caseReports.map(rep => `
                <div class="p-3 rounded-xl bg-black/20 border border-[var(--border)] space-y-1.5">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white">${rep.caseCode}</span>
                    <span class="mono px-2 py-0.5 rounded text-[10px] font-bold ${rep.passed ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}">
                      Nota: ${rep.studentScore}/100
                    </span>
                  </div>
                  <div class="text-[11px] text-gray-300">${rep.feedback[0] || 'Práctica completada.'}</div>
                </div>
              `).join("") : '<div class="text-gray-400 italic p-2">Aún no has resuelto casos evaluados. Ingresa a la sección "Caso Universitario".</div>'}
            </div>
          </div>

          <!-- Cierre -->
          <div class="flex justify-end pt-2">
            <button id="btnExitProfile" class="btn px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white" type="button" aria-label="Cerrar expediente académico">
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>
    `;

    document.removeEventListener("keydown", this.handleEscapeKey);
    document.addEventListener("keydown", this.handleEscapeKey);

    const firstFocusable = this.modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (firstFocusable) firstFocusable.focus();

    document.getElementById("btnCloseProfileModal").onclick = () => this.close();
    document.getElementById("btnExitProfile").onclick = () => this.close();
  }

  calcAverage(scores) {
    const vals = Object.values(scores);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  close() {
    if (this.modal) {
      document.removeEventListener("keydown", this.handleEscapeKey);
      this.modal.classList.add("hidden");
      this.modal.innerHTML = "";
      this.modal.removeAttribute("role");
      this.modal.removeAttribute("aria-modal");
      this.modal.removeAttribute("aria-label");
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
        this.lastFocusedElement.focus();
      }
    }
  }
}
