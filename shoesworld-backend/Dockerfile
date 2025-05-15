# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3001

# Start app
CMD ["node", "server.js"]
