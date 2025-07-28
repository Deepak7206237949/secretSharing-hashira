const fs = require('fs');

function decodeValueFromBase(base, value) {
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  base = Number(base);
  value = value.toUpperCase();

  let result = 0n;
  let bigBase = BigInt(base);
  for (const ch of value) {
    const digit = digits.indexOf(ch);
    if (digit === -1 || digit >= base) {
      throw new Error(`Invalid digit '${ch}' for base ${base}`);
    }
    result = result * bigBase + BigInt(digit);
  }
  return result;
}

function calculateLagrangeInterpolation(points) {
  const n = points.length;
  let interpolatedValueAtZero = 0n;

  for (let i = 0; i < n; i++) {
    const currentX = BigInt(points[i].x);
    const currentY = points[i].y;

    let numerator = 1n;
    let denominator = 1n;

    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const otherX = BigInt(points[j].x);

      numerator *= -otherX;
      denominator *= (currentX - otherX);
    }

    if (denominator === 0n) throw new Error('Denominator zero in Lagrange interpolation');

    const currentTerm = (currentY * numerator) / denominator;
    interpolatedValueAtZero += currentTerm;
  }

  return interpolatedValueAtZero;
}

function extractPointsFromJSON(filePath) {
  const rawData = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(rawData);

  const k = Number(jsonData.keys.k);
  let pointsArray = [];

  for (const key in jsonData) {
    if (key === 'keys') continue;

    const xValue = Number(key);
    const baseValue = jsonData[key].base;
    const yValueStr = jsonData[key].value;

    const yValue = decodeValueFromBase(baseValue, yValueStr);
    pointsArray.push({ x: xValue, y: yValue });
  }

 
  pointsArray.sort((a, b) => a.x - b.x);

 
  return pointsArray.slice(0, k);
}


const testCase1Points = extractPointsFromJSON('test_case_1.json');
const testCase2Points = extractPointsFromJSON('test_case_2.json');

const secretValue1 = calculateLagrangeInterpolation(testCase1Points);
const secretValue2 = calculateLagrangeInterpolation(testCase2Points);

console.log(`Secret for Test Case 1: ${secretValue1.toString()}`);
console.log(`Secret for Test Case 2: ${secretValue2.toString()}`);
