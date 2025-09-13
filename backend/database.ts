import { sql } from 'bun'
import { Category, Recipe } from '~/shared/types'

// db functions

export async function getRecipes() {
  const recipes = await sql<Recipe[]>`
SELECT
    r.id,
    r.title,
    r.tags,
    r.active_time,
    r.total_time,
    r.difficulty,
    r.serving_size,
    r.serving_unit,
    r.images,
    r.additional_info,
    r.created_at,

    jsonb_agg(DISTINCT jsonb_build_object(
        'id', rng.id,
        'name', rng.name,
        'quantity', rng.quantity,
        'unit', rng.unit,
        'nutritions', (
            SELECT jsonb_agg(jsonb_build_object(
                'type', rn.type,
                'number', rn.number,
                'unit', rn.unit
            ))
            FROM recipe_nutritions AS rn
            WHERE rn.group_id = rng.id
        )
    )) AS nutrition_groups,

    jsonb_agg(DISTINCT jsonb_build_object(
        'id', rsg.id,
        'title', rsg.title,
        'steps', (
            SELECT jsonb_agg(jsonb_build_object(
                'title', rs.title,
                'text', rs.text
            ))
            FROM recipe_steps AS rs
            WHERE rs.group_id = rsg.id
        )
    )) AS step_groups,

    jsonb_agg(DISTINCT jsonb_build_object(
        'id', u.id,
        'name', u.name
    )) AS utensils,

    jsonb_agg(DISTINCT jsonb_build_object(
        'id', rig.id,
        'title', rig.title,
        'ingredients', (
            SELECT jsonb_agg(jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'optional', ri.optional,
                'quantity_start', ri.quantity_start,
                'quantity_end', ri.quantity_end,
                'unit_name', u2.name,
                'preparation', ri.preparation
            ))
            FROM recipe_ingredients AS ri
            JOIN ingredients AS i ON ri.ingredient_id = i.id
            JOIN units AS u2 ON ri.unit_id = u2.id
            WHERE ri.group_id = rig.id
        )
    )) AS ingredient_groups,

    jsonb_agg(DISTINCT jsonb_build_object(
        'id', c.id,
        'name', c.name
    )) AS categories

FROM recipes AS r

LEFT JOIN recipe_nutrition_groups AS rng ON r.id = rng.recipe_id
LEFT JOIN recipe_nutritions AS rn ON rng.id = rn.group_id
LEFT JOIN recipe_step_groups AS rsg ON r.id = rsg.recipe_id
LEFT JOIN recipe_steps AS rs ON rsg.id = rs.group_id
LEFT JOIN recipe_utensils AS ru ON r.id = ru.recipe_id
LEFT JOIN utensils AS u ON ru.utensil_id = u.id
LEFT JOIN recipe_ingredient_groups AS rig ON r.id = rig.recipe_id
LEFT JOIN recipe_ingredients AS ri ON rig.id = ri.group_id
LEFT JOIN ingredients AS i ON ri.ingredient_id = i.id
LEFT JOIN units AS u2 ON ri.unit_id = u2.id
LEFT JOIN recipe_categories AS rc ON r.id = rc.recipe_id
LEFT JOIN categories AS c ON rc.category_id = c.id

GROUP BY r.id`
  return recipes
}

export async function getCategories() {
  const categories = await sql<Category[]>`SELECT id, name FROM categories ORDER BY id`
  return categories
}

export async function getCategoryById(categoryId: string) {
  const category = await sql<Category[]>`SELECT id, name FROM categories WHERE id = ${categoryId}`
  return category[0]
}

interface GetCategoryRecipesOptions {
  categoryId: string
}

export async function getCategoryRecipes({ categoryId }: GetCategoryRecipesOptions) {
  const recipes = await sql<Recipe[]>`
SELECT
    r.id,
    r.title,
    r.tags,
    r.active_time,
    r.total_time,
    r.difficulty,
    r.serving_size,
    r.serving_unit,
    r.images,
    r.additional_info,
    r.created_at
FROM recipes AS r
JOIN recipe_categories AS rc ON r.id = rc.recipe_id
JOIN categories AS c ON rc.category_id = c.id
WHERE c.id = ${categoryId}`
  return recipes
}
