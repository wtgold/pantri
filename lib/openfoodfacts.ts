export interface FoodProduct {
  barcode: string
  name: string
  brand: string
  categories: string[]
  imageUrl: string
  nutriments: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
    salt: number
  }
  ingredients: string
  allergens: string[]
  quantity: string
}

export async function lookupBarcode(barcode: string): Promise<FoodProduct | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`)
    const data = await res.json()
    if (data.status !== 1) return null
    const p = data.product
    return {
      barcode,
      name: p.product_name || p.product_name_en || "Unknown",
      brand: p.brands || "",
      categories: p.categories_tags?.map((c: string) => c.replace("en:", "")) || [],
      imageUrl: p.image_front_url || p.image_url || "",
      nutriments: {
        calories: p.nutriments?.["energy-kcal_100g"] || 0,
        protein: p.nutriments?.proteins_100g || 0,
        carbs: p.nutriments?.carbohydrates_100g || 0,
        fat: p.nutriments?.fat_100g || 0,
        fiber: p.nutriments?.fiber_100g || 0,
        sugar: p.nutriments?.sugars_100g || 0,
        salt: p.nutriments?.salt_100g || 0,
      },
      ingredients: p.ingredients_text_en || p.ingredients_text || "",
      allergens: p.allergens_tags?.map((a: string) => a.replace("en:", "")) || [],
      quantity: p.quantity || "",
    }
  } catch {
    return null
  }
}
