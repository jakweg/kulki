# FROM alpine:3.17.0
FROM node:16
WORKDIR /app
# RUN apk update && apk add nodejs npm libc6-compat libc6-dev
RUN apt update && apt install nodejs npm -y
RUN npm i esbuild --location=global
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build
CMD node ./dist/train.js