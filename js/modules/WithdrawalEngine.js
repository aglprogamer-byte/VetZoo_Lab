/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: WithdrawalEngine.js — Tiempos de Retiro Farmacológico
 *
 * Base de datos de 25+ fármacos veterinarios con tiempos de retiro
 * para carne y leche según vía de administración. Normativa ICA/SENASA.
 */

// ─── Base de Datos de Fármacos & Tiempos de Retiro ──────────────────
export const WITHDRAWAL_DATABASE = [
  {
    id: "ivermectina_1",
    name: "Ivermectina 1%",
    group: "Antiparasitario (Avermectina)",
    routes: {
      SC: { retiroCarne: 35, retiroLeche: null, nota: "No usar en vacas en producción láctea" },
      PO: { retiroCarne: 14, retiroLeche: null, nota: "Uso oral en pequeños rumiantes" }
    },
    species: ["Bovinos", "Ovinos", "Porcinos", "Equinos"],
    contraindications: "No usar en Collies ni razas MDR1 mutantes. Contraindicado en leche."
  },
  {
    id: "ivermectina_3.15",
    name: "Ivermectina 3.15% LA",
    group: "Antiparasitario (Avermectina larga acción)",
    routes: {
      SC: { retiroCarne: 42, retiroLeche: null, nota: "Formulación depot, mayor persistencia" }
    },
    species: ["Bovinos"],
    contraindications: "No usar en vacas lecheras. Residuos prolongados en tejido adiposo."
  },
  {
    id: "oxitetraciclina",
    name: "Oxitetraciclina 20% LA",
    group: "Antibiótico (Tetraciclina)",
    routes: {
      IM: { retiroCarne: 28, retiroLeche: 96, nota: "96 horas = 8 ordeños" },
      IV: { retiroCarne: 21, retiroLeche: 72, nota: "Administrar lentamente por vía IV" }
    },
    species: ["Bovinos", "Ovinos", "Porcinos"],
    contraindications: "Evitar en animales con insuficiencia hepática severa."
  },
  {
    id: "penicilina_estrepto",
    name: "Penicilina + Estreptomicina",
    group: "Antibiótico (β-Lactámico + Aminoglucósido)",
    routes: {
      IM: { retiroCarne: 30, retiroLeche: 72, nota: "Combinación clásica de amplio espectro" }
    },
    species: ["Bovinos", "Equinos", "Ovinos", "Porcinos"],
    contraindications: "Hipersensibilidad a penicilinas. Riesgo de anafilaxia."
  },
  {
    id: "enrofloxacina",
    name: "Enrofloxacina 5%",
    group: "Antibiótico (Fluoroquinolona)",
    routes: {
      SC: { retiroCarne: 14, retiroLeche: 96, nota: "No usar en animales en crecimiento (daño articular)" },
      IM: { retiroCarne: 14, retiroLeche: 96, nota: "Inyección intramuscular profunda" }
    },
    species: ["Bovinos", "Porcinos"],
    contraindications: "Contraindicado en animales jóvenes en crecimiento. Daño condral."
  },
  {
    id: "flunixin",
    name: "Flunixin Meglumine",
    group: "AINE (Inhibidor COX no selectivo)",
    routes: {
      IV: { retiroCarne: 4, retiroLeche: 36, nota: "Uso exclusivamente IV en bovinos" },
      IM: { retiroCarne: 30, retiroLeche: 36, nota: "Vía IM causa residuos prolongados en punto de inyección" }
    },
    species: ["Bovinos", "Equinos", "Porcinos"],
    contraindications: "No usar en animales deshidratados (nefrotoxicidad). Evitar IM si es posible."
  },
  {
    id: "meloxicam",
    name: "Meloxicam 2%",
    group: "AINE (Inhibidor COX-2 preferencial)",
    routes: {
      SC: { retiroCarne: 15, retiroLeche: 120, nota: "Menor riesgo GI que Flunixin" },
      IV: { retiroCarne: 15, retiroLeche: 120, nota: "Administrar lento" }
    },
    species: ["Bovinos", "Porcinos"],
    contraindications: "Evitar en gestación avanzada."
  },
  {
    id: "dexametasona",
    name: "Dexametasona 0.2%",
    group: "Corticoide (Glucocorticoide)",
    routes: {
      IV: { retiroCarne: 8, retiroLeche: 72, nota: "Puede inducir parto/aborto" },
      IM: { retiroCarne: 8, retiroLeche: 72, nota: "Efecto antiinflamatorio potente" }
    },
    species: ["Bovinos", "Equinos", "Ovinos"],
    contraindications: "Contraindicado en gestación (abortifaciente). Inmunosupresor."
  },
  {
    id: "ceftiofur",
    name: "Ceftiofur Sódico / HCl",
    group: "Antibiótico (Cefalosporina 3ª Gen)",
    routes: {
      IM: { retiroCarne: 4, retiroLeche: 0, nota: "Retiro 0 horas en leche (uso aprobado)" },
      SC: { retiroCarne: 13, retiroLeche: 0, nota: "Formulación cristalina libre ácida" }
    },
    species: ["Bovinos", "Porcinos"],
    contraindications: "Hipersensibilidad a cefalosporinas/penicilinas (reacción cruzada)."
  },
  {
    id: "amoxicilina_la",
    name: "Amoxicilina 15% LA",
    group: "Antibiótico (Aminopenicilina)",
    routes: {
      IM: { retiroCarne: 25, retiroLeche: 96, nota: "Formulación de larga acción, suspensión oleosa" }
    },
    species: ["Bovinos", "Porcinos", "Ovinos"],
    contraindications: "Hipersensibilidad a β-lactámicos."
  },
  {
    id: "albendazol",
    name: "Albendazol 10%",
    group: "Antiparasitario (Benzimidazol)",
    routes: {
      PO: { retiroCarne: 14, retiroLeche: 96, nota: "Amplio espectro contra nematodos GI y Fasciola" }
    },
    species: ["Bovinos", "Ovinos"],
    contraindications: "Teratogénico en primer tercio de gestación. No usar en yeguas gestantes."
  },
  {
    id: "fenbendazol",
    name: "Fenbendazol 10%",
    group: "Antiparasitario (Benzimidazol)",
    routes: {
      PO: { retiroCarne: 14, retiroLeche: 72, nota: "Seguro en gestación (excepción entre benzimidazoles)" }
    },
    species: ["Bovinos", "Ovinos", "Equinos", "Porcinos"],
    contraindications: "Mínimas. Uno de los benzimidazoles más seguros."
  },
  {
    id: "levamisol",
    name: "Levamisol 7.5%",
    group: "Antiparasitario (Imidazotiazol)",
    routes: {
      SC: { retiroCarne: 7, retiroLeche: 48, nota: "Doble acción: antihelmíntico + inmunoestimulante" },
      PO: { retiroCarne: 3, retiroLeche: 24, nota: "Menor retiro por vía oral" }
    },
    species: ["Bovinos", "Ovinos"],
    contraindications: "Margen terapéutico estrecho. Toxicidad colinérgica si se sobredosifica."
  },
  {
    id: "closantel",
    name: "Closantel 10%",
    group: "Antiparasitario (Salicilanilida)",
    routes: {
      SC: { retiroCarne: 28, retiroLeche: null, nota: "Específico anti-Fasciola y Haemonchus" },
      PO: { retiroCarne: 28, retiroLeche: null, nota: "No usar en animales productores de leche" }
    },
    species: ["Bovinos", "Ovinos"],
    contraindications: "Prohibido en animales que producen leche para consumo humano."
  },
  {
    id: "tilosina",
    name: "Tilosina 20%",
    group: "Antibiótico (Macrólido)",
    routes: {
      IM: { retiroCarne: 21, retiroLeche: 96, nota: "Activo contra Mycoplasma y anaerobios" }
    },
    species: ["Bovinos", "Porcinos"],
    contraindications: "No usar en equinos (colitis mortal por disbacteriosis cecal)."
  },
  {
    id: "gentamicina",
    name: "Gentamicina 5%",
    group: "Antibiótico (Aminoglucósido)",
    routes: {
      IM: { retiroCarne: 90, retiroLeche: 72, nota: "Retiro muy prolongado en carne (nefro+ototóxico)" },
      IV: { retiroCarne: 90, retiroLeche: 72, nota: "Monitorear función renal" }
    },
    species: ["Bovinos", "Equinos"],
    contraindications: "Nefrotóxica y ototóxica. No combinar con Furosemida."
  },
  {
    id: "florfenicol",
    name: "Florfenicol 30%",
    group: "Antibiótico (Anfenicol)",
    routes: {
      IM: { retiroCarne: 28, retiroLeche: null, nota: "No autorizado en vacas lactantes" },
      SC: { retiroCarne: 38, retiroLeche: null, nota: "Formulación subcutánea depot" }
    },
    species: ["Bovinos", "Porcinos"],
    contraindications: "No usar en vacas productoras de leche. Aplasia medular en dosis altas."
  },
  {
    id: "oxitocina",
    name: "Oxitocina 20 UI/mL",
    group: "Hormona (Neurohipofisaria)",
    routes: {
      IV: { retiroCarne: 0, retiroLeche: 0, nota: "Sin retiro (hormona natural)" },
      IM: { retiroCarne: 0, retiroLeche: 0, nota: "Uso en distocia, retención placentaria" }
    },
    species: ["Bovinos", "Ovinos", "Porcinos", "Equinos"],
    contraindications: "No usar si hay obstrucción mecánica del canal de parto."
  },
  {
    id: "lidocaina",
    name: "Lidocaína 2%",
    group: "Anestésico Local (Amida)",
    routes: {
      SC: { retiroCarne: 2, retiroLeche: 24, nota: "Anestesia infiltrativa y regional" },
      epidural: { retiroCarne: 2, retiroLeche: 24, nota: "Bloqueo epidural caudal para cirugías" }
    },
    species: ["Bovinos", "Equinos", "Ovinos", "Porcinos", "Caninos"],
    contraindications: "Bradicardia severa. No inyectar intravascular."
  },
  {
    id: "xilacina",
    name: "Xilacina 2%",
    group: "Sedante (Agonista α2-adrenérgico)",
    routes: {
      IV: { retiroCarne: 3, retiroLeche: 48, nota: "Sedación rápida. Dosis bovina << equina" },
      IM: { retiroCarne: 5, retiroLeche: 48, nota: "Latencia 10-15 min por vía IM" }
    },
    species: ["Bovinos", "Equinos", "Caninos"],
    contraindications: "Bradicardia, tercer trimestre gestación (induce contracciones). Antagonista: Yohimbina."
  },
  {
    id: "ketamina",
    name: "Ketamina 10%",
    group: "Anestésico Disociativo",
    routes: {
      IV: { retiroCarne: 3, retiroLeche: 48, nota: "Siempre combinar con sedante previo" },
      IM: { retiroCarne: 3, retiroLeche: 48, nota: "Uso IM en pequeñas especies y fauna silvestre" }
    },
    species: ["Bovinos", "Equinos", "Caninos", "Felinos"],
    contraindications: "Sustancia controlada. No usar como agente único (convulsiones)."
  },
  {
    id: "dipirona",
    name: "Dipirona (Metamizol) 50%",
    group: "AINE/Analgésico (Pirazolona)",
    routes: {
      IV: { retiroCarne: 14, retiroLeche: 48, nota: "Analgésico visceral y antipirético potente" },
      IM: { retiroCarne: 14, retiroLeche: 48, nota: "Buena opción para cólico equino" }
    },
    species: ["Bovinos", "Equinos"],
    contraindications: "Agranulocitosis rara. No usar en producción para algunos mercados de exportación."
  },
  {
    id: "cloprostenol",
    name: "Cloprostenol Sódico (PGF2α)",
    group: "Hormona (Prostaglandina sintética)",
    routes: {
      IM: { retiroCarne: 1, retiroLeche: 0, nota: "Luteolítico para sincronización de celo/aborto terapéutico" }
    },
    species: ["Bovinos", "Equinos"],
    contraindications: "Abortifaciente. Operador: evitar autoinyección (broncoespasmo fatal en humanos)."
  },
  {
    id: "sulfadiacina_tmp",
    name: "Sulfadiacina + Trimetoprim",
    group: "Antibiótico (Sulfonamida potenciada)",
    routes: {
      IV: { retiroCarne: 10, retiroLeche: 96, nota: "Sinergia bactericida 1:5" },
      PO: { retiroCarne: 10, retiroLeche: 96, nota: "Buena absorción oral en monogástricos" }
    },
    species: ["Bovinos", "Equinos", "Caninos"],
    contraindications: "Cristaluria si hay deshidratación. Asegurar buena hidratación."
  },
  {
    id: "triclabendazol",
    name: "Triclabendazol 10%",
    group: "Antiparasitario (Benzimidazol halogenado)",
    routes: {
      PO: { retiroCarne: 28, retiroLeche: null, nota: "Único fasciolicida eficaz contra formas inmaduras (2 sem)" }
    },
    species: ["Bovinos", "Ovinos"],
    contraindications: "No usar en vacas lecheras. Teratogénico potencial."
  }
];

// ─── Motor de Consulta ───────────────────────────────────────────────
export class WithdrawalEngine {
  constructor() {
    this.database = WITHDRAWAL_DATABASE;
  }

  // Buscar fármaco por ID o nombre parcial
  findDrug(query) {
    const q = query.toLowerCase().trim();
    return this.database.filter(d =>
      d.id.includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.group.toLowerCase().includes(q)
    );
  }

  // Obtener todos los fármacos filtrados por especie
  getBySpecies(species) {
    return this.database.filter(d => d.species.includes(species));
  }

  // Obtener todos los fármacos filtrados por grupo terapéutico
  getByGroup(groupQuery) {
    const q = groupQuery.toLowerCase();
    return this.database.filter(d => d.group.toLowerCase().includes(q));
  }

  // Calcular fecha de fin de retiro
  calculateWithdrawal(drugId, route, applicationDate = new Date()) {
    const drug = this.database.find(d => d.id === drugId);
    if (!drug) return null;

    const routeData = drug.routes[route];
    if (!routeData) return null;

    const appDate = new Date(applicationDate);
    const result = {
      drug: drug.name,
      group: drug.group,
      route,
      applicationDate: appDate.toISOString().split("T")[0],
      contraindications: drug.contraindications,
      nota: routeData.nota,
      carne: null,
      leche: null
    };

    // Retiro carne (días)
    if (routeData.retiroCarne !== null) {
      const carneSafe = new Date(appDate.getTime() + routeData.retiroCarne * 86400000);
      const isActive = new Date() < carneSafe;
      result.carne = {
        dias: routeData.retiroCarne,
        fechaSegura: carneSafe.toISOString().split("T")[0],
        estado: isActive ? "activo" : "liberado",
        diasRestantes: isActive ? Math.ceil((carneSafe - new Date()) / 86400000) : 0
      };
    }

    // Retiro leche (horas → convertir)
    if (routeData.retiroLeche !== null) {
      const lecheHoras = routeData.retiroLeche;
      const lecheSafe = new Date(appDate.getTime() + lecheHoras * 3600000);
      const isActive = new Date() < lecheSafe;
      result.leche = {
        horas: lecheHoras,
        dias: Math.round(lecheHoras / 24 * 10) / 10,
        ordeños: Math.ceil(lecheHoras / 12),
        fechaSegura: lecheSafe.toISOString().split("T")[0],
        estado: isActive ? "activo" : "liberado",
        horasRestantes: isActive ? Math.ceil((lecheSafe - new Date()) / 3600000) : 0
      };
    } else {
      result.leche = {
        horas: null,
        estado: "prohibido",
        nota: "No autorizado en animales productores de leche"
      };
    }

    return result;
  }

  // Obtener todos los grupos terapéuticos únicos
  getGroups() {
    return [...new Set(this.database.map(d => d.group))].sort();
  }

  // Obtener todas las especies únicas
  getSpecies() {
    const sp = new Set();
    this.database.forEach(d => d.species.forEach(s => sp.add(s)));
    return [...sp].sort();
  }

  // Obtener todas las vías únicas
  getRoutes() {
    const routes = new Set();
    this.database.forEach(d => Object.keys(d.routes).forEach(r => routes.add(r)));
    return [...routes].sort();
  }
}

export const withdrawalEngine = new WithdrawalEngine();
