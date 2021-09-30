FROM node:14-alpine3.10 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install 

COPY .env.dev .env

COPY . .

RUN npm run build