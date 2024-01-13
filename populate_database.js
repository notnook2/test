const sqlite3 = require("sqlite3").verbose();
const { getItemData } = require("./wiki");

function createDb(path) {
  const db = new sqlite3.Database(path);

  db.serialize(() => {
    db.run(`CREATE TABLE item(
                  name TEXT PRIMARY KEY,
                  rarity INTEGER,
                  description TEXT,
                  properties TEXT,
                  type TEXT,
                  chi TEXT,
                  texture_type TEXT,
                  collision_type TEXT,
                  hardness_fist INTEGER,
                  hardness_pickaxe INTEGER,
                  seed_sprite TEXT,
                  seed_color TEXT,
                  grow_time TEXT,
                  gems_drop_min INTEGER,
                  gems_drop_max INTEGER,
                  sprite TEXT,
                  splice_input1 TEXT,
                  splice_input2 TEXT,
                  combination_input1 TEXT,
                  combination_input2 TEXT,
                  combination_input3 TEXT,
                  combination_input1_amount INTEGER,
                  combination_input2_amount INTEGER,
                  combination_input3_amount INTEGER,
                  combination_yield INTEGER)`);
    db.run(`CREATE TABLE recipe(
      result TEXT,
      result_count INTEGER,
      ingredients TEXT,
    )`);

    db.run(`CREATE TABLE achievement(
      name TEXT PRIMARY KEY,
      description TEXT,
      icon_url TEXT,
      division TEXT
    )`);
  });
  return db;
}

function insertItem(db, item) {
  const stmt = db.run(
    `
              INSERT INTO item (name,
                  rarity,
                  description,
                  properties,
                  type,
                  chi,
                  texture_type,
                  collision_type,
                  hardness_fist,
                  hardness_pickaxe,
                  seed_sprite,
                  seed_color
                  grow_time,
                  gems_drop_min,
                  gems_drop_max,
                  sprite,
                  splice_input1,
                  splice_input2,
                  combination_input1,
                  combination_input2,
                  combination_input3,
                  combination_input1_amount,
                  combination_input2_amount,
                  combination_input3_amount,
                  combination_yield)
              VALUES ($name, $rarity, $description, $properties, $type, $chi, $texture_type, $collision_type, $hardness_fist,
                $hardness_pickaxe, $seed_sprite, $seed_color, $grow_time, $gems_drop_min, $gems_drop_max, $sprite, $splice_input1, $splice_input2, $combination_input1, $combination_input2, $combination_input3, $combination_input1_amount, $combination_input2_amount, $combination_input3_amount, $combination_yield)`,
    {
      $name: item.name,
      $rarity: item.rarity,
      $description: item.description,
      $properties: item.properties,
      $type: item.type,
      $chi: item.chi,
      $texture_type: item.texture_type,
      $collision_type: item.collision_type,
      $hardness_fist: item.hardness_fist,
      $hardness_pickaxe: item.hardness_pickaxe,
      $seed_sprite: item.seed_sprite,
      $seed_color: item.seed_color,
      $grow_time: item.grow_time,
      $gems_drop_min: item.gems_drop_min,
      $gems_drop_max: item.gems_drop_max,
      $sprite: item.sprite,
      $splice_input1: item.splice_input1,
      $splice_input2: item.splice_input2,
      $combination_input1: item.combination_input1,
      $combination_input2: item.combination_input2,
      $combination_input3: item.combination_input3,
      $combination_input1_amount: item.combination_input1_amount,
      $combination_input2_amount: item.combination_input2_amount,
      $combination_input3_amount: item.combination_input3_amount,
      $combination_yield: item.combination_yield,
    },
  );
}
getItemData("Chandelier").then((item) => {
  const db = createDb("wiki.db");
  insertItem(db, item);
});
// get_item_data("Dirt").then((x) => console.log(x));
