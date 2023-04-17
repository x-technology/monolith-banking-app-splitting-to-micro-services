FROM node:16-alpine
EXPOSE 3000 6379 50051 8080

RUN npm install -g npm

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install -g ts-node-dev

# nest
RUN npm install -g @nestjs/cli

RUN npm install -g ts-proto

RUN apk -U --no-cache add protobuf protobuf-dev

# ncu -u
RUN npm install -g npm-check-updates
