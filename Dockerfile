FROM node:lts-slim

WORKDIR /app

COPY ./package.json .
COPY ./index.js .
RUN npm install

EXPOSE 8080

VOLUME ["/app/data"]

CMD ["node", "index.js"]