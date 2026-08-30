/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: FertilizerEngine.js - Simulador Agronómico de Fertilizantes, Enmiendas de Suelo
 * y Evaluación Biológica de Reacción de Pasturas (Excelente / Medio / Mal)
 */

export const FERTILIZERS_DATABASE = [
  {
    id: "urea",
    name: "Urea Agrícola (46-0-0)",
    category: "Nitrogenado de Alta Concentración",
    n: 46, p: 0, k: 0, s: 0,
    costPerKg: 0.85,
    recommendedDoseKgHa: 120,
    minDoseKgHa: 50,
    maxDoseKgHa: 250,
    icon: "⚪",
    desc: "Aporte masivo de Nitrógeno amídico de rápida asimilación. Estimula el macollamiento y la síntesis proteica foliar.",
    optimalConditions: {
      soilMoisture: "humedo",
      minPh: 5.5,
      maxPh: 7.2
    }
  },
  {
    id: "npk_15",
    name: "Fertilizante Complejo NPK (15-15-15)",
    category: "Complejo Balanceado (Triple 15)",
    n: 15, p: 15, k: 15, s: 0,
    costPerKg: 1.10,
    recommendedDoseKgHa: 200,
    minDoseKgHa: 100,
    maxDoseKgHa: 400,
    icon: "🔵",
    desc: "Nutrición integral equilibrada. Aporta N para follaje, P para enraizamiento y K para turgencia celular y resistencia.",
    optimalConditions: {
      soilMoisture: "any",
      minPh: 5.2,
      maxPh: 7.5
    }
  },
  {
    id: "dap",
    name: "Fosfato Diamónico DAP (18-46-0)",
    category: "Fosfatado de Alta Graduación",
    n: 18, p: 46, k: 0, s: 0,
    costPerKg: 1.35,
    recommendedDoseKgHa: 100,
    minDoseKgHa: 50,
    maxDoseKgHa: 200,
    icon: "🟤",
    desc: "Excelente fuente de fósforo altamente soluble. Vital para el establecimiento radicular y fotosíntesis temprana.",
    optimalConditions: {
      soilMoisture: "any",
      minPh: 5.8,
      maxPh: 7.2
    }
  },
  {
    id: "cal_dolomitica",
    name: "Cal Dolomítica Agrícola (CaCO₃ + MgCO₃)",
    category: "Enmienda Correctiva de Acidez",
    n: 0, p: 0, k: 0, s: 0, ca: 30, mg: 15,
    costPerKg: 0.25,
    recommendedDoseKgHa: 1000,
    minDoseKgHa: 500,
    maxDoseKgHa: 3000,
    icon: "⚪",
    desc: "Eleva el pH del suelo, neutraliza el Aluminio tóxico (Al³⁺) y aporta Calcio y Magnesio esenciales para la clorofila.",
    optimalConditions: {
      soilMoisture: "humedo",
      minPh: 3.5,
      maxPh: 5.5
    }
  },
  {
    id: "sulfato_amonio",
    name: "Sulfato de Amonio (21-0-0 + 24% S)",
    category: "Nitrógeno Amoniacal con Azufre",
    n: 21, p: 0, k: 0, s: 24,
    costPerKg: 0.75,
    recommendedDoseKgHa: 150,
    minDoseKgHa: 75,
    maxDoseKgHa: 300,
    icon: "🟡",
    desc: "Aporte de nitrógeno no volátil y azufre indispensable para aminoácidos azufrados (metionina/cisteína). Ideal para suelos neutros o calcáreos.",
    optimalConditions: {
      soilMoisture: "any",
      minPh: 6.0,
      maxPh: 8.0
    }
  },
  {
    id: "compost",
    name: "Compost Orgánico Estabilizado / Bioabono",
    category: "Enmienda Biológica & Orgánica",
    n: 2.5, p: 2.0, k: 2.0, s: 1.0,
    costPerKg: 0.18,
    recommendedDoseKgHa: 2000,
    minDoseKgHa: 1000,
    maxDoseKgHa: 5000,
    icon: "🪱",
    desc: "Aumenta la Capacidad de Intercambio Catiónico (CIC), retención de humedad y actividad de microorganismos benéficos del suelo.",
    optimalConditions: {
      soilMoisture: "any",
      minPh: 4.5,
      maxPh: 7.8
    }
  },
  {
    id: "kcl",
    name: "Cloruro de Potasio KCl (0-0-60)",
    category: "Potásico Concentrado",
    n: 0, p: 0, k: 60, s: 0,
    costPerKg: 0.95,
    recommendedDoseKgHa: 100,
    minDoseKgHa: 40,
    maxDoseKgHa: 200,
    icon: "🔴",
    desc: "Regula la apertura estomática, confiere tolerancia al estrés hídrico y transporta carbohidratos hacia raíces.",
    optimalConditions: {
      soilMoisture: "any",
      minPh: 5.0,
      maxPh: 7.5
    }
  }
];

export class FertilizerEngine {
  /**
   * Evalúa la reacción biológica del pasto ante la aplicación del fertilizante
   * @param {Object} params - { fertilizerId, doseKgHa, soilPh, soilMoisture, soilDeficiency, forageSpeciesId }
   * @returns {Object} Resultado con veredicto ("excelente", "medio", "mal"), puntaje, biomasa ganada, proteína ganada y explicación agronómica.
   */
  static evaluateApplication({ fertilizerId, doseKgHa, soilPh = 5.6, soilMoisture = "humedo", soilDeficiency = "nitrogeno" }) {
    const fert = FERTILIZERS_DATABASE.find(f => f.id === fertilizerId) || FERTILIZERS_DATABASE[0];
    const dose = parseFloat(doseKgHa) || fert.recommendedDoseKgHa;
    const ph = parseFloat(soilPh) || 5.6;

    let score = 75;
    let verdict = "medio"; // "excelente", "medio", "mal"
    let biomassDeltaKgHa = 0;
    let proteinDeltaPct = 0;
    const notes = [];
    const warnings = [];

    // 1. Evaluación de Urea en Sequía vs Lluvias
    if (fert.id === "urea") {
      if (soilMoisture === "sequia") {
        score -= 45;
        verdict = "mal";
        warnings.push("⚠️ <b>Volatilización Severa de Amoníaco (NH₃):</b> La urea requiere humedad para hidrolizarse con la ureasa. En suelo seco se pierde hasta el 60% del N al aire y causa quemado foliar.");
      } else {
        score += 15;
        notes.push("💧 <b>Humedad Óptima:</b> Rápida disolución e incorporación al perfil radicular.");
      }

      if (dose > 220) {
        score -= 30;
        verdict = "mal";
        warnings.push("☣️ <b>Riesgo de Toxicidad por Nitratos:</b> Sobredosis de N. Las gramíneas acumulan nitratos libres en tallos basales, con riesgo mortal de metahemoglobinemia para el ganado.");
      } else if (dose >= 80 && dose <= 160) {
        score += 10;
      }

      if (ph < 5.0) {
        score -= 20;
        warnings.push("🍂 <b>Acidez Limitante:</b> Suelo muy ácido (pH < 5.0) bloquea la absorción eficiente del nitrógeno amoniacal.");
      }
    }

    // 2. Evaluación de Cal Dolomítica en suelos ácidos vs alcalinos
    if (fert.id === "cal_dolomitica") {
      if (ph < 5.2) {
        score += 35;
        verdict = "excelente";
        notes.push("🎉 <b>Respuesta Magistral:</b> La cal neutraliza el Aluminio trivalente (Al³⁺), desbloqueando el Fósforo fijado y elevando la biodisponibilidad de todos los nutrientes.");
      } else if (ph > 6.8) {
        score -= 40;
        verdict = "mal";
        warnings.push("❌ <b>Encalado Innecesario / Desperdicio:</b> El suelo ya es neutro o alcalino. El exceso de cal bloquea micronutrientes como Hierro (Fe), Zinc (Zn) y Manganeso (Mn).");
      } else {
        score += 5;
      }
    }

    // 3. Evaluación de DAP (Fósforo) y pH
    if (fert.id === "dap") {
      if (ph < 5.0) {
        score -= 30;
        verdict = "medio";
        warnings.push("🔒 <b>Fijación de Fósforo:</b> En suelos ácidos sin encalar, el fósforo del DAP se fija fuertemente al Hierro y Aluminio insolubles, perdiendo eficacia agronómica.");
      } else if (soilDeficiency === "fosforo") {
        score += 25;
        verdict = "excelente";
        notes.push("🌱 <b>Corrección Radicular Exacta:</b> Aporte directo al déficit de Fósforo, multiplicando el macollamiento del pasto.");
      }
    }

    // 4. Evaluación de NPK 15-15-15
    if (fert.id === "npk_15") {
      if (dose >= 150 && dose <= 250 && ph >= 5.3) {
        score += 20;
        verdict = "excelente";
        notes.push("🌟 <b>Equilibrio Nutricional Completo:</b> Respuesta simultánea en biomasa verde, elongación foliar y vigor radicular.");
      }
    }

    // 5. Evaluación de Compost Orgánico
    if (fert.id === "compost") {
      score += 15;
      notes.push("🪱 <b>Mejora Estructural del Suelo:</b> Enriquecimiento de materia orgánica, retención de agua y microbiología rizosférica.");
      if (dose >= 1500 && dose <= 3000) {
        score += 10;
      }
    }

    // 6. Evaluación de Sulfato de Amonio
    if (fert.id === "sulfato_amonio") {
      if (ph >= 6.5) {
        score += 20;
        verdict = "excelente";
        notes.push("⚡ <b>Efecto Acidificante Positivo & Azufre:</b> El ion sulfato compensa la alcalinidad y suministra azufre para proteínas esenciales.");
      }
    }

    // Ajuste final de veredicto
    if (score >= 82 && warnings.length === 0) {
      verdict = "excelente";
    } else if (score < 55 || warnings.some(w => w.includes("Volatilización") || w.includes("Toxicidad") || w.includes("Desperdicio"))) {
      verdict = "mal";
    } else {
      verdict = "medio";
    }

    // Cálculo cuantitativo de rendimiento y proteína
    if (verdict === "excelente") {
      biomassDeltaKgHa = Math.round(dose * (fert.n * 0.12 + fert.p * 0.08 + fert.k * 0.05 + 1.2));
      proteinDeltaPct = +( (fert.n > 0 ? (fert.n * 0.08) : 0.8) ).toFixed(1);
    } else if (verdict === "medio") {
      biomassDeltaKgHa = Math.round(dose * (fert.n * 0.05 + 0.6));
      proteinDeltaPct = +( (fert.n > 0 ? (fert.n * 0.03) : 0.3) ).toFixed(1);
    } else {
      biomassDeltaKgHa = Math.max(0, Math.round(dose * 0.15));
      proteinDeltaPct = 0.0;
    }

    return {
      fertilizer: fert,
      doseApplied: dose,
      soilPh: ph,
      soilMoisture,
      verdict, // "excelente", "medio", "mal"
      score: Math.max(10, Math.min(100, score)),
      biomassDeltaKgHa: Math.min(1800, biomassDeltaKgHa),
      proteinDeltaPct: Math.min(4.5, proteinDeltaPct),
      costTotal: Math.round(dose * fert.costPerKg),
      notes,
      warnings
    };
  }
}
