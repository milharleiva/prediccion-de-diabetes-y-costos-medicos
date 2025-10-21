import React from 'react';
import Link from 'next/link';
import { Layout } from '../src/presentation/components/common/Layout';

export default function HomePage() {
  const features = [
    {
      title: 'Evaluación de Riesgo de Diabetes',
      description: 'Predice el riesgo de diabetes usando algoritmos avanzados de aprendizaje automático entrenados con datos médicos.',
      icon: '🩺',
      href: '/diabetes',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Calculadora de Costos de Seguros',
      description: 'Estima los costos anuales del seguro de salud basado en factores personales y de salud.',
      icon: '💰',
      href: '/insurance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Análisis Potenciado por IA',
      description: 'Obtén predicciones instantáneas con explicaciones detalladas y análisis de factores de riesgo.',
      icon: '🤖',
      href: '/about',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <Layout title="Predictor de Salud - Predicciones de Salud con IA">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">Predictor de Salud</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Aprovecha el poder de la inteligencia artificial para evaluar riesgos de salud y estimar costos de seguros.
          Nuestros modelos de aprendizaje automático proporcionan información instantánea basada en datos para mejores decisiones de salud.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/diabetes" className="btn-primary text-lg px-8 py-3">
            Verificar Riesgo de Diabetes
          </Link>
          <Link href="/insurance" className="btn-secondary text-lg px-8 py-3">
            Calcular Costo de Seguro
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Link key={feature.title} href={feature.href}>
            <div className="card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="card p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Rendimiento del Modelo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Diabetes Model Stats */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Modelo de Predicción de Diabetes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">76.6%</div>
                <div className="text-sm text-gray-500">Precisión</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">86.9%</div>
                <div className="text-sm text-gray-500">AUC-ROC</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">73.7%</div>
                <div className="text-sm text-gray-500">Exactitud</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">768</div>
                <div className="text-sm text-gray-500">Muestras de Entrenamiento</div>
              </div>
            </div>
          </div>

          {/* Insurance Model Stats */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Modelo de Costos de Seguros</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">86.7%</div>
                <div className="text-sm text-gray-500">Puntuación R²</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">$2,774</div>
                <div className="text-sm text-gray-500">MAE</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">$4,543</div>
                <div className="text-sm text-gray-500">RMSE</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">1,338</div>
                <div className="text-sm text-gray-500">Muestras de Entrenamiento</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-8">Cómo Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Ingresar Datos', description: 'Introduce tu información de salud' },
            { step: '2', title: 'Análisis de IA', description: 'El aprendizaje automático procesa tus datos' },
            { step: '3', title: 'Obtener Resultados', description: 'Recibe predicciones instantáneas' },
            { step: '4', title: 'Tomar Acción', description: 'Toma decisiones informadas de salud' }
          ].map((item, index) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card p-8 text-center bg-gradient-to-r from-primary-50 to-blue-50">
        <h2 className="text-2xl font-bold mb-4">¿Listo para Comenzar?</h2>
        <p className="text-gray-600 mb-6">
          Toma control de tu salud con predicciones e insights potenciados por IA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/diabetes" className="btn-primary">
            Comenzar Evaluación de Diabetes
          </Link>
          <Link href="/insurance" className="btn-secondary">
            Calcular Costo de Seguro
          </Link>
        </div>
      </div>
    </Layout>
  );
}