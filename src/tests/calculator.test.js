const { spawnSync } = require('node:child_process');
const path = require('node:path');
const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  exponentiate,
  squareRoot,
  calculate,
} = require('../calculator');

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

  test.each([
    [10, 3, 1],
    [12, 4, 0],
    [-10, 3, -1],
    [10.5, 2, 0.5],
  ])('calculates the remainder of %s divided by %s', (first, second, expected) => {
    expect(modulo(first, second)).toBe(expected);
  });

  test('rejects modulo by zero', () => {
    expect(() => modulo(10, 0)).toThrow('Modulo by zero');
  });

  test.each([
    [2, 3, 8],
    [5, 0, 1],
    [2, -2, 0.25],
    [-2, 3, -8],
  ])('raises %s to the power of %s', (base, exponent, expected) => {
    expect(power(base, exponent)).toBe(expected);
  });

  test('rejects exponentiation results that are not finite', () => {
    expect(() => power(10, 1000)).toThrow('finite number');
    expect(() => power(-2, 0.5)).toThrow('finite number');
  });

  test('preserves the exponentiate alias', () => {
    expect(exponentiate(2, 3)).toBe(8);
  });

  test.each([
    [9, 3],
    [2, Math.sqrt(2)],
    [0, 0],
  ])('calculates the square root of %s', (value, expected) => {
    expect(squareRoot(value)).toBe(expected);
  });

  test('rejects the square root of a negative number', () => {
    expect(() => squareRoot(-1)).toThrow('negative number');
    expect(() => squareRoot(Number.POSITIVE_INFINITY)).toThrow('finite number');
  });

  test('dispatches each supported operator', () => {
    expect(calculate(2, '+', 3)).toBe(5);
    expect(calculate(10, '-', 4)).toBe(6);
    expect(calculate(45, '*', 2)).toBe(90);
    expect(calculate(20, '/', 5)).toBe(4);
    expect(calculate(10, '%', 3)).toBe(1);
    expect(calculate(2, '**', 3)).toBe(8);
    expect(calculate(9, 'sqrt')).toBe(3);
  });

  test('rejects unsupported operators', () => {
    expect(() => calculate(2, '^', 3)).toThrow('Unsupported operator');
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

  test.each([
    [['5', '%', '2'], '1'],
    [['2', '**', '3'], '8'],
    [['sqrt', '16'], '4'],
  ])('supports the extended operation example %j', (args, expected) => {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
  });

  test('reports a negative square root as an error', () => {
    const result = spawnSync(process.execPath, [calculatorPath, 'sqrt', '-1'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('negative number');
  });
});
