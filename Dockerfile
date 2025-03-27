FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY . ./


EXPOSE 3000

RUN chmod +x ./setup.sh
CMD ["./setup.sh"]