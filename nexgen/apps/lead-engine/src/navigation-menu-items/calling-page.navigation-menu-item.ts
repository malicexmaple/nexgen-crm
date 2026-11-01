import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
  NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.callingPage,
  name: 'Start calling',
  icon: 'IconPhoneCall',
  position: 0,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.pageLayout,
  folderUniversalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.callingFolder,
});
