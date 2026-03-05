"use strict";

// https://stackoverflow.com/a/9899701/13854774
function docReady(fn: () => any) {
    // see if DOM is already available
    if (document.readyState === "complete") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

// https://stackoverflow.com/a/61511955/13854774

function getCUTable(): Element | null {
    const table = document.querySelector(".mw-checkuser-helper-table");
    const numRows = table?.querySelector("tbody")?.querySelectorAll("tr").length ?? 0;
    return numRows >= 2 ? table : null;
}

function waitForCUTable(): Promise<Element | null> {
    return new Promise(resolve => {
        const t = getCUTable();
        if (t) {
            return resolve(t);
        }

        const observer = new MutationObserver(_ => {
            const t = getCUTable();
            if (t) {
                observer.disconnect();
                resolve(t);
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function mkCplusArea(map: Map<string, string>): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("cplus-injected", "cplus-injected-top");
    const header = document.createElement("div");
    header.innerText = "C+";
    div.append(header);
    header.classList.add("cplus-injected", "cplus-injected-header");

    const textArea = document.createElement("textarea");

    const parse = () => {
        const val = textArea.value.trim();
        if (val === "") return new Set();
        if (val.startsWith("{{sock list|") && val.endsWith("}}")) {
            const list = val.substring("{{sock list|".length, val.length - "}}".length);
            document.getElementById("cplus-warning")?.remove();
            return new Set(list.split("|").map((s) => s.trim()).filter((s) => s !== ""))
        } else if (!document.getElementById("cplus-warning")) {
            const warn = document.createElement("span");
            warn.innerText = "C+ Warning: could not parse input sock list";
            warn.id = "cplus-warning";
            div.appendChild(warn)
        }
        return new Set();
    };

    div.append(textArea);
    div.classList.add("oo-ui-panelLayout-padded", "oo-ui-panelLayout-framed");
    textArea.classList.add("cplus-injected", "cplus-textarea");
    textArea.oninput = () => {
        const set = parse();
        map.forEach((clazz, username) => {
            const yes = set.has(username);
            document.querySelectorAll("." + clazz).forEach((elem) => {
                (<HTMLInputElement>elem).checked = yes;
            })
        })
    };

    map.forEach((clazz, username) => {
        document.querySelectorAll("." + clazz).forEach((elem) => {
            elem.addEventListener("change", () => {
                const checked = (<HTMLInputElement>elem).checked;
                const set = parse();
                if (checked && !set.has(username)) set.add(username);
                if (!checked) set.delete(username);
                textArea.value = `{{sock list|${[...set].join("|")}}}`;
                document.querySelectorAll("." + clazz).forEach((elem2) => {
                    (<HTMLInputElement>elem2).checked = checked;
                })
            })
        })
    })    

    const copybtn = document.createElement("button");
    copybtn.classList.add("cplus-injected", "cplus-copybtn");
    copybtn.innerText = "Copy socklist";
    copybtn.addEventListener("click", () => {
        textArea.select();
        window.navigator.clipboard.writeText(textArea.value);
    });
    div.append(copybtn);
    return div;
}

docReady(() => {
    const is_si = mw.config.get("wgPageName").startsWith("Special:SuggestedInvestigations");
    if (!is_si && mw.config.get("wgPageName") !== "Special:CheckUser") return;

    mw.util.addCSS(`
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
    `)
    const promise: Promise<any> = is_si ? new Promise(f => f(0)) : waitForCUTable();
    promise.then(_ => {
        // TODO switch to Codex and Vue see https://en.wikipedia.org/wiki/User:EGardner_(WMF)/codex-hello-world.js
        const results = document.getElementById("checkuserresults");
        if (!results && !is_si) {
            console.error("cplus: can't get cu results!");
            return;
        }

        const inject = is_si ? document.querySelector(".ext-checkuser-suggestedinvestigations-table")?.parentElement?.parentElement : results?.previousElementSibling;

        if (!inject) {
            console.info("cplus: can't find place to inject, bailing");
            return;
        }

        if (!is_si && !inject.classList.contains("mw-pager-navigation-bar") && !inject.classList.contains("mw-checkbox-toggle-controls")) {
            console.info("cplus: not a 'get actions' or 'get users' page, bailing");
            return;
        }

        const map: Map<string, string> = new Map();
        let counter = 0;

        const getClass = (elem: Element) => {
            const username = elem.querySelector("bdi")?.innerText;

            if (username === undefined) return undefined;
            if (mw.util.isIPAddress(username)) return undefined;
            if (elem.classList.contains("mw-tempuserlink")) return undefined;

            let clazz = map.get(username);

            if (!clazz) {
                clazz = `cplus-checkbox-${counter++}`;
                map.set(username, clazz);
            }

            return clazz;
        };

        const addCheckbox = (elem: Element) => {
            const clazz = getClass(elem);
            if (!clazz) return;
            const uwu = document.createElement("input");
            uwu.type = "checkbox"
            uwu.value = elem.firstElementChild?.innerHTML ?? "";
            uwu.classList.add("cplus-injected", "cplus-checkbox", clazz)
            elem.before(uwu);
        }

        const getuserslist = document.querySelector(".mw-checkuser-get-users-results");
        const users = document.querySelectorAll(".mw-checkuser-helper-table tbody tr td a.mw-userlink");
        users.forEach(addCheckbox);

        if (getuserslist) {
            // "get users"
            const users2 = document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink");
            users2.forEach((elem: Element) => {
                const clazz = getClass(elem);
                if (!clazz) return;
                const input = elem.parentElement?.parentElement?.querySelector("input");
                if (!input) return;
                input.classList.add("cplus-checkbox", clazz);
            });
        } else if (is_si) {
            // SuggestedInvestigations
            const users2 = document.querySelectorAll(".ext-checkuser-suggestedinvestigations-table tbody tr td ul li a.mw-userlink");
            users2.forEach(addCheckbox);
        } else {
            // "get actions" handling
            const users2 = document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink");
            users2.forEach(addCheckbox);
        }

        const checkboxes = Array.from(document.querySelectorAll(".cplus-checkbox"));
        let lastchecked: [Element, number] | null = null;
        checkboxes.forEach((elem: Element, idx: number) => {
            elem.addEventListener('click', (e) => {
                const ev = <KeyboardEvent>e;
                if (lastchecked !== null && ev.shiftKey) {
                    const lastcheckedelem = <HTMLInputElement>lastchecked[0];
                    const a = lastchecked[1];
                    const b = idx;
                    checkboxes.slice(Math.min(a,b), Math.max(a,b) + 1).forEach(box => {
                        (<HTMLInputElement> box).checked = lastcheckedelem.checked;
                        box.dispatchEvent(new Event('change'))
                    })
                }
                lastchecked = [elem, idx];
            })
        })

        const div = mkCplusArea(map);

        inject.before(div);
    })
});

