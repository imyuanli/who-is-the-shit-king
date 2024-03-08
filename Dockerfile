FROM node:alpine

WORKDIR /who-is-the-shit-king

COPY package*.json ./

RUN npm install --production

COPY main.mjs ./

CMD npm start
