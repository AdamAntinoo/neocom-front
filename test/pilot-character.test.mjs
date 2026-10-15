import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { GameCredential, Pilot } from '../../neocom-domain/dist/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const wiremockRoot = path.resolve(here, '../support/wiremock');
const port = 18080;

test('WireMock character 93813310 builds a Pilot and stays within the credential limit', async () => {
  const stop = await startWireMock(wiremockRoot, port);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/characters/93813310`);
    assert.equal(response.status, 200);
    const body = await response.json();
    const pilot = Pilot.fromCharacter(93813310, body);

    assert.equal(pilot.characterId, 93813310);
    assert.equal(pilot.name, 'Perico Tuerto');
    assert.equal(pilot.birthday, '2013-09-09T19:40:09Z');
    assert.equal(pilot.bloodlineId, 6);
    assert.equal(pilot.corporationId, 1000077);
    assert.equal(pilot.gender, 'male');
    assert.equal(pilot.raceId, 4);
    assert.equal(pilot.achievementScore, 0);
    assert.equal(pilot.description, '');
    assert.equal(pilot.securityStatus, 0);

    const credential = new GameCredential();
    assert.equal(credential.addPilot(pilot), true);
    assert.equal(credential.addPilot(Pilot.fromCharacter(2, body)), true);
    assert.equal(credential.addPilot(Pilot.fromCharacter(3, body)), true);
    assert.equal(credential.addPilot(Pilot.fromCharacter(4, body)), false);
    assert.equal(credential.pilotCount, 3);
  } finally {
    await stop();
  }
});

function startWireMock(rootDir, listenPort) {
  const container = `neocom-pilot-wiremock-${process.pid}`;
  const child = spawn(
    'docker',
    [
      'run',
      '--rm',
      '--name',
      container,
      '-p',
      `${listenPort}:8080`,
      '-v',
      `${rootDir}:/home/wiremock`,
      'wiremock/wiremock:3.13.1',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let logs = '';
  child.stdout?.on('data', (chunk) => {
    logs += chunk.toString();
  });
  child.stderr?.on('data', (chunk) => {
    logs += chunk.toString();
  });

  const stop = () =>
    new Promise((resolve) => {
      const killer = spawn('docker', ['rm', '-f', container], { stdio: 'ignore' });
      killer.on('exit', () => resolve());
      child.kill();
    });

  return waitForAdmin(listenPort).then(
    () => stop,
    async (error) => {
      await stop();
      const detail = logs.trim();
      throw new Error(detail ? `${error.message}\n${detail}` : error.message);
    },
  );
}

async function waitForAdmin(listenPort) {
  const deadline = Date.now() + 90000;
  let lastError = 'WireMock did not become ready';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${listenPort}/__admin/mappings`);
      if (response.ok) {
        return;
      }
      lastError = `WireMock admin status ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(lastError);
}
