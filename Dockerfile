# Runtime image for staging/prod Docker engine deploy (CICD-F-082 / F-083).
# Build context: repository root after `npm run build`.
FROM node:24.21.0-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY dist/neocom-front ./dist/neocom-front
COPY server.js ./
EXPOSE 6001
CMD ["node", "server.js"]
