import { comparableNutrients, isNum, nutrientStatus } from '../lib/nutrients.js';

export default function ComparisonTable({ values }) {
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th scope="col">Item name</th>
            <th scope="col">Quantity in product</th>
            <th scope="col">Ideal quantity</th>
          </tr>
        </thead>
        <tbody id="comparisonTableBody">
          {comparableNutrients.map((n) => {
            const value = values[n.key];
            const known = isNum(value);
            return (
              <tr key={n.key} className={`status-${known ? nutrientStatus(n, value) : 'average'}`}>
                <th scope="row">{n.label}</th>
                <td>{known ? `${value} ${n.unit}` : 'Not available'}</td>
                <td>{n.guide} / 100 g/ml</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
