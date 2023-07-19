FROM node:18.16.0-alpine
WORKDIR /usr/src/app

ARG API_URL

ENV NODE_ENV=production

ENV API_URL=$API_URL

COPY . .
RUN yarn install --production=false
RUN yarn build

EXPOSE 80
CMD [ "node", ".output/server/index.mjs" ]