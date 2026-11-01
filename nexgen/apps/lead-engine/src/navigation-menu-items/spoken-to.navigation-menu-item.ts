import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.spokenTo,
  name: 'SPOKEN TO',
  icon: 'IconPhoneIncoming',
  position: 2,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.spokenTo,
  folderUniversalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.callingFolder,
});
