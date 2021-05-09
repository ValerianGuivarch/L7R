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
var AttributeWithoutValueActivable = /** @class */ (function (_super) {
    __extends(AttributeWithoutValueActivable, _super);
    function AttributeWithoutValueActivable(element) {
        return _super.call(this, element) || this;
    }
    Object.defineProperty(AttributeWithoutValueActivable.prototype, "enabled", {
        get: function () {
            return this.element.querySelector(".enabled input").checked;
        },
        set: function (value) {
            this.element.querySelector(".enabled input").checked = value;
        },
        enumerable: false,
        configurable: true
    });
    return AttributeWithoutValueActivable;
}(WithLabel));
var AttributeActivable = /** @class */ (function (_super) {
    __extends(AttributeActivable, _super);
    function AttributeActivable(element) {
        return _super.call(this, element) || this;
    }
    Object.defineProperty(AttributeActivable.prototype, "current", {
        get: function () {
            if (this.enabled) {
                return parseInt(this.element.querySelector(".current").innerHTML);
            }
            else {
                return 0;
            }
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
}(Attribute));
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
function getCurrentCharacter() {
    var _a, _b;
    var characterElements = document.querySelectorAll(".main .character");
    if (characterElements.length == 0) {
        return null;
    }
    else if (characterElements.length == 1) {
        return characterElements[0];
    }
    else {
        return (_b = (_a = document.querySelector('input[name="activeCharacter"]:checked')) === null || _a === void 0 ? void 0 : _a.closest(".character")) !== null && _b !== void 0 ? _b : null;
    }
}
var LocalCharacterView = /** @class */ (function () {
    function LocalCharacterView(element) {
        this.element = element;
        this.hpTimeoutSet = false; // necessary to avoid infinitly startinf timeouts
    }
    LocalCharacterView.prototype.isOnline = function () {
        return !this.element.classList.contains("npc");
    };
    LocalCharacterView.prototype.updateFromDatabase = function (characterFromDatabase) {
        var _a;
        this.name.current = characterFromDatabase.name;
        this.title.current = characterFromDatabase.titre;
        this.level.current = characterFromDatabase.niveau;
        this.lux.current = characterFromDatabase.fl;
        this.umbra.current = characterFromDatabase.fu;
        this.secunda.current = characterFromDatabase.fs;
        this.flesh.current = characterFromDatabase.chair;
        this.spirit.current = characterFromDatabase.esprit;
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
        this.portrait = characterFromDatabase.name + ".png";
    };
    LocalCharacterView.prototype.localUpdate = function (prop, max, value) {
        if (prop == "portrait" || prop == "proficiency" || prop == "secret") {
            console.log("Should probably do nothing when localUpdate called on", prop);
        }
        else {
            var attr = this[prop];
            if (attr instanceof SmartStringAttribute) {
                if (typeof (value) != "string") {
                    throw new Error("wrong type for value: " + value);
                }
                attr.current = value;
            }
            else {
                if (typeof (value) != "number") {
                    throw new Error("wrong type for value: " + value);
                }
                if (max) {
                    if (!(attr instanceof AttributeWithMax || attr instanceof AttributeWithMaxActivable)) {
                        throw new Error("wrong type for value: " + value);
                    }
                    attr.max += value;
                }
                else {
                    attr.current += value;
                }
            }
        }
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
    Object.defineProperty(LocalCharacterView.prototype, "blessing", {
        get: function () {
            return new Attribute(this.element.querySelector(".blessing"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "curse", {
        get: function () {
            return new Attribute(this.element.querySelector(".curse"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "curse2", {
        get: function () {
            return new AttributeActivable(this.element.querySelector(".curse2"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "hp", {
        get: function () {
            var _this = this;
            if (this.hpTimeoutSet == false) {
                setTimeout(function () {
                    var curse2 = Math.floor((_this.hp.max - _this.hp.current) / 6);
                    if (curse2 < 0) {
                        curse2 = 0;
                    }
                    _this.curse2.current = curse2;
                    _this.hpTimeoutSet = false;
                }, 1);
                this.hpTimeoutSet = true;
            }
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
            return new AttributeWithoutValueActivable(this.element.querySelector(".proficiency"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "secret", {
        get: function () {
            return new AttributeWithoutValueActivable(this.element.querySelector(".secret"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "hidden", {
        get: function () {
            return new AttributeWithoutValueActivable(this.element.querySelector(".hidden-number"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalCharacterView.prototype, "portrait", {
        set: function (basename) {
            var portrait = this.element.querySelector(".portrait img");
            var src = "/static/applsr/" + basename;
            if (portrait.src != src) {
                portrait.src = src;
            }
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
    //@ts-expect-error
    else if (rollType.startsWith('Jemp-')) {
        return "fait un <i>jet empirique</i> (" + rollType.split("-")[1] + ")";
    }
    else {
        return rollType + "?";
    }
}
var diceTable = ["?", "&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"];
function formatRollResults(dice_results, symbol) {
    if (symbol === void 0) { symbol = true; }
    var str = "";
    for (var _i = 0, dice_results_1 = dice_results; _i < dice_results_1.length; _i++) {
        var result = dice_results_1[_i];
        var diceText = void 0;
        if (symbol && result <= 6) {
            diceText = '<span class="dice">' + diceTable[result] + '</span>';
        }
        else {
            diceText = '[&nbsp;' + result + '&nbsp;]';
        }
        if (result == 6) {
            str += ' <span class="two-success">' + diceText + '</span> ';
        }
        else if (result == 5) {
            str += ' <span class="one-success">' + diceText + '</span> ';
        }
        else {
            str += ' ' + diceText + ' ';
        }
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
    var _a, _b;
    var char = getCurrentCharacter();
    var parentRollId = (_b = (_a = elem.closest(".roll")) === null || _a === void 0 ? void 0 : _a.dataset.rollid) !== null && _b !== void 0 ? _b : null;
    if (char == null) {
        throw new Error("Can't find an active character");
    }
    else {
        var character = new LocalCharacterView(char);
        autoRoll2(character, action, parentRollId);
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
        if (diff <= 0) {
            delta += ' <span class="low">(aucun dégâts)</span>';
        }
        else {
            var dmg = Math.ceil(diff / 2);
            if (dmg >= 4) {
                delta += ' <span class="high">(' + dmg + ' dégâts)</span>.';
            }
            else if (dmg >= 1) {
                delta += ' <span class="medium">(' + dmg + ' dégâts)</span>.';
            }
            else {
                delta += ' <span class="low">(' + dmg + ' dégâts)</span>.';
            }
        }
    }
    var resist = "";
    if (sub == false) {
        resist = ' Résister avec <button onclick="resist(this, \'flesh\')">chair</button>'
            + '<button onclick="resist(this, \'spirit\')">esprit</button>'
            + '<button onclick="resist(this, \'essence\')">essence</button> ?';
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
    tr.innerHTML = ''
        + '<td class="roll" data-rollid="' + roll.id + '">'
        + new Date(roll.date).toLocaleTimeString().replace(" ", "&nbsp;")
        + " - "
        + secret // "(secret) "
        + benemal
        + "<b>" + roll.character + "</b>"
        + pf
        + " "
        + rollTypeToString(roll.roll_type)
        + pp
        + roll_string
        + success
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
        var chat = document.querySelector('#chat').firstElementChild;
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
    document.querySelectorAll("body > .main .character:not(.npc)").forEach(function (e) { return updateCharacter(e); });
}
function createCharacter(name, withRoller) {
    if (withRoller === void 0) { withRoller = true; }
    var characterElement = document.querySelector(".templates > .character").cloneNode(true);
    var character = new LocalCharacterView(characterElement);
    character.name.current = name;
    if (withRoller == true) {
        var rollerElement = document.querySelector(".templates > .roller").cloneNode(true);
        characterElement.appendChild(rollerElement);
    }
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
function thingToName(thing) {
    // "pv" "pv_max" "pf" "pf_max" "pp" "pp_max" "chair" "esprit" "essence" "dettes" "arcanes" "arcanes_max"
    if (thing == "name") {
        return "name";
    }
    else if (thing == "title") {
        return "titre";
    }
    else if (thing == "level") {
        return "niveau";
    }
    else if (thing == "portrait") {
        throw new Error("Makes no sense");
    }
    else if (thing == "flesh") {
        return "chair";
    }
    else if (thing == "spirit") {
        return "esprit";
    }
    else if (thing == "essence") {
        return "essence";
    }
    else if (thing == "lux") {
        return "fl";
    }
    else if (thing == "umbra") {
        return "fu";
    }
    else if (thing == "secunda") {
        return "fs";
    }
    else if (thing == "hp") {
        return "pv";
    }
    else if (thing == "debt") {
        return "dettes";
    }
    else if (thing == "arcana") {
        return "arcanes";
    }
    else if (thing == "focus") {
        return "pf";
    }
    else if (thing == "power") {
        return "pp";
    }
    else if (thing == "curse") {
        throw new Error("Makes no sense");
    }
    else if (thing == "curse2") {
        throw new Error("Makes no sense");
    }
    else if (thing == "blessing") {
        throw new Error("Makes no sense");
    }
    else if (thing == "proficiency") {
        return "force";
    }
    else if (thing == "secret") {
        throw new Error("Makes no sense");
    }
    else if (thing == "notes") {
        throw new Error("Not implemented");
    }
}
function autoClick(sourceElement) {
    var characterElement = sourceElement.closest(".character");
    var character = new LocalCharacterView(characterElement);
    var action = sourceElement.innerHTML;
    var target = sourceElement.parentElement.dataset.thing;
    var value = null;
    if (action == "Edit") {
        var currentElement = sourceElement.parentElement.querySelector(".current");
        if (currentElement == null) {
            currentElement = sourceElement.parentElement.querySelector(".label");
        }
        var currentValue = currentElement.innerHTML;
        var read = prompt(target + " ?", currentValue);
        if (read == null) {
            return;
        }
        value = read.replace(" / ", " | ");
    }
    else {
        value = "1";
    }
    var add = true;
    if (action == "-" || action == "--") {
        add = false;
    }
    var maxSuffix = "";
    if (action == "++" || action == "--") {
        maxSuffix = "_max";
    }
    var increment = 1;
    if (action == "-" || action == "--") {
        increment = -1;
    }
    if (target == "blessing" || target == "curse" || target == "curse2") {
        if (target == "blessing") {
            character.blessing.current += increment;
        }
        else if (target == "curse") {
            character.curse.current += increment;
        }
        else if (target == "curse2") {
            character.curse2.current += increment;
        }
    }
    else {
        if (character["element"].classList.contains("npc")) {
            if (action == "Edit") {
                character.localUpdate(target, maxSuffix == "_max", value);
            }
            else {
                character.localUpdate(target, maxSuffix == "_max", increment);
            }
        }
        else {
            var url = '/mj_interdit_aux_joueurs/modifs_valeurs/' + character.name.current + '/' + thingToName(target) + maxSuffix + '/' + value + '/' + add;
            fetch(url)
                .then(function (response) { return response.text(); })
                .then(function (text) {
                var characterFromDatabase = JSON.parse(text);
                character.updateFromDatabase(characterFromDatabase);
            });
        }
    }
}
function convertRollTypeToBackend(rollType2) {
    //type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT' | JEMP;
    if (rollType2 == "flesh") {
        return "JC";
    }
    else if (rollType2 == "spirit") {
        return "JS";
    }
    else if (rollType2 == "essence") {
        return "JE";
    }
    else if (rollType2 == "death") {
        return "Jmort";
    }
    else if (rollType2 == "magic") {
        return "JM";
    }
    else if (rollType2 == "heal") {
        return 'Jsoin';
    }
    else if (rollType2 == "empirical") {
        return "Jemp-";
    }
    else if (rollType2 == "arcana") {
        return "JAF";
    }
    else if (rollType2 == "arcana-spirit") {
        return "JAS";
    }
    else if (rollType2 == "arcana-essence") {
        return "JAE";
    }
    throw new Error("unknown roll type: " + rollType2);
}
function autoRoll(sourceElement) {
    var characterElement = sourceElement.closest(".character");
    var rollType = sourceElement.dataset.roll;
    var character = new LocalCharacterView(characterElement);
    autoRoll2(character, rollType);
}
function autoRoll2(character, rollType, parentRollId) {
    if (parentRollId === void 0) { parentRollId = null; }
    if (rollType == "empirical") {
        loadLancerEmpirique(character.name.current, character.secret.enabled);
    }
    else if (rollType == "death") {
        loadLancerJdSvM(character.name.current);
    }
    else {
        if (!character.isOnline()) {
            jetPNJ(character, rollType, character.hidden.enabled, parentRollId);
        }
        else {
            var rollType2 = convertRollTypeToBackend(rollType);
            loadLancer2(character.name.current, rollType2, character.focus.enabled, character.power.enabled, character.proficiency.enabled, character.secret.enabled, character.blessing.current, character.curse.current + character.curse2.current, character.hidden.enabled, parentRollId);
        }
    }
}
function loadLancer2(name, action, pf, pp, ra, secret, bonus, malus, hidden, parentRollId) {
    if (parentRollId === void 0) { parentRollId = null; }
    fetch('/lancer/' + name + '/' + action + '/' + pf + '/' + pp + '/' + ra + '/' + malus + '/' + bonus + '/' + secret + '/' + hidden + '?parent_roll_id=' + parentRollId).then(function () { return afficher(nompj); });
}
function getCar(name) {
    fetch('/lsr/getcar/' + name)
        .then(function (response) { return response.text(); })
        .then(function (json) {
        var obj = JSON.parse(json);
        var pv = document.querySelector('#pv');
        var pvMax = obj.point_de_vie_max;
        var prevPv = pv.innerHTML;
        pv.innerHTML = obj.point_de_vie;
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
function loadLancerEmpirique(nompj, secret) {
    var valeur = prompt("Quel lancer de dé ?", "1d6");
    fetch('/lancer_empirique/' + nompj + '/' + valeur + '/' + secret).catch(function (e) {
        console.error("error", e);
    }).then(function () { return afficher(nompj); });
}
function loadLancerJdSvM(name) {
    fetch('/lancer_empirique/' + name + '/1d20/true').then(function () { return afficher(nompj); });
}
