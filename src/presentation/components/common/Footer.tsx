import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Health Predictor</h3>
            <p className="text-gray-300 text-sm">
              AI-powered health predictions using machine learning models for diabetes risk assessment
              and insurance cost estimation. Built with clean architecture and modern web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/diabetes" className="text-gray-300 hover:text-white transition-colors">
                  Diabetes Risk Check
                </a>
              </li>
              <li>
                <a href="/insurance" className="text-gray-300 hover:text-white transition-colors">
                  Insurance Cost Calculator
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About the Models
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Technical Stack</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Next.js + TypeScript</li>
              <li>• Clean Architecture</li>
              <li>• Python ML APIs (FastAPI)</li>
              <li>• Scikit-learn Models</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Health Predictor. Built for educational purposes.
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-600 px-2 py-1 rounded text-xs">Next.js</span>
                <span className="bg-green-600 px-2 py-1 rounded text-xs">Python</span>
                <span className="bg-purple-600 px-2 py-1 rounded text-xs">ML</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p>
              ⚠️ Disclaimer: This application is for educational purposes only.
              Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};