FROM node:11-alpine AS builder

WORKDIR /build

COPY . ./

RUN npm install && \
    npm run build

FROM node:11-alpine AS prod

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production && \
    sed -i 's/"@": ".*"/"@": "."/' package.json

COPY --from=builder /build/dist/ ./

EXPOSE 80

CMD ["node", "server.js"]
