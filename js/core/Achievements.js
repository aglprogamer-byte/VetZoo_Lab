/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Core: Achievements.js — Motor de Gamificación, XP, Rangos & Logros
 *
 * Sistema transversal que recompensa el progreso del estudiante con
 * experiencia, rangos académicos, logros desbloqueables y rachas diarias.
 */

// ─── Definiciones de Rangos Académicos ────────────────────────────────
export const ACADEMIC_RANKS = [
  { id: "practicante",  label: "Practicante",   minXP: 0,     icon: "🐣", color: "#9ca3af" },
  { id: "interno",      label: "Interno",        minXP: 500,   icon: "🩺", color: "#60a5fa" },
  { id: "residente",    label: "Residente",      minXP: 2000,  icon: "🔬", color: "#a78bfa" },
  { id: "especialista", label: "Especialista",   minXP: 5000,  icon: "🏅", color: "#fbbf24" },
  { id: "diplomado",    label: "Diplomado",      minXP: 10000, icon: "🎓", color: "#34d399" },
  { id: "maestro",      label: "Maestro Clínico",minXP: 20000, icon: "👑", color: "#f472b6" }
];

// ─── Definiciones de Logros ───────────────────────────────────────────
export const ACHIEVEMENTS = [
  // Casos Clínicos
  { id: "first_case",       category: "casos",     label: "Primer Diagnóstico",     desc: "Resolver tu primer caso clínico",                    icon: "🏥", xpReward: 50 },
  { id: "five_cases",       category: "casos",     label: "Clínico Competente",     desc: "Resolver 5 casos clínicos",                          icon: "⭐", xpReward: 150 },
  { id: "perfect_case",     category: "casos",     label: "Diagnóstico Perfecto",   desc: "Obtener 100/100 en un caso clínico",                 icon: "💯", xpReward: 300 },
  { id: "all_cases",        category: "casos",     label: "Clínico Máximo",         desc: "Resolver todos los casos disponibles",                icon: "🏆", xpReward: 500 },

  // Pastos & Fertilizantes
  { id: "first_fert",       category: "pastos",    label: "Agrónomo Novato",        desc: "Aplicar tu primer fertilizante",                      icon: "🌱", xpReward: 30 },
  { id: "all_ferts",        category: "pastos",    label: "Agrónomo Experto",       desc: "Probar los 7 fertilizantes del catálogo",             icon: "🧪", xpReward: 200 },
  { id: "excellent_fert",   category: "pastos",    label: "Reacción Excelente",     desc: "Lograr respuesta 'Excelente' en fertilización",       icon: "🌿", xpReward: 75 },

  // Diagnóstico
  { id: "first_hemogram",   category: "diagnostico", label: "Primer Hemograma",    desc: "Realizar tu primer análisis hematológico",            icon: "🔬", xpReward: 40 },
  { id: "five_hemograms",   category: "diagnostico", label: "Hematólogo",          desc: "Realizar 5 hemogramas completos",                     icon: "🩸", xpReward: 150 },
  { id: "first_mcmaster",   category: "diagnostico", label: "Parasitólogo",        desc: "Realizar tu primer conteo McMaster",                  icon: "🦠", xpReward: 50 },

  // Calculadoras
  { id: "first_calc",       category: "calculadoras", label: "Calculista Clínico", desc: "Usar tu primera calculadora veterinaria",             icon: "📐", xpReward: 25 },
  { id: "ten_calcs",        category: "calculadoras", label: "Precisión Matemática",desc: "Realizar 10 cálculos clínicos",                      icon: "🎯", xpReward: 120 },

  // Parásitos
  { id: "first_parasite",   category: "parasitos",  label: "Ojo Clínico",          desc: "Identificar tu primer parásito en el microscopio",    icon: "👁️", xpReward: 40 },
  { id: "all_parasites",    category: "parasitos",  label: "Maestro Parasitólogo", desc: "Identificar todas las especies parasitarias",         icon: "🏅", xpReward: 400 },

  // BCS
  { id: "first_bcs",        category: "bcs",       label: "Evaluador de Campo",    desc: "Completar tu primera evaluación de BCS",              icon: "🐄", xpReward: 35 },
  { id: "perfect_bcs",      category: "bcs",       label: "Ojo Experto",           desc: "Acertar 10 evaluaciones de BCS consecutivas",         icon: "🎯", xpReward: 250 },

  // Examen
  { id: "first_timed",      category: "examen",    label: "Bajo Presión",          desc: "Completar tu primer examen cronometrado",             icon: "⏱️", xpReward: 100 },
  { id: "timed_pass",       category: "examen",    label: "Nervios de Acero",      desc: "Aprobar un examen cronometrado con ≥80 pts",          icon: "🧊", xpReward: 300 },

  // Cuaderno
  { id: "first_note",       category: "cuaderno",  label: "Buen Observador",       desc: "Crear tu primera nota de campo",                     icon: "📓", xpReward: 20 },
  { id: "ten_notes",        category: "cuaderno",  label: "Cronista Veterinario",  desc: "Registrar 10 entradas en el cuaderno de campo",       icon: "📖", xpReward: 100 },

  // Plantas Tóxicas
  { id: "first_plant_quiz", category: "plantas",   label: "Botánico Clínico",      desc: "Resolver tu primer quiz de plantas tóxicas",          icon: "🌿", xpReward: 40 },
  { id: "all_plant_quizzes",category: "plantas",   label: "Toxicólogo Vegetal",    desc: "Resolver todos los quiz de plantas tóxicas",          icon: "☠️", xpReward: 250 },

  // Racha
  { id: "streak_3",         category: "racha",     label: "Constancia",            desc: "Estudiar 3 días seguidos",                           icon: "🔥", xpReward: 75 },
  { id: "streak_7",         category: "racha",     label: "Semana Académica",      desc: "Estudiar 7 días seguidos",                           icon: "💪", xpReward: 200 },
  { id: "streak_30",        category: "racha",     label: "Disciplina de Hierro",  desc: "Estudiar 30 días seguidos",                          icon: "🏆", xpReward: 1000 },

  // Sanitario
  { id: "first_calendar",   category: "sanitario", label: "Planificador",          desc: "Crear tu primer cronograma sanitario",               icon: "📋", xpReward: 50 },

  // Tiempos de Retiro
  { id: "first_withdrawal", category: "retiro",    label: "Inocuidad Alimentaria", desc: "Consultar tu primer tiempo de retiro",               icon: "💉", xpReward: 30 },
];

// ─── Tabla de XP por acción ───────────────────────────────────────────
export const XP_ACTIONS = {
  CASE_SOLVED:       60,
  CASE_PERFECT:      120,
  HEMOGRAM_DONE:     25,
  MCMASTER_DONE:     30,
  CALCULATOR_USED:   15,
  FERTILIZER_APPLIED:20,
  FERTILIZER_EXCEL:  40,
  PARASITE_ID:       20,
  BCS_CORRECT:       15,
  BCS_PERFECT_RUN:   80,
  TIMED_EXAM_DONE:   50,
  TIMED_EXAM_PASS:   100,
  FIELD_NOTE_ADDED:  10,
  PLANT_QUIZ_CORRECT:25,
  CALENDAR_CREATED:  30,
  WITHDRAWAL_CHECK:  10,
  DAILY_LOGIN:       10,
};

const STORAGE_KEY = "vetzoo_achievements";

export class AchievementEngine {
  constructor() {
    this.data = this._load();
    this._checkDailyStreak();
    this._listeners = [];
  }

  // ─── Persistencia ─────────────────────────────────────────────────
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }

    return {
      totalXP: 0,
      unlockedAchievements: [],   // array of achievement ids
      counters: {},               // e.g. { cases_solved: 3, hemograms_done: 5 }
      streak: {
        current: 0,
        best: 0,
        lastLoginDate: null,      // "YYYY-MM-DD"
        history: []               // last 30 dates
      },
      history: []                 // { action, xp, date, detail }
    };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) { /* ignore */ }
  }

  // ─── Suscripción a Eventos ─────────────────────────────────────────
  on(callback) {
    this._listeners.push(callback);
    return () => { this._listeners = this._listeners.filter(l => l !== callback); };
  }

  _emit(eventType, payload) {
    this._listeners.forEach(fn => {
      try { fn(eventType, payload); } catch (e) { /* ignore */ }
    });
  }

  // ─── XP & Contadores ──────────────────────────────────────────────
  addXP(amount, action = "generic", detail = "") {
    this.data.totalXP += amount;
    this.data.history.unshift({
      action,
      xp: amount,
      date: new Date().toISOString(),
      detail
    });

    // Limitar historial a 200 entradas
    if (this.data.history.length > 200) this.data.history.length = 200;

    this._save();
    this._emit("xp_gained", { amount, total: this.data.totalXP, action, detail });

    // Verificar cambio de rango
    const newRank = this.getCurrentRank();
    const prevRank = this._getPreviousRank(this.data.totalXP - amount);
    if (newRank.id !== prevRank.id) {
      this._emit("rank_up", { rank: newRank, previousRank: prevRank });
    }
  }

  incrementCounter(key, amount = 1) {
    if (!this.data.counters[key]) this.data.counters[key] = 0;
    this.data.counters[key] += amount;
    this._save();
    return this.data.counters[key];
  }

  getCounter(key) {
    return this.data.counters[key] || 0;
  }

  // ─── Logros ────────────────────────────────────────────────────────
  tryUnlockAchievement(achievementId) {
    if (this.data.unlockedAchievements.includes(achievementId)) return false;

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return false;

    this.data.unlockedAchievements.push(achievementId);
    this.addXP(achievement.xpReward, "achievement", achievement.label);
    this._save();
    this._emit("achievement_unlocked", { achievement });
    return true;
  }

  isUnlocked(achievementId) {
    return this.data.unlockedAchievements.includes(achievementId);
  }

  getUnlockedAchievements() {
    return ACHIEVEMENTS.filter(a => this.data.unlockedAchievements.includes(a.id));
  }

  getLockedAchievements() {
    return ACHIEVEMENTS.filter(a => !this.data.unlockedAchievements.includes(a.id));
  }

  // ─── Rangos ────────────────────────────────────────────────────────
  getCurrentRank() {
    return this._getRankForXP(this.data.totalXP);
  }

  getNextRank() {
    const current = this.getCurrentRank();
    const idx = ACADEMIC_RANKS.findIndex(r => r.id === current.id);
    return idx < ACADEMIC_RANKS.length - 1 ? ACADEMIC_RANKS[idx + 1] : null;
  }

  getProgressToNextRank() {
    const current = this.getCurrentRank();
    const next = this.getNextRank();
    if (!next) return { percent: 100, xpNeeded: 0, xpCurrent: this.data.totalXP };

    const rangeTotal = next.minXP - current.minXP;
    const rangeCurrent = this.data.totalXP - current.minXP;
    return {
      percent: Math.min(100, Math.round((rangeCurrent / rangeTotal) * 100)),
      xpNeeded: next.minXP - this.data.totalXP,
      xpCurrent: this.data.totalXP
    };
  }

  _getRankForXP(xp) {
    let rank = ACADEMIC_RANKS[0];
    for (const r of ACADEMIC_RANKS) {
      if (xp >= r.minXP) rank = r;
    }
    return rank;
  }

  _getPreviousRank(xp) {
    return this._getRankForXP(xp);
  }

  // ─── Racha Diaria ──────────────────────────────────────────────────
  _checkDailyStreak() {
    const today = new Date().toISOString().split("T")[0];
    const last = this.data.streak.lastLoginDate;

    if (last === today) return; // Ya se registró hoy

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (last === yesterday) {
      // Racha continúa
      this.data.streak.current += 1;
    } else if (last !== today) {
      // Racha rota
      this.data.streak.current = 1;
    }

    this.data.streak.lastLoginDate = today;
    if (this.data.streak.current > this.data.streak.best) {
      this.data.streak.best = this.data.streak.current;
    }

    // Registrar en historial (últimos 60 días)
    if (!this.data.streak.history.includes(today)) {
      this.data.streak.history.push(today);
      if (this.data.streak.history.length > 60) this.data.streak.history.shift();
    }

    // XP por login diario
    this.addXP(XP_ACTIONS.DAILY_LOGIN, "daily_login", `Día ${this.data.streak.current} de racha`);

    // Logros de racha
    if (this.data.streak.current >= 3)  this.tryUnlockAchievement("streak_3");
    if (this.data.streak.current >= 7)  this.tryUnlockAchievement("streak_7");
    if (this.data.streak.current >= 30) this.tryUnlockAchievement("streak_30");

    this._save();
  }

  getStreak() {
    return { ...this.data.streak };
  }

  // ─── Acciones de Alto Nivel ─────────────────────────────────────────
  // Llamar desde cada módulo cuando ocurra la acción
  recordCaseSolved(score, caseId) {
    this.addXP(XP_ACTIONS.CASE_SOLVED, "case_solved", caseId);
    const count = this.incrementCounter("cases_solved");

    if (count >= 1) this.tryUnlockAchievement("first_case");
    if (count >= 5) this.tryUnlockAchievement("five_cases");

    if (score >= 100) {
      this.addXP(XP_ACTIONS.CASE_PERFECT - XP_ACTIONS.CASE_SOLVED, "case_perfect", caseId);
      this.tryUnlockAchievement("perfect_case");
    }
  }

  recordHemogram() {
    this.addXP(XP_ACTIONS.HEMOGRAM_DONE, "hemogram", "Hemograma completo");
    const count = this.incrementCounter("hemograms_done");
    if (count >= 1) this.tryUnlockAchievement("first_hemogram");
    if (count >= 5) this.tryUnlockAchievement("five_hemograms");
  }

  recordMcMaster() {
    this.addXP(XP_ACTIONS.MCMASTER_DONE, "mcmaster", "Conteo McMaster");
    this.incrementCounter("mcmaster_done");
    this.tryUnlockAchievement("first_mcmaster");
  }

  recordCalculation(calcName) {
    this.addXP(XP_ACTIONS.CALCULATOR_USED, "calculator", calcName);
    const count = this.incrementCounter("calculations_done");
    if (count >= 1)  this.tryUnlockAchievement("first_calc");
    if (count >= 10) this.tryUnlockAchievement("ten_calcs");
  }

  recordFertilizer(fertName, verdict) {
    this.addXP(XP_ACTIONS.FERTILIZER_APPLIED, "fertilizer", fertName);
    this.incrementCounter("fertilizers_applied");
    this.incrementCounter(`fert_${fertName}`);
    this.tryUnlockAchievement("first_fert");

    if (verdict === "excelente") {
      this.addXP(XP_ACTIONS.FERTILIZER_EXCEL - XP_ACTIONS.FERTILIZER_APPLIED, "fert_excellent", fertName);
      this.tryUnlockAchievement("excellent_fert");
    }

    // Verificar si probó los 7
    const uniqueFerts = Object.keys(this.data.counters).filter(k => k.startsWith("fert_")).length;
    if (uniqueFerts >= 7) this.tryUnlockAchievement("all_ferts");
  }

  recordParasiteIdentified(parasiteName) {
    this.addXP(XP_ACTIONS.PARASITE_ID, "parasite_id", parasiteName);
    this.incrementCounter("parasites_identified");
    this.incrementCounter(`parasite_${parasiteName}`);
    this.tryUnlockAchievement("first_parasite");
  }

  recordBCSEvaluation(correct) {
    if (correct) {
      this.addXP(XP_ACTIONS.BCS_CORRECT, "bcs_correct", "BCS acertado");
      this.incrementCounter("bcs_correct");
    }
    this.incrementCounter("bcs_total");
    this.tryUnlockAchievement("first_bcs");
  }

  recordTimedExam(score) {
    this.addXP(XP_ACTIONS.TIMED_EXAM_DONE, "timed_exam", `Puntuación: ${score}`);
    this.incrementCounter("timed_exams_done");
    this.tryUnlockAchievement("first_timed");

    if (score >= 80) {
      this.addXP(XP_ACTIONS.TIMED_EXAM_PASS - XP_ACTIONS.TIMED_EXAM_DONE, "timed_pass", `Aprobado: ${score}`);
      this.tryUnlockAchievement("timed_pass");
    }
  }

  recordFieldNote() {
    this.addXP(XP_ACTIONS.FIELD_NOTE_ADDED, "field_note", "Nota de campo");
    const count = this.incrementCounter("field_notes_added");
    if (count >= 1)  this.tryUnlockAchievement("first_note");
    if (count >= 10) this.tryUnlockAchievement("ten_notes");
  }

  recordPlantQuiz(correct) {
    if (correct) {
      this.addXP(XP_ACTIONS.PLANT_QUIZ_CORRECT, "plant_quiz", "Quiz correcto");
      this.incrementCounter("plant_quizzes_correct");
    }
    this.tryUnlockAchievement("first_plant_quiz");
  }

  recordCalendarCreated() {
    this.addXP(XP_ACTIONS.CALENDAR_CREATED, "calendar", "Cronograma creado");
    this.tryUnlockAchievement("first_calendar");
  }

  recordWithdrawalCheck() {
    this.addXP(XP_ACTIONS.WITHDRAWAL_CHECK, "withdrawal", "Retiro consultado");
    this.tryUnlockAchievement("first_withdrawal");
  }

  // ─── Resumen para UI ───────────────────────────────────────────────
  getSummary() {
    const rank = this.getCurrentRank();
    const next = this.getNextRank();
    const progress = this.getProgressToNextRank();
    const streak = this.getStreak();
    const unlocked = this.getUnlockedAchievements();

    return {
      totalXP: this.data.totalXP,
      rank,
      nextRank: next,
      progress,
      streak,
      unlockedCount: unlocked.length,
      totalAchievements: ACHIEVEMENTS.length,
      recentHistory: this.data.history.slice(0, 10)
    };
  }
}

// ─── Instancia Singleton ─────────────────────────────────────────────
export const achievements = new AchievementEngine();
