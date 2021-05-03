"use strict";
function rollTypeToString(rollType) {
    if (rollType == 'Jsoin') {
        return "<i>Soigne</i>";
    }
    else if (rollType == 'JM') {
        return "lance un <i>Sort</i>";
    }
    else if (rollType == 'JAF') {
        return "utilise une <i>Arcane Fixe</i>.";
    }
    if (rollType == 'JC') {
        return "fait un <i>jet de Chair</i>";
    }
    else if (rollType == 'JS') {
        return "fait un <i>jet d'Esprit</i>";
    }
    else if (rollType == 'JE') {
        return "fait un <i>jet d'Essence</i>";
    }
    else if (rollType == 'JCH') {
        return "fait un <i>jet de Charisme</i>";
    }
    else if (rollType == 'JAG') {
        return "fait un <i>jet d'Agriculture</i>";
    }
    else if (rollType == 'JCB') {
        return "fait un <i>jet de Combat</i>";
    }
    else if (rollType == 'JMG') {
        return "fait un <i>jet de Magie</i>";
    }
    else if (rollType == 'JSV') {
        return "fait un <i>jet de Savoir</i>";
    }
    else if (rollType == 'JNV') {
        return "fait un <i>jet de Navigation</i>";
    }
    else if (rollType == 'JNT') {
        return "fait un <i>jet de Nature</i>";
    }
    else if (rollType.startsWith('Jemp-')) {
        return "fait un <i>jet empirique</i> (" + rollType.split("-")[1] + ")";
    }
    else {
        return rollType + "?";
    }
}
function formatRollResults(dice_results) {
    var str = "";
    for (var _i = 0, dice_results_1 = dice_results; _i < dice_results_1.length; _i++) {
        var result = dice_results_1[_i];
        str += " [&nbsp;" + result + "&nbsp;] ";
    }
    return str;
}
function countSuccessesWith(dice_results, countAsOne, countAsTwo, bonus) {
    var successCount = 0;
    for (var _i = 0, dice_results_2 = dice_results; _i < dice_results_2.length; _i++) {
        var result = dice_results_2[_i];
        if (countAsOne.indexOf(result) !== -1) {
            successCount += 1;
        }
        if (countAsTwo.indexOf(result) !== -1) {
            successCount += 2;
        }
    }
    return successCount + bonus;
}
function resist(elem, action) {
    var char = getCurrentCharacter();
    if (char === null) {
        console.error("Cannot roll with no character");
        return;
    }
    else if (typeof (char) === "string") {
        loadLancer(char, action, document.querySelector('#use_pf').checked, document.querySelector('#use_pp').checked, document.querySelector('#use_ra').checked, document.querySelector('#use_sc').checked, elem.closest('.roll').dataset.rollid);
    }
    else {
        var new_pnj_name = char.querySelector(".name").innerHTML;
        var new_pnj_stat_value = parseInt(char.dataset[action.toLowerCase()]);
        jetPNJ(new_pnj_name, action, new_pnj_stat_value, char.querySelector('.use_pf').checked, char.querySelector('.use_pp').checked, char.querySelector('.use_ra').checked, char.querySelector('.use_sc').checked, char.querySelector('.use_dc').checked, elem.closest('.roll').dataset.rollid);
    }
}
function jsonRollToHtml(roll, sub) {
    if (sub === void 0) { sub = false; }
    var tr = document.createElement("tr");
    var secret = "";
    if (roll.secret == true) {
        secret = "(secret) ";
    }
    var benemal = "";
    if (roll.malediction_count > 0 && roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions et " + roll.malediction_count + " malédictions, ";
    }
    else if (roll.malediction_count > 0) {
        benemal = "Avec " + roll.malediction_count + " malédictions, ";
    }
    else if (roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions, ";
    }
    var pp = "";
    if (roll.pp == true) {
        pp = " en y mettant toute sa <i>puissance</i> ";
    }
    var pf = "";
    if (roll.pf == true) {
        pf = " se <i>concentre</i> et ";
    }
    var ra = "";
    if (roll.ra == true) {
        ra = ", grâce à son <i>héritage latent</i>";
    }
    var delta = "";
    if (roll.parent_roll != null) {
        var parentSuccessCount = countSuccessesWith(roll.parent_roll.dice_results, [5], [6], (roll.parent_roll.pp ? 1 : 0) + (roll.parent_roll.ra ? 1 : 0));
        var thisSuccessCount = countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0));
        var diff = parentSuccessCount - thisSuccessCount;
        delta = " Delta: " + diff + " ";
        if (diff < 0) {
            delta += " (aucun dégâts)";
        }
        else {
            delta += " (" + Math.ceil(diff / 2) + " dégâts).";
        }
    }
    var resist = "";
    if (sub == false) {
        resist = ' Résister avec <button class="btn resist" onclick="resist(this, \'JC\')">chair</button>'
            + '<button class="btn resist" onclick="resist(this, \'JS\')">esprit</button>'
            + '<button class="btn resist" onclick="resist(this, \'JE\')">essence</button> ?';
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
        + '<br />et obtient <span title="Juge12: ' + countSuccessesWith(roll.dice_results, [1], [2], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0)) + ', Juge34: ' + countSuccessesWith(roll.dice_results, [3], [4], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0)) + '">'
        + countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + " succès</span>"
        + ra
        + "."
        + resist
        + delta
        + "</td>";
    return tr;
}
var display_secret = false; // override value from lsr.js
function afficher(nompj) {
    fetch('/afficher/' + nompj + '/' + display_secret + '?json').then(function (response) { return response.text(); }).then(function (text) {
        var _a;
        var chat = document.querySelector('#chat');
        var chatHistory = JSON.parse(text);
        if (chatHistory.update == null || chat.dataset.update != chatHistory.update) {
            chat.innerHTML = "";
            chat.dataset.update = chatHistory.update;
            for (var _i = 0, _b = chatHistory.rolls; _i < _b.length; _i++) {
                var roll = _b[_i];
                var line = jsonRollToHtml(roll);
                var subtable = document.createElement("table");
                (_a = line.querySelector("td.roll")) === null || _a === void 0 ? void 0 : _a.appendChild(subtable);
                for (var _c = 0, _d = roll.related_rolls; _c < _d.length; _c++) {
                    var related_roll = _d[_c];
                    subtable.appendChild(jsonRollToHtml(related_roll, true));
                }
                chat.appendChild(line);
            }
        }
    }).catch(function (e) {
        console.error("error", e);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    var cb = function () {
        afficher(nompj);
        if (nompj != "mj") {
            getCar(nompj);
        }
    };
    cb();
    setInterval(cb, 2000);
});
function getCar(name) {
    fetch('/lsr/getcar/' + name)
        .then(function (response) { return response.text(); })
        .then(function (json) {
        var obj = JSON.parse(json);
        var pv = document.querySelector('#pv');
        var pvMax = obj.point_de_vie_max;
        var prevPv = pv.innerHTML;
        pv.innerHTML = obj.point_de_vie;
        if (prevPv != obj.point_de_vie) {
            if ((pvMax - obj.point_de_vie) % 6 == 0 && prevPv > obj.point_de_vie && obj.point_de_vie != pvMax) {
                plusMalus();
            }
            if ((pvMax - obj.point_de_vie) % 6 == 5 && prevPv < obj.point_de_vie && obj.point_de_vie != 0) {
                moinsMalus();
            }
        }
        var dettes = document.querySelector('#dettes');
        if (dettes.innerHTML != obj.dettes) {
            dettes.innerHTML = obj.dettes;
        }
        var arcanes = document.querySelector('#arcanes');
        if (arcanes.innerHTML != obj.arcanes) {
            arcanes.innerHTML = obj.arcanes;
        }
        var pf = document.querySelector('#pf');
        if (pf.innerHTML != obj.point_de_focus) {
            pf.innerHTML = obj.point_de_focus;
        }
        var pp = document.querySelector('#pp');
        if (pp.innerHTML != obj.point_de_pouvoir) {
            pp.innerHTML = obj.point_de_pouvoir;
        }
    }).catch(function (e) {
        console.error("error", e);
    });
}
function loadLancer(name, action, pf, pp, ra, secret, parentRollId) {
    if (parentRollId === void 0) { parentRollId = null; }
    fetch('/lancer/' + name + '/' + action + '/' + pf + '/' + pp + '/' + ra + '/' + malus + '/' + bonus + '/' + secret + '/false?parent_roll_id=' + parentRollId).then(function () { return afficher(nompj); });
}
function loadLancerEmpirique(nompj, secret) {
    var valeur = prompt("Quel lancer de dé ?", "1d6");
    fetch('/lancer_empirique/' + nompj + '/' + valeur + '/' + secret).catch(function (e) {
        console.error("error", e);
    });
}
var malus = 0;
var bonus = 0;
function moinsMalus() {
    if (malus > 0) {
        malus = malus - 1;
        document.querySelector('#malus').innerHTML = malus.toString();
    }
}
function plusMalus() {
    malus = malus + 1;
    document.querySelector('#malus').innerHTML = malus.toString();
}
function moinsBonus() {
    if (bonus > 0) {
        bonus = bonus - 1;
        document.querySelector('#bonus').innerHTML = bonus.toString();
    }
}
function plusBonus() {
    bonus = bonus + 1;
    document.querySelector('#bonus').innerHTML = bonus.toString();
}
function moinsPv(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pv/1/false')
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusPv(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pv/1/true')
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsAk(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/false')
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusAk(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/true')
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsDt(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/false')
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusDt(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/true')
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsPf(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/false')
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusPf(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/true')
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsPp(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/false')
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusPp(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/true')
        .catch(function (e) {
        console.error("error", e);
    });
}
function loadLancerJdSvM(name) {
    fetch('/lancer_empirique/' + name + '/1d20/true');
}
