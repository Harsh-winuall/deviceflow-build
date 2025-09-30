# Use Node.js 18.18.0 runtime as a parent image
FROM node:18.18.0

# Set the working directory
WORKDIR /application

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy .env.example to .env if .env doesn't exist
RUN cp .env.example .env || true

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3200

# Start the application
CMD ["npm", "start"]