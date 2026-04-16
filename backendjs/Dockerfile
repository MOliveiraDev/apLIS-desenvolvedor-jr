FROM node:20-alpine

WORKDIR /var/www/backendjs

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npm run migrate && npm run start"]
