import{B as a,N as l}from"./types-CAaG6HAM-CuhXx7FV.js";import{Mt as R,a as L,rt as g}from"./utils-C2me6AkW-CmNSg6P4.js";import{t as i}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{n as u}from"./capitalize-DFPVt1IM-CyPrrB5u.js";import{fn as $}from"./graphql-BF74bK1D.js";import{r as T}from"./objectMetadataItemsWithFieldsSelector-DYEsqAsi.js";import{t as d}from"./isFieldRelation-B8398UPa.js";var E=t=>t.type===$.MORPH_RELATION,y=t=>t.type===a.MORPH_RELATION?(t.morphRelations??[]).map(e=>L({fieldName:t.name,relationType:e.type,targetObjectMetadataNameSingular:e.targetObjectMetadata.nameSingular,targetObjectMetadataNamePlural:e.targetObjectMetadata.namePlural})):[g({name:t.name})],C=t=>[a.UUID,a.TEXT,a.DATE_TIME,a.DATE,a.NUMBER,a.NUMERIC,a.BOOLEAN,a.RATING,a.SELECT,a.MULTI_SELECT,a.POSITION,a.RAW_JSON,a.ARRAY].includes(t),S=({objectMetadataItems:t,gqlField:e,fieldMetadata:n,relationRecordGqlFields:N,computeReferences:s=!1,objectPermissionsByObjectMetadataId:p})=>{const m=n.type;if(C(m))return e;if(m===a.MORPH_RELATION&&(n.settings?.relationType===l.ONE_TO_MANY||n.settings?.relationType===l.MANY_TO_ONE)){let O="";for(const r of n.morphRelations??[]){const o=R({fieldName:n.name,relationType:n.settings?.relationType,targetObjectMetadataNameSingular:r.targetObjectMetadata.nameSingular,targetObjectMetadataNamePlural:r.targetObjectMetadata.namePlural}),c=t.find(_=>_.id===r.targetObjectMetadata.id);if(i(c)){if(i(p)&&i(c.id)){if(!i(r.targetObjectMetadata.id))throw new Error(u(`Target object metadata id not found with field metadata ${n.name}`));if(!T(p,r.targetObjectMetadata.id).canReadObjectRecords)continue}if(n.settings?.relationType===l.ONE_TO_MANY){if(e!==o)continue;O+=u(`${o}
{
  edges {
    node ${f({objectMetadataItems:t,objectMetadataItem:c,recordGqlFields:N,computeReferences:s,isRootLevel:!1,objectPermissionsByObjectMetadataId:p})}
  }
}`)}if(n.settings?.relationType===l.MANY_TO_ONE){if(e===`${o}Id`){O+=`${e}
    `;continue}if(e!==o)continue;O+=`${o}
${f({objectMetadataItems:t,objectMetadataItem:c,recordGqlFields:N,computeReferences:s,isRootLevel:!1,objectPermissionsByObjectMetadataId:p})}`}}}return`${O}`}if(m===a.RELATION&&n.relation?.type===l.MANY_TO_ONE){const O=t.find(r=>r.id===n.relation?.targetObjectMetadata.id);if(!i(O))return"";if(i(p)&&i(O.id)){if(!i(n.relation?.targetObjectMetadata.id))throw new Error(u(`Target object metadata id not found with field metadata ${n.name}`));if(!T(p,n.relation?.targetObjectMetadata.id).canReadObjectRecords)return""}return e===g({name:n.name})?`${e}`:`${e}
${f({objectMetadataItems:t,objectMetadataItem:O,recordGqlFields:N,computeReferences:s,isRootLevel:!1,objectPermissionsByObjectMetadataId:p})}`}if(m===a.RELATION&&n.relation?.type===l.ONE_TO_MANY){const O=t.find(r=>r.id===n.relation?.targetObjectMetadata.id);if(!i(O))return"";if(i(p)&&i(O.id)){if(!i(n.relation?.targetObjectMetadata.id))throw new Error(u(`Target object metadata id not found with field metadata ${n.name}`));if(!T(p,n.relation?.targetObjectMetadata.id).canReadObjectRecords)return""}return u(`${e}
{
  edges {
    node ${f({objectMetadataItems:t,objectMetadataItem:O,recordGqlFields:N,computeReferences:s,isRootLevel:!1,objectPermissionsByObjectMetadataId:p})}
  }
}`)}return m===a.LINKS?u(`${e}
{
  primaryLinkUrl
  primaryLinkLabel
  secondaryLinks {
    label
    url
  }
}`):m===a.CURRENCY?u(`${e}
{
  amountMicros
  currencyCode
}
    `):m===a.FULL_NAME?u(`${e}
{
  firstName
  lastName
}`):m===a.ADDRESS?u(`${e}
{
  addressStreet1
  addressStreet2
  addressCity
  addressState
  addressCountry
  addressPostcode
  addressLat
  addressLng
}`):m===a.ACTOR?u(`${e}
{
    source
    workspaceMemberId
    name
    context {
      provider
      applicationId
    }
}`):m===a.EMAILS?u(`${e}
{
  primaryEmail
  additionalEmails
}`):m===a.PHONES?u(`${e}
    {
      primaryPhoneNumber
      primaryPhoneCountryCode
      primaryPhoneCallingCode
      additionalPhones {
        number
        callingCode
        countryCode
      }
    }`):m===a.FILES?u(`${e}
    {
      fileId
      label
      extension
      url
    }`):m===a.RICH_TEXT?u(`${e}
{
  blocknote
  markdown
  tiptap
}`):""},b=({gqlField:t,fieldMetadata:e,recordGqlFields:n})=>{const N=(d(e)||E(e))&&y(e).includes(t);return!!(!i(n)&&!d(e)&&!E(e)||!i(n)&&N||i(n?.[t]))},h=t=>i(t)&&typeof t=="object"&&t!==null&&!Array.isArray(t),f=({objectMetadataItems:t,objectMetadataItem:e,recordGqlFields:n,computeReferences:N=!1,isRootLevel:s=!0,objectPermissionsByObjectMetadataId:p})=>{if(!s&&i(p)&&i(e.id)&&!T(p,e.id).canReadObjectRecords)return"";const m=(e?.readableFields.filter(r=>r.isActive).filter(r=>r.type===a.RELATION?r.relation?.type===l.MANY_TO_ONE:r.type===a.MORPH_RELATION?r.settings?.relationType===l.MANY_TO_ONE:!1)).flatMap(r=>y(r).map(o=>({gqlField:o,fieldMetadata:r}))),O=[...e.readableFields.filter(r=>r.isActive).flatMap(r=>r.type!==a.MORPH_RELATION?[{gqlField:r.name,fieldMetadata:r}]:i(r.morphRelations)?r.morphRelations.map(o=>({gqlField:R({fieldName:r.name,relationType:o.type,targetObjectMetadataNameSingular:o.targetObjectMetadata.nameSingular,targetObjectMetadataNamePlural:o.targetObjectMetadata.namePlural}),fieldMetadata:r})):[]),...m].sort((r,o)=>r.gqlField.localeCompare(o.gqlField)).filter(r=>b({gqlField:r.gqlField,fieldMetadata:r.fieldMetadata,recordGqlFields:n}));return!s&&N?u(`{
      __ref
    }`):u(`{
__typename
${O.map(r=>{const o=n?.[r.gqlField],c=h(o)?o:void 0;return S({objectMetadataItems:t,gqlField:r.gqlField,fieldMetadata:r.fieldMetadata,relationRecordGqlFields:c,computeReferences:N,objectPermissionsByObjectMetadataId:p})}).filter(r=>r!=="").join(`
`)}
}`)},w=({recordConnection:t})=>t?.edges?.map(e=>A({recordNode:e.node})),A=({recordNode:t})=>{const{id:e,__typename:n}=t;return{...Object.fromEntries(Object.entries(t).map(([N,s])=>!i(s)||Array.isArray(s)||typeof s!="object"?[N,s]:i(s.edges)?[N,w({recordConnection:s})]:[N,A({recordNode:s})])),...i(e)?{id:e}:{},...i(n)?{__typename:n}:{}}};export{E as a,y as i,w as n,f as r,A as t};
