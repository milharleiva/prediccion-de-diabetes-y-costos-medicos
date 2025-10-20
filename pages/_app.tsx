import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globals.css';
import { validateEnvironment } from '../src/infrastructure/config/ApiConfig';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Validate environment on app start
    const { valid, errors } = validateEnvironment();
    if (!valid) {
      console.warn('Environment validation issues:', errors);
    }

    // Log app initialization
    console.log('🚀 Health Predictor App initialized');
    console.log('Environment:', process.env.NODE_ENV);
  }, []);

  return <Component {...pageProps} />;
}