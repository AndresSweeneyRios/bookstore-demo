FROM node:22-alpine AS build
RUN npm i -g npm@^11.6.2 && npm -v
WORKDIR /org
COPY package*.json ./
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG EXPRESS_PORT
ENV \
  NPM_CONFIG_AUDIT=false \
  NPM_CONFIG_FUND=false \
  npm_config_foreground_scripts=true \
  NODE_ENV=production \
  POSTGRES_USER=$POSTGRES_USER \
  POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  POSTGRES_DB=$POSTGRES_DB \
  EXPRESS_PORT=$EXPRESS_PORT
RUN npm ci --include=dev
COPY nx.json tsconfig.base.json ./
COPY libs/ libs/
COPY utils/ utils/
COPY apps/frontend/ apps/frontend/
COPY apps/backend/ apps/backend/
ENV NX_DAEMON=false
RUN npx nx build frontend --prod && npx nx build backend --prod

FROM node:22-alpine AS run-backend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /org/apps/backend/dist/ /app/
CMD ["node", "--enable-source-maps", "/app/index.js"]

FROM nginx:alpine AS run-frontend
WORKDIR /var/www/html
RUN rm -rf /var/www/html/*
COPY nginx.conf /etc/nginx/
COPY --from=build /org/apps/frontend/dist/ /var/www/html/
CMD ["nginx", "-g", "daemon off;"]
