import{t}from"./lib-DMJ_HwL6.js";var a=t`
  query GetEmailingDomains {
    getEmailingDomains {
      id
      domain
      status
      unsubscribeHostnameStatus
      verifiedAt
      verificationRecords {
        type
        key
        value
        priority
        status
      }
      createdAt
      updatedAt
    }
  }
`;export{a as t};
