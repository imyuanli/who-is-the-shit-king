FROM node:alpine

WORKDIR /who-is-the-shit-king

COPY package*.json ./

RUN npm install

COPY main.mjs ./

CMD npm start
