FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
