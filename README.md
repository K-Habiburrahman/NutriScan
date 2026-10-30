# NutriScan — Food Health Analyzer (React)

A React (Vite) version of the original HTML/CSS/JS NutriScan app. Search packaged food by name or barcode using
Open Food Facts, or read a nutrition label photo with in-browser OCR (Tesseract.js), then review the values and get an
educational score estimate.

## Run it
```bash
npm install
npm run dev       # development server with hot reload
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```
Requires Node.js 18+. An internet connection is needed for product search and for Tesseract.js to download its
OCR language data the first time you analyze an image.

## Project structure
```
src/
  main.jsx                 entry point
  App.jsx                  top-level state (results, inputs, score) and wiring
  styles/style.css         original stylesheet, unchanged
  assets/                  light/dark logos
  hooks/useTheme.js        persistent light/dark theme
  lib/
    nutrients.js           nutrient definitions, chart scales, status helpers
    parseNutrition.js      OCR text -> nutrient values
    openFoodFacts.js       product search / barcode lookup / data mapping
    score.js               educational scoring heuristic and insights
  components/
    Header, Hero, Footer, GuidePanel
    SearchByName, ImageUpload, BarcodeSearch     the three entry cards
    Results, ScorePanel, NutrientPanel, ComparisonChart, ComparisonTable, Insights
```

## What changed from the vanilla version
- DOM manipulation (`getElementById`, `innerHTML`) replaced with React state and components; the markup and CSS class
  names are the same, so `style.css` is unchanged.
- Tesseract.js is installed from npm and loaded on demand when you analyze an image, instead of a CDN `<script>` tag.
- Scoring, parsing, and Open Food Facts logic are pure modules in `src/lib/`, separate from the UI.
- "Start over" remounts the image uploader, which clears the selected image and any upload errors.

## Product data limitations
Product lookup uses the public Open Food Facts database, which is community-maintained. Coverage and quality vary;
results are possible matches, not proof of an exact package match. The calculated score is a simple educational
heuristic, not a clinically validated or official rating. Do not use this app for diagnosis, allergy safety decisions,
or medical advice. Product search terms are sent to Open Food Facts; uploaded images are processed in the browser and
are not sent to a project-owned server.

## Third-party service
Open Food Facts is an independent third-party data service. Review its current API and database terms before
commercial use.
