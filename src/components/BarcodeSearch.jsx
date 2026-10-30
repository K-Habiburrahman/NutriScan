import { useState } from 'react';
import { fetchProductByBarcode } from '../lib/openFoodFacts.js';

const BARCODE_PATTERN = /^\d{8,14}$/;

export default function BarcodeSearch({ onUseProduct }) {
  const [barcode, setBarcode] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [inProgress, setInProgress] = useState(false);

  const canSearch = !inProgress && BARCODE_PATTERN.test(barcode);

  async function handleSubmit(event) {
    event.preventDefault();
    const code = barcode.trim();
    if (!BARCODE_PATTERN.test(code)) {
      setStatus({ message: 'Enter a barcode containing 8 to 14 digits.', isError: true });
      return;
    }
    setInProgress(true);
    setStatus({ message: 'Searching product database…', isError: false });
    try {
      const product = await fetchProductByBarcode(code);
      setStatus({ message: 'Product found. Loading nutrition details…', isError: false });
      const problem = onUseProduct(product);
      if (problem) setStatus({ message: problem, isError: true });
    } catch (error) {
      setStatus({ message: `Could not find this barcode. ${error.message}`, isError: true });
    } finally {
      setInProgress(false);
    }
  }

  return (
    <article className="panel entry-card">
      <div className="section-heading">
        <span className="step">03</span>
        <div>
          <h2>Enter barcode manually</h2>
          <p>Look up the number printed beneath the barcode.</p>
        </div>
      </div>
      <form id="barcodeSearchForm" className="barcode-search-form" onSubmit={handleSubmit}>
        <label className="search-field" htmlFor="barcodeNumber">
          <span>Barcode number</span>
          <input
            id="barcodeNumber"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]{8,14}"
            minLength={8}
            maxLength={14}
            placeholder="e.g. 0123456789012"
            required
            aria-describedby="barcodeHint"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </label>
        <p id="barcodeHint" className="field-hint">Enter 8–14 digits. Usually found below the barcode.</p>
        <button id="barcodeSearchBtn" className="primary-btn" type="submit" disabled={!canSearch}>
          Find product <span>→</span>
        </button>
      </form>
      {status.message && (
        <p className={`search-status${status.isError ? ' error-text' : ''}`} role="status">
          {status.message}
        </p>
      )}
      <p className="entry-note barcode-note">Product coverage depends on the public food database.</p>
    </article>
  );
}
