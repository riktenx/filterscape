import { cmdGenerateModGroup } from "./cmd.js";

const setPlane = (mapAreas, key, plane) => {
  mapAreas[key][2] = plane;
  mapAreas[key][5] = plane;
};

const index = [
  {
    name: "Bloodveld",
    url: "https://oldschool.runescape.wiki/w/Bloodveld",
    transform: {
      updateMapAreas: (areas) => {
        // wiki is wrong
        setPlane(areas, "[[Slayer Tower]] (basement)", 3);

        // wiki has a formatting quirk that breaks the parser
        areas["Slayer tower (upstairs)"] = [3404, 3556, 1, 3429, 3579, 1];
      },
      getDefaults: () => {
        return {
          "Weapons and armour": [
            "Steel axe",
            "Steel full helm",
            "Steel scimitar",
            "Mithril sq shield",
            "Mithril chainbody",
          ],
          Other: ["Bones", "Meat pizza"],
        };
      },
    },
  },
  {
    name: "Nechryael",
    url: "https://oldschool.runescape.wiki/w/Nechryael",
    transform: {
      updateMapAreas: (areas) => {
        setPlane(areas, "[[Slayer Tower]] Basement", 3); // wiki is wrong
      },
    },
  },
  {
    name: "Vyre",
    url: "https://oldschool.runescape.wiki/w/Vyrewatch_Sentinel",
    transform: {
      getDefaults: () => {
        return {};
      },
    },
  },
  {
    name: "Aberrant spectre",
    url: "https://oldschool.runescape.wiki/w/Aberrant_spectre",
    transform: {
      updateDropTable: (table) => {
        delete table["Other"];
        delete table["Tertiary"];
      },
      getDefaults: () => {
        return {
          "Weapons and armour": [
            "Steel axe",
            "Mithril kiteshield",
            "Adamant platelegs",
          ],
          Coins: ["Coins"],
        };
      },
    },
  },
  {
    name: "Dust devil",
    url: "https://oldschool.runescape.wiki/w/Dust_devil",
    transform: {
      getDefaults: (_) => {
        return {
          "100%": ["Bones"],
          "Weapons and armour": [
            "Adamant axe",
            "Rune dagger",
            "Red d'hide vambraces",
            "Black d'hide vambraces",
            "Air battlestaff",
            "Earth battlestaff",
          ],
          "Runes and ammunition": ["Rune arrow"],
          Other: ["Ugthanki kebab"],
        };
      },
    },
  },
  {
    name: "Smoke devil",
    url: "https://oldschool.runescape.wiki/w/Smoke_devil",
    transform: {
      updateMapAreas: (table) => {
        // there are some strays in thermy's room so this breaks the thermy
        // boss module, just adjust it manually
        delete table["[[Smoke Devil Dungeon]]"];
        table["[[Smoke Devil Dungeon]]"] = [2377, 9412, 0, 2427, 9471, 0];
      },
      getDefaults: (_) => {
        return {
          "100%": ["Ashes"],
          "Weapons and armour": [
            "Adamant battleaxe",
            "Rune dagger",
            "Air battlestaff",
            "Black d'hide vambraces",
            "Fire battlestaff",
            "Mithril plateskirt",
            "Red d'hide body",
          ],
          "Runes and ammunition": [
            "Smoke rune",
            "Runite bolts",
            "Fire rune",
            "Air rune",
            "Soul rune",
            "Rune arrow",
          ],
          Coins: ["Coins"],
          Other: [
            "Shark",
            "Steel bar",
            "Magic logs",
            "Coal",
            "Adamantite bar",
            "Crossbow string",
            "Ugthanki kebab",
          ],
        };
      },
    },
  },
  {
    name: "Skeletal wyvern",
    url: "https://oldschool.runescape.wiki/w/Skeletal_Wyvern",
  },
  {
    name: "Gargoyle",
    url: "https://oldschool.runescape.wiki/w/Gargoyle",
    transform: {
      getDefaults: () => {
        return {
          "Weapons and armour": ["Adamant platelegs", "Adamant boots"],
          Runes: ["Fire rune"],
          Materials: ["Gold ore", "Pure essence", "Gold bar"],
        };
      },
      preScript: (scope) => {
        return `/*@define:input:gargoyle
type: boolean
group: Hide drops
label: Hide non-10k coin drops
*/
#define VAR_${scope}_BOOLEAN_HIDESMALLCOINS true
CONST_${scope}_RULE (VAR_${scope}_BOOLEAN_HIDESMALLCOINS && name:"Coins" && value:<10_000) {
  hidden = true;
}
`;
      },
    },
  },
  {
    name: "Abyssal demon",
    url: "https://oldschool.runescape.wiki/w/Abyssal_demon",
    transform: {
      getDefaults: () => {
        return {
          "Weapons and armour": [
            "Black sword",
            "Steel battleaxe",
            "Black axe",
            "Mithril kiteshield",
          ],
          Runes: ["Air rune", "Chaos rune", "Blood rune", "Law rune"],
          Materials: ["Pure essence", "Adamantite bar"],
          Coins: ["Coins"],
        };
      },
    },
  },
  {
    name: "Araxyte",
    url: "https://oldschool.runescape.wiki/w/Araxyte",
    transform: {
      updateMapAreas: (table) => {
        // wiki source is cooked here, just do our own
        delete table["[[Morytania Spider Cave]] (task-only area)"];
        table["[[Morytania Spider Cave]]"] = [3653, 9793, 0, 3710, 9868, 0];
      },
      updateDropTable: (table) => {
        table["Other"] = table["Other"].filter(
          (item) => item !== "Araxyte venom sack"
        );
      },
      getDefaults: () => {
        return {
          "Weapons and armour": ["Adamant longsword", "Adamant battleaxe"],
        };
      },
    },
  },
];

await cmdGenerateModGroup("slayer", index);
