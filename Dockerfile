FROM node:11.15.0-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3001

CMD npm start