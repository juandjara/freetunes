FROM node:18-alpine

RUN apk --no-cache add ffmpeg git
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json /app/
RUN npm ci

COPY . /app

ENV NODE_ENV production

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD [ "npm", "start" ]
