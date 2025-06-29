// {{Wikipedia:USync |repo=https://github.com/fee1-dead/cplus |ref=refs/heads/production |path=main.js}}
// A helper for Special:CheckUser.
function F(L){if(document.readyState==="complete")setTimeout(L,1);else document.addEventListener("DOMContentLoaded",L)}F(()=>{if(mw.config.get("wgPageName")!=="Special:CheckUser")return;let L=document.getElementById("checkuserresults");if(!L){console.error("cplus: can't cu results!");return}mw.util.addCSS(`
        .cplus-injected-header {
            padding: 5px 0 5px 0;
            font-size: 1.14285714em;
            font-weioght: 700;
        }

        .cplus-copybtn {
            margin: 5px 0 5px 0;
        }

        .cplus-checkbox {
            margin-right: 4px;
        }
    `);let Z=document.querySelectorAll(".mw-checkuser-helper-table tbody tr td a.mw-userlink"),$=document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink"),P=new Map,g=0,X=(B)=>{let q=B.querySelector("bdi")?.innerText;if(q===void 0)return;if(mw.util.isIPAddress(q))return;let H=P.get(q);if(!H)H=`cplus-checkbox-${g++}`,P.set(q,H);let I=document.createElement("input");I.type="checkbox",I.value=B.firstElementChild?.innerHTML??"",I.classList.add("cplus-injected","cplus-checkbox",H),B.before(I)};Z.forEach(X),$.forEach(X);let J=document.createElement("div");J.classList.add("cplus-injected","cplus-injected-top");let S=document.createElement("div");S.innerText="C+",J.append(S),S.classList.add("cplus-injected","cplus-injected-header");let K=document.createElement("textarea"),Y=()=>{let B=K.value.trim();if(B==="")return new Set;if(B.startsWith("{{sock list|")&&B.endsWith("}}")){let q=B.substring(12,B.length-2);return document.getElementById("cplus-warning")?.remove(),new Set(q.split("|").map((H)=>H.trim()))}else if(!document.getElementById("cplus-warning")){let q=document.createElement("span");q.innerText="C+ Warning: could not parse input sock list",q.id="cplus-warning",J.appendChild(q)}return new Set};J.append(K),J.classList.add("oo-ui-panelLayout-padded","oo-ui-panelLayout-framed"),K.classList.add("cplus-injected","cplus-textarea"),K.oninput=()=>{let B=Y();P.forEach((q,H)=>{let I=B.has(H);document.querySelectorAll("."+q).forEach((N)=>{N.checked=I})})},P.forEach((B,q)=>{document.querySelectorAll("."+B).forEach((H)=>{H.addEventListener("change",()=>{let I=H.checked,N=Y();if(I&&!N.has(q))N.add(q);if(!I)N.delete(q);K.value=`{{sock list|${[...N].join("|")}}}`,document.querySelectorAll("."+B).forEach((E)=>{E.checked=I})})})});let D=L.previousElementSibling??L,Q=document.createElement("button");Q.classList.add("cplus-injected","cplus-copybtn"),Q.innerText="Copy socklist",Q.addEventListener("click",()=>{K.select(),window.navigator.clipboard.writeText(K.value)}),J.append(Q),D.before(J)});
