import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PredictionRepository } from '../../../infrastructure/repositories/PredictionRepository';

export const Header: React.FC = () => {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState({ diabetes: false, insurance: false });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    const repository = new PredictionRepository();
    const diabetesStatus = await repository.checkApiHealth('diabetes');
    const insuranceStatus = await repository.checkApiHealth('insurance');

    setApiStatus({
      diabetes: diabetesStatus,
      insurance: insuranceStatus
    });
  };

  const navigation = [
    { name: 'Home', href: '/', current: router.pathname === '/' },
    { name: 'Diabetes Check', href: '/diabetes', current: router.pathname === '/diabetes' },
    { name: 'Insurance Cost', href: '/insurance', current: router.pathname === '/insurance' },
    { name: 'About', href: '/about', current: router.pathname === '/about' },
  ];

  return (
    <header className="bg-white shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gradient">Health Predictor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* API Status & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* API Status Indicators */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className={apiStatus.diabetes ? 'status-online' : 'status-offline'}></div>
                <span className="text-xs text-gray-500">Diabetes API</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={apiStatus.insurance ? 'status-online' : 'status-offline'}></div>
                <span className="text-xs text-gray-500">Insurance API</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile API Status */}
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                <div className="text-xs text-gray-500 mb-2">API Status:</div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={apiStatus.diabetes ? 'status-online' : 'status-offline'}></div>
                    <span className="text-sm">Diabetes API</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={apiStatus.insurance ? 'status-online' : 'status-offline'}></div>
                    <span className="text-sm">Insurance API</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};