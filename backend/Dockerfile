FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
