import { comparableNutrients, comparisonScales, isNum, nutrientStatus } from '../lib/nutrients.js';

const unitOrder = { g: 0, mg: 1, kcal: 2 };
const chartNutrients = [...comparableNutrients].sort((a, b) => unitOrder[a.unit] - unitOrder[b.unit]);

function ChartRow({ nutrient: n, value }) {
  const known = isNum(value);
  const scale = comparisonScales[n.unit];
  const guidePosition = Math.min(n.guideValue / scale.max, 1) * 100;

  let rowClass = 'comparison-chart-row';
  let reading = 'Not available';
  if (known) {
    const status = nutrientStatus(n, value);
    const comparison = status === 'healthy' ? 'Meets guide' : n.guideDirection === 'max' ? 'Above guide' : 'Below guide';
    rowClass += ` status-${status}`;
    reading = `${value} ${n.unit} · ${comparison}`;
  } else {
    rowClass += ' unknown-reading status-average';
  }

  return (
    <div className={rowClass}>
      <div className="comparison-chart-heading">
        <b>{n.label}</b>
        <span>{reading}</span>
      </div>
      <div
        className="comparison-chart-track"
        aria-hidden="true"
        data-guide-direction={n.guideDirection}
        style={{ '--guide-position': `${guidePosition}%` }}
      >
        {known && <span className="comparison-chart-bar" style={{ width: `${Math.min(value / scale.max, 1) * 100}%` }} />}
        <span className="comparison-chart-marker" style={{ left: `${guidePosition}%` }} />
      </div>
      <div className="comparison-chart-scale" aria-hidden="true">
        <span className="scale-start">0 {n.unit}</span>
        <span className="scale-guide" style={{ left: `${guidePosition}%` }}>{n.guideValue} {n.unit}</span>
        <span className="scale-end">{scale.max} {n.unit}+</span>
      </div>
    </div>
  );
}

export default function ComparisonChart({ values }) {
  return (
    <div
      id="comparisonChart"
      className="comparison-chart"
      aria-label="Nutrient quantities compared with ideal guide levels"
    >
      {chartNutrients.map((n) => (
        <ChartRow key={n.key} nutrient={n} value={values[n.key]} />
      ))}
    </div>
  );
}
