# Step 1: Build the Vue.js application
# Use an official Node.js runtime as a parent image to build the Vue.js app
FROM node:14 as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to workdir in container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e., "/app" folder)
COPY . .

# Build app for production with minification
RUN npm run build

# Step 2: Serve the application using Nginx
# Use an official Nginx image to serve the built application
FROM nginx:stable as production-stage

# Copy the built app from the previous stage into the Nginx server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
