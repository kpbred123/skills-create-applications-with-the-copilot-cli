// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).

const usage = 'Usage: node src/calculator.js <first-number> <operator> <second-number>';

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

  return first / second;
}

const operations = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

function calculate(first, operator, second) {
  const operation = operations[operator];

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

module.exports = { add, subtract, multiply, divide, calculate };
