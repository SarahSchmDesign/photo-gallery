const { test, describe } = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');

// Simule auth logic
const SECRET = 'lumina-test-secret-key';
const ADMIN_PASSWORD = 'lumina-secret-2026';

function signToken(data) {
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  return `${data}.${signature}`;
}

function verifyToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [data, signature] = parts;
  const expectedHmac = crypto.createHmac('sha256', SECRET);
  expectedHmac.update(data);
  const expectedSignature = expectedHmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

function verifyPassword(pwd) {
  return pwd === ADMIN_PASSWORD;
}

describe('Auth Seam - Authentification Monoutilisateur', () => {
  test('vérifie correctement le mot de passe administrateur valide', () => {
    assert.strictEqual(verifyPassword('lumina-secret-2026'), true);
  });

  test('rejette un mot de passe administrateur erroné', () => {
    assert.strictEqual(verifyPassword('mauvais-mdp'), false);
    assert.strictEqual(verifyPassword(''), false);
  });

  test('génère et vérifie un jeton HMAC de session valide', () => {
    const token = signToken('admin-session-12345');
    assert.ok(token.includes('.'));
    assert.strictEqual(verifyToken(token), true);
  });

  test('rejette un jeton altéré ou falsifié', () => {
    const token = signToken('admin-session-12345');
    const tampered = token.slice(0, -4) + '0000';
    assert.strictEqual(verifyToken(tampered), false);
    assert.strictEqual(verifyToken('jeton-invalide'), false);
    assert.strictEqual(verifyToken(''), false);
  });
});
