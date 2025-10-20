import React from 'react';
import Link from 'next/link';
import { Layout } from '../src/presentation/components/common/Layout';

export default function HomePage() {
  const features = [
    {
      title: 'Diabetes Risk Assessment',
      description: 'Predict diabetes risk using advanced machine learning algorithms trained on medical data.',
      icon: '🩺',
      href: '/diabetes',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Insurance Cost Calculator',
      description: 'Estimate annual health insurance costs based on personal and health factors.',
      icon: '💰',
      href: '/insurance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AI-Powered Analysis',
      description: 'Get instant predictions with detailed explanations and risk factor analysis.',
      icon: '🤖',
      href: '/about',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <Layout title="Health Predictor - AI-Powered Health Predictions">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">Health Predictor</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Harness the power of artificial intelligence to assess health risks and estimate insurance costs.
          Our machine learning models provide instant, data-driven insights for better health decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/diabetes" className="btn-primary text-lg px-8 py-3">
            Check Diabetes Risk
          </Link>
          <Link href="/insurance" className="btn-secondary text-lg px-8 py-3">
            Calculate Insurance Cost
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
        <h2 className="text-2xl font-bold text-center mb-8">Model Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Diabetes Model Stats */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Diabetes Prediction Model</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">76.6%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">86.9%</div>
                <div className="text-sm text-gray-500">AUC-ROC</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">73.7%</div>
                <div className="text-sm text-gray-500">Precision</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">768</div>
                <div className="text-sm text-gray-500">Training Samples</div>
              </div>
            </div>
          </div>

          {/* Insurance Model Stats */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Insurance Cost Model</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">86.7%</div>
                <div className="text-sm text-gray-500">R² Score</div>
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
                <div className="text-sm text-gray-500">Training Samples</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Input Data', description: 'Enter your health information' },
            { step: '2', title: 'AI Analysis', description: 'Machine learning processes your data' },
            { step: '3', title: 'Get Results', description: 'Receive instant predictions' },
            { step: '4', title: 'Take Action', description: 'Make informed health decisions' }
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
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Take control of your health with AI-powered predictions and insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/diabetes" className="btn-primary">
            Start Diabetes Assessment
          </Link>
          <Link href="/insurance" className="btn-secondary">
            Calculate Insurance Cost
          </Link>
        </div>
      </div>
    </Layout>
  );
}