'use strict';
// Designer-only tool. Run once, keep secret-keys.json to yourself,
// ship public-N.txt (and the generated validator) to the world.
//
// Usage: node keygen.js [bits-per-prime]
const fs = require('fs');
const { randomPrime } = require('./bigmath');

const bits = parseInt(process.argv[2] || '256', 10);

console.error(`Generating two ${bits}-bit primes... (this can take a few seconds)`);
const p = randomPrime(bits);
let q = randomPrime(bits);
while (q === p) q = randomPrime(bits);
const N = p * q;

fs.writeFileSync('secret-keys.json', JSON.stringify({
  p: p.toString(), q: q.toString()
}, null, 2));

fs.writeFileSync('public-N.txt', N.toString());

console.error('Wrote secret-keys.json (KEEP PRIVATE) and public-N.txt (publish this).');
console.error(`N has ${N.toString(2).length} bits.`);
