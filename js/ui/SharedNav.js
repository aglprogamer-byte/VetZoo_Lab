/**
 * ZOOTECNIA 3D - Granja Escuela Virtual & Laboratorio Clínico
 * UI: SharedNav.js - Barra de Navegación Global Responsiva, XP & Menú Móvil
 */

import { store as globalStore } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";
import { achievements } from "../core/Achievements.js";
import { StudentProfileModal } from "./StudentProfileModal.js";
import { AnimalCardModal } from "./AnimalCardModal.js";

export class SharedNav {
  constructor(activePage = "home", { storeInstance = globalStore, simEngineInstance = simEngine } = {}) {
    this.activePage = activePage;
    this.store = storeInstance;
    this.simEngine = simEngineInstance;
    this.achievements = achievements;
    this.init();
  }

  applyTheme(theme = "light") {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.body.setAttribute("data-theme", nextTheme);
    localStorage.setItem("vetzoo-theme", nextTheme);
    return nextTheme;
  }

  init() {
    const savedTheme = localStorage.getItem("vetzoo-theme") || "light";
    this.applyTheme(savedTheme);
    this.renderHeader();
    this.setupModals();
    this.bindEvents();
  }

  renderHeader() {
    const navContainer = document.getElementById("sharedNavContainer") || document.getElementById("hudContainer");
    if (!navContainer) return;

    const finances = this.store.get("finances") || { budget: 15000 };
    const day = this.store.get("day") || 1;
    const rank = this.achievements.getCurrentRank();
    const totalXP = this.achievements.data.totalXP;
    const streak = this.achievements.getStreak();

    const pages = [
      { id: "home", label: "Inicio", icon: "🏠", href: "index.html" },
      { id: "pastos", label: "Pastos & Fertilizantes", icon: "🌱", href: "pastos.html" },
      { id: "diagnostico", label: "Diagnóstico Clínico", icon: "🔬", href: "diagnostico.html" },
      { id: "parasitos", label: "Atlas Parásitos", icon: "🦠", href: "parasitos.html" },
      { id: "casos", label: "Casos Universitarios", icon: "🎓", href: "casos.html" },
      { id: "examen", label: "Examen 10min", icon: "⏱️", href: "examen.html" },
      { id: "bcs", label: "Condición BCS", icon: "🐄", href: "bcs.html" },
      { id: "plantas", label: "Plantas Tóxicas", icon: "🌿", href: "plantas.html" },
      { id: "sanitario", label: "Plan Sanitario", icon: "📋", href: "sanitario.html" },
      { id: "calculadoras", label: "Calculadoras", icon: "📐", href: "calculadoras.html" },
      { id: "cuaderno", label: "Cuaderno SOAP", icon: "📓", href: "cuaderno.html" },
      { id: "granja", label: "Granja 3D", icon: "🐾", href: "granja.html" },
      { id: "nutricion", label: "Nutrición", icon: "🌾", href: "nutricion.html" }
    ];

    navContainer.innerHTML = `
      <div class="glass hud-card rounded-2xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-3 border border-[var(--border)]">
        <!-- Logo y Branding -->
        <a href="index.html" class="flex items-center gap-3 no-underline text-inherit group">
          <div class="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition">
            🧬
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="display text-base md:text-lg font-bold tracking-tight m-0" style="color: var(--text);">VET & ZOO LAB</h1>
              <span class="text-[9px] md:text-[10px] mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-semibold uppercase">Universidad 3D</span>
            </div>
            <p class="text-[11px] text-[var(--muted)] mono m-0 hidden sm:block">Campus Virtual Docente · Medicina Veterinaria & Zootecnia</p>
          </div>
        </a>

        <!-- Telemetría, Rango XP & Acciones -->
        <div class="flex items-center gap-2">
          <!-- Rango y XP -->
          <div class="chip flex items-center gap-1.5 text-xs py-1.5 px-2.5 bg-black/40 border border-amber-500/30">
            <span>${rank.icon}</span>
            <span class="mono font-bold text-amber-300 text-[11px]">${rank.label}</span>
            <span class="text-[10px] text-gray-400 mono">(${totalXP} XP)</span>
          </div>

          <!-- Racha de Estudio -->
          <div class="chip hidden sm:flex items-center gap-1 text-xs py-1.5 px-2.5 bg-black/40 border border-rose-500/30">
            <span>🔥</span>
            <span class="mono font-bold text-rose-300 text-[11px]">${streak.current}d</span>
          </div>

          <!-- Día y Presupuesto -->
          <div class="chip hidden md:flex items-center gap-1.5 text-xs py-1.5 px-2.5">
            <span class="text-[var(--muted)]">📅</span>
            <span id="navDayLabel" class="mono font-bold text-[11px]" style="color: var(--text);">Día ${day}/30</span>
          </div>

          <div class="chip hidden lg:flex items-center gap-1.5 text-xs py-1.5 px-2.5">
            <span class="text-emerald-400">💵</span>
            <b id="navBudget" class="mono text-emerald-300 text-xs">$${Math.round(finances.budget).toLocaleString()}</b>
          </div>

          <div class="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-[var(--border)]">
            <button id="btnNavAdvance24h" class="btn px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30" title="Simular 24 horas">
              +24h
            </button>
            <button id="btnNavAdvance7d" class="btn px-2 py-1 text-[11px] font-bold rounded-lg bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30" title="Simular 7 días">
              +7d
            </button>
          </div>

          <!-- Botón Perfil Estudiante -->
          <button id="btnNavStudentProfile" class="btn px-2.5 md:px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-[11px] md:text-xs font-semibold text-emerald-200 flex items-center gap-1.5 shadow">
            <span>🎓</span> <span class="hidden md:inline">Expediente</span>
          </button>

          <button id="btnThemeToggle" class="btn px-2.5 md:px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] text-[11px] md:text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 shadow">
            <span>☀️</span> <span class="hidden md:inline">Claro</span>
          </button>

          <!-- Botón Menú Móvil -->
          <button id="btnToggleMobileMenu" class="btn lg:hidden p-2 rounded-xl border border-[var(--border)] bg-black/40 text-gray-300 hover:text-white" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="mobileMenuDrawer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>

      <!-- Barra de Navegación de Escritorio con scroll suave -->
      <nav class="hidden lg:flex gap-1.5 mt-3 overflow-x-auto pb-1" id="desktopNavLinks" aria-label="Navegación principal">
        ${pages.map(p => {
      const isActive = p.id === this.activePage;
      return `
            <a href="${p.href}" class="nav-link btn px-3 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap ${isActive ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30' : 'bg-black/30 text-[var(--text-secondary)] border-[var(--border)] hover:bg-white/5 hover:text-[var(--text)]'} flex items-center gap-1.5 no-underline" aria-current="${isActive ? 'page' : 'false'}" aria-label="Ir a ${p.label}">
              <span aria-hidden="true">${p.icon}</span> ${p.label}
            </a>
          `;
    }).join("")}
      </nav>

      <!-- Menú Desplegable Móvil -->
      <div id="mobileMenuDrawer" class="hidden lg:hidden glass hud-card rounded-2xl p-3 mt-2 border border-[var(--border)] grid grid-cols-2 gap-1.5 shadow-2xl" aria-label="Menú móvil">
        ${pages.map(p => {
      const isActive = p.id === this.activePage;
      return `
            <a href="${p.href}" class="btn p-2 rounded-xl text-xs font-semibold border ${isActive ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50' : 'bg-black/20 text-[var(--text-secondary)] border-white/5 hover:bg-white/5'} flex items-center gap-1.5 no-underline" aria-current="${isActive ? 'page' : 'false'}" aria-label="Ir a ${p.label}">
              <span aria-hidden="true">${p.icon}</span> ${p.label}
            </a>
          `;
    }).join("")}
      </div>
    `;
  }

  setupModals() {
    if (!document.getElementById("studentProfileModalContainer")) {
      const div = document.createElement("div");
      div.id = "studentProfileModalContainer";
      div.className = "hidden";
      document.body.appendChild(div);
    }

    if (!document.getElementById("animalCardModalContainer")) {
      const div = document.createElement("div");
      div.id = "animalCardModalContainer";
      div.className = "hidden";
      document.body.appendChild(div);
    }

    this.profileModal = new StudentProfileModal("studentProfileModalContainer", { storeInstance: this.store });
    this.animalModal = new AnimalCardModal("animalCardModalContainer", { storeInstance: this.store });
  }

  bindEvents() {
    const btnThemeToggle = document.getElementById("btnThemeToggle");
    if (btnThemeToggle) {
      const syncThemeButton = () => {
        const isDark = document.body.getAttribute("data-theme") === "dark";
        btnThemeToggle.innerHTML = `<span>${isDark ? "🌙" : "☀️"}</span> <span class="hidden md:inline">${isDark ? "Oscuro" : "Claro"}</span>`;
      };

      syncThemeButton();
      btnThemeToggle.onclick = () => {
        const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        this.applyTheme(nextTheme);
        syncThemeButton();
        AudioFx.click();
      };
    }

    const btnMenu = document.getElementById("btnToggleMobileMenu");
    const drawer = document.getElementById("mobileMenuDrawer");
    if (btnMenu && drawer) {
      btnMenu.onclick = () => {
        const isHidden = drawer.classList.toggle("hidden");
        btnMenu.setAttribute("aria-expanded", String(!isHidden));
        btnMenu.setAttribute("aria-label", isHidden ? "Abrir menú de navegación" : "Cerrar menú de navegación");
        AudioFx.click();
      };
    }

    document.querySelectorAll("#toast").forEach((toast) => {
      toast.setAttribute("aria-live", "polite");
      toast.setAttribute("aria-atomic", "true");
    });

    const b24 = document.getElementById("btnNavAdvance24h");
    const b7d = document.getElementById("btnNavAdvance7d");
    if (b24) b24.onclick = () => this.simEngine.advanceTime(1);
    if (b7d) b7d.onclick = () => this.simEngine.advanceTime(7);

    const btnProf = document.getElementById("btnNavStudentProfile");
    if (btnProf) {
      btnProf.onclick = () => {
        AudioFx.click();
        this.profileModal.open();
      };
    }

    this.store.on("change:day", () => this.updateHeaderStats());
    this.store.on("change:finances", () => this.updateHeaderStats());
  }

  updateHeaderStats() {
    const day = this.store.get("day") || 1;
    const finances = this.store.get("finances") || { budget: 15000 };

    const lblDay = document.getElementById("navDayLabel");
    if (lblDay) lblDay.textContent = `Día ${day}/30`;

    const lblBudget = document.getElementById("navBudget");
    if (lblBudget) lblBudget.textContent = `$${Math.round(finances.budget).toLocaleString()}`;
  }
}
