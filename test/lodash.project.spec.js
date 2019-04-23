/* global test expect */
/* eslint-disable no-template-curly-in-string */

const _ = require('lodash');

_.mixin(require('../lodash.project'));
/*
  let object;
  beforeAll(() => {
    object = [{
      name: 'parent',
      childs: [
        {
          name: 'child',
          childs: [{
            name: 'grandchild',
          }],
        },
      ],
    }, {
      name: 'brother',
    }];
  });
*/

test('leave it alone if no dollar-curly', () => {
  const test = _.project({ test: 'value' }, { projected: 'test' });

  expect(test.projected).toEqual('test');
});

test('replaces a key', () => {
  const test = _.project({ test: 'value' }, { projected: '${test}' });

  expect(test.projected).toEqual('value');
});

test('replaces a key deeply stored', () => {
  const test = _.project({ test: 'value' }, { level1: { level2: '${test}' } });

  expect(test.level1.level2).toEqual('value');
});

test('ignore values that are not a string', () => {
  const test = _.project({ test: 'value' }, { level1: 1 });

  expect(test.level1).toEqual(1);
});

test('retains the type of the value passed', () => {
  const test = _.project({ test: 1 }, { projected: '${test}' });

  expect(test.projected).toEqual(1);
});

test('process a contained array', () => {
  const test = _.project({ values: [{ a: 1 }, { a: 2 }] }, { a: { $array: 'values', $template: { x: '${a}' } } });

  expect({ a: [{ x: 1 }, { x: 2 }] }).toEqual(test);
});

test('creates and object from array', () => {
  const test = _.project({ values: [{ a: 1 }, { a: 2 }] }, { a: { $object_from_array: 'values', $key: 'a', $template: { x: '${a}' } } });

  expect({ a: { 1: { x: 1 }, 2: { x: 2 } } }).toEqual(test);
});
