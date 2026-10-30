import { DEFAULT_INSIGHTS } from '../lib/score.js';

const icons = { good: '＋', warn: '!', info: 'ⓘ' };

export default function Insights({ items }) {
  const list = items ?? DEFAULT_INSIGHTS;
  return (
    <div id="insights" className="insights">
      {list.slice(0, 6).map((item) => (
        <div className={`insight insight-${item.type}`} key={item.title}>
          <span className="insight-icon">{icons[item.type] ?? icons.info}</span>
          <b>{item.title}</b>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
