'use strict';
// Usage: node trapdoor.js <program.td>
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { isValid } = require('./validator');

const file = process.argv[2];
if (!file) {
  console.error('usage: node trapdoor.js <program.td>');
  process.exit(1);
}

const raw = fs.readFileSync(file); // Buffer, no encoding — see validator.js note

if (!isValid(raw)) {
  console.error(`REJECTED: ${path.basename(file)} is not divisible by p. Not a valid Trapdoor program.`);
  process.exit(1);
}

console.error(`ACCEPTED: source is divisible by p. Executing...`);
// latin1 is a lossless byte<->char mapping, so this can't corrupt the
// padding bytes even though they're not text.
const source = raw.toString('latin1');
vm.runInNewContext(source, {
  console,
  // deliberately no require/process — keep the sandbox boring
}, { filename: file });
