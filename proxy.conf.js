'use strict';

/**
 * Angular dev-server proxy — same routes/targets as Node `server.js`,
 * loaded from config/backends.json (default profile: wiremock).
 *
 * Override with NEOCOM_PROFILE / WIREMOCK_URL / BACKEND_URL / NEST_URL.
 */
const { loadBackendsConfig, toAngularProxyConfig } = require('./config/load-backends.cjs');

module.exports = toAngularProxyConfig(loadBackendsConfig());
