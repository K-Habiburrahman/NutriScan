# NutriScan — Food Health Analyzer (HTML, CSS & JavaScript)

A browser-based tool for searching packaged food by product name or analyzing a photo of its printed nutrition label.

## Run it
1. Extract this folder.
2. Open `index.html` in a modern browser.
3. Search using the exact product name and optional brand, or upload a label image.
4. Confirm the correct matching product, review nutrient values, edit if needed, and calculate the score.

No Node.js, Python, npm, or project backend is required. An internet connection is needed for product search and the OCR library CDN.

## Features
- Product name and optional brand search using Open Food Facts.
- Result cards show available product image, brand, barcode, and Nutri-Score metadata.
- Maps available nutrient values per 100 g/ml into editable fields.
- Shows approximate per-100 g/ml comparison guides beside nutrient readings; these are educational screening cues, not personalized or official dietary targets.
- Displays a live bar chart using actual nutrient quantities and units, compared with each guide.
- Uses shared graph scales for nutrients with the same unit.
- Uses the Vanilla, Dark Green, Blood Red, and Bean palette to distinguish average, healthier, and concerning results.
- Includes a persistent light/dark theme toggle.
- Optional browser-side OCR for products not found in the database.
- Editable values and an educational score estimate.
- Responsive layout.

## Product data limitations
Product lookup uses the public Open Food Facts database, which is community-maintained. Coverage and data quality vary; information may be incomplete, outdated, or user-submitted. Search results are possible matches, not proof of an exact package match. Confirm the product name, brand, package size, and barcode when possible.

The app's calculated score is a simple educational heuristic, not a clinically validated or official regulatory rating. If an official Nutri-Score is available in the database, it is shown separately as source metadata. Do not use this app for diagnosis, allergy safety decisions, or medical advice.

Product search terms are sent to Open Food Facts. Uploaded images are processed in the browser and are not sent to a project-owned server. If direct API calls are restricted when opening the file locally, deploy the folder to a static host or serve it with a simple static web server; no application backend is required.

## Files
- `index.html` — page structure
- `style.css` — layout and styling
- `script.js` — product search, OCR, extraction, and scoring
- `assets/nutriscan-logo.png` and `assets/nutriscan-logo-dark.png` — light- and dark-theme NutriScan logos

## Third-party service
Open Food Facts is an independent third-party data service. Review its current API and database terms before commercial use.


## Troubleshooting

- **`Cannot access '$' before initialization`:** This was caused by the DOM helper being declared after product-search code. The fixed version declares the helper first.
- **Tracking Prevention warning for Tesseract.js CDN:** This is usually a browser privacy warning about third-party storage access, not the same as a JavaScript exception. The page still needs internet access to download Tesseract.js and its OCR language data. If OCR does not load, try a browser session that permits the CDN, or use the product-name search instead. Product-name search does not depend on Tesseract.js.
- If product search fails, check internet connectivity and whether the browser/network allows requests to `world.openfoodfacts.org`.

### Understanding why a product gets a low rating
After calculating a score, the **What we noticed** section explains which available values may be driving the result—for example, high sugar, saturated fat, sodium, or energy density. The footer explains how to interpret these approximate educational guides; they are not an official Nutri-Score or medical assessment. Check that nutrient fields use the same basis (per 100 g/ml versus per serving).
