// Nutrient definitions, comparison scales and status helpers.

export const nutrients = [
  { key: 'sugar', label: 'Total sugars', unit: 'g', hint: 'Lower is generally preferable', guide: '≤ 15 g', guideValue: 15, guideDirection: 'max' },
  { key: 'saturatedFat', label: 'Saturated fat', unit: 'g', hint: 'Lower is generally preferable', guide: '≤ 5 g', guideValue: 5, guideDirection: 'max' },
  { key: 'sodium', label: 'Sodium', unit: 'mg', hint: 'Lower is generally preferable', guide: '≤ 600 mg', guideValue: 600, guideDirection: 'max' },
  { key: 'protein', label: 'Protein', unit: 'g', hint: 'Can contribute positively', guide: '≥ 10 g', guideValue: 10, guideDirection: 'min' },
  { key: 'fiber', label: 'Dietary fiber', unit: 'g', hint: 'Can contribute positively', guide: '≥ 6 g', guideValue: 6, guideDirection: 'min' },
  { key: 'calories', label: 'Energy', unit: 'kcal', hint: 'Compare similar products', guide: '≤ 500 kcal', guideValue: 500, guideDirection: 'max' },
  { key: 'totalFat', label: 'Total fat', unit: 'g', hint: 'Consider fat type too', guide: '≤ 25 g', guideValue: 25, guideDirection: 'max' },
  { key: 'serving', label: 'Serving size', unit: 'g/ml', hint: 'Use label serving size if known', guide: 'No fixed guide' },
];

// Nutrients shown in the table and chart (everything except serving size).
export const comparableNutrients = nutrients.filter((n) => n.key !== 'serving');

export const comparisonScales = {
  g: { max: 50 },
  mg: { max: 1200 },
  kcal: { max: 1000 },
};

export const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

export function nutrientStatus(n, value) {
  if (n.guideDirection === 'min') return value >= n.guideValue ? 'healthy' : 'average';
  if (value > n.guideValue) return 'harmful';
  return 'healthy';
}

export const emptyInputs = () => Object.fromEntries(nutrients.map((n) => [n.key, '']));

// Convert a values object ({key: number|null}) into editable input strings.
export const valuesToInputs = (values) =>
  Object.fromEntries(nutrients.map((n) => [n.key, values[n.key] ?? '']));

// Convert input strings back into numbers (or null when empty).
export function inputsToValues(inputs) {
  const out = {};
  nutrients.forEach((n) => {
    const v = inputs[n.key];
    out[n.key] = v === '' || v === undefined ? null : Number(v);
  });
  return out;
}
