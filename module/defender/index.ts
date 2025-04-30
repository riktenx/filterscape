import type { FilterDB, FilterDBItemList } from '../../filterdb/types.ts';

import { FragmentGeneratorBase } from '../../filterdb/fragmentgenerator.ts';

export default class extends FragmentGeneratorBase {
  generate(db: FilterDB): string {
    const defaultStyle = `\\
  showLootbeam = true; \\
  icon = CurrentItem(); \\
  sound = 6765; \\
  backgroundColor = "#80000000";`;

    return `/*@ define:module:defender
name: Defenders
*/

${styleGroup('DEFENDER', 'Defenders', db.items['EQUIP_DEFENDER']!!, defaultStyle, 12954)}

`;
  }
}

const styleGroup = (
  scope: string,
  group: string,
  list: FilterDBItemList,
  defaultStyle: string,
  exampleId: number
): string => {
  const items = list.items;

  const listVar = `VAR_${scope}_${list.name}_LIST`;
  const styleVar = `VAR_${scope}_${list.name}_STYLE`;
  const listValue = JSON.stringify(items.map((item) => item.name));
  return `
/*@ define:input
type: enumlist
group: '${group}'
label: Items
enum: ${listValue}
*/
#define ${listVar} ${listValue}

/*@ define:input
type: style
group: '${group}'
label: Items
exampleItem: '${items[items.length - 1].name}'
exampleItemId: ${exampleId}
*/
#define ${styleVar} ${defaultStyle}

rule (name:${listVar}) { hidden = false; ${styleVar} }`;
};
