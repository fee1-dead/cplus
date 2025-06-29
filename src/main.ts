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

docReady(() => {
    if (mw.config.get("wgPageName") !== "Special:CheckUser") return;
    // TODO switch to Codex and Vue see https://en.wikipedia.org/wiki/User:EGardner_(WMF)/codex-hello-world.js
    const results = document.getElementById("checkuserresults");
    if (!results) {
        console.error("cplus: can't cu results!");
        return;
    }

    mw.util.addCSS(`
        .cplus-copybtn {
            margin: 5px 0 5px 0;
        }

        .cplus-checkbox {
            margin-right: 4px;
        }
    `)

    const users = document.querySelectorAll(".mw-checkuser-helper-table tbody tr td a.mw-userlink");
    const users2 = document.querySelectorAll(".mw-checkuser-user-link a.mw-userlink");

    const map: Map<string, string> = new Map();
    let counter = 0;
    
    const addCheckbox = (elem: Element) => {
        const username = elem.querySelector("bdi")?.innerText;

        if (username === undefined) return;
        if (mw.util.isIPAddress(username)) return;

        let clazz = map.get(username);

        if (!clazz) {
            clazz = `cplus-checkbox-${counter++}`;
            map.set(username, clazz);
        }
        
        const uwu = document.createElement("input");
        uwu.type = "checkbox"
        uwu.value = elem.firstElementChild?.innerHTML ?? "";
        uwu.classList.add("cplus-injected", "cplus-checkbox", clazz)
        elem.before(uwu);
    }

    users.forEach(addCheckbox)
    users2.forEach(addCheckbox)

    const div = document.createElement("div");
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
            return new Set(list.split("|").map((s) => s.trim()))
        } else if (!document.getElementById("cplus-warning")) {
            const warn = document.createElement("span");
            warn.innerText = "C+ Warning: could not parse input sock list";
            warn.id = "cplus-warning";
            div.appendChild(warn)
        }
        return new Set();
    };
    
    div.append(textArea);
    div.classList.add("cplus-injected", "cplus-injected-top");
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

    const inject = results.previousElementSibling ?? results;

    const copybtn = document.createElement("button");
    copybtn.classList.add("cplus-injected", "cplus-copybtn");
    copybtn.innerText = "Copy socklist";
    copybtn.addEventListener("click", () => {
        textArea.select();
        window.navigator.clipboard.writeText(textArea.value);
    });
    div.append(copybtn);
    inject.before(div);
})

