import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
  CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Position 15 sits between the pinned Home column (10) and Timeline (20), so a
// lead opens on its calling controls.
export default definePageLayoutTab({
  universalIdentifier: CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyCallTab,
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage.universalIdentifier,
  title: 'Call',
  position: 15,
  icon: 'IconPhoneCall',
  layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
  widgets: [
    {
      universalIdentifier: CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyCallTabWidget,
      title: 'Calling',
      type: 'FRONT_COMPONENT',
      heightBehavior: 'TAB_VIEWPORT',
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier: CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
