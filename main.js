// {{Wikipedia:USync |repo=https://github.com/fee1-dead/cplus |ref=refs/heads/production |path=main.js}}
// A helper for Special:CheckUser.
function G(N){if(document.readyState==="complete")setTimeout(N,1);else document.addEventListener("DOMContentLoaded",N)}G(()=>{if(mw.config.get("wgPageName")!=="Special:CheckUser")return;let N=document.getElementById("checkuserresults");if(!N){console.error("cplus: can't get cu results!");return}let P=N.previousElementSibling;if(!P){console.info("cplus: can't find place to inject, bailing");return}if(!P.classList.contains("mw-pager-navigation-bar")&&!P.classList.contains("mw-checkbox-toggle-controls")){console.info("cplus: not a 'get actions' or 'get users' page, bailing");return}mw.util.addCSS(`
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
    `);let Q=new Map,D=0,Y=(H)=>{let q=H.querySelector("bdi")?.innerText;if(q===void 0)return;if(mw.util.isIPAddress(q))return;let B=Q.get(q);if(!B)B=`cplus-checkbox-${D++}`,Q.set(q,B);return B},Z=(H)=>{let q=Y(H);if(!q)return;let B=document.createElement("input");B.type="checkbox",B.value=H.firstElementChild?.innerHTML??"",B.classList.add("cplus-injected","cplus-checkbox",q),H.before(B)},E=document.querySelector(".mw-checkuser-get-users-results");if(document.querySelectorAll(".mw-checkuser-helper-table tbody tr td a.mw-userlink").forEach(Z),E)document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink").forEach((q)=>{let B=Y(q);if(!B)return;let I=q.parentElement?.parentElement?.querySelector("input");if(!I)return;I.classList.add("cplus-checkbox",B)});else document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink").forEach(Z);let J=document.createElement("div");J.classList.add("cplus-injected","cplus-injected-top");let X=document.createElement("div");X.innerText="C+",J.append(X),X.classList.add("cplus-injected","cplus-injected-header");let K=document.createElement("textarea"),$=()=>{let H=K.value.trim();if(H==="")return new Set;if(H.startsWith("{{sock list|")&&H.endsWith("}}")){let q=H.substring(12,H.length-2);return document.getElementById("cplus-warning")?.remove(),new Set(q.split("|").map((B)=>B.trim()).filter((B)=>B!==""))}else if(!document.getElementById("cplus-warning")){let q=document.createElement("span");q.innerText="C+ Warning: could not parse input sock list",q.id="cplus-warning",J.appendChild(q)}return new Set};J.append(K),J.classList.add("oo-ui-panelLayout-padded","oo-ui-panelLayout-framed"),K.classList.add("cplus-injected","cplus-textarea"),K.oninput=()=>{let H=$();Q.forEach((q,B)=>{let I=H.has(B);document.querySelectorAll("."+q).forEach((L)=>{L.checked=I})})},Q.forEach((H,q)=>{document.querySelectorAll("."+H).forEach((B)=>{B.addEventListener("change",()=>{let I=B.checked,L=$();if(I&&!L.has(q))L.add(q);if(!I)L.delete(q);K.value=`{{sock list|${[...L].join("|")}}}`,document.querySelectorAll("."+H).forEach((F)=>{F.checked=I})})})});let S=document.createElement("button");S.classList.add("cplus-injected","cplus-copybtn"),S.innerText="Copy socklist",S.addEventListener("click",()=>{K.select(),window.navigator.clipboard.writeText(K.value)}),J.append(S),P.before(J)});
