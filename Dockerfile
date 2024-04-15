# develop stage
FROM node:18.16.0-alpine3.17 AS develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .
# build stage
FROM develop-stage AS build-stage
RUN yarn
RUN quasar build
# production stage
FROM nginx:1.17.5-alpine AS production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]