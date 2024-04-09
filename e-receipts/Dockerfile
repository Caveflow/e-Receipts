# Step 1: Use an official Node.js runtime as a parent image
FROM node:14

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Bundle app source inside Docker image
COPY . .

# Step 5: Build your Vue.js application for production
RUN npm run build

# Step 6: Install a simple http server for serving static content
RUN npm install -g http-server

# Step 7: Expose port 8080 for the server
EXPOSE 8080

# Step 8: Run the server
CMD [ "http-server", "dist" ]
