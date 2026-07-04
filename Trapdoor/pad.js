'use strict';
// Programmer-side tool. Requires knowing p (either you factored N,
// or the designer gave it to you for validation assistance).
//
// Strategy: append a block comment `/* <payload> */` whose byte
// value is solved so the WHOLE FILE's byte-integer is divisible by
// p. Comments are semantically inert in JS, so this never changes
// what the program does — only whether it's "valid Trapdoor".
//
// Usage: node pad.js <p-decimal> <input.js> <output.td>

const fs = require('fs');
const { modPow } = require('./bigmath');

const [, , pArg, inFile, outFile] = process.argv;
if (!pArg || !inFile || !outFile) {
  console.error('usage: node pad.js <p-decimal> <input.js> <output.td>');
  process.exit(1);
}
const p = BigInt(pArg);

const body = fs.readFileSync(inFile);
const prefix = Buffer.concat([body, Buffer.from('\n/*')]);
const suffix = Buffer.from('*/');

function bufToInt(buf) {
  let n = 0n;
  for (const b of buf) n = (n << 8n) | BigInt(b);
  return n;
}

function intToBuf(n, len) {
  const buf = Buffer.alloc(len);
  for (let i = len - 1; i >= 0; i--) {
    buf[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return buf;
}

// forbidden: "*/" must not appear anywhere except the intended close,
// and payload[0] must not be '/' (would close prefix's trailing "/*"
// early), i.e. no accidental early comment termination.
function violates(payload) {
  if (payload.length > 0 && payload[0] === 0x2f) return true; // '/'
  for (let i = 0; i + 1 < payload.length; i++) {
    if (payload[i] === 0x2a && payload[i + 1] === 0x2f) return true; // "*/"
  }
  return false;
}

const prefixVal = bufToInt(prefix);
const suffixVal = bufToInt(suffix);
const L = BigInt(suffix.length);
const invPow256L = modPow(256n, p - 2n, p); // Fermat inverse, p prime
const invFactor = modPow(invPow256L, L, p); // inverse of 256^L mod p

// margin bytes give us room to try several m's if the first hits "*/"
const pBytesLen = Math.ceil(p.toString(16).length / 2);
const k = pBytesLen + 2;
const cap = 1n << BigInt(8 * k); // 256^k

const prefixValModP = prefixVal % p;
const shift = modPow(256n, BigInt(k), p);
const rhs = ((-(suffixVal * invFactor) % p + p) % p - (prefixValModP * shift) % p + p * 2n) % p;

let found = null;
for (let m = 0n; ; m++) {
  const candidate = rhs + m * p;
  if (candidate >= cap) throw new Error('ran out of room in payload; increase margin');
  const payload = intToBuf(candidate, k);
  if (!violates(payload)) { found = payload; break; }
}

const out = Buffer.concat([prefix, found, suffix]);
fs.writeFileSync(outFile, out);

// sanity check (pass the raw Buffer — no string round-trip)
const { sourceToInt } = require('./validator');
const total = sourceToInt(out);
console.error(`Wrote ${outFile} (${out.length} bytes, ${found.length}-byte payload).`);
console.error(`Divisible by p: ${total % p === 0n}`);
