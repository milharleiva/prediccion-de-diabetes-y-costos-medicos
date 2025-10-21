# Multi-stage build for Next.js + Python
FROM python:3.9-slim as python-base

# Install Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Node.js stage
FROM node:18-alpine as node-base

# Install Python in Node container
RUN apk add --no-cache python3 py3-pip

# Copy Python dependencies from python-base
COPY --from=python-base /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=python-base /usr/local/bin /usr/local/bin

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]