const tips = [
  { title: 'Capture the full panel', text: 'Include the complete nutrition table and serving size.' },
  { title: 'Keep text sharp', text: 'Avoid glare, shadows, blur, and steep angles.' },
  { title: 'Check the extracted values', text: 'OCR can misread small print. Review and edit values before scoring.' },
];

export default function GuidePanel() {
  return (
    <div className="panel guide-panel landing-guide">
      <div className="section-heading">
        <span className="guide-icon">◎</span>
        <div>
          <h2>For the best results</h2>
          <p>A few tips for a more accurate reading.</p>
        </div>
      </div>
      {tips.map((tip, i) => (
        <div className="tip" key={tip.title}>
          <span className="tip-number">{i + 1}</span>
          <div>
            <b>{tip.title}</b>
            <p>{tip.text}</p>
          </div>
        </div>
      ))}
      <div className="guide-callout">
        <span>ⓘ</span>
        <p>
          <b>Good to know</b>
          <br />
          Nutrition panels vary by country and brand. This tool gives an educational estimate, not medical advice.
        </p>
      </div>
    </div>
  );
}
