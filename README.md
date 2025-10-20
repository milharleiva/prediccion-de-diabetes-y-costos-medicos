# Predictor de Salud - Aplicación Web ML

Aplicación web que implementa modelos de regresión de costos de seguro médico y predicción de diabetes con interfaz gráfica, desplegada en producción.

## Qué hace

- **Evaluación de Riesgo de Diabetes**: Predice el riesgo de diabetes basado en datos médicos con 78.6% de precisión
- **Calculadora de Costos de Seguro**: Estima costos anuales de seguro médico con R² de 86.7%

## Stack Tecnológico

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Scripts Python
- **Modelos ML**: Scikit-learn (almacenados como archivos .pkl)
- **Arquitectura**: Patrón Clean Architecture

## Estructura del Proyecto

```
├── src/                    # Capas de Clean Architecture
│   ├── domain/            # Lógica de negocio y entidades
│   ├── infrastructure/    # APIs y servicios externos
│   └── presentation/      # Componentes UI
├── pages/                 # Páginas Next.js y rutas API
│   ├── api/              # APIs TypeScript que llaman Python
│   ├── diabetes.tsx      # Página predicción diabetes
│   └── insurance.tsx     # Página costos seguro
├── scripts/              # Scripts Python para predicciones ML
├── diabete/              # Modelo diabetes y entrenamiento
├── costos-medicos/       # Modelo seguro y entrenamiento
└── telco/                # Telco churn (solo referencia)
```

## Cómo funciona

1. **El usuario llena formulario** en interfaz web
2. **Flujo Clean Architecture**: UI → UseCase → Repository → API
3. **API llama script Python** con datos de entrada
4. **Python carga modelo .pkl** y hace predicción
5. **Resultado regresa** a través de la misma cadena

## Modelos de Machine Learning

### Modelo Diabetes
- **Algoritmo**: Regresión Logística con preprocesamiento
- **Precisión**: 78.6%
- **Características**: Embarazos, glucosa, presión arterial, BMI, edad, etc.
- **Salida**: Probabilidad de riesgo (0-1)

### Modelo Seguro
- **Algoritmo**: Regresión Polinomial (grado 2)
- **R² Score**: 86.7%
- **Características**: Edad, BMI, hijos, estado fumador
- **Salida**: Costo anual en USD

## Comenzar

### Prerrequisitos
- Node.js 18+
- Python 3.9+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone [your-repo-url]
cd ejemplo-api-ml
```

2. **Instalar dependencias**
```bash
npm install
pip install -r requirements.txt
```

3. **Ejecutar servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir navegador**
```
http://localhost:3000
```

## Endpoints API

- `GET /api/diabetes` - Verificación de salud
- `POST /api/diabetes` - Predecir riesgo de diabetes
- `GET /api/insurance` - Verificación de salud
- `POST /api/insurance` - Calcular costo de seguro

## Entrenamiento de Modelos

Los modelos ya están entrenados y guardados como archivos .pkl. Para reentrenar:

```bash
# Modelo diabetes
cd diabete
python train_diabetes_model.py

# Modelo seguro
cd costos-medicos
python train_model.py
```

## Despliegue

Listo para despliegue en Vercel:
- `vercel.json` configurado para Python + TypeScript
- `requirements.txt` para dependencias Python
- Archivos .pkl estáticos incluidos

## Detalles de Estructura de Archivos

### Archivos Clave
- `diabetes_model.pkl` - Modelo entrenado predicción diabetes
- `insurance_cost_model.pkl` - Modelo entrenado costos seguro
- `scripts/predict_*.py` - Scripts Python de predicción
- `src/infrastructure/repositories/PredictionRepository.ts` - Cliente API

### Flujo de Datos
```
Entrada Formulario → Validación Entidad → UseCase → Repository → API → Python → Modelo → Resultado
```

## Preguntas de Investigación y Análisis

Este proyecto aborda las siguientes preguntas de investigación a través de implementación y análisis:

### 1. ¿Cuál es el umbral ideal para el modelo de predicción de diabetes?
**Respuesta**: El umbral óptimo es **0.43** basado en análisis de curva ROC. Este umbral equilibra sensibilidad (78.6%) y especificidad, minimizando falsos negativos mientras mantiene precisión aceptable para propósitos de screening médico.

### 2. ¿Cuáles son los factores que más influyen en el precio de los costos asociados al seguro médico?
**Respuesta**: El análisis de importancia de características revela:
- **Estado fumador (smoker)**: 67.3% - Factor de mayor impacto
- **Edad**: 18.2% - Segundo más significativo
- **BMI**: 8.9% - Influencia moderada
- **Hijos**: 5.6% - Impacto menor
- **Sexo y Región**: Removidos por valor predictivo mínimo

### 3. Análisis comparativo de características usando RandomForest
**Resultados**:
- **Modelo Diabetes**: RandomForest precisión: 76.8% vs Regresión Logística: 78.6%
- **Modelo Seguro**: RandomForest R²: 84.2% vs Regresión Polinomial: 86.7%
- **Conclusión**: Los modelos lineales superan a RandomForest para estos datasets específicos debido a la naturaleza de las relaciones en los datos.

### 4. ¿Qué técnica de optimización mejora el rendimiento de ambos modelos?
**Técnicas de Optimización Aplicadas**:
- **Diabetes**: Ajuste de hiperparámetros con GridSearchCV (C=1.0, penalty='l2'), preprocesamiento de características con transformadores personalizados
- **Seguro**: Características polinomiales (grado=2), selección de características removiendo variables de bajo impacto
- **Ambos**: StandardScaler para normalización de características, validación cruzada para evaluación robusta

### 5. Contexto de los datos
**Datasets Utilizados**:
- **Dataset Diabetes**: 768 pacientes, 8 características médicas (Base de Datos Diabetes Indios Pima)
- **Dataset Seguro**: 1,338 clientes, 6 características demográficas/salud
- **Ambos datasets**: Datos reales médicos/seguros con preprocesamiento adecuado para valores faltantes y outliers

### 6. Análisis del sesgo de los modelos
**Análisis de Sesgo**:
- **Modelo Diabetes**: Muestra sesgo demográfico hacia mujeres Indias Pima, puede no generalizarse a otras poblaciones
- **Modelo Seguro**: Sesgo geográfico (regiones específicas de EE.UU.), potencial sesgo socioeconómico en patrones de fumado
- **Mitigación**: Se implementaron técnicas de validación, ingeniería de características y se documentaron limitaciones

## Contribuciones

1. Los modelos están entrenados con datasets reales
2. Seguir patrones de Clean Architecture
3. Agregar pruebas para nuevas características
4. Actualizar README para nueva funcionalidad

## Licencia

MIT License