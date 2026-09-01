/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: TimedExam.js — Modo Examen Clínico Universitario Cronometrado
 *
 * Simulación de examen de grado / internado clínico bajo presión de tiempo (10 min)
 * con selección aleatoria de casos y emisión de dictamen académico formal.
 */

import { UNIVERSITY_CLINICAL_CASES } from "./CaseEngine.js";
import { achievements } from "../core/Achievements.js";
import { AudioFx } from "../core/SimEngine.js";

export class TimedExam {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.examState = "idle"; // "idle" | "running" | "submitted"
    this.activeCase = null;
    this.durationSeconds = 600; // 10 minutos
    this.timeRemaining = 600;
    this.timerInterval = null;
    this.studentAnswers = {
      selectedHypothesis: null,
      selectedTreatmentOpt: null
    };
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.examState === "idle") {
      this.renderStartScreen();
    } else if (this.examState === "running") {
      this.renderRunningExam();
    } else {
      this.renderExamResults();
    }
  }

  selectRandomCase(excludeCaseId = this.activeCase?.id) {
    const availableCases = UNIVERSITY_CLINICAL_CASES.filter(caseItem => caseItem.id !== excludeCaseId);
    if (!availableCases.length) return this.activeCase;
    return availableCases[Math.floor(Math.random() * availableCases.length)];
  }

  renderStartScreen() {
    this.container.innerHTML = `
      <div class="glass p-8 rounded-3xl border border-rose-500/30 bg-black/60 max-w-2xl mx-auto text-center space-y-6 shadow-2xl">
        <div class="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl mx-auto shadow-inner">
          ⏱️
        </div>

        <div>
          <h2 class="display text-2xl sm:text-3xl font-extrabold text-white m-0">Examen Clínico Universitario Cronometrado</h2>
          <p class="text-sm text-gray-300 mt-2 leading-relaxed max-w-lg mx-auto">
            Pon a prueba tu agilidad de diagnóstico en condiciones reales de internado clínico. Se te asignará un caso clínico al azar y tendrás <b>10 minutos</b> para emitir tu dictamen terapéutico.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 text-xs text-left max-w-md mx-auto">
          <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span class="text-gray-400 block">Tiempo límite</span>
            <b class="text-white mono text-sm">10:00 min</b>
          </div>
          <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span class="text-gray-400 block">Aprobación</span>
            <b class="text-emerald-400 mono text-sm">≥ 70 / 100 pts</b>
          </div>
          <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span class="text-gray-400 block">Recompensa</span>
            <b class="text-amber-300 mono text-sm">+150 XP</b>
          </div>
        </div>

        <div class="pt-2">
          <button id="btnStartTimedExam" class="btn px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 mx-auto" type="button" aria-label="Iniciar examen clínico cronometrado">
            <span aria-hidden="true">🔥</span> Iniciar Examen de Grado
          </button>
        </div>
      </div>
    `;

    const btn = this.container.querySelector("#btnStartTimedExam");
    if (btn) {
      btn.onclick = () => {
        const nextCase = this.selectRandomCase();
        this.activeCase = nextCase;
        this.timeRemaining = this.durationSeconds;
        this.examState = "running";
        this.studentAnswers = { selectedHypothesis: null, selectedTreatmentOpt: null };
        this.startTimer();
        this.render();
      };
    }
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      if (this.timeRemaining === 120) {
        // Alerta de 2 minutos
        AudioFx.click();
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.submitExam();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const el = this.container.querySelector("#examTimerDigits");
    const bar = this.container.querySelector("#examTimerProgressBar");
    if (!el || !bar) return;

    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const pct = Math.max(0, (this.timeRemaining / this.durationSeconds) * 100);
    bar.style.width = `${pct}%`;

    if (this.timeRemaining <= 120) {
      el.className = "display text-2xl font-bold mono text-rose-400 animate-pulse";
    }
  }

  renderRunningExam() {
    const c = this.activeCase;
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Barra Superior con Temporizador Fijo -->
        <div class="glass p-4 rounded-2xl border border-rose-500/40 bg-black/60 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-40 shadow-xl">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⏱️</span>
            <div>
              <span class="text-[10px] mono text-gray-400 uppercase tracking-wider block">TIEMPO RESTANTE DE EXAMEN</span>
              <div id="examTimerDigits" class="display text-2xl font-bold mono text-rose-300" aria-live="polite" aria-atomic="true">
                ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          <div class="flex-1 max-w-md">
            <div class="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div id="examTimerProgressBar" class="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-1000" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-label="Progreso del examen" style="width: 100%;"></div>
            </div>
          </div>

          <button id="btnSubmitTimedExam" class="btn px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg" type="button" aria-label="Entregar examen clínico">
            📜 Entregar Examen
          </button>
        </div>

        <!-- Contenido del Caso Asignado -->
        <div class="glass p-6 sm:p-8 rounded-3xl border border-[var(--border)] space-y-6">
          <div class="border-b border-white/10 pb-3">
            <span class="badge-tag bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs">EXAMEN OFICIAL</span>
            <h3 class="display text-xl font-bold text-white mt-1 m-0">${c.code}: ${c.title}</h3>
          </div>

          <!-- 1. Historia Clínica & Constantes -->
          <div class="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-3 text-xs">
            <b class="text-amber-300 mono uppercase block">1. Anamnesis & Constantes Fisiológicas:</b>
            <div class="text-gray-300 space-y-1">
              <div><b>Paciente:</b> ${c.anamnesis.patient}</div>
              <div><b>Motivo / Historia:</b> ${c.anamnesis.history}</div>
              <div><b>Signos Clínicos:</b> ${c.anamnesis.symptoms}</div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              ${Object.keys(c.anamnesis.vitals).map(vk => `
                <div class="p-2 rounded-lg bg-black/60 border border-white/5">
                  <span class="text-[9px] text-gray-400 uppercase block">${vk}</span>
                  <b class="mono text-white text-xs">${c.anamnesis.vitals[vk]}</b>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 2. Laboratorio -->
          <div class="p-5 rounded-2xl bg-black/50 border border-blue-500/20 space-y-2 text-xs">
            <b class="text-blue-300 mono uppercase block">2. Pruebas Complementarias:</b>
            <div class="grid sm:grid-cols-3 gap-2">
              ${Object.keys(c.labFindings).map(lk => `
                <div class="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-0.5">
                  <span class="text-[10px] text-blue-400 font-bold uppercase mono block">${lk}</span>
                  <span class="text-[11px] text-gray-200">${c.labFindings[lk]}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 3. Hipótesis -->
          <div class="p-5 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-3 text-xs">
            <b class="text-emerald-300 mono uppercase block">3. Diagnóstico Definitivo (Selecciona):</b>
            <div class="space-y-2">
              ${c.hypotheses.map(h => `
                <label class="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 cursor-pointer">
                  <input type="radio" name="timedHypo" value="${h.id}" class="accent-emerald-400 mt-0.5" ${this.studentAnswers.selectedHypothesis === h.id ? 'checked' : ''}>
                  <b class="text-gray-200">${h.label}</b>
                </label>
              `).join("")}
            </div>
          </div>

          <!-- 4. Tratamiento -->
          <div class="p-5 rounded-2xl bg-black/50 border border-purple-500/20 space-y-3 text-xs">
            <b class="text-purple-300 mono uppercase block">4. Protocolo Terapéutico:</b>
            <p class="text-gray-300">${c.treatmentQuestions[0].question}</p>
            <div class="space-y-2">
              ${c.treatmentQuestions[0].options.map(opt => `
                <label class="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 cursor-pointer">
                  <input type="radio" name="timedTreat" value="${opt.id}" class="accent-purple-400 mt-0.5" ${this.studentAnswers.selectedTreatmentOpt === opt.id ? 'checked' : ''}>
                  <span class="text-gray-200">${opt.text}</span>
                </label>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll("input[name='timedHypo']").forEach(r => {
      r.onchange = (e) => { this.studentAnswers.selectedHypothesis = e.target.value; };
    });

    this.container.querySelectorAll("input[name='timedTreat']").forEach(r => {
      r.onchange = (e) => { this.studentAnswers.selectedTreatmentOpt = e.target.value; };
    });

    const btnSubmit = this.container.querySelector("#btnSubmitTimedExam");
    if (btnSubmit) {
      btnSubmit.onclick = () => this.submitExam();
    }
  }

  submitExam() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.examState = "submitted";

    const c = this.activeCase;
    let score = 0;

    const correctHypo = c?.hypotheses?.find(h => h.isCorrect);
    const selectedHypothesis = this.studentAnswers?.selectedHypothesis;
    if (selectedHypothesis && correctHypo && selectedHypothesis === correctHypo.id) {
      score += 50;
    }

    const correctTreat = c?.treatmentQuestions?.[0]?.options?.find(opt => opt.isCorrect);
    const selectedTreatment = this.studentAnswers?.selectedTreatmentOpt;
    if (selectedTreatment && correctTreat && selectedTreatment === correctTreat.id) {
      score += 50;
    }

    this.finalScore = score;
    achievements.recordTimedExam(score);
    this.render();
  }

  renderExamResults() {
    const passed = this.finalScore >= 70;
    const c = this.activeCase;

    this.container.innerHTML = `
      <div class="glass p-8 rounded-3xl border ${passed ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-rose-500/50 bg-rose-950/30'} max-w-2xl mx-auto text-center space-y-6 shadow-2xl">
        <div class="w-16 h-16 rounded-2xl ${passed ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-rose-500/20 border-rose-500/40'} border flex items-center justify-center text-3xl mx-auto shadow-inner">
          ${passed ? '🎉' : '❌'}
        </div>

        <div>
          <span class="mono text-xs uppercase tracking-wider text-gray-400 block">DICTAMEN FINAL DEL JURADO</span>
          <h2 class="display text-3xl font-extrabold text-white mt-1 m-0">
            ${passed ? '¡EXAMEN APROBADO CON ÉXITO!' : 'EXAMEN NO APROBADO'}
          </h2>
          <div class="display text-5xl font-black ${passed ? 'text-emerald-400' : 'text-rose-400'} mt-3">
            ${this.finalScore} / 100
          </div>
        </div>

        <div class="p-4 rounded-xl bg-black/60 border border-white/10 text-xs text-gray-200 text-left space-y-1.5">
          <div><b>Caso evaluado:</b> ${c.code} (${c.title})</div>
          <div><b>Tiempo empleado:</b> ${Math.floor((this.durationSeconds - this.timeRemaining) / 60)} min ${(this.durationSeconds - this.timeRemaining) % 60} seg</div>
          <div><b>Estado:</b> ${passed ? 'Acreditación Universitaria Concedida' : 'Requiere refuerzo en semiología y terapéutica'}</div>
        </div>

        <div class="pt-2 flex justify-center gap-3">
          <button id="btnTryAnotherExam" class="btn px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg">
            🔄 Presentar Nuevo Caso al Azar
          </button>
        </div>
      </div>
    `;

    const btn = this.container.querySelector("#btnTryAnotherExam");
    if (btn) {
      btn.onclick = () => {
        const shouldReset = typeof window !== "undefined" && typeof window.confirm === "function"
          ? window.confirm("¿Quieres iniciar otro examen? Se perderá el resultado actual y se cargará un caso nuevo.")
          : true;

        if (!shouldReset) return;

        this.examState = "idle";
        this.finalScore = 0;
        this.render();
      };
    }
  }
}
