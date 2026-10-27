const assert = require('assert');
const { PLANS, priceForPlan, clampUsers, formatCents } = require('./js/script.js');

const plan = (id) => PLANS.find((item) => item.id === id);

assert.strictEqual(priceForPlan(plan('starter'), 1, 'monthly').total, 799);
assert.strictEqual(priceForPlan(plan('pro'), 5, 'monthly').total, 7995);
assert.strictEqual(priceForPlan(plan('pro'), 5, 'yearly').total, 76752);
assert.strictEqual(priceForPlan(plan('pro'), 5, 'yearly').saving, 19188);
assert.strictEqual(priceForPlan(plan('business'), 100, 'monthly').total, 299900);
assert.strictEqual(priceForPlan(plan('business'), 100, 'yearly').total, 2879040);
assert.strictEqual(priceForPlan(plan('starter'), 1, 'yearly').total, 7670);

assert.strictEqual(clampUsers('0'), 1);
assert.strictEqual(clampUsers('-4'), 1);
assert.strictEqual(clampUsers('250'), 100);
assert.strictEqual(clampUsers('abc'), 1);
assert.strictEqual(clampUsers('42'), 42);

assert.strictEqual(formatCents(7995), '$79.95');
console.log('All tests passed.');
