FROM node:8.10

RUN mkdir /opt/app
WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install

COPY app.js ./

CMD ["node", "app.js"]
