/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: CaseEngine.js - Casos Integrales Universitarios, Investigación y Rúbricas Académicas
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { AudioFx, simEngine } from "../core/SimEngine.js";

export class CaseEngine {
  constructor({ storeInstance = store, simEngineInstance = simEngine } = {}) {
    this.store = storeInstance;
    this.simEngine = simEngineInstance;
    this.cases = [
      {
        id: "case_001",
        code: "CASO 001 — CRISIS EN EL HATO LECHERO",
        category: "Nutrición + Semiología + Medicina de la Producción",
        difficulty: "Intermedio",
        species: "vaca",
        targetAnimalId: "cow_017",
        title: "Caída de producción láctea y alteración ruminal en lote de alta producción",
        context: `
          En la Granja Escuela, el lote de vacas Holstein de alta producción presenta una caída del 22% en la producción láctea diaria durante la última semana. 
          El ordeñador reporta heces demasiado blandas con presencia de granos de maíz enteros sin digerir. 
          La Vaca #017 ha reducido su producción de 24 L a 18.5 L/día y se observa apática con menor tiempo de rumiación.
        `,
        anamnesis: {
          symptoms: "Apatía leve, heces acuosas (Grado 1-2), reducción del 25% en rumiación.",
          dietIssue: "Ración actual con 60% Maíz molido, 35% Soya y solo 5% forraje (Déficit severo de FDN efectiva).",
          vitalsFound: { temp: 38.8, heartRate: 74, respRate: 28, rumenMotility: 1.0, feces: "Acuosas y espumosas con olor ácido" }
        },
        hypotheses: [
          { id: "sara", label: "Acidosis Ruminal Subaguda (SARA) por exceso de carbohidratos fermentables y déficit de FDN", isCorrect: true },
          { id: "mastitis", label: "Mastitis clínica aguda por coliformes", isCorrect: false },
          { id: "ketosis", label: "Cetosis tipo I por déficit energético severo", isCorrect: false },
          { id: "parasitosis", label: "Fasciolosis hepática aguda", isCorrect: false }
        ],
        requiredDietAdjustment: {
          minFiber: 24, // % FDN
          maxMaiz: 40   // % Maíz
        },
        evaluationRubric: {
          diagnosis: 30,
          dietAdjustment: 35,
          clinicalProcedure: 20,
          welfareEconomic: 15
        }
      }
    ];

    this.activeCase = this.cases[0];
    this.studentAnswers = {
      selectedHypothesis: null,
      notes: "",
      dietAdjusted: false,
      treatmentApplied: false
    };
  }

  getCase(id) {
    return this.cases.find(c => c.id === id) || this.cases[0];
  }

  submitHypothesis(hypothesisId) {
    this.studentAnswers.selectedHypothesis = hypothesisId;
    AudioFx.click();
    store.emit("case:hypothesis_selected", hypothesisId);
  }

  evaluateStudentReport() {
    const c = this.activeCase;
    const ans = this.studentAnswers;
    const animal = store.get("animals")[c.targetAnimalId];
    const diets = store.get("diets");
    const currentDiet = diets[c.species] || {};
    const metrics = simEngine.computeDietMetrics(currentDiet);

    let scoreDiagnosis = 0;
    let scoreDiet = 0;
    let scoreProcedure = 0;
    let scoreWelfare = 0;

    const feedback = [];

    // 1. Evaluación del Diagnóstico (30 pts)
    const correctHyp = c.hypotheses.find(h => h.isCorrect);
    if (ans.selectedHypothesis === correctHyp.id) {
      scoreDiagnosis = c.evaluationRubric.diagnosis;
      feedback.push("✅ <b>Diagnóstico certero:</b> Identificaste correctamente Acidosis Ruminal Subaguda (SARA) inducida por sobrecarga de almidón y baja fibra físicamente efectiva.");
    } else {
      scoreDiagnosis = 8;
      feedback.push("❌ <b>Error diagnóstico:</b> El cuadro clínico (heces ácidas, baja motilidad ruminal y dieta alta en concentrado) correspondía a SARA.");
    }

    // 2. Evaluación del Ajuste Nutricional (35 pts)
    if (metrics.fiber >= c.requiredDietAdjustment.minFiber && (currentDiet.maiz || 0) <= c.requiredDietAdjustment.maxMaiz) {
      scoreDiet = c.evaluationRubric.dietAdjustment;
      feedback.push("✅ <b>Formulación Zootécnica Óptima:</b> Incrementaste el forraje (FDN > 24%) y redujiste el maíz a niveles seguros, estabilizando el pH ruminal.");
    } else {
      scoreDiet = 12;
      feedback.push("⚠️ <b>Ajuste nutricional insuficiente:</b> La ración aún no alcanza suficiente fibra efectiva (>24% FDN) o mantiene exceso de almidón.");
    }

    // 3. Procedimiento Clínico / Terapéutico (20 pts)
    if (animal.health >= 85) {
      scoreProcedure = c.evaluationRubric.clinicalProcedure;
      feedback.push("✅ <b>Manejo Clínico Adecuado:</b> Las constantes vitales del paciente se mantuvieron estables y el estrés se redujo.");
    } else {
      scoreProcedure = 10;
      feedback.push("⚠️ <b>Manejo Clínico con Observaciones:</b> El animal aún muestra signos de estrés o leve alteración de constantes fisiológicas.");
    }

    // 4. Bienestar y Eficiencia Económica (15 pts)
    scoreWelfare = c.evaluationRubric.welfareEconomic;
    feedback.push("✅ <b>Impacto Económico Positivo:</b> La corrección de la dieta recupera la curva de lactancia y evita descartes tempranos.");

    const totalScore = scoreDiagnosis + scoreDiet + scoreProcedure + scoreWelfare;

    const report = {
      caseId: c.id,
      caseCode: c.code,
      date: new Date().toLocaleDateString("es-ES"),
      studentScore: totalScore,
      breakdown: {
        diagnostico: scoreDiagnosis,
        nutricion: scoreDiet,
        clinica: scoreProcedure,
        bienestar: scoreWelfare
      },
      feedback,
      passed: totalScore >= 70
    };

    // Guardar en expediente del estudiante
    const academic = store.get("academic");
    academic.scores.semiologia = Math.round((academic.scores.semiologia + scoreDiagnosis) / 2);
    academic.scores.nutricion = Math.round((academic.scores.nutricion + scoreDiet) / 2);
    academic.caseReports.push(report);
    store.saveStudentProgress();

    if (report.passed) AudioFx.success();
    else AudioFx.warning();

    store.emit("case:evaluated", report);
    return report;
  }
}

export const caseEngine = new CaseEngine();
