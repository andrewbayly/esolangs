'use strict';
// Designer-only tool. Reads secret-keys.json, emits validator.js.
//
// IMPORTANT HONESTY NOTE (put this in your spec too):
// This does NOT cryptographically hide p. The validator has to
// reconstruct p in order to test divisibility, so anyone who reads
// and runs reconstruct() gets p in one line. What this buys you is:
//   - p never appears as a literal giant-integer constant to grep for
//   - recovering it requires executing/understanding the obfuscation,
//     not just factoring N (which is the "intended" hard path but is
//     NOT actually the only path — that's the joke of the esolang)
// If you want p to be *actually* unrecoverable from the validator,
// you need the validator to live server-side as an oracle instead of
// being shipped to players. See spec notes on "oracle mode".
//
// Usage: node obfuscate.js

const fs = require('fs');
const crypto = require('crypto');

const { p, q } = JSON.parse(fs.readFileSync('secret-keys.json', 'utf8'));
const P = BigInt(p);
const N = P * BigInt(q);

// Derive a keystream from N via SHA-256 counter mode, then XOR p's
// bytes against it. The validator re-derives the same keystream from
// the *published* N at runtime and XORs back to get p. Splitting p
// into limbs and shuffling them adds a small extra speed bump against
// "just read the buffer top to bottom."
function pToBytes(n) {
  let hex = n.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  return Buffer.from(hex, 'hex');
}

function keystream(seedBuf, len) {
  const out = Buffer.alloc(len);
  let counter = 0;
  let off = 0;
  while (off < len) {
    const h = crypto.createHash('sha256')
      .update(seedBuf)
      .update(Buffer.from([counter++]))
      .digest();
    h.copy(out, off);
    off += h.length;
  }
  return out;
}

const pBytes = pToBytes(P);
const nBytes = pToBytes(N);
const ks = keystream(nBytes, pBytes.length);
const masked = Buffer.alloc(pBytes.length);
for (let i = 0; i < pBytes.length; i++) masked[i] = pBytes[i] ^ ks[i];

// Split masked bytes into 4 shuffled limbs so the buffer isn't one
// contiguous recognizable blob.
const LIMBS = 4;
const limbs = [];
const chunk = Math.ceil(masked.length / LIMBS);
for (let i = 0; i < LIMBS; i++) {
  limbs.push(masked.subarray(i * chunk, Math.min((i + 1) * chunk, masked.length)));
}
const order = [...Array(LIMBS).keys()];
for (let i = order.length - 1; i > 0; i--) {
  const j = crypto.randomInt(i + 1);
  [order[i], order[j]] = [order[j], order[i]];
}
const shuffled = order.map(i => limbs[i]);
const unshuffle = order.map((srcPos, destPos) => [srcPos, destPos])
  .sort((a, b) => a[0] - b[0])
  .map(([, destPos]) => destPos);

const limbHexArray = shuffled.map(b => `'${b.toString('hex')}'`).join(', ');
const unshuffleArray = unshuffle.join(', ');
const totalLen = masked.length;

const src = `'use strict';
// AUTO-GENERATED — Trapdoor validator. See obfuscate.js for how this
// was built. This file is meant to be published alongside N.
//
// It reconstructs p at runtime by unmasking limbs against a keystream
// derived from N. Reading this file carefully DOES let you recover p
// without factoring N — that's an intentional (documented) property
// of Trapdoor, not a bug.

const crypto = require('crypto');

const N = ${N.toString()}n;
const LIMB_HEX = [${limbHexArray}];
const UNSHUFFLE = [${unshuffleArray}];
const TOTAL_LEN = ${totalLen};

function keystream(seedBuf, len) {
  const out = Buffer.alloc(len);
  let counter = 0, off = 0;
  while (off < len) {
    const h = crypto.createHash('sha256').update(seedBuf).update(Buffer.from([counter++])).digest();
    h.copy(out, off);
    off += h.length;
  }
  return out;
}

function nToBytes(n) {
  let hex = n.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  return Buffer.from(hex, 'hex');
}

function reconstructP() {
  const ordered = new Array(LIMB_HEX.length);
  LIMB_HEX.forEach((hex, shuffledPos) => {
    ordered[UNSHUFFLE[shuffledPos]] = Buffer.from(hex, 'hex');
  });
  const masked = Buffer.concat(ordered, TOTAL_LEN);
  const ks = keystream(nToBytes(N), masked.length);
  const pBytes = Buffer.alloc(masked.length);
  for (let i = 0; i < masked.length; i++) pBytes[i] = masked[i] ^ ks[i];
  return BigInt('0x' + pBytes.toString('hex'));
}

// Trapdoor's encoding: the program's raw source bytes, read
// big-endian, form a single integer. A program is valid iff that
// integer is divisible by p.
//
// IMPORTANT: this takes a raw Buffer, never a JS string. Not every
// byte sequence is valid UTF-8, and round-tripping arbitrary bytes
// through a UTF-8 string (encode->decode) can silently change them.
// Read source files as Buffers (fs.readFileSync(path), no encoding
// argument) all the way through the validity check.
function sourceToInt(source) {
  const bytes = Buffer.isBuffer(source) ? source : Buffer.from(source, 'latin1');
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n;
}

function isValid(source) {
  const p = reconstructP();
  return sourceToInt(source) % p === 0n;
}

module.exports = { isValid, sourceToInt, reconstructP, N };
`;

fs.writeFileSync('validator.js', src);
console.error('Wrote validator.js — publish this alongside public-N.txt.');
