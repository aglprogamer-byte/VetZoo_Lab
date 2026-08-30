/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Core: SimEngine.js - Motor de Simulación Fisiológica, Productiva y Económica
 */

import { store } from "./Store.js";

export const AudioFx = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  beep(freq = 520, duration = 0.12, type = "sine") {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },
  success() {
    this.beep(587.33, 0.08);
    setTimeout(() => this.beep(880, 0.18), 90);
  },
  warning() {
    this.beep(280, 0.15, "triangle");
  },
  error() {
    this.beep(196, 0.22, "sawtooth");
  },
  nav() {
    this.beep(440, 0.05);
  },
  click() {
    this.beep(600, 0.03);
  }
};

export class SimEngine {
  constructor(storeInstance = store) {
    this.store = storeInstance;
    this.milkPricePerLiter = 0.45; // USD/L
    this.beefPricePerKg = 2.20;    // USD/kg peso vivo
  }

  advanceTime(days = 1) {
    const currentDay = this.store.get("day");
    if (currentDay + days > 30) {
      days = Math.max(0, 30 - currentDay);
    }
    if (days <= 0) return { daysSimulated: 0, completed: true };

    const animals = this.store.get("animals");
    const diets = this.store.get("diets");
    const finances = this.store.get("finances");

    let totalFeedCost = 0;
    let totalMilkRevenue = 0;

    for (let d = 0; d < days; d++) {
      const simDay = currentDay + d + 1;

      for (const id in animals) {
        const a = animals[id];
        const diet = diets[a.species] || { maiz: 40, soya: 30, nuc: 10 };

        // 1. Evaluación Bromatológica de la Dieta
        const dietMetrics = this.computeDietMetrics(diet);
        const req = this.getSpeciesRequirements(a.species, a.weight);

        // 2. Coeficiente de Adecuación Nutricional (CAN: 0.0 - 1.0)
        const energyScore = this.scoreMetric(dietMetrics.energy, req.energyMin, req.energyMax);
        const proteinScore = this.scoreMetric(dietMetrics.protein, req.proteinMin, req.proteinMax);
        const fiberScore = this.scoreMetric(dietMetrics.fiber, req.fiberMin, req.fiberMax);
        const can = 0.4 * energyScore + 0.4 * proteinScore + 0.2 * fiberScore;

        // 3. Respuesta Fisiológica y Ganancia de Peso Diaria (ADG)
        const baseGain = a.species === "vaca" ? 0.90 : a.species === "caballo" ? 0.60 : a.species === "oveja" ? 0.25 : 0.80;
        const dailyGain = baseGain * (0.15 + 1.25 * can) * (1 + (Math.random() - 0.5) * 0.06);
        a.weight = +(a.weight + dailyGain).toFixed(2);

        // 4. Modificación de Condición Corporal (BCS)
        if (can > 0.85 && a.bcs < 4.5) a.bcs = +(a.bcs + 0.01).toFixed(2);
        else if (can < 0.45 && a.bcs > 1.5) a.bcs = +(a.bcs - 0.02).toFixed(2);

        // 5. Producción de Leche (Bovinos)
        if (a.species === "vaca") {
          const expectedMilk = a.targetMilk * (0.35 + 0.75 * can) * (1 + (Math.random() - 0.5) * 0.05);
          a.milkProduction = +expectedMilk.toFixed(1);
          totalMilkRevenue += a.milkProduction * this.milkPricePerLiter;
        }

        // 6. Consumo y Costo de Alimentación
        const dailyDryMatterIntake = a.weight * (a.species === "cerdo" ? 0.04 : 0.028);
        const feedCostPerKg = (dietMetrics.cost || 0.32);
        const dailyAnimalFeedCost = dailyDryMatterIntake * feedCostPerKg;
        totalFeedCost += dailyAnimalFeedCost;

        // 7. Conversión Alimenticia (FCR)
        a.fcr = dailyGain > 0 ? +(dailyDryMatterIntake / dailyGain).toFixed(2) : 0;

        // 8. Salud e Inmunidad
        if (can < 0.40) {
          a.health = Math.max(30, a.health - 2.5);
          a.stress = Math.min(90, a.stress + 4);
          a.vitals.temp = +(38.6 + (Math.random() * 0.4)).toFixed(1);
        } else {
          a.health = Math.min(100, a.health + 0.8);
          a.stress = Math.max(5, a.stress - 2);
        }

        // Registrar en historial del animal
        a.history.push({
          day: simDay,
          type: "Simulación diaria",
          weight: a.weight,
          gain: +dailyGain.toFixed(2),
          milk: a.milkProduction,
          bcs: a.bcs,
          health: a.health
        });
      }
    }

    // Actualizar Estado Financiero
    finances.dailyFeedCost = +(totalFeedCost / days).toFixed(2);
    finances.dailyRevenue = +(totalMilkRevenue / days).toFixed(2);
    const netProfit = +(totalMilkRevenue - totalFeedCost).toFixed(2);
    finances.budget = +(finances.budget + netProfit).toFixed(2);
    finances.netProfitHistory.push({
      day: currentDay + days,
      profit: netProfit,
      cost: totalFeedCost,
      revenue: totalMilkRevenue
    });

    this.store.set("day", currentDay + days);
    this.store.set("finances", finances);
    this.store.emit("simulation:advanced", { days, newDay: currentDay + days });

    AudioFx.beep(700, 0.1);
    return { daysSimulated: days, completed: (currentDay + days >= 30) };
  }

  computeDietMetrics(diet) {
    const rawData = {
      maiz:      { ms: 88, energy: 3.35, protein: 8.8,  fiber: 2.2,  ca: 0.03, p: 0.28, cost: 0.30 },
      soya:      { ms: 90, energy: 3.48, protein: 45.5, fiber: 5.8,  ca: 0.32, p: 0.65, cost: 0.62 },
      ensilaje:  { ms: 35, energy: 2.65, protein: 7.5,  fiber: 24.0, ca: 0.25, p: 0.22, cost: 0.12 },
      heno:      { ms: 86, energy: 2.10, protein: 14.5, fiber: 28.0, ca: 1.20, p: 0.24, cost: 0.22 },
      melaza:    { ms: 75, energy: 2.95, protein: 3.2,  fiber: 0.0,  ca: 0.80, p: 0.08, cost: 0.18 },
      nuc:       { ms: 98, energy: 0.10, protein: 0.0,  fiber: 0.0,  ca: 18.0, p: 9.0,  cost: 1.20 }
    };

    let totalPct = 0;
    let energy = 0, protein = 0, fiber = 0, ca = 0, p = 0, cost = 0;

    for (const ing in diet) {
      const pct = diet[ing] || 0;
      totalPct += pct;
      const data = rawData[ing] || { energy: 0, protein: 0, fiber: 0, ca: 0, p: 0, cost: 0 };
      energy += (pct / 100) * data.energy;
      protein += (pct / 100) * data.protein;
      fiber += (pct / 100) * data.fiber;
      ca += (pct / 100) * data.ca;
      p += (pct / 100) * data.p;
      cost += (pct / 100) * data.cost;
    }

    return {
      totalPct,
      energy: +energy.toFixed(2),
      protein: +protein.toFixed(1),
      fiber: +fiber.toFixed(1),
      ca: +ca.toFixed(2),
      p: +p.toFixed(2),
      cost: +cost.toFixed(2)
    };
  }

  getSpeciesRequirements(species, weight) {
    if (species === "vaca") {
      return { energyMin: 2.65, energyMax: 3.10, proteinMin: 15.0, proteinMax: 18.5, fiberMin: 18.0, fiberMax: 28.0 };
    } else if (species === "caballo") {
      return { energyMin: 2.20, energyMax: 2.80, proteinMin: 11.0, proteinMax: 14.5, fiberMin: 22.0, fiberMax: 35.0 };
    } else if (species === "oveja") {
      return { energyMin: 2.30, energyMax: 2.85, proteinMin: 13.0, proteinMax: 16.5, fiberMin: 20.0, fiberMax: 30.0 };
    } else { // cerdo
      return { energyMin: 3.20, energyMax: 3.65, proteinMin: 16.5, proteinMax: 21.0, fiberMin: 2.5, fiberMax: 7.0 };
    }
  }

  scoreMetric(value, min, max) {
    if (value >= min && value <= max) return 1.0;
    const diff = value < min ? min - value : value - max;
    const span = max - min || 1;
    return Math.max(0, 1.0 - (diff / span));
  }
}

export const simEngine = new SimEngine();
