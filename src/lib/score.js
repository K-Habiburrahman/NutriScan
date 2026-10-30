import { isNum } from './nutrients.js';

// Educational heuristic only. Thresholds are approximate screening cues per 100 g/ml,
// not official medical cut-offs. Unknown values are excluded, never treated as zero.

const highReasons = [
  { key: 'sugar', threshold: 15, title: 'High sugar', reason: (v) => `Contains ${v} g of sugar per 100 g/ml. That is a relatively high amount, so this nutrient lowers the estimate.` },
  { key: 'saturatedFat', threshold: 5, title: 'High saturated fat', reason: (v) => `Contains ${v} g of saturated fat per 100 g/ml. Higher saturated fat is a reason to compare alternatives.` },
  { key: 'sodium', threshold: 600, title: 'High sodium', reason: (v) => `Contains ${v} mg of sodium per 100 g/ml. This is relatively high and contributes to the lower rating.` },
  { key: 'calories', threshold: 500, title: 'High energy density', reason: (v) => `Provides ${v} kcal per 100 g/ml. This is energy-dense, so portion size matters when comparing products.` },
  { key: 'totalFat', threshold: 25, title: 'High total fat', reason: (v) => `Contains ${v} g of total fat per 100 g/ml. Check the saturated-fat value too, because fat type matters.` },
];

export const DEFAULT_INSIGHTS = [
  { type: 'info', title: 'Nutrition data', text: 'Your results will appear here after you calculate a score.' },
  { type: 'info', title: 'Ingredients', text: 'OCR text can be edited below. Allergens are not reliably identified by this score.' },
  { type: 'info', title: 'Compare products', text: 'Use the same basis (per 100 g/ml or per serving) when comparing similar foods.' },
];

/**
 * Returns { kind: 'nodata' } when no nutrient has a usable value, otherwise
 * { kind: 'scored', score, label, status, used, summary, insights }.
 */
export function calculateScore(values) {
  let score = 70;
  let used = 0;

  const penalty = (key, limit, weight) => {
    const v = values[key];
    if (!isNum(v)) return;
    used++;
    score -= Math.min(1, v / limit) * weight;
  };
  const bonus = (key, threshold, weight) => {
    const v = values[key];
    if (!isNum(v)) return;
    used++;
    score += Math.min(1, v / threshold) * weight;
  };

  penalty('sugar', 15, 22);
  penalty('saturatedFat', 5, 18);
  penalty('sodium', 600, 18);
  penalty('calories', 500, 7);
  penalty('totalFat', 25, 5);
  bonus('fiber', 6, 10);
  bonus('protein', 10, 10);

  if (!used) return { kind: 'nodata' };

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = score >= 80 ? 'Better choice' : score >= 65 ? 'Fair' : score >= 45 ? 'Occasional choice' : 'Limit often';
  const status = score >= 80 ? 'healthy' : score < 45 ? 'harmful' : 'average';
  const summary = `This estimate used ${used} available nutrient field(s). ${
    score < 45
      ? 'The rating is low because the combined nutrient values reduced the score.'
      : score < 65
        ? 'Some nutrient values lowered the score; see the reasons below.'
        : 'Compare similar products and check the full ingredient list.'
  }`;

  const impacts = [];
  highReasons.forEach((item) => {
    const v = values[item.key];
    if (isNum(v) && v >= item.threshold) impacts.push({ type: 'warn', title: item.title, text: item.reason(v) });
  });
  if (isNum(values.fiber)) {
    if (values.fiber < 3) {
      impacts.push({ type: 'info', title: 'Low dietary fiber', text: `Contains ${values.fiber} g of fiber per 100 g/ml. This is a low amount; fiber can be a useful positive feature when comparing similar foods.` });
    } else if (values.fiber >= 6) {
      impacts.push({ type: 'good', title: 'Good fiber contribution', text: `Contains ${values.fiber} g of fiber per 100 g/ml, which is a positive feature in this estimate.` });
    }
  }
  if (isNum(values.protein) && values.protein >= 10) {
    impacts.push({ type: 'good', title: 'Protein contribution', text: `Contains ${values.protein} g of protein per 100 g/ml, which contributes positively to this estimate.` });
  }
  if (impacts.length === 0) {
    impacts.push({
      type: 'info',
      title: score < 65 ? 'Why the rating may be low' : 'No standout warning detected',
      text: score < 65
        ? 'The combined scoring formula can lower the rating even when no single nutrient crosses the high-level guide above. Check the entered values and make sure they are per 100 g/ml, not per serving.'
        : 'None of the available values crossed the high-level guide used here. This does not automatically mean the food is healthy; check ingredients, serving size, and missing nutrients.',
    });
  }

  return { kind: 'scored', score, label, status, used, summary, insights: impacts };
}
