"use strict";
/// <reference path="lsr.d.ts" />
let remove_char_timeout = null;
function deleteCharacterView(pnjElement) {
    var _a;
    if (remove_char_ok == false) {
        remove_char_ok = true;
        document.querySelectorAll(".character .controls .delete").forEach(btn => {
            btn.classList.replace("disabled", "enabled");
        });
        remove_char_timeout = setTimeout(() => {
            remove_char_ok = false;
            document.querySelectorAll(".character .controls .delete").forEach(btn => {
                btn.classList.replace("enabled", "disabled");
            });
        }, 5000);
    }
    else {
        if (remove_char_timeout != null) {
            clearTimeout(remove_char_timeout);
        }
        remove_char_timeout = setTimeout(() => {
            remove_char_ok = false;
            document.querySelectorAll(".character .controls .delete").forEach(btn => {
                btn.classList.replace("enabled", "disabled");
            });
        }, 5000);
        (_a = pnjElement.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(pnjElement);
        console.log("remove char", pnjElement.dataset.id);
        document.querySelectorAll('.char-select button[data-cid="' + pnjElement.dataset.id + '"]').forEach(b => b.classList.remove("disabled")); // using forEach as ifPresent
    }
}
let remove_roll_timeout = null;
function deleteRoll(rollElement) {
    if (remove_roll_ok == false) {
        remove_roll_ok = true;
        document.querySelectorAll(".delete-roll").forEach(btn => {
            btn.classList.replace("disabled", "enabled");
        });
        remove_roll_timeout = setTimeout(() => {
            remove_roll_ok = false;
            document.querySelectorAll(".delete-roll").forEach(btn => {
                btn.classList.replace("enabled", "disabled");
            });
        }, 5000);
    }
    else {
        if (remove_roll_timeout != null) {
            clearTimeout(remove_roll_timeout);
        }
        remove_roll_timeout = setTimeout(() => {
            remove_roll_ok = false;
            document.querySelectorAll(".delete-roll").forEach(btn => {
                btn.classList.replace("enabled", "disabled");
            });
        }, 5000);
        console.log("remove roll", rollElement.dataset.rollid);
        lsrApi.deleteRoll(parseInt(rollElement.dataset.rollid));
        rollElement.remove();
    }
}
// TODO should probably have an object representing the actual action, for example we should not take the fact that power was used from the character but from the action
function applyActionCosts(char, action) {
    if (action == 'magic') {
        char.debt.current += 1;
    }
    if (action == 'arcana' || action == "arcana-essence" || action == "arcana-spirit") {
        char.arcana.current -= 1;
    }
    if (char.focus.enabled) {
        char.focus.current -= 1;
    }
    if (char.power.enabled) {
        char.power.current -= 1;
        char.debt.current += 1;
    }
}
/** Asks the server to make a roll for a given character, the character is local which means stats are completly decided on the client side */
function rollForLocalCharacterAndApplyCosts(c, action, parentRollId, bonuses = {}) {
    let stat = OneStatRollAction.actionToStatValue(c, action);
    const rollAction = new OneStatRollAction(c, action, parentRollId, bonuses);
    lsrApi.rollForLocalCharacter(c, rollAction).then(updateChat);
    applyActionCosts(c, action);
}
/** Get the last number in a string with separators, for example getIndexInString("a-b-c-3") would return 3 */
function getIndexInString(str, separator = "-", byDefault = null) {
    const parts = str.split(separator);
    if (parts.length == 1) {
        return byDefault;
    }
    const last = parts.pop();
    if (last === undefined) {
        return byDefault;
    }
    const i = parseInt(last);
    if (isNaN(i)) {
        return byDefault;
    }
    return i;
}
function incrementString(str, separator = "-") {
    const i = getIndexInString(str, separator);
    if (i === null) {
        return str + separator + "1";
    }
    const parts = str.split(separator);
    const last = parts.pop();
    return parts.join(separator) + separator + (i + 1);
}
function addTempCharacter(new_pnj_name, new_pnj_chair, new_pnj_esprit, new_pnj_essence, new_pnj_pv_max, new_pnj_pf_max, new_pnj_pp_max) {
    const new_pnj_dettes = Math.floor(Math.random() * Math.floor(5));
    const liste_pnj = document.querySelector('#liste_pnj');
    if (new_pnj_name == "") {
        new_pnj_name = "Name";
    }
    if (new_pnj_chair == "") {
        new_pnj_chair = "2";
    }
    if (new_pnj_esprit == "") {
        new_pnj_esprit = new_pnj_chair;
    }
    if (new_pnj_essence == "") {
        new_pnj_essence = new_pnj_chair;
    }
    if (new_pnj_pv_max == "") {
        new_pnj_pv_max = "" + parseInt(new_pnj_chair) * 2;
    }
    if (new_pnj_pf_max == "") {
        new_pnj_pf_max = new_pnj_esprit;
    }
    if (new_pnj_pp_max == "") {
        new_pnj_pp_max = new_pnj_essence;
    }
    const pnjElement = createCharacter(new_pnj_name);
    pnjElement.classList.add("npc");
    const c = LocalCharacterView.fromElement(pnjElement);
    c.flesh.current = parseInt(new_pnj_chair);
    c.spirit.current = parseInt(new_pnj_esprit);
    c.essence.current = parseInt(new_pnj_essence);
    c.hp.current = parseInt(new_pnj_pv_max);
    c.hp.max = parseInt(new_pnj_pv_max);
    c.focus.current = parseInt(new_pnj_pf_max);
    c.focus.max = parseInt(new_pnj_pf_max);
    c.power.current = parseInt(new_pnj_pp_max);
    c.power.max = parseInt(new_pnj_pp_max);
    c.debt.current = new_pnj_dettes;
    c.hidden.enabled = true;
    liste_pnj.appendChild(pnjElement);
    document.querySelector("#new_pnj_name").value = incrementString(new_pnj_name);
}
function clearAndUpdateChat() {
    lsrApi.clearChat().then(() => updateChat());
}
function duplicateInDb(characterElement) {
    let character = LocalCharacterView.fromElement(characterElement);
    lsrApi.createCharacter(character)
        .then(cdb => {
        const container = document.createElement("div");
        container.innerHTML = '<button data-cid="' + cdb.id + '" onclick="autoAddChar(this);">' + cdb.name + '</button>';
        let categoryElement = document.querySelector(".char-select .category-" + cdb.category);
        if (categoryElement == null) {
            const charSelect = document.querySelector(".char-select");
            const container = document.createElement("div");
            container.innerHTML = '<div class="category-' + character.category.current + '"><summary class="label">' + character.category.current + '</summary><div class="content"></div></div>';
            categoryElement = container.firstElementChild;
            charSelect.appendChild(categoryElement);
        }
        categoryElement.querySelector(".content").appendChild(container.firstElementChild);
    });
}
function duplicateAsTempCharacter(characterElement) {
    const liste_pnj = document.querySelector('#liste_pnj');
    const offlineChar = characterElement.cloneNode(true);
    offlineChar.classList.add("npc");
    delete offlineChar.dataset.id;
    // find correct number to suffix the character, aka the highest suffix already present on the page
    const ids = Array.from(document.querySelectorAll(".character .name .current")).map(e => getIndexInString(e.innerHTML, "-", 0)).sort();
    if (ids.length !== 0) {
        let c = LocalCharacterView.fromElement(offlineChar);
        c.name.current = c.name.current + "-" + (ids[ids.length - 1] + 1);
    }
    liste_pnj.appendChild(offlineChar);
}
function autoAddChar(source) {
    if (source.classList.contains("disabled")) {
        const charElem = document.querySelector('.character[data-id="' + source.dataset.cid + '"]');
        console.log(charElem);
        charElem === null || charElem === void 0 ? void 0 : charElem.scrollIntoView();
    }
    else {
        const pcList = document.querySelector("#liste_pj");
        // TODO this cast should be removed, this function is too top level to have it
        pcList.appendChild(createCharacterByCid(source.dataset.cid));
        updateCharactersOnPage();
        source.classList.add("disabled");
    }
}
function autoFilter(source) {
    document.querySelectorAll(".char-select .content button").forEach(b => {
        if (b.innerHTML.toUpperCase().indexOf(source.value.toUpperCase()) === -1) {
            b.style.display = "none";
        }
        else {
            b.style.display = "initial";
        }
    });
}
function indexOfOption(select, option) {
    for (const o of select) {
        if (o.value == option) {
            return o.index;
        }
    }
    return false;
}
/** Will even add an item to the <select> if there is none */
function setAllCharacterSelectorTo(char) {
    char.element.querySelector("input.activeCharacter").checked = true;
    ;
    document.querySelectorAll(".active-character-selector").forEach(select => {
        const optionIndex = indexOfOption(select, char.name.current);
        if (optionIndex === false) {
            const option = document.createElement("option");
            option.innerHTML = char.name.current;
            option.value = char.name.current;
            if (char.id != undefined) {
                option.dataset.cid = "" + char.id;
            }
            select.add(option); // add at last position
            select.selectedIndex = select.length - 1; // put select on last item (that we just added)
        }
        else {
            select.selectedIndex = optionIndex;
        }
    });
}
function onChangeActiveCharacterFromSheet(inputElement) {
    const charElem = inputElement.closest(".character");
    const char = LocalCharacterView.fromElement(charElem);
    console.log("change active char", char.name.current);
    setAllCharacterSelectorTo(char);
}
function findCharacterById(id) {
    return document.querySelector('.character[data-id="' + id + '"]');
}
function findCharacterByName(name) {
    const names = document.querySelectorAll('.character .name .current');
    for (const n of names) {
        if (n.innerHTML == name) {
            return n.closest(".character");
        }
    }
    return null;
}
function onChangeActiveCharacterFromRoll(select) {
    const cid = select.selectedOptions[0].dataset.cid;
    const name = select.selectedOptions[0].value;
    let charElem = null;
    if (cid != undefined) {
        // if we don't have a cid it means we have a local character
        charElem = findCharacterById(parseInt(cid));
    }
    if (charElem == null) {
        charElem = findCharacterByName(name);
    }
    if (charElem == null) {
        throw new Error("Can't find character with id " + cid + " and name " + name);
    }
    const char = LocalCharacterView.fromElement(charElem);
    setAllCharacterSelectorTo(char);
}
