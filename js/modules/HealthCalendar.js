/**
 * ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Clínico
 * Módulo: HealthCalendar.js — Cronograma Sanitario Inteligente Multiespecie
 *
 * Generador interactivo de planes sanitarios: vacunación obligatoria (ICA/SENASA),
 * desparasitación estratégica y eventos reproductivos con alertas de bioseguridad.
 */

import { achievements } from "../core/Achievements.js";

export const SANITARY_PROTOCOLS = {
  bovino_leche: {
    title: "Bovinos — Lechería Especializada / Alta Producción",
    icon: "🐄",
    obligatory: [
      { id: "aftosa_1", name: "Fiebre Aftosa (Ciclo I - Mayo/Junio)", period: "Mayo", target: "Todo el hato (> 0 meses)", type: "vacuna", official: true },
      { id: "aftosa_2", name: "Fiebre Aftosa (Ciclo II - Nov/Dic)", period: "Noviembre", target: "Todo el hato (> 0 meses)", type: "vacuna", official: true },
      { id: "brucelosis", name: "Brucelosis Bovina (Cepa 19 o RB51)", period: "Continua (3-9 meses)", target: "Terneras 3 a 9 meses (Hembras)", type: "vacuna", official: true },
      { id: "rabia", name: "Rabia de Origen Silvestre (Zonas endémicas)", period: "Anual (Abril)", target: "Todo el hato (> 3 meses)", type: "vacuna", official: true }
    ],
    strategic: [
      { id: "clostridiosis", name: "Complejo Clostridial (Carbón / Mancha 8-9 vías)", period: "Marzo y Septiembre", target: "Terneros (primovacunación + refuerzo 21d) y hato general anual", type: "vacuna" },
      { id: "reproductivas", name: "Complejo Reproductivo (IBR + DVB + Leptospira 5 serovares)", period: "Previo a IATF / Servicio", target: "Novillas y vacas 30d antes del servicio", type: "vacuna" },
      { id: "mastitis", name: "Vacuna contra Mastitis (E. coli + Staph aureus)", period: "Secado y Periparto", target: "Vacas al secado (día -60) y día -15 preparto", type: "vacuna" },
      { id: "desparasitacion_secado", name: "Desparasitación al Secado (Retiro en Leche 0d)", period: "Al inicio del periodo seco (Día -60)", target: "Vacas secas", type: "antiparasitario" },
      { id: "desparasitacion_terneros", name: "Desparasitación Táctica Terneras (Destete)", period: "Día 60 y Día 120 de vida", target: "Terneras lactantes y destetas", type: "antiparasitario" }
    ],
    management: [
      { id: "podologia", name: "Arreglo Podal Preventivo (Despezuñe funcional)", period: "Secado y 100 DEL", target: "Vacas adultas", type: "manejo" },
      { id: "bcs_eval", name: "Evaluación BCS (Parto, Pico y Secado)", period: "Mensual", target: "Lote de ordeño", type: "manejo" }
    ]
  },
  equino_deporte: {
    title: "Equinos — Deporte, Salto & Paso Fino",
    icon: "🐎",
    obligatory: [
      { id: "aie", name: "Test de Coggins (Anemia Infecciosa Equina)", period: "Cada 120 días (Movilización)", target: "Todo caballo mayor de 6 meses", type: "diagnostico", official: true },
      { id: "encefalitis", name: "Encefalitis Equina Venezolana (EEV)", period: "Anual (Zonas de riesgo)", target: "Todos los equinos", type: "vacuna", official: true }
    ],
    strategic: [
      { id: "influenza_tetanos", name: "Influenza Equina + Tétanos (Toxoide)", period: "Semestral en caballos de competencia", target: "Todo el plantel", type: "vacuna" },
      { id: "herpesvirus", name: "Rinoneumonitis Equina (EHV-1 / EHV-4)", period: "Gestación (Meses 5, 7 y 9)", target: "Yeguas preñadas y potros", type: "vacuna" },
      { id: "desparasitacion_rotativa", name: "Desparasitación Copro-guiada (Ivermectina / Praziquantel)", period: "Cada 90-120 días", target: "Adultos y potros", type: "antiparasitario" },
      { id: "odontologia", name: "Odontología Equina (Nivelación de tablas y puntas de muela)", period: "Anual / Semestral", target: "Caballos en entrenamiento", type: "manejo" }
    ],
    management: [
      { id: "herraje", name: "Herraje / Aplomos Funcionales", period: "Cada 35 - 45 días", target: "Caballos activos", type: "manejo" }
    ]
  },
  ovino_carne: {
    title: "Ovinos & Caprinos — Producción de Carne & Leche",
    icon: "🐑",
    obligatory: [
      { id: "brucelosis_caprina", name: "Brucelosis (B. melitensis / B. ovis)", period: "Muestreo anual oficial", target: "Reproductores", type: "diagnostico", official: true },
      { id: "rabia_ov", name: "Rabia Paralítica Bovina/Ovina", period: "Anual (Zonas endémicas)", target: "Todo el rebaño", type: "vacuna", official: true }
    ],
    strategic: [
      { id: "clostridiosis_ov", name: "Enterotoxemia / Pulpa Riñonosa (Cl. perfringens C y D + Tetani)", period: "Mes previo a pariciones", target: "Ovejas gestantes y corderos 4ta sem.", type: "vacuna" },
      { id: "famacha_monthly", name: "Monitoreo FAMACHA + McMaster Estratégico", period: "Mensual / Quincenal en lluvias", target: "Todo el lote", type: "diagnostico" },
      { id: "desparasitacion_tactica", name: "Desparasitación Selectiva (Solo FAMACHA 4 y 5)", period: "Según hallazgos clínicos", target: "Animales vulnerables", type: "antiparasitario" },
      { id: "ectoparasitos", name: "Baño contra Melófago / Sarna / Garrapata", period: "Post-esquila", target: "Todo el rebaño", type: "antiparasitario" }
    ],
    management: [
      { id: "despezuñe_ov", name: "Pediluvios de Sulfato de Zinc (Foot-Rot / Pedera)", period: "Quincenal en lluvias", target: "Todo el rebaño", type: "manejo" }
    ]
  }
};

export class HealthCalendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedProtocolKey = "bovino_leche";
    this.completedTasks = new Set();
    this.activeFilter = "all"; // "all" | "vacuna" | "antiparasitario" | "manejo"
    this.challenge = this.getChallengeForProtocol(this.selectedProtocolKey);
    this.challengeSelection = null;
    this.init();
  }

  getChallengeForProtocol(protocolKey) {
    const map = {
      bovino_leche: {
        title: "Decisión crítica en lechería",
        prompt: "Un lote de vacas en alta producción presenta caída del 18% en leche y heces ácidas. ¿Qué medida prioritaria debe hacerse primero?",
        options: [
          { id: "a", text: "Reforzar fibra efectiva y revisar exceso de almidón en la ración antes de continuar con la rutina diaria.", correct: true, explanation: "Es la corrección inmediata más lógica para reducir la acidosis ruminal y recuperar la producción." },
          { id: "b", text: "Aumentar el concentrado sin ajustar la dieta para estimular la lactación.", correct: false, explanation: "Aumenta la carga fermentable y empeora la acidosis ruminal." },
          { id: "c", text: "Ignorar el problema y esperar a la próxima revisión por producción.", correct: false, explanation: "La demora agrava el daño ruminal y la caída de producción." }
        ]
      },
      equino_deporte: {
        title: "Riesgo clínico en equinos",
        prompt: "Un caballo de deporte presenta dolor abdominal, sudoración y fermentación en ciego tras ejercicio intenso. ¿Qué decisión de manejo es prioritaria?",
        options: [
          { id: "a", text: "Analgesia con flunixina, fluidoterapia y monitoreo continuo del dolor y la motilidad.", correct: true, explanation: "Es la conducta inicial apropiada para cólico de intensidad moderada antes de complicaciones quirúrgicas." },
          { id: "b", text: "Forzar ejercicio intenso para descomprimir el intestino.", correct: false, explanation: "Hace más daño y aumenta el riesgo de timpanismo o lesión intestinal." },
          { id: "c", text: "Administrar antibióticos sin evaluar la causa del dolor.", correct: false, explanation: "La analgesia y la evaluación clínica tienen prioridad; los antibióticos no resuelven un cólico mecánico ni espasmódico." }
        ]
      },
      ovino_carne: {
        title: "Bioseguridad en rebaño",
        prompt: "Un rebaño ovino presenta edema submandibular, mucosas pálidas y alta carga de Haemonchus. ¿Cuál es la decisión más adecuada para controlar la crisis?",
        options: [
          { id: "a", text: "Desparasitación selectiva, manejo del pastoreo y soporte antianémico para reducir la carga parasitaria.", correct: true, explanation: "La gestión integral del pastoreo y el tratamiento específico reducen la anemia y los efectos del parasitismo." },
          { id: "b", text: "Mantenerlos en el mismo potrero húmedo sin intervención.", correct: false, explanation: "Esto mantiene la presión de infección y empeora la anemia." },
          { id: "c", text: "Dar solo sal mineral sin controlar el fuerte parasitismo.", correct: false, explanation: "La sal no corrige la pérdida sanguínea ni el daño del parásito." }
        ]
      }
    };

    return map[protocolKey] || map.bovino_leche;
  }

  evaluateChallenge(choiceId) {
    const challenge = this.getChallengeForProtocol(this.selectedProtocolKey);
    const selected = challenge.options.find(option => option.id === choiceId);
    this.challengeSelection = { choiceId, correct: !!selected?.correct, explanation: selected?.explanation || "" };
    if (selected?.correct) {
      achievements.recordCalendarCreated();
    }
    this.render();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const protocol = SANITARY_PROTOCOLS[this.selectedProtocolKey];
    const allItems = [...protocol.obligatory, ...protocol.strategic, ...protocol.management];
    const filteredItems = this.activeFilter === "all" ? allItems : allItems.filter(i => i.type === this.activeFilter);

    const completedCount = allItems.filter(i => this.completedTasks.has(i.id)).length;
    const progressPercent = Math.round((completedCount / allItems.length) * 100);

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl shadow-inner">
              📋
            </div>
            <div>
              <h2 class="display text-xl sm:text-2xl font-bold text-white m-0">Cronograma Sanitario & Bioseguridad Inteligente</h2>
              <p class="text-xs text-[var(--muted)] m-0">Programación anual de vacunaciones oficiales, desparasitaciones tácticas y manejo preventivo.</p>
            </div>
          </div>

          <!-- Selector de Especie -->
          <div class="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-2xl border border-[var(--border)]" id="protocolButtons">
            ${Object.keys(SANITARY_PROTOCOLS).map(k => `
              <button class="btn-proto btn px-3 py-1.5 rounded-xl text-xs font-semibold ${this.selectedProtocolKey === k ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40' : 'text-gray-400 hover:text-white'}" data-proto="${k}">
                ${SANITARY_PROTOCOLS[k].icon} ${SANITARY_PROTOCOLS[k].title.split("—")[0].trim()}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Barra de Progreso y Filtros -->
        <div class="glass p-5 rounded-2xl border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1.5 flex-1 min-w-[240px]">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-white">Cumplimiento del Plan Sanitario</span>
              <span class="mono text-emerald-400">${completedCount} / ${allItems.length} (${progressPercent}%)</span>
            </div>
            <div class="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <!-- Filtro por categoría -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-gray-400 mono">Filtrar:</span>
            <button class="btn-filter btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'all' ? 'bg-white/10 text-white border-white/20' : 'text-gray-400 border-white/5'}" data-f="all">Todos</button>
            <button class="btn-filter btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'vacuna' ? 'bg-blue-950 text-blue-300 border-blue-500/40' : 'text-gray-400 border-white/5'}" data-f="vacuna">💉 Vacunas</button>
            <button class="btn-filter btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'antiparasitario' ? 'bg-teal-950 text-teal-300 border-teal-500/40' : 'text-gray-400 border-white/5'}" data-f="antiparasitario">💊 Antiparasitarios</button>
            <button class="btn-filter btn px-2.5 py-1 rounded-lg border text-[11px] ${this.activeFilter === 'manejo' ? 'bg-purple-950 text-purple-300 border-purple-500/40' : 'text-gray-400 border-white/5'}" data-f="manejo">🛠️ Manejo</button>
          </div>
        </div>

        <div class="glass p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <h3 class="display text-base font-bold text-white m-0">🧪 Desafío de decisión sanitaria</h3>
            <span class="chip text-[10px] uppercase mono">${this.challenge.title}</span>
          </div>
          <p class="text-sm text-gray-200 m-0">${this.challenge.prompt}</p>
          <div class="grid gap-2">
            ${this.challenge.options.map(option => {
      const selected = this.challengeSelection?.choiceId === option.id;
      const success = this.challengeSelection && option.correct;
      const danger = this.challengeSelection && selected && !option.correct;
      return `
                <button data-health-choice="${option.id}" class="btn health-choice-btn text-left p-3 rounded-xl border ${success ? 'border-emerald-500/50 bg-emerald-950/30' : danger ? 'border-rose-500/50 bg-rose-950/30' : 'border-white/10 bg-black/30'} ${selected ? 'ring-1 ring-white/20' : ''}">
                  <span class="text-xs text-gray-200">${option.text}</span>
                </button>
              `;
    }).join("")}
          </div>
          ${this.challengeSelection ? `
            <div class="p-3 rounded-xl border ${this.challengeSelection.correct ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100' : 'border-rose-500/40 bg-rose-950/30 text-rose-100'} text-xs leading-relaxed">
              <b>${this.challengeSelection.correct ? '✅ Respuesta correcta' : '⚠️ Revisión'}</b>: ${this.challenge.options.find(opt => opt.id === this.challengeSelection.choiceId)?.explanation || this.challengeSelection.explanation}
            </div>
          ` : ""}
        </div>

        <!-- Lista de Actividades Sanitarias -->
        <div class="space-y-3">
          ${filteredItems.map(item => {
      const isDone = this.completedTasks.has(item.id);
      return `
              <div class="glass p-4 rounded-2xl border ${item.official ? 'border-amber-500/40 bg-amber-950/10' : 'border-[var(--border)] bg-black/30'} flex flex-wrap items-center justify-between gap-3 hover:border-blue-500/40 transition">
                <div class="flex items-start gap-3 flex-1 min-w-[280px]">
                  <input type="checkbox" class="task-checkbox accent-emerald-500 w-5 h-5 rounded mt-0.5 cursor-pointer" data-id="${item.id}" ${isDone ? 'checked' : ''}>
                  <div>
                    <div class="flex items-center gap-2">
                      <b class="text-sm text-white ${isDone ? 'line-through text-gray-400' : ''}">${item.name}</b>
                      ${item.official ? '<span class="badge-tag bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">OFICIAL ICA</span>' : ''}
                      <span class="chip text-[9px] uppercase mono py-0.5 px-2">${item.type}</span>
                    </div>
                    <p class="text-xs text-gray-300 mt-1 m-0"><b>Población objetivo:</b> ${item.target}</p>
                  </div>
                </div>

                <div class="text-right">
                  <span class="mono text-xs text-blue-300 font-bold bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-xl block">
                    📅 ${item.period}
                  </span>
                </div>
              </div>
            `;
    }).join("")}
        </div>

        <!-- Botón de Auditoría Sanitaria -->
        <div class="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-wrap justify-between items-center gap-3">
          <div class="text-xs text-gray-300">
            <span>💡 Las vacunaciones oficiales (Aftosa, Brucelosis, Rabia) son requisito legal no negociable para la expedición de Guías Sanitarias de Movilización (GSMI).</span>
          </div>
          <button id="btnEmitHealthAudit" class="btn px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold text-xs shadow-lg">
            📜 Emitir Certificado de Auditoría Sanitaria
          </button>
        </div>

        <!-- Contenedor del Certificado Modal -->
        <div id="healthAuditReportBox" class="hidden p-6 rounded-2xl border border-emerald-500/50 bg-emerald-950/40 space-y-3 text-xs"></div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll(".btn-proto").forEach(btn => {
      btn.onclick = () => {
        this.selectedProtocolKey = btn.dataset.proto;
        this.challenge = this.getChallengeForProtocol(this.selectedProtocolKey);
        this.challengeSelection = null;
        this.render();
      };
    });

    this.container.querySelectorAll(".btn-filter").forEach(btn => {
      btn.onclick = () => {
        this.activeFilter = btn.dataset.f;
        this.render();
      };
    });

    this.container.querySelectorAll(".task-checkbox").forEach(chk => {
      chk.onchange = (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          this.completedTasks.add(id);
        } else {
          this.completedTasks.delete(id);
        }
        achievements.recordCalendarCreated();
        this.render();
      };
    });

    this.container.querySelectorAll(".health-choice-btn").forEach(btn => {
      btn.onclick = () => {
        const selectedId = btn.dataset.healthChoice;
        this.evaluateChallenge(selectedId);
      };
    });

    const btnAudit = this.container.querySelector("#btnEmitHealthAudit");
    if (btnAudit) {
      btnAudit.onclick = () => {
        const protocol = SANITARY_PROTOCOLS[this.selectedProtocolKey];
        const allItems = [...protocol.obligatory, ...protocol.strategic, ...protocol.management];
        const completedCount = allItems.filter(i => this.completedTasks.has(i.id)).length;
        const missingOfficial = protocol.obligatory.filter(i => !this.completedTasks.has(i.id));

        const box = this.container.querySelector("#healthAuditReportBox");
        box.classList.remove("hidden");

        if (missingOfficial.length > 0) {
          box.className = "p-6 rounded-2xl border border-rose-500/50 bg-rose-950/40 space-y-3 text-xs shadow-2xl";
          box.innerHTML = `
            <div class="flex justify-between items-center border-b border-rose-500/30 pb-2">
              <h4 class="display font-bold text-rose-300 text-sm m-0">⚠️ AUDITORÍA SANITARIA REPROBADA — BLOQUEO PREVENTIVO</h4>
              <span class="mono text-rose-400 font-bold">Riesgo Sanitario Alto</span>
            </div>
            <p class="text-gray-200 leading-relaxed">
              El predio tiene <b>${missingOfficial.length} evento(s) obligatorio(s) pendiente(s)</b>: ${missingOfficial.map(m => m.name).join(", ")}.
              Sin el registro de estas vacunas oficiales, la finca queda inhabilitada para movilización y comercialización de leche o carne.
            </p>
          `;
        } else {
          box.className = "p-6 rounded-2xl border border-emerald-500/50 bg-emerald-950/40 space-y-3 text-xs shadow-2xl";
          box.innerHTML = `
            <div class="flex justify-between items-center border-b border-emerald-500/30 pb-2">
              <h4 class="display font-bold text-emerald-300 text-sm m-0">🎉 PREDIO CERTIFICADO EN BUENAS PRÁCTICAS GANADERAS (BPG)</h4>
              <span class="mono text-emerald-400 font-bold">Cumplimiento: ${completedCount}/${allItems.length}</span>
            </div>
            <p class="text-gray-200 leading-relaxed">
              El esquema sanitario de <b>${protocol.title}</b> cumple con el 100% de la normativa oficial. Guías de movilización habilitadas.
            </p>
          `;
        }
        box.scrollIntoView({ behavior: "smooth" });
      };
    }
  }
}
