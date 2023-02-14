FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1337

RUN npm run build

# the command to run the build image
CMD [ "node", "build/src/app.js" ]