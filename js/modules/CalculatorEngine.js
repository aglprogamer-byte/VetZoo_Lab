/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: CalculatorEngine.js - Suite de Fórmulas y Calculadoras Veterinarias & Zootécnicas
 * Fluidoterapia, Dosificación Farmacológica, Cuadrado de Pearson, Aforo, FCR/GDP y Calostro
 */

import { AudioFx } from "../core/SimEngine.js";
import { achievements } from "../core/Achievements.js";

export class CalculatorEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeCalculator = "fluids"; // "fluids", "dosage", "pearson", "carrying", "growth", "colostrum"
    this.init();
  }

  init() {
    this.render();
    achievements.recordCalculation(this.activeCalculator);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- 1. Encabezado & Selector de Calculadora -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="display font-bold text-lg md:text-xl text-white flex items-center gap-2 m-0">
                <span>📐</span> Calculadoras & Fórmulas Veterinarias y Zootécnicas
              </h2>
              <span class="text-[10px] mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                Herramientas Clínicas
              </span>
            </div>
            <p class="text-xs text-[var(--muted)] mt-1 mb-0">
              Cálculo de fluidoterapia por deshidratación, dosificación milimétrica, cuadrado de Pearson, aforo y ganancia de peso.
            </p>
          </div>

          <!-- Pestañas de Calculadoras -->
          <div class="flex flex-wrap gap-1 bg-black/40 p-1.5 rounded-2xl border border-[var(--border)]">
            <button class="calc-tab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeCalculator === 'fluids' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-calc="fluids">
              💧 Fluidoterapia
            </button>
            <button class="calc-tab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeCalculator === 'dosage' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-calc="dosage">
              💊 Dosis Fármacos
            </button>
            <button class="calc-tab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeCalculator === 'pearson' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-calc="pearson">
              ⚖️ Cuadrado Pearson
            </button>
            <button class="calc-tab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeCalculator === 'carrying' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-calc="carrying">
              🌾 Aforo & UGM
            </button>
            <button class="calc-tab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeCalculator === 'growth' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-calc="growth">
              📈 FCR & GDP
            </button>
            <button class="calc-tab btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.activeCalculator === 'colostrum' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow' : 'text-gray-400 hover:text-white'}" data-calc="colostrum">
              🍼 Calostro Brix
            </button>
          </div>
        </div>

        <!-- 2. Contenedor de la Calculadora Activa -->
        <div id="calculatorActiveContainer">
          ${this.renderActiveCalculator()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderActiveCalculator() {
    if (this.activeCalculator === "fluids") return this.renderFluidotherapyCalc();
    if (this.activeCalculator === "dosage") return this.renderDrugDosageCalc();
    if (this.activeCalculator === "pearson") return this.renderPearsonSquareCalc();
    if (this.activeCalculator === "carrying") return this.renderCarryingCapacityCalc();
    if (this.activeCalculator === "growth") return this.renderGrowthFcrCalc();
    if (this.activeCalculator === "colostrum") return this.renderColostrumBrixCalc();
    return "";
  }

  /**
   * 1. CALCULADORA DE FLUIDOTERAPIA
   */
  renderFluidotherapyCalc() {
    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)] text-xs">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>💧</span> Parámetros del Paciente & Deshidratación
            </h3>
            <p class="text-gray-400 text-[11px] mt-1 mb-0">Cálculo de reemplazo del déficit de agua y electrolitos.</p>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Peso Vivo del Animal (kg):</label>
            <input type="number" id="inpFluidWeight" value="450" step="1" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-emerald-300">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">% de Deshidratación Estimada:</label>
            <select id="selFluidDehydration" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-white">
              <option value="5">5% — Deshidratación leve (Pliegue cutáneo 2s, mucosas ligeramente secas)</option>
              <option value="8" selected>8% — Deshidratación moderada (Pliegue 3-4s, ojos levemente hundidos)</option>
              <option value="10">10% — Deshidratación grave (Pliegue > 5s, ojos hundidos, extremidades frías)</option>
              <option value="12">12% — Choque hipovolémico inminente (Letargo, colapso)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Tasa de Mantenimiento Fisiológico:</label>
            <select id="selFluidMaintRate" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 text-white">
              <option value="50" selected>50 mL / kg / día (Adultos rumiantes / equinos)</option>
              <option value="60">60 mL / kg / día (Caninos adultos)</option>
              <option value="80">80 mL / kg / día (Terneros, potros y cachorros)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Pérdidas Continuas Estimadas (Vómito / Diarrea mL/día):</label>
            <input type="number" id="inpFluidLosses" value="2000" step="100" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Factor del Equipo de Venoclisis:</label>
            <select id="selFluidDropFactor" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white">
              <option value="10">Macrogotero Grande: 10 gotas / mL (Bovinos / Equinos)</option>
              <option value="15">Macrogotero Estándar: 15 gotas / mL</option>
              <option value="20" selected>Macrogotero Clínico: 20 gotas / mL (Pequeños animales)</option>
              <option value="60">Microgotero Pediátrico: 60 gotas / mL (Cachorros / Neonatos)</option>
            </select>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-emerald-500/30 space-y-4 text-xs" id="fluidResultPanel">
            <!-- Renderizado dinámico -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 2. CALCULADORA DE DOSIFICACIÓN DE FÁRMACOS
   */
  renderDrugDosageCalc() {
    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)] text-xs">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>💊</span> Dosificación Farmacológica de Precisión
            </h3>
            <p class="text-gray-400 text-[11px] mt-1 mb-0">Cálculo del volumen exacto de inyección en mililitros.</p>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Peso del Paciente (kg):</label>
            <input type="number" id="inpDosageWeight" value="520" step="1" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-emerald-300">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Dosis Terapéutica Recomendada (mg/kg):</label>
            <input type="number" id="inpDosageDose" value="1.1" step="0.1" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-white">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Concentración del Fármaco (mg/mL):</label>
            <input type="number" id="inpDosageConcentration" value="50" step="1" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-blue-300">
          </div>

          <div class="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1 text-gray-300 text-[11px]">
            <b>Fórmula Magistral:</b>
            <div class="mono text-emerald-300">Volumen (mL) = [Peso (kg) × Dosis (mg/kg)] ÷ Concentración (mg/mL)</div>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-blue-500/30 space-y-4 text-xs" id="dosageResultPanel">
            <!-- Renderizado dinámico -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 3. CUADRADO DE PEARSON
   */
  renderPearsonSquareCalc() {
    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)] text-xs">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>⚖️</span> Balanceador Cuadrado de Pearson
            </h3>
            <p class="text-gray-400 text-[11px] mt-1 mb-0">Mezcla exacta de 2 ingredientes para un % de Proteína Cruda (PC) meta.</p>
          </div>

          <div class="space-y-2 border-b border-white/5 pb-3">
            <b class="text-emerald-300 block">Ingrediente A (Alto en Proteína):</b>
            <div class="flex gap-2">
              <input type="text" id="inpPearsonNameA" value="Harina de Soya 48%" class="w-2/3 p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white">
              <input type="number" id="inpPearsonPcA" value="48.0" step="0.5" class="w-1/3 p-2 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-emerald-300 text-right">
              <span class="text-gray-400 self-center">% PC</span>
            </div>
          </div>

          <div class="space-y-2 border-b border-white/5 pb-3">
            <b class="text-amber-300 block">Ingrediente B (Bajo en Proteína / Energético):</b>
            <div class="flex gap-2">
              <input type="text" id="inpPearsonNameB" value="Maíz Molido" class="w-2/3 p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white">
              <input type="number" id="inpPearsonPcB" value="8.5" step="0.5" class="w-1/3 p-2 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-amber-300 text-right">
              <span class="text-gray-400 self-center">% PC</span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-white font-bold">% de Proteína Cruda (PC) Objetivo Deseada:</label>
            <input type="number" id="inpPearsonTarget" value="16.0" step="0.5" class="w-full p-2.5 rounded-xl border border-blue-500/40 bg-black/60 font-bold text-blue-300 text-center text-sm">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Total de Mezcla a Preparar (kg):</label>
            <input type="number" id="inpPearsonTotalKg" value="1000" step="50" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 font-bold text-white">
          </div>
        </div>

        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-emerald-500/30 space-y-4 text-xs" id="pearsonResultPanel">
            <!-- Renderizado dinámico -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 4. AFORO & UGM
   */
  renderCarryingCapacityCalc() {
    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)] text-xs">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>🌾</span> Capacidad de Carga & Disponibilidad de Forraje
            </h3>
            <p class="text-gray-400 text-[11px] mt-1 mb-0">Dimensionamiento de la carga animal en Unidades Gran Ganado (UGM).</p>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Área del Potrero (Hectáreas):</label>
            <input type="number" id="inpAreaHa" value="2.5" step="0.1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white font-bold">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Muestreo Promedio de Forraje Verde (g / m²):</label>
            <input type="number" id="inpYieldGPerM2" value="450" step="10" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-emerald-300 font-bold">
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="text-gray-300 font-semibold">% Materia Seca:</label>
              <input type="number" id="inpMsPercent" value="22" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-amber-300 font-bold">
            </div>
            <div class="space-y-1">
              <label class="text-gray-300 font-semibold">% Pérdida Pisoteo:</label>
              <input type="number" id="inpLossPercent" value="20" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-blue-300 font-bold">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Número de Animales en el Hato:</label>
            <input type="number" id="inpHerdCount" value="30" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white font-bold">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Peso Promedio por Animal (kg):</label>
            <input type="number" id="inpAnimalWeight" value="450" step="10" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white font-bold">
          </div>
        </div>

        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-amber-500/30 space-y-4 text-xs" id="carryingResultPanel">
            <!-- Renderizado dinámico -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 5. CRECIMIENTO GDP & FCR
   */
  renderGrowthFcrCalc() {
    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)] text-xs">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>📈</span> Conversión Alimenticia (FCR) & GDP
            </h3>
            <p class="text-gray-400 text-[11px] mt-1 mb-0">Evaluación de eficiencia biológica y zootécnica.</p>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Peso Inicial al Inicio del Ciclo (kg):</label>
            <input type="number" id="inpInitWeight" value="180" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Peso Final al Cierre (kg):</label>
            <input type="number" id="inpFinalWeight" value="320" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-emerald-300 font-bold">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Días del Ciclo de Ceba / Engorde:</label>
            <input type="number" id="inpDaysCount" value="120" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-blue-300 font-bold">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Alimento Total Consumido en Materia Seca (kg MS):</label>
            <input type="number" id="inpFeedConsumed" value="840" step="10" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-amber-300 font-bold">
          </div>
        </div>

        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-purple-500/30 space-y-4 text-xs" id="growthResultPanel">
            <!-- Renderizado dinámico -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 6. CALOSTRO & BRIX
   */
  renderColostrumBrixCalc() {
    return `
      <div class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 space-y-4 bg-black/40 p-5 rounded-2xl border border-[var(--border)] text-xs">
          <div class="border-b border-[var(--border)] pb-2.5">
            <h3 class="display text-base font-bold text-white flex items-center gap-2 m-0">
              <span>🍼</span> Calidad del Calostro & Inmunoglobulinas (Brix)
            </h3>
            <p class="text-gray-400 text-[11px] mt-1 mb-0">Transferencia pasiva de inmunidad en terneros neonatos.</p>
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Lectura en Refractómetro Óptico / Digital (°Brix):</label>
            <input type="number" id="inpBrixValue" value="24.5" step="0.5" class="w-full p-2.5 rounded-xl border border-emerald-500/40 bg-black/60 font-bold text-emerald-300 text-center text-sm">
          </div>

          <div class="space-y-1">
            <label class="text-gray-300 font-semibold">Peso del Ternero al Nacer (kg):</label>
            <input type="number" id="inpCalfBirthWeight" value="40" step="1" class="w-full p-2 rounded-xl border border-[var(--border)] bg-black/60 text-white font-bold">
          </div>

          <div class="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-[11px] text-gray-300">
            <b class="text-white">Escala de Calidad Calostral:</b>
            <div>🟢 <b>> 22 °Brix:</b> Calidad Excelente (> 50 g/L IgG). Apto para primera toma.</div>
            <div>🟡 <b>18 - 21.9 °Brix:</b> Calidad Regular (30-50 g/L IgG). Usar como segunda toma.</div>
            <div>🔴 <b>< 18 °Brix:</b> Calidad Deficiente (< 30 g/L IgG). Descartar o suplementar.</div>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-4">
          <div class="glass hud-card p-5 rounded-2xl border border-emerald-500/30 space-y-4 text-xs" id="colostrumResultPanel">
            <!-- Renderizado dinámico -->
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Pestañas
    document.querySelectorAll(".calc-tab").forEach(tab => {
      tab.onclick = () => {
        this.activeCalculator = tab.dataset.calc;
        AudioFx.click();
        this.render();
      };
    });

    // Actualizadores dinámicos según pestaña
    if (this.activeCalculator === "fluids") this.updateFluidResults();
    if (this.activeCalculator === "dosage") this.updateDosageResults();
    if (this.activeCalculator === "pearson") this.updatePearsonResults();
    if (this.activeCalculator === "carrying") this.updateCarryingResults();
    if (this.activeCalculator === "growth") this.updateGrowthResults();
    if (this.activeCalculator === "colostrum") this.updateColostrumResults();

    // Eventos Fluidos
    ["inpFluidWeight", "selFluidDehydration", "selFluidMaintRate", "inpFluidLosses", "selFluidDropFactor"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.updateFluidResults();
    });

    // Eventos Dosis
    ["inpDosageWeight", "inpDosageDose", "inpDosageConcentration"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.updateDosageResults();
    });

    // Eventos Pearson
    ["inpPearsonNameA", "inpPearsonPcA", "inpPearsonNameB", "inpPearsonPcB", "inpPearsonTarget", "inpPearsonTotalKg"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.updatePearsonResults();
    });

    // Eventos Aforo
    ["inpAreaHa", "inpYieldGPerM2", "inpMsPercent", "inpLossPercent", "inpHerdCount", "inpAnimalWeight"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.updateCarryingResults();
    });

    // Eventos Crecimiento
    ["inpInitWeight", "inpFinalWeight", "inpDaysCount", "inpFeedConsumed"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.updateGrowthResults();
    });

    // Eventos Calostro
    ["inpBrixValue", "inpCalfBirthWeight"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.updateColostrumResults();
    });
  }

  updateFluidResults() {
    const p = document.getElementById("fluidResultPanel");
    if (!p) return;

    const w = parseFloat(document.getElementById("inpFluidWeight")?.value) || 450;
    const dehy = parseFloat(document.getElementById("selFluidDehydration")?.value) || 8;
    const maint = parseFloat(document.getElementById("selFluidMaintRate")?.value) || 50;
    const losses = parseFloat(document.getElementById("inpFluidLosses")?.value) || 0;
    const dropFactor = parseFloat(document.getElementById("selFluidDropFactor")?.value) || 20;

    const deficitMl = w * dehy * 10;
    const maintMl = w * maint;
    const totalMl24h = deficitMl + maintMl + losses;
    const mlPerHour = Math.round(totalMl24h / 24);
    const dropsPerMin = Math.round((mlPerHour * dropFactor) / 60);

    p.innerHTML = `
      <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div>
          <span class="text-[10px] mono text-emerald-400 font-bold uppercase">PROTOCOLO DE FLUIDOTERAPIA CLÍNICA (24 HORAS)</span>
          <h4 class="display text-lg font-bold text-white m-0">Paciente: ${w} kg (${dehy}% Deshidratación)</h4>
        </div>
        <span class="chip mono text-emerald-300 font-bold">${totalMl24h.toLocaleString()} mL / 24h</span>
      </div>

      <div class="grid grid-cols-3 gap-2.5 text-center">
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block">1. DÉFICIT DESHIDRATACIÓN</span>
          <b class="mono text-amber-300 text-sm">${deficitMl.toLocaleString()} mL</b>
          <small class="text-[9px] text-gray-400 block">${w} kg × ${dehy}% × 10</small>
        </div>
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block">2. MANTENIMIENTO</span>
          <b class="mono text-blue-300 text-sm">${maintMl.toLocaleString()} mL</b>
          <small class="text-[9px] text-gray-400 block">${w} kg × ${maint} mL/kg</small>
        </div>
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block">3. PÉRDIDAS CONTÍNUAS</span>
          <b class="mono text-purple-300 text-sm">${losses.toLocaleString()} mL</b>
          <small class="text-[9px] text-gray-400 block">Vómito / Diarrea</small>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
        <b class="text-emerald-300 uppercase tracking-wider block mono text-[11px]">⚡ Velocidad de Infusión & Goteo:</b>
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="p-2.5 rounded-lg bg-black/40 border border-white/10">
            <span class="text-[10px] text-gray-300 block">Tasa Horaria (Bomba Infusión):</span>
            <b class="mono text-emerald-300 text-lg">${mlPerHour} mL / hora</b>
          </div>
          <div class="p-2.5 rounded-lg bg-black/40 border border-white/10">
            <span class="text-[10px] text-gray-300 block">Frecuencia de Goteo:</span>
            <b class="mono text-white text-lg">${dropsPerMin} gotas / min</b>
            <small class="text-[9px] text-gray-400 block">(Aprox. 1 gota cada ${(60 / dropsPerMin).toFixed(1)} segundos)</small>
          </div>
        </div>
      </div>
    `;
  }

  updateDosageResults() {
    const p = document.getElementById("dosageResultPanel");
    if (!p) return;

    const w = parseFloat(document.getElementById("inpDosageWeight")?.value) || 500;
    const dose = parseFloat(document.getElementById("inpDosageDose")?.value) || 1.0;
    const conc = parseFloat(document.getElementById("inpDosageConcentration")?.value) || 50;

    const totalMg = w * dose;
    const volumeMl = +(totalMg / conc).toFixed(2);
    const needFraction = volumeMl > 15;

    p.innerHTML = `
      <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div>
          <span class="text-[10px] mono text-blue-400 font-bold uppercase">PRESCRIPCIÓN FARMACOLÓGICA EXACTA</span>
          <h4 class="display text-lg font-bold text-white m-0">Dosis Calculada: ${volumeMl} mL</h4>
        </div>
        <span class="chip mono text-emerald-300 font-bold">${totalMg.toLocaleString()} mg Totales</span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block">PRINCIPIO ACTIVO TOTAL</span>
          <b class="mono text-white text-base">${totalMg.toLocaleString()} mg</b>
          <small class="text-[9px] text-gray-400 block">${w} kg × ${dose} mg/kg</small>
        </div>
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block">VOLUMEN A APLICAR</span>
          <b class="mono text-emerald-300 text-lg">${volumeMl} mL</b>
          <small class="text-[9px] text-gray-400 block">${totalMg} mg ÷ ${conc} mg/mL</small>
        </div>
      </div>

      ${needFraction ? `
        <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200">
          ⚠️ <b>Fraccionamiento Obligatorio:</b> El volumen (${volumeMl} mL) excede el máximo permitido por punto de inyección intramuscular (máx. 15 mL por punto en grandes animales). Se recomienda aplicar en <b>${Math.ceil(volumeMl / 15)} sitios anatómicos distintos</b> para evitar mionecrosis o abscesos.
        </div>
      ` : `
        <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
          ✅ <b>Volumen Seguro:</b> No requiere fraccionamiento. Puede aplicarse en un único punto anatómico.
        </div>
      `}
    `;
  }

  updatePearsonResults() {
    const p = document.getElementById("pearsonResultPanel");
    if (!p) return;

    const nameA = document.getElementById("inpPearsonNameA")?.value || "Ingrediente A";
    const pcA = parseFloat(document.getElementById("inpPearsonPcA")?.value) || 48;
    const nameB = document.getElementById("inpPearsonNameB")?.value || "Ingrediente B";
    const pcB = parseFloat(document.getElementById("inpPearsonPcB")?.value) || 8.5;
    const target = parseFloat(document.getElementById("inpPearsonTarget")?.value) || 16;
    const totalKg = parseFloat(document.getElementById("inpPearsonTotalKg")?.value) || 1000;

    if (target <= Math.min(pcA, pcB) || target >= Math.max(pcA, pcB)) {
      p.innerHTML = `
        <div class="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200">
          ❌ <b>Error Matemático de Pearson:</b> El % objetivo (${target}%) debe estar estrictamente entre los valores de los dos ingredientes (${Math.min(pcA, pcB)}% y ${Math.max(pcA, pcB)}%).
        </div>
      `;
      return;
    }

    const partsA = Math.abs(pcB - target);
    const partsB = Math.abs(pcA - target);
    const totalParts = partsA + partsB;

    const pctA = +((partsA / totalParts) * 100).toFixed(2);
    const pctB = +((partsB / totalParts) * 100).toFixed(2);

    const kgA = Math.round((pctA / 100) * totalKg);
    const kgB = Math.round((pctB / 100) * totalKg);

    p.innerHTML = `
      <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div>
          <span class="text-[10px] mono text-emerald-400 font-bold uppercase">RESULTADO CUADRADO DE PEARSON</span>
          <h4 class="display text-lg font-bold text-white m-0">Ración Equilibrada al ${target}% de Proteína</h4>
        </div>
        <span class="chip mono text-white font-bold">${totalKg.toLocaleString()} kg Mezcla</span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
          <span class="text-xs text-gray-300 font-bold">${nameA} (${pcA}% PC)</span>
          <b class="mono text-emerald-300 text-xl block">${pctA}%</b>
          <span class="mono text-white text-xs font-semibold block">${kgA.toLocaleString()} kg</span>
          <small class="text-[9px] text-gray-400 block">${partsA.toFixed(1)} partes</small>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-1">
          <span class="text-xs text-gray-300 font-bold">${nameB} (${pcB}% PC)</span>
          <b class="mono text-amber-300 text-xl block">${pctB}%</b>
          <span class="mono text-white text-xs font-semibold block">${kgB.toLocaleString()} kg</span>
          <small class="text-[9px] text-gray-400 block">${partsB.toFixed(1)} partes</small>
        </div>
      </div>

      <div class="p-3.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-gray-300 space-y-1">
        <b>Comprobación Bromatológica:</b>
        <div class="mono text-emerald-300">
          (${pctA}% × ${pcA}%) + (${pctB}% × ${pcB}%) = ${(((pctA * pcA) + (pctB * pcB)) / 100).toFixed(2)}% Proteína Cruda Final.
        </div>
      </div>
    `;
  }

  updateCarryingResults() {
    const p = document.getElementById("carryingResultPanel");
    if (!p) return;

    const area = parseFloat(document.getElementById("inpAreaHa")?.value) || 2.5;
    const yieldG = parseFloat(document.getElementById("inpYieldGPerM2")?.value) || 450;
    const ms = parseFloat(document.getElementById("inpMsPercent")?.value) || 22;
    const loss = parseFloat(document.getElementById("inpLossPercent")?.value) || 20;
    const herd = parseFloat(document.getElementById("inpHerdCount")?.value) || 30;
    const weight = parseFloat(document.getElementById("inpAnimalWeight")?.value) || 450;

    const totalFvKg = yieldG * 10 * area;
    const totalMsNetKg = Math.round(totalFvKg * (ms / 100) * (1 - (loss / 100)));
    const dailyIntakePerAnimal = weight * 0.03; // 3% PV en MS
    const dailyHerdIntake = herd * dailyIntakePerAnimal;
    const grazingDays = +(totalMsNetKg / dailyHerdIntake).toFixed(1);
    const totalUgm = +((herd * weight) / 450).toFixed(1);

    p.innerHTML = `
      <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div>
          <span class="text-[10px] mono text-amber-400 font-bold uppercase">BALANCE FORRAJERO & CARGA ANIMAL</span>
          <h4 class="display text-lg font-bold text-white m-0">${totalMsNetKg.toLocaleString()} kg MS Neta Disponible</h4>
        </div>
        <span class="chip mono text-amber-300 font-bold">${totalUgm} UGM en Hato</span>
      </div>

      <div class="grid grid-cols-3 gap-2.5 text-center">
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block uppercase">Forraje Verde Total</span>
          <b class="mono text-white text-sm">${(totalFvKg / 1000).toFixed(1)} Ton FV</b>
          <small class="text-[9px] text-gray-400 block">${area} Ha × ${yieldG} g/m²</small>
        </div>
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block uppercase">Consumo Diario Hato</span>
          <b class="mono text-blue-300 text-sm">${Math.round(dailyHerdIntake)} kg MS/día</b>
          <small class="text-[9px] text-gray-400 block">${herd} cab × ${dailyIntakePerAnimal.toFixed(1)} kg</small>
        </div>
        <div class="p-3 rounded-xl bg-black/40 border border-white/5">
          <span class="text-[9px] text-[var(--muted)] block uppercase">Días de Ocupación</span>
          <b class="mono text-emerald-300 text-base font-bold">${grazingDays} Días</b>
          <small class="text-[9px] text-emerald-400 block">Capacidad sostenible</small>
        </div>
      </div>
    `;
  }

  updateGrowthResults() {
    const p = document.getElementById("growthResultPanel");
    if (!p) return;

    const wInit = parseFloat(document.getElementById("inpInitWeight")?.value) || 180;
    const wFinal = parseFloat(document.getElementById("inpFinalWeight")?.value) || 320;
    const days = parseFloat(document.getElementById("inpDaysCount")?.value) || 120;
    const feed = parseFloat(document.getElementById("inpFeedConsumed")?.value) || 840;

    const totalGain = Math.max(0, wFinal - wInit);
    const adgGrams = days > 0 ? Math.round((totalGain / days) * 1000) : 0;
    const fcr = totalGain > 0 ? +(feed / totalGain).toFixed(2) : 0;

    p.innerHTML = `
      <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div>
          <span class="text-[10px] mono text-purple-400 font-bold uppercase">ÍNDICES DE EFICIENCIA PRODUCTIVA</span>
          <h4 class="display text-lg font-bold text-white m-0">GDP: ${adgGrams} g / día · FCR: ${fcr}</h4>
        </div>
        <span class="chip mono text-emerald-300 font-bold">+${totalGain} kg Ganados</span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="p-4 rounded-xl bg-black/40 border border-emerald-500/30">
          <span class="text-xs text-gray-300 font-bold block">Ganancia Diaria de Peso (GDP)</span>
          <b class="mono text-emerald-300 text-xl block">${adgGrams} g / día</b>
          <small class="text-[9px] text-gray-400 block">${totalGain} kg en ${days} días</small>
        </div>
        <div class="p-4 rounded-xl bg-black/40 border border-purple-500/30">
          <span class="text-xs text-gray-300 font-bold block">Conversión Alimenticia (FCR)</span>
          <b class="mono text-purple-300 text-xl block">${fcr} kg MS/kg</b>
          <small class="text-[9px] text-gray-400 block">Alimento consumido ÷ Ganancia</small>
        </div>
      </div>
    `;
  }

  updateColostrumResults() {
    const p = document.getElementById("colostrumResultPanel");
    if (!p) return;

    const brix = parseFloat(document.getElementById("inpBrixValue")?.value) || 24.5;
    const calfW = parseFloat(document.getElementById("inpCalfBirthWeight")?.value) || 40;

    const volLiters = +(calfW * 0.10).toFixed(1);
    const isGood = brix >= 22;
    const isMedium = brix >= 18 && brix < 22;

    p.innerHTML = `
      <div class="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div>
          <span class="text-[10px] mono text-emerald-400 font-bold uppercase">EVALUACIÓN DE CALIDAD CALOSTRAL</span>
          <h4 class="display text-lg font-bold text-white m-0">${brix} °Brix (${isGood ? 'Excelente' : (isMedium ? 'Regular' : 'Deficiente')})</h4>
        </div>
        <span class="chip mono text-emerald-300 font-bold">${volLiters} Litros en 6h</span>
      </div>

      <div class="p-4 rounded-xl ${isGood ? 'bg-emerald-950/40 border-emerald-500/40' : (isMedium ? 'bg-amber-950/40 border-amber-500/40' : 'bg-red-950/40 border-red-500/40')} space-y-2">
        <b class="text-white text-xs block">
          ${isGood ? '🎉 Calostro de Alta Calidad (> 50 g/L IgG)' : (isMedium ? '⚠️ Calostro de Calidad Intermedia (30 - 50 g/L IgG)' : '🔴 Calostro de Pobre Calidad (< 30 g/L IgG)')}
        </b>
        <p class="text-gray-200 text-[11px] leading-relaxed m-0">
          Suministrar <b>${volLiters} Litros (10% del peso corporal)</b> dentro de las primeras 2 a 6 horas de vida para garantizar el cierre del epitelio intestinal y prevenir la falla de transferencia pasiva (FTP).
        </p>
      </div>
    `;
  }
}
