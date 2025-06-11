
$.when( $.ready ).then(function() {
    if (mw.config.get("wgPageName") !== "Special:CheckUser") {
        return;
    }

    const users = $(".mw-checkuser-helper-table")
        .children("tbody")
        .children("tr")
        .children("td")
        .children("a.mw-userlink");

    users.each((_, elem) => {
        const uwu = document.createElement("input");
        uwu.type = "checkbox"
        uwu.value = elem.firstElementChild?.innerHTML ?? "";
        uwu.classList += "cplus-users";
        elem.before(uwu);
    })

    let btn = $(".mw-checkuser-helper-copy-text-layout")
        .children("div")
        .children("div")
        .children("span")
        .children("span")
        .children("a.oo-ui-buttonElement-button");

    btn.each((_, elem) => {
        const socklist = document.createElement("button");

        socklist.innerText = "Copy socklist";
        socklist.addEventListener("click", () => {
            let list: String[] = [];
            $(".cplus-users").each((_, elem) => {
                let ele = <HTMLInputElement>elem;
                if (ele.checked) {
                    list.push(ele.value);
                }
            });
            const wow = "{{sock list|" + list.join("|") + "}}";
            window.navigator.clipboard.writeText(wow);
        });
        elem.after(socklist);
    })
})

