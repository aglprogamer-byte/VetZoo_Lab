/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Core: Store.js - Estado Centralizado con Patrón Action Dispatcher (Flux / Redux-like)
 */

export const ACTION_TYPES = {
  SET_ZONE: "SET_ZONE",
  SELECT_ANIMAL: "SELECT_ANIMAL",
  UPDATE_ANIMAL: "UPDATE_ANIMAL",
  UPDATE_DIET: "UPDATE_DIET",
  SERVE_RATION: "SERVE_RATION",
  EXECUTE_PROCEDURE: "EXECUTE_PROCEDURE",
  ROTATE_PASTURE: "ROTATE_PASTURE",
  ADVANCE_TIME: "ADVANCE_TIME",
  SELECT_CASE_HYPOTHESIS: "SELECT_CASE_HYPOTHESIS",
  SAVE_ACADEMIC_REPORT: "SAVE_ACADEMIC_REPORT",
  NAVIGATE_TAB: "NAVIGATE_TAB",
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL"
};

const STORAGE_KEY = "zootecnia3d_student_data";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeAcademicProgress(value) {
  const fallback = {
    studentName: "Estudiante Universitario",
    university: "Facultad de Zootecnia & Medicina Veterinaria",
    level: "Nivel I: Prácticas Integradas",
    scores: {
      nutricion: 75,
      semiologia: 70,
      clinica: 80,
      pastos: 60,
      economia: 65
    },
    completedPractices: [],
    caseReports: []
  };

  if (!isObject(value)) return fallback;

  const scores = isObject(value.scores) ? value.scores : {};
  const normalizedScores = { ...fallback.scores };
  Object.entries(scores).forEach(([key, num]) => {
    if (typeof num === "number" && Number.isFinite(num)) {
      normalizedScores[key] = Math.min(100, Math.max(0, num));
    }
  });

  return {
    studentName: typeof value.studentName === "string" ? value.studentName.slice(0, 120) : fallback.studentName,
    university: typeof value.university === "string" ? value.university.slice(0, 200) : fallback.university,
    level: typeof value.level === "string" ? value.level.slice(0, 120) : fallback.level,
    scores: normalizedScores,
    completedPractices: Array.isArray(value.completedPractices)
      ? value.completedPractices.filter(item => typeof item === "string").slice(0, 200)
      : [],
    caseReports: Array.isArray(value.caseReports)
      ? value.caseReports.filter(item => isObject(item)).slice(0, 200)
      : []
  };
}

export class Store {
  constructor(initialState = {}) {
    this.listeners = new Map();
    this.state = this.getInitialState(initialState);
  }

  getInitialState(custom = {}) {
    return {
      day: 1,
      hour: 8,
      season: "Primavera / Época de lluvias",
      currentZone: "overview",
      selectedAnimalId: "cow_017",
      activeTab: "tab-overview",
      activeModal: null, // "animal_card", "student_profile", or null

      finances: {
        budget: 15000.0,
        dailyFeedCost: 0,
        dailyRevenue: 0,
        netProfitHistory: []
      },

      diets: {
        vaca: { maiz: 35, soya: 25, ensilaje: 30, heno: 5, nuc: 5 },
        caballo: { maiz: 15, soya: 10, ensilaje: 0, heno: 70, nuc: 5 },
        oveja: { maiz: 20, soya: 15, ensilaje: 20, heno: 40, nuc: 5 },
        cerdo: { maiz: 55, soya: 35, ensilaje: 0, heno: 0, nuc: 10 }
      },

      animals: {
        cow_017: {
          id: "cow_017",
          tag: "VACA #017",
          name: "Margarita",
          species: "vaca",
          breed: "Holstein Friesian",
          sex: "Hembra",
          ageMonths: 42,
          weight: 525.0,
          bcs: 3.25,
          health: 96,
          stress: 15,
          hydration: 95,
          reproductiveStatus: "En lactancia (2° tercio)",
          milkProduction: 23.5,
          targetMilk: 24.0,
          fcr: 1.35,
          vitals: {
            temp: 38.6,
            heartRate: 68,
            respRate: 24,
            rumenMotility: 2.5,
            mucousMembranes: "Rosadas y húmedas",
            capillaryRefill: 1.5,
            feces: "Pastosas, consistencia fisiológica (Grado 3)"
          },
          history: [
            { day: 1, type: "Ingreso", desc: "Inicio de ciclo productivo. Control de peso 525 kg." }
          ]
        },

        horse_004: {
          id: "horse_004",
          tag: "EQUINO #004",
          name: "Relámpago",
          species: "caballo",
          breed: "Criollo / Cuarto de Milla",
          sex: "Macho castrado",
          ageMonths: 60,
          weight: 460.0,
          bcs: 3.5,
          health: 98,
          stress: 10,
          hydration: 98,
          reproductiveStatus: "Mantenimiento / Trabajo",
          milkProduction: 0,
          targetMilk: 0,
          fcr: 0,
          vitals: {
            temp: 37.8,
            heartRate: 36,
            respRate: 14,
            rumenMotility: 0,
            mucousMembranes: "Rosadas brillantes",
            capillaryRefill: 1.2,
            feces: "Bolos formados húmedos normales"
          },
          history: [
            { day: 1, type: "Examen", desc: "Plan sanitario al día. Vacunación antitetánica vigente." }
          ]
        },

        sheep_031: {
          id: "sheep_031",
          tag: "OVINO #031",
          name: "Blanquita",
          species: "oveja",
          breed: "Hampshire Down",
          sex: "Hembra",
          ageMonths: 24,
          weight: 46.0,
          bcs: 3.0,
          health: 92,
          stress: 20,
          hydration: 92,
          reproductiveStatus: "Gestación temprana (Día 45)",
          milkProduction: 0,
          targetMilk: 0,
          fcr: 3.4,
          vitals: {
            temp: 39.1,
            heartRate: 76,
            respRate: 22,
            rumenMotility: 2.0,
            mucousMembranes: "Rosadas pálidas normales",
            capillaryRefill: 1.6,
            feces: "Pelotas ovinas normales"
          },
          history: [
            { day: 1, type: "Manejo", desc: "Confirmación de gestación por ecografía." }
          ]
        },

        pig_088: {
          id: "pig_088",
          tag: "PORCINO #088",
          name: "Tomy",
          species: "cerdo",
          breed: "Landrace x Duroc",
          sex: "Macho",
          ageMonths: 4,
          weight: 36.5,
          bcs: 3.25,
          health: 95,
          stress: 15,
          hydration: 96,
          reproductiveStatus: "Etapa de Crecimiento / Engorde",
          milkProduction: 0,
          targetMilk: 0,
          fcr: 2.65,
          vitals: {
            temp: 39.2,
            heartRate: 82,
            respRate: 26,
            rumenMotility: 0,
            mucousMembranes: "Rosadas claras",
            capillaryRefill: 1.4,
            feces: "Cilíndricas normales"
          },
          history: [
            { day: 1, type: "Pesaje", desc: "Ingreso al lote de engorde. Peso inicial 36.5 kg." }
          ]
        }
      },

      pasture: {
        totalAreaHa: 12.0,
        paddocksCount: 6,
        currentPaddock: 1,
        forageSpecies: "Brachiaria decumbens + Trébol blanco",
        forageHeightCm: 32,
        dryMatterKgPerHa: 2800,
        stockingRateUGM: 1.8,
        grazingDays: 4,
        restDays: 28
      },

      academic: this.loadStudentProgress(),
      ...custom
    };
  }

  loadStudentProgress() {
    try {
      if (typeof window !== "undefined" && "localStorage" in window) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (!saved) return sanitizeAcademicProgress(null);

        const parsed = JSON.parse(saved);
        return sanitizeAcademicProgress(parsed);
      }
    } catch (e) {
      console.warn("Store: no se pudo recuperar el progreso académico. Se reutiliza el valor por defecto.", e);
    }

    return sanitizeAcademicProgress(null);
  }

  saveStudentProgress() {
    try {
      if (typeof window !== "undefined" && "localStorage" in window) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.academic));
      }
    } catch (e) {
      console.warn("Store: no se pudo guardar el progreso académico. El estado sigue vivo en memoria.", e);
    }
    this.emit("academic:updated", this.state.academic);
  }

  /**
   * Dispatcher central de Acciones (Single State Mutator)
   */
  dispatch(actionType, payload = {}) {
    const prevState = this.state;
    const nextState = this.reduce(prevState, actionType, payload);
    this.state = nextState;

    this.emit("action", { type: actionType, payload, prevState, nextState });
    this.emit(`action:${actionType}`, payload);
    return nextState;
  }

  reduce(state, actionType, payload) {
    switch (actionType) {
      case ACTION_TYPES.SET_ZONE:
        return { ...state, currentZone: payload.zoneId };

      case ACTION_TYPES.SELECT_ANIMAL:
        return { ...state, selectedAnimalId: payload.animalId };

      case ACTION_TYPES.UPDATE_ANIMAL: {
        const { animalId, patch } = payload;
        const animal = state.animals[animalId];
        if (!animal) return state;
        return {
          ...state,
          animals: {
            ...state.animals,
            [animalId]: { ...animal, ...patch }
          }
        };
      }

      case ACTION_TYPES.UPDATE_DIET: {
        const { species, diet } = payload;
        return {
          ...state,
          diets: {
            ...state.diets,
            [species]: { ...diet }
          }
        };
      }

      case ACTION_TYPES.ROTATE_PASTURE: {
        const cur = state.pasture.currentPaddock;
        const total = state.pasture.paddocksCount;
        const next = cur >= total ? 1 : cur + 1;
        return {
          ...state,
          pasture: {
            ...state.pasture,
            currentPaddock: next
          }
        };
      }

      case ACTION_TYPES.NAVIGATE_TAB:
        return { ...state, activeTab: payload.tabId };

      case ACTION_TYPES.OPEN_MODAL:
        return { ...state, activeModal: payload.modalName, modalData: payload.data || null };

      case ACTION_TYPES.CLOSE_MODAL:
        return { ...state, activeModal: null, modalData: null };

      default:
        return state;
    }
  }

  getState() {
    return this.state;
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.emit(`change:${key}`, value);
    this.emit("state:changed", this.state);
    if (key === "currentZone") this.dispatch(ACTION_TYPES.SET_ZONE, { zoneId: value });
    else if (key === "selectedAnimalId") this.dispatch(ACTION_TYPES.SELECT_ANIMAL, { animalId: value });
    else if (key === "activeTab") this.dispatch(ACTION_TYPES.NAVIGATE_TAB, { tabId: value });
  }

  updateAnimal(id, patch) {
    this.dispatch(ACTION_TYPES.UPDATE_ANIMAL, { animalId: id, patch });
    this.emit(`animal:updated:${id}`, this.state.animals[id]);
    this.emit("animal:updated", this.state.animals[id]);
  }

  getSelectedAnimal() {
    return this.state.animals[this.state.selectedAnimalId];
  }

  subscribe(callback) {
    return this.on("action", callback);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const list = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, list);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[Store] Error en listener de '${event}':`, err);
        }
      });
    }
  }
}

export const store = new Store();
