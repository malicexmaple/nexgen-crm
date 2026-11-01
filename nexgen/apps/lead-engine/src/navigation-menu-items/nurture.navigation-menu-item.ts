import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.nurture,
  name: 'NURTURE',
  icon: 'IconHourglass',
  position: 3,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.nurture,
  folderUniversalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.callingFolder,
});
