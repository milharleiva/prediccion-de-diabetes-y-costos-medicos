#!/bin/bash

# Verificar que Python esté disponible
python3 --version
pip3 --version

# Verificar que las librerías estén instaladas
python3 -c "import joblib; print('joblib OK')"
python3 -c "import pandas; print('pandas OK')"
python3 -c "import sklearn; print('sklearn OK')"

# Iniciar la aplicación
npm start