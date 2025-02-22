# Use official Node.js image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Expose port (match your Express.js port)
EXPOSE 3010

# Start the application
CMD ["node", "index.js"]
