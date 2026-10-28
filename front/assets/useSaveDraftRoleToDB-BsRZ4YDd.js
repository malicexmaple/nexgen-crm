import{o as H}from"./chunk-ChpBd9eV.js";import{t as X}from"./react-M6yZRsSc.js";import{t as Z}from"./build-CngeiE9P.js";import{u as ee}from"./routedFlowStateScopeRegistry-DGhefLBQ.js";import{W as G}from"./utils-C2me6AkW-CmNSg6P4.js";import{t as l}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{r as se}from"./useAtomStateValue-Dz6EyrZL.js";import{t as k}from"./isDeeplyEqual-HKLhjau_.js";import{Ga as ae,do as te,fo as oe,lo as re,uo as ie,ut as ne,v as ce,y as de}from"./graphql-BF74bK1D.js";import{t as A}from"./lib-DMJ_HwL6.js";import{t as F}from"./useMutation-CbqDlzIw.js";import{t as D}from"./useSetAtomFamilyState-CVz7FfHR.js";import{t as j}from"./useAtomFamilyStateValue-D5oYEaFz.js";import{t as le}from"./immer-Da4Ov0Ly.js";import{t as b}from"./getOperationName-Ddz1PZ_Z.js";import{i as K}from"./SettingsRolesQueryEffect-DnuJ9IEX.js";import{n as I}from"./useGetObjectPermissionDerivedStates-RwuYXSNi.js";var pe=A`
  fragment AgentFields on Agent {
    id
    name
    label
    description
    icon
    prompt
    modelId
    responseFormat
    roleId
    isCustom
    isSystem
    modelConfiguration
    triggers
    applicationId
    createdAt
    updatedAt
  }
`,me=A`
  fragment ApiKeyForRoleFragment on ApiKeyForRole {
    id
    name
    expiresAt
    revokedAt
  }
`,ue=A`
  fragment FieldPermissionFragment on FieldPermission {
    objectMetadataId
    fieldMetadataId
    canReadFieldValue
    canUpdateFieldValue
    id
    roleId
  }
`,Re=A`
  fragment ObjectPermissionFragment on ObjectPermission {
    objectMetadataId
    canReadObjectRecords
    canUpdateObjectRecords
    canSoftDeleteObjectRecords
    canDestroyObjectRecords
    restrictedFields
  }
`,Ae=A`
  fragment RolePermissionFlagFragment on RolePermissionFlag {
    id
    flag
    roleId
  }
`,fe=A`
  fragment RoleFragment on Role {
    id
    label
    description
    icon
    canUpdateAllSettings
    canAccessAllTools
    canAccessAllAgentChatChannels
    isEditable
    canReadAllObjectRecords
    canUpdateAllObjectRecords
    canSoftDeleteAllObjectRecords
    canDestroyAllObjectRecords
    canBeAssignedToUsers
    canBeAssignedToAgents
    canBeAssignedToApiKeys
    applicationId
    universalIdentifier
  }
`,B=A`
  fragment RowLevelPermissionPredicateFragment on RowLevelPermissionPredicate {
    id
    fieldMetadataId
    objectMetadataId
    operand
    subFieldName
    workspaceMemberFieldMetadataId
    workspaceMemberSubFieldName
    rowLevelPermissionPredicateGroupId
    positionInRowLevelPermissionPredicateGroup
    roleId
    value
  }
`,N=A`
  fragment RowLevelPermissionPredicateGroupFragment on RowLevelPermissionPredicateGroup {
    id
    parentRowLevelPermissionPredicateGroupId
    logicalOperator
    positionInRowLevelPermissionPredicateGroup
    roleId
    objectMetadataId
  }
`,Pe=A`
  fragment PartialWorkspaceMemberQueryFragment on WorkspaceMember {
    id
    name {
      firstName
      lastName
    }
    avatarUrl
    userEmail
    userId
    userWorkspaceId
  }
`,g=A`
  ${Pe}
  ${fe}
  ${pe}
  ${me}
  ${Ae}
  ${Re}
  ${ue}
  ${B}
  ${N}
  query GetRoles {
    getPermissionFlags {
      id
      applicationId
      key
      label
      description
      icon
      permissionType
    }
    getRoles {
      ...RoleFragment
      workspaceMembers {
        ...PartialWorkspaceMemberQueryFragment
      }
      agents {
        ...AgentFields
      }
      apiKeys {
        ...ApiKeyForRoleFragment
      }
      permissionFlags {
        ...RolePermissionFlagFragment
      }
      objectPermissions {
        ...ObjectPermissionFragment
      }
      fieldPermissions {
        ...FieldPermissionFragment
      }
      rowLevelPermissionPredicates {
        ...RowLevelPermissionPredicateFragment
      }
      rowLevelPermissionPredicateGroups {
        ...RowLevelPermissionPredicateGroupFragment
      }
    }
  }
`,be=A`
  ${B}
  ${N}
  mutation UpsertRowLevelPermissionPredicates(
    $input: UpsertRowLevelPermissionPredicatesInput!
  ) {
    upsertRowLevelPermissionPredicates(input: $input) {
      predicates {
        ...RowLevelPermissionPredicateFragment
      }
      predicateGroups {
        ...RowLevelPermissionPredicateGroupFragment
      }
    }
  }
`,ge=()=>F(be),Fe=e=>{const r=j(I,e),t=D(I,e),[i]=F(ce);return{addAgentToRoleAndUpdateState:async({agentId:p})=>{const{data:d}=await i({variables:{agentId:p,roleId:e},awaitRefetchQueries:!0,refetchQueries:["GetRoles"]});return d?.assignRoleToAgent},updateAgentRoleDraftState:({agent:p})=>{t({...r,agents:[...r.agents,p]})},addAgentsToRole:async({roleId:p,agentIds:d})=>{await Promise.all(d.map(R=>i({variables:{roleId:p,agentId:R}})))}}},ve=e=>{const r=j(I,e),t=D(I,e),[i]=F(de);return{addApiKeyToRoleAndUpdateState:async({apiKeyId:p})=>{const{data:d}=await i({variables:{apiKeyId:p,roleId:e},awaitRefetchQueries:!0,refetchQueries:["GetRoles"]});return d?.assignRoleToApiKey},updateApiKeyRoleDraftState:({apiKey:p})=>{t({...r,apiKeys:[...r.apiKeys,p]})},addApiKeysToRole:async({roleId:p,apiKeyIds:d})=>{await Promise.all(d.map(R=>i({variables:{roleId:p,apiKeyId:R}})))}}},Ie=e=>{const r=D(K,e),t=j(I,e),i=D(I,e),[c]=F(re);return{addWorkspaceMemberToRoleAndUpdateState:async({workspaceMemberId:d})=>{const{data:R}=await c({variables:{workspaceMemberId:d,roleId:e}});if(R?.updateWorkspaceMemberRole!==void 0){const P=R.updateWorkspaceMemberRole,U=[...t.workspaceMembers,{id:P.id,name:P.name,colorScheme:P.colorScheme,userEmail:P.userEmail,userId:P.userId}],w={...t,workspaceMembers:U};r(w),i(w)}return R?.updateWorkspaceMemberRole},updateWorkspaceMemberRoleDraftState:({workspaceMember:d})=>{i({...t,workspaceMembers:[...t.workspaceMembers,{id:d.id,name:d.name,userEmail:d.userEmail,userId:d.userId,avatarUrl:d.avatarUrl}]})},addWorkspaceMembersToRole:async({roleId:d,workspaceMemberIds:R})=>{await Promise.all(R.map(P=>c({variables:{roleId:d,workspaceMemberId:P}})))}}},Me=Z(),we=(e,r)=>le(e,t=>{if(!(0,Me.isNonEmptyArray)(t.fieldPermissions))return;const i=t.fieldPermissions.findIndex(c=>c.fieldMetadataId===r);return i>-1&&t.fieldPermissions.splice(i,1),t}),Oe=H(X(),1),je=()=>{const e=ee(),r=se();return{removeFieldPermissionInDraftRole:(0,Oe.useCallback)((t,i)=>{const c=I.getAtom(t,r),f=we(e.get(c),i);e.set(c,f)},[r,e])}},ye=(e,r)=>{const t=r?.find(i=>i.fieldMetadataId===e.fieldMetadataId);return t?e.canReadFieldValue!==t.canReadFieldValue||e.canUpdateFieldValue!==t.canUpdateFieldValue:!0},Se=(e,r)=>{if(!r)return Object.fromEntries(Object.entries(e).filter(([,c])=>c!==void 0));const t={},i=new Set([...Object.keys(e),...Object.keys(r)]);for(const c of i){const f=e[c],M=r[c];k(f,M)||(t[c]=f)}return t},Te=(e,r)=>{const t=Se(e,r);if(l(r)&&k(e.permissionFlags?.map(({flag:i})=>i).sort()??[],r.permissionFlags?.map(({flag:i})=>i).sort()??[])){const{permissionFlags:i,...c}=t;return c}return t},De=["label","description","icon","canUpdateAllSettings","canAccessAllTools","canAccessAllAgentChatChannels","canReadAllObjectRecords","canUpdateAllObjectRecords","canSoftDeleteAllObjectRecords","canDestroyAllObjectRecords","canBeAssignedToUsers","canBeAssignedToAgents","canBeAssignedToApiKeys"],Je=({roleId:e,isCreateMode:r,onSuccess:t})=>{const[i]=F(ne),[c]=F(ae),[f]=F(oe),[M]=F(te),[p]=F(ie),[d]=ge(),{addWorkspaceMembersToRole:R}=Ie(e),{addAgentsToRole:P}=Fe(e),{addApiKeysToRole:U}=ve(e),w=j(K,e),a=j(I,e),m=Te(a,w),E=a.fieldPermissions?.filter(s=>{const o=!w?.fieldPermissions?.some(S=>S.fieldMetadataId===s.fieldMetadataId);return s.canReadFieldValue!==!1&&s.canUpdateFieldValue!==!1&&o}),y=(m.fieldPermissions?.filter(s=>!E?.some(o=>s.fieldMetadataId===o.fieldMetadataId))??[]).filter(s=>ye(s,w?.fieldPermissions)),{removeFieldPermissionInDraftRole:W}=je(),C=()=>{if(G(E)===!0)for(const s of E)W(e,s.fieldMetadataId)},V=async()=>{const{data:s}=await i({variables:{createRoleInput:{id:e,label:a.label,description:a.description,icon:a.icon,canUpdateAllSettings:a.canUpdateAllSettings,canAccessAllTools:a.canAccessAllTools,canAccessAllAgentChatChannels:a.canAccessAllAgentChatChannels,canReadAllObjectRecords:a.canReadAllObjectRecords,canUpdateAllObjectRecords:a.canUpdateAllObjectRecords,canSoftDeleteAllObjectRecords:a.canSoftDeleteAllObjectRecords,canDestroyAllObjectRecords:a.canDestroyAllObjectRecords,canBeAssignedToUsers:a.canBeAssignedToUsers,canBeAssignedToAgents:a.canBeAssignedToAgents,canBeAssignedToApiKeys:a.canBeAssignedToApiKeys}},refetchQueries:[b(g)??""]});if(!s)return;const o=s.createOneRole.id;return await $(o),await x(o),o},Q=async()=>(l(m.permissionFlags)&&await f({variables:{upsertPermissionFlagsInput:{roleId:e,permissionFlagKeys:a.permissionFlags?.map(s=>s.flag)??[]}},refetchQueries:[b(g)??""]}),De.some(s=>s in m)&&await c({variables:{updateRoleInput:{id:e,update:{label:a.label,description:a.description,icon:a.icon,canUpdateAllSettings:a.canUpdateAllSettings,canAccessAllTools:a.canAccessAllTools,canAccessAllAgentChatChannels:a.canAccessAllAgentChatChannels,canReadAllObjectRecords:a.canReadAllObjectRecords,canUpdateAllObjectRecords:a.canUpdateAllObjectRecords,canSoftDeleteAllObjectRecords:a.canSoftDeleteAllObjectRecords,canDestroyAllObjectRecords:a.canDestroyAllObjectRecords,canBeAssignedToUsers:a.canBeAssignedToUsers,canBeAssignedToAgents:a.canBeAssignedToAgents,canBeAssignedToApiKeys:a.canBeAssignedToApiKeys}}},refetchQueries:[b(g)??""]}),l(m.objectPermissions)&&await M({variables:{upsertObjectPermissionsInput:{roleId:e,objectPermissions:a.objectPermissions?.map(s=>({objectMetadataId:s.objectMetadataId,canReadObjectRecords:s.canReadObjectRecords,canUpdateObjectRecords:s.canUpdateObjectRecords,canSoftDeleteObjectRecords:s.canSoftDeleteObjectRecords,canDestroyObjectRecords:s.canDestroyObjectRecords}))??[]}},refetchQueries:[b(g)??""]}),G(y)===!0&&await p({variables:{upsertFieldPermissionsInput:{roleId:e,fieldPermissions:y.map(s=>({objectMetadataId:s.objectMetadataId,fieldMetadataId:s.fieldMetadataId,canReadFieldValue:s.canReadFieldValue,canUpdateFieldValue:s.canUpdateFieldValue}))??[]}},refetchQueries:[b(g)??""]}),(l(m.rowLevelPermissionPredicates)||l(m.rowLevelPermissionPredicateGroups))&&await _(e),e),_=async s=>{const o=a.rowLevelPermissionPredicates??[],S=a.rowLevelPermissionPredicateGroups??[],L=o.reduce((u,O)=>{const v=O.objectMetadataId;return l(u[v])||(u[v]=[]),u[v].push(O),u},{}),q=w?.rowLevelPermissionPredicates??[],Y=new Set(q.map(u=>u.objectMetadataId));for(const u of Y)l(L[u])||(L[u]=[]);for(const[u,O]of Object.entries(L)){const v=new Set(O.map(n=>n.rowLevelPermissionPredicateGroupId).filter(l)),h=n=>{const T=S.find(z=>z.id===n);l(T?.parentRowLevelPermissionPredicateGroupId)&&!v.has(T.parentRowLevelPermissionPredicateGroupId)&&(v.add(T.parentRowLevelPermissionPredicateGroupId),h(T.parentRowLevelPermissionPredicateGroupId))};for(const n of v)h(n);const J=S.filter(n=>v.has(n.id));await d({variables:{input:{roleId:s,objectMetadataId:u,predicates:O.map(n=>({id:n.id,fieldMetadataId:n.fieldMetadataId,operand:n.operand,value:n.value,subFieldName:n.subFieldName,workspaceMemberFieldMetadataId:n.workspaceMemberFieldMetadataId,workspaceMemberSubFieldName:n.workspaceMemberSubFieldName,rowLevelPermissionPredicateGroupId:n.rowLevelPermissionPredicateGroupId,positionInRowLevelPermissionPredicateGroup:n.positionInRowLevelPermissionPredicateGroup})),predicateGroups:J.map(n=>({id:n.id,objectMetadataId:u,parentRowLevelPermissionPredicateGroupId:n.parentRowLevelPermissionPredicateGroupId,logicalOperator:n.logicalOperator,positionInRowLevelPermissionPredicateGroup:n.positionInRowLevelPermissionPredicateGroup}))}},refetchQueries:[b(g)??""],awaitRefetchQueries:!0})}},$=async s=>{l(m.permissionFlags)&&await f({variables:{upsertPermissionFlagsInput:{roleId:s,permissionFlagKeys:a.permissionFlags?.map(o=>o.flag)??[]}},refetchQueries:[b(g)??""]}),l(m.objectPermissions)&&await M({variables:{upsertObjectPermissionsInput:{roleId:s,objectPermissions:a.objectPermissions?.map(o=>({objectMetadataId:o.objectMetadataId,canReadObjectRecords:o.canReadObjectRecords,canUpdateObjectRecords:o.canUpdateObjectRecords,canSoftDeleteObjectRecords:o.canSoftDeleteObjectRecords,canDestroyObjectRecords:o.canDestroyObjectRecords}))??[]}},refetchQueries:[b(g)??""]}),G(y)===!0&&await p({variables:{upsertFieldPermissionsInput:{roleId:s,fieldPermissions:y.map(o=>({objectMetadataId:o.objectMetadataId,fieldMetadataId:o.fieldMetadataId,canReadFieldValue:o.canReadFieldValue,canUpdateFieldValue:o.canUpdateFieldValue}))??[]}},refetchQueries:[b(g)??""]}),(l(m.rowLevelPermissionPredicates)||l(m.rowLevelPermissionPredicateGroups))&&await _(s)},x=async s=>{l(m.workspaceMembers)&&a.canBeAssignedToUsers&&await R({roleId:s,workspaceMemberIds:a.workspaceMembers.map(o=>o.id)}),l(m.agents)&&a.canBeAssignedToAgents&&await P({roleId:s,agentIds:a.agents.map(o=>o.id)}),l(m.apiKeys)&&a.canBeAssignedToApiKeys&&await U({roleId:s,apiKeyIds:a.apiKeys.map(o=>o.id)})};return{saveDraftRoleToDB:async()=>{C();const s=r?await V():await Q();l(s)&&l(t)&&await t(s)}}};export{Fe as a,ve as i,Te as n,g as o,Ie as r,Je as t};
