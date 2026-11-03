FROM node:22-slim 
# preinstalled node environment
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV PORT=5000
CMD ["node", "app.js"]
