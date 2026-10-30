import { forwardRef, useMemo } from 'react';
import { inputsToValues } from '../lib/nutrients.js';
import ScorePanel from './ScorePanel.jsx';
import NutrientPanel from './NutrientPanel.jsx';
import ComparisonChart from './ComparisonChart.jsx';
import ComparisonTable from './ComparisonTable.jsx';
import Insights from './Insights.jsx';

const Results = forwardRef(function Results(
  { source, inputs, onInputChange, scoreResult, onCalculate, rawText, onRawTextChange, onReparse, onReset },
  ref
) {
  const values = useMemo(() => inputsToValues(inputs), [inputs]);
  const insights = scoreResult?.kind === 'scored' ? scoreResult.insights : null;

  return (
    <section id="results" className="results" ref={ref}>
      <div className="results-header">
        <div>
          <div className="eyebrow">04 · YOUR RESULTS</div>
          <h2>Nutrition overview</h2>
          <p id="resultSource">{source}</p>
        </div>
        <button id="resetBtn" className="secondary-btn" onClick={onReset}>Start over ↗</button>
      </div>

      <div className="results-grid">
        <ScorePanel result={scoreResult} />
        <NutrientPanel inputs={inputs} onChange={onInputChange} onCalculate={onCalculate} />
      </div>

      <div className="panel details-panel">
        <div className="section-heading compact">
          <div>
            <h2>What we noticed</h2>
            <p>
              Ideal quantities are approximate educational guides per 100 g/ml, not personalized dietary
              recommendations. Check that the product reading uses the same basis; OCR may detect values per serving.
            </p>
          </div>
        </div>
        <div className="comparison-chart-panel">
          <div className="comparison-chart-title">
            <h3>Visual comparison</h3>
            <p>
              Axis quantities are shared across nutrients with the same unit. Each marker indicates that nutrient’s
              guide quantity; bars show product amounts.
            </p>
          </div>
          <ComparisonChart values={values} />
        </div>
        <ComparisonTable values={values} />
        <Insights items={insights} />
      </div>

      <details className="panel raw-panel">
        <summary>View / edit recognized label text</summary>
        <textarea
          id="rawText"
          rows={7}
          spellCheck={false}
          placeholder="OCR text will appear here…"
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
        />
        <p className="muted">If a value was missed, you can edit this text and run extraction again.</p>
        <button id="reparseBtn" className="secondary-btn" onClick={onReparse}>Extract values again</button>
      </details>
    </section>
  );
});

export default Results;
