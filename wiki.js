const cheerio = require("cheerio");
const { capitalizeWords } = require("./util");

const baseUrl = "https://growtopia.fandom.com/wiki/";
function wikiUrl(page) {
  const capitalizedName = capitalizeWords(page);
  const urlName = capitalizedName.replace(/\s+/g, "_");
  return baseUrl + urlName;
}

async function getPageHtml(page) {
  const page_url = wikiUrl(page);
  const response = await fetch(page_url);
  return await response.text();
}

async function getItemData(name) {
  const html = await getPageHtml(name);
  const page_url = wikiUrl(name);

  const $ = cheerio.load(html);
  const item_card_path = ".mw-parser-output .item-card";

  const rarity_text = $(
    `${item_card_path} .card-header h3 .mw-headline b small`,
  ).text();

  const rarity =
    rarity_text.trim().length > 0
      ? Number.parseInt(rarity_text.match(/\d+/)[0])
      : null;

  const description = $(`${item_card_path} .card-text:first`).text();
  const properties = $(`${item_card_path} .card-text:nth(1)`).text();
  const type = $(`${item_card_path} td:first`).text().trim();
  const chi = $(`${item_card_path} td:nth(1)`).text().trim();
  const texture_type = $(`${item_card_path} td:nth(2)`).text().trim();
  const collision_type = $(`${item_card_path} td:nth(3)`).text().trim();
  const hardnesses = $(`${item_card_path} td:nth(4)`)
    .text()
    .trim()
    .match(/^(\d+) Hits.*(\d+) Hits.*/);
  const hardness_fist = Number.parseInt(hardnesses[1]);
  const hardness_pickaxe = Number.parseInt(hardnesses[2]);
  const seed_sprite = $(`${item_card_path} td:nth(5) img`).attr("src");
  const seed_color = $(`${item_card_path} td:nth(5)`)
    .text()
    .trim()
    .split(" ")[0];
  const grow_time = $(`${item_card_path} td:nth(6)`).text().trim();
  const gems_drop = $(`${item_card_path} td:nth(7)`)
    .text()
    .trim()
    .match(/^(\d+)\s*-\s*(\d+).*/);
  const gems_drop_min =
    gems_drop !== null ? Number.parseInt(gems_drop[1]) : null;
  const gems_drop_max =
    gems_drop !== null ? Number.parseInt(gems_drop[2]) : null;
  const sprite = $(
    `${item_card_path} .card-header h3 .mw-headline .growsprite img`,
  ).attr("src");

  const creation_inputs = $("tbody:nth(1) a");
  let splice_input1, splice_input2;
  let combination_input1,
    combination_input2,
    combination_input3,
    combination_yield;

  if (creation_inputs.length === 3) {
    splice_input1 = $(creation_inputs[1]).text();
    splice_input2 = $(creation_inputs[2]).text();
  } else if (creation_inputs.length === 5) {
    combination_input1 = $(creation_inputs[2]).text();
    combination_input1_amount = $("tbody:nth(1) tr:nth(2) td b")
      .text()
      .match(/\d+/)[0];
    combination_input2 = $(creation_inputs[3]).text();
    combination_input2_amount = $("tbody:nth(1) tr:nth(3) td b")
      .text()
      .match(/\d+/)[0];
    combination_input3 = $(creation_inputs[4]).text();
    combination_input3_amount = $("tbody:nth(1) tr:nth(4) td b")
      .text()
      .match(/\d+/)[0];
    combination_yield = $("tbody:nth(1) tr td b:nth(3)").text();
  }

  if (!splice_input1) {
    splice_input1 = splice_input2 = null;
  }
  if (!combination_input1) {
    combination_input1 =
      combination_input2 =
      combination_input3 =
      combination_yield =
        null;
  }

  return {
    name: name,
    page_url: page_url,
    rarity: rarity,
    description: description,
    properties: properties,
    type: type,
    chi: chi,
    texture_type: texture_type,
    collision_type: collision_type,
    hardness_fist: hardness_fist,
    hardness_pickaxe: hardness_pickaxe,
    seed_sprite: seed_sprite,
    seed_color: seed_color,
    grow_time: grow_time,
    gems_drop_min: gems_drop_min,
    gems_drop_max: gems_drop_max,
    sprite: sprite,
    splice_input1: splice_input1,
    splice_input2: splice_input2,
    combination_input1: combination_input1,
    combination_input1_amount: combination_input1_amount,
    combination_input2: combination_input2,
    combination_input2_amount: combination_input2_amount,
    combination_input3: combination_input3,
    combination_input3_amount: combination_input3_amount,
    combination_yield: combination_yield,
  };
}

async function getAchievements() {
  const html = await getPageHtml("Achievements");

  const $ = cheerio.load(html);
  const achievements = [];

  const icon_elements = $("td .growsprite img");
  const icon_urls = [];
  for (let i = 0; i < icon_elements.length; i++) {
    icon_urls.push(icon_elements[i].attribs["src"]);
  }

  const division_tables = $("table");
  for (let i = 0; i < division_tables.length; i++) {
    const table = division_tables[i];
    const rows = $(table).find("tr");
    const division = table.prev.prev.children[0].children[0].data;
    for (let j = 0; j < rows.length; j++) {
      const row = $(rows[j]);
      const icon_url = row.find("img").attr("src");
      const name = $(row[0].children[1]).text().trim();
      const description = $(row[0].children[3]).text().trim();
      if (description.length === 0 || name === "Achievements") {
        continue;
      }
      achievements.push({
        name: name,
        description: description,
        icon_url: icon_url,
        division: division,
      });
    }
  }

  return achievements;
}

module.exports = {
  getItemData: getItemData,
  wikiUrl: wikiUrl,
};
