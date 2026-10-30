import { useEffect, useRef, useState } from 'react';

const MAX_BYTES = 10 * 1024 * 1024;

// Tesseract.js is loaded on demand so it doesn't weigh down the initial page load.
async function loadTesseract() {
  try {
    const mod = await import('tesseract.js');
    return mod.default?.recognize ? mod.default : mod;
  } catch {
    throw new Error('OCR library did not load. Check your internet connection and reload the page.');
  }
}

/**
 * onExtracted(text) is called with the recognized text and should return true
 * when at least one nutrition value could be parsed from it.
 */
export default function ImageUpload({ onExtracted }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null); // { pct, text } or null when hidden
  const inputRef = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  function pickFile(next) {
    setError('');
    if (!next) return;
    if (!/^image\/(png|jpeg|webp)$/.test(next.type)) {
      setError('Choose a PNG, JPG, or WEBP image.');
      return;
    }
    if (next.size > MAX_BYTES) {
      setError('Image is larger than 10 MB. Please choose a smaller image.');
      return;
    }
    setFile(next);
  }

  function removeImage(event) {
    event.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
    setProgress(null);
    setError('');
  }

  const openPicker = () => inputRef.current?.click();

  function showProgress(pct, text) {
    clearTimeout(hideTimer.current);
    setProgress({ pct, text });
  }

  async function analyze() {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const Tesseract = await loadTesseract();
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') showProgress(m.progress * 100, 'Reading printed label…');
          else if (m.status === 'loading language traineddata') showProgress(10 + m.progress * 20, 'Loading text recognition…');
        },
      });
      const foundValues = onExtracted(result.data.text || '');
      if (!foundValues) {
        setError('The image was processed, but no common nutrition values were detected. Try a sharper, closer photo or edit the recognized text below.');
      }
    } catch (err) {
      setError(err.message || 'Could not read this image. Try another photo.');
    } finally {
      setBusy(false);
      showProgress(100, 'Analysis complete');
      hideTimer.current = setTimeout(() => setProgress(null), 800);
    }
  }

  return (
    <article className="panel entry-card">
      <div className="section-heading">
        <span className="step">02</span>
        <div>
          <h2>Search by food image</h2>
          <p>Read the nutrition panel from a photo.</p>
        </div>
      </div>
      <input
        id="fileInput"
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => pickFile(e.target.files[0])}
      />
      <div
        id="dropzone"
        className={`dropzone${dragging ? ' dragging' : ''}`}
        tabIndex={0}
        role="button"
        aria-label="Choose or drop a food label image"
        onClick={() => { if (!file) openPicker(); }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !file) {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files[0]);
        }}
      >
        {!file && (
          <div id="uploadContent">
            <div className="upload-symbol">↑</div>
            <h3>Drop a label photo here</h3>
            <p>
              or{' '}
              <button
                id="browseBtn"
                className="text-button"
                type="button"
                onClick={(e) => { e.stopPropagation(); openPicker(); }}
              >
                browse files
              </button>
            </p>
            <span className="file-hint">PNG, JPG or WEBP · Up to 10 MB</span>
          </div>
        )}
        {file && previewUrl && <img id="preview" src={previewUrl} alt="Selected food label preview" />}
        {file && (
          <button id="removeImage" className="remove-image" type="button" aria-label="Remove image" onClick={removeImage}>
            ×
          </button>
        )}
      </div>
      <p className="entry-note">Your image is processed in this browser and isn’t uploaded.</p>
      <button id="analyzeBtn" className="primary-btn" disabled={!file || busy} onClick={analyze}>
        <span>✦</span> Analyze label <span>→</span>
      </button>
      {progress && (
        <div id="progressWrap" className="progress-wrap">
          <div className="progress-top">
            <span id="progressText">{progress.text}</span>
            <span id="progressPct">{Math.round(progress.pct)}%</span>
          </div>
          <div className="progress-track">
            <div id="progressBar" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      )}
      {error && <p id="error" className="error" role="alert">{error}</p>}
    </article>
  );
}
