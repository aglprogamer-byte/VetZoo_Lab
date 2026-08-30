/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Core: Container.js - Inversión de Control (IoC) y Contenedor de Inyección de Dependencias (DI)
 * 
 * Centraliza la creación y resolución de servicios desacoplados:
 * - Store (Estado central)
 * - SimEngine (Cálculos bio-económicos)
 * - Farm3D (WebGL / Three.js)
 * - AnimalManager (Entidades 3D)
 * - Labs (Nutrition, Clinical, Pasture)
 * - CaseEngine (Flujo pedagógico)
 * - UI (HUD, Modals)
 */

export class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    this.singletons = new Map();
  }

  /**
   * Registra una instancia singleton ya creada
   */
  register(name, instance) {
    this.services.set(name, instance);
    return this;
  }

  /**
   * Registra una factoría lazy que se instancia una sola vez (Singleton)
   */
  singleton(name, factoryFn) {
    this.factories.set(name, factoryFn);
    return this;
  }

  /**
   * Resuelve una dependencia por nombre
   */
  get(name) {
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    if (this.factories.has(name)) {
      const factory = this.factories.get(name);
      const instance = factory(this);
      this.services.set(name, instance);
      return instance;
    }

    throw new Error(`[ServiceContainer] Dependencia no registrada: '${name}'`);
  }

  /**
   * Verifica si un servicio está registrado
   */
  has(name) {
    return this.services.has(name) || this.factories.has(name);
  }
}

export const container = new ServiceContainer();
