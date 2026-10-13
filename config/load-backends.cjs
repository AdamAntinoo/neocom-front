'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Single source of truth loader for Node Express (`server.js`) and Angular
 * `ng serve` proxy (`proxy.conf.js`).
 *
 * Env overrides:
 *   NEOCOM_PROFILE — profile name (default: backends.json defaultProfile)
 *   PORT           — listen port
 *   WIREMOCK_URL   — overrides any route with envKey WIREMOCK_URL, or label wiremock
 *   BACKEND_URL    — overrides /api (or routes with envKey BACKEND_URL)
 *   NEST_URL       — overrides /nin/v1 and /esi/v1 (or routes with envKey NEST_URL)
 */
function loadBackendsConfig() {
  const configPath = path.join(__dirname, 'backends.json');
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const profileName = process.env.NEOCOM_PROFILE || raw.defaultProfile;
  const profile = raw.profiles[profileName];
  if (!profile) {
    const known = Object.keys(raw.profiles).join(', ');
    throw new Error(`Unknown NEOCOM_PROFILE "${profileName}". Known: ${known}`);
  }

  const routes = profile.routes.map((route) => {
    let target = route.target;

    if (route.envKey && process.env[route.envKey]) {
      target = process.env[route.envKey];
    }

    // Convenience overrides by path (apply even when envKey differs)
    if (route.path === '/api' && process.env.BACKEND_URL) {
      target = process.env.BACKEND_URL;
    }
    if ((route.path === '/nin/v1' || route.path === '/esi/v1') && process.env.NEST_URL) {
      target = process.env.NEST_URL;
    }
    if (
      process.env.WIREMOCK_URL &&
      (route.label === 'wiremock' || route.envKey === 'WIREMOCK_URL')
    ) {
      target = process.env.WIREMOCK_URL;
    }

    return { ...route, target };
  });

  return {
    profileName,
    appName: raw.server?.appName || 'NEOCOM Front',
    port: Number(process.env.PORT) || raw.server?.port || 3000,
    staticRoot: profile.staticRoot,
    spaBasePath: profile.spaBasePath || '/',
    routes,
  };
}

/** Angular CLI proxy config object derived from the active profile. */
function toAngularProxyConfig(resolved) {
  const proxyConfig = {};
  for (const route of resolved.routes) {
    proxyConfig[route.path] = {
      target: route.target,
      secure: false,
      changeOrigin: true,
      logLevel: 'info',
    };
  }
  return proxyConfig;
}

module.exports = { loadBackendsConfig, toAngularProxyConfig };
