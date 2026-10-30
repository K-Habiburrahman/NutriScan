// Extracts nutrient values from OCR text.

export function parseNutrition(raw) {
  const t = raw.toLowerCase().replace(/\u00a0/g, ' ').replace(/,/g, '.');
  const value = (names, unit = 'g') => {
    for (const name of names) {
      const re = new RegExp('(?:' + name + ')[^\\n\\d]{0,28}([0-9]+(?:\\.[0-9]+)?)\\s*(kcal|kj|mg|mcg|µg|g)?', 'i');
      const m = t.match(re);
      if (m) {
        let n = Number(m[1]);
        const u = (m[2] || unit).toLowerCase();
        if (u === 'mg' && unit === 'g') n /= 1000;
        if (u === 'g' && unit === 'mg') n *= 1000;
        if (u === 'kj') n /= 4.184;
        return n;
      }
    }
    return null;
  };
  return {
    sugar: value(['total sugars', 'sugars', 'sugar']),
    saturatedFat: value(['saturated fat', 'saturates']),
    sodium: value(['sodium'], 'mg'),
    protein: value(['protein']),
    fiber: value(['dietary fibre', 'dietary fiber', 'fibre', 'fiber']),
    calories: value(['energy', 'calories'], 'kcal'),
    totalFat: value(['total fat', 'fat']),
    serving: value(['serving size', 'serve size'], 'g'),
  };
}
