FROM node:8.10

RUN mkdir /opt/app
WORKDIR /opt/app

COPY app.js package.json package-lock.json ./

RUN npm install
CMD ["node", "app.js"]

