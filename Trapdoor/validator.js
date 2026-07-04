'use strict';
// AUTO-GENERATED — Trapdoor validator. See obfuscate.js for how this
// was built. This file is meant to be published alongside N.
//
// It reconstructs p at runtime by unmasking limbs against a keystream
// derived from N. Reading this file carefully DOES let you recover p
// without factoring N — that's an intentional (documented) property
// of Trapdoor, not a bug.

const crypto = require('crypto');

const N = 15317320322232863913999316847658354457445477609645317947958265997190293578251376696523695962933539715744210915022861n;
const LIMB_HEX = ['8231d875b9a6', '4a697249365c', 'eb7a0f237d16', 'ff0a59dd1a3c'];
const UNSHUFFLE = [1, 0, 3, 2];
const TOTAL_LEN = 24;

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
