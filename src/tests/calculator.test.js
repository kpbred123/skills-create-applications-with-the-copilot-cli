const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { add, subtract, multiply, divide, calculate } = require('../calculator');

describe('calculator operations', () => {
  test.each([
    [2, 3, 5],
    [0, 0, 0],
    [-2, 3, 1],
    [1.25, 2.5, 3.75],
  ])('adds %s and %s', (first, second, expected) => {
    expect(add(first, second)).toBe(expected);
  });

  test.each([
    [10, 4, 6],
    [4, 10, -6],
    [0, 0, 0],
    [7.5, 2.25, 5.25],
  ])('subtracts %s and %s', (first, second, expected) => {
    expect(subtract(first, second)).toBe(expected);
  });

  test.each([
    [45, 2, 90],
    [-3, 4, -12],
    [0, 100, 0],
    [1.5, 2, 3],
  ])('multiplies %s by %s', (first, second, expected) => {
    expect(multiply(first, second)).toBe(expected);
  });

  test.each([
    [20, 5, 4],
    [9, 2, 4.5],
    [-12, 3, -4],
    [0, 5, 0],
  ])('divides %s by %s', (first, second, expected) => {
    expect(divide(first, second)).toBe(expected);
  });

  test.each([0, -0])('rejects division by zero (%s)', (zero) => {
    expect(() => divide(1, zero)).toThrow('Division by zero');
  });

  test('dispatches each supported operator', () => {
    expect(calculate(2, '+', 3)).toBe(5);
    expect(calculate(10, '-', 4)).toBe(6);
    expect(calculate(45, '*', 2)).toBe(90);
    expect(calculate(20, '/', 5)).toBe(4);
  });

  test('rejects unsupported operators', () => {
    expect(() => calculate(2, '%', 3)).toThrow('Unsupported operator');
  });

  test.each([
    [Number.NaN, 1],
    [1, Number.POSITIVE_INFINITY],
    [Number.NEGATIVE_INFINITY, 1],
    ['2', 3],
  ])('rejects non-finite or non-number operands: %s and %s', (first, second) => {
    expect(() => add(first, second)).toThrow('valid finite numbers');
  });
});

describe('calculator CLI', () => {
  const calculatorPath = path.join(__dirname, '..', 'calculator.js');

  test('prints a calculation result', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '2', '+', '3'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('5');
  });

  test('reports division by zero as an error', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '20', '/', '0'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Division by zero');
  });
});
