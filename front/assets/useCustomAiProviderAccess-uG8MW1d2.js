import{t}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{r as i}from"./dist-C0k9q2wC.js";import{t as a}from"./useQuery-CoVTqM6Q.js";import{t as c}from"./lib-DMJ_HwL6.js";import{t as u}from"./useApolloAdminClient-477Rj6j0.js";var n=c`
  query GetCustomAiProviderAccess {
    getCustomAiProviderAccess {
      hasAccess
      seatCount
      seatThreshold
    }
  }
`,C=()=>{const{i18n:e,_:d}=i(),{data:o,loading:r}=a(n,{client:u()}),s=o?.getCustomAiProviderAccess;return{hasAccess:s?.hasAccess??r,tooltipContent:t(s)?s.hasAccess?e._({id:"79QPp0",values:{0:s.seatThreshold}}):e._({id:"dDp+uz",values:{0:s.seatThreshold,1:s.seatCount}}):void 0,gateDescription:t(s)?e._({id:"FjmF6O",values:{0:s.seatThreshold,1:s.seatCount}}):e._({id:"6IcJ94"})}};export{C as t};
