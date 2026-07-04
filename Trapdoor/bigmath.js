'use strict';
// Minimal BigInt number theory — no external deps, so the whole
// esolang toolchain runs with nothing but `node`.

function randomBigInt(bits) {
  const bytes = Math.ceil(bits / 8);
  const buf = require('crypto').randomBytes(bytes);
  buf[0] |= 0x80; // force top bit set -> exact bit length
  buf[bytes - 1] |= 1; // force odd
  let n = 0n;
  for (const b of buf) n = (n << 8n) | BigInt(b);
  return n;
}

function modPow(base, exp, mod) {
  base %= mod;
  let result = 1n;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

// Miller-Rabin, k rounds. Good enough for esolang-grade keys.
function isProbablePrime(n, k = 20) {
  if (n < 2n) return false;
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n]) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  let d = n - 1n, r = 0n;
  while (d % 2n === 0n) { d /= 2n; r += 1n; }
  witnessLoop: for (let i = 0; i < k; i++) {
    const a = 2n + (randomBigInt(64) % (n - 4n));
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    for (let j = 0n; j < r - 1n; j++) {
      x = (x * x) % n;
      if (x === n - 1n) continue witnessLoop;
    }
    return false;
  }
  return true;
}

function randomPrime(bits) {
  for (;;) {
    const cand = randomBigInt(bits) | 1n;
    if (isProbablePrime(cand)) return cand;
  }
}

function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

module.exports = { randomBigInt, modPow, isProbablePrime, randomPrime, gcd };
