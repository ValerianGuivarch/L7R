type Stat = "pv" | "arcanes" | "dettes" | "pf" | "pp";

let nbPJ = 0;
let listPJ: string[] = [];
let table = "";

nompj = "mj";
display_secret = true; // override value from lsr.js

document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        afficherPJ();
    }, 2000);

    afficherPJ();
});

function modif(nom: string, stat: Stat, valeur: number, add: boolean) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nom + '/' + stat + '/' + valeur + '/' + add).catch(function(e) {
        console.error("error", e);
    }).then(() => afficher(nompj));
}

function ajouter_pj(name: string) {
    let liste_pj = document.querySelector<HTMLElement>('#liste_pj')!;
    table = table +
        '<td align="center">' + '<span id="pj_name"><b>' + name + '</b></span>'
        + '<br/><i><span id="pj_fl_' + name + '"></span></i>'
        + '<br/><i><span id="pj_fu_' + name + '"></span></i>'
        + '<br/><i><span id="pj_fs_' + name + '"></span></i>'
        + '<br/><button onclick="modif(\'' + name + '\',\'pv\',1, false);" >-</button>PV = <span id="pj_pv_' + name + '">3</span>/<span id="pj_pv_max_' + name + '">6</span><button onclick="modif(\'' + name + '\',\'pv\',1, true);" >+</button>'
        + '<br/><button onclick="modif(\'' + name + '\',\'pf\',1, false);" >-</button>PF = <span id="pj_pf_' + name + '">3</span>/<span id="pj_pf_max_' + name + '">6</span><button onclick="modif(\'' + name + '\',\'pf\',1, true);" >+</button>'
        + '<br/><button onclick="modif(\'' + name + '\',\'pp\',1, false);" >-</button>PP = <span id="pj_pp_' + name + '">3</span>/<span id="pj_pp_max_' + name + '">6</span><button onclick="modif(\'' + name + '\',\'pp\',1, true);" >+</button>'
        + '<br/><button onclick="modif(\'' + name + '\',\'dettes\',1, false);" >-</button>DT = <span id="pj_dettes_' + name + '">9</span><button onclick="modif(\'' + name + '\',\'dettes\',1, true);" >+</button>'
        + '<br/><button onclick="modif(\'' + name + '\',\'arcanes\',1, false);" >-</button>AK = <span id="pj_arcanes_' + name + '">3</span>/<span id="pj_arcanes_max_' + name + '">6</span><button onclick="modif(\'' + name + '\',\'arcanes\',1, true);" >+</button>'
        + '</td>';
    liste_pj.innerHTML = '<table border="1"><tr>' + table + '</tr></table>';
    nbPJ++;
    listPJ.push(name);
}

function afficherPJ() {
    listPJ.forEach(function(name, index, array) {
        fetch('/lsr/getcar/' + name)
            .then((response) => response.text())
            .then(json => {
                const obj = JSON.parse(json);
                document.querySelector('#pj_pv_' + name)!.innerHTML = obj.point_de_vie;
                document.querySelector('#pj_pv_max_' + name)!.innerHTML = obj.point_de_vie_max;
                document.querySelector('#pj_pf_' + name)!.innerHTML = obj.point_de_focus;
                document.querySelector('#pj_pf_max_' + name)!.innerHTML = obj.point_de_focus_max;
                document.querySelector('#pj_pp_' + name)!.innerHTML = obj.point_de_pouvoir;
                document.querySelector('#pj_pp_max_' + name)!.innerHTML = obj.point_de_pouvoir_max;
                document.querySelector('#pj_dettes_' + name)!.innerHTML = obj.dettes;
                document.querySelector('#pj_arcanes_' + name)!.innerHTML = obj.arcanes;
                document.querySelector('#pj_arcanes_max_' + name)!.innerHTML = obj.arcanes_max;
                document.querySelector('#pj_fl_' + name)!.innerHTML = obj.fl;
                document.querySelector('#pj_fu_' + name)!.innerHTML = obj.fu;
                document.querySelector('#pj_fs_' + name)!.innerHTML = obj.fs;
            }).catch(function(e) {
                console.error("error", e);
            });
    });
}

function effacer_pnj(new_pnj_name: string) {
    const pnj = document.querySelector('#pnj_' + new_pnj_name)!;
    pnj.innerHTML = "";
}

function modifPNJ(pnj_name: string, stat: Stat, valeur: number) {
    const mod = document.querySelector('#pnj_' + stat + '_' + pnj_name)!;
    console.log('#pnj_' + stat + '_' + pnj_name)
    console.log(valeur)
    mod.innerHTML = (parseInt(mod.innerHTML) + valeur).toString();
}

function jetPNJ(name: string, action: RollType, stat: Stat, pf: boolean, pp: boolean, ra: boolean, sec: boolean, dc: boolean /** dés cachés */) {
    const mal = parseInt(document.querySelector('#pnj_mal_' + name)!.innerHTML);
    const ben = parseInt(document.querySelector('#pnj_ben_' + name)!.innerHTML);
    const opposition = parseInt(document.querySelector<HTMLInputElement>('#opposition')!.value);

    if(document.querySelector<HTMLInputElement>('#opposition_checked')!.checked) {
        fetch('/mj/lancer_pnj/' + name + '/' + action + '/' + stat + '/' + pf + '/' + pp + '/' + ra + '/' + mal + '/' + ben + '/' + sec + '/' + dc + '/' + opposition).then(function(response) {
            response.text().then(function(text) {
                console.log(text);
                const degats = parseInt(text);
                console.log(degats);
                modifPNJ(name, "pv", degats * -1);
            });
        });
    } else {
        fetch('/mj/lancer_pnj/' + name + '/' + action + '/' + stat + '/' + pf + '/' + pp + '/' + ra + '/' + mal + '/' + ben + '/' + sec + '/' + dc + '/0');
    }
    if(action == 'JM')
        modifPNJ(name, 'dettes', 1);
    if(pf)
        modifPNJ(name, 'pf', -1);
    if(pp) {
        modifPNJ(name, 'pp', -1);
        modifPNJ(name, 'dettes', 1);
    }
}



function ajouter_pnj(new_pnj_name: string, new_pnj_chair: string, new_pnj_esprit: string, new_pnj_essence: string, new_pnj_pv_max: number | "PVmax", new_pnj_pf_max: number | "PFmax", new_pnj_pp_max: number | "PPmax") {
    const new_pnj_dettes = Math.floor(Math.random() * Math.floor(5));
    const liste_pnj = document.querySelector('#liste_pnj')!;
    if(new_pnj_pv_max == "PVmax") {
        new_pnj_pv_max = parseInt(new_pnj_chair) * 2;
    }
    if(new_pnj_pf_max == "PFmax") {
        new_pnj_pf_max = parseInt(new_pnj_esprit);
    }
    if(new_pnj_pp_max == "PPmax") {
        new_pnj_pp_max = parseInt(new_pnj_essence);
    }
    liste_pnj.innerHTML = liste_pnj.innerHTML
        + '<span id=\"pnj_' + new_pnj_name + '\"><br><button onclick=\"effacer_pnj(\'' + new_pnj_name + '\');\"> X </button><b>' + new_pnj_name
        + '</> : <button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'pv\',-1);\" >-</button>PV = <span id=\"pnj_pv_' + new_pnj_name + '\">' + new_pnj_pv_max
        + '</span>/<span id=\"pj_pv_max_' + new_pnj_name + '\">' + new_pnj_pv_max + '</span><button onclick=\"modifPNJ(\'' + new_pnj_name +
        '\',\'pv\',1);\" >+</button><label class=\"btn active\"><button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'pf\',-1);\" >-</button><input id=\"use_pf_' + new_pnj_name + '\" type=\"checkbox\" autocomplete=\"off\">PF:<span id=\"pnj_pf_'
        + new_pnj_name + '\">' + new_pnj_pf_max + '</span> / ' + new_pnj_pf_max + '<button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'pf\',1);\" >+</button></label><label class=\"btn active\"><button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'pp\',-1);\" >-</button><input id=\"use_pp_' + new_pnj_name
        + '\" type=\"checkbox\" autocomplete=\"off\">PP:<span id=\"pnj_pp_' + new_pnj_name + '\">' + new_pnj_pp_max + '</span> / ' + new_pnj_pp_max
        + '<button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'pp\',1);\" >+</button></label><label class=\"btn active\"><input id=\"use_ra_' + new_pnj_name + '\" type=\"checkbox\" autocomplete=\"off\">RA</label><label class=\"btn active\"><input id=\"use_sc_'
        + new_pnj_name + '\" type=\"checkbox\" autocomplete=\"off\">Secret</label><label class=\"btn active\"><input id=\"use_dc_'
        + new_pnj_name + '\" type=\"checkbox\" checked=\"true\" autocomplete=\"off\">Dés cachés</label><br><button onclick=\"jetPNJ(\''
        + new_pnj_name + '\',\'JC\',' + new_pnj_chair + ',document.getElementById(\'use_pf_' + new_pnj_name + '\').checked,document.getElementById(\'use_pp_' + new_pnj_name
        + '\').checked,document.getElementById(\'use_ra_' + new_pnj_name + '\').checked, document.getElementById(\'use_sc_' + new_pnj_name + '\').checked, document.getElementById(\'use_dc_' + new_pnj_name + '\').checked);\">Chair</button><button onclick=\"jetPNJ(\''
        + new_pnj_name + '\',\'JS\',' + new_pnj_esprit + ',document.getElementById(\'use_pf_' + new_pnj_name + '\').checked,document.getElementById(\'use_pp_' + new_pnj_name
        + '\').checked,document.getElementById(\'use_ra_' + new_pnj_name + '\').checked, document.getElementById(\'use_sc_' + new_pnj_name + '\').checked, document.getElementById(\'use_dc_' + new_pnj_name + '\').checked);\">Esprit</button><button onclick=\"jetPNJ(\''
        + new_pnj_name + '\',\'JE\',' + new_pnj_essence + ',document.getElementById(\'use_pf_' + new_pnj_name + '\').checked,document.getElementById(\'use_pp_' + new_pnj_name
        + '\').checked,document.getElementById(\'use_ra_' + new_pnj_name + '\').checked, document.getElementById(\'use_sc_' + new_pnj_name + '\').checked, document.getElementById(\'use_dc_' + new_pnj_name + '\').checked);\">Essence</button><button onclick=\"jetPNJ(\''
        + new_pnj_name + '\',\'JM\',' + new_pnj_essence + ',document.getElementById(\'use_pf_' + new_pnj_name + '\').checked,document.getElementById(\'use_pp_' + new_pnj_name
        + '\').checked,document.getElementById(\'use_ra_' + new_pnj_name + '\').checked, document.getElementById(\'use_sc_' + new_pnj_name + '\').checked, document.getElementById(\'use_dc_' + new_pnj_name + '\').checked);\">Magie</button> <button onclick=\"modifPNJ(\'' +
        new_pnj_name + '\',\'mal\',-1);\" >-</button>Mal = <span id=\"pnj_mal_' + new_pnj_name + '\">0</span><button onclick=\"modifPNJ(\'' + new_pnj_name +
        '\',\'mal\',1);\" >+</button> <button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'ben\',-1);\" >-</button>Ben = <span id=\"pnj_ben_'
        + new_pnj_name + '\">0</span><button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'ben\',1);\" >+</button> <button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'dettes\',-1);\" >-</button>Dettes = <span id=\"pnj_dettes_'
        + new_pnj_name + '\">' + new_pnj_dettes + '</span><button onclick=\"modifPNJ(\'' + new_pnj_name + '\',\'dettes\',1);\" >+</button></span>'
}

function effacerLancersDes() {
    fetch('/mj_interdit_aux_joueurs/effacerLancersDes');
}



