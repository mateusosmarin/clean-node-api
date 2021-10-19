FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only production

COPY dist dist

EXPOSE 3030
CMD npm start
