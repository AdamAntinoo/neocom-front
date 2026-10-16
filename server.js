'use strict';

/**
 * Production-style static + API proxy server for NEOCOM Front.
 *
 * Uses http-proxy-middleware (maintained, Express 4/5 friendly) instead of
 * express-http-proxy from the Infinity sample — same route behavior, clearer
 * mount semantics with createProxyMiddleware.
 *
 * Config: config/backends.json via config/load-backends.cjs (+ env overrides).
 * Shared with Angular ng serve through proxy.conf.js.
 */

try {
  require('dotenv').config();
} catch {
  // dotenv is optional when env is injected by the host
}

const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { loadBackendsConfig } = require('./config/load-backends.cjs');

const cfg = loadBackendsConfig();
const app = express();
const staticDir = path.join(__dirname, cfg.staticRoot);

app.use(compression());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  console.log(`${req.method} ${req.url}`);
  next();
});

for (const route of cfg.routes) {
  // Mount at route.path; Express strips the mount prefix from req.url, so
  // restore it so upstream receives /api/..., /nin/v1/..., /esi/v1/... (Infinity-like).
  app.use(
    route.path,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: (urlPath) => `${route.path}${urlPath}`,
      on: {
        proxyReq: (_proxyReq, req) => {
          console.log(
            `Proxy [${route.label}] ${req.method} ${route.path}${req.url} → ${route.target}${route.path}${req.url}`,
          );
        },
      },
    }),
  );
}

const staticOptions = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  lastModified: true,
  redirect: false,
  setHeaders(res) {
    res.setHeader('x-app-name', cfg.appName);
  },
};

// Angular baseHref is /app/ — serve the build under that path (SSO callback too).
app.use('/app', express.static(staticDir, staticOptions));

app.get('/app', (_req, res) => {
  res.redirect(302, '/app/');
});

app.get(/^\/app(?:\/.*)?$/, (req, res, next) => {
  if (path.extname(req.path)) {
    next();
    return;
  }
  const indexHtml = path.join(staticDir, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    res
      .status(503)
      .send(
        `Angular build not found at ${cfg.staticRoot}. Run: npm run build`,
      );
    return;
  }
  res.sendFile(indexHtml);
});

app.get('/', (_req, res) => {
  res.redirect(302, '/app/');
});

const YELLOW = '\x1b[33m\x1b[1m';
const GREEN = '\x1b[32m\x1b[1m';
const BLUE = '\x1b[34m\x1b[1m';
const RESET = '\x1b[0m';

app.listen(cfg.port, () => {
  console.log(`${GREEN}${cfg.appName}${RESET}`);
  console.log(`Profile: ${YELLOW}${cfg.profileName}${RESET}`);
  console.log(`Port:    ${YELLOW}${cfg.port}${RESET}`);
  console.log(`Static:  ${BLUE}${staticDir}${RESET}`);
  for (const route of cfg.routes) {
    console.log(
      `Proxy:   ${YELLOW}${route.path}${RESET} → ${GREEN}${route.target}${RESET} (${route.label})`,
    );
  }
  console.log(`URL:     ${GREEN}http://localhost:${cfg.port}/${RESET}`);

  const bannerPath = path.join(__dirname, '.app-banner.txt');
  if (fs.existsSync(bannerPath)) {
    console.log(fs.readFileSync(bannerPath, 'utf8'));
  }
  console.log(`${GREEN}>>> Server ready <<<${RESET}`);
});
