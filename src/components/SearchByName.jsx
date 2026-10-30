import { useState } from 'react';
import { gradeLabel, gradeStatus, safeText, searchProducts } from '../lib/openFoodFacts.js';

function ProductMatch({ product, onUse }) {
  const grade = product.nutriscore_grade || product.nutrition_grades;
  return (
    <article className="product-match">
      {product.image_front_url && (
        <img
          src={product.image_front_url}
          alt=""
          loading="lazy"
          onError={(e) => e.currentTarget.remove()}
        />
      )}
      <div className="product-match-details">
        <h3>{safeText(product.product_name, 'Unnamed product')}</h3>
        <p>{safeText(product.brands, 'Brand not listed')}</p>
        <p className={`product-meta status-${gradeStatus(grade)}`}>
          Nutri-Score: {gradeLabel(grade)} · Barcode: {safeText(product.code, 'Not listed')}
        </p>
        <button type="button" className="secondary-btn" onClick={() => onUse(product)}>
          Use this product
        </button>
      </div>
    </article>
  );
}

/**
 * onUseProduct(product) should return an error message string when the product
 * can't be used, or null/undefined on success.
 */
export default function SearchByName({ onUseProduct }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [matches, setMatches] = useState(null); // null = hidden
  const [inProgress, setInProgress] = useState(false);

  const canSearch = !inProgress && name.trim().length >= 2;

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setStatus({ message: 'Enter the product name as printed on the packet.', isError: true });
      return;
    }
    setInProgress(true);
    setMatches(null);
    setStatus({ message: 'Searching product database…', isError: false });
    try {
      const products = await searchProducts(trimmed, brand);
      setMatches(products);
      setStatus({
        message: products.length
          ? `Found ${products.length} possible match(es). Confirm the product name and brand before selecting.`
          : 'No usable matches found. Try a shorter product name, search by barcode, or use a food image.',
        isError: false,
      });
    } catch (error) {
      setStatus({
        message: `Could not search the product database. Check your internet connection and try again. (${error.message})`,
        isError: true,
      });
    } finally {
      setInProgress(false);
    }
  }

  function handleUse(product) {
    const problem = onUseProduct(product);
    if (problem) setStatus({ message: problem, isError: true });
  }

  return (
    <article className="panel entry-card">
      <div className="section-heading">
        <span className="step">01</span>
        <div>
          <h2>Search by name or brand</h2>
          <p>Find a product in the food database.</p>
        </div>
      </div>
      <form id="productSearchForm" className="product-search-form" onSubmit={handleSubmit}>
        <label className="search-field">
          <span>Product name *</span>
          <input
            id="productName"
            type="text"
            required
            minLength={2}
            placeholder="e.g. tomato soup"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="search-field">
          <span>Brand <span className="optional-label">(optional)</span></span>
          <input
            id="productBrand"
            type="text"
            placeholder="e.g. Acme Foods"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </label>
        <button id="productSearchBtn" className="primary-btn" type="submit" disabled={!canSearch}>
          Search products <span>→</span>
        </button>
      </form>
      <p className="entry-note">Searches the Open Food Facts database. Internet connection required.</p>
      {status.message && (
        <p className={`search-status${status.isError ? ' error-text' : ''}`} role="status">
          {status.message}
        </p>
      )}
      {matches && (
        <div id="productMatches" className="product-matches">
          {matches.length === 0
            ? 'No matching products found. Check spelling, try adding/removing the brand, or search by barcode or food image.'
            : matches.map((product, i) => (
                <ProductMatch key={`${product.code ?? 'p'}-${i}`} product={product} onUse={handleUse} />
              ))}
        </div>
      )}
    </article>
  );
}
