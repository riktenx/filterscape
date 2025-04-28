import { FilterDB, FilterDBItemList, FragmentGenerator } from './types.ts';

export class JunkHideModule implements FragmentGenerator {
  generate(db: FilterDB): string {
    const lists = [
      db['EQUIP_BRONZE'],
      db['EQUIP_IRON'],
      db['EQUIP_STEEL'],
      db['EQUIP_BLACK'],
      db['EQUIP_MITHRIL'],
      db['EQUIP_ADAMANT'],
      db['EQUIP_RUNE'],
    ];
    return `/*@ define:module:hidejunk
name: Hide junk
description: |
  Hide junk items in bulk. This should generally eliminate the need for a
  massive hide list in your plugin config.

  All of these rules hide BY DEFAULT. Value rules can override them.
*/

${hideCheckbox('JUNK', 'Equipment', 'Hide bronze equipment', true, db['EQUIP_BRONZE'])}

${hideCheckbox('JUNK', 'Equipment', 'Hide iron equipment', true, db['EQUIP_IRON'])}

${hideCheckbox('JUNK', 'Equipment', 'Hide steel equipment', true, db['EQUIP_STEEL'])}

${hideCheckbox('JUNK', 'Equipment', 'Hide black equipment', true, db['EQUIP_BLACK'])}

${hideCheckbox('JUNK', 'Equipment', 'Hide mithril equipment', true, db['EQUIP_MITHRIL'])}

${hideCheckbox('JUNK', 'Equipment', 'Hide adamant equipment', true, db['EQUIP_ADAMANT'])}

${hideCheckbox('JUNK', 'Equipment', 'Hide rune equipment', false, db['EQUIP_RUNE'])}`;
  }
}

const hideCheckbox = (
  scope: string,
  label: string,
  group: string,
  defaultValue: boolean,
  list: FilterDBItemList
): string => {
  const listName = `CONST_${scope}_${list.name}`;
  const varName = `VAR_${scope}_HIDE_${list.name}`;
  const listValue = JSON.stringify(list.items.map((item) => item.name));
  return `/*@ define:input
type: boolean
group: '${group}'
label: '${label}'
*/
#define ${varName} ${defaultValue}

#define ${listName} ${listValue}
apply (${varName} && name:${listName}) { hidden = true; }`;
};
