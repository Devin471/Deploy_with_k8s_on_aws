FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --omit=dev --no-audit --progress=false

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
