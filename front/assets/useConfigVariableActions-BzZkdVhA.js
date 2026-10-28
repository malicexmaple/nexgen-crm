import{t as y}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{t as p}from"./lib-DMJ_HwL6.js";import{t as i}from"./useMutation-CbqDlzIw.js";import{oc as C}from"./index-BpXnuP3g.js";import{t as g}from"./useApolloAdminClient-477Rj6j0.js";import{K as u,d as D,f as m}from"./graphql-CoMP6tUC.js";var r=p`
  query GetDatabaseConfigVariable($key: String!) {
    getDatabaseConfigVariable(key: $key) {
      name
      description
      value
      isSensitive
      isEnvOnly
      type
      options
      source
    }
  }
`,q=a=>{const t=g(),{refetch:n}=C(),[o]=i(u,{client:t}),[l]=i(D,{client:t}),[f]=i(m,{client:t}),c=async(e,b)=>{if(e===null||typeof e=="string"&&e===""||Array.isArray(e)&&e.length===0){await s();return}b?await o({variables:{key:a,value:e},refetchQueries:[{query:r,variables:{key:a}}]}):await l({variables:{key:a,value:e},refetchQueries:[{query:r,variables:{key:a}}]}),await n()},s=async e=>{y(e)&&e.preventDefault(),await f({variables:{key:a},refetchQueries:[{query:r,variables:{key:a}}]}),await n()};return{handleUpdateVariable:c,handleDeleteVariable:s}};export{r as n,q as t};
