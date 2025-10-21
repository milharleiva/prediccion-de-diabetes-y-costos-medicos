#!/bin/bash

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    npm install
fi

# Instalar dependencias Python si no están instaladas
pip install -r requirements.txt

# Construir la aplicación Next.js
npm run build

# Iniciar la aplicación
npm start