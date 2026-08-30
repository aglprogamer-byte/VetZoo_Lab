# 🧬 ZOOTECNIA 3D — Granja Escuela Virtual & Laboratorio Universitario

> **Simulador Profesional y Entorno Virtual Educativo para Ciencias Agropecuarias y Medicina Veterinaria.**

---

## 🌟 Características Principales

1. **🌎 Granja Escuela 3D Interactiva (Three.js & WebGL):**
   - Modelos GLB animados de especies domésticas (Bovino, Equino, Ovino, Porcino).
   - Entorno con potreros rotacionales, establo, comederos y ambientación low-poly.
   - Navegación orbital y cámara dirigida por zonas e inspección semiológica individual.

2. **💉 Consultorio & Simulador Histológico de Punción:**
   - Corte histológico 2D interactivo con física y geometría de inserción exacta.
   - 4 planos anatómicos: Epidermis/Dermis (ID: 10°-20°), Subcutáneo (SC: 35°-55°), Músculo (IM: 75°-90°) y Vena Yugular (IV: 20°-35°).
   - Farmacopea científica basada en **Denominación Común Internacional (DCI)**: *Flunixin Meglumina*, *Oxitetraciclina L.A.*, *Ivermectina*, *Penicilina G Benzatínica*, *Meloxicam*, *Gluconato de Calcio*, *Tuberculina PPD*, *Ceftiofur*.
   - Prueba de aspiración previa de émbolo (detección de reflujo venoso de sangre roja).
   - Generador dinámico de casos clínicos universitarios en vivo.

3. **🌾 Estación de Nutrición & Formulación Bromatológica:**
   - Formulación TMR en tiempo real con cálculo de Energía Metabolizable (Mcal/kg), Proteína Cruda (% PC), Fibra Detergente Neutro (% FDN), Calcio, Fósforo y Costo diario.
   - Generador de desafíos bromatológicos en vivo (Prevención de SARA, Pico de lactancia, cólico equino, engorde porcino).

4. **🌱 Laboratorio de Agrostología, Pastos & Forrajes (PRV):**
   - Herbario científico de 8 especies forrajeras (*Brachiaria brizantha*, *Panicum maximum*, *Pennisetum purpureum*, *Lolium perenne*, *Medicago sativa*, *Trifolium repens*, *Leucaena leucocephala*, *Pennisetum clandestinum*).
   - Mapa de 8 potreros con cálculo de Punto Óptimo de Reposo (POR) y Carga Instantánea ($UGM/Ha$).
   - Simulador de aforo por cuadrante ($1\text{ m}^2$), 4 Leyes de André Voisin y módulo de conservación (Silo y heno).
   - Generador de problemas matemáticos zootécnicos de capacidad de carga con comprobación paso a paso.

5. **📋 Casos Integrales Universitarios & Rúbricas:**
   - Flujo de resolución de casos con evaluación de diagnóstico presuntivo, ajuste nutricional, maniobra clínica y dictamen de desempeño sobre 100 puntos.

---

## 🛠️ Estructura del Código

```text
├── index.html               # Punto de entrada principal
├── .nojekyll                # Deshabilita el procesamiento Jekyll en GitHub Pages
├── .gitignore
├── css/
│   └── styles.css           # Estilos científicos y tokens visuales
├── js/
│   ├── app.js               # Bootstrap y ServiceContainer
│   ├── core/
│   │   ├── Container.js     # IoC Service Container
│   │   ├── Store.js         # Estado centralizado reactivo
│   │   └── SimEngine.js     # Motor biológico y bromatológico
│   ├── farm/
│   │   ├── Farm3D.js        # Escena 3D y zonas
│   │   └── AnimalManager.js # Entidades y animaciones
│   ├── modules/
│   │   ├── ClinicalLab.js   # Simulador de inyección y farmacopea DCI
│   │   ├── NutritionLab.js  # Formulación bromatológica
│   │   ├── PastureLab.js    # Agrostología y PRV
│   │   └── CaseEngine.js    # Casos universitarios
│   └── ui/
│       ├── HUD.js
│       ├── AnimalCardModal.js
│       └── StudentProfileModal.js
└── models/                  # Modelos 3D optimizados en formato .glb
```
