// Open Food Facts lookups (public API, no project backend required).

const OFF_API = 'https://world.openfoodfacts.org/cgi/search.pl';
const OFF_PRODUCT_API = 'https://world.openfoodfacts.org/api/v2/product';
const FIELDS = 'product_name,brands,nutriments,nutriscore_grade,nutrition_grades,code,image_front_url,quantity,categories';

export const safeText = (value, fallback = 'Not provided') =>
  value === undefined || value === null || value === '' ? fallback : String(value);

export function gradeLabel(grade) {
  const map = { a: 'A · Excellent', b: 'B · Good', c: 'C · Moderate', d: 'D · Poor', e: 'E · Poor' };
  return map[String(grade || '').toLowerCase()] || 'Not available';
}

export function gradeStatus(grade) {
  const value = String(grade || '').toLowerCase();
  return value === 'a' || value === 'b' ? 'healthy' : value === 'd' || value === 'e' ? 'harmful' : 'average';
}

// Maps an Open Food Facts product to this app's nutrient values (per 100 g/ml).
export function productToNutrients(p) {
  const n = p.nutriments || {};
  const get = (...keys) => {
    for (const key of keys) {
      const v = n[key];
      if (v !== undefined && v !== null && v !== '' && Number.isFinite(Number(v))) return Number(v);
    }
    return null;
  };
  const sodiumG = get('sodium_100g');
  const saltG = get('salt_100g');
  const energyKcal = get('energy-kcal_100g');
  const energyKj = get('energy_100g');
  return {
    sugar: get('sugars_100g'),
    saturatedFat: get('saturated-fat_100g'),
    sodium: sodiumG !== null ? sodiumG * 1000 : saltG !== null ? (saltG * 1000) / 2.5 : null,
    protein: get('proteins_100g'),
    fiber: get('fiber_100g'),
    calories: energyKcal !== null ? energyKcal : energyKj !== null ? energyKj / 4.184 : null,
    totalFat: get('fat_100g'),
    serving: null,
  };
}

export async function searchProducts(name, brand) {
  const terms = [name.trim(), brand.trim()].filter(Boolean).join(' ');
  const params = new URLSearchParams({
    search_terms: terms,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '12',
    fields: FIELDS,
  });
  const response = await fetch(`${OFF_API}?${params.toString()}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Product database returned HTTP ${response.status}.`);
  const data = await response.json();
  return (data.products || []).filter((p) => p.product_name && p.nutriments);
}

export async function fetchProductByBarcode(barcode) {
  const response = await fetch(`${OFF_PRODUCT_API}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Product database returned HTTP ${response.status}.`);
  const data = await response.json();
  if (data.status !== 1 || !data.product) {
    throw new Error('No matching product was found. Check the barcode and try again.');
  }
  return data.product;
}
