declare var nompj: string; // set in html

type JEMP = `Jemp-${string}`;
type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT'
    | JEMP;

interface Roll {
    id: number,
    date: string, // 2021-05-02T18:03:41.551Z
    secret: boolean,
    character: string,
    malediction_count: number,
    benediction_count: number,
    dice_results: number[],
    pp: boolean,
    pf: boolean,
    roll_type: RollType,
    parent_roll?: Roll,
    related_rolls: Roll[]
}

interface ChatHistory {
    "update": string, // iso datetime
    "rolls": Roll[]
}

function rollTypeToString(rollType: RollType) {
    if(rollType == 'Jsoin') {
        return "<i>Soigne</i>";
    }
    else if(rollType == 'JM') {
        return "lance un <i>Sort</i>";
    }
    else if(rollType == 'JAF') {
        return "utilise une <i>Arcane Fixe</i>.";
    }
    if(rollType == 'JC') {
        return "fait un <i>jet de Chair</i>";
    }
    else if(rollType == 'JS') {
        return "fait un <i>jet d'Esprit</i>";
    }
    else if(rollType == 'JE') {
        return "fait un <i>jet d'Essence</i>";
    }
    else if(rollType == 'JCH') {
        return "fait un <i>jet de Charisme</i>";
    }
    else if(rollType == 'JAG') {
        return "fait un <i>jet d'Agriculture</i>";
    }
    else if(rollType == 'JCB') {
        return "fait un <i>jet de Combat</i>";
    }
    else if(rollType == 'JMG') {
        return "fait un <i>jet de Magie</i>";
    }
    else if(rollType == 'JSV') {
        return "fait un <i>jet de Savoir</i>";
    }
    else if(rollType == 'JNV') {
        return "fait un <i>jet de Navigation</i>";
    }
    else if(rollType == 'JNT') {
        return "fait un <i>jet de Nature</i>";
    }
    else if(rollType.startsWith('Jemp-')) {
        return "fait un <i>jet empirique</i> (" + rollType.split("-")[1] + ")";
    }
    else {
        return rollType + "?";
    }
}

function formatRollResults(dice_results: number[]) {
    var str = "";
    for(var result of dice_results) {
        str += " [&nbsp;" + result + "&nbsp;] "
    }
    return str;
}

function countSuccessesWith(dice_results: number[], countAsOne: number[], countAsTwo: number[], bonus: number) {
    var successCount = 0;
    for(var result of dice_results) {
        if(countAsOne.indexOf(result) !== -1) {
            successCount += 1;
        }
        if(countAsTwo.indexOf(result) !== -1) {
            successCount += 2;
        }
    }
    return successCount + bonus;
}

function jsonRollToHtml(roll: Roll, sub: boolean = false) {
    var tr = document.createElement("tr");

    var secret = ""
    if(roll.secret == true) {
        secret = "(secret) ";
    }

    var benemal = "";
    if(roll.malediction_count > 0 && roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions et " + roll.malediction_count + " malédictions, "
    }
    else if(roll.malediction_count > 0) {
        benemal = "Avec " + roll.malediction_count + " malédictions, "
    }
    else if(roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions, "
    }

    var pp = "";
    if(roll.pp == true) {
        pp = " en y mettant toute sa <i>puissance</i> ";
    }

    var pf = "";
    if(roll.pf == true) {
        pf = " se <i>concentre</i> et "
    }

    var delta = "";
    if(roll.parent_roll != null) {
        var parentSuccessCount = countSuccessesWith(roll.parent_roll.dice_results, [5], [6], roll.parent_roll.pp ? 1 : 0);
        var thisSuccessCount = countSuccessesWith(roll.dice_results, [5], [6], roll.pp ? 1 : 0);
        var diff = parentSuccessCount - thisSuccessCount;
        delta = " Delta: " + diff + " ";
        if(diff < 0) {
            delta += " (aucun dégâts)"
        }
        else {
            delta += " (" + Math.ceil(diff / 2) + " dégâts)."
        }
    }

    var resist = "";
    if(sub == false) {
        resist = ' Résister avec <button class="btn resist" onclick="loadLancer(getCurrentCharacter(), \'JC\', document.getElementById(\'use_pf\').checked, document.getElementById(\'use_pp\').checked, document.getElementById(\'use_ra\').checked, document.getElementById(\'use_sc\').checked, this.closest(\'.roll\').dataset.rollid)">chair</button>'
            + '<button class="btn resist" onclick="loadLancer(getCurrentCharacter(), \'JS\', document.getElementById(\'use_pf\').checked, document.getElementById(\'use_pp\').checked, document.getElementById(\'use_ra\').checked, document.getElementById(\'use_sc\').checked, this.closest(\'.roll\').dataset.rollid)">esprit</button>'
            + '<button class="btn resist" onclick="loadLancer(getCurrentCharacter(), \'JE\', document.getElementById(\'use_pf\').checked, document.getElementById(\'use_pp\').checked, document.getElementById(\'use_ra\').checked, document.getElementById(\'use_sc\').checked, this.closest(\'.roll\').dataset.rollid)">essence</button> ?';
    }

    tr.innerHTML = '<td class="date">'
        + new Date(roll.date).toLocaleTimeString().replace(" ", "&nbsp;")
        + '</td>'
        + '<td class="roll" data-rollid="' + roll.id + '">'
        + secret // "(secret) "
        + benemal
        + "<b>" + roll.character + "</b>"
        + pf
        + " "
        + rollTypeToString(roll.roll_type)
        + pp
        + " :<br />"
        + formatRollResults(roll.dice_results)
        + '<br />et obtient <span title="Juge12: ' + countSuccessesWith(roll.dice_results, [1], [2], roll.pp ? 1 : 0) + ', Juge34: ' + countSuccessesWith(roll.dice_results, [3], [4], roll.pp ? 1 : 0) + '">'
        + countSuccessesWith(roll.dice_results, [5], [6], roll.pp ? 1 : 0)
        + " succès</span>."
        + resist
        + delta
        + "</td>";
    return tr;
}

var display_secret = false; // override value from lsr.js

function afficher(nompj: string) {
    fetch('/afficher/' + nompj + '/' + display_secret + '?json').then((response) => response.text()).then(text => {
        const chat = document.querySelector<HTMLElement>('#chat')!;
        var chatHistory = JSON.parse(text);
        if(chatHistory.update == null || chat.dataset.update != chatHistory.update) {
            chat.innerHTML = "";
            chat.dataset.update = chatHistory.update
            for(var roll of chatHistory.rolls) {
                var line = jsonRollToHtml(roll);
                var subtable = document.createElement("table");
                line.querySelector("td.roll")?.appendChild(subtable);
                for(var related_roll of roll.related_rolls) {
                    subtable.appendChild(jsonRollToHtml(related_roll, true));
                }
                chat.appendChild(line);
            }
        }
    }).catch(function(e) {
        console.error("error", e);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    var cb = () => {
        afficher(nompj);
        if(nompj != "mj") {
            getCar(nompj);
        }
    };
    cb();
    setInterval(cb, 2000);
});

function getCar(name: string) {
    fetch('/lsr/getcar/' + name)
        .then((response) => response.text())
        .then(json => {
            const obj = JSON.parse(json);
            const pv = document.querySelector('#pv')!;
            const pvMax = obj.point_de_vie_max;
            var prevPv = pv.innerHTML;
            pv.innerHTML = obj.point_de_vie;

            if(prevPv != obj.point_de_vie) {
                if((pvMax - obj.point_de_vie) % 6 == 0 && prevPv > obj.point_de_vie && obj.point_de_vie != pvMax) {
                    plusMalus()
                }
                if((pvMax - obj.point_de_vie) % 6 == 5 && prevPv < obj.point_de_vie && obj.point_de_vie != 0) {
                    moinsMalus()
                }
            }

            const dettes = document.querySelector('#dettes')!;
            if(dettes.innerHTML != obj.dettes) {
                dettes.innerHTML = obj.dettes;
            }
            const arcanes = document.querySelector('#arcanes')!;
            if(arcanes.innerHTML != obj.arcanes) {
                arcanes.innerHTML = obj.arcanes;
            }
            const pf = document.querySelector('#pf')!;
            if(pf.innerHTML != obj.point_de_focus) {
                pf.innerHTML = obj.point_de_focus;
            }
            const pp = document.querySelector('#pp')!;
            if(pp.innerHTML != obj.point_de_pouvoir) {
                pp.innerHTML = obj.point_de_pouvoir;
            }

        }).catch(function(e) {
            console.error("error", e);
        });
}

function loadLancer(name: string, action: RollType, pf: boolean, pp: boolean, ra: boolean, secret: boolean, parentRollId: number | null = null) {
    fetch('/lancer/' + name + '/' + action + '/' + pf + '/' + pp + '/' + ra + '/' + malus + '/' + bonus + '/' + secret + '/false?parent_roll_id=' + parentRollId).then(() => afficher(nompj));
}

function loadLancerEmpirique(nompj: string, secret: boolean) {
    var valeur = prompt("Quel lancer de dé ?", "1d6");

    fetch('/lancer_empirique/' + nompj + '/' + valeur + '/' + secret).catch(function(e) {
        console.error("error", e);
    });
}

var malus = 0;
var bonus = 0;

function moinsMalus() {
    if(malus > 0) {
        malus = malus - 1
        document.querySelector('#malus')!.innerHTML = malus.toString();
    }
}

function plusMalus() {
    malus = malus + 1
    document.querySelector('#malus')!.innerHTML = malus.toString();
}

function moinsBonus() {
    if(bonus > 0) {
        bonus = bonus - 1
        document.querySelector('#bonus')!.innerHTML = bonus.toString();
    }
}

function plusBonus() {
    bonus = bonus + 1
    document.querySelector('#bonus')!.innerHTML = bonus.toString();
}

function moinsPv(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pv/1/false')
        .catch(function(e) {
            console.error("error", e);
        });
}

function plusPv(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pv/1/true')
        .catch(function(e) {
            console.error("error", e);
        });
}

function moinsAk(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/false')
        .catch(function(e) {
            console.error("error", e);
        });
}

function plusAk(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/true')
        .catch(function(e) {
            console.error("error", e);
        });
}

function moinsDt(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/false')
        .catch(function(e) {
            console.error("error", e);
        });
}

function plusDt(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/true')
        .catch(function(e) {
            console.error("error", e);
        });
}

function moinsPf(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/false')
        .catch(function(e) {
            console.error("error", e);
        });
}

function plusPf(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/true')
        .catch(function(e) {
            console.error("error", e);
        });
}

function moinsPp(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/false')
        .catch(function(e) {
            console.error("error", e);
        });
}
function plusPp(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/true')
        .catch(function(e) {
            console.error("error", e);
        });
}

function loadLancerJdSvM(name: string) {
    fetch('/lancer_empirique/' + name + '/1d20/true');
}
