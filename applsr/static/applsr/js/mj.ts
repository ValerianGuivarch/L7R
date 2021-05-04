type Stat = "pv" | "arcanes" | "dettes" | "pf" | "pp" | "ben" | "mal";

nompj = "mj";
display_secret = true; // override value from lsr.js

function getCurrentCharacter(): string | HTMLElement | null {
    //return document.querySelector<HTMLInputElement>("#pj-select")!.value;
    return document.querySelector<HTMLElement>('input[name="resist"]:checked')?.parentElement ?? null;
}

document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        afficherPJ();
    }, 2000);

    afficherPJ();
});

function modif(nom: string, stat: Stat, valeur: number, add: boolean) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nom + '/' + stat + '/' + valeur + '/' + add).catch(function(e) {
        console.error("error", e);
    }).then(() => afficherPJ(nompj));
}

function ajouter_pj(name: string) {
    const option = document.querySelector('#pj-select option[value="' + name + '"]');
    option?.parentElement?.removeChild(option); // since we can't add the same PC twice we might as well remove it from the drop down list

    const pcElement = document.createElement("div");
    pcElement.className = "pc";
    pcElement.innerHTML = '<div class="name line">' + name + '</div>'
        + '<div class="line"><i><span class="pj_fl" id="pj_fl_' + name + '">&nbsp;</span></i></div>'
        + '<div class="line"><i><span class="pj_fu" id="pj_fu_' + name + '">&nbsp;</span></i></div>'
        + '<div class="line"><i><span class="pj_fs" id="pj_fs_' + name + '">&nbsp;</span></i></div>'
        + '<div class="btn-group line">'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'pv\',1, false);" >-</button>'
            + '<span class="btn btn-info">PV = <span class="pj_pv" id="pj_pv_' + name + '">3</span>/<span class="pj_pv_max" id="pj_pv_max_' + name + '">6</span></span>'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'pv\',1, true);" >+</button>'
        + '</div>'
        + '<div class="btn-group line">'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'pf\',1, false);" >-</button>'
            + '<span class="btn btn-info">PF = <span class="pj_pf" id="pj_pf_' + name + '">3</span>/<span class="pj_pf_max" id="pj_pf_max_' + name + '">6</span></span>'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'pf\',1, true);" >+</button>'
        + '</div>'
        + '<div class="btn-group line">'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'pp\',1, false);" >-</button>'
            + '<span class="btn btn-info">PP = <span class="pj_pp" id="pj_pp_' + name + '">3</span>/<span class="pj_pp_max" id="pj_pp_max_' + name + '">6</span></span>'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'pp\',1, true);" >+</button>'
        + '</div>'
        + '<div class="btn-group line">'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'dettes\',1, false);" >-</button>'
            + '<span class="btn btn-info">DT = <span class="pj_dettes" id="pj_dettes_' + name + '">9</span></span>'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'dettes\',1, true);" >+</button>'
        + '</div>'
        + '<div class="btn-group line">'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'arcanes\',1, false);" >-</button>'
            + '<span class="btn btn-info">AK = <span class="pj_arcanes" id="pj_arcanes_' + name + '">3</span>/<span class="pj_arcanes_max" id="pj_arcanes_max_' + name + '">6</span></span>'
            + '<button class="btn" onclick="modif(\'' + name + '\',\'arcanes\',1, true);" >+</button>'
        + '</div>';
    const liste_pj = document.querySelector<HTMLElement>('#liste_pj')!;
    liste_pj.appendChild(pcElement);
    afficherPJ();
}

function afficherPJ() {
    const liste_pj = document.querySelector<HTMLElement>('#liste_pj')!;
    liste_pj.childNodes.forEach(function(pcNode) {
        const pcElement = pcNode as HTMLElement;
        const name = pcElement.querySelector(".name")!.innerHTML;
        fetch('/lsr/getcar/' + name)
            .then((response) => response.text())
            .then(json => {
                const obj = JSON.parse(json);
                pcElement.querySelector('.pj_pv')!.innerHTML = obj.point_de_vie;
                pcElement.querySelector('.pj_pv_max')!.innerHTML = obj.point_de_vie_max;
                pcElement.querySelector('.pj_pf')!.innerHTML = obj.point_de_focus;
                pcElement.querySelector('.pj_pf_max')!.innerHTML = obj.point_de_focus_max;
                pcElement.querySelector('.pj_pp')!.innerHTML = obj.point_de_pouvoir;
                pcElement.querySelector('.pj_pp_max')!.innerHTML = obj.point_de_pouvoir_max;
                pcElement.querySelector('.pj_dettes')!.innerHTML = obj.dettes;
                pcElement.querySelector('.pj_arcanes')!.innerHTML = obj.arcanes;
                pcElement.querySelector('.pj_arcanes_max')!.innerHTML = obj.arcanes_max;
                pcElement.querySelector('.pj_fl')!.innerHTML = obj.fl;
                pcElement.querySelector('.pj_fu')!.innerHTML = obj.fu;
                pcElement.querySelector('.pj_fs')!.innerHTML = obj.fs;
            }).catch(function(e) {
                console.error("error", e);
            });
    });
}

let remove_pnj_timeout: null | number = null;
var remove_pnj_ok = false;

function effacer_pnj(pnjElement: HTMLElement) {
    if(remove_pnj_ok == false) {
        remove_pnj_ok = true;
        document.querySelectorAll(".delete-npc").forEach(btn => {
            btn.classList.replace("btn-danger", "btn-success");
        });
        remove_pnj_timeout = setTimeout(() => {
            remove_pnj_ok = false;
            document.querySelectorAll(".delete-npc").forEach(btn => {
                btn.classList.replace("btn-success", "btn-danger");
            });
        }, 5000);
    }
    else {
        if(remove_pnj_timeout != null) {
            clearTimeout(remove_pnj_timeout);
        }
        remove_pnj_timeout = setTimeout(() => {
            remove_pnj_ok = false;
            document.querySelectorAll(".delete-npc").forEach(btn => {
                btn.classList.replace("btn-success", "btn-danger");
            });
        }, 5000);
        pnjElement.parentElement?.removeChild(pnjElement);
    }
}

function modifPNJ(pnjElement: HTMLElement, stat: Stat, valeur: number) {
    const mod = pnjElement.querySelector("." + stat)!;
    mod.innerHTML = (parseInt(mod.innerHTML) + valeur).toString();
}

function jetPNJ(pnjElement: HTMLElement, action: RollType, stat: number, pf: boolean, pp: boolean, ra: boolean, sec: boolean, dc: boolean /** dés cachés */, parentRollId: string | null = null) {
    const name = pnjElement.querySelector(".name")!.innerHTML;
    const mal = parseInt(pnjElement.querySelector('.mal')!.innerHTML);
    const ben = parseInt(pnjElement.querySelector('.ben')!.innerHTML);
    const opposition = parseInt(document.querySelector<HTMLInputElement>('#opposition')!.value);

    if(document.querySelector<HTMLInputElement>('#opposition_checked')!.checked) {
        fetch('/mj/lancer_pnj/' + name + '/' + action + '/' + stat + '/' + pf + '/' + pp + '/' + ra + '/' + mal + '/' + ben + '/' + sec + '/' + dc + '/' + opposition + '?parent_roll_id=' + parentRollId).then(function(response) {
            response.text().then(function(text) {
                const degats = parseInt(text);
                modifPNJ(pnjElement, "pv", degats * -1);
                afficher("mj");
            });
        });
    } else {
        fetch('/mj/lancer_pnj/' + name + '/' + action + '/' + stat + '/' + pf + '/' + pp + '/' + ra + '/' + mal + '/' + ben + '/' + sec + '/' + dc + '/0' + '?parent_roll_id=' + parentRollId).then(() => afficher("mj"));
    }
    if(action == 'JM')
        modifPNJ(pnjElement, 'dettes', 1);
    if(pf)
        modifPNJ(pnjElement, 'pf', -1);
    if(pp) {
        modifPNJ(pnjElement, 'pp', -1);
        modifPNJ(pnjElement, 'dettes', 1);
    }
}

function createJetPnjTemplate(new_pnj_name: string, new_pnj_stat_value: string, new_pnj_stat_name: string, action: RollType) {
    return '<button class="btn" onclick="jetPNJ(this.closest(\'.pnj\'),\'' + action + '\',' + new_pnj_stat_value + ',this.closest(\'.pnj\').querySelector(\'.use_pf\').checked,this.closest(\'.pnj\').querySelector(\'.use_pp\').checked,this.closest(\'.pnj\').querySelector(\'.use_ra\').checked, this.closest(\'.pnj\').querySelector(\'.use_sc\').checked, this.closest(\'.pnj\').querySelector(\'.use_dc\').checked);">' + new_pnj_stat_name + '</button>'
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
    
    
    const pnjElement = document.createElement("div");
    pnjElement.innerHTML = '<div class="pnj" id="pnj_' + new_pnj_name + '" data-jc="' + new_pnj_chair + '" data-js="' + new_pnj_esprit + '" data-je="' + new_pnj_essence + '">'

        + '<input type="radio" name="resist" />'
        + '<button class="btn btn-danger delete-npc" onclick="effacer_pnj(this.closest(\'.pnj\'));"> X </button>'
        + '<span><b class="name">' + new_pnj_name + '</b> : </span>'
        
        + '<span class="btn-group">'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'pv\',-1);" >-</button>'
            + '<span class="btn btn-info">'
                + 'PV = <span class="pv" id="pnj_pv_' + new_pnj_name + '">' + new_pnj_pv_max
                + '</span>/<span class="pv_max" id="pnj_pv_max_' + new_pnj_name + '">' + new_pnj_pv_max + '</span>'
            + '</span>'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'pv\',1);" >+</button>'
        + '</span>'
        
        + '<span class="btn-group">'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'pf\',-1);" >-</button>'
            + '<span class="btn btn-info">'
                + '<input class="use_pf" id="use_pf_' + new_pnj_name + '" type="checkbox" autocomplete="off">'
                + 'PF: <span class="pf" id="pnj_pf_' + new_pnj_name + '">' + new_pnj_pf_max + '</span>/' + new_pnj_pf_max
            + '</span>'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'pf\',1);" >+</button>'
        + '</span>'

        + '<span class="btn-group">'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'pp\',-1);" >-</button>'
            + '<span class="btn btn-info">'
                + '<input class="use_pp" id="use_pp_' + new_pnj_name + '" type="checkbox" autocomplete="off">'
                + 'PP: <span class="pp" id="pnj_pp_' + new_pnj_name + '">' + new_pnj_pp_max + '</span>/' + new_pnj_pp_max
            + '</span>'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'pp\',1);" >+</button>'
        + '</span>'

        + '<label class="btn">'
            + '<input class="use_ra" id="use_ra_' + new_pnj_name + '" type="checkbox" autocomplete="off"> RA'
        + '</label>'

        + '<label class="btn">'
            + '<input class="use_sc" id="use_sc_' + new_pnj_name + '" type="checkbox" autocomplete="off"> Secret'
        + '</label>'

        + '<label class="btn">'
            + '<input class="use_dc" id="use_dc_' + new_pnj_name + '" type="checkbox" checked="true" autocomplete="off"> Cachés'
        + '</label>'

        + createJetPnjTemplate(new_pnj_name, new_pnj_chair, "Chair", "JC")
        + createJetPnjTemplate(new_pnj_name, new_pnj_esprit, "Esprit", "JS")
        + createJetPnjTemplate(new_pnj_name, new_pnj_essence, "Essence", "JE")
        + createJetPnjTemplate(new_pnj_name, new_pnj_essence, "Magie", "JM")
        
        + '<span class="btn-group">'
            + '<button class="btn btn-danger" onclick="modifPNJ(this.closest(\'.pnj\'),\'mal\',-1);" >-</button>'
            + '<span class="btn btn-outline-danger">Mal: <span class="mal" id="pnj_mal_' + new_pnj_name + '">0</span></span>'
            + '<button class="btn btn-danger" onclick="modifPNJ(this.closest(\'.pnj\'),\'mal\',1);" >+</button> '
        + '</span>'
        
        + '<span class="btn-group">'
            + '<button class="btn btn-success" onclick="modifPNJ(this.closest(\'.pnj\'),\'ben\',-1);" >-</button>'
            + '<span class="btn btn-outline-success">Ben: <span class="ben" id="pnj_ben_' + new_pnj_name + '">0</span></span>'
            + '<button class="btn btn-success" onclick="modifPNJ(this.closest(\'.pnj\'),\'ben\',1);" >+</button> '
        + '</span>'
        
        + '<span class="btn-group">'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'dettes\',-1);" >-</button>'
            + '<span class="btn btn-info">Dettes: <span class="dettes" id="pnj_dettes_' + new_pnj_name + '">' + new_pnj_dettes + '</span></span>'
            + '<button class="btn" onclick="modifPNJ(this.closest(\'.pnj\'),\'dettes\',1);" >+</button>'
        + '</span>'

        + ' <input type="text" />'

        + '</div>'

        liste_pnj.appendChild(pnjElement.firstChild!);
}

function effacerLancersDes() {
    fetch('/mj_interdit_aux_joueurs/effacerLancersDes');
}
