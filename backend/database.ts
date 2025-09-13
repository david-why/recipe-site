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
    COALESCE(rng.nutrition_groups, '[]'::jsonb) AS nutrition_groups,
    COALESCE(rsg.step_groups, '[]'::jsonb) AS step_groups,
    COALESCE(ru.utensils, '[]'::jsonb) AS utensils,
    COALESCE(rig.ingredient_groups, '[]'::jsonb) AS ingredient_groups,
    COALESCE(rc.categories, '[]'::jsonb) AS categories
FROM recipes AS r
LEFT JOIN (
    SELECT
        ru.recipe_id,
        jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name)) AS utensils
    FROM recipe_utensils AS ru
    JOIN utensils AS u ON ru.utensil_id = u.id
    GROUP BY ru.recipe_id
) AS ru ON r.id = ru.recipe_id
LEFT JOIN (
    SELECT
        rc.recipe_id,
        jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name)) AS categories
    FROM recipe_categories AS rc
    JOIN categories AS c ON rc.category_id = c.id
    GROUP BY rc.recipe_id
) AS rc ON r.id = rc.recipe_id
LEFT JOIN (
    SELECT
        rig.recipe_id,
        jsonb_agg(jsonb_build_object(
            'id', rig.id,
            'title', rig.title,
            'ingredients',
            (SELECT jsonb_agg(jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'optional', ri.optional,
                'quantity_start', ri.quantity_start,
                'quantity_end', ri.quantity_end,
                'unit_name', u2.name,
                'preparation', ri.preparation
            )) FROM recipe_ingredients AS ri
            JOIN ingredients AS i ON ri.ingredient_id = i.id
            JOIN units AS u2 ON ri.unit_id = u2.id
            WHERE ri.group_id = rig.id)
        )) AS ingredient_groups
    FROM recipe_ingredient_groups AS rig
    GROUP BY rig.recipe_id
) AS rig ON r.id = rig.recipe_id
LEFT JOIN (
    SELECT
        rng.recipe_id,
        jsonb_agg(jsonb_build_object(
            'id', rng.id,
            'name', rng.name,
            'quantity', rng.quantity,
            'unit', rng.unit,
            'nutritions',
            (SELECT jsonb_agg(jsonb_build_object(
                'type', rn.type,
                'number', rn.number,
                'unit', rn.unit
            )) FROM recipe_nutritions AS rn WHERE rn.group_id = rng.id)
        )) AS nutrition_groups
    FROM recipe_nutrition_groups AS rng
    GROUP BY rng.recipe_id
) AS rng ON r.id = rng.recipe_id
LEFT JOIN (
    SELECT
        rsg.recipe_id,
        jsonb_agg(jsonb_build_object(
            'id', rsg.id,
            'title', rsg.title,
            'steps',
            (SELECT jsonb_agg(jsonb_build_object(
                'title', rs.title,
                'text', rs.text
            )) FROM recipe_steps AS rs WHERE rs.group_id = rsg.id)
        )) AS step_groups
    FROM recipe_step_groups AS rsg
    GROUP BY rsg.recipe_id
) AS rsg ON r.id = rsg.recipe_id`
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

interface GetRecipeByIdOptions {
  recipeId: string
}

export async function getRecipeById({ recipeId }: GetRecipeByIdOptions) {
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
    COALESCE(rng.nutrition_groups, '[]'::jsonb) AS nutrition_groups,
    COALESCE(rsg.step_groups, '[]'::jsonb) AS step_groups,
    COALESCE(ru.utensils, '[]'::jsonb) AS utensils,
    COALESCE(rig.ingredient_groups, '[]'::jsonb) AS ingredient_groups,
    COALESCE(rc.categories, '[]'::jsonb) AS categories
FROM recipes AS r
LEFT JOIN (
    SELECT
        ru.recipe_id,
        jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name)) AS utensils
    FROM recipe_utensils AS ru
    JOIN utensils AS u ON ru.utensil_id = u.id
    GROUP BY ru.recipe_id
) AS ru ON r.id = ru.recipe_id
LEFT JOIN (
    SELECT
        rc.recipe_id,
        jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name)) AS categories
    FROM recipe_categories AS rc
    JOIN categories AS c ON rc.category_id = c.id
    GROUP BY rc.recipe_id
) AS rc ON r.id = rc.recipe_id
LEFT JOIN (
    SELECT
        rig.recipe_id,
        jsonb_agg(jsonb_build_object(
            'id', rig.id,
            'title', rig.title,
            'ingredients',
            (SELECT jsonb_agg(jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'optional', ri.optional,
                'quantity_start', ri.quantity_start,
                'quantity_end', ri.quantity_end,
                'unit_name', u2.name,
                'preparation', ri.preparation
            )) FROM recipe_ingredients AS ri
            JOIN ingredients AS i ON ri.ingredient_id = i.id
            JOIN units AS u2 ON ri.unit_id = u2.id
            WHERE ri.group_id = rig.id)
        )) AS ingredient_groups
    FROM recipe_ingredient_groups AS rig
    GROUP BY rig.recipe_id
) AS rig ON r.id = rig.recipe_id
LEFT JOIN (
    SELECT
        rng.recipe_id,
        jsonb_agg(jsonb_build_object(
            'id', rng.id,
            'name', rng.name,
            'quantity', rng.quantity,
            'unit', rng.unit,
            'nutritions',
            (SELECT jsonb_agg(jsonb_build_object(
                'type', rn.type,
                'number', rn.number,
                'unit', rn.unit
            )) FROM recipe_nutritions AS rn WHERE rn.group_id = rng.id)
        )) AS nutrition_groups
    FROM recipe_nutrition_groups AS rng
    GROUP BY rng.recipe_id
) AS rng ON r.id = rng.recipe_id
LEFT JOIN (
    SELECT
        rsg.recipe_id,
        jsonb_agg(jsonb_build_object(
            'id', rsg.id,
            'title', rsg.title,
            'steps',
            (SELECT jsonb_agg(jsonb_build_object(
                'title', rs.title,
                'text', rs.text
            )) FROM recipe_steps AS rs WHERE rs.group_id = rsg.id)
        )) AS step_groups
    FROM recipe_step_groups AS rsg
    GROUP BY rsg.recipe_id
) AS rsg ON r.id = rsg.recipe_id
WHERE r.id = ${recipeId}`
  return recipes[0]
}

export async function searchRecipes(query: string) {
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
WHERE r.id IN (
    SELECT id
    FROM recipes
    WHERE title ILIKE '%' || ${query} || '%'
)
ORDER BY r.created_at DESC`
  return recipes
}
