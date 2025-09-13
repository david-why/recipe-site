DROP TABLE IF EXISTS collection_recipes;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS recipe_categories;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipe_ingredient_groups;
DROP TABLE IF EXISTS recipe_utensils;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS utensils;
DROP TABLE IF EXISTS recipe_steps;
DROP TABLE IF EXISTS recipe_step_groups;
DROP TABLE IF EXISTS recipe_nutritions;
DROP TABLE IF EXISTS recipe_nutrition_groups;
DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    active_time INTEGER,
    total_time INTEGER,
    difficulty TEXT NOT NULL,
    serving_size INTEGER NOT NULL,
    serving_unit TEXT,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    additional_info TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recipe_nutrition_groups (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL
);

CREATE TABLE recipe_nutritions (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES recipe_nutrition_groups(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    number REAL NOT NULL,
    unit TEXT NOT NULL
);

CREATE TABLE recipe_step_groups (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    title TEXT NOT NULL
);

CREATE TABLE recipe_steps (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES recipe_step_groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    text TEXT NOT NULL
);

CREATE TABLE utensils (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE ingredients (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE units (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE recipe_utensils (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    utensil_id TEXT NOT NULL REFERENCES utensils(id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient_groups (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    title TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES recipe_ingredient_groups(id) ON DELETE CASCADE,
    ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
    optional BOOLEAN NOT NULL,
    quantity_start REAL NOT NULL,
    quantity_end REAL NOT NULL,
    unit_id TEXT REFERENCES units(id),
    preparation TEXT NOT NULL
);

CREATE TABLE recipe_categories (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE collections (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT
);

CREATE TABLE collection_recipes (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE
);

-- Indexes for SELECT recipes

CREATE INDEX idx_ru_recipeid ON recipe_utensils(recipe_id);
CREATE INDEX idx_rig_recipeid ON recipe_ingredient_groups(recipe_id);
CREATE INDEX idx_rsg_recipeid ON recipe_step_groups(recipe_id);
CREATE INDEX idx_rs_groupid ON recipe_steps(group_id);
CREATE INDEX idx_rng_recipeid ON recipe_nutrition_groups(recipe_id);
CREATE INDEX idx_rn_groupid ON recipe_nutritions(group_id);
CREATE INDEX idx_rc_recipeid ON recipe_categories(recipe_id);
CREATE INDEX idx_ri_groupid ON recipe_ingredients(group_id);
