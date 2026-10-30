export default function ScorePanel({ result }) {
  let status = 'average';
  let value = '—';
  let label = 'Review label values';
  let summary = 'Check the extracted values and calculate your estimate.';
  let progressDeg = 0;

  if (result?.kind === 'nodata') {
    label = 'More data needed';
    summary = 'Enter at least one nutrient value to get a rough estimate.';
  } else if (result?.kind === 'scored') {
    status = result.status;
    value = result.score;
    label = result.label;
    summary = result.summary;
    progressDeg = result.score * 3.6;
  }

  return (
    <div className={`panel score-panel score-${status}`} id="scorePanel">
      <div className="score-caption">ESTIMATED NUTRITION SCORE</div>
      <div className="score-ring" id="scoreRing" style={{ '--score-progress': `${progressDeg}deg` }}>
        <div>
          <strong id="scoreValue">{value}</strong>
          <span>out of 100</span>
        </div>
      </div>
      <div id="ratingLabel" className="rating-label">{label}</div>
      <p id="scoreSummary" className="score-summary">{summary}</p>
      <div className="score-footnote">
        A heuristic estimate based on detected nutrients. Not a validated medical or regulatory grade.
      </div>
    </div>
  );
}
