FROM node:alpine

WORKDIR /who-is-the-shit-king

COPY package*.json ./

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

COPY main.mjs ./

CMD npm start
