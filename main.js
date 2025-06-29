// {{Wikipedia:USync |repo=https://github.com/fee1-dead/cplus |ref=refs/heads/production |path=main.js}}
// A helper for Special:CheckUser.
function F(N){if(document.readyState==="complete")setTimeout(N,1);else document.addEventListener("DOMContentLoaded",N)}F(()=>{if(mw.config.get("wgPageName")!=="Special:CheckUser")return;let N=document.getElementById("checkuserresults");if(!N){console.error("cplus: can't get cu results!");return}let S=N.previousElementSibling;if(!S||!S.classList.contains("mw-pager-navigation-bar")){console.info("cplus: not a 'get actions' page, bailing");return}mw.util.addCSS(`
        .cplus-injected-header {
            padding: 5px 0 5px 0;
            font-size: 1.14285714em;
            font-weight: 700;
        }

        .cplus-copybtn {
            margin: 5px 0 5px 0;
        }

        .cplus-checkbox {
            margin-right: 4px;
        }
    `);let $=document.querySelectorAll(".mw-checkuser-helper-table tbody tr td a.mw-userlink"),g=document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink"),P=new Map,D=0,Y=(B)=>{let q=B.querySelector("bdi")?.innerText;if(q===void 0)return;if(mw.util.isIPAddress(q))return;let H=P.get(q);if(!H)H=`cplus-checkbox-${D++}`,P.set(q,H);let I=document.createElement("input");I.type="checkbox",I.value=B.firstElementChild?.innerHTML??"",I.classList.add("cplus-injected","cplus-checkbox",H),B.before(I)};$.forEach(Y),g.forEach(Y);let J=document.createElement("div");J.classList.add("cplus-injected","cplus-injected-top");let X=document.createElement("div");X.innerText="C+",J.append(X),X.classList.add("cplus-injected","cplus-injected-header");let K=document.createElement("textarea"),Z=()=>{let B=K.value.trim();if(B==="")return new Set;if(B.startsWith("{{sock list|")&&B.endsWith("}}")){let q=B.substring(12,B.length-2);return document.getElementById("cplus-warning")?.remove(),new Set(q.split("|").map((H)=>H.trim()).filter((H)=>H!==""))}else if(!document.getElementById("cplus-warning")){let q=document.createElement("span");q.innerText="C+ Warning: could not parse input sock list",q.id="cplus-warning",J.appendChild(q)}return new Set};J.append(K),J.classList.add("oo-ui-panelLayout-padded","oo-ui-panelLayout-framed"),K.classList.add("cplus-injected","cplus-textarea"),K.oninput=()=>{let B=Z();P.forEach((q,H)=>{let I=B.has(H);document.querySelectorAll("."+q).forEach((L)=>{L.checked=I})})},P.forEach((B,q)=>{document.querySelectorAll("."+B).forEach((H)=>{H.addEventListener("change",()=>{let I=H.checked,L=Z();if(I&&!L.has(q))L.add(q);if(!I)L.delete(q);K.value=`{{sock list|${[...L].join("|")}}}`,document.querySelectorAll("."+B).forEach((E)=>{E.checked=I})})})});let Q=document.createElement("button");Q.classList.add("cplus-injected","cplus-copybtn"),Q.innerText="Copy socklist",Q.addEventListener("click",()=>{K.select(),window.navigator.clipboard.writeText(K.value)}),J.append(Q),S.before(J)});
