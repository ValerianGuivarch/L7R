"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var WithLabel = /** @class */ (function () {
    function WithLabel(element) {
        this.element = element;
    }
    Object.defineProperty(WithLabel.prototype, "label", {
        get: function () {
            return this.element.querySelector(".label").innerHTML;
        },
        set: function (value) {
            var label = this.element.querySelector(".label");
            if (label.innerHTML != value.toString()) {
                label.innerHTML = value.toString();
            }
        },
        enumerable: false,
        configurable: true
    });
    return WithLabel;
}());
var Attribute = /** @class */ (function (_super) {
    __extends(Attribute, _super);
    function Attribute(element) {
        return _super.call(this, element) || this;
    }
    Object.defineProperty(Attribute.prototype, "current", {
        get: function () {
            return parseInt(this.element.querySelector(".current").innerHTML);
        },
        set: function (value) {
            var current = this.element.querySelector(".current");
            if (current.innerHTML != value.toString()) {
                current.innerHTML = value.toString();
            }
        },
        enumerable: false,
        configurable: true
    });
    return Attribute;
}(WithLabel));
var AttributeWithMax = /** @class */ (function (_super) {
    __extends(AttributeWithMax, _super);
    function AttributeWithMax(element) {
        return _super.call(this, element) || this;
    }
    Object.defineProperty(AttributeWithMax.prototype, "max", {
        get: function () {
            return parseInt(this.element.querySelector(".max").innerHTML);
        },
        set: function (value) {
            var max = this.element.querySelector(".max");
            if (max.innerHTML != value.toString()) {
                max.innerHTML = value.toString();
            }
        },
        enumerable: false,
        configurable: true
    });
    return AttributeWithMax;
}(Attribute));
var SmartStringAttribute = /** @class */ (function () {
    function SmartStringAttribute(element) {
        this.element = element;
    }
    Object.defineProperty(SmartStringAttribute.prototype, "current", {
        get: function () {
            return this.element.querySelector(".current").innerHTML;
        },
        set: function (value) {
            var current = this.element.querySelector(".current");
            if (current == null) {
                current = this.element;
            }
            if (current.innerHTML != value.toString()) {
                current.innerHTML = value.toString();
            }
        },
        enumerable: false,
        configurable: true
    });
    return SmartStringAttribute;
}());
var AttributeActivable = /** @class */ (function (_super) {
    __extends(AttributeActivable, _super);
    function AttributeActivable(element) {
        return _super.call(this, element) || this;
    }
    Object.defineProperty(AttributeActivable.prototype, "enabled", {
        get: function () {
            return this.element.querySelector(".enabled input").checked;
        },
        set: function (value) {
            this.element.querySelector(".enabled input").checked = value;
        },
        enumerable: false,
        configurable: true
    });
    return AttributeActivable;
}(WithLabel));
var AttributeWithMaxActivable = /** @class */ (function (_super) {
    __extends(AttributeWithMaxActivable, _super);
    function AttributeWithMaxActivable(element) {
        return _super.call(this, element) || this;
    }
    Object.defineProperty(AttributeWithMaxActivable.prototype, "enabled", {
        get: function () {
            return this.element.querySelector(".enabled input").checked;
        },
        set: function (value) {
            this.element.querySelector(".enabled input").checked = value;
        },
        enumerable: false,
        configurable: true
    });
    return AttributeWithMaxActivable;
}(AttributeWithMax));
var LocalCharacterView = /** @class */ (function () {
    function LocalCharacterView(element) {
        this.element = element;
    }
    LocalCharacterView.prototype.updateFromDatabase = function (characterFromDatabase) {
        var _a;
        this.name.current = characterFromDatabase.name;
        this.title.current = characterFromDatabase.titre;
        this.level.current = characterFromDatabase.niveau;
        this.lux.current = characterFromDatabase.fl;
        this.umbra.current = characterFromDatabase.fu;
        this.secunda.current = characterFromDatabase.fs;
        this.flesh.current = characterFromDatabase.chair;
        this.spirit.current = characterFromDatabase.essence;
        this.essence.current = characterFromDatabase.essence;
        this.hp.current = characterFromDatabase.point_de_vie;
        this.hp.max = characterFromDatabase.point_de_vie_max;
        this.debt.current = characterFromDatabase.dettes;
        this.arcana.current = characterFromDatabase.arcanes;
        this.arcana.max = characterFromDatabase.arcanes_max;
        this.focus.current = characterFromDatabase.point_de_focus;
        this.focus.max = characterFromDatabase.point_de_focus_max;
        this.power.current = characterFromDatabase.point_de_pouvoir;
        this.power.max = characterFromDatabase.point_de_pouvoir_max;
        this.proficiency.label = characterFromDatabase.force1;
        if (characterFromDatabase.force2) {
            this.proficiency.label += " / " + characterFromDatabase.force2;
        }
        this.notes.current = (_a = characterFromDatabase.notes) !== null && _a !== void 0 ? _a : "";
    };
    Object.defineProperty(LocalCharacterView.prototype, "name", {
        get: function () {
            return new SmartStringAttribute(this.element.querySelector(".name"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "title", {
        get: function () {
            return new SmartStringAttribute(this.element.querySelector(".title"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "lux", {
        get: function () {
            return new SmartStringAttribute(this.element.querySelector(".lux .current"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "umbra", {
        get: function () {
            return new SmartStringAttribute(this.element.querySelector(".umbra .current"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "secunda", {
        get: function () {
            return new SmartStringAttribute(this.element.querySelector(".secunda .current"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "notes", {
        get: function () {
            return new SmartStringAttribute(this.element.querySelector(".notes .current"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "level", {
        get: function () {
            return new Attribute(this.element.querySelector(".level"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "flesh", {
        get: function () {
            return new Attribute(this.element.querySelector(".flesh"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "spirit", {
        get: function () {
            return new Attribute(this.element.querySelector(".spirit"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "essence", {
        get: function () {
            return new Attribute(this.element.querySelector(".essence"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "hp", {
        get: function () {
            return new AttributeWithMax(this.element.querySelector(".hp"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "debt", {
        get: function () {
            return new Attribute(this.element.querySelector(".debt"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "arcana", {
        get: function () {
            return new AttributeWithMax(this.element.querySelector(".arcana"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "focus", {
        get: function () {
            return new AttributeWithMaxActivable(this.element.querySelector(".focus"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "power", {
        get: function () {
            return new AttributeWithMaxActivable(this.element.querySelector(".power"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "proficiency", {
        get: function () {
            return new AttributeActivable(this.element.querySelector(".proficiency"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "secret", {
        get: function () {
            return new AttributeActivable(this.element.querySelector(".secret"));
        },
        enumerable: false,
        configurable: true
    });
    return LocalCharacterView;
}());
function rollTypeToString(rollType) {
    if (rollType == 'Jsoin') {
        return "<i>Soigne</i>";
    }
    else if (rollType == 'JM') {
        return "lance un <i>Sort</i>";
    }
    else if (rollType == 'JAF') {
        return "utilise une <i>Arcane Fixe</i>";
    }
    else if (rollType == 'JAS') {
        return "utilise une <i>Arcane d'Esprit</i>";
    }
    else if (rollType == 'JAE') {
        return "utilise une <i>Arcane d'Essence</i>";
    }
    else if (rollType == 'JC') {
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
    //@ts-expect-error
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
        jetPNJ(char, action, new_pnj_stat_value, char.querySelector('.use_pf').checked, char.querySelector('.use_pp').checked, char.querySelector('.use_ra').checked, char.querySelector('.use_sc').checked, char.querySelector('.use_dc').checked, elem.closest('.roll').dataset.rollid);
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
    var success = 'et obtient <span title="Juge12: '
        + countSuccessesWith(roll.dice_results, [1], [2], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + ', Juge34: '
        + countSuccessesWith(roll.dice_results, [3], [4], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0)) + '">'
        + countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + " succès</span>";
    var roll_string = " ";
    if (roll.roll_type == "JAF") {
        roll_string = "";
        success = "";
    }
    else if (roll.hidden_dice == false || nompj == "mj") {
        roll_string = " :<br />" + formatRollResults(roll.dice_results) + "<br />";
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
        + roll_string
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
function updateCharactersOnPage() {
    document.querySelectorAll("body > .main .character").forEach(function (e) { return updateCharacter(e); });
}
function createCharacter(name) {
    var characterElement = document.querySelector(".templates > .character").cloneNode(true);
    var character = new LocalCharacterView(characterElement);
    character.name.current = name;
    return characterElement;
}
function updateCharacter(characterElement) {
    var name = characterElement.querySelector(".name .current").innerHTML;
    fetch('/lsr/getcar/' + name + "?json")
        .then(function (response) { return response.text(); })
        .then(function (text) {
        var characterFromDatabase = JSON.parse(text);
        var character = new LocalCharacterView(characterElement);
        character.updateFromDatabase(characterFromDatabase);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    var cb = function () {
        updateCharactersOnPage();
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
    }).then(function () { return afficher(nompj); });
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
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusPv(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pv/1/true')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsAk(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/false')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusAk(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/true')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsDt(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/false')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusDt(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/true')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsPf(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/false')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusPf(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/true')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function moinsPp(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/false')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function plusPp(nompj) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/true')
        .then(function () { return getCar(nompj); })
        .catch(function (e) {
        console.error("error", e);
    });
}
function loadLancerJdSvM(name) {
    fetch('/lancer_empirique/' + name + '/1d20/true').then(function () { return getCar(nompj); });
}
