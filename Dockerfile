FROM node:20-alpine

WORKDIR /app/src

COPY ./src .

RUN npm install
RUN npm run build

EXPOSE 8000

CMD [ "npm", "start" ]