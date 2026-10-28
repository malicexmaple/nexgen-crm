import{t as l}from"./jsx-runtime-BmDUFisN.js";import{t as m}from"./dist-DM-aCDeX.js";import{m as p}from"./theme-CuGIQBsJ-EnL4YnNw.js";import{t as n}from"./feedback-BQFSnMjh-yp-ZOp1e.js";import{t as s}from"./SkeletonLine-DwQJ_pD4.js";import{t as h}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{t as f}from"./lib-DMJ_HwL6.js";import{t as x}from"./TableCell-C9kvS0C9.js";import{t as _}from"./TableRow-Bdh9pFDa.js";var D=f`
  mutation DeleteConnectedAccount($id: UUID!) {
    deleteConnectedAccount(id: $id) {
      id
    }
  }
`,t=l(),g=[144,104,128],d=16,v=m("div")({name:"StyledRows",class:"s1dlmadl",propsAsIs:!1}),w=(e,i,r)=>i?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s,{width:d,height:d}),(0,t.jsx)(s,{width:r,height:n.xs})]}):h(e.width)?(0,t.jsx)(s,{width:e.width,height:n.xs}):null,N=({columns:e,gridTemplateColumns:i})=>(0,t.jsx)(v,{children:g.map(r=>(0,t.jsx)(_,{gridTemplateColumns:i,children:e.map((a,o)=>(0,t.jsx)(x,{align:a.align,gap:p.spacing[2],minWidth:"0",overflow:"hidden",children:w(a,o===0,r)},o))},r))});export{D as n,N as t};
