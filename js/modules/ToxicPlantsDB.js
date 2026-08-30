/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: ToxicPlantsDB.js — Base de Datos de Plantas Tóxicas Regionales
 *
 * Catálogo de 18 plantas tóxicas tropicales/subtropicales de importancia
 * veterinaria con principio tóxico, signos clínicos, tratamiento y quiz.
 */

// ─── Catálogo de Plantas Tóxicas ─────────────────────────────────────
export const TOXIC_PLANTS_DATABASE = [
  {
    id: "brachiaria_decumbens",
    commonName: "Pasto Braquiaria / Señal",
    scientificName: "Brachiaria decumbens",
    icon: "🌾",
    region: ["Trópico bajo", "Llanos", "Orinoquia"],
    speciesAffected: ["Bovinos", "Ovinos", "Caprinos"],
    toxicPrinciple: "Saponinas esteroidales (Protodioscina) → cristales de espordesmin en ductos biliares",
    pathogenesis: "Las saponinas se metabolizan a sapogeninas que causan colestasis intrahepática. Los ácidos biliares se acumulan en sangre y la filoeritrina (producto de la degradación de la clorofila) no se excreta, depositándose en la piel donde reacciona a la luz UV.",
    clinicalSigns: "Fotosensibilización hepatógena: edema facial y de orejas, dermatitis en áreas despigmentadas, ictericia, pérdida de piel en morro y pezones, anorexia, pérdida de peso. En casos severos: hepatopatía fatal.",
    diagnosis: "Ictericia + lesiones cutáneas en áreas blancas + pastoreo en Brachiaria. ↑ GGT, ↑ AST, ↑ bilirrubina directa. Biopsia hepática: cristales birrefringentes en ductos biliares.",
    treatment: "Retirar inmediatamente del potrero de Brachiaria. Sombra obligatoria (evitar luz solar). Hepatoprotectores (Silibinina/Cardo Mariano). Fluidoterapia IV. Antiinflamatorios (Flunixin). Ungüentos cicatrizantes en lesiones cutáneas.",
    prevention: "Usar Brachiaria brizantha o humidicola (menor contenido de saponinas). Evitar B. decumbens con animales de piel blanca. Introducir gradualmente. Rotar a gramíneas limpias.",
    severity: "Alta",
    mortalityRange: "5-20%"
  },
  {
    id: "enterolobium",
    commonName: "Orejero / Piñón de Oreja",
    scientificName: "Enterolobium cyclocarpum",
    icon: "🌳",
    region: ["Trópico seco", "Valle del Magdalena", "Costa Caribe"],
    speciesAffected: ["Bovinos"],
    toxicPrinciple: "Saponinas triterpénicas en frutos (vainas maduras)",
    pathogenesis: "Los frutos caen al suelo y son consumidos por bovinos. Las saponinas causan hemólisis intravascular y hepatotoxicidad. Se potencia con deshidratación.",
    clinicalSigns: "Hemoglobinuria (orina rojo-oscuro), ictericia, anemia aguda, aborto en vacas gestantes, timpanismo. Muerte en 24-72 horas en casos severos.",
    diagnosis: "Hemoglobinuria + ictericia + presencia de frutos de Enterolobium en potrero. Anemia regenerativa, ↑ bilirrubina indirecta.",
    treatment: "Fluidoterapia IV agresiva. Transfusión sanguínea si Hto < 12%. Hepatoprotectores. Retirar del potrero.",
    prevention: "Cercar árboles de Orejero o recoger frutos antes de que caigan. No introducir animales a potreros con frutos en el suelo.",
    severity: "Alta",
    mortalityRange: "10-40%"
  },
  {
    id: "crotalaria",
    commonName: "Cascabelillo / Maraquita",
    scientificName: "Crotalaria spp.",
    icon: "🌻",
    region: ["Trópico", "Subtropicales", "Llanos"],
    speciesAffected: ["Bovinos", "Equinos", "Porcinos", "Aves"],
    toxicPrinciple: "Alcaloides pirrolizidínicos (Monocrotalina, Retrosina)",
    pathogenesis: "Los alcaloides pirrolizidínicos se bioactivan en el hígado a pirroles reactivos que alquilan el ADN de hepatocitos, causando megalocitosis y veno-oclusión hepática progresiva.",
    clinicalSigns: "Intoxicación crónica: pérdida progresiva de peso, ictericia, edema submandibular (quijada de botella), ascitis, fotosensibilización secundaria. Curso clínico de semanas a meses. Muerte por insuficiencia hepática.",
    diagnosis: "Pérdida de peso crónica + ictericia + hígado endurecido. Biopsia: megalocitosis, fibrosis periportal, veno-oclusión.",
    treatment: "No existe tratamiento efectivo una vez instalada la fibrosis hepática. Soporte nutricional. Hepatoprotectores paliativos.",
    prevention: "Erradicar Crotalaria del potrero. No usar heno contaminado. Vigilar especialmente en sequía cuando los animales consumen plantas que normalmente rechazan.",
    severity: "Muy Alta",
    mortalityRange: "50-90%"
  },
  {
    id: "pteridium",
    commonName: "Helecho Macho / Helecho Común",
    scientificName: "Pteridium aquilinum",
    icon: "🌿",
    region: ["Trópico alto", "Zona Andina", "Serranía"],
    speciesAffected: ["Bovinos"],
    toxicPrinciple: "Ptaquilósido (sesquiterpeno norsesquiterpénico) + Tiaminasa",
    pathogenesis: "El ptaquilósido es un carcinógeno que daña la médula ósea y la pared vesical. La tiaminasa destruye la vitamina B1. Intoxicación aguda: aplasia medular → pancitopenia. Intoxicación crónica: hematuria enzoótica (tumores vesicales).",
    clinicalSigns: "Aguda: fiebre alta, hemorragias petequiales y equimóticas en mucosas, hematuria, melena, epistaxis, muerte por hemorragia o sepsis. Crónica: hematuria intermitente crónica, anemia progresiva, pérdida de peso, tumores vesicales.",
    diagnosis: "Aguda: pancitopenia + hemorragias + pastoreo en helecho. Crónica: hematuria + cistoscopia con masas vesicales.",
    treatment: "Aguda: Transfusión sanguínea, antibioterapia de amplio espectro, vitamina B1 (Tiamina 10 mg/kg IV). Crónica: No hay tratamiento efectivo; sacrificio sanitario.",
    prevention: "Erradicar helechos mediante encalado (subir pH > 6.5) y siembra de gramíneas competitivas. Suplementar con heno en sequías.",
    severity: "Muy Alta",
    mortalityRange: "30-80% (aguda), crónica: progresiva"
  },
  {
    id: "ricinus",
    commonName: "Higuerilla / Ricino",
    scientificName: "Ricinus communis",
    icon: "🌰",
    region: ["Trópico", "Subtropical", "Zonas periurbanas"],
    speciesAffected: ["Bovinos", "Equinos", "Ovinos", "Caninos", "Aves"],
    toxicPrinciple: "Ricina (lectina tóxica tipo II) en semillas",
    pathogenesis: "La ricina inhibe la síntesis proteica ribosomal (inactiva la subunidad 60S), causando necrosis celular masiva en mucosa gastrointestinal, hígado y riñón.",
    clinicalSigns: "Diarrea hemorrágica profusa, cólico severo, deshidratación, postración, temblores musculares, convulsiones. Muerte en 12-48 horas. DL50 equina: ~0.1 mg/kg.",
    diagnosis: "Diarrea hemorrágica aguda + acceso a Ricinus. Necropsia: enteritis hemorrágica, necrosis hepática centrolobulillar.",
    treatment: "No hay antídoto específico. Descontaminación GI (carbón activado si ingesta reciente). Fluidoterapia IV agresiva. Protectores de mucosa.",
    prevention: "Eliminar plantas de Ricinus de potreros y alrededores. Las semillas son la parte más tóxica.",
    severity: "Muy Alta",
    mortalityRange: "60-100%"
  },
  {
    id: "lantana",
    commonName: "Lantana / Venturosa / Cariaquillo",
    scientificName: "Lantana camara",
    icon: "🌺",
    region: ["Trópico", "Subtropical", "Zonas degradadas"],
    speciesAffected: ["Bovinos", "Ovinos", "Equinos"],
    toxicPrinciple: "Lantadenos A y B (triterpenos pentacíclicos hepatotóxicos)",
    pathogenesis: "Los lantadenos causan necrosis periportal hepática severa, colestasis y acumulación de filoeritrina → fotosensibilización hepatógena secundaria.",
    clinicalSigns: "Anorexia, constipación seguida de diarrea, ictericia progresiva, fotosensibilización en áreas despigmentadas, edema facial, estasis ruminal, insuficiencia hepato-renal.",
    diagnosis: "Ictericia + fotosensibilización + ingesta de Lantana. ↑ GGT (>5x), ↑ bilirrubina, ↑ AST.",
    treatment: "Retirar del potrero. Sombra. Fluidoterapia. Purgantes salinos (sulfato de magnesio PO). Hepatoprotectores. Pronóstico reservado si GGT >10x.",
    prevention: "Control mecánico y químico de Lantana. No introducir animales hambrientos a potreros invadidos.",
    severity: "Alta",
    mortalityRange: "20-50%"
  },
  {
    id: "senecio",
    commonName: "Hierba Cana / Senecio",
    scientificName: "Senecio spp.",
    icon: "🌼",
    region: ["Zona Andina", "Altiplano", "Zonas templadas"],
    speciesAffected: ["Bovinos", "Equinos", "Ovinos"],
    toxicPrinciple: "Alcaloides pirrolizidínicos (Senecionina, Jacobina, Retrorsina)",
    pathogenesis: "Similar a Crotalaria. Bioactivación hepática → pirroles reactivos → megalocitosis + fibrosis + veno-oclusión.",
    clinicalSigns: "Curso crónico insidioso: pérdida progresiva de peso, ictericia, encefalopatía hepática (caminar en círculos, presión de cabeza contra objetos, agresividad), ascitis, fotosensibilización.",
    diagnosis: "Signos neurológicos + hepáticos + exposición a Senecio. Biopsia: megalocitosis patognomónica.",
    treatment: "Irreversible una vez establecida la fibrosis. Soporte paliativo únicamente.",
    prevention: "Control químico de Senecio. Evitar heno contaminado (los alcaloides persisten en material seco).",
    severity: "Muy Alta",
    mortalityRange: "70-100% una vez sintomático"
  },
  {
    id: "nerium",
    commonName: "Laurel Rosa / Adelfa",
    scientificName: "Nerium oleander",
    icon: "🌸",
    region: ["Zonas urbanas", "Ornamental", "Todo clima"],
    speciesAffected: ["Bovinos", "Equinos", "Ovinos", "Caninos", "Felinos"],
    toxicPrinciple: "Glucósidos cardíacos (Oleandrina, Neriina, Digitoxigenina)",
    pathogenesis: "Inhiben la bomba Na+/K+-ATPasa cardíaca → aumento de calcio intracelular → arritmias y bloqueos cardíacos fatales.",
    clinicalSigns: "Bradicardia severa, arritmias (bloqueo AV), diarrea, cólico, temblores, hipotermia, muerte súbita. Una sola hoja puede matar un ovino.",
    diagnosis: "Arritmias + exposición a Nerium. ECG: bradicardia sinusal, bloqueo AV de 2° o 3° grado, fibrilación ventricular.",
    treatment: "Atropina (0.04 mg/kg IV) para bradicardia. Carbón activado si ingesta reciente. Antiarrítmicos (Lidocaína para taquiarritmias ventriculares). Fluidoterapia. Pronóstico grave.",
    prevention: "No plantar Nerium en potreros ni cerca de corrales. Todas las partes son tóxicas, incluso secas.",
    severity: "Extrema",
    mortalityRange: "50-90%"
  },
  {
    id: "asclepias",
    commonName: "Algodoncillo / Quiebra Muelas",
    scientificName: "Asclepias curassavica",
    icon: "🧡",
    region: ["Trópico", "Subtropical"],
    speciesAffected: ["Bovinos", "Equinos", "Ovinos"],
    toxicPrinciple: "Cardenólidos (Asclepiadina) — glucósidos cardiotóxicos",
    pathogenesis: "Mecanismo similar a Nerium: inhibición de Na+/K+-ATPasa cardíaca.",
    clinicalSigns: "Arritmias, bradicardia, debilidad muscular, diarrea, midriasis, convulsiones terminales. Muerte rápida.",
    diagnosis: "Clínica cardíaca + presencia de la planta con flores naranjas/rojas características.",
    treatment: "Atropina IV. Carbón activado. Soporte cardiovascular.",
    prevention: "Erradicar de potreros. Es una mala hierba frecuente en bordes de caminos.",
    severity: "Alta",
    mortalityRange: "40-80%"
  },
  {
    id: "cestrum",
    commonName: "Dama de Noche / Jazmín de Noche",
    scientificName: "Cestrum spp. (C. laevigatum, C. parqui)",
    icon: "🌙",
    region: ["Zona Andina", "Trópico medio", "Valles interandinos"],
    speciesAffected: ["Bovinos"],
    toxicPrinciple: "Carboxiatractilosido (inhibidor de la translocasa de adenin nucleótidos mitocondrial)",
    pathogenesis: "Bloquea el transporte de ADP/ATP en la mitocondria → necrosis hepática centrolobulillar masiva aguda.",
    clinicalSigns: "Muerte súbita o curso hiperagudo (12-24h): anorexia, estasis ruminal, ictericia fulminante, hemorragias, encefalopatía hepática, colapso.",
    diagnosis: "Muerte aguda + hígado amarillo-anaranjado friable en necropsia. ↑↑↑ ALT, AST.",
    treatment: "Raramente efectivo por la rapidez del curso. Fluidoterapia y hepatoprotectores si se detecta a tiempo.",
    prevention: "Erradicar de potreros especialmente en sequía.",
    severity: "Extrema",
    mortalityRange: "70-100%"
  },
  {
    id: "ipomea",
    commonName: "Batatilla / Bejuco Loco",
    scientificName: "Ipomoea carnea",
    icon: "💜",
    region: ["Trópico seco", "Semiárido", "Caribe"],
    speciesAffected: ["Bovinos", "Caprinos", "Ovinos"],
    toxicPrinciple: "Swainsonina (alcaloide indolizidínico) — inhibidor de α-manosidasa",
    pathogenesis: "La swainsonina inhibe la α-manosidasa lisosomal → acumulación de oligomanósidos → vacuolización celular generalizada (enfermedad de almacenamiento lisosomal adquirida).",
    clinicalSigns: "Intoxicación crónica: incoordinación progresiva (ataxia cerebelosa), tremores de intención, caídas, pérdida de peso, infertilidad, abortos, malformaciones congénitas en crías.",
    diagnosis: "Ataxia cerebelosa + pastoreo crónico en Ipomoea. Histopatología: vacuolización citoplasmática en neuronas de Purkinje.",
    treatment: "Retirar del potrero. Recuperación parcial en casos leves. Daño neuronal irreversible en casos avanzados.",
    prevention: "Control mecánico/químico. Es adictiva: los animales desarrollan preferencia por la planta.",
    severity: "Alta",
    mortalityRange: "20-40% (crónica)"
  },
  {
    id: "senna",
    commonName: "Bicho / Café Cimarrón / Dormidera",
    scientificName: "Senna occidentalis (= Cassia occidentalis)",
    icon: "☕",
    region: ["Trópico", "Subtropical", "Zonas degradadas"],
    speciesAffected: ["Bovinos", "Porcinos", "Equinos", "Aves"],
    toxicPrinciple: "Diantrona + Toxoalbúminas en semillas",
    pathogenesis: "Las toxinas causan necrosis muscular esquelética segmentaria (miopatía tóxica nutricional) y necrosis hepática.",
    clinicalSigns: "Debilidad muscular progresiva, mioglobinuria (orina oscura), ataxia, decúbito, ictericia. ↑↑ CK, ↑↑ AST. Muerte por insuficiencia renal mioglobinúrica.",
    diagnosis: "Mioglobinuria + debilidad + acceso a semillas de Senna. ↑ CK >10,000 UI/L.",
    treatment: "Fluidoterapia IV (prevenir falla renal). Vitamina E + Selenio. Retirar de la fuente. Pronóstico reservado.",
    prevention: "Erradicar la planta. Evitar contaminar concentrados con semillas.",
    severity: "Alta",
    mortalityRange: "30-60%"
  },
  {
    id: "solanum",
    commonName: "Hierba Mora / Tomatillo",
    scientificName: "Solanum nigrum / S. pseudocapsicum",
    icon: "🍇",
    region: ["Cosmopolita", "Zonas cultivadas"],
    speciesAffected: ["Bovinos", "Ovinos", "Porcinos", "Caninos"],
    toxicPrinciple: "Solanina y Solanidina (glucoalcaloides esteroidales)",
    pathogenesis: "Los glucoalcaloides inhiben la acetilcolinesterasa y dañan la mucosa gastrointestinal.",
    clinicalSigns: "Salivación, diarrea, anorexia, incoordinación, tremores, midriasis, depresión del SNC.",
    diagnosis: "Signos GI + neurológicos + acceso a frutos verdes de Solanum.",
    treatment: "Carbón activado. Atropina si signos colinérgicos. Fluidoterapia.",
    prevention: "Control de malezas en potreros y huertas.",
    severity: "Moderada",
    mortalityRange: "5-15%"
  },
  {
    id: "fluoroacetato",
    commonName: "Palicourea / Cafecillo de Monte",
    scientificName: "Palicourea marcgravii",
    icon: "💀",
    region: ["Amazonia", "Orinoquia", "Selva tropical"],
    speciesAffected: ["Bovinos"],
    toxicPrinciple: "Ácido Monofluoracético (compuesto 1080)",
    pathogenesis: "El fluoroacetato bloquea la aconitasa del ciclo de Krebs → acumulación de citrato → depleción energética celular → muerte cardíaca y neuronal.",
    clinicalSigns: "Muerte súbita sin signos previos, o: taquicardia, arritmias, convulsiones, ejercicio → colapso y muerte. 'La planta que mata caminando'.",
    diagnosis: "Muerte súbita + pastoreo en zona selvática + presencia de Palicourea.",
    treatment: "No existe antídoto práctico efectivo en campo. Evitar estrés y ejercicio. Acetamida experimental.",
    prevention: "Cercar áreas con Palicourea. Nunca mover animales bruscamente en zonas endémicas.",
    severity: "Extrema",
    mortalityRange: "90-100%"
  },
  {
    id: "amorimia",
    commonName: "Tintín / Mindaca",
    scientificName: "Amorimia spp.",
    icon: "🍃",
    region: ["Trópico seco", "Nordeste"],
    speciesAffected: ["Bovinos", "Caprinos"],
    toxicPrinciple: "Ácido Monofluoracético",
    pathogenesis: "Idéntico a Palicourea: bloqueo del ciclo de Krebs.",
    clinicalSigns: "Muerte súbita al ejercicio. Animales caen muertos al ser arreados.",
    diagnosis: "Muerte súbita + esfuerzo + zona con Amorimia.",
    treatment: "Sin antídoto práctico. Reposo absoluto.",
    prevention: "Erradicar. No arrear ganado en zonas contaminadas.",
    severity: "Extrema",
    mortalityRange: "90-100%"
  },
  {
    id: "mascagnia",
    commonName: "Cansaviejo / Corona de la Reina",
    scientificName: "Mascagnia rigida",
    icon: "👑",
    region: ["Trópico seco", "Semi-árido"],
    speciesAffected: ["Bovinos"],
    toxicPrinciple: "Ácido Monofluoracético",
    pathogenesis: "Bloqueo del ciclo de Krebs → falla cardíaca.",
    clinicalSigns: "Muerte súbita al esfuerzo. Jugular ingurgitada, edema pulmonar.",
    diagnosis: "Idéntico a Palicourea/Amorimia.",
    treatment: "No existe.",
    prevention: "Eliminar la planta de los potreros.",
    severity: "Extrema",
    mortalityRange: "85-100%"
  },
  {
    id: "manihot",
    commonName: "Yuca / Mandioca (follaje)",
    scientificName: "Manihot esculenta",
    icon: "🥔",
    region: ["Trópico", "Toda Latinoamérica"],
    speciesAffected: ["Bovinos", "Ovinos", "Porcinos"],
    toxicPrinciple: "Glucósidos cianogénicos (Linamarina → HCN por β-glucosidasa)",
    pathogenesis: "El HCN liberado bloquea la citocromo oxidasa (complejo IV mitocondrial) → hipoxia histotóxica celular.",
    clinicalSigns: "Disnea aguda, taquicardia, mucosas rojo-cereza (sangre no libera O₂), convulsiones, muerte en 30-60 minutos. Olor a almendras amargas en contenido ruminal.",
    diagnosis: "Disnea + mucosas rojo-cereza + acceso a follaje fresco de yuca. Prueba de papel picrosódico positiva en rumen.",
    treatment: "URGENTE: Tiosulfato de sodio 20% (30-40 mL IV) + Nitrito de sodio 1% (20 mL IV). Mecanismo: el nitrito genera metahemoglobina que captura el CN⁻; el tiosulfato lo convierte en tiocianato excretable.",
    prevention: "Marchitar/secar el follaje 48h antes de ofrecer (volatiliza el HCN). No dar follaje fresco recién cortado.",
    severity: "Muy Alta",
    mortalityRange: "60-90% sin tratamiento"
  },
  {
    id: "prosopis",
    commonName: "Algarrobo / Mesquite",
    scientificName: "Prosopis juliflora",
    icon: "🌲",
    region: ["Semi-árido", "Caribe seco", "Guajira"],
    speciesAffected: ["Bovinos", "Caprinos"],
    toxicPrinciple: "Juliprosopina (alcaloide piperidínico) en vainas",
    pathogenesis: "El alcaloide causa vacuolización neuronal del trigémino y núcleos motores → disfunción masticatoria progresiva.",
    clinicalSigns: "Intoxicación crónica por consumo >50% de la dieta en vainas: salivación excesiva, caída de alimento de la boca (parálisis masticatoria), protrusión lingual, emaciación. 'Cara torcida' o 'cabeza de borracho'.",
    diagnosis: "Disfunción masticatoria + consumo crónico de vainas de Prosopis. Histopatología: vacuolización del núcleo motor del trigémino.",
    treatment: "Irreversible. Retirar de la fuente. Soporte nutricional con sondaje.",
    prevention: "No permitir que las vainas superen el 30% de la dieta. Suplementar con otros forrajes.",
    severity: "Moderada (crónica)",
    mortalityRange: "10-30% por inanición"
  }
];

// ─── Quiz Clínicos de Plantas Tóxicas ─────────────────────────────────
export const TOXIC_PLANT_QUIZZES = [
  {
    id: "quiz_1",
    scenario: "Un hato de bovinos Holstein (predominantemente blancos) en un potrero de Brachiaria decumbens en el Piedemonte Llanero presenta edema facial bilateral, ictericia marcada y lesiones costrosas en morro, pezones y áreas despigmentadas. La GGT sérica es 5 veces el valor normal.",
    question: "¿Cuál es la causa más probable?",
    options: [
      { id: "a", text: "Fotosensibilización hepatógena por saponinas de Brachiaria decumbens" },
      { id: "b", text: "Intoxicación por Pteridium aquilinum (helecho macho)" },
      { id: "c", text: "Carbunco bacteridiano (Bacillus anthracis)" },
      { id: "d", text: "Fasciolosis hepática aguda" }
    ],
    correctId: "a",
    explanation: "La combinación de fotosensibilización en áreas despigmentadas + ictericia + pastoreo en B. decumbens + ↑GGT es clásica de intoxicación por saponinas esteroidales (Protodioscina). La filoeritrina no excretada se deposita en piel despigmentada y reacciona a la luz UV."
  },
  {
    id: "quiz_2",
    scenario: "Un equino de 8 años consume accidentalmente hojas de una planta ornamental con flores rosadas en el jardín del casco de la finca. A las 2 horas presenta bradicardia severa (20 lpm), arritmias detectadas al ECG (bloqueo AV de 2° grado), debilidad progresiva y sudoración.",
    question: "¿Qué planta es la más probable responsable?",
    options: [
      { id: "a", text: "Ricinus communis (Higuerilla)" },
      { id: "b", text: "Nerium oleander (Laurel rosa / Adelfa)" },
      { id: "c", text: "Lantana camara (Venturosa)" },
      { id: "d", text: "Crotalaria spp. (Cascabelillo)" }
    ],
    correctId: "b",
    explanation: "Los glucósidos cardíacos (Oleandrina) de Nerium oleander inhiben la Na+/K+-ATPasa cardíaca → bradicardia severa + bloqueo AV. Es la única planta de las opciones que causa cardiotoxicidad aguda con arritmias. Tratamiento: Atropina IV."
  },
  {
    id: "quiz_3",
    scenario: "Bovinos en un potrero montañoso de la cordillera andina presentan hemorragias petequiales en mucosas, epistaxis, hematuria y heces con melena. El hemograma revela pancitopenia severa (leucocitos 800/µL, plaquetas 12,000/µL, Hto 10%). Se observan abundantes helechos en el potrero.",
    question: "¿Cuál es el diagnóstico y el principio tóxico involucrado?",
    options: [
      { id: "a", text: "Intoxicación aguda por Pteridium aquilinum — Ptaquilósido (aplasia medular)" },
      { id: "b", text: "Hemoglobinuria bacilar por Clostridium haemolyticum" },
      { id: "c", text: "Intoxicación por Crotalaria — Alcaloides pirrolizidínicos" },
      { id: "d", text: "Babesiosis cerebral por Babesia bovis" }
    ],
    correctId: "a",
    explanation: "La pancitopenia + hemorragias generalizadas + presencia de helechos = intoxicación aguda por Ptaquilósido de Pteridium aquilinum. Este carcinógeno causa aplasia medular → pancitopenia fatal. La tiaminasa del helecho también causa deficiencia de B1."
  },
  {
    id: "quiz_4",
    scenario: "Un grupo de bovinos en zona selvática del Caquetá son arreados rápidamente y 3 caen muertos súbitamente durante el arreo. No presentaron signos previos. En la necropsia se observa: jugulares ingurgitadas, edema pulmonar, y el rumen contiene hojas de una planta de sotobosque.",
    question: "¿Qué planta y mecanismo son responsables?",
    options: [
      { id: "a", text: "Nerium oleander — Glucósidos cardíacos" },
      { id: "b", text: "Senna occidentalis — Miotoxinas" },
      { id: "c", text: "Palicourea marcgravii — Ácido monofluoracético (bloqueo del Ciclo de Krebs)" },
      { id: "d", text: "Cestrum laevigatum — Carboxiatractilosido" }
    ],
    correctId: "c",
    explanation: "Muerte súbita al ejercicio + zona amazónica = intoxicación por Ácido Monofluoracético de Palicourea marcgravii. El fluoroacetato bloquea la aconitasa del Ciclo de Krebs → depleción energética → falla cardíaca aguda. 'La planta que mata caminando'."
  },
  {
    id: "quiz_5",
    scenario: "Bovinos en un potrero donde se está cosechando yuca presentan disnea aguda severa, taquicardia, mucosas de color rojo-cereza intenso y convulsiones. Uno muere en 45 minutos. Al abrir el rumen se percibe olor a almendras amargas.",
    question: "¿Cuál es el tratamiento de emergencia correcto?",
    options: [
      { id: "a", text: "Flunixin Meglumine IV + Fluidoterapia" },
      { id: "b", text: "Nitrito de Sodio 1% IV + Tiosulfato de Sodio 20% IV" },
      { id: "c", text: "Atropina IV + Carbón activado PO" },
      { id: "d", text: "Dexametasona IV + Vitamina B1 IM" }
    ],
    correctId: "b",
    explanation: "Mucosas rojo-cereza + olor a almendras + yuca = intoxicación por HCN (ácido cianhídrico). El Nitrito de Sodio genera metahemoglobina que captura el CN⁻, y el Tiosulfato de Sodio lo convierte en tiocianato excretable por orina. Es el antídoto clásico para intoxicación cianídrica."
  }
];

// ─── Motor de Consulta ───────────────────────────────────────────────
export class ToxicPlantsEngine {
  constructor() {
    this.plants = TOXIC_PLANTS_DATABASE;
    this.quizzes = TOXIC_PLANT_QUIZZES;
    this.quizState = {
      currentQuizIndex: 0,
      answers: {},
      score: 0
    };
  }

  // Filtrar por especie afectada
  filterBySpecies(species) {
    return this.plants.filter(p => p.speciesAffected.includes(species));
  }

  // Filtrar por región
  filterByRegion(region) {
    const q = region.toLowerCase();
    return this.plants.filter(p => p.region.some(r => r.toLowerCase().includes(q)));
  }

  // Filtrar por severidad
  filterBySeverity(severity) {
    return this.plants.filter(p => p.severity === severity);
  }

  // Buscar por nombre
  search(query) {
    const q = query.toLowerCase();
    return this.plants.filter(p =>
      p.commonName.toLowerCase().includes(q) ||
      p.scientificName.toLowerCase().includes(q) ||
      p.toxicPrinciple.toLowerCase().includes(q)
    );
  }

  // Quiz
  getCurrentQuiz() {
    return this.quizzes[this.quizState.currentQuizIndex] || null;
  }

  submitQuizAnswer(quizId, answerId) {
    const quiz = this.quizzes.find(q => q.id === quizId);
    if (!quiz) return null;

    const correct = quiz.correctId === answerId;
    this.quizState.answers[quizId] = { answerId, correct };
    if (correct) this.quizState.score++;

    return {
      correct,
      correctAnswer: quiz.options.find(o => o.id === quiz.correctId).text,
      explanation: quiz.explanation
    };
  }

  nextQuiz() {
    if (this.quizState.currentQuizIndex < this.quizzes.length - 1) {
      this.quizState.currentQuizIndex++;
      return true;
    }
    return false;
  }

  resetQuiz() {
    this.quizState = { currentQuizIndex: 0, answers: {}, score: 0 };
  }

  getQuizSummary() {
    return {
      total: this.quizzes.length,
      answered: Object.keys(this.quizState.answers).length,
      correct: this.quizState.score,
      percent: Math.round((this.quizState.score / this.quizzes.length) * 100)
    };
  }

  // Estadísticas
  getSeverityCounts() {
    const counts = {};
    this.plants.forEach(p => {
      counts[p.severity] = (counts[p.severity] || 0) + 1;
    });
    return counts;
  }

  getUniqueSpecies() {
    const sp = new Set();
    this.plants.forEach(p => p.speciesAffected.forEach(s => sp.add(s)));
    return [...sp].sort();
  }

  getUniqueRegions() {
    const rg = new Set();
    this.plants.forEach(p => p.region.forEach(r => rg.add(r)));
    return [...rg].sort();
  }
}

export const toxicPlantsEngine = new ToxicPlantsEngine();
