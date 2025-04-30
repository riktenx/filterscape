import type { FilterDB, FilterDBItemList } from '../../filterdb/types.ts';

import { FragmentGeneratorBase } from '../../filterdb/fragmentgenerator.ts';

export default class JunkHideModule extends FragmentGeneratorBase {
  generate(db: FilterDB): string {
    return `/*@ define:module:hidejunk
name: Hide junk
description: |
  Hide junk items in bulk. This should generally eliminate the need for a
  massive hide list in your plugin config.

  All of these rules hide BY DEFAULT. Value rules and other things can override
  them.
*/

${hideCheckbox('JUNK', 'Equipment', 'Hide bronze equipment', true, db.items['EQUIP_BRONZE']!!)}

${hideCheckbox('JUNK', 'Equipment', 'Hide iron equipment', true, db.items['EQUIP_IRON']!!)}

${hideCheckbox('JUNK', 'Equipment', 'Hide steel equipment', true, db.items['EQUIP_STEEL']!!)}

${hideCheckbox('JUNK', 'Equipment', 'Hide black equipment', true, db.items['EQUIP_BLACK']!!)}

${hideCheckbox('JUNK', 'Equipment', 'Hide mithril equipment', true, db.items['EQUIP_MITHRIL']!!)}

${hideCheckbox('JUNK', 'Equipment', 'Hide adamant equipment', true, db.items['EQUIP_ADAMANT']!!)}

${hideCheckbox('JUNK', 'Equipment', 'Hide rune equipment', false, db.items['EQUIP_RUNE']!!)}`;
  }
}

const hideCheckbox = (
  scope: string,
  group: string,
  label: string,
  defaultValue: boolean,
  list: FilterDBItemList
): string => {
  // manual filter for now
  const items = list.items.filter(
    (i) => !i.name.endsWith('defender') && !i.name.endsWith('boots')
  );

  const listName = `CONST_${scope}_${list.name}`;
  const varName = `VAR_${scope}_HIDE_${list.name}`;
  const listValue = JSON.stringify(items.map((item) => item.name));
  return `/*@ define:input
type: boolean
group: '${group}'
label: '${label}'
*/
#define ${varName} ${defaultValue}

#define ${listName} ${listValue}
apply (${varName} && name:${listName}) { hidden = true; }`;
};
