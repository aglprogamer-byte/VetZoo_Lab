/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: ClinicalLab.js - Simulador Clínico, Farmacopea Científica (DCI), Punción Tisular
 * y Generador de Casos Clínicos Universitarios en Vivo
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { simEngine, AudioFx } from "../core/SimEngine.js";

/**
 * Farmacopea Veterinaria Científica Oficial (DCI / Principios Activos Reales)
 */
export const PHARMACOPEIA = [
  {
    id: "flunixin",
    name: "Flunixin Meglumina",
    concentration: 50, // mg/mL
    unit: "mg/mL",
    class: "AINE (Antiinflamatorio no esteroideo / Analgésico visceral)",
    indication: "Cólico equino, dolor visceral, mastitis hiperaguda y endotoxemias en bovinos.",
    allowedRoutes: ["IV", "IM"],
    preferredRoute: "IV",
    recommendedDose: { mgPerKg: 1.1, label: "1.1 a 2.2 mg/kg" },
    allowedNeedles: ["18G", "16G"],
    preferredSites: ["Vena yugular (Tercio medio)", "Tabla del cuello (IM profunda)"],
    withdrawalMeat: 4, // días
    withdrawalMilk: 36, // horas
    warning: "La vía IV debe administrarse lentamente. En caballos la inyección intraarterial accidental causa convulsiones y colapso."
  },
  {
    id: "oxytetracycline_la",
    name: "Oxitetraciclina L.A.",
    concentration: 200, // mg/mL
    unit: "mg/mL",
    class: "Antibiótico bacteriostático de amplio espectro (Tetraciclina L.A.)",
    indication: "Complejo respiratorio bovino (neumonías), anaplasmosis, pododermatitis infecciosa (pedero) y queratoconjuntivitis.",
    allowedRoutes: ["IM", "SC"],
    preferredRoute: "IM",
    recommendedDose: { mgPerKg: 20.0, label: "20 mg/kg (1 mL / 10 kg PV)" },
    allowedNeedles: ["16G", "18G"],
    preferredSites: ["Tabla del cuello (IM profunda fraccionada, máx 15 mL por punto)"],
    withdrawalMeat: 28,
    withdrawalMilk: 7,
    warning: "Formulación oleosa muy irritante. Fraccionar si el volumen supera los 15 mL por punto de inyección para evitar mionecrosis."
  },
  {
    id: "ivermectin",
    name: "Ivermectina al 1%",
    concentration: 10, // mg/mL
    unit: "mg/mL",
    class: "Antiparasitario endectocida (Lactona macrocíclica / Avermectina)",
    indication: "Control de nematodos gastrointestinales y pulmonares, garrapatas, ácaros de la sarna y miasis cutáneas.",
    allowedRoutes: ["SC"],
    preferredRoute: "SC",
    recommendedDose: { mgPerKg: 0.2, label: "0.2 mg/kg (1 mL / 50 kg PV)" },
    allowedNeedles: ["18G", "20G"],
    preferredSites: ["Pliegue cutáneo de la tabla del cuello o detrás de la escápula"],
    withdrawalMeat: 35,
    withdrawalMilk: null, // Prohibido en hembras en lactación
    warning: "¡PROHIBIDA VÍA IV O IM! Administrar exclusivamente por vía subcutánea estricta."
  },
  {
    id: "penicillin_g",
    name: "Penicilina G Benzatínica + Procaínica",
    concentration: 300000, // UI/mL
    unit: "UI/mL",
    class: "Antibiótico bactericida betalactámico de depósito",
    indication: "Carbunco sintomático (mancha), edema maligno, tétanos, actinomicosis e infecciones por Gram (+).",
    allowedRoutes: ["IM"],
    preferredRoute: "IM",
    recommendedDose: { mgPerKg: 15000, label: "10.000 a 20.000 UI/kg" },
    allowedNeedles: ["16G", "18G"],
    preferredSites: ["Masa muscular profunda de la tabla del cuello"],
    withdrawalMeat: 30,
    withdrawalMilk: 3,
    warning: "¡RIESGO MORTAL SI ENTRA A VÍA IV! La procaína intravascular produce shock neurotóxico y paro cardíaco inmediato. ¡Aspirar siempre el émbolo antes de inyectar!"
  },
  {
    id: "meloxicam",
    name: "Meloxicam",
    concentration: 20, // mg/mL
    unit: "mg/mL",
    class: "AINE preferencial COX-2 (Antiinflamatorio, analgésico y antipirético)",
    indication: "Mastitis aguda, diarreas neonatales (asociado a rehidratación oral), descole y cojeras locomotoras.",
    allowedRoutes: ["SC", "IV"],
    preferredRoute: "SC",
    recommendedDose: { mgPerKg: 0.5, label: "0.5 mg/kg (2.5 mL / 100 kg PV)" },
    allowedNeedles: ["18G", "20G"],
    preferredSites: ["Subcutáneo en tabla del cuello o Vena yugular"],
    withdrawalMeat: 15,
    withdrawalMilk: 5,
    warning: "Excelente perfil de tolerancia gastrointestinal y renal por su selectividad sobre COX-2."
  },
  {
    id: "calcium_gluconate",
    name: "Gluconato de Calcio al 20% + Borogluconato (con Mg y P)",
    concentration: 200, // mg/mL de gluconato
    unit: "mg/mL",
    class: "Solución electrolítica y mineral remineralizante",
    indication: "Hipocalcemia clínica posparto (Paresia puerperal / Fiebre de leche) y tetania hipomagnesémica de los pastos.",
    allowedRoutes: ["IV", "SC"],
    preferredRoute: "IV",
    recommendedDose: { mgPerKg: 1.0, label: "500 mL por vaca adulta (infusión lenta)" },
    allowedNeedles: ["16G", "14G"],
    preferredSites: ["Vena yugular con venoclisis lenta a temperatura corporal (38°C)"],
    withdrawalMeat: 0,
    withdrawalMilk: 0,
    warning: "La infusión IV debe ser lenta (20-30 min) monitorizando auscultación cardíaca; el calcio rápido causa fibrilación y paro cardíaco en sístole."
  },
  {
    id: "tuberculin_ppd",
    name: "Tuberculina PPD Bovina (Derivado Proteico Purificado)",
    concentration: 1, // 1 dosis diagnóstica
    unit: "dosis",
    class: "Reactivo biológico de diagnóstico inmunológico oficial",
    indication: "Diagnóstico oficial de Tuberculosis Bovina por prueba de hipersensibilidad retardada celular (Prueba ano-caudal o cervical).",
    allowedRoutes: ["ID"],
    preferredRoute: "ID",
    recommendedDose: { mgPerKg: 0, label: "0.1 mL exactos por animal" },
    allowedNeedles: ["25G", "26G"],
    preferredSites: ["Pliegue anocaudal interno o tercio medio del cuello (dermis estricta)"],
    withdrawalMeat: 0,
    withdrawalMilk: 0,
    warning: "Debe aplicarse con bisel a 10°-15° hacia arriba en la dermis superficial, produciendo un habón/pápula visible inmediatamente. Lectura oficial a las 72 ± 6 horas con cutímetro."
  },
  {
    id: "ceftiofur",
    name: "Ceftiofur Sódico / Clorhidrato",
    concentration: 50, // mg/mL
    unit: "mg/mL",
    class: "Antibiótico betalactámico (Cefalosporina de 3ra generación)",
    indication: "Enfermedad respiratoria bovina (ERB), pedero necrobacilar y metritis aguda posparto.",
    allowedRoutes: ["SC", "IM"],
    preferredRoute: "SC",
    recommendedDose: { mgPerKg: 1.1, label: "1.1 a 2.2 mg/kg" },
    allowedNeedles: ["18G", "20G"],
    preferredSites: ["Base de la oreja (SC) o Tabla del cuello"],
    withdrawalMeat: 3,
    withdrawalMilk: 0, // Cero horas en leche (ideal para hatos lecheros en ordeño)
    warning: "No posee período de retiro en leche a dosis terapéuticas recomendadas, siendo el antibiótico de elección en lechería especializada."
  }
];

export const VET_ROUTES = {
  ID: {
    id: "ID",
    name: "Intradérmica (ID)",
    targetLayer: "epidermis_dermis",
    layerName: "1. Epidermis y Dermis",
    angleRange: [10, 20],
    depthRange: [1, 4],
    desc: "Inserción superficial con bisel hacia arriba. Forma una pápula/habón dérmico visible. Ideal para diagnóstico (PPD) y vacunas específicas."
  },
  SC: {
    id: "SC",
    name: "Subcutánea (SC)",
    targetLayer: "subcutaneous",
    layerName: "2. Tejido Celular Subcutáneo",
    angleRange: [35, 55],
    depthRange: [6, 16],
    desc: "Inserción en el tejido conectivo laxo y graso. Absorción sostenida. Usada para vacunas, ivermectinas y soluciones isotónicas."
  },
  IM: {
    id: "IM",
    name: "Intramuscular (IM)",
    targetLayer: "muscle",
    layerName: "3. Masa Muscular Profunda",
    angleRange: [75, 90],
    depthRange: [22, 45],
    desc: "Inserción perpendicular en vientre muscular bien irrigado. Absorción rápida y uniforme. Obligatoria aspiración para descartar vaso sanguíneo."
  },
  IV: {
    id: "IV",
    name: "Intravenosa (IV)",
    targetLayer: "vein",
    layerName: "4. Luz Vascular (Vena Yugular)",
    angleRange: [20, 35],
    depthRange: [12, 22],
    desc: "Punción intravascular directa en el surco yugular. Efecto inmediato (biodisponibilidad 100%). Requiere comprobación por reflujo sanguíneo venoso."
  }
};

export const NEEDLE_GAUGES = [
  { gauge: "16G", length: '1 ½"', color: "#d97706", desc: "Gran calibre (1.6 mm) — Fármacos oleosos/viscosos (Oxitetraciclina L.A.) e infusión masiva en bovinos/equinos." },
  { gauge: "18G", length: '1 ½"', color: "#10b981", desc: "Estándar zootécnico (1.2 mm) — Aplicación IM/IV general en rumiantes adultos y caballos." },
  { gauge: "20G", length: '1"',    color: "#3b82f6", desc: "Calibre medio (0.9 mm) — Vía SC en terneros, cerdos de engorde y ovinos." },
  { gauge: "22G", length: '¾"',   color: "#8b5cf6", desc: "Calibre fino (0.7 mm) — Lechones, corderos y fármacos hidrosolubles delicados." },
  { gauge: "25G", length: '⅝"',   color: "#ec4899", desc: "Aguja intradérmica (0.5 mm) — Prueba de Tuberculina PPD y biopsia dérmica." }
];

/**
 * Banco de Casos y Enunciados Clínicos Dinámicos para Estudio
 */
export const CLINICAL_EXAM_CASES = [
  {
    id: "case_flunixin_colic",
    title: "Caso Clínico: Cólico Espasmódico & Endotoxemia en Equino",
    species: "caballo",
    targetAnimalId: "horse_004",
    vignette: "El equino 'Relámpago' (460 kg) presenta sudoración profusa, inquietud, miradas frecuentes a los flancos y frecuencia cardíaca de 64 lpm. Diagnóstico presuntivo: Cólico visceral agudo.",
    targetDrugId: "flunixin",
    targetRoute: "IV",
    expectedNeedle: "18G",
    doseFormula: "460 kg × 1.1 mg/kg ÷ 50 mg/mL = 10.1 mL",
    expectedMl: 10.1,
    mustAspirate: true,
    clinicalGoal: "Prescribe Flunixin Meglumina por vía Intravenosa (IV) en Vena Yugular a 1.1 mg/kg con aguja 18G, verificando reflujo de sangre roja antes de inyectar."
  },
  {
    id: "case_oxytet_respiratory",
    title: "Caso Clínico: Complejo Respiratorio Bovino (Neumonía)",
    species: "vaca",
    targetAnimalId: "cow_017",
    vignette: "Vaca 'Margarita' (525 kg) presenta fiebre de 40.4 °C, disnea, secreción mucopurulenta y estertores pulmonares bilaterales compatibles con Neumonía bacteriana (*Mannheimia haemolytica*).",
    targetDrugId: "oxytetracycline_la",
    targetRoute: "IM",
    expectedNeedle: "16G",
    doseFormula: "525 kg × 20 mg/kg ÷ 200 mg/mL = 52.5 mL (Fraccionado en varios puntos)",
    expectedMl: 52.5,
    mustAspirate: true,
    clinicalGoal: "Administra Oxitetraciclina L.A. por vía Intramuscular (IM) profunda en la tabla del cuello con aguja 16G gruesa, realizando prueba de aspiración negativa (sin sangre)."
  },
  {
    id: "case_ivermectin_parasite",
    title: "Caso Clínico: Miasis Cutánea & Carga Parasitaria Severa",
    species: "oveja",
    targetAnimalId: "sheep_031",
    vignette: "La oveja 'Blanquita' (46 kg) presenta pérdida de condición corporal, anemia en mucosas (FAMACHA 4) y signos de escabiosis/sarna ovina.",
    targetDrugId: "ivermectin",
    targetRoute: "SC",
    expectedNeedle: "20G",
    doseFormula: "46 kg × 0.2 mg/kg ÷ 10 mg/mL = 0.9 mL",
    expectedMl: 0.9,
    mustAspirate: false,
    clinicalGoal: "Aplica Ivermectina al 1% por vía Subcutánea (SC) estricta en el pliegue cutáneo con aguja 20G a 45° de inclinación (Prohibida vía IV/IM)."
  },
  {
    id: "case_tuberculin_test",
    title: "Caso Diagnóstico Oficial: Prueba Diagnóstica de Tuberculosis Bovina",
    species: "vaca",
    targetAnimalId: "cow_017",
    vignette: "Campaña oficial de saneamiento zoosanitario. Se requiere realizar la prueba tuberculínica anocaudal para descartar infección por *Mycobacterium bovis*.",
    targetDrugId: "tuberculin_ppd",
    targetRoute: "ID",
    expectedNeedle: "25G",
    doseFormula: "Dosis diagnóstica oficial: 0.1 mL exactos",
    expectedMl: 0.1,
    mustAspirate: false,
    clinicalGoal: "Aplica 0.1 mL de Tuberculina PPD por vía Intradérmica (ID) a 10°-15° con bisel superficial para formar una pápula/habón dérmico visible."
  },
  {
    id: "case_hypocalcemia_calcium",
    title: "Caso Urgencia Metabólica: Paresia Puerperal (Fiebre de Leche)",
    species: "vaca",
    targetAnimalId: "cow_017",
    vignette: "Vaca lechera recién parida encontrada en decúbito esternal, cabeza doblada sobre el flanco, extremidades frías y pulso débil. Diagnóstico: Hipocalcemia aguda.",
    targetDrugId: "calcium_gluconate",
    targetRoute: "IV",
    expectedNeedle: "16G",
    doseFormula: "500 mL por vaca adulta (infusión intravenosa lenta)",
    expectedMl: 500.0,
    mustAspirate: true,
    clinicalGoal: "Administra Gluconato de Calcio al 20% (500 mL) por vía Intravenosa (IV) lenta en Vena Yugular con verificación de reflujo venoso."
  }
];

export class ClinicalLab {
  constructor(canvasId, uiContainerId, { storeInstance = store, simEngineInstance = simEngine } = {}) {
    this.canvas = document.getElementById(canvasId);
    this.uiContainer = document.getElementById(uiContainerId);
    this.store = storeInstance;
    this.simEngine = simEngineInstance;

    // Estado del procedimiento clínico
    this.selectedDrug = PHARMACOPEIA[0];
    this.selectedRoute = "IV";
    this.selectedNeedle = NEEDLE_GAUGES[1]; // 18G
    this.selectedSite = "Vena yugular (Tercio medio)";
    this.angle = 25; // Grados de inclinación
    this.depth = 16; // Profundidad en mm
    this.calculatedDoseMl = 0;
    this.userLoadedDoseMl = 0;

    // Estado de la maniobra de inyección
    this.isAspirated = false;
    this.hasFlashback = false; // Retorno venoso de sangre
    this.isAntisepsisDone = false;
    this.isLiquidInjected = false;
    this.injectionProgress = 0;
    this.papuleSize = 0;
    this.lastEvaluation = null;

    // Caso de estudio activo generado
    this.activeStudyCase = null;

    // Lienzo de simulación anatómica 2D de alta resolución
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.isDraggingNeedle = false;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.calculateSuggestedDose();
    this.renderUI();
    this.startCanvasLoop();

    // Reaccionar a cambio de animal en la granja
    this.store.on("action:SELECT_ANIMAL", () => {
      this.calculateSuggestedDose();
      this.resetProcedureState();
      this.renderUI();
    });
  }

  setupCanvas() {
    if (!this.canvas) return;
    const updateSize = () => {
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: 640 };
      const w = Math.max(320, rect.width || 600);
      const h = 420;
      this.canvas.width = w * window.devicePixelRatio;
      this.canvas.height = h * window.devicePixelRatio;
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      if (this.ctx) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Interacción táctil / ratón sobre el corte histológico
    const getPos = (e) => {
      const r = this.canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left),
        y: (e.clientY - r.top)
      };
    };

    this.canvas.addEventListener("pointerdown", (e) => {
      this.isDraggingNeedle = true;
      this.handleCanvasPointer(getPos(e));
    });

    window.addEventListener("pointermove", (e) => {
      if (this.isDraggingNeedle) {
        this.handleCanvasPointer(getPos(e));
      }
    });

    window.addEventListener("pointerup", () => {
      this.isDraggingNeedle = false;
    });
  }

  handleCanvasPointer(pos) {
    if (!this.canvas) return;
    const h = 420;
    const skinY = 140;
    const clampedY = Math.max(skinY, Math.min(pos.y, h - 20));
    const calculatedDepth = Math.round(((clampedY - skinY) / (h - 20 - skinY)) * 50); // 0 - 50 mm

    this.depth = Math.max(1, Math.min(50, calculatedDepth));
    
    const skinEntryX = 180;
    const dx = pos.x - skinEntryX;
    const dy = clampedY - skinY;
    if (dy > 2) {
      let rad = Math.atan2(dy, Math.max(1, dx));
      let deg = Math.round(rad * (180 / Math.PI));
      deg = Math.max(5, Math.min(90, deg));
      this.angle = deg;
    }

    this.isAspirated = false;
    this.hasFlashback = false;
    this.isLiquidInjected = false;
    this.updateSlidersUI();
  }

  updateSlidersUI() {
    const slA = document.getElementById("clinicalAngleSlider");
    const lblA = document.getElementById("clinicalAngleValue");
    if (slA && lblA) {
      slA.value = this.angle;
      lblA.textContent = `${this.angle}°`;
    }
    const slD = document.getElementById("clinicalDepthSlider");
    const lblD = document.getElementById("clinicalDepthValue");
    if (slD && lblD) {
      slD.value = this.depth;
      lblD.textContent = `${this.depth} mm`;
    }
    const badge = document.getElementById("activeLayerDetectedBadge");
    if (badge) {
      const cur = this.getCurrentNeedleLayer();
      badge.textContent = cur.name.toUpperCase();
      badge.style.color = cur.color;
    }
  }

  getCurrentNeedleLayer() {
    // 0 - 4 mm: Epidermis / Dermis
    // 4 - 15 mm: Tejido celular subcutáneo
    // 15 - 45 mm: Músculo esquelético
    // Vena Yugular: Ubicada en el plano vascular entre 12 y 22 mm con ángulo entre 15° y 35°
    if (this.depth <= 4) {
      return { id: "epidermis_dermis", name: "1. Epidermis y Dermis (Piel)", color: "#f59e0b", isVein: false };
    } else if (this.depth >= 12 && this.depth <= 22 && this.angle >= 15 && this.angle <= 35) {
      return { id: "vein", name: "4. Luz Vascular (Vena Yugular)", color: "#06b6d4", isVein: true };
    } else if (this.depth <= 16) {
      return { id: "subcutaneous", name: "2. Tejido Celular Subcutáneo (Hipodermis)", color: "#fbbf24", isVein: false };
    } else {
      return { id: "muscle", name: "3. Masa Muscular Estriada Profunda", color: "#f87171", isVein: false };
    }
  }

  calculateSuggestedDose() {
    const animal = this.store.getSelectedAnimal() || { weight: 500 };
    const drug = this.selectedDrug;
    if (drug.id === "tuberculin_ppd") {
      this.calculatedDoseMl = 0.1;
      this.userLoadedDoseMl = 0.1;
      return;
    }
    if (drug.id === "calcium_gluconate") {
      this.calculatedDoseMl = 500;
      this.userLoadedDoseMl = 500;
      return;
    }
    const mgTotal = animal.weight * drug.recommendedDose.mgPerKg;
    const ml = (mgTotal / drug.concentration).toFixed(1);
    this.calculatedDoseMl = parseFloat(ml);
    this.userLoadedDoseMl = this.calculatedDoseMl;
  }

  resetProcedureState() {
    this.isAntisepsisDone = false;
    this.isAspirated = false;
    this.hasFlashback = false;
    this.isLiquidInjected = false;
    this.injectionProgress = 0;
    this.papuleSize = 0;
    this.lastEvaluation = null;
  }

  startCanvasLoop() {
    const render = () => {
      this.drawHistologicalSection();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  drawHistologicalSection() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = 420;

    ctx.clearRect(0, 0, w, h);

    // Fondo: Aire exterior / Sala clínica (por encima de skinY = 140)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 140);
    skyGrad.addColorStop(0, "#08141d");
    skyGrad.addColorStop(1, "#0f2432");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, 140);

    // Cuadrícula métrica milimétrica de referencia
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Región de Tejidos (Inicia en Y = 140)
    const skinY = 140;
    const subY = 175;
    const muscleY = 250;
    const veinY = 205;
    const veinRadius = 24;

    // 1. Capa: Dermis / Epidermis
    const skinGrad = ctx.createLinearGradient(0, skinY, 0, subY);
    skinGrad.addColorStop(0, "#c68b59");
    skinGrad.addColorStop(1, "#a86b3a");
    ctx.fillStyle = skinGrad;
    ctx.fillRect(0, skinY, w, subY - skinY);

    // Línea de estrato córneo superior
    ctx.fillStyle = this.isAntisepsisDone ? "#6ee7b7" : "#dfa473";
    ctx.fillRect(0, skinY, w, 4);

    // Pelos y folículos
    ctx.strokeStyle = "rgba(80, 45, 20, 0.4)";
    ctx.lineWidth = 1.5;
    for (let x = 20; x < w; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, skinY);
      ctx.lineTo(x - 8, skinY - 14);
      ctx.stroke();
    }

    // 2. Capa: Tejido Celular Subcutáneo (Hipodermis / Adipocitos)
    const subGrad = ctx.createLinearGradient(0, subY, 0, muscleY);
    subGrad.addColorStop(0, "#eab308");
    subGrad.addColorStop(1, "#ca8a04");
    ctx.fillStyle = subGrad;
    ctx.fillRect(0, subY, w, muscleY - subY);

    // Adipocitos (células de grasa)
    ctx.fillStyle = "rgba(254, 240, 138, 0.25)";
    ctx.strokeStyle = "rgba(161, 98, 7, 0.3)";
    ctx.lineWidth = 1;
    for (let x = 15; x < w; x += 22) {
      for (let y = subY + 8; y < muscleY - 8; y += 18) {
        ctx.beginPath();
        ctx.arc(x + (y % 10), y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 3. Capa: Músculo Estriado Profundo
    const musGrad = ctx.createLinearGradient(0, muscleY, 0, h);
    musGrad.addColorStop(0, "#b91c1c");
    musGrad.addColorStop(1, "#7f1d1d");
    ctx.fillStyle = musGrad;
    ctx.fillRect(0, muscleY, w, h - muscleY);

    // Fibras y fascículos musculares
    ctx.strokeStyle = "rgba(254, 202, 202, 0.15)";
    ctx.lineWidth = 2;
    for (let y = muscleY + 10; y < h; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 4. Estructura Vascular: Vena Yugular
    const veinCenterX = w * 0.58;
    const veinGrad = ctx.createRadialGradient(veinCenterX, veinY, 4, veinCenterX, veinY, veinRadius);
    veinGrad.addColorStop(0, "#0891b2");
    veinGrad.addColorStop(0.7, "#0e7490");
    veinGrad.addColorStop(1, "#164e63");
    ctx.fillStyle = veinGrad;
    ctx.beginPath();
    ctx.ellipse(veinCenterX, veinY, 70, veinRadius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sangre desoxigenada en movimiento dentro de la vena
    ctx.fillStyle = "#881337";
    ctx.beginPath();
    ctx.ellipse(veinCenterX, veinY, 62, veinRadius - 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Etiquetas anatómicas en el lienzo
    ctx.font = "bold 10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText("EPIDERMIS / DERMIS (0 - 4 mm)", 12, skinY + 22);
    ctx.fillText("TEJIDO SUBCUTÁNEO / HIPODERMIS (4 - 15 mm)", 12, subY + 28);
    ctx.fillText("MASA MUSCULAR PROFUNDA (> 15 mm)", 12, muscleY + 28);
    ctx.fillStyle = "#67e8f9";
    ctx.fillText("LUMEN DE LA VENA YUGULAR (IV)", veinCenterX - 65, veinY - 28);

    // Halo / Pápula de medicamento inyectado
    if (this.isLiquidInjected) {
      this.drawDrugDeposition(ctx, skinY, subY, muscleY, veinCenterX, veinY);
    }

    // Dibujar Aguja, Bisel y Jeringa interactiva con FÍSICA Y GEOMETRÍA EXACTA
    this.drawRealisticNeedleAndSyringe(ctx, skinY, w, h);
  }

  drawDrugDeposition(ctx, skinY, subY, muscleY, veinCenterX, veinY) {
    const cur = this.getCurrentNeedleLayer();
    const tip = this.calculateNeedleTipPos(skinY);

    if (cur.id === "epidermis_dermis") {
      // Pápula intradérmica visible sobreelevada
      ctx.fillStyle = "rgba(254, 240, 138, 0.8)";
      ctx.beginPath();
      ctx.arc(tip.x, skinY + 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (cur.id === "vein") {
      // Dispersión en torrente sanguíneo
      ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(tip.x + i * 9, veinY + Math.sin(i) * 6, 4 + i, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (cur.id === "subcutaneous") {
      // Depósito graso
      const grad = ctx.createRadialGradient(tip.x, tip.y, 2, tip.x, tip.y, 22);
      grad.addColorStop(0, "rgba(250, 204, 21, 0.85)");
      grad.addColorStop(1, "rgba(250, 204, 21, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 22, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Halo intramuscular
      const grad = ctx.createRadialGradient(tip.x, tip.y, 2, tip.x, tip.y, 28);
      grad.addColorStop(0, "rgba(239, 68, 68, 0.85)");
      grad.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 28, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  calculateNeedleTipPos(skinY) {
    const skinEntryX = 180;
    const h = 420;
    const depthPixels = (this.depth / 50) * (h - 20 - skinY);
    const rad = this.angle * (Math.PI / 180);

    const tipY = skinY + depthPixels;
    const tipX = skinEntryX + (depthPixels / Math.tan(rad || 0.05));
    return { x: tipX, y: tipY, entryX: skinEntryX };
  }

  /**
   * DIBUJO REALISTA: FÍSICA MÉDICA Y GEOMETRÍA EXACTA
   * El cono (hub) y el cilindro de la jeringa permanecen SIEMPRE en el exterior (por encima de skinY = 140).
   * Solo la cánula de acero quirúrgico penetra en el tejido.
   */
  drawRealisticNeedleAndSyringe(ctx, skinY, w, h) {
    const tip = this.calculateNeedleTipPos(skinY);
    const rad = this.angle * (Math.PI / 180);
    const sinA = Math.sin(rad) || 0.05;
    const cosA = Math.cos(rad);

    // Longitud penetrada dentro del tejido
    const depthPixels = tip.y - skinY;
    const penetratedNeedleLen = depthPixels / sinA;

    // Distancia que la cánula metálica sobresale en el aire ANTES del Hub (cono de plástico)
    const externalAirCanulaLen = 70; // 70px de aguja visible en el aire exterior
    const totalNeedleLength = penetratedNeedleLen + externalAirCanulaLen;

    ctx.save();
    // Centramos el sistema de coordenadas en la PUNTA del bisel
    ctx.translate(tip.x, tip.y);
    ctx.rotate(rad);

    // 1. CÁNULA METÁLICA DE LA AGUJA (Acero inoxidable quirúrgico)
    const needleGaugeRadius = this.selectedNeedle.gauge === "16G" ? 3.0 : (this.selectedNeedle.gauge === "18G" ? 2.2 : 1.6);
    
    // Bisel afilado en la punta
    ctx.fillStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.moveTo(0, 0); // Vértice del bisel
    ctx.lineTo(-12, -needleGaugeRadius);
    ctx.lineTo(-totalNeedleLength, -needleGaugeRadius);
    ctx.lineTo(-totalNeedleLength, needleGaugeRadius);
    ctx.lineTo(-6, needleGaugeRadius);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reflejo venoso dentro de la aguja (Luz interna)
    if (this.hasFlashback) {
      ctx.fillStyle = "#e11d48"; // Sangre en la aguja
      ctx.fillRect(-totalNeedleLength, -needleGaugeRadius + 0.5, totalNeedleLength - 4, (needleGaugeRadius * 2) - 1);
    }

    // 2. CONO / CONECTOR LUER-LOCK DE LA AGUJA (Garantizado en el aire exterior)
    const hubOffset = -totalNeedleLength;
    ctx.fillStyle = this.selectedNeedle.color;
    ctx.fillRect(hubOffset - 18, -8, 18, 16);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(hubOffset - 18, -8, 18, 16);

    // Texto Gauge en el cono de plástico
    ctx.font = "bold 9px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.selectedNeedle.gauge, hubOffset - 16, 3);

    // 3. CILINDRO DE LA JERINGA (Totalmente en el aire superior)
    const barrelX = hubOffset - 18;
    const barrelLength = 140;
    const barrelRadius = 16;

    // Cuerpo de polipropileno transparente
    ctx.fillStyle = "rgba(224, 242, 254, 0.25)";
    ctx.fillRect(barrelX - barrelLength, -barrelRadius, barrelLength, barrelRadius * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barrelX - barrelLength, -barrelRadius, barrelLength, barrelRadius * 2);

    // Solución medicamentosa cargada en la jeringa
    if (!this.isLiquidInjected) {
      ctx.fillStyle = this.hasFlashback ? "rgba(225, 29, 72, 0.8)" : "rgba(56, 189, 248, 0.6)";
      ctx.fillRect(barrelX - barrelLength + 22, -barrelRadius + 2, barrelLength - 24, (barrelRadius * 2) - 4);
    }

    // Graduaciones milimétricas y marcas de volumen en mL
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1;
    for (let i = 0; i < barrelLength - 20; i += 20) {
      ctx.beginPath();
      ctx.moveTo(barrelX - i, -barrelRadius);
      ctx.lineTo(barrelX - i, -barrelRadius + 7);
      ctx.stroke();
    }

    // Émbolo de goma negro y vástago
    const plungerPos = this.isLiquidInjected ? barrelX - 10 : barrelX - barrelLength + 22;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(plungerPos - 8, -barrelRadius + 1, 8, (barrelRadius * 2) - 2);
    // Vástago de plástico blanco
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(plungerPos - 65, -4, 57, 8);
    // Apoyo del dedo / pulgar
    ctx.fillRect(plungerPos - 70, -12, 5, 24);

    ctx.restore();

    // 4. Marca de Punción en la Superficie Cutánea (Punto de entrada)
    ctx.fillStyle = this.isAntisepsisDone ? "#10b981" : "#ef4444";
    ctx.beginPath();
    ctx.arc(tip.entryX, skinY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Indicador visual en la punta del bisel
    const layer = this.getCurrentNeedleLayer();
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  generateRandomStudyCase() {
    const idx = Math.floor(Math.random() * CLINICAL_EXAM_CASES.length);
    this.activeStudyCase = CLINICAL_EXAM_CASES[idx];
    
    // Auto-seleccionar el animal del caso
    if (this.activeStudyCase.targetAnimalId) {
      this.store.dispatch(ACTION_TYPES.SELECT_ANIMAL, { animalId: this.activeStudyCase.targetAnimalId });
    }
    
    this.resetProcedureState();
    AudioFx.success();
    this.store.emit("toast:show", { msg: `📋 <b>Nuevo Caso Generado:</b> ${this.activeStudyCase.title}` });
    this.renderUI();
  }

  renderUI() {
    if (!this.uiContainer) return;
    const animal = this.store.getSelectedAnimal() || { tag: "VACA #017", breed: "Holstein", weight: 525, vitals: {} };
    const curLayer = this.getCurrentNeedleLayer();

    this.uiContainer.innerHTML = `
      <div class="space-y-4">
        <!-- 0. Generador de Casos y Enunciados Clínicos en Vivo -->
        <div class="bg-gradient-to-r from-blue-950/40 to-emerald-950/40 p-4 rounded-2xl border border-blue-500/40 space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-xs text-blue-300 uppercase tracking-wider mono flex items-center gap-1.5">
              <span>🎲</span> Generador de Casos Clínicos en Vivo
            </h4>
            <button id="btnGenerateClinicalCase" class="btn px-3 py-1.5 rounded-xl border border-blue-400/40 bg-blue-900/50 hover:bg-blue-800/60 text-xs font-bold text-blue-200 flex items-center gap-1.5 shadow">
              <span>🔄</span> Generar Nuevo Enunciado
            </button>
          </div>

          ${this.activeStudyCase ? `
            <div class="p-3.5 rounded-xl bg-black/50 border border-blue-400/30 space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <b class="text-white text-xs">${this.activeStudyCase.title}</b>
                <span class="mono text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">DESAFÍO ACTIVO</span>
              </div>
              <p class="text-gray-200 text-[11px] leading-relaxed">${this.activeStudyCase.vignette}</p>
              <div class="p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-[11px] text-blue-200">
                <b>🎯 Misión:</b> ${this.activeStudyCase.clinicalGoal}
              </div>
            </div>
          ` : `
            <p class="text-[11px] text-[var(--muted)]">
              Pulsa <b>Generar Nuevo Enunciado</b> para recibir un caso semiológico aleatorio (cólicos, neumonías, tuberculosis, paresia puerperal) y poner a prueba tu cálculo de dosis y punción.
            </p>
          `}
        </div>

        <!-- 1. Ficha del Paciente y Constantes Semiológicas -->
        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)]">
          <div class="flex justify-between items-center mb-2">
            <div>
              <span class="text-[10px] text-[var(--muted)] mono uppercase block">PACIENTE SELECCIONADO</span>
              <h4 class="font-bold text-sm text-white flex items-center gap-1.5">
                <span>🩺</span> ${animal.tag} <span class="text-emerald-400 font-semibold">(${animal.weight} kg)</span>
              </h4>
            </div>
            <div class="text-right">
              <span class="text-[10px] mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold">
                T° ${animal.vitals.temp || 38.6} °C · FC ${animal.vitals.heartRate || 68}
              </span>
            </div>
          </div>
          <p class="text-[11px] text-[var(--muted)]">Raza: ${animal.breed} · Condición Corporal: BCS ${animal.bcs || 3.25}/5</p>
        </div>

        <!-- 2. Selección de Principio Activo (Farmacopea DCI Oficial) -->
        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-2">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono flex items-center gap-1.5">
              <span>💊</span> Farmacopea Veterinaria (Nombre Científico DCI)
            </h4>
            <span class="text-[10px] text-emerald-400 mono">DCI Oficial</span>
          </div>

          <select id="selectClinicalDrug" class="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/60 text-xs font-semibold text-white focus:outline-none focus:border-emerald-400">
            ${PHARMACOPEIA.map(d => `
              <option value="${d.id}" ${d.id === this.selectedDrug.id ? 'selected' : ''}>
                ${d.name} (${d.concentration} ${d.unit}) — [${d.class}]
              </option>
            `).join("")}
          </select>

          <!-- Tarjeta de Información Farmacológica del Principio Activo -->
          <div class="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-gray-300" id="drugDetailsCard">
            <div class="flex justify-between text-[11px]">
              <span class="text-[var(--muted)]">Indicación clínica:</span>
              <b class="text-gray-200">${this.selectedDrug.indication}</b>
            </div>
            <div class="flex justify-between text-[11px]">
              <span class="text-[var(--muted)]">Vías aprobadas:</span>
              <span class="mono text-emerald-300 font-bold">${this.selectedDrug.allowedRoutes.join(" / ")}</span>
            </div>
            <div class="flex justify-between text-[11px]">
              <span class="text-[var(--muted)]">Dosis por kg:</span>
              <span class="mono text-blue-300 font-bold">${this.selectedDrug.recommendedDose.label}</span>
            </div>
            <div class="flex justify-between text-[11px] pt-1 border-t border-[var(--border)]">
              <span class="text-[var(--muted)]">Retiro (Carne / Leche):</span>
              <span class="mono text-amber-300">${this.selectedDrug.withdrawalMeat} días carne · ${this.selectedDrug.withdrawalMilk !== null ? this.selectedDrug.withdrawalMilk + 'h leche' : 'PROHIBIDO en leche'}</span>
            </div>
            <div class="text-[10px] text-amber-200/90 italic pt-1">
              ⚠️ ${this.selectedDrug.warning}
            </div>
          </div>
        </div>

        <!-- 3. Calculadora Zootécnica de Dosis & Insumos -->
        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono flex items-center gap-1.5">
              <span>⚖️</span> Dosificación Zootécnica & Aguja
            </h4>
            <span class="chip mono text-[10px] text-emerald-300">
              Dosis Sugerida: <b>${this.calculatedDoseMl} mL</b>
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <!-- Calibre de Aguja (Gauge) -->
            <div>
              <label class="text-[10px] text-[var(--muted)] block mb-1">Calibre Aguja (Gauge):</label>
              <select id="selectNeedleGauge" class="w-full p-2 rounded-lg border border-[var(--border)] bg-black/50 text-xs font-semibold text-white">
                ${NEEDLE_GAUGES.map(g => `
                  <option value="${g.gauge}" ${g.gauge === this.selectedNeedle.gauge ? 'selected' : ''}>
                    ${g.gauge} x ${g.length}
                  </option>
                `).join("")}
              </select>
            </div>

            <!-- Vía Farmacológica -->
            <div>
              <label class="text-[10px] text-[var(--muted)] block mb-1">Vía Objetivo:</label>
              <select id="selectTargetRoute" class="w-full p-2 rounded-lg border border-[var(--border)] bg-black/50 text-xs font-semibold text-white">
                ${Object.entries(VET_ROUTES).map(([k, r]) => `
                  <option value="${k}" ${k === this.selectedRoute ? 'selected' : ''}>${r.name}</option>
                `).join("")}
              </select>
            </div>
          </div>

          <!-- Volumen a Cargar en la Jeringa -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-[var(--muted)]">Volumen cargado en jeringa:</span>
              <b class="mono text-emerald-400 font-bold" id="lblVolumeLoaded">${this.userLoadedDoseMl} mL</b>
            </div>
            <input type="range" id="rngVolume" min="0.1" max="${Math.max(50, this.calculatedDoseMl * 2)}" step="0.1" value="${this.userLoadedDoseMl}" style="accent-color:#10b981; width:100%;">
          </div>
        </div>

        <!-- 4. Maniobra y Ejecución Clínica en 4 Pasos -->
        <div class="bg-black/30 p-4 rounded-xl border border-[var(--border)] space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider mono flex items-center gap-1.5">
              <span>🎯</span> Calibración de Punción & Émbolo
            </h4>
            <span id="activeLayerDetectedBadge" class="mono text-[10px] font-bold" style="color:${curLayer.color}">
              ${curLayer.name.toUpperCase()}
            </span>
          </div>

          <!-- Controles de Ángulo y Profundidad con Arrastre -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-amber-200">Ángulo de Entrada:</span>
                <b id="clinicalAngleValue" class="mono text-white">${this.angle}°</b>
              </div>
              <input type="range" id="clinicalAngleSlider" min="5" max="90" value="${this.angle}" style="accent-color:#f59e0b; width:100%;">
            </div>
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-blue-200">Profundidad Bisel:</span>
                <b id="clinicalDepthValue" class="mono text-white">${this.depth} mm</b>
              </div>
              <input type="range" id="clinicalDepthSlider" min="1" max="50" value="${this.depth}" style="accent-color:#38bdf8; width:100%;">
            </div>
          </div>

          <!-- Botones de Acción Clínica: Antisepsia, Aspiración e Inyección -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)]">
            <!-- 1. Antisepsia -->
            <button id="btnAntisepsis" class="btn p-2.5 rounded-xl border border-[var(--border)] ${this.isAntisepsisDone ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-black/30 text-gray-300'} text-xs font-semibold flex items-center justify-center gap-1.5">
              <span>🧼</span> ${this.isAntisepsisDone ? 'Antisepsia Realizada' : '1. Antisepsia (Alcohol)'}
            </button>

            <!-- 2. Aspiración de Émbolo -->
            <button id="btnAspirate" class="btn p-2.5 rounded-xl border border-[var(--border)] ${this.isAspirated ? (this.hasFlashback ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' : 'bg-blue-950/60 border-blue-500/50 text-blue-300') : 'bg-black/30 text-gray-300'} text-xs font-semibold flex items-center justify-center gap-1.5">
              <span>🔄</span> 2. Aspirar Émbolo
            </button>
          </div>

          <!-- Banner de Feedback de Aspiración en Vivo -->
          ${this.isAspirated ? `
            <div class="p-2.5 rounded-xl text-xs ${this.hasFlashback ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200' : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'}">
              ${this.hasFlashback
                ? `🩸 <b>Prueba de aspiración POSITIVA (Hay retorno venoso):</b> La punta está en la Vena Yugular. ${this.selectedRoute === 'IV' ? '¡Excelente para vía IV!' : '⚠️ ¡PELIGRO! Si inyectas un fármaco no IV aquí causarás embolismo o shock.'}`
                : `✅ <b>Prueba de aspiración NEGATIVA (Sin sangre):</b> La punta está en tejido avascular. Seguro para administrar por vía IM o SC.`
              }
            </div>
          ` : ''}

          <!-- Botón de Inyección Final -->
          <button id="btnExecuteClinicalInjection" class="btn w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg flex items-center justify-center gap-2">
            <span>💉</span> 3. Administrar Principio Activo (${this.userLoadedDoseMl} mL)
          </button>
        </div>

        <!-- 5. Dictamen / Informe de Auditoría Clínica -->
        <div id="clinicalEvaluationReport" class="${this.lastEvaluation ? '' : 'hidden'}">
          ${this.lastEvaluation ? this.renderReportHTML(this.lastEvaluation) : ''}
        </div>
      </div>
    `;

    this.bindUIEvents();
  }

  bindUIEvents() {
    // Generador de Casos
    const btnGenCase = document.getElementById("btnGenerateClinicalCase");
    if (btnGenCase) {
      btnGenCase.onclick = () => this.generateRandomStudyCase();
    }

    // Selección de Fármaco DCI
    const selDrug = document.getElementById("selectClinicalDrug");
    if (selDrug) {
      selDrug.onchange = (e) => {
        const found = PHARMACOPEIA.find(d => d.id === e.target.value);
        if (found) {
          this.selectedDrug = found;
          this.selectedRoute = found.preferredRoute;
          this.calculateSuggestedDose();
          this.resetProcedureState();
          this.renderUI();
          AudioFx.click();
        }
      };
    }

    // Selección de Aguja Gauge
    const selNeedle = document.getElementById("selectNeedleGauge");
    if (selNeedle) {
      selNeedle.onchange = (e) => {
        const found = NEEDLE_GAUGES.find(g => g.gauge === e.target.value);
        if (found) {
          this.selectedNeedle = found;
          AudioFx.click();
        }
      };
    }

    // Selección de Vía
    const selRoute = document.getElementById("selectTargetRoute");
    if (selRoute) {
      selRoute.onchange = (e) => {
        this.selectedRoute = e.target.value;
        const info = VET_ROUTES[this.selectedRoute];
        if (info) {
          this.angle = info.angleRange[0];
          this.depth = info.depthRange[0];
          this.updateSlidersUI();
        }
        AudioFx.click();
      };
    }

    // Slider de Volumen
    const rngVol = document.getElementById("rngVolume");
    if (rngVol) {
      rngVol.oninput = (e) => {
        this.userLoadedDoseMl = parseFloat(e.target.value);
        const lbl = document.getElementById("lblVolumeLoaded");
        if (lbl) lbl.textContent = `${this.userLoadedDoseMl} mL`;
      };
    }

    // Sliders de Ángulo y Profundidad
    const slA = document.getElementById("clinicalAngleSlider");
    if (slA) {
      slA.oninput = (e) => {
        this.angle = parseInt(e.target.value, 10);
        const lblA = document.getElementById("clinicalAngleValue");
        if (lblA) lblA.textContent = `${this.angle}°`;
        this.isAspirated = false;
        this.hasFlashback = false;
        this.isLiquidInjected = false;
        this.updateSlidersUI();
      };
    }

    const slD = document.getElementById("clinicalDepthSlider");
    if (slD) {
      slD.oninput = (e) => {
        this.depth = parseInt(e.target.value, 10);
        const lblD = document.getElementById("clinicalDepthValue");
        if (lblD) lblD.textContent = `${this.depth} mm`;
        this.isAspirated = false;
        this.hasFlashback = false;
        this.isLiquidInjected = false;
        this.updateSlidersUI();
      };
    }

    // Botón de Antisepsia
    const btnAnti = document.getElementById("btnAntisepsis");
    if (btnAnti) {
      btnAnti.onclick = () => {
        this.isAntisepsisDone = true;
        AudioFx.click();
        this.renderUI();
      };
    }

    // Botón de Aspiración de Émbolo
    const btnAsp = document.getElementById("btnAspirate");
    if (btnAsp) {
      btnAsp.onclick = () => {
        this.isAspirated = true;
        const curLayer = this.getCurrentNeedleLayer();
        this.hasFlashback = curLayer.isVein;
        if (this.hasFlashback) {
          AudioFx.beep(350, 0.15, "triangle");
        } else {
          AudioFx.click();
        }
        this.renderUI();
      };
    }

    // Botón de Inyección
    const btnExec = document.getElementById("btnExecuteClinicalInjection");
    if (btnExec) {
      btnExec.onclick = () => this.evaluateAndExecuteInjection();
    }
  }

  evaluateAndExecuteInjection() {
    const animal = this.store.getSelectedAnimal();
    const drug = this.selectedDrug;
    const routeInfo = VET_ROUTES[this.selectedRoute];
    const reachedLayer = this.getCurrentNeedleLayer();

    // Criterios de Evaluación Científica
    const isRouteAuthorized = drug.allowedRoutes.includes(this.selectedRoute);
    const isLayerCorrect = reachedLayer.id === routeInfo.targetLayer;
    const isAngleCorrect = this.angle >= routeInfo.angleRange[0] && this.angle <= routeInfo.angleRange[1];
    const isDepthCorrect = this.depth >= routeInfo.depthRange[0] && this.depth <= routeInfo.depthRange[1];
    const isAspirationChecked = this.isAspirated;
    const isDoseAccurate = Math.abs(this.userLoadedDoseMl - this.calculatedDoseMl) <= (this.calculatedDoseMl * 0.15 || 0.5);

    // Detección de Accidentes Fatales Farmacológicos
    let fatalError = false;
    let fatalMsg = "";

    if (drug.id === "penicillin_g" && reachedLayer.isVein) {
      fatalError = true;
      fatalMsg = "¡ACCIDENTE FATAL! Has inyectado Penicilina Procaínica directamente al torrente venoso (IV). La procaína intravascular desencadenó shock neurotóxico, convulsiones y paro cardíaco inmediato del ejemplar.";
    } else if (drug.id === "ivermectin" && reachedLayer.isVein) {
      fatalError = true;
      fatalMsg = "¡ERROR GRAVE! La Ivermectina tiene excipientes de depósito prohibidos para vía IV; provocó hemólisis masiva y shock hipovolémico.";
    }

    let score = 100;
    const deductions = [];

    if (!this.isAntisepsisDone) {
      score -= 10;
      deductions.push("No realizaste antisepsia cutánea previa con alcohol/clorhexidina (-10 pts). Riesgo de absceso bacteriano.");
    }
    if (!isRouteAuthorized) {
      score -= 40;
      deductions.push(`Vía incorrecta para ${drug.name}. Las vías autorizadas son: ${drug.allowedRoutes.join(", ")} (-40 pts).`);
    }
    if (!isLayerCorrect) {
      score -= 30;
      deductions.push(`El bisel de la aguja quedó en [${reachedLayer.name}] cuando la vía ${routeInfo.name} exige [${routeInfo.layerName}] (-30 pts).`);
    }
    if (!isAngleCorrect) {
      score -= 10;
      deductions.push(`Ángulo de entrada ${this.angle}° fuera del rango óptimo (${routeInfo.angleRange[0]}°–${routeInfo.angleRange[1]}°) (-10 pts).`);
    }
    if (!isDepthCorrect) {
      score -= 10;
      deductions.push(`Profundidad ${this.depth} mm fuera de rango tisular (${routeInfo.depthRange[0]}–${routeInfo.depthRange[1]} mm) (-10 pts).`);
    }
    if (!isAspirationChecked && this.selectedRoute === "IM") {
      score -= 15;
      deductions.push("Omitiste la prueba de aspiración del émbolo en vía IM. En campo esto puede resultar en la muerte accidental del animal si se atraviesa un vaso (-15 pts).");
    }
    if (!isDoseAccurate) {
      score -= 15;
      deductions.push(`Error de dosificación: aplicaste ${this.userLoadedDoseMl} mL pero la posología para ${animal.weight} kg exigía ${this.calculatedDoseMl} mL (-15 pts).`);
    }

    // Evaluación contra Caso de Estudio Activo (si existe)
    let caseFeedback = null;
    if (this.activeStudyCase) {
      const c = this.activeStudyCase;
      const matchedDrug = drug.id === c.targetDrugId;
      const matchedRoute = this.selectedRoute === c.targetRoute;
      const matchedDose = Math.abs(this.userLoadedDoseMl - c.expectedMl) <= (c.expectedMl * 0.15 || 0.5);

      caseFeedback = {
        title: c.title,
        matchedDrug,
        matchedRoute,
        matchedDose,
        allGoalPassed: matchedDrug && matchedRoute && matchedDose && passed
      };
    }

    score = Math.max(0, score);
    const passed = score >= 70 && !fatalError;

    // Actualizar estado del simulador
    this.isLiquidInjected = true;
    this.lastEvaluation = {
      drug,
      animal,
      score,
      passed,
      fatalError,
      fatalMsg,
      deductions,
      caseFeedback,
      timestamp: new Date().toLocaleTimeString()
    };

    // Actualizar estado biológico del animal en la granja
    if (passed) {
      AudioFx.success();
      animal.health = Math.min(100, (animal.health || 85) + 8);
      animal.stress = Math.max(5, (animal.stress || 20) - 10);
      this.store.emit("procedure:success", {
        drug: drug.name,
        animal,
        msg: `Inyección correcta de ${drug.name} (${this.userLoadedDoseMl} mL). Dosis y plano anatómico exactos.`
      });
    } else {
      AudioFx.error();
      animal.health = Math.max(10, (animal.health || 85) - (fatalError ? 50 : 15));
      animal.stress = Math.min(95, (animal.stress || 20) + 25);
      this.store.emit("procedure:failed", {
        drug: drug.name,
        animal,
        msg: fatalError ? fatalMsg : `Falla en procedimiento con ${drug.name} (Calificación: ${score}/100).`
      });
    }

    this.store.updateAnimal(animal.id, animal);
    this.renderUI();

    const reportEl = document.getElementById("clinicalEvaluationReport");
    if (reportEl) {
      reportEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  renderReportHTML(rep) {
    return `
      <div class="p-4 rounded-xl border ${rep.passed ? 'border-emerald-500/50 bg-emerald-950/40' : 'border-rose-500/50 bg-rose-950/40'} space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="display font-bold text-sm text-white">DICTAMEN CLÍNICO & FARMACOLÓGICO</h4>
            <span class="text-[10px] text-[var(--muted)] mono">Fármaco: ${rep.drug.name} · ${rep.timestamp}</span>
          </div>
          <div class="text-right">
            <span class="text-[9px] text-[var(--muted)] uppercase block">Calificación de Punción</span>
            <span class="display text-xl font-bold ${rep.passed ? 'text-emerald-400' : 'text-rose-400'}">
              ${rep.score} / 100
            </span>
          </div>
        </div>

        ${rep.caseFeedback ? `
          <div class="p-3 rounded-lg bg-blue-950/70 border border-blue-400/40 text-xs space-y-1">
            <b class="text-blue-300 block">Evaluación del Desafío Activo: ${rep.caseFeedback.title}</b>
            <div class="text-[11px] text-gray-200">
              ${rep.caseFeedback.matchedDrug ? '✅ Principio activo prescrito correctamente.' : '❌ Error de prescripción (fármaco incorrecto para este cuadro).'}
              <br>
              ${rep.caseFeedback.matchedRoute ? '✅ Vía y plano tisular adecuados.' : '❌ Vía incorrecta para este desafío.'}
              <br>
              ${rep.caseFeedback.matchedDose ? '✅ Volumen calculado con exactitud.' : '❌ Volumen fuera de rango posológico.'}
            </div>
          </div>
        ` : ''}

        ${rep.fatalError ? `
          <div class="p-3 rounded-lg bg-rose-900/60 border border-rose-500 text-xs text-rose-100 font-medium">
            ⚠️ <b>ALERTA SANITARIA CRÍTICA:</b> ${rep.fatalMsg}
          </div>
        ` : ''}

        ${rep.deductions.length > 0 ? `
          <div class="space-y-1 text-xs">
            <b class="text-amber-300 text-[11px] block">Observaciones y Hallazgos a Corregir:</b>
            ${rep.deductions.map(d => `<div class="p-2 rounded bg-black/40 border border-white/5 text-gray-200">❌ ${d}</div>`).join("")}
          </div>
        ` : `
          <div class="p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-xs text-emerald-200">
            🌟 <b>Procedimiento Impecable:</b> Antisepsia adecuada, ángulo y profundidad de bisel precisos, verificación por aspiración conforme y cálculo milimétrico de dosis terapéutica.
          </div>
        `}

        <div class="text-[10px] text-[var(--muted)] pt-2 border-t border-[var(--border)] flex justify-between">
          <span>Tiempo de Retiro en Carne: <b class="text-gray-200">${rep.drug.withdrawalMeat} días</b></span>
          <span>Tiempo de Retiro en Leche: <b class="text-gray-200">${rep.drug.withdrawalMilk !== null ? rep.drug.withdrawalMilk + ' horas' : 'Contraindicado'}</b></span>
        </div>
      </div>
    `;
  }
}
