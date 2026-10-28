import{o as O}from"./chunk-ChpBd9eV.js";import{t as b}from"./react-M6yZRsSc.js";import{t as h}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{t as F}from"./capitalize-DFPVt1IM-CyPrrB5u.js";import{t as j}from"./useAtomStateValue-Dz6EyrZL.js";import{Si as I,un as _}from"./graphql-BF74bK1D.js";import{t as E}from"./useQuery-CoVTqM6Q.js";import{n as L}from"./lib-DMJ_HwL6.js";import{t as M}from"./useApolloCoreClient-DjopNWH3.js";import{t as y}from"./useIsFeatureEnabled-BWrpJKQK.js";import{r as v,t as A}from"./getRecordFromRecordNode-zQQiaYrY.js";import{n as i,t as C}from"./useObjectPermissionsForObject-DKWmAcZ8.js";import{t as S}from"./useGenerateDepthRecordGqlFieldsFromObject-DVvT_OBN.js";import{t as $}from"./useObjectPermissions-BOMh41lZ.js";import{t as q}from"./objectMetadataItemsSelector-WlgykxdJ.js";import{t as G}from"./isShareableObjectMetadataItem-auZky7Ll.js";var n=O(b(),1),P=({objectNameSingular:e,recordGqlFields:r,withSoftDeleted:t=!1})=>{const{objectMetadataItem:o}=i({objectNameSingular:e}),a=j(q),{objectPermissionsByObjectMetadataId:s}=$();return{findOneRecordQuery:(0,n.useMemo)(()=>L`
      query FindOne${F(o.nameSingular)}($objectRecordId: UUID!) {
        ${o.nameSingular}(filter: {
        ${t?`
          or: [
            { deletedAt: { is: NULL } },
            { deletedAt: { is: NOT_NULL } }
          ],
        `:""}
          id: {
            eq: $objectRecordId
          }
        })${v({objectMetadataItems:a,objectMetadataItem:o,recordGqlFields:r,objectPermissionsByObjectMetadataId:s})}
      },
  `,[o,a,r,t,s])}},Q=e=>{const r=C(e.id),t=y(_.IS_RECORD_LEVEL_SHARING_ENABLED);return r.canReadObjectRecords||t&&G(e)&&e.sharingReach===I.WORKSPACE},Z=({objectNameSingular:e,objectRecordId:r="",recordGqlFields:t,skip:o,withSoftDeleted:a=!1})=>{const{objectMetadataItem:s}=i({objectNameSingular:e}),{recordGqlFields:c}=S({objectNameSingular:e,depth:1}),m=M(),{findOneRecordQuery:p}=P({objectNameSingular:e,recordGqlFields:t??c,withSoftDeleted:a}),l=Q(s),{data:d,loading:u,error:f,refetch:R}=E(p,{skip:!h(s)||!r||o||!l,variables:{objectRecordId:r},client:m});return{record:(0,n.useMemo)(()=>d?.[e]?A({recordNode:d?.[e]}):void 0,[d,e]),loading:u,error:f,refetch:R}};export{P as n,Z as t};
