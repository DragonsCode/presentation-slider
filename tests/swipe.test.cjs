const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup() {
  const handlers = {};
  let active = 0;
  const document = {};
  const selection = {length: 3, eq: index => ({addClass: () => {active=index; return {show(){}, css(){}};}, removeClass: () => ({css(){}})}), on() {}};
  const $ = selector => selector === document ? {ready: callback => callback(), keydown: callback => {handlers.keydown=callback;}} : selector === '.slide' ? selection : {on: (event, callback) => {handlers[event]=callback;}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../script/main.js'), 'utf8'), {$, document, setTimeout});
  return {handlers, active: () => active};
}
const start = x => ({touches: [{clientX:x}]});
const end = x => ({changedTouches: [{clientX:x}]});

test('a tap without touchmove is safe and stays on the same slide', () => {
  const {handlers, active} = setup();
  handlers.touchstart(start(100));
  handlers.touchend(end(100));
  assert.equal(active(), 0);
});

test('swipe uses release position even without a touchmove event', () => {
  const {handlers, active} = setup();
  handlers.touchstart(start(180)); handlers.touchend(end(80));
  assert.equal(active(), 1);
});

test('a tap after a swipe cannot reuse stale coordinates', () => {
  const {handlers, active} = setup();
  handlers.touchstart(start(180)); handlers.touchmove(start(80)); handlers.touchend(end(80));
  assert.equal(active(), 1);
  handlers.touchstart(start(240)); handlers.touchend(end(240));
  assert.equal(active(), 1);
});

test('cancelled gesture does not navigate and bounds remain intact', () => {
  const {handlers, active} = setup();
  handlers.touchstart(start(200)); handlers.touchmove(start(20)); handlers.touchcancel(); handlers.touchend(end(20));
  assert.equal(active(), 0);
  handlers.keydown({key:'ArrowLeft'}); assert.equal(active(), 0);
  for(let i=0;i<5;i++) handlers.keydown({key:'ArrowRight'});
  assert.equal(active(), 2);
});
