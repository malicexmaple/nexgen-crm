import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.callingFolder,
  name: 'Calling',
  icon: 'IconPhoneCall',
  position: 3,
  type: NavigationMenuItemType.FOLDER,
});
