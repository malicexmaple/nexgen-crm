import{o as f}from"./chunk-ChpBd9eV.js";import{t as S}from"./jsx-runtime-BmDUFisN.js";import{t as y}from"./react-M6yZRsSc.js";import{Lt as G}from"./schemas-pe6acdm4.js";import{g as s}from"./types-CAaG6HAM-CuhXx7FV.js";import{i as v}from"./feedback-DHATp8in-B-puGgbw.js";import{zt as C}from"./utils-C2me6AkW-CmNSg6P4.js";import{f as x,l as A}from"./PageCardLayout-Bn8RuinJ.js";import{t as N}from"./useNavigateSettings-DaubofYm.js";import{r as b}from"./dist-C0k9q2wC.js";import{t as I}from"./getToastOptionsFromError-DedTlB38.js";import{t as j}from"./lib-DMJ_HwL6.js";import{t as L}from"./useMutation-CbqDlzIw.js";import{t as E}from"./SettingsTextInput-CVjamhdL.js";import{i as l}from"./layout-4nLOjbJA-Df6cWFLP.js";import{Ho as M,Io as T,Vo as q}from"./index-BpXnuP3g.js";import{t as D}from"./getAllEmailingDomains-CAFL3K0L.js";var a=S(),c=f(y(),1),P=j`
  mutation CreateEmailGroupChannel($input: CreateEmailGroupChannelInput!) {
    createEmailGroupChannel(input: $input) {
      messageChannel {
        id
        handle
        visibility
        type
        isSyncEnabled
        excludeGroupEmails
        contactAutoCreationPolicy
      }
      forwardingAddress
    }
  }
`,H=()=>{const{enqueueToast:e}=v(),[d,{loading:i,error:o}]=L(P,{refetchQueries:[{query:x},{query:A},{query:D}]});return{createEmailGroupChannel:(r,m)=>d({variables:{input:{handle:r,displayName:m}},onError:n=>{e(I({error:n}))}}),loading:i,error:o}},ee=()=>{const{i18n:e,_:d}=b(),i=N(),{createEmailGroupChannel:o,loading:t}=H(),[r,m]=(0,c.useState)(""),[n,g]=(0,c.useState)(""),p=G().safeParse(r).success&&!t,u=(0,c.useCallback)(async()=>{const _=n.trim(),h=(await o(r,_.length>0?_:void 0)).data?.createEmailGroupChannel.messageChannel.id;h&&i(s.EmailGroupChannelDetail,{messageChannelId:h})},[o,n,r,i]);return(0,a.jsx)(T,{title:e._({id:"papEbS"}),links:[{children:e._({id:"pmUArF"}),href:C(s.General)},{children:e._({id:"hZotg6"}),href:C(s.WorkspaceCommunications)},{children:e._({id:"papEbS"})}],actionButton:(0,a.jsx)(M,{isSaveDisabled:!p,isCancelDisabled:t,isLoading:t,onCancel:()=>i(s.WorkspaceCommunications),onSave:u}),children:(0,a.jsxs)(q,{children:[(0,a.jsxs)(l.Root,{children:[(0,a.jsx)(l.Header,{title:e._({id:"hzKQCy"}),description:e._({id:"Z4WP0F"})}),(0,a.jsx)(E,{instanceId:"email-group-source",label:e._({id:"5f1fxa"}),placeholder:"support@mycompany.com",value:r,onChange:m,onInputEnter:()=>{p&&u()},disabled:t})]}),(0,a.jsxs)(l.Root,{children:[(0,a.jsx)(l.Header,{title:e._({id:"0gS7M5"}),description:e._({id:"+/y8+6"})}),(0,a.jsx)(E,{instanceId:"email-group-display-name",label:e._({id:"0gS7M5"}),placeholder:e._({id:"yYneQW"}),value:n,maxLength:255,onChange:g,onInputEnter:()=>{p&&u()},disabled:t})]})]})})};export{ee as SettingsAccountsNewEmailGroupChannel};
