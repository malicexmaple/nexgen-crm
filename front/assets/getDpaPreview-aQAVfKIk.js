import{t as i}from"./jsx-runtime-BmDUFisN.js";import{t as a}from"./dist-DM-aCDeX.js";import{r as d}from"./feedback-DHATp8in-B-puGgbw.js";import{t as n}from"./dist-Cg5OofxW.js";import{n as l}from"./lib-DMJ_HwL6.js";var e=i(),p=a("div")({name:"StyledDocument",class:"s6fh7ms",propsAsIs:!1}),o=a("h1")({name:"StyledTitle",class:"s1y1fhs",propsAsIs:!1}),c=a("div")({name:"StyledLastUpdated",class:"s1varq34",propsAsIs:!1}),m=a("h2")({name:"StyledHeading",class:"s9lqrqx",propsAsIs:!1}),u=a("p")({name:"StyledParagraph",class:"s7n1jt2",propsAsIs:!1}),y=a("div")({name:"StyledSignatureField",class:"sc11bfg",propsAsIs:!1}),v=a("div")({name:"StyledSignatureLabel",class:"scectfi",propsAsIs:!1}),S=a("div")({name:"StyledSignatureValue",class:"s1wqux1q",propsAsIs:!1}),j=({document:s})=>(0,e.jsxs)(p,{tabIndex:0,role:"region","aria-label":s.title,children:[(0,e.jsx)(o,{children:s.title}),(0,e.jsx)(c,{children:n._({id:"oIDTlg",values:{0:s.lastUpdatedLabel}})}),s.blocks.map((t,r)=>t.kind==="heading"?(0,e.jsx)(m,{children:t.text},r):t.kind==="signatureField"?(0,e.jsxs)(y,{children:[(0,e.jsx)(v,{children:t.label}),(0,e.jsx)(S,{children:t.value})]},r):(0,e.jsx)(u,{children:t.text},r))]}),E=({text:s})=>(0,e.jsx)(d,{layout:"compact",status:"warning",fullWidth:!0,children:s}),I=l`
  query GetDpaAgreements {
    dpaAgreements {
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
      downloadUrl
    }
  }
`,_=l`
  query GetDpaPreview {
    dpaPreview {
      title
      lastUpdatedLabel
      templateVersion
      region
      processorEntity
      sccSectionActive
      notice
      blocks {
        kind
        text
        label
        value
      }
    }
  }
`;export{j as i,I as n,E as r,_ as t};
