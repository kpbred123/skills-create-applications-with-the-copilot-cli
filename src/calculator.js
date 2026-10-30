// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (**), and square root (sqrt).

const usage = [
  'Usage:',
  '  node src/calculator.js <first-number> <operator> <second-number>',
  '  node src/calculator.js sqrt <number>',
].join('\n');

function validateOperands(first, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new TypeError('Both operands must be valid finite numbers.');
  }
}

function add(first, second) {
  validateOperands(first, second);
  return first + second;
}

function subtract(first, second) {
  validateOperands(first, second);
  return first - second;
}

function multiply(first, second) {
  validateOperands(first, second);
  return first * second;
}

function divide(first, second) {
  validateOperands(first, second);

  if (second === 0) {
    throw new RangeError('Division by zero is not allowed.');
  }

  return finiteResult(first / second);
}

function modulo(first, second) {
  validateOperands(first, second);

  if (second === 0) {
    throw new RangeError('Modulo by zero is not allowed.');
  }

  return finiteResult(first % second);
}

function power(base, exponent) {
  validateOperands(base, exponent);
  return finiteResult(base ** exponent);
}

const exponentiate = power;

function squareRoot(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('The operand must be a valid finite number.');
  }

  if (value < 0) {
    throw new RangeError('Square root of a negative number is not allowed.');
  }

  return finiteResult(Math.sqrt(value));
}

function finiteResult(result) {
  if (!Number.isFinite(result)) {
    throw new RangeError('The result must be a finite number.');
  }

  return result;
}

const operations = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
  '%': modulo,
  '**': power,
  sqrt: squareRoot,
};

function calculate(first, operator, second) {
  const operation = Object.hasOwn(operations, operator) ? operations[operator] : undefined;

  if (!operation) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  return operation(first, second);
}

function fail(message) {
  console.error(message);
  console.error(usage);
  process.exitCode = 1;
}

function main(args) {
  if (args[0] === 'sqrt') {
    if (args.length !== 2 || args[1].trim() === '') {
      fail('Square root expects one valid finite number.');
      return;
    }

    try {
      console.log(calculate(Number(args[1]), 'sqrt'));
    } catch (error) {
      fail(error.message);
    }
    return;
  }

  if (args.length !== 3) {
    fail('Expected two numbers and one operator.');
    return;
  }

  const [firstInput, operator, secondInput] = args;

  if (firstInput.trim() === '' || secondInput.trim() === '') {
    fail('Both operands must be valid finite numbers.');
    return;
  }

  const first = Number(firstInput);
  const second = Number(secondInput);

  try {
    console.log(calculate(first, operator, second));
  } catch (error) {
    fail(error.message);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  exponentiate,
  squareRoot,
  calculate,
};
