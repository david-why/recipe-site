CREATE TABLE recipes (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    activeTime INTEGER NOT NULL,
    totalTime INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    servingSize INTEGER NOT NULL,
    servingUnit TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    additionalInfo TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recipe_nutrition_groups (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipeId TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL
);

CREATE TABLE recipe_nutritions (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    groupId UUID NOT NULL REFERENCES recipe_nutrition_groups(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    number REAL NOT NULL,
    unit TEXT NOT NULL
);

CREATE TABLE recipe_step_groups (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipeId TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    title TEXT NOT NULL
);

CREATE TABLE recipe_steps (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    groupId UUID NOT NULL REFERENCES recipe_step_groups(id) ON DELETE CASCADE,
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
    recipeId TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    utensilId TEXT NOT NULL REFERENCES utensils(id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient_groups (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipeId TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    title TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    groupId UUID NOT NULL REFERENCES recipe_ingredient_groups(id) ON DELETE CASCADE,
    ingredientId TEXT NOT NULL REFERENCES ingredients(id),
    optional BOOLEAN NOT NULL,
    quantity_start REAL NOT NULL,
    quantity_end REAL NOT NULL,
    unitId TEXT NOT NULL REFERENCES units(id),
    preparation TEXT NOT NULL
);

CREATE TABLE recipe_categories (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    recipeId TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    categoryId TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE collections (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT
);

CREATE TABLE collection_recipes (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    collectionId TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    recipeId TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE
);
