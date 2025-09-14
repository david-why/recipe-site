export interface Recipe {
  id: number
  title: string
  tags: string[]
  active_time: number | null
  total_time: number | null
  difficulty: 'easy' | 'medium' | 'advanced'
  serving_size: number
  serving_unit: string | null
  images: string[]
  additional_info: string[]
  created_at: string
}

export interface Category {
  id: string
  name: string
}

export interface RecipeIngredientGroup {
  id: string
  title: string
  ingredients: RecipeIngredient[]
}

export interface RecipeIngredient {
  id: string
  name: string
  optional: boolean
  unit_name: string | null
  preparation: string
  quantity_start: number
  quantity_end: number
}

export interface RecipeNutritionGroup {
  id: string
  name: string
  quantity: number
  unit: string
  nutritions: RecipeNutrition[]
}

export interface RecipeNutrition {
  type: string
  unit: string
  number: number
}

export interface RecipeStepGroup {
  id: string
  title: string
  steps: RecipeStep[]
}

export interface RecipeStep {
  text: string
  title: string
}

export interface FullRecipe extends Recipe {
  ingredient_groups: RecipeIngredientGroup[]
  nutrition_groups: RecipeNutritionGroup[]
  step_groups: RecipeStepGroup[]
  categories: Category[]
  collections: Collection[]
}

export interface Collection {
  id: string
  title: string
  description: string
  image: string | null
}
