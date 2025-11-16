FROM node:20.19-alpine

# Install dependencies
RUN npm install -g npm@latest

# Install the application
COPY package.json .
RUN npm install

# Copy the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "app.js"]