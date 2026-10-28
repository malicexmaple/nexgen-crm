import{o as _t}from"./chunk-ChpBd9eV.js";import{t as gt}from"./jsx-runtime-BmDUFisN.js";import{t as Rt}from"./react-M6yZRsSc.js";import{t as Tt}from"./dist-DM-aCDeX.js";import{s as St}from"./theme-CuGIQBsJ-EnL4YnNw.js";import{r as vt}from"./useIsMobile-CZeJLJJN-Bqm3WjVP.js";import{t as R}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{n as ue}from"./capitalize-DFPVt1IM-CyPrrB5u.js";import{t as he}from"./useAtomStateValue-Dz6EyrZL.js";import{t as At}from"./currentWorkspaceState-DahEPtKG.js";import{wi as Ze}from"./graphql-BF74bK1D.js";import{t as It}from"./currentUserState-BjMkh9wE.js";import{t as pt}from"./billingState-BMmCOWgz.js";import{Vs as bt,bc as Dt,ho as ft,wc as Ct}from"./index-BpXnuP3g.js";import{n as Mt,t as xt}from"./getNextOnboardingStatus-CJjcvD-J.js";var Le=gt(),be=_t(Rt(),1),Ot=(t,c,f,_,r=0)=>{const e=1/Math.tan(t/2),S=1/(f-_);return new Float32Array([e/c,0,0,0,0,e,0,0,0,-r,(_+f)*S,-1,0,0,2*_*f*S,0])},Lt=(t,c)=>{const f=t[0]-c[0],_=t[1]-c[1],r=t[2]-c[2],e=Math.hypot(f,_,r)||1,S=f/e,D=_/e,b=r/e,N=b,U=-S,v=Math.hypot(N,U)||1,h=N/v,C=U/v,O=D*C,w=b*h-S*C,L=-D*h;return new Float32Array([h,O,S,0,0,w,D,0,C,L,b,0,-(h*t[0]+C*t[2]),-(O*t[0]+w*t[1]+L*t[2]),-(S*t[0]+D*t[1]+b*t[2]),1])},Nt=(t,c)=>{const f=new Float32Array(16);for(let _=0;_<4;_++)for(let r=0;r<4;r++){let e=0;for(let S=0;S<4;S++)e+=t[S*4+r]*c[_*4+S];f[_*4+r]=e}return f},wt=(t,c,f,_,r)=>{const e=Math.cos(_[0]),S=Math.sin(_[0]),D=Math.cos(_[1]),b=Math.sin(_[1]),N=Math.cos(_[2]),U=Math.sin(_[2]),v=D*N+b*S*U,h=e*U,C=-b*N+D*S*U,O=-D*U+b*S*N,w=e*N,L=b*U+D*S*N,Y=b*e,k=-S,z=D*e;t[c]=v*r[0],t[c+1]=h*r[0],t[c+2]=C*r[0],t[c+3]=0,t[c+4]=O*r[1],t[c+5]=w*r[1],t[c+6]=L*r[1],t[c+7]=0,t[c+8]=Y*r[2],t[c+9]=k*r[2],t[c+10]=z*r[2],t[c+11]=0,t[c+12]=f[0],t[c+13]=f[1],t[c+14]=f[2],t[c+15]=1};var Pt=.8,oe=.12,Ut=.2,Ft=.25,yt=1.2,Je=.5,Bt=1.25,et=[0,0,0],Be=3,Ht=4.65,He=3.3,Gt=3.5,Ne=.08,$=1.85,Q=-.45,Ge=.34,we=.6,tt=.68,nt=.5,Ee=10,Wt=[1,3,5,7,9,10],Xt=[0,1,3,5,7,10],Yt=[0,0,2,3,3,4],ie=1.95,se=-.6,We=14,Ie=.3,Vt=1.1,kt=[0,0,4,7,10,14],zt=[0,1,1,1,1,1],Xe=.1,Ye=.55,qt=.4,_e=4,ce=.55,pe=.34,Ve=-.2,ot=-1,rt=.1,Zt=.8,jt=[0,0,4,5,7,11],Kt=[0,0,1,2,3,4],$t=.5,Qt=[3,6,9,13,17,20],Jt=[0,2,4,7,11,15],a={slab:1,column:.85,core:.72,rebar:.75,glass:.7,finishedGlass:.92,crane:1,counterweight:.6,cabin:.82,cabinWindow:.25,truck:.85,drum:.95,tire:.9,hub:.2,load:.8,machine:.82,glazingFrame:.9,brace:.95,recess:.22},de=t=>Math.max(0,Math.min(1,t)),Pe=t=>t*t*t*(t*(t*6-15)+10),ge=(t,c)=>{const f=t.findIndex(_=>_>c);return f===-1?5:f},en=({instances:t,layout:c,construction:f,truckConstruction:_=f,craneMotion:r})=>{t.cube.count=0,t.cylinder.count=0,t.cone.count=0,t.mixerDrum.count=0;const{halfWidth:e,halfHeight:S,contentHalfWidth:D,groundY:b}=c,N=S*yt,U=(n,i,l,E,o)=>{const m=t[n],g=m.count*17;g+17>m.data.length||E[0]<=0||E[1]<=0||E[2]<=0||(wt(m.data,g,i,l,E),m.data[g+16]=o,m.count++)},v=(n,i)=>{if(n<=f.builtStageIndex)return 1;const l=f.growingStageGrowths[n-f.builtStageIndex-1];if(!R(l))return 0;const E=de((i-b)/N);return Pe(de(l*1.8-E*Pt))},h=_.builtStageIndex+_.growingStageGrowths.reduce((n,i)=>n+i,0),C=n=>{const i=Math.max(0,Math.min(n.length-1,h)),l=Math.floor(i),E=Math.min(l+1,n.length-1);return n[l]+(n[E]-n[l])*(i-l)},O=(n,i,l,E=0)=>{const o=Math.cos(E),m=Math.sin(E),g=s=>[n+(s[0]*o+s[2]*m)*l,b+s[1]*l,i+(-s[0]*m+s[2]*o)*l],M=s=>[s[0],s[1]+E,s[2]],A=s=>[s[0]*l,s[1]*l,s[2]*l];return{scale:l,worldX:s=>n+s*l,worldY:s=>b+s*l,worldZ:s=>i+s*l,box:(s,T,I,p=et)=>U("cube",g(s),M(p),A(T),I),round:(s,T,I,p,d=et)=>U(s,g(T),M(d),A(I),p)}},w=n=>a.glass+(a.finishedGlass-a.glass)*v(5,n),L=({box:n},i,l,E,o)=>{const m=l[0]-i[0],g=l[1]-i[1],M=l[2]-i[2],A=Math.hypot(m,M);n([(i[0]+l[0])/2,(i[1]+l[1])/2,(i[2]+l[2])/2],[Math.hypot(A,g),E,E],o,[0,Math.atan2(-M,m),Math.atan2(g,A)])},Y=({round:n},i,l)=>{const E=Math.sign(l);n("cylinder",[i,oe,l],[oe*2,.1,oe*2],a.tire,[Math.PI/2,0,0]),n("cylinder",[i,oe,l+E*.055],[oe*1.25,.025,oe*1.25],a.hub,[Math.PI/2,0,0]),n("cylinder",[i,oe,l+E*.075],[oe*.5,.025,oe*.5],a.slab,[Math.PI/2,0,0])},k=({box:n})=>{n([.43,.32,0],[.3,.2,.4],a.truck),n([.41,.47,0],[.26,.18,.38],a.truck),n([.41,.565,0],[.3,.04,.43],a.slab);for(const i of[-1,1])n([.42,.48,i*.196],[.19,.12,.025],a.cabinWindow),n([.36,.27,i*.225],[.21,.045,.09],a.slab),n([.56,.37,i*.21],[.06,.06,.035],a.slab),n([.5,.48,i*.27],[.055,.075,.065],a.machine);n([.55,.48,0],[.025,.12,.3],a.cabinWindow),n([.59,.31,0],[.025,.09,.26],a.recess),n([.6,.23,0],[.06,.06,.44],a.slab)},z=n=>{const{box:i,round:l}=n;i([0,.18,0],[1.1,.1,.34],a.recess),k(n),i([-.18,.29,0],[.68,.1,.3],a.truck),l("mixerDrum",[-.14,.49,0],[.5,.72,.5],a.drum,[0,0,-Math.PI/2+.28]);for(const E of[-1,1]){i([-.26,.265,E*.22],[.58,.055,.09],a.slab),i([.08,.2,E*.2],[.16,.13,.09],a.machine);for(const o of[.36,-.12,-.36])Y(n,o,E*.2)}i([-.52,.4,0],[.16,.13,.23],a.machine),L(n,[-.48,.37,.08],[-.69,.24,.15],.08,a.slab)},j=(n,{mastX:i,mastZ:l,mastHeight:E,loadTarget:o,jibLength:m,counterJibLength:g,hasOpenMast:M=!1})=>{const{box:A}=n;if(E<=.001)return;const s=Math.max(.1,.09/n.scale),T=Math.max(.06,.055/n.scale),I=Math.max(.075,.065/n.scale),p=s*1.2,d=T*1.1,u=.42,x=M?.23:.17,P=M?.11:.17,F=s*(M?.65:1),y=T*(M?.7:1);A([i,.06,l],[.5,.12,.5],a.counterweight);for(const G of[-1,1])for(const ne of[-1,1])A([i+G*x,E/2,l+ne*P],[F,E,F],a.crane);const V=Math.ceil(E/(M?.78:.52));for(let G=0;G<V;G++){const ne=G/V*E,Oe=(G+1)/V*E;for(const ye of[-1,1]){A([i,Oe,l+ye*P],[x*2+F,y,y],a.crane);const Qe=G%2===0?1:-1;L(n,[i-Qe*x,ne,l+ye*P],[i+Qe*x,Oe,l+ye*P],y,a.brace)}}const B=o[0]-i,X=o[2]-l,q=Math.atan2(-X,B),J=Math.cos(q),ve=-Math.sin(q),H=(G,ne)=>[i+J*G,E+ne,l+ve*G];for(const G of[0,u])L(n,H(-g,G),H(m,G),p,a.crane);const le=Math.ceil((m+g)/.42);for(let G=0;G<le;G++){const ne=-g+(m+g)*G/le,Oe=-g+(m+g)*(G+1)/le;L(n,H(ne,0),H(ne,u),d,a.crane),L(n,H(ne,G%2===0?0:u),H(Oe,G%2===0?u:0),d,a.brace)}L(n,H(m,0),H(m,u),p,a.crane),A([i,E+.42,l],[s,.7,s],a.crane),L(n,H(0,.76),H(m*.6,u),p,a.crane),L(n,H(0,.76),H(-g+.1,u),p,a.crane),A(H(-g+.24,-.1),[.4,.32,.3],a.counterweight,[0,q,0]),A(H(.2,-.12),[.26,.24,.24],a.cabin,[0,q,0]);const Ae=H(.2,-.1);A([Ae[0]+Math.sin(q)*.13,Ae[1],Ae[2]+Math.cos(q)*.13],[.18,.12,.025],a.cabinWindow,[0,q,0]);const ht=Math.hypot(B,X),Et=o[1]+.06+.65*(1-r),Fe=Math.max(.08,E-.14-Et),[Me,,xe]=H(ht,0);A([Me,E-.04,xe],[.2,.08,.16],a.crane,[0,q,0]),A([Me,E-.08-Fe/2,xe],[I,Fe,I],a.crane);const je=E-.08-Fe;A([Me,je,xe],[.1,.12,.1],a.machine);const Ke=f.growingStageGrowths.at(-1)??1,$e=Ke>0?Pe(de((.5-Ke)/.04)):0;$e>0&&A([Me,je-.06,xe],[.45,.12*$e,.18],a.load,[0,q,0])},K=(n,{builtFloorsByStage:i=Wt,cladFloorsByStage:l=Xt,hasCrane:E=!0}={})=>{const{box:o,round:m,worldY:g}=n,M=i[i.length-1];let A=0;for(let d=0;d<M;d++){const u=d*Ge,x=v(ge(i,d),g(u));if(x<=.001)break;const P=Ge*x;A=u+P;const F=Math.max(0,P-Ne);for(let B=0;B<Ee;B++){const X=B/Ee*Math.PI*2;m("cylinder",[$+Math.cos(X)*nt,u+F/2,Q+Math.sin(X)*nt],[.13,F,.13],a.column)}m("cylinder",[$,u+P-Ne/2,Q],[tt*2,Ne,tt*2],a.slab);const y=v(ge(l,d),g(u)),V=F*y;if(V>.001){m("cylinder",[$,u+V/2,Q],[we*2,V,we*2],w(g(u)));for(let B=0;B<Ee;B++){const X=Math.PI/2-B/Ee*Math.PI*2;o([$+Math.sin(X)*we,u+V/2,Q+Math.cos(X)*we],[.055,V,.045],a.recess,[0,X,0])}m("cylinder",[$,u+V-.02*y,Q],[1.2249999999999999,.04*y,1.2249999999999999],a.recess)}}const s=M*Ge,T=v(5,g(s));if(T>.001){m("cylinder",[$,s+.17*T,Q],[.9,.34*T,.9],a.finishedGlass),m("cylinder",[$,s+.34*T+.04,Q],[1.02,.08,1.02],a.slab);for(let d=0;d<Ee;d++){const u=Math.PI/2-d/Ee*Math.PI*2;o([$+Math.sin(u)*.45,s+.17*T,Q+Math.cos(u)*.45],[.055,.34*T,.06],a.recess,[0,u,0])}m("cylinder",[$,s+.42+.07*T,Q],[.3,.14*T,.3],a.core),m("cone",[$,s+.42+.4*T,Q],[.16,.8*T,.16],a.crane)}if(!E)return;const I=v(0,g(0)),p=A+.42*T;j(n,{mastX:.45,mastZ:-1.1,mastHeight:Math.max(2.4,p+1)*I,loadTarget:[$-.32,p,Q-.18],jibLength:2.3,counterJibLength:.75,hasOpenMast:!0})},fe=n=>{const{round:i,worldY:l}=n,E=.36;for(let o=0;o<4;o++){const m=o*E,g=v(ge(Yt,o),l(m));if(g<=.001)break;const M=.45-o*.025,A=E*g;for(let s=0;s<8;s++){const T=s*Math.PI/4;i("cylinder",[Math.cos(T)*(M-.06),m+A/2,Math.sin(T)*(M-.06)],[.065,A,.065],a.column)}i("cylinder",[0,m+A-.03,0],[M*2+.2,.06,M*2+.2],a.slab)}},ee=n=>{const{box:i,round:l,worldY:E}=n,o=We*Ie,m=s=>Vt/2-.3*de(s/o),g=(s,T,I)=>[ie+s*m(I),I,se+T*m(I)];let M=0;for(let s=0;s<We;s++){const T=s*Ie,I=v(ge(kt,s),E(T));if(I<=.001)break;const p=T+Ie*I;M=p;for(const u of[-1,1])for(const x of[-1,1])L(n,g(u,x,T),g(u,x,p),.08,a.column);const d=m(p)*2;i([ie,p-.014,se],[d,.028,d],a.slab);for(const u of[-1,1])i([ie,p-.04,se+u*d/2],[d+.035,.07,.035],a.slab),i([ie+u*d/2,p-.04,se],[.035,.07,d+.035],a.slab),i([ie,p-.065,se+u*d*.2],[d-.06,.04,.035],a.column)}for(let s=0;s<We;s+=4){const T=s*Ie,I=Math.min(T+4*Ie,M);if(I<=T+.001)break;const p=s/4%2===0?1:-1;for(const d of[-1,1])L(n,g(-p,d,T),g(p,d,I),.09,a.slab),L(n,g(d,p,T),g(d,-p,I),.09,a.slab);for(const d of[-1,1])for(const u of[-1,1]){const x=g(d,u,I);i([x[0],I-.02,x[2]+u*.045],[.14,.13,.035],a.column);for(const P of[-.03,.03])l("cylinder",[x[0],I-.02+P,x[2]+u*.068],[.03,.018,.03],a.recess,[Math.PI/2,0,0])}}const A=v(5,E(o));if(A>.001){const s=[ie,o+.48*A,se];for(const I of[-1,1])for(const p of[-1,1]){const d=g(I,p,o);L(n,d,s,.07,a.slab),i([d[0],o+.09*A,d[2]],[.035,.18*A,.035],a.rebar)}const T=o+.22*A;for(const I of[-1,1])i([ie+I*.135,T,se],[.035,.035,.27],a.slab),i([ie,T,se+I*.135],[.27,.035,.035],a.slab);i([s[0],s[1]+.05*A,s[2]],[.045,.14*A,.045],a.rebar)}return M},re=n=>{const i=ee(n),l=O(e-.35*n.scale,.35*n.scale,n.scale*.75),E=[(n.worldX(2.1)-l.worldX(0))/l.scale,i*n.scale/l.scale,(n.worldZ(-.48)-l.worldZ(0))/l.scale];j(l,{mastX:0,mastZ:0,mastHeight:Math.max(2.4,E[1]+1)*v(1,l.worldY(0)),loadTarget:E,jibLength:Math.max(2.3,Math.hypot(E[0],E[2])+.3),counterJibLength:.75,hasOpenMast:!0});const o=n.worldX(.05),m=e+1.2*n.scale,g=C(zt),M=Pe(de(g/Xe)),A=.4*n.scale*(1-M),s=Pe(de((g-Xe)/(Ye-Xe))),T=Math.pow(de((g-Ye)/(1-Ye)),2),I=Math.PI*s,p=qt*n.scale;z(O(o+A-Math.sin(I)*p+(m-o)*T,n.worldZ(.75)+(1-Math.cos(I))*p,n.scale,Math.PI+I))},W=(n,{builtFloorsByStage:i=jt,framedFloorsByStage:l=Kt,hasDiagonalBraces:E=!1}={})=>{const{box:o,worldY:m}=n,g=i[i.length-1],M=l[l.length-1],A=_e*ce,s=-1.2/2;let T=0,I=0;for(let d=0;d<g;d++){const u=d*pe,x=v(ge(i,d),m(u));if(x<=.001)break;T+=x;const P=pe*x;I=u+P;const F=E&&d%2===0?.04:Ne,y=Math.max(0,P-F);for(let B=0;B<=_e;B++)for(const X of[Ve,ot])o([B*ce,u+y/2,X],[rt,y,rt],a.column);if(o([A/2,u+P-F/2,s],[2.3000000000000003,F,.9],a.slab),E||d>=M)continue;const V=y*v(ge(l,d),m(u));if(!(V<=.001))for(let B=0;B<_e;B++)o([(B+.5)*ce,u+V/2,Ve],[.05,V,.04],a.glazingFrame)}if(E)for(let d=0;d<g;d+=2){const u=d*pe,x=Math.min(pe*2,I-u);if(x<=.001)break;for(let P=0;P<_e;P++)for(const F of[-1,1]){const y=(P+.5)*ce;L(n,[y-F*ce/2,u,-.14],[y+F*ce/2,u+x,-.14],.065,a.slab)}}const p=T*pe;if(!(T<=.001))for(let d=0;d<=_e;d++)for(const u of[Ve,ot])for(const x of[-.025,.025])o([d*ce+x,p+.09,u],[.03,.18,.03],a.rebar)},te=(n,i,l)=>Math.max(Je,Math.min(Bt,n/i,N/l)),me=D+Ft,ae=e-Ut,Re=ae-me;if(Re<Math.max(Be,He)*Je)return;const Z=Math.min(te(Re,Be,Ht),te(Re,He,Gt)),De=Be*Z,Ce=He*Z,Te=-Math.min((me+ae+De)/2,ae),Se=Math.min((me+ae-Ce)/2,ae-Ce);K(O(Te,0,Z)),fe(O(Se+.55*Z,-.15*Z,Z)),re(O(Se,0,Z)),W(O(-e-(_e*ce-$t)*Z,0,Z),{builtFloorsByStage:Qt,framedFloorsByStage:Jt}),W(O(e-Zt*Z,0,Z),{hasDiagonalBraces:!0})},tn=-1,nn=1.6,at=t=>Math.max(0,Math.min(1,t)),on=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,it=({transitionSecondsPerStep:t=nn,easing:c=on}={})=>{const f=h=>t*Math.sqrt(h);let _=tn,r=null,e=null;const S=h=>h.segments[h.segments.length-1].upperStageIndex,D=h=>h.direction>0?S(h):h.lowerStageIndex,b=h=>h.direction>0?h.lowerStageIndex:S(h),N=h=>{if(h===_)return;const C=h>_;r={lowerStageIndex:Math.min(_,h),segments:[{upperStageIndex:Math.max(_,h),startPosition:0}],position:C?0:1,direction:C?1:-1,durationSeconds:f(Math.abs(h-_))}},U=(h,C)=>{const O=Math.max(1-h.position,.001),w=Math.max(O*h.durationSeconds,f(C-S(h)));h.segments.push({upperStageIndex:C,startPosition:h.position}),h.durationSeconds=w/O},v=()=>R(r)?c(r.position):1;return{setTargetStageIndex:h=>{R(r)?h===D(r)?e=null:h===b(r)?(r.direction=r.direction>0?-1:1,e=null):r.direction>0&&h>S(r)?(U(r,h),e=null):e=h:N(h)},jumpToStageIndex:h=>{_=h,r=null,e=null},advance:h=>{R(r)&&(r.position=at(r.position+r.direction*h/r.durationSeconds),r.position===(r.direction>0?1:0)&&(_=D(r),r=null,R(e)&&(N(e),e=null)))},isTransitioning:()=>R(r),getConstruction:()=>{if(!R(r))return{builtStageIndex:_,growingStageGrowths:[]};const{lowerStageIndex:h,segments:C,position:O}=r;return{builtStageIndex:h,growingStageGrowths:C.flatMap(({upperStageIndex:w,startPosition:L},Y)=>{const k=Y===0?h:C[Y-1].upperStageIndex,z=c(at((O-L)/(1-L)));return Array.from({length:w-k},()=>z)})}},getMotion:()=>R(r)?Math.sin(Math.PI*v()):0,getFinaleBump:()=>R(r)&&S(r)===5?Math.pow(Math.sin(Math.PI*v()),2):0}},ke=48,mt=t=>Float32Array.from(t.flat()),rn=()=>mt([{normal:[1,0,0],corners:[[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]]},{normal:[-1,0,0],corners:[[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]]},{normal:[0,1,0],corners:[[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]]},{normal:[0,-1,0],corners:[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]]},{normal:[0,0,1],corners:[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]]},{normal:[0,0,-1],corners:[[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]]}].flatMap(({normal:t,corners:c})=>[0,1,2,0,2,3].map(f=>[...c[f],...t]))),ze=t=>{const c=[];for(let f=0;f<ke;f++){const _=f/ke*Math.PI*2,r=(f+1)/ke*Math.PI*2,e=Math.cos(_),S=Math.sin(_),D=Math.cos(r),b=Math.sin(r);for(let C=0;C<t.length-1;C++){const[O,w]=t[C],[L,Y]=t[C+1],k=(w-Y)/(L-O),z=Math.hypot(1,k),j=(W,te)=>[W/z,k/z,te/z],K=[e*w,O,S*w,...j(e,S)],fe=[D*w,O,b*w,...j(D,b)],ee=[e*Y,L,S*Y,...j(e,S)],re=[D*Y,L,b*Y,...j(D,b)];c.push(K,re,fe,K,ee,re)}const[N,U]=t[0],[v,h]=t[t.length-1];c.push([0,N,0,0,-1,0],[D*U,N,b*U,0,-1,0],[e*U,N,S*U,0,-1,0]),h>0&&c.push([0,v,0,0,1,0],[e*h,v,S*h,0,1,0],[D*h,v,b*h,0,1,0])}return mt(c)},an={cube:rn(),cylinder:ze([[-.5,.47],[-.47,.5],[.47,.5],[.5,.47]]),cone:ze([[-.5,.5],[.5,0]]),mixerDrum:ze([[-.5,.18],[-.43,.2],[-.2,.43],[-.17,.48],[-.1,.48],[-.07,.46],[.2,.46],[.23,.49],[.3,.49],[.34,.44],[.5,.28]])},sn=ue(`#version 300 es
  in vec3 position;
  in vec3 normal;
  in vec4 instanceColumn0;
  in vec4 instanceColumn1;
  in vec4 instanceColumn2;
  in vec4 instanceColumn3;
  in float instanceAlbedo;

  uniform mat4 viewProjection;

  out vec3 worldNormal;
  out vec3 worldPosition;
  out float albedo;

  void main() {
    mat4 model = mat4(instanceColumn0, instanceColumn1, instanceColumn2, instanceColumn3);
    vec4 world = model * vec4(position, 1.0);
    worldPosition = world.xyz;
    worldNormal = transpose(inverse(mat3(model))) * normal;
    albedo = instanceAlbedo;
    gl_Position = viewProjection * world;
  }
`),cn=ue(`#version 300 es
  precision highp float;

  const float PI = 3.141592653589793;

  in vec3 worldNormal;
  in vec3 worldPosition;
  in float albedo;

  uniform vec3 keyLightDirection;
  uniform float keyLightIntensity;
  uniform vec3 fillLightDirection;
  uniform float fillLightIntensity;
  uniform float ambientIntensity;
  uniform float environmentIntensity;
  uniform float roughness;
  uniform float metalness;
  uniform vec3 cameraPosition;

  out vec4 fragmentColor;

  float getDistribution(float normalDotHalf, float alpha) {
    float alphaSquared = alpha * alpha;
    float denominator = normalDotHalf * normalDotHalf * (alphaSquared - 1.0) + 1.0;
    return alphaSquared / (PI * denominator * denominator);
  }

  float getVisibility(float normalDotLight, float normalDotView, float alpha) {
    float alphaSquared = alpha * alpha;
    float viewTerm = normalDotLight *
      sqrt(normalDotView * normalDotView * (1.0 - alphaSquared) + alphaSquared);
    float lightTerm = normalDotView *
      sqrt(normalDotLight * normalDotLight * (1.0 - alphaSquared) + alphaSquared);
    return 0.5 / max(viewTerm + lightTerm, 0.00001);
  }

  vec3 getFresnel(vec3 reflectance, float viewDotHalf) {
    float fresnel = exp2((-5.55473 * viewDotHalf - 6.98316) * viewDotHalf);
    return reflectance * (1.0 - fresnel) + fresnel;
  }

  vec3 getDirectLight(
    vec3 surfaceNormal,
    vec3 viewDirection,
    vec3 lightDirection,
    float intensity,
    vec3 diffuseColor,
    vec3 specularColor,
    float alpha
  ) {
    float normalDotLight = clamp(dot(surfaceNormal, lightDirection), 0.0, 1.0);
    vec3 halfVector = normalize(lightDirection + viewDirection);
    float normalDotHalf = clamp(dot(surfaceNormal, halfVector), 0.0, 1.0);
    float normalDotView = clamp(dot(surfaceNormal, viewDirection), 0.0001, 1.0);
    float viewDotHalf = clamp(dot(viewDirection, halfVector), 0.0, 1.0);
    vec3 specular = getFresnel(specularColor, viewDotHalf) *
      getVisibility(normalDotLight, normalDotView, alpha) *
      getDistribution(normalDotHalf, alpha);
    return normalDotLight * intensity * (diffuseColor / PI + specular);
  }

  float getEnvironmentRadiance(vec3 direction) {
    return 0.42 + 0.38 * direction.y;
  }

  void main() {
    vec3 surfaceNormal = normalize(worldNormal);
    vec3 viewDirection = normalize(cameraPosition - worldPosition);
    vec3 baseColor = vec3(albedo);
    vec3 diffuseColor = baseColor * (1.0 - metalness);
    vec3 specularColor = mix(vec3(0.04), baseColor, metalness);
    float alpha = roughness * roughness;

    vec3 radiance =
      getDirectLight(surfaceNormal, viewDirection, keyLightDirection, keyLightIntensity, diffuseColor, specularColor, alpha) +
      getDirectLight(surfaceNormal, viewDirection, fillLightDirection, fillLightIntensity, diffuseColor, specularColor, alpha) +
      diffuseColor * ambientIntensity / PI;

    float normalDotView = clamp(dot(surfaceNormal, viewDirection), 0.0, 1.0);
    vec3 reflected = reflect(-viewDirection, surfaceNormal);
    radiance += environmentIntensity * (
      diffuseColor * getEnvironmentRadiance(surfaceNormal) +
      getFresnel(specularColor, normalDotView) *
        getEnvironmentRadiance(reflected) * (1.0 - roughness * 0.5)
    );

    fragmentColor = vec4(clamp(radiance, 0.0, 1.0), 1.0);
  }
`),ln=ue(`#version 300 es
  const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));

  void main() {
    gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
  }
`),dn=ue(`#version 300 es
  precision highp float;

  uniform sampler2D sceneTexture;
  uniform float sceneLod;
  uniform vec2 canvasSize;
  uniform float tileSize;
  uniform float power;
  uniform float width;
  uniform vec3 dashColor;
  uniform float dashScale;
  uniform float dashThreshold;
  uniform float time;
  uniform float waveAmount;
  uniform float waveSpeed;
  uniform float scatterAmount;
  uniform vec3 contentColumn;
  uniform float contentColumnOpacity;
  uniform float dashOpacity;

  out vec4 fragmentColor;

  float getCapsuleDistance(vec2 cellPosition, float radius, float thickness) {
    vec2 segmentStart = vec2(0.5 - radius, 0.5);
    vec2 segment = vec2(2.0 * radius, 0.0);
    vec2 offset = cellPosition - segmentStart;
    float projection = clamp(
      dot(offset, segment) / max(dot(segment, segment), 0.000001),
      0.0,
      1.0
    );
    return length(offset - segment * projection) - thickness * radius;
  }

  float hash(vec2 value) {
    return fract(sin(dot(value, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 effectPosition = gl_FragCoord.xy;
    float row = floor(effectPosition.y / tileSize);
    effectPosition.x += waveAmount * sin(time * waveSpeed + row * 0.5) * tileSize;

    vec2 cellIndex = floor(effectPosition / tileSize);
    vec2 cellPosition = fract(effectPosition / tileSize);
    vec2 cellCenter = (cellIndex + 0.5) * tileSize;
    vec2 scatterOffset =
      (vec2(hash(cellIndex), hash(cellIndex + 17.0)) - 0.5) * scatterAmount * 6.0;
    vec2 sampleCell = cellIndex + floor(scatterOffset + 0.5);
    vec4 sceneSample = textureLod(
      sceneTexture,
      clamp((sampleCell + 0.5) * tileSize / canvasSize, 0.0, 1.0),
      sceneLod
    );

    float columnDistance = abs(cellCenter.x - contentColumn.x) - contentColumn.y;
    float outsideColumn =
      smoothstep(-contentColumn.z, contentColumn.z, columnDistance);
    float belowContent =
      1.0 - smoothstep(canvasSize.y * 0.12, canvasSize.y * 0.24, cellCenter.y);

    float tone = (sceneSample.r + sceneSample.g + sceneSample.b) / 3.0;
    float toneLevel = clamp(tone + power * 0.2357, 0.0, 1.0);
    float radius =
      max(toneLevel - dashThreshold, 0.0) / (1.0 - dashThreshold) * dashScale;
    float signedDistance = getCapsuleDistance(cellPosition, radius, width);
    float edge = 0.5 * fwidth(signedDistance);
    float alpha =
      (1.0 - smoothstep(-edge, edge, signedDistance)) * step(0.0001, radius);
    alpha *= mix(contentColumnOpacity, 1.0, max(outsideColumn, belowContent));
    alpha *= dashOpacity;

    fragmentColor = vec4(dashColor * alpha, alpha);
  }
`),Ue={sceneVertex:sn,sceneFragment:cn,fullScreenVertex:ln,halftoneFragment:dn},un=["cube","cylinder","cone","mixerDrum"],fn={cube:1024,cylinder:256,cone:16,mixerDrum:4},mn=2,hn=9e6,En=768,st=32*Math.PI/180,ct=12,lt=44,_n=70,qe=[-.9045,-.3015,.3015],gn=.35,Rn=.06,Tn=/swiftshader|llvmpipe|software|basic render driver/i,dt=(t,c,f)=>{const _=t.createProgram(),r=t.createShader(t.VERTEX_SHADER),e=t.createShader(t.FRAGMENT_SHADER);return!R(_)||!R(r)||!R(e)?null:(t.shaderSource(r,c),t.compileShader(r),t.shaderSource(e,f),t.compileShader(e),t.attachShader(_,r),t.attachShader(_,e),t.linkProgram(_),t.deleteShader(r),t.deleteShader(e),_)},Sn=(t,c)=>{t.deleteProgram(c.sceneProgram),t.deleteProgram(c.halftoneProgram),Object.values(c.meshes).forEach(({vertexArray:f,vertexBuffer:_,instanceBuffer:r})=>{t.deleteVertexArray(f),t.deleteBuffer(_),t.deleteBuffer(r)}),t.deleteTexture(c.sceneTexture),t.deleteRenderbuffer(c.sceneDepthBuffer),t.deleteFramebuffer(c.sceneFramebuffer),t.deleteVertexArray(c.emptyVertexArray)},vn=({canvas:t,colors:c,settings:f,contentColumnWidth:_,prefersReducedMotion:r})=>{const e=t.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,premultipliedAlpha:!0,powerPreference:"low-power"});if(!R(e))return null;const S=e.getExtension(ue("KHR_parallel_shader_compile")),D=e.getExtension(ue("WEBGL_debug_renderer_info")),b=r||R(D)&&Tn.test(e.getParameter(D.UNMASKED_RENDERER_WEBGL)),N=o=>({data:new Float32Array(fn[o]*17),count:0}),U={cube:N("cube"),cylinder:N("cylinder"),cone:N("cone"),mixerDrum:N("mixerDrum")};let v=null,h=c,C=0,O=0,w=1,L=1,Y=1;const k=it(),z=it({transitionSecondsPerStep:2.2,easing:o=>o});let j=!1,K=null,fe=0,ee=null,re=!1,W=null,te=null;const me=()=>{const o=dt(e,Ue.sceneVertex,Ue.sceneFragment),m=dt(e,Ue.fullScreenVertex,Ue.halftoneFragment);return!R(o)||!R(m)?(e.deleteProgram(o),e.deleteProgram(m),null):{sceneProgram:o,halftoneProgram:m}},ae=o=>!R(S)||e.getProgramParameter(o,S.COMPLETION_STATUS_KHR),Re=({sceneProgram:o,halftoneProgram:m})=>{const g=e.createTexture(),M=e.createRenderbuffer(),A=e.createFramebuffer(),s=e.createVertexArray();if(!e.getProgramParameter(o,e.LINK_STATUS)||!e.getProgramParameter(m,e.LINK_STATUS)||!R(g)||!R(M)||!R(A)||!R(s))return null;const T=e.getAttribLocation(o,"position"),I=e.getAttribLocation(o,"normal"),p=[0,1,2,3].map(X=>e.getAttribLocation(o,`instanceColumn${X}`)),d=e.getAttribLocation(o,"instanceAlbedo"),u=68,x=X=>{const q=an[X],J=e.createVertexArray(),ve=e.createBuffer(),H=e.createBuffer();return!R(J)||!R(ve)||!R(H)?null:(e.bindVertexArray(J),e.bindBuffer(e.ARRAY_BUFFER,ve),e.bufferData(e.ARRAY_BUFFER,q,e.STATIC_DRAW),e.enableVertexAttribArray(T),e.vertexAttribPointer(T,3,e.FLOAT,!1,24,0),e.enableVertexAttribArray(I),e.vertexAttribPointer(I,3,e.FLOAT,!1,24,12),e.bindBuffer(e.ARRAY_BUFFER,H),e.bufferData(e.ARRAY_BUFFER,U[X].data.byteLength,e.DYNAMIC_DRAW),p.forEach((le,Ae)=>{e.enableVertexAttribArray(le),e.vertexAttribPointer(le,4,e.FLOAT,!1,u,Ae*16),e.vertexAttribDivisor(le,1)}),e.enableVertexAttribArray(d),e.vertexAttribPointer(d,1,e.FLOAT,!1,u,64),e.vertexAttribDivisor(d,1),{vertexArray:J,vertexBuffer:ve,instanceBuffer:H,vertexCount:q.length/6})},P=x("cube"),F=x("cylinder"),y=x("cone"),V=x("mixerDrum");if(e.bindVertexArray(null),!R(P)||!R(F)||!R(y)||!R(V))return null;const B=X=>{const q=new Map;return J=>(q.has(J)||q.set(J,e.getUniformLocation(X,J)),q.get(J)??null)};return{sceneProgram:o,halftoneProgram:m,sceneUniform:B(o),halftoneUniform:B(m),meshes:{cube:P,cylinder:F,cone:y,mixerDrum:V},sceneTexture:g,sceneDepthBuffer:M,sceneFramebuffer:A,emptyVertexArray:s}},Z=()=>{if(te=null,re||!R(W)||e.isContextLost())return;if(!ae(W.sceneProgram)||!ae(W.halftoneProgram)){te=requestAnimationFrame(Z);return}const o=W;if(W=null,v=Re(o),!R(v)){e.deleteProgram(o.sceneProgram),e.deleteProgram(o.halftoneProgram);return}De(),n()},De=()=>{R(v)&&(e.bindTexture(e.TEXTURE_2D,v.sceneTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,L,Y,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindRenderbuffer(e.RENDERBUFFER,v.sceneDepthBuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT24,L,Y),e.bindFramebuffer(e.FRAMEBUFFER,v.sceneFramebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,v.sceneTexture,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,v.sceneDepthBuffer),e.bindFramebuffer(e.FRAMEBUFFER,null))},Ce=()=>{const o=Math.tan(st/2)*ct,m=o*(C/Math.max(O,1));return{halfWidth:m,halfHeight:o,contentHalfWidth:(_/2+lt)/Math.max(C,1)*2*m,groundY:-o}},Te=()=>{if(!R(v)||C<1||O<1||!j)return;const o=k.getFinaleBump(),m=Ce();en({instances:U,layout:m,construction:k.getConstruction(),truckConstruction:z.getConstruction(),craneMotion:k.getMotion()});const g=[0,m.groundY,ct],M=Nt(Ot(st,C/O,.1,60,m.groundY/m.halfHeight),Lt(g,[0,m.groundY,0])),A=f.keyLightAngleDegrees*Math.PI/180,s=f.keyLightHeight,T=Math.cos(A)*5,I=Math.sin(A)*5,p=Math.hypot(T,s,I);e.bindFramebuffer(e.FRAMEBUFFER,v.sceneFramebuffer),e.viewport(0,0,L,Y),e.clearColor(0,0,0,0),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.disable(e.BLEND),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);const{sceneUniform:d,halftoneUniform:u}=v;e.useProgram(v.sceneProgram),e.uniformMatrix4fv(d("viewProjection"),!1,M),e.uniform3f(d("keyLightDirection"),T/p,s/p,I/p),e.uniform1f(d("keyLightIntensity"),f.keyLightIntensity),e.uniform3f(d("fillLightDirection"),qe[0],qe[1],qe[2]),e.uniform1f(d("fillLightIntensity"),f.fillLightIntensity),e.uniform1f(d("ambientIntensity"),f.ambientIntensity),e.uniform1f(d("environmentIntensity"),f.environmentIntensity),e.uniform1f(d("roughness"),f.materialRoughness),e.uniform1f(d("metalness"),f.materialMetalness),e.uniform3f(d("cameraPosition"),g[0],g[1],g[2]);for(const P of un){const F=U[P];if(F.count===0)continue;const y=v.meshes[P];e.bindVertexArray(y.vertexArray),e.bindBuffer(e.ARRAY_BUFFER,y.instanceBuffer),e.bufferSubData(e.ARRAY_BUFFER,0,F.data,0,F.count*17),e.drawArraysInstanced(e.TRIANGLES,0,y.vertexCount,F.count)}e.bindVertexArray(null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,t.width,t.height),e.disable(e.DEPTH_TEST),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.bindTexture(e.TEXTURE_2D,v.sceneTexture),e.generateMipmap(e.TEXTURE_2D),e.useProgram(v.halftoneProgram);const x=f.dashPitch*Math.min(1,O/En)*w;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,v.sceneTexture),e.uniform1i(u("sceneTexture"),0),e.uniform1f(u("sceneLod"),Math.log2(Math.max(x/w/2*(L/C),1))),e.uniform2f(u("canvasSize"),t.width,t.height),e.uniform1f(u("tileSize"),x),e.uniform1f(u("power"),f.halftonePower),e.uniform1f(u("width"),f.dashWidth),e.uniform1f(u("dashScale"),f.dashScale),e.uniform1f(u("dashThreshold"),f.dashThreshold),e.uniform1f(u("dashOpacity"),f.dashOpacity),e.uniform3f(u("dashColor"),h.dashColor[0],h.dashColor[1],h.dashColor[2]),e.uniform1f(u("time"),fe),e.uniform1f(u("waveAmount"),b?0:gn*o),e.uniform1f(u("waveSpeed"),1),e.uniform1f(u("scatterAmount"),Rn*o),e.uniform3f(u("contentColumn"),t.width/2,(_/2+lt/2)*w,_n*w),e.uniform1f(u("contentColumnOpacity"),f.contentColumnOpacity),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(v.emptyVertexArray),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null)},Se=o=>{if(K=null,re||!R(v)||C<1||O<1){ee=null;return}const m=R(ee)?Math.min((o-ee)/1e3,.1):0;fe+=m,k.advance(m),z.advance(m),Te(),k.isTransitioning()||z.isTransitioning()?(ee=o,K=requestAnimationFrame(Se)):ee=null},n=()=>{if(b){Te();return}R(K)||(K=requestAnimationFrame(Se))},i=()=>{C=t.clientWidth,O=t.clientHeight,w=Math.min(Math.max(1,window.devicePixelRatio||1),mn,Math.sqrt(hn/Math.max(C*O,1)));const o=Math.min(1,w);t.width=Math.max(1,Math.round(C*w)),t.height=Math.max(1,Math.round(O*w)),L=Math.max(1,Math.round(C*o)),Y=Math.max(1,Math.round(O*o)),De(),Te()},l=o=>{o.preventDefault(),v=null,W=null},E=()=>{W=me(),Z()};return W=me(),R(W)?(t.addEventListener("webglcontextlost",l),t.addEventListener("webglcontextrestored",E),i(),Z(),{setStage:({stageIndex:o})=>{b?(k.jumpToStageIndex(o),z.jumpToStageIndex(o)):(k.setTargetStageIndex(o),j?z.setTargetStageIndex(o):z.jumpToStageIndex(o)),j=!0,n()},setColors:o=>{h=o,n()},resize:i,destroy:()=>{re=!0,R(K)&&cancelAnimationFrame(K),R(te)&&cancelAnimationFrame(te),t.removeEventListener("webglcontextlost",l),t.removeEventListener("webglcontextrestored",E),R(W)&&(e.deleteProgram(W.sceneProgram),e.deleteProgram(W.halftoneProgram),W=null),R(v)&&(Sn(e,v),v=null)}}):null},An={dashPitch:6,dashWidth:.7,dashScale:.5,dashThreshold:.18,dashOpacity:1,halftonePower:.5,contentColumnOpacity:.45,keyLightAngleDegrees:40,keyLightHeight:2,keyLightIntensity:1.6,fillLightIntensity:.15,ambientIntensity:.08,environmentIntensity:.25,materialRoughness:.42,materialMetalness:.16},In=t=>{const c=document.createElement("canvas");c.width=1,c.height=1;const f=c.getContext("2d");if(!R(f))return null;f.fillStyle=t,f.fillRect(0,0,1,1);const[_,r,e]=f.getImageData(0,0,1,1).data;return[_/255,r/255,e/255]},ut=t=>{const c=In(getComputedStyle(t).color);return R(c)?{dashColor:c}:null},pn=({canvasRef:t,stageIndex:c,colorScheme:f,prefersReducedMotion:_})=>{const[r,e]=(0,be.useState)(null);return(0,be.useEffect)(()=>{const S=t.current;if(!R(S)||typeof WebGL2RenderingContext>"u")return;const D=ut(S);if(!R(D))return;const b=vn({canvas:S,colors:D,settings:An,contentColumnWidth:440,prefersReducedMotion:_});if(!R(b))return;const N=new ResizeObserver(()=>b.resize());return N.observe(S),e(b),()=>{N.disconnect(),b.destroy(),e(null)}},[t,_]),(0,be.useEffect)(()=>{r?.setStage({stageIndex:c})},[r,c]),(0,be.useEffect)(()=>{const S=t.current,D=R(S)?ut(S):null;R(D)&&r?.setColors(D)},[t,r,f]),null},bn=ft.indexOf(Ze.SYNC_EMAIL),Dn=4,Cn=({onboardingStatus:t,isLastOnboardingStep:c})=>{if(c)return{stageIndex:5};const f=R(t)?ft.indexOf(t):-1;return{stageIndex:Math.min(Math.max(f-bn,0),Dn)}},Mn=t=>t.currentUser?.onboardingStatus===Ze.PLAN_REQUIRED||xt(t)===Ze.COMPLETED,xn=Tt("canvas")({name:"StyledCanvas",class:"s6posnc",propsAsIs:!1}),kn=()=>{const t=(0,be.useRef)(null),c=he(It),f=he(At),_=he(pt),r=he(Ct).isLoadedOnce,e=he(bt),S=he(Dt),D=St(),b=vt(ue("(prefers-reduced-motion: reduce)"));if(!r||!e)return null;const{stageIndex:N}=Cn({onboardingStatus:c?.onboardingStatus,isLastOnboardingStep:Mn({currentUser:c,currentWorkspace:f,isBillingEnabled:_?.isBillingEnabled??!1,isBookCallRequired:Mt({isBookCallOnboardingStepEnabled:S,currentUser:c})})});return(0,Le.jsxs)(Le.Fragment,{children:[(0,Le.jsx)(xn,{ref:t,"aria-hidden":"true"}),(0,Le.jsx)(pn,{canvasRef:t,stageIndex:N,colorScheme:D,prefersReducedMotion:b})]})};export{kn as OnboardingConstructionSite};
