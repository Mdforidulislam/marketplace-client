# Update Node.js version to a newer one that supports modern syntax
FROM node:18

# Set working directory (e.g., /app or /src)
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all other frontend source files
COPY . .

# Expose the port on which the frontend runs
EXPOSE 5173

# Start the frontend app
CMD ["npm", "start"]
