import{o as C}from"./chunk-ChpBd9eV.js";import{t as G}from"./jsx-runtime-BmDUFisN.js";import{t as b}from"./react-M6yZRsSc.js";import{g as r}from"./types-CAaG6HAM-CuhXx7FV.js";import{i as P}from"./feedback-DHATp8in-B-puGgbw.js";import{zt as S}from"./utils-C2me6AkW-CmNSg6P4.js";import{n as I}from"./capitalize-DFPVt1IM-CyPrrB5u.js";import{t as H}from"./useNavigateSettings-DaubofYm.js";import{r as R}from"./dist-C0k9q2wC.js";import{t as W}from"./useQuery-CoVTqM6Q.js";import{n as $}from"./lib-DMJ_HwL6.js";import{t as B}from"./useMutation-CbqDlzIw.js";import{t as d}from"./SettingsTextInput-CVjamhdL.js";import{t as U}from"./useApolloCoreClient-DjopNWH3.js";import{t as q}from"./downloadFile-D6qgumZY.js";import{i}from"./layout-4nLOjbJA-Df6cWFLP.js";import{Ho as M,Io as V,Uo as z,Vo as F}from"./index-BpXnuP3g.js";import{i as Q,n as k,r as X,t as Y}from"./getDpaPreview-aQAVfKIk.js";var t=G(),n=C(b(),1),Z=$`
  mutation GenerateSignedDpa($input: GenerateSignedDpaInput!) {
    generateSignedDpa(input: $input) {
      downloadUrl
      agreement {
        id
        type
        templateVersion
        region
        processorEntity
        customerLegalEntityName
        signatoryName
        signatoryTitle
        acceptedByEmail
        acceptedAt
        createdAt
      }
    }
  }
`,fe=()=>{const{i18n:e,_:J}=R(),c=H(),{enqueueToast:p}=P(),u=U(),[o,h]=(0,n.useState)(""),[s,v]=(0,n.useState)(""),[l,E]=(0,n.useState)(""),[g,_]=(0,n.useState)(!1),{data:N,loading:x}=W(Y,{client:u}),[j]=B(Z,{client:u,refetchQueries:[{query:k}],awaitRefetchQueries:!0}),a=N?.dpaPreview,f=o.trim()!==""&&s.trim()!==""&&l.trim()!==""&&!a?.notice&&!g,D=async()=>{if(!f)return;_(!0);const y=o.trim(),w=s.trim(),L=l.trim();try{const{data:T}=await j({variables:{input:{customerLegalEntityName:y,signatoryName:w,signatoryTitle:L}}}),m=T?.generateSignedDpa;if(!m)throw new Error(I("No result returned"));const A=y.replace(/[/\\:*?"<>|]+/g,"-");await q(m.downloadUrl,`Twenty-DPA-${m.agreement.templateVersion}-${A}.pdf`),p({status:"success",children:e._({id:"Z2Wg9g"})}),c(r.LegalDpa)}catch{p({status:"error",children:e._({id:"NonvA5"})})}finally{_(!1)}};return x?(0,t.jsx)(z,{}):(0,t.jsx)(V,{title:e._({id:"H3rta9"}),links:[{children:e._({id:"pmUArF"}),href:S(r.General)},{children:e._({id:"vifyyw"}),href:S(r.LegalDpa)},{children:e._({id:"ziAjHi"})}],actionButton:(0,t.jsx)(M,{isSaveDisabled:!f,isLoading:g,onCancel:()=>c(r.LegalDpa),onSave:D}),children:(0,t.jsxs)(F,{children:[a?.notice&&(0,t.jsx)(i.Root,{children:(0,t.jsx)(X,{text:a.notice})}),(0,t.jsxs)(i.Root,{children:[(0,t.jsx)(i.Header,{title:e._({id:"mmGBWT"}),description:e._({id:"Ya1wb4"})}),(0,t.jsx)(d,{instanceId:"dpa-legal-entity-name",label:e._({id:"nc/jNe"}),placeholder:e._({id:"BXMLsb"}),value:o,onChange:h,fullWidth:!0}),(0,t.jsx)(d,{instanceId:"dpa-signatory-name",label:e._({id:"3yzHpm"}),placeholder:e._({id:"A1CyH/"}),value:s,onChange:v,fullWidth:!0}),(0,t.jsx)(d,{instanceId:"dpa-signatory-title",label:e._({id:"a6TaW9"}),placeholder:e._({id:"Gpb1xF"}),value:l,onChange:E,fullWidth:!0})]}),a&&(0,t.jsxs)(i.Root,{children:[(0,t.jsx)(i.Header,{title:e._({id:"rdUucN"}),description:e._({id:"21Xjwu"})}),(0,t.jsx)(Q,{document:a})]})]})})};export{fe as SettingsLegalDpaNew};
