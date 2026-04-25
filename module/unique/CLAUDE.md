# Adding a new tier/group to `module.rs2f`

## YAML in block comments

The `/*@ define:... */` block comments are parsed as **YAML**. Any value
containing a `:` must be quoted, otherwise YAML treats it as a nested
key/value and parsing breaks.

```
group: "Leagues VI: Echo Items"   # correct — has a colon
group: Tier S                     # fine — no colon, no quotes needed
```

This applies to every field in the block (`group`, `label`, `exampleItem`,
`name`, etc.).

## Three coordinated pieces

A complete entry needs three coordinated pieces in this file:

1. A **stringlist input** (the item names)
2. A **style input** (how matched items render)
3. A **rule** at the bottom that binds the two together

All three must share the same base name (e.g. `VAR_UNIQUE_LEAGUESVI` + `VAR_UNIQUE_LEAGUESVI_CUSTOMSTYLE`).

## 1. Stringlist input

Goes in the top section with the other stringlists.

```
/*@ define:input:uniques
type: stringlist
label: Items
group: <Group name shown in UI>
*/
#define VAR_UNIQUE_<NAME> ["item1","item2",...]
```

Item name conventions:
- Wrap with `*` on both ends to match substrings (e.g. `"*champion scroll"`, `"*Infernal tecpatl*"`).
- A bare name matches exactly (e.g. `"Brimstone key"`).
- Case is not significant in practice — existing lists mix cases.

## 2. Style input

Goes in the middle section with the other styles. Convention in this file: list the style block in the same top-to-bottom order as the rules at the bottom.

```
/*@ define:input:uniques
type: style
label: Style
group: <same group name as the stringlist>
exampleItem: <one item from the list, used for UI preview>
*/
#define VAR_UNIQUE_<NAME>_CUSTOMSTYLE \
  hidden = false;\
  textColor = "#......";\
  backgroundColor = "#......";\
  borderColor = "#......";\
  <optional: fontType = 3;>\
  <optional: textAccent = 3;>\
  <optional: showLootbeam = true;>
```

Every line except the last ends with `\` (line continuation). The last line ends with `;` and no backslash.

## 3. Rule

Goes at the very bottom. One line. Order matters — earlier rules win when an item matches multiple lists.

```
rule (name:VAR_UNIQUE_<NAME>) { VAR_UNIQUE_<NAME>_CUSTOMSTYLE }
```

## Example: how the Leagues VI tier was added

1. Got the echo items list from the wiki raw page:
   `https://oldschool.runescape.wiki/w/Demonic_Pacts_League/Echo_bosses_and_echo_equipment?action=raw`
2. Added `VAR_UNIQUE_LEAGUESVI` stringlist with each item wrapped in `*...*`.
3. Added `VAR_UNIQUE_LEAGUESVI_CUSTOMSTYLE` (copied from Tier S as a starting style).
4. Added `rule (name:VAR_UNIQUE_LEAGUESVI) { VAR_UNIQUE_LEAGUESVI_CUSTOMSTYLE }` as the **first** rule so it takes precedence over the tier rules.

## For future league/event tiers

The wiki typically has a page like `<League Name>/<unique drops page>?action=raw` listing echo or seasonal uniques in a wikitable. The `{{plink|<item>}}` templates are the item names to extract.
