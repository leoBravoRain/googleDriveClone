# SvelteKit Development Container
# alpine is a lightweight linux distribution
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
# --host "0.0.0.0"**: Allows connections from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
