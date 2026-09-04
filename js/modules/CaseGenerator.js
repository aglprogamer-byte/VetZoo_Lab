/**
 * Procedural case generator for VetZoo_Lab.
 * Creates coherent veterinary scenarios from compatible species, signs and contexts.
 */

export const SPECIES_PROFILES = {
    bovino: {
        label: "Bovino",
        animalNames: ["Luna", "Margarita", "Sol", "Nube", "Nieves", "Dalia", "Canelo", "Pampa"],
        ageRange: [8, 84],
        weightRange: [180, 650],
        sexes: ["Hembra", "Macho", "Macho castrado"],
        stagePool: ["lactancia", "engorde", "recría", "gestación", "secado"],
        productionPool: ["producción láctea", "crecimiento", "engorde", "reproducción", "resistencia corporal"],
        environmentPool: ["establo con forraje de mediana calidad", "potrero con exceso de pasto húmedo", "lote en transición", "hato en alta producción", "manada bajo manejo intensivo"],
        commonFindings: ["descenso en consumo", "temperatura ligeramente elevada", "disminución del brillo de la piel", "descenso del apetito", "pérdida de brillo de mucosas"]
    },
    equino: {
        label: "Equino",
        animalNames: ["Relámpago", "Viento", "Sombra", "Torino", "Aster", "Cielo", "Duna", "Fuego"],
        ageRange: [12, 120],
        weightRange: [220, 620],
        sexes: ["Macho castrado", "Hembra", "Macho"],
        stagePool: ["trabajo", "entrenamiento", "reproducción", "mantenimiento", "reposo"],
        productionPool: ["rendimiento deportivo", "condición corporal", "resistencia", "mantenimiento muscular", "adaptación fisiológica"],
        environmentPool: ["potrero con ejercicio intenso", "cuadra con cambio de ración", "manada deportiva bajo alta carga", "lote de trabajo con estrés ambiental", "caballeriza con manejo alternado"],
        commonFindings: ["inquietud", "sudoración", "disminución del apetito", "dificultad para caminar", "cojera variable"]
    },
    ovino: {
        label: "Ovino",
        animalNames: ["Blanquita", "Luna", "Rosa", "Chispa", "Nieve", "Mancha", "Ceniza", "Mora"],
        ageRange: [4, 60],
        weightRange: [20, 90],
        sexes: ["Hembra", "Macho", "Hembra gestante"],
        stagePool: ["gestación", "lactancia", "engorde", "recría", "mantenimiento"],
        productionPool: ["peso corporal", "ganancia diaria", "lactancia", "preñez", "reposición de condición"],
        environmentPool: ["potrero húmedo con sobrepastoreo", "lote en descanso con baja calidad de forraje", "rebaño con rotación insuficiente", "pradera con exceso de humedad", "grupo en manejo intensivo"],
        commonFindings: ["pérdida de peso", "edema submandibular", "mucosas pálidas", "debilidad al caminar", "descenso en consumo"]
    },
    caprino: {
        label: "Caprino",
        animalNames: ["Mora", "Nina", "Café", "Lana", "Tula", "Bramo", "Duna", "Vera"],
        ageRange: [6, 72],
        weightRange: [18, 80],
        sexes: ["Hembra", "Macho", "Hembra en lactancia"],
        stagePool: ["lactancia", "engorde", "gestación", "recría", "mantenimiento"],
        productionPool: ["leche", "ganancia de peso", "maternidad", "crecimiento", "adaptación al sistema"],
        environmentPool: ["corral seco con superficie húmeda", "rastrojo con baja disponibilidad de fibra", "lote de cabras en producción", "potrero con restricciones de agua", "manada con manejo discontinuo"],
        commonFindings: ["deshidratación", "diarrea", "ausencia de brillo", "temperatura elevada", "caída de consumo"]
    },
    porcino: {
        label: "Porcino",
        animalNames: ["Tomy", "Noni", "Bajo", "Foca", "Lomo", "Nala", "Beto", "Pipa"],
        ageRange: [4, 36],
        weightRange: [12, 120],
        sexes: ["Macho", "Hembra", "Macho castrado"],
        stagePool: ["crecimiento", "ceba", "gestación", "lactancia", "recuperación"],
        productionPool: ["ganancia diaria", "eficiencia de conversión", "crecimiento muscular", "maternidad", "adaptación nutricional"],
        environmentPool: ["corral de crecimiento con humedad alta", "lote de ceba con suelo sucio", "barraca de maternidad", "unidad con cambios de clima", "sección de recría con manejo variable"],
        commonFindings: ["descenso de consumo", "fiebre leve", "diarrea líquida", "taquipnea", "pérdida de uniformidad"]
    },
    ave: {
        label: "Ave",
        animalNames: ["Luz", "Maní", "Kiki", "Pepita", "Juno", "Mila", "Dona", "Skye"],
        ageRange: [3, 32],
        weightRange: [0.5, 3.5],
        sexes: ["Hembra", "Macho", "Pollo de reemplazo"],
        stagePool: ["crecimiento", "postura", "reproductivo", "recría", "engorde"],
        productionPool: ["postura", "peso vivo", "conversión alimenticia", "producción de huevos", "resistencia aviar"],
        environmentPool: ["gallinero con humedad alta", "sector de postura con ventilación deficiente", "galpón con temperaturas extremas", "caseta con corrosión de bebederos", "sala con manejo variable de aves"],
        commonFindings: ["disminución de consumo", "plumas opacas", "toses", "diarrea", "decaimiento"]
    },
    canino: {
        label: "Canino",
        animalNames: ["Niko", "Bruno", "Sasha", "Luna", "Yaco", "Puma", "Teo", "Nina"],
        ageRange: [8, 120],
        weightRange: [5, 35],
        sexes: ["Macho", "Hembra", "Macho castrado"],
        stagePool: ["trabajo", "mantenimiento", "reproducción", "vigilancia", "mantenimiento y cuidado"],
        productionPool: ["condición corporal", "actividad física", "salud general", "calidad de vida", "ejercicio"],
        environmentPool: ["vivienda con manejo doméstico", "área de ejercicio insuficiente", "condición sedentaria con sobrepeso", "ambiente de convivencia con otros animales", "manejo con cambios de rutina"],
        commonFindings: ["letargia", "inapetencia", "vómito", "sudoración mínima", "descenso de energía"]
    }
};

export const CONDITION_BANK = [
    { id: "diarrea", label: "Diarrea", severity: "moderada", focus: "digestivo", clue: "heces líquidas y pérdida de consistencia" },
    { id: "fiebre", label: "Fiebre", severity: "alta", focus: "sistémico", clue: "temperatura corporal elevada y decaimiento" },
    { id: "cojera", label: "Cojera", severity: "moderada", focus: "locomotor", clue: "marcha dolorosa o asimetría" },
    { id: "perdida_peso", label: "Pérdida de peso", severity: "moderada", focus: "productivo", clue: "condición corporal disminuida y mala reserva energética" },
    { id: "deshidratacion", label: "Deshidratación", severity: "alta", focus: "hidroelectrolítico", clue: "mucosas secas y pique de piel" },
    { id: "tos", label: "Tos", severity: "moderada", focus: "respiratorio", clue: "respiración acelerada y secreciones" },
    { id: "lesiones", label: "Lesiones cutáneas", severity: "moderada", focus: "dermatológico", clue: "erosiones, costras o irritación" },
    { id: "reproduccion", label: "Problemas reproductivos", severity: "moderada", focus: "reproductivo", clue: "alteraciones del ciclico o gestación" },
    { id: "parasitosis", label: "Parasitosis", severity: "moderada", focus: "parasitario", clue: "anemia, diarrea o brillo pobre" },
    { id: "intoxicacion", label: "Intoxicación", severity: "alta", focus: "toxicología", clue: "historia de acceso a agentes no adecuados" },
    { id: "caida_produccion", label: "Caída de producción", severity: "moderada", focus: "productivo", clue: "baja en producción o rendimiento" },
    { id: "mucosas", label: "Alteración de mucosas", severity: "moderada", focus: "general", clue: "cambio de color o humedad" }
];

const DIAGNOSTIC_LIBRARY = {
    bovino: [
        { id: "sara", label: "Acidosis ruminal subaguda", reason: "Exceso de carbohidratos fermentables y baja fibra efectiva" },
        { id: "mastitis", label: "Mastitis clínica", reason: "Inflamación intramamaria con cambios de consistencia y dolor" },
        { id: "neumonia", label: "Neumonía bacteriana", reason: "Cuadro respiratorio con fiebre y estertores" },
        { id: "hipocalcemia", label: "Paresia puerperal por hipocalcemia", reason: "Caída postparto por consumo de calcio y contractilidad muscular" },
        { id: "laminitis", label: "Laminitis por sobrecarga y manejo", reason: "Dolor podal y cambios de comodidad al caminar" }
    ],
    equino: [
        { id: "colico", label: "Cólico espasmódico", reason: "Distensión y dolor visceral por cambio de alimentación o estrés" },
        { id: "laminitis", label: "Laminitis", reason: "Dolor podal y sensibilidad al caminar" },
        { id: "colitis", label: "Colitis infecciosa", reason: "Alteración digestiva con lodo y disminución del apetito" },
        { id: "respiratorio", label: "Problema respiratorio agudo", reason: "Tos, estertores y fiebre compatible con infección" },
        { id: "rabdomiolisis", label: "Rabdomiólisis", reason: "Sobrecarga muscular y dolor con elevación de enzimas" }
    ],
    ovino: [
        { id: "haemonchosis", label: "Haemonchosis", reason: "Hematofagia intensa y anemia con edema submandibular" },
        { id: "lambing", label: "Problema reproductivo gestacional", reason: "Cambios en condición corporal y producción durante la preñez" },
        { id: "diarrea_infectiva", label: "Diarrea infecciosa", reason: "Desbalance digestivo y mala consistencia fecal" },
        { id: "acidosis", label: "Desequilibrio ruminal por exceso de concentrado", reason: "Bajo consumo, pérdida de peso y cambios de heces" },
        { id: "polineuropatia", label: "Deficiencia mineral o de energía", reason: "Pérdida de rendimiento y debilidad corporal" }
    ],
    caprino: [
        { id: "enteritis", label: "Enteritis infecciosa", reason: "Diarrea y deshidratación con pérdida del brillo del animal" },
        { id: "toxemia", label: "Toxemia por manejo o alimento", reason: "Mal manejo, desbalance nutricional y decaimiento" },
        { id: "masticitis", label: "Mastitis clínica", reason: "Cambio de la ubre con dolor y alteración de la leche" },
        { id: "parasitaria", label: "Parasitosis gastrointestinal", reason: "Pérdida de peso, anemia y mala condición" },
        { id: "metabolica", label: "Problema metabólico peri-parto", reason: "Alteración en lactancia o gestación con descenso del consumo" }
    ],
    porcino: [
        { id: "diarrea_porcina", label: "Diarrea neonatal o postdestete", reason: "Desbalance digestivo con heces acuosas y pérdida de peso" },
        { id: "neumonia_porcina", label: "Neumonía por estrés y manejo", reason: "Taquipnea, fiebre y mala respiración" },
        { id: "mastitis", label: "Mastitis en reproductora", reason: "Dolor, aumento de temperatura y mala calidad lechera" },
        { id: "parasitaria", label: "Parasitismo intestinal", reason: "Pérdida de productividad y diarrea" },
        { id: "alteracion_nutricional", label: "Desequilibrio nutricional", reason: "Ajuste inadecuado de energía y fibra en la ración" }
    ],
    ave: [
        { id: "resp_ave", label: "Enfermedad respiratoria aviar", reason: "Tos, estertores y baja producción de aves" },
        { id: "enteritis_ave", label: "Enteritis aviar", reason: "Diarrea y deshidratación con pérdida de consumo" },
        { id: "metabolica_ave", label: "Desequilibrio metabólico/digestivo", reason: "Pérdida de peso y rendimiento en lote" },
        { id: "parasitarios", label: "Parasitismo interno", reason: "Caída de producción y mala condición corporal" },
        { id: "lesiones", label: "Lesiones de piel o postura", reason: "Raspado, irritación y anomalías externas" }
    ],
    canino: [
        { id: "gastroenteritis", label: "Gastroenteritis", reason: "Vómito y diarrea con mala condición general" },
        { id: "parasitario", label: "Parasitismo interno", reason: "Pérdida de peso y brillo con anemia o diarrea" },
        { id: "respiratorio", label: "Infección respiratoria", reason: "Tos, decaimiento y baja actividad" },
        { id: "orina", label: "Problema urinario o metabólico", reason: "Cambio de hábito, sed y mala disponibilidad de agua" },
        { id: "injuria", label: "Lesión o dolor locomotor", reason: "Cojera, dolor al caminar y restricción de movimiento" }
    ]
};

function pick(list, index) {
    return list[index % list.length];
}

function getCaseLevel(index) {
    if (index < 35) return "Básico";
    if (index < 90) return "Intermedio";
    return "Avanzado";
}

export function buildProceduralCase(seedNumber = 1, overrides = {}) {
    const speciesKeys = Object.keys(SPECIES_PROFILES);
    const speciesKey = overrides.speciesKey || speciesKeys[seedNumber % speciesKeys.length];
    const species = SPECIES_PROFILES[speciesKey];
    const condition = overrides.condition || CONDITION_BANK[(seedNumber + 2) % CONDITION_BANK.length];
    const diagnosisPool = DIAGNOSTIC_LIBRARY[speciesKey] || DIAGNOSTIC_LIBRARY.bovino;
    const correctDiagnosis = overrides.correctDiagnosis || pick(diagnosisPool, seedNumber);

    const plant = pick(species.animalNames, seedNumber + 3);
    const ageMonths = Math.max(3, Math.round((Math.random() * (species.ageRange[1] - species.ageRange[0])) + species.ageRange[0]));
    const weight = Math.round((Math.random() * (species.weightRange[1] - species.weightRange[0])) + species.weightRange[0]);
    const sex = pick(species.sexes, seedNumber + 1);
    const stage = pick(species.stagePool, seedNumber + 5);
    const environment = pick(species.environmentPool, seedNumber + 7);
    const production = pick(species.productionPool, seedNumber + 11);
    const temperature = (36.8 + (Math.random() * 2.9)).toFixed(1);
    const fc = Math.round(48 + (Math.random() * 70));
    const fr = Math.round(12 + (Math.random() * 40));
    const bcs = (2.2 + (Math.random() * 1.6)).toFixed(2);

    const treatmentText = condition.id === "cojera"
        ? "Descansar y gestionar dolor, valorar higiene de pezuñas y carga de ejercicio."
        : condition.id === "fiebre"
            ? "Aislar, valorar signos clínicos y aplicar protocolo diagnóstico y terapéutico según foco sospechoso."
            : condition.id === "diarrea"
                ? "Corregir manejo, rehidratación y valorar aporte de fibra, agua y sanitización del ambiente."
                : condition.id === "parasitosis"
                    ? "Revisar carga parasitaria, manejo del pastoreo y tratamiento según resistencia y especie."
                    : condition.id === "intoxicacion"
                        ? "Retirar el agente causal, soporte general y evaluación de exposición ambiental."
                        : "Realizar manejo específico, ajuste de dieta y seguimiento de la respuesta clínica.";

    const vignette = `${species.label} ${sex.toLowerCase()} en ${stage}, con ${condition.label.toLowerCase()} y pérdida de ${production}. El animal se encuentra en ${environment}.`;
    const symptoms = `${condition.clue}; además presenta ${pick(species.commonFindings, seedNumber + 13)} y reducción en ${production}.`;
    const distractors = diagnosisPool.filter(item => item.id !== correctDiagnosis.id).slice(0, 2).map(item => ({
        id: item.id,
        label: item.label,
        isCorrect: false,
        why: `Este diagnóstico es plausible pero no explica mejor el conjunto de signos y el ambiente actual.`
    }));

    return {
        id: `case_proc_${String(seedNumber).padStart(4, "0")}`,
        code: `CASO ${String(seedNumber).padStart(4, "0")}`,
        category: `${species.label} · ${condition.label}`,
        difficulty: getCaseLevel(seedNumber),
        species: speciesKey,
        targetAnimalId: `${speciesKey}_${seedNumber}`,
        title: `${condition.label} en ${species.label.toLowerCase()} ${plant}`,
        context: vignette,
        anamnesis: {
            patient: `${species.label} ${plant} (${sex}, ${weight} kg, ${ageMonths} meses)`,
            history: `Animal en etapa de ${stage}. Durante los últimos días se observó ${condition.clue}. El ambiente es ${environment}.`,
            symptoms,
            dietIssue: `Se está manejando con ${production} bajo condiciones de ${environment}.`,
            vitals: {
                temp: `${temperature} °C`,
                fc: `${fc} lpm`,
                fr: `${fr} rpm`,
                bcs: `BCS ${bcs}`,
                condition: `${condition.label}`
            }
        },
        labFindings: {
            inspeccion: `Observación: ${pick(species.commonFindings, seedNumber + 17)} con cambio de comportamiento y ${condition.clue}.`,
            palpacion: `Evaluación regional: dolor y cambios compatibles con la presentación clínica del caso.`,
            mucosas: `${condition.focus === "digestivo" ? "Mucosas ligeramente pálidas, con sequedad moderada." : "Mucosas con cambios sutiles y brillo alterado."}`,
            heces: `${condition.id === "diarrea" ? "Heces líquidas y con olor característico, disminuyen la consistencia." : "Heces con cambio de consistencia pero no un cuadro agudo marcado."}`
        },
        hypotheses: [{
            id: `diag_${correctDiagnosis.id}`,
            label: correctDiagnosis.label,
            isCorrect: true,
            why: `${correctDiagnosis.reason}. Se correlaciona con el contexto clínico y los hallazgos de ${condition.label.toLowerCase()}.`
        }, ...distractors],
        treatmentQuestions: [{
            question: "¿Cuál es la conducta más adecuada para este caso?",
            options: [
                { id: "opt_a", text: treatmentText, isCorrect: true },
                { id: "opt_b", text: "Aplicar un plan sin explorar el contexto del animal ni la historia del manejo.", isCorrect: false },
                { id: "opt_c", text: "Ignorar la evaluación clínica y dar tratamiento empírico sin apoyo diagnóstico.", isCorrect: false }
            ]
        }],
        rubricPoints: { diagnosis: 40, treatment: 40, reasoning: 20 },
        proceduralMeta: {
            speciesKey,
            conditionId: condition.id,
            level: getCaseLevel(seedNumber),
            generatedAt: new Date().toISOString()
        }
    };
}

export function generateProceduralCases(count = 160) {
    const generated = [];
    const seen = new Set();
    for (let i = 1; i <= count; i++) {
        const caseItem = buildProceduralCase(100 + i, {
            speciesKey: Object.keys(SPECIES_PROFILES)[(i * 3) % Object.keys(SPECIES_PROFILES).length]
        });
        if (!seen.has(caseItem.id)) {
            seen.add(caseItem.id);
            generated.push(caseItem);
        }
    }
    return generated;
}

export default {
    SPECIES_PROFILES,
    CONDITION_BANK,
    buildProceduralCase,
    generateProceduralCases
};
