'use strict';

const crypto = require('..');
const assert = require('assert').strict;

assert.strictEqual(crypto(), 'Hello from crypto');
console.info('crypto tests passed');
