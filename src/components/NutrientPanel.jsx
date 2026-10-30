import { nutrients } from '../lib/nutrients.js';

export default function NutrientPanel({ inputs, onChange, onCalculate }) {
  return (
    <div className="panel nutrient-panel">
      <div className="section-heading compact">
        <div>
          <h2>Nutrition comparison</h2>
          <p>
            Compare the product reading with the general guide shown on each nutrient. These educational guides assume
            values per 100 g/ml; serving-size values are not directly comparable.
          </p>
        </div>
      </div>
      <div className="nutrient-grid" id="nutrientGrid">
        {nutrients.map((n) => (
          <div className="nutrient-item" key={n.key}>
            <label htmlFor={`nutrient-${n.key}`}>{n.label}</label>
            <div className="nutrient-input">
              <input
                id={`nutrient-${n.key}`}
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="Unknown"
                aria-label={n.label}
                data-key={n.key}
                value={inputs[n.key]}
                onChange={(e) => onChange(n.key, e.target.value)}
              />
              <span>{n.unit}</span>
            </div>
            <small className="nutrient-guide">
              General guide: {n.guide}{n.key === 'serving' ? '' : ' per 100 g/ml'}
            </small>
            <small className="nutrient-hint">{n.hint}</small>
          </div>
        ))}
      </div>
      <div className="score-actions">
        <button id="scoreBtn" className="primary-btn" onClick={onCalculate}>
          Calculate score <span>→</span>
        </button>
      </div>
    </div>
  );
}
