import { sql } from 'bun'
import { getSqlLimitOffset, Pagination } from './pagination'

// db types

export interface DBRecipe {
  id: number
  title: string
  description: string | null
  ingredients: string | null
  instructions: string | null
  created_at: string
  updated_at: string
}

// db functions

interface GetRecipesOptions {
  pagination?: Pagination
}

const SELECT_RECIPES = sql`
SELECT
    -- Select all columns from the recipes table
    r.id AS recipe_id,
    r.title,
    r.tags,
    r.activeTime,
    r.totalTime,
    r.difficulty,
    r.servingSize,
    r.servingUnit,
    r.images,
    r.additionalInfo,
    r.createdAt,

    -- Join and aggregate data from related tables
    -- Nutrition information
    jsonb_agg(DISTINCT jsonb_build_object(
        'group_id', rng.id,
        'group_name', rng.name,
        'group_quantity', rng.quantity,
        'group_unit', rng.unit,
        'nutritions', (
            SELECT jsonb_agg(jsonb_build_object(
                'type', rn.type,
                'number', rn.number,
                'unit', rn.unit
            ))
            FROM recipe_nutritions AS rn
            WHERE rn.groupId = rng.id
        )
    )) AS nutrition_groups,

    -- Step information
    jsonb_agg(DISTINCT jsonb_build_object(
        'group_id', rsg.id,
        'group_title', rsg.title,
        'steps', (
            SELECT jsonb_agg(jsonb_build_object(
                'step_title', rs.title,
                'step_text', rs.text
            ))
            FROM recipe_steps AS rs
            WHERE rs.groupId = rsg.id
        )
    )) AS step_groups,

    -- Utensils
    jsonb_agg(DISTINCT jsonb_build_object(
        'utensil_id', u.id,
        'utensil_name', u.name
    )) AS utensils,

    -- Ingredients
    jsonb_agg(DISTINCT jsonb_build_object(
        'group_id', rig.id,
        'group_title', rig.title,
        'ingredients', (
            SELECT jsonb_agg(jsonb_build_object(
                'ingredient_id', i.id,
                'ingredient_name', i.name,
                'optional', ri.optional,
                'quantity_start', ri.quantity_start,
                'quantity_end', ri.quantity_end,
                'unit_name', u2.name,
                'preparation', ri.preparation
            ))
            FROM recipe_ingredients AS ri
            JOIN ingredients AS i ON ri.ingredientId = i.id
            JOIN units AS u2 ON ri.unitId = u2.id
            WHERE ri.groupId = rig.id
        )
    )) AS ingredient_groups,

    -- Categories
    jsonb_agg(DISTINCT jsonb_build_object(
        'category_id', c.id,
        'category_name', c.name
    )) AS categories

FROM recipes AS r

LEFT JOIN recipe_nutrition_groups AS rng ON r.id = rng.recipeId
LEFT JOIN recipe_nutritions AS rn ON rng.id = rn.groupId
LEFT JOIN recipe_step_groups AS rsg ON r.id = rsg.recipeId
LEFT JOIN recipe_steps AS rs ON rsg.id = rs.groupId
LEFT JOIN recipe_utensils AS ru ON r.id = ru.recipeId
LEFT JOIN utensils AS u ON ru.utensilId = u.id
LEFT JOIN recipe_ingredient_groups AS rig ON r.id = rig.recipeId
LEFT JOIN recipe_ingredients AS ri ON rig.id = ri.groupId
LEFT JOIN ingredients AS i ON ri.ingredientId = i.id
LEFT JOIN units AS u2 ON ri.unitId = u2.id
LEFT JOIN recipe_categories AS rc ON r.id = rc.recipeId
LEFT JOIN categories AS c ON rc.categoryId = c.id

GROUP BY r.id`

export async function getRecipes({ pagination }: GetRecipesOptions = {}) {
  const recipes = await sql`${SELECT_RECIPES} ${getSqlLimitOffset(pagination)}`
  return recipes
}
