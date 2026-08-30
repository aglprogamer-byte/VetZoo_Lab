/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * UI: AnimalCardModal.js - Ficha Clínica y Zootécnica Completa por Animal
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { AudioFx } from "../core/SimEngine.js";

export class AnimalCardModal {
  constructor(modalId, { storeInstance = store } = {}) {
    this.modal = document.getElementById(modalId);
    this.store = storeInstance;
    this.init();
  }

  init() {
    this.store.on("animal:selected", (animal) => this.open(animal));
    this.store.on("modal:open_animal_card", () => this.open(this.store.getSelectedAnimal()));
  }

  open(animal) {
    if (!this.modal || !animal) return;

    this.modal.classList.remove("hidden");
    this.modal.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass hud-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] p-6 space-y-5">
          <!-- Encabezado de la Ficha -->
          <div class="flex justify-between items-start border-b border-[var(--border)] pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">${animal.species === 'vaca' ? '🐄' : animal.species === 'caballo' ? '🐎' : animal.species === 'oveja' ? '🐑' : '🐖'}</span>
                <h3 class="display text-xl font-bold text-white">${animal.tag} — ${animal.name}</h3>
              </div>
              <p class="text-xs text-[var(--muted)] mono mt-0.5">Expediente Clínico & Registro de Producción Zootécnica</p>
            </div>
            <button id="btnCloseAnimalModal" class="btn p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10">
              ✕
            </button>
          </div>

          <!-- Reseña Zootécnica -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">RAZA</span>
              <b class="text-white">${animal.breed}</b>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">EDAD / SEXO</span>
              <b class="text-white">${animal.ageMonths} meses · ${animal.sex}</b>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">PESO ACTUAL</span>
              <b class="mono text-emerald-400 font-bold">${animal.weight} kg</b>
            </div>
            <div class="chip">
              <span class="text-[9px] text-[var(--muted)] block">CONDICIÓN CORP.</span>
              <b class="mono text-amber-300 font-bold">BCS ${animal.bcs} / 5.0</b>
            </div>
          </div>

          <!-- Constantes Fisiológicas (Semiología) -->
          <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-3">
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mono flex items-center gap-1.5">
              <span>🩺</span> Constantes Fisiológicas del Paciente
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div class="bg-black/20 p-2 rounded-lg">
                <span class="text-[9px] text-[var(--muted)] block">TEMPERATURA</span>
                <b class="mono text-white">${animal.vitals.temp} °C</b>
                <small class="text-[8px] text-[var(--muted)] block">Ref: 38.0–39.0</small>
              </div>
              <div class="bg-black/20 p-2 rounded-lg">
                <span class="text-[9px] text-[var(--muted)] block">FREC. CARDÍACA</span>
                <b class="mono text-white">${animal.vitals.heartRate} lpm</b>
                <small class="text-[8px] text-[var(--muted)] block">Ref: 60–80</small>
              </div>
              <div class="bg-black/20 p-2 rounded-lg">
                <span class="text-[9px] text-[var(--muted)] block">FREC. RESPIRATORIA</span>
                <b class="mono text-white">${animal.vitals.respRate} rpm</b>
                <small class="text-[8px] text-[var(--muted)] block">Ref: 15–30</small>
              </div>
              <div class="bg-black/20 p-2 rounded-lg">
                <span class="text-[9px] text-[var(--muted)] block">RUMEN (2 min)</span>
                <b class="mono text-white">${animal.vitals.rumenMotility > 0 ? animal.vitals.rumenMotility : 'N/A'}</b>
                <small class="text-[8px] text-[var(--muted)] block">Ref: 2–3 mov</small>
              </div>
            </div>

            <div class="text-[11px] text-[var(--muted)] space-y-1 pt-2 border-t border-[var(--border)]">
              <div>Mucosas: <b class="text-gray-200">${animal.vitals.mucousMembranes}</b> · TLLC: <b class="text-gray-200">${animal.vitals.capillaryRefill}s</b></div>
              <div>Heces: <b class="text-gray-200">${animal.vitals.feces}</b></div>
            </div>
          </div>

          <!-- Estado Reproductivo & Producción -->
          <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] text-xs space-y-2">
            <h4 class="font-bold text-white uppercase tracking-wider mono text-[11px]">Estado Productivo & Reproductivo</h4>
            <div class="flex justify-between">
              <span>Estado: <b class="text-gray-200">${animal.reproductiveStatus}</b></span>
              ${animal.species === 'vaca' ? `<span>Producción Diaria: <b class="mono text-emerald-400 font-bold">${animal.milkProduction} L/día</b></span>` : `<span>Conversión FCR: <b class="mono text-amber-300 font-bold">${animal.fcr || '—'}</b></span>`}
            </div>
          </div>

          <!-- Historial Clínico y Eventos -->
          <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] text-xs space-y-2">
            <h4 class="font-bold text-white uppercase tracking-wider mono text-[11px]">Bitácora Sanitaria y de Manejo</h4>
            <div class="max-h-32 overflow-y-auto space-y-1.5 pr-1">
              ${animal.history.map(h => `
                <div class="p-2 rounded bg-black/20 border border-[var(--border)] flex justify-between">
                  <span class="text-gray-300"><b>Día ${h.day}:</b> ${h.desc || h.type}</span>
                  ${h.weight ? `<span class="mono text-[10px] text-emerald-400">${h.weight} kg</span>` : ''}
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-end gap-2 pt-2">
            <button id="btnExaminarAnimal" class="btn px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5">
              <span>🩺</span> Llevar a Examen Clínico
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btnCloseAnimalModal").onclick = () => this.close();
    document.getElementById("btnExaminarAnimal").onclick = () => {
      this.close();
      store.emit("navigation:changed", "tab-clinic");
    };
  }

  close() {
    if (this.modal) {
      this.modal.classList.add("hidden");
      this.modal.innerHTML = "";
    }
  }
}
