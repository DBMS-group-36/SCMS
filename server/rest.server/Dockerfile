# Dockerfile
FROM node:18.1.0-alpine3.15
RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN adduser -S app

COPY . ./

RUN npm install

RUN npm run build

RUN chown -R app /opt/app

USER app

EXPOSE 3000

CMD [ "npm", "run", "start" ]
