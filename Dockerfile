# Runtime image for staging/prod Docker engine deploy (CICD-F-082 / F-083).
# Also used by front-ci acceptance (WireMock + this image on a shared Docker network).
# Build context: repository root after `npm run build`.
FROM node:24.21.0-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=6001
COPY package.json package-lock.json ./
# prepare runs `git config core.hooksPath` — no git in alpine runtime image.
RUN npm ci --omit=dev --ignore-scripts
COPY config ./config
COPY dist/neocom-front ./dist/neocom-front
COPY server.js ./
EXPOSE 6001
CMD ["node", "server.js"]
