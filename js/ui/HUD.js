/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * UI: HUD.js - Barra Superior de Control, Finanzas, Zonas y Tiempo
 */

import { store as globalStore, ACTION_TYPES } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";

export class HUD {
  constructor(containerId, { storeInstance = globalStore, simEngineInstance = simEngine } = {}) {
    this.container = document.getElementById(containerId);
    this.store = storeInstance;
    this.simEngine = simEngineInstance;
    this.init();
  }

  init() {
    this.render();
    this.store.on("change:day", () => this.updateTimeAndFinances());
    this.store.on("change:finances", () => this.updateTimeAndFinances());
    this.store.on("action:SELECT_ANIMAL", () => this.updateAnimalSelector());
  }

  render() {
    if (!this.container) return;

    const finances = this.store.get("finances");
    const day = this.store.get("day");

    this.container.innerHTML = `
      <div class="glass hud-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-[var(--border)]">
        <!-- Título Institucional y Universidad -->
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shadow-inner">
            🧬
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="display text-lg md:text-xl font-bold tracking-tight text-white">ZOOTECNIA 3D</h1>
              <span class="text-[10px] mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-semibold uppercase">Granja Escuela Virtual</span>
            </div>
            <p class="text-xs text-[var(--muted)] mono mt-0.5">Laboratorio Universitario · Simulación Zootécnica & Clínica Veterinaria</p>
          </div>
        </div>

        <!-- Indicadores de Granja & Finanzas -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <!-- Día y Calendario -->
          <div class="chip flex items-center gap-2 text-xs">
            <span class="text-[var(--muted)]">📅</span>
            <span id="hudDayLabel" class="mono font-bold text-white">Día ${day} / 30</span>
          </div>

          <!-- Presupuesto / Finanzas -->
          <div class="chip flex items-center gap-2 text-xs">
            <span class="text-emerald-400">💵</span>
            <span class="text-[var(--muted)] text-[10px]">PRESUPUESTO:</span>
            <b id="hudBudget" class="mono text-emerald-300">$${finances.budget.toLocaleString()}</b>
          </div>

          <!-- Botón de Simulación de Tiempo -->
          <div class="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-[var(--border)]">
            <button id="btnAdvance24h" class="btn px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/30" title="Simular 24 horas">
              ▶ +24h
            </button>
            <button id="btnAdvance7d" class="btn px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-950/50 hover:bg-blue-900/60 text-blue-200 border border-blue-500/30" title="Simular 7 días">
              ⏩ +7d
            </button>
          </div>

          <!-- Botón Perfil Estudiante -->
          <button id="btnStudentProfile" class="btn px-3 py-1.5 rounded-xl border border-[var(--border)] bg-black/30 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1.5 shadow">
            <span>🎓</span> Expediente Académico
          </button>
        </div>
      </div>

      <!-- Barra de Navegación de Zonas y Módulos -->
      <nav class="flex gap-2 mt-3 overflow-x-auto pb-1" id="zoneNavigation">
        <button class="nav-tab active btn px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] flex items-center gap-1.5" data-tab="tab-overview">
          <span>🌎</span> Vista Granja 3D
        </button>
        <button class="nav-tab btn px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-black/20 text-[var(--muted)] flex items-center gap-1.5" data-tab="tab-nutrition">
          <span>🌾</span> Estación de Nutrición
        </button>
        <button class="nav-tab btn px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-black/20 text-[var(--muted)] flex items-center gap-1.5" data-tab="tab-clinic">
          <span>💉</span> Consultorio & Anatomía
        </button>
        <button class="nav-tab btn px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-black/20 text-[var(--muted)] flex items-center gap-1.5" data-tab="tab-pasture">
          <span>🌱</span> Pastos & Forrajes
        </button>
        <button class="nav-tab btn px-4 py-2.5 rounded-xl text-xs font-semibold border border-amber-500/40 bg-amber-950/30 text-amber-200 flex items-center gap-1.5" data-tab="tab-cases">
          <span>📋</span> Caso Universitario (Misión)
        </button>
      </nav>
    `;

    this.setupEvents();
  }

  updateTimeAndFinances() {
    const day = this.store.get("day");
    const finances = this.store.get("finances");

    const lblDay = document.getElementById("hudDayLabel");
    if (lblDay) lblDay.textContent = `Día ${day} / 30`;

    const lblBudget = document.getElementById("hudBudget");
    if (lblBudget) lblBudget.textContent = `$${Math.round(finances.budget).toLocaleString()}`;
  }

  updateAnimalSelector() {
    const animal = this.store.getSelectedAnimal();
    const tagEl = document.getElementById("activeAnimalTag");
    if (tagEl && animal) {
      tagEl.textContent = `${animal.tag} (${animal.breed})`;
    }
  }

  setupEvents() {
    // Avance de Tiempo
    const b24 = document.getElementById("btnAdvance24h");
    const b7d = document.getElementById("btnAdvance7d");

    if (b24) {
      b24.onclick = () => {
        this.simEngine.advanceTime(1);
      };
    }

    if (b7d) {
      b7d.onclick = () => {
        this.simEngine.advanceTime(7);
      };
    }

    // Navegación por pestañas
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.onclick = () => {
        const tabId = tab.dataset.tab;
        document.querySelectorAll(".nav-tab").forEach(t => {
          t.classList.remove("active", "bg-emerald-950/60", "text-white");
          t.classList.add("bg-black/20", "text-[var(--muted)]");
        });
        tab.classList.add("active", "bg-emerald-950/60", "text-white");
        tab.classList.remove("bg-black/20", "text-[var(--muted)]");

        AudioFx.nav();
        this.store.emit("navigation:changed", tabId);
      };
    });

    // Abrir Perfil Académico
    const btnProf = document.getElementById("btnStudentProfile");
    if (btnProf) {
      btnProf.onclick = () => {
        AudioFx.click();
        this.store.emit("modal:open_profile");
      };
    }
  }
}
