FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose MCP port (default: 3000)
EXPOSE 3000

# Start the MCP server
CMD ["node", "dist/index.js"] 
