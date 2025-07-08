FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Environment variables
ENV NODE_ENV=production
ENV MCP_PORT=3000

# Required environment variables (to be provided at runtime)
ENV CUSTOM_API_URL=""
ENV CUSTOM_API_TOKEN=""

# Start the application
CMD ["npm", "start"] 
