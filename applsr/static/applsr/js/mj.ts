type Stat = "pv" | "arcanes" | "dettes" | "pf" | "pp" | "ben" | "mal";

display_secret = true; // override value from lsr.js

function afficherPJ() {
    const liste_pj = document.querySelector<HTMLElement>('#liste_pj')!;
    liste_pj.childNodes.forEach(function(pcNode) {
        const pcElement = pcNode as HTMLElement;
        const name = pcElement.querySelector(".name")!.innerHTML;
        fetch('/lsr/getcar/' + name + createCidParameterString(pcElement, "?"))
            .then((response) => response.text())
            .then(json => {
                const obj = JSON.parse(json) as CharacterFromDatabase;
                pcElement.querySelector('.pj_pv')!.innerHTML = obj.point_de_vie.toString();
                pcElement.querySelector('.pj_pv_max')!.innerHTML = obj.point_de_vie_max.toString();
                pcElement.querySelector('.pj_pf')!.innerHTML = obj.point_de_focus.toString();
                pcElement.querySelector('.pj_pf_max')!.innerHTML = obj.point_de_focus_max.toString();
                pcElement.querySelector('.pj_pp')!.innerHTML = obj.point_de_pouvoir.toString();
                pcElement.querySelector('.pj_pp_max')!.innerHTML = obj.point_de_pouvoir_max.toString();
                pcElement.querySelector('.pj_dettes')!.innerHTML = obj.dettes.toString();
                pcElement.querySelector('.pj_arcanes')!.innerHTML = obj.arcanes.toString();
                pcElement.querySelector('.pj_arcanes_max')!.innerHTML = obj.arcanes_max.toString();
                pcElement.querySelector('.pj_fl')!.innerHTML = obj.fl;
                pcElement.querySelector('.pj_fu')!.innerHTML = obj.fu;
                pcElement.querySelector('.pj_fs')!.innerHTML = obj.fs;
            }).catch(function(e) {
                console.error("error", e);
            });
    });
}

let remove_char_timeout: null | number = null;
var remove_char_ok = false;

function deleteCharacter(pnjElement: HTMLElement) {
    if(remove_char_ok == false) {
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
        if(remove_char_timeout != null) {
            clearTimeout(remove_char_timeout);
        }
        remove_char_timeout = setTimeout(() => {
            remove_char_ok = false;
            document.querySelectorAll(".character .controls .delete").forEach(btn => {
                btn.classList.replace("enabled", "disabled");
            });
        }, 5000);
        pnjElement.parentElement?.removeChild(pnjElement);
        console.log("remove char", pnjElement.dataset.id);
        document.querySelectorAll<HTMLButtonElement>('.char-select button[data-cid="' + pnjElement.dataset.id + '"]').forEach(b => b.disabled = false); // using forEach as ifPresent
    }
}

function jetPNJ(c: LocalCharacterView, action: RollType, dc: boolean /** dés cachés */, parentRollId: string | null = null) {
    const opposition = parseInt(document.querySelector<HTMLInputElement>('#opposition')!.value);

    let stat: number = 0;
    if(action == "flesh") { stat = c.flesh.current; }
    else if(action == "spirit") { stat = c.spirit.current; }
    else if(action == "essence") { stat = c.essence.current; }
    else if(action == "magic") { stat = c.essence.current; }
    else if(action == "heal") { stat = c.essence.current; }
    else if(action == "arcana") { stat = 0; }
    else if(action == "arcana-essence") { stat = c.essence.current; }
    else if(action == "arcana-spirit") { stat = c.spirit.current; }
    else if(action == "death") { stat = 0; }
    else if(action == "empirical") { stat = 0; }

    if(document.querySelector<HTMLInputElement>('#opposition_checked')!.checked) {
        fetch('/mj/lancer_pnj/' + c.name.current + '/' + convertRollTypeToBackend(action) + '/' + stat + '/' + c.focus.enabled + '/' + c.power.enabled + '/' + c.proficiency.enabled + '/' + (c.curse.current + c.curse2.current) + '/' + c.blessing.current + '/' + c.secret.enabled + '/' + dc + '/' + opposition + '?parent_roll_id=' + parentRollId + createCidParameterString(c)).then(function(response) {
            response.text().then(function(text) {
                const degats = parseInt(text);
                c.hp.current -= degats;
                updateChat();
            });
        });
    }
    else {
        fetch('/mj/lancer_pnj/' + c.name.current + '/' + convertRollTypeToBackend(action) + '/' + stat + '/' + c.focus.enabled + '/' + c.power.enabled + '/' + c.proficiency.enabled + '/' + (c.curse.current + c.curse2.current) + '/' + c.blessing.current + '/' + c.secret.enabled + '/' + dc + '/0' + '?parent_roll_id=' + parentRollId + createCidParameterString(c)).then(() => updateChat());
    }
    if(action == 'magic') {
        c.debt.current += 1;
    }
    if(action == 'arcana' || action == "arcana-essence" || action == "arcana-spirit") {
        c.arcana.current -= 1;
    }
    if(c.focus.enabled) {
        c.focus.current -= 1;
    }
    if(c.power.enabled) {
        c.power.current -= 1;
        c.debt.current += 1;
    }
}

function incrementString(str: string, separator="-") {
    const parts = str.split(separator);
    if(parts.length == 1) {
        return str + "-1";
    }
    const last = parts.pop();
    if(last === undefined) {
        return str + "-1";
    }
    const i = parseInt(last);
    if(isNaN(i)) {
        return str + "-1";
    }
    return parts.join("-") + "-" + (i + 1);
}


function ajouter_pnj(new_pnj_name: string, new_pnj_chair: string, new_pnj_esprit: string, new_pnj_essence: string, new_pnj_pv_max: string | "PVmax", new_pnj_pf_max: string | "PFmax", new_pnj_pp_max: string | "PPmax") {
    const new_pnj_dettes = Math.floor(Math.random() * Math.floor(5));
    const liste_pnj = document.querySelector('#liste_pnj')!;
    
    if(new_pnj_name == "") {
        new_pnj_name = "Name";
    }

    if(new_pnj_chair == "") {
        new_pnj_chair = "2";
    }

    if(new_pnj_esprit == "") {
        new_pnj_esprit = new_pnj_chair;
    }

    if(new_pnj_essence == "") {
        new_pnj_essence = new_pnj_chair;
    }

    if(new_pnj_pv_max == "") {
        new_pnj_pv_max = "" + parseInt(new_pnj_chair) * 2;
    }
    if(new_pnj_pf_max == "") {
        new_pnj_pf_max = new_pnj_esprit;
    }
    if(new_pnj_pp_max == "") {
        new_pnj_pp_max = new_pnj_essence;
    }
    
    const pnjElement = createCharacter(new_pnj_name);
    pnjElement.classList.add("npc");
    const c = new LocalCharacterView(pnjElement);
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

    document.querySelector<HTMLInputElement>("#new_pnj_name")!.value = incrementString(new_pnj_name);
}

function effacerLancersDes() {
    fetch('/mj_interdit_aux_joueurs/effacerLancersDes').then(() => updateChat());
}

function duplicateInDb(characterElement: HTMLElement) {
    let character = new LocalCharacterView(characterElement);
    fetch('/mj_interdit_aux_joueurs/createcharacter/' + character.name.current + '/' + character.flesh.current + '/' + character.spirit.current + '/' + character.essence.current + '/' + character.hp.current + '/' + character.hp.max + '/' + character.focus.current + '/' + character.focus.max + '/' + character.power.current + '/' + character.power.max + '/' + character.level.current + '/' + character.arcana.current + '/' + character.arcana.max + '/' + character.debt.current + '/' + character.title.current + '/' + character.lux.current + '/' + character.secunda.current + '/' + character.umbra.current + '/' + character.proficiency.label + '/' + character.proficiency.label + '/true')
    .then((response) => response.text())
    .then(json => {
        const cdb = JSON.parse(json) as CharacterFromDatabase;
        console.log(cdb);
        const container = document.createElement("div");
        container.innerHTML = '<button data-cid="' + cdb.id + '" onclick="autoAddChar(this);">' + cdb.name + '</button>';
        document.querySelector<HTMLElement>(".char-select")?.appendChild(container.firstElementChild!);
    });
}

function duplicateAsOfflineCharacter(characterElement: HTMLElement) {
    const liste_pnj = document.querySelector('#liste_pnj')!;
    const offlineChar = characterElement.cloneNode(true) as HTMLElement;
    offlineChar.classList.add("npc");
    delete offlineChar.dataset.id;
    let c = new LocalCharacterView(offlineChar);
    c.name.current = incrementString(c.name.current);
    liste_pnj.appendChild(offlineChar);
}

function autoAddChar(source: HTMLButtonElement) {
    const pcList = document.querySelector<HTMLElement>("#liste_pj")!;
    pcList.appendChild(createCharacterByCid(source.dataset.cid!));
    updateCharactersOnPage();
    source.disabled = true;
}