import{t as r}from"./build-CngeiE9P.js";import{f as c}from"./graphql-BF74bK1D.js";import{t as e}from"./useQuery-CoVTqM6Q.js";import{t as a}from"./lib-DMJ_HwL6.js";var p=a`
  fragment ApplicationConnectionProviderFragment on ApplicationConnectionProvider {
    id
    applicationId
    type
    name
    displayName
    scope
    logoUrl
    oauth {
      scopes
      isClientCredentialsConfigured
    }
  }
`,s=a`
  ${p}
  query ApplicationConnectionProviders($applicationId: UUID!) {
    applicationConnectionProviders(applicationId: $applicationId) {
      ...ApplicationConnectionProviderFragment
    }
  }
`,P=o=>{const{data:i,loading:n,refetch:t}=e(s,{skip:!o,variables:{applicationId:o??""},fetchPolicy:"cache-first"});return{connectionProviders:i?.applicationConnectionProviders??[],loading:n,refetch:t}},l=r(),v=o=>{const{data:i,loading:n,refetch:t}=e(c,{variables:{applicationId:o},skip:!(0,l.isNonEmptyString)(o),fetchPolicy:"cache-and-network"});return{accounts:i?.applicationConnectedAccounts??[],loading:n,refetch:t}};export{P as n,v as t};
