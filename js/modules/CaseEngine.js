/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Module: CaseEngine.js - Simulador de Casos Clínicos Universitarios Reales (Tipo Examen)
 * Anamnesis, Exploración Física, Laboratorio, Diagnóstico Diferencial, Farmacología y Rúbricas
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { AudioFx, simEngine } from "../core/SimEngine.js";
import { achievements } from "../core/Achievements.js";

export const UNIVERSITY_CLINICAL_CASES = [
  {
    id: "case_001",
    code: "CASO 001 — SARA & CRISIS RUMINAL",
    category: "Bovinos · Medicina de la Producción & Nutrición",
    difficulty: "Intermedio",
    species: "vaca",
    targetAnimalId: "cow_017",
    title: "Caída brusca de producción láctea y heces ácidas en lote de alta producción",
    anamnesis: {
      patient: "Vaca #017 'Margarita' (Holstein, 525 kg, 45 días en lactancia)",
      history: "El hato lechero presenta una caída del 22% en producción durante los últimos 6 días. El encargado aumentó el concentrado comercial a 12 kg/día para 'estimular el pico de leche'.",
      symptoms: "Apatía, reducción del 30% en tiempo de rumia, heces pastosas grado 1-2 con burbujas de gas y granos de maíz enteros sin digerir.",
      vitals: { temp: "38.7 °C (Normal)", fc: "72 lpm", fr: "26 rpm", rumen: "1 movimiento cada 2 min (Hipomotilidad)", phRuminal: "5.3 (Acidótico)" }
    },
    labFindings: {
      hemograma: "Hematocrito 34%, Leucocitos 8,500/μL (Normales).",
      grasaLeche: "Caída de grasa láctea de 3.8% a 2.7% (Inversión grasa/proteína).",
      orina: "pH urinario 6.2 (Orina ácida compensatoria)."
    },
    hypotheses: [
      { id: "sara", label: "Acidosis Ruminal Subaguda (SARA) por sobrecarga de almidón y déficit de fibra efectiva (FDNpe)", isCorrect: true, why: "El exceso de carbohidratos fermentables y la baja fibra reducen la masticación, salivación y tamponamiento con bicarbonato ruminal." },
      { id: "mastitis", label: "Mastitis hiperaguda por coliformes", isCorrect: false, why: "La ubre no presenta inflamación, calor, dolor ni grumos en la prueba de fondo negro." },
      { id: "cetosis", label: "Cetosis tipo I por déficit energético", isCorrect: false, why: "La cetosis cursa con hipoglucemia y cuerpos cetónicos elevados, no con heces espumosas y acidosis ruminal." },
      { id: "fasciola", label: "Fasciolosis hepática aguda", isCorrect: false, why: "No hay antecedentes de zonas inundadas ni daño hepático primario con ictericia." }
    ],
    treatmentQuestions: [
      {
        question: "¿Cuál es la intervención zootécnica y nutricional de choque recomendada?",
        options: [
          { id: "opt1", text: "Incrementar heno de fibra larga (> 26% FDN) y suministrar Bicarbonato de Sodio (150-200 g/vaca/día)", isCorrect: true },
          { id: "opt2", text: "Aumentar melaza y grano de maíz para aportar energía rápida", isCorrect: false },
          { id: "opt3", text: "Aplicar antibióticos intramusculares de amplio espectro", isCorrect: false }
        ]
      }
    ],
    rubricPoints: { diagnosis: 40, treatment: 40, reasoning: 20 }
  },
  {
    id: "case_002",
    code: "CASO 002 — EMERGENCIA CÓLICO EQUINO",
    category: "Equinos · Urgencias & Medicina Interna",
    difficulty: "Avanzado",
    species: "caballo",
    targetAnimalId: "horse_004",
    title: "Dolor visceral agudo, sudoración profusa e inquietud en caballo de deporte",
    anamnesis: {
      patient: "Equino #004 'Relámpago' (Criollo Colombiano, 460 kg, 5 años)",
      history: "Tras una jornada de entrenamiento intenso, el animal consumió agua muy fría y una ración abundante de avena en grano. Hace 2 horas inició con escarceo y revolcones.",
      symptoms: "Miradas continuas al flanco derecho, sudoración profusa en cuello y pecho, posición de caballo de madera (estirado), ausencia de borborigmos en cuadrante ileocecal.",
      vitals: { temp: "38.1 °C", fc: "68 lpm (Taquicardia por dolor)", fr: "28 rpm", tllc: "2.5 segundos", mucosas: "Congestivas / Enrojecidas" }
    },
    labFindings: {
      sondeo: "Sondeo nasogástrico: No se obtiene reflujo gástrico espontáneo inicial.",
      palpacion: "Palpación rectal: Distensión gaseosa moderada en ciego y flexura pélvica.",
      lactato: "Lactato en sangre: 2.1 mmol/L (Leve elevación)."
    },
    hypotheses: [
      { id: "colico_espasmadico", label: "Cólico Espasmódico / Timpanismo Cecal Primario", isCorrect: true, why: "La sobrecarga de granos y el estrés térmico generaron hipermotilidad segmentaria y acúmulo de gas en ciego." },
      { id: "torsion_colon", label: "Torsión / Vólvulo de colon mayor de 360° (Quirúrgico)", isCorrect: false, why: "El lactato es menor a 4 mmol/L y la FC no supera los 80 lpm; aún no hay compromiso isquémico estrangulante." },
      { id: "rabdomiolisis", label: "Miositis / Enfermedad de los lunes (Azoturia)", isCorrect: false, why: "No presenta rigidez muscular masiva de grupa ni orina color café (mioglobinuria)." }
    ],
    treatmentQuestions: [
      {
        question: "¿Cuál es el protocolo analgésico y de soporte médico de primera elección?",
        options: [
          { id: "opt1", text: "Flunixin Meglumina (1.1 mg/kg IV lenta) + Fluidoterapia con Ringer Lactato y caminata suave", isCorrect: true },
          { id: "opt2", text: "Inyección intramuscular profunda de Dexametasona a dosis alta", isCorrect: false },
          { id: "opt3", text: "Suministrar concentrado caliente y forzar al caballo a galopar", isCorrect: false }
        ]
      }
    ],
    rubricPoints: { diagnosis: 40, treatment: 40, reasoning: 20 }
  },
  {
    id: "case_003",
    code: "CASO 003 — NEUMONÍA BACTERIANA EN TERNERO",
    category: "Bovinos · Infectología & Farmacología",
    difficulty: "Intermedio",
    species: "vaca",
    targetAnimalId: "cow_017",
    title: "Síndrome respiratorio febril y estertores en ternero de recría",
    anamnesis: {
      patient: "Ternero #052 (Macho Holstein, 110 kg, 3 meses)",
      history: "Lote destetado hace 10 días y trasladado durante una tormenta fría. 4 terneros presentan tos húmeda y decaimiento.",
      symptoms: "Secreción nasal mucopurulenta bilateral, respiración abdominal disneica con cabeza extendida, tos frecuente al caminar.",
      vitals: { temp: "40.6 °C (Hipertermia / Fiebre marcada)", fc: "96 lpm", fr: "54 rpm (Taquipnea)", auscultacion: "Estertores crepitantes y sibilancias en campos pulmonares craneo-ventrales." }
    },
    labFindings: {
      hemograma: "Leucocitosis de 24,000 /μL con Neutrofilia (16,000 /μL) y Bandas elevadas (1,200 /μL). Desviación a la izquierda regenerativa.",
      microbiologia: "Aislamiento por hisopado traqueal: Mannheimia haemolytica."
    },
    hypotheses: [
      { id: "erbbov", label: "Complejo Respiratorio Bovino (Neumonía bacteriana por Mannheimia haemolytica)", isCorrect: true, why: "Fiebre alta, secreción mucopurulenta, estertores craneo-ventrales y leucocitosis con desviación a la izquierda confirman bronconeumonía bacteriana." },
      { id: "ibr", label: "Rinotraqueítis Infecciosa Bovina (IBR pura no complicada)", isCorrect: false, why: "El cuadro presenta compromiso alveolar profundo bacteriano con exudado purulento." },
      { id: "timpanismo", label: "Timpanismo espumoso agudo", isCorrect: false, why: "El problema es del tracto respiratorio inferior y no del rumen." }
    ],
    treatmentQuestions: [
      {
        question: "¿Cuál es la pauta antimicrobiana y antiinflamatoria de elección respetando tiempos de retiro?",
        options: [
          { id: "opt1", text: "Oxitetraciclina L.A. (20 mg/kg IM) o Ceftiofur (1.1-2.2 mg/kg SC) + Meloxicam (0.5 mg/kg SC)", isCorrect: true },
          { id: "opt2", text: "Ivermectina al 1% por vía intravenosa rápida", isCorrect: false },
          { id: "opt3", text: "Únicamente suero oral sin antibióticos", isCorrect: false }
        ]
      }
    ],
    rubricPoints: { diagnosis: 40, treatment: 40, reasoning: 20 }
  },
  {
    id: "case_004",
    code: "CASO 004 — FIEBRE DE LECHE / HIPOCALCEMIA",
    category: "Bovinos · Trastornos Metabólicos & Urgencias",
    difficulty: "Avanzado",
    species: "vaca",
    targetAnimalId: "cow_017",
    title: "Vaca de alta producción caída en decúbito esternal a las 24 horas del parto",
    anamnesis: {
      patient: "Vaca #008 'Paloma' (Jersey pura, 440 kg, 4° parto)",
      history: "Parió un ternero vigoroso ayer en la madrugada. En el ordeño de la mañana produjo 18 L de calostro. Hace 2 horas no logra levantarse.",
      symptoms: "Decúbito esternal con la cabeza inclinada hacia el flanco (postura en 'S'), extremidades y orejas frías al tacto, atonía ruminal completa, pupilas dilatadas (midriasis).",
      vitals: { temp: "37.2 °C (Hipotermia)", fc: "48 lpm (Sonidos cardíacos apagados y débiles)", fr: "16 rpm", heces: "Ausencia de defecación (Atonía rectal)." }
    },
    labFindings: {
      calcioSerico: "Calcio ionizado: 4.2 mg/dL (Severamente disminuido; referencia normal: 8.5–10.5 mg/dL).",
      fosforo: "Fósforo sérico: 2.1 mg/dL (Hipofosfatemia concomitante)."
    },
    hypotheses: [
      { id: "hipocalcemia", label: "Paresia Puerperal / Hipocalcemia Clínica (Fiebre de Leche Fase II)", isCorrect: true, why: "La gran demanda de calcio para síntesis de calostro provocó colapso en la transmisión neuromuscular y contractilidad muscular." },
      { id: "fractura_cadera", label: "Fractura de pelvis / luxación coxofemoral posparto", isCorrect: false, why: "No hay asimetría ósea, crepitación ni reflejo de dolor focal; la hipotermia y midriasis son sistémicas." },
      { id: "botulismo", label: "Botulismo por ingestión de toxina", isCorrect: false, why: "Ocurrencia típica posparto inmediato por colostrogénesis, típica de hipocalcemia aguda." }
    ],
    treatmentQuestions: [
      {
        question: "¿Cómo debe administrarse el Gluconato de Calcio al 20% para evitar un paro cardíaco fatal?",
        options: [
          { id: "opt1", text: "Infusión intravenosa lenta (20-30 min) a temperatura corporal con auscultación cardíaca continua", isCorrect: true },
          { id: "opt2", text: "Inyección en bolo rápido IV en menos de 2 minutos", isCorrect: false },
          { id: "opt3", text: "Administración intramuscular masiva de 500 mL en un solo punto", isCorrect: false }
        ]
      }
    ],
    rubricPoints: { diagnosis: 40, treatment: 40, reasoning: 20 }
  },
  {
    id: "case_005",
    code: "CASO 005 — PARASITOSIS SEVERA & EDEMA OVINO",
    category: "Ovinos · Parasitología & Medicina de Pequeños Rumiantes",
    difficulty: "Intermedio",
    species: "oveja",
    targetAnimalId: "sheep_031",
    title: "Anemia marcada, edema submandibular y pérdida de peso en ovejas en pastoreo",
    anamnesis: {
      patient: "Oveja #031 'Blanquita' (Hampshire Down, 46 kg)",
      history: "Pastoreo continuo en potrero bajo y húmedo durante 4 meses sin rotación ni desparasitación.",
      symptoms: "Edema submandibular frío indoloro (mandíbula en botella), debilidad al pastoreo, mucosas conjuntivales blancas (FAMACHA 5).",
      vitals: { temp: "38.9 °C", fc: "92 lpm (Taquicardia compensatoria)", fr: "28 rpm", mucosas: "Blanco porcelana (Anemia severa)" }
    },
    labFindings: {
      hto: "Hematocrito: 11.5% (Críticamente bajo; ref: 27–45%).",
      coprologico: "Técnica McMaster: 3,400 HPG de huevos tipo Strongylida (Haemonchus contortus)."
    },
    hypotheses: [
      { id: "haemonchus", label: "Haemonchosis Gastrointestinal Hiperaguda (Haemonchus contortus)", isCorrect: true, why: "La hematofagia voraz del parásito genera anemia hipoproteinémica severa y caída de presión oncótica (edema submandibular)." },
      { id: "leptospirosis", label: "Leptospirosis aguda con hemoglobinuria", isCorrect: false, why: "No presenta ictericia ni orina roja/oscura por hemoglobinuria." },
      { id: "deficiencia_cobre", label: "Deficiencia nutricional de cobre pura (Enzootic Ataxia)", isCorrect: false, why: "La altísima carga parasitaria (3,400 HPG) y FAMACHA 5 explican completamente la pérdida sanguínea." }
    ],
    treatmentQuestions: [
      {
        question: "¿Cuál es el manejo terapéutico y antiparasitario indicado?",
        options: [
          { id: "opt1", text: "Antiparasitario específico (Levamisol o Ivermectina SC) + Terapia antianémica (Hierro Dextrano + Vit B12) y traslado a potrero limpio", isCorrect: true },
          { id: "opt2", text: "Suministrar únicamente sal blanca común sin fármacos", isCorrect: false },
          { id: "opt3", text: "Dejar a los animales en el mismo potrero húmedo para que creen inmunidad", isCorrect: false }
        ]
      }
    ],
    rubricPoints: { diagnosis: 40, treatment: 40, reasoning: 20 }
  }
];

export class CaseEngine {
  constructor({ storeInstance = store, simEngineInstance = simEngine } = {}) {
    this.store = storeInstance;
    this.simEngine = simEngineInstance;
    this.cases = UNIVERSITY_CLINICAL_CASES;
    this.activeCase = this.cases[0];

    this.studentAnswers = {
      selectedHypothesis: null,
      selectedTreatmentOpt: null,
      notes: ""
    };
  }

  selectCase(caseId) {
    const found = this.cases.find(c => c.id === caseId);
    if (found) {
      this.activeCase = found;
      this.studentAnswers = { selectedHypothesis: null, selectedTreatmentOpt: null, notes: "" };
      AudioFx.click();
      return this.activeCase;
    }
    return this.activeCase;
  }

  submitHypothesis(hypothesisId) {
    this.studentAnswers.selectedHypothesis = hypothesisId;
    AudioFx.click();
    this.store.emit("case:hypothesis_selected", hypothesisId);
  }

  submitTreatment(optionId) {
    this.studentAnswers.selectedTreatmentOpt = optionId;
    AudioFx.click();
  }

  evaluateStudentReport() {
    const c = this.activeCase;
    const ans = this.studentAnswers;

    let scoreDiagnosis = 0;
    let scoreTreatment = 0;
    let scoreReasoning = 20;

    const feedback = [];

    // 1. Diagnóstico
    const correctHyp = c.hypotheses.find(h => h.isCorrect);
    if (ans.selectedHypothesis === correctHyp?.id) {
      scoreDiagnosis = c.rubricPoints.diagnosis;
      feedback.push(`✅ <b>Diagnóstico Exacto (+${scoreDiagnosis} pts):</b> Has diagnosticado correctamente <b>${correctHyp.label}</b>.`);
    } else {
      scoreDiagnosis = 10;
      feedback.push(`❌ <b>Diagnóstico Incorrecto:</b> El cuadro clínico correspondía a <b>${correctHyp?.label}</b>.`);
    }

    // 2. Tratamiento
    const q1 = c.treatmentQuestions[0];
    const correctOpt = q1.options.find(o => o.isCorrect);
    if (ans.selectedTreatmentOpt === correctOpt?.id) {
      scoreTreatment = c.rubricPoints.treatment;
      feedback.push(`✅ <b>Terapéutica Correcta (+${scoreTreatment} pts):</b> Aplicaste el protocolo farmacológico y de manejo adecuado.`);
    } else {
      scoreTreatment = 10;
      feedback.push(`⚠️ <b>Terapéutica Inadecuada:</b> La conducta indicada era: ${correctOpt?.text}.`);
    }

    const totalScore = scoreDiagnosis + scoreTreatment + scoreReasoning;
    const passed = totalScore >= 70;

    const report = {
      caseId: c.id,
      caseCode: c.code,
      caseTitle: c.title,
      date: new Date().toLocaleDateString("es-ES"),
      studentScore: totalScore,
      breakdown: {
        diagnostico: scoreDiagnosis,
        tratamiento: scoreTreatment,
        razonamiento: scoreReasoning
      },
      feedback,
      passed
    };

    // Guardar en el expediente académico
    const academic = this.store.get("academic") || {};
    academic.scores = academic.scores || {};
    academic.scores.semiologia = Math.round(((academic.scores.semiologia || 70) + scoreDiagnosis) / 2);
    academic.scores.clinica = Math.round(((academic.scores.clinica || 75) + scoreTreatment) / 2);
    academic.caseReports = academic.caseReports || [];
    academic.caseReports.unshift(report);
    this.store.saveStudentProgress();

    // Notificar al motor de gamificación y logros
    achievements.recordCaseSolved(totalScore, c.id);

    if (passed) AudioFx.success();
    else AudioFx.warning();

    this.store.emit("case:evaluated", report);
    return report;
  }
}

export const caseEngine = new CaseEngine();
