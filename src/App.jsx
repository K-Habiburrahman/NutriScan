import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import SearchByName from './components/SearchByName.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import BarcodeSearch from './components/BarcodeSearch.jsx';
import Results from './components/Results.jsx';
import Footer from './components/Footer.jsx';
import useTheme from './hooks/useTheme.js';
import { emptyInputs, inputsToValues, valuesToInputs } from './lib/nutrients.js';
import { parseNutrition } from './lib/parseNutrition.js';
import { productToNutrients } from './lib/openFoodFacts.js';
import { calculateScore } from './lib/score.js';

const DEFAULT_SOURCE = 'Review the detected values, correct anything inaccurate, then calculate your score.';
const OCR_SOURCE = 'Values extracted from your uploaded label. Review them before scoring.';

export default function App() {
  const [theme, toggleTheme] = useTheme();

  const [showResults, setShowResults] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);
  const [inputs, setInputs] = useState(emptyInputs);
  const [rawText, setRawText] = useState('');
  const [resultSource, setResultSource] = useState(DEFAULT_SOURCE);
  // null = not calculated yet; otherwise the result of calculateScore()
  const [scoreResult, setScoreResult] = useState(null);
  // Changing this key remounts the image uploader and clears its local state.
  const [uploadKey, setUploadKey] = useState(0);

  const resultsRef = useRef(null);
  const [scrollTick, setScrollTick] = useState(0);

  // Scroll to the results after they render (new data loaded or re-extracted).
  useEffect(() => {
    if (scrollTick > 0) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [scrollTick]);

  const presentValues = useCallback((values) => {
    setInputs(valuesToInputs(values));
    setScoreResult(null);
    setShowResults(true);
    setScrollTick((t) => t + 1);
  }, []);

  // From a database product. Returns an error message, or null on success.
  const handleUseProduct = useCallback((product) => {
    const values = productToNutrients(product);
    if (!Object.values(values).some((v) => v !== null)) {
      return 'This database entry does not contain enough nutrition information. Try another search method or upload the label.';
    }
    setRawText(
      `Product: ${product.product_name || ''}\nBrand: ${product.brands || ''}\nSource: Open Food Facts\nBarcode: ${product.code || ''}\nNutri-Score: ${product.nutriscore_grade || product.nutrition_grades || 'not provided'}\nNutrient values are mapped from database values per 100 g/ml where available.`
    );
    setResultSource(
      `Selected: ${product.product_name || 'Product'}${product.brands ? ' · ' + product.brands : ''}. Source: Open Food Facts; data may be incomplete or user-submitted.`
    );
    presentValues(values);
    return null;
  }, [presentValues]);

  // From OCR text. Returns true when at least one value was detected.
  const handleOcrText = useCallback((text) => {
    const values = parseNutrition(text);
    setRawText(text);
    setResultSource(OCR_SOURCE);
    presentValues(values);
    return Object.values(values).some((v) => v !== null);
  }, [presentValues]);

  const handleReparse = useCallback(() => {
    presentValues(parseNutrition(rawText));
  }, [rawText, presentValues]);

  const handleInputChange = useCallback((key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    setScoreResult(calculateScore(inputsToValues(inputs)));
  }, [inputs]);

  const handleReset = useCallback(() => {
    setShowResults(false);
    setActiveMethod(null);
    setInputs(emptyInputs);
    setRawText('');
    setResultSource(DEFAULT_SOURCE);
    setScoreResult(null);
    setUploadKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        {!showResults && (
          <section className="entry-options" aria-label="Choose how to find a food product">
            {activeMethod === null ? (
              <>
                <button className="entry-choice" type="button" onClick={() => setActiveMethod('name')}>
                  <span className="entry-choice-step">01</span>
                  <span className="entry-choice-icon" aria-hidden="true">⌕</span>
                  <span className="entry-choice-copy">
                    <strong>Search by name</strong>
                    <span>Find a product by name or brand</span>
                  </span>
                  <span className="entry-choice-arrow" aria-hidden="true">→</span>
                </button>
                <button className="entry-choice" type="button" onClick={() => setActiveMethod('image')}>
                  <span className="entry-choice-step">02</span>
                  <span className="entry-choice-icon" aria-hidden="true">▧</span>
                  <span className="entry-choice-copy">
                    <strong>Scan a food label</strong>
                    <span>Upload a photo of the nutrition panel</span>
                  </span>
                  <span className="entry-choice-arrow" aria-hidden="true">→</span>
                </button>
                <button className="entry-choice" type="button" onClick={() => setActiveMethod('barcode')}>
                  <span className="entry-choice-step">03</span>
                  <span className="entry-choice-icon" aria-hidden="true">▥</span>
                  <span className="entry-choice-copy">
                    <strong>Enter a barcode</strong>
                    <span>Look up the number on the package</span>
                  </span>
                  <span className="entry-choice-arrow" aria-hidden="true">→</span>
                </button>
              </>
            ) : (
              <div className="entry-selected">
                <button className="secondary-btn method-back" type="button" onClick={() => setActiveMethod(null)}>
                  ← Choose another method
                </button>
                {activeMethod === 'name' && <SearchByName onUseProduct={handleUseProduct} />}
                {activeMethod === 'image' && (
                  <ImageUpload key={uploadKey} onExtracted={handleOcrText} />
                )}
                {activeMethod === 'barcode' && <BarcodeSearch onUseProduct={handleUseProduct} />}
              </div>
            )}
          </section>
        )}

        {showResults && (
          <Results
            ref={resultsRef}
            source={resultSource}
            inputs={inputs}
            onInputChange={handleInputChange}
            scoreResult={scoreResult}
            onCalculate={handleCalculate}
            rawText={rawText}
            onRawTextChange={setRawText}
            onReparse={handleReparse}
            onReset={handleReset}
          />
        )}
        <Footer />
      </main>
    </>
  );
}
