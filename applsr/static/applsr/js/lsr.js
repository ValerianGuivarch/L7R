"use strict";
/// <reference path="lsr.d.ts" />
// ### Utils
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
class DebouncedTimer {
    constructor(cb, timeoutMs = 2000) {
        this.timeoutMs = timeoutMs;
        this.timeoutId = undefined;
        this.cb = () => {
            cb();
            this.timeoutId = setTimeout(this.cb, this.timeoutMs);
        };
    }
    reset() {
        clearTimeout(this.timeoutId);
        console.log("reset");
        this.timeoutId = setTimeout(this.cb, this.timeoutMs);
    }
}
// ### RollAction
class BaseRollAction {
    constructor(rollType, forGmOnly, 
    /** Show only the number of successes */
    hideDiceResults, parentRollId = null) {
        this.rollType = rollType;
        this.forGmOnly = forGmOnly;
        this.hideDiceResults = hideDiceResults;
        this.parentRollId = parentRollId;
    }
}
class OneStatRollAction extends BaseRollAction {
    constructor(char, rollType, parentRollId, bonuses = {}) {
        var _a;
        super(rollType, char.secret.enabled, char.hidden.enabled, parentRollId);
        this.bonus = char.blessing.current + ((_a = bonuses.blessing) !== null && _a !== void 0 ? _a : 0);
        this.malus = char.curse.current + char.curse2.current;
        this.focusing = char.focus.enabled;
        this.powering = char.power.enabled;
        this.proficient = char.proficiency.enabled;
        this.relevantStatValue = OneStatRollAction.actionToStatValue(char, rollType);
    }
    static actionToStatValue(char, action) {
        if (action == "flesh") {
            return char.flesh.current;
        }
        else if (action == "spirit") {
            return char.spirit.current;
        }
        else if (action == "essence") {
            return char.essence.current;
        }
        else if (action == "magic") {
            return char.essence.current;
        }
        else if (action == "heal") {
            return char.essence.current;
        }
        else if (action == "arcana") {
            return 0;
        }
        else if (action == "arcana-spirit") {
            return char.spirit.current;
        }
        else if (action == "arcana-essence") {
            return char.essence.current;
        }
        else if (action == "death") {
            return 0;
        }
        assertNever(action);
    }
}
class EmpiricalRollAction extends BaseRollAction {
    constructor(char, formula, parentRollId) {
        super("empirical", char.secret.enabled, char.hidden.enabled, parentRollId);
        this.formula = formula;
    }
}
// ### Api
class LsrApi {
    constructor() {
        /** Must end with "/" */
        this.baseUrl = "/";
        this.csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
    }
    // TODO temporarily public, set to private after refactoring
    static createCidParameterString(cid, prefix = "&") {
        let idParameterString = "";
        if (cid !== undefined) {
            idParameterString = prefix + "cid=" + cid;
        }
        return idParameterString;
    }
    getChat(charName, showSecret, cid) {
        return fetch(this.baseUrl + 'afficher/' + charName + '/' + showSecret + '?json' + LsrApi.createCidParameterString(cid))
            .then(response => response.text()).then(t => JSON.parse(t));
    }
    getCharacter(charName, cid) {
        return fetch(this.baseUrl + 'lsr/getcar/' + charName + "?json" + LsrApi.createCidParameterString(cid))
            .then(response => response.text()).then(t => JSON.parse(t));
    }
    updateCharacter(charName, cid, target, maxSuffix, value, add) {
        return fetch(this.baseUrl + 'mj_interdit_aux_joueurs/modifs_valeurs/' + charName + '/' + thingToName(target) + maxSuffix + '/' + value + '/' + add + "?" + LsrApi.createCidParameterString(cid))
            .then(response => response.text()).then(t => JSON.parse(t));
    }
    rollForServerCharacter(char, ra, /** Only blessings and curses are used for now */ bonuses = {}) {
        var _a;
        return fetch(this.baseUrl + 'lancer/' + char.name.current + '/' + convertRollTypeToBackend(ra.rollType) + '/' + ra.focusing + '/' + ra.powering + '/' + ra.proficient + '/' + ra.malus + '/' + (ra.bonus + ((_a = bonuses.blessing) !== null && _a !== void 0 ? _a : 0)) + '/' + ra.forGmOnly + '/' + ra.hideDiceResults + '?parent_roll_id=' + ra.parentRollId + LsrApi.createCidParameterString(char.id));
    }
    empiricalRoll(char, ra) {
        return fetch(this.baseUrl + 'lancer_empirique/' + char.name.current + '/' + ra.formula + '/' + ra.forGmOnly + "?" + LsrApi.createCidParameterString(char.id));
    }
    sendNotes(charName, cid, notes) {
        return fetch(this.baseUrl + 'mj_interdit_aux_joueurs/modifs_valeurs/' + charName + '/notes/post/true?' + LsrApi.createCidParameterString(cid), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': this.csrfToken },
            credentials: 'include',
            body: notes,
        });
    }
    rollForLocalCharacter(char, ra) {
        const opposition = 0;
        return fetch(this.baseUrl + 'mj/lancer_pnj/' + char.name.current + '/' + convertRollTypeToBackend(ra.rollType) + '/' + ra.relevantStatValue + '/' + char.focus.enabled + '/' + char.power.enabled + '/' + char.proficiency.enabled + '/' + (char.curse.current + char.curse2.current) + '/' + char.blessing.current + '/' + char.secret.enabled + '/' + ra.hideDiceResults + '/' + opposition + '?parent_roll_id=' + ra.parentRollId + LsrApi.createCidParameterString(getCharId(char))).then(r => r.text());
    }
    createCharacter(character) {
        return fetch(this.baseUrl + 'mj_interdit_aux_joueurs/createcharacter/' + character.name.current + '/' + character.flesh.current + '/' + character.spirit.current + '/' + character.essence.current + '/' + character.hp.current + '/' + character.hp.max + '/' + character.focus.current + '/' + character.focus.max + '/' + character.power.current + '/' + character.power.max + '/' + character.level.current + '/' + character.arcana.current + '/' + character.arcana.max + '/' + character.debt.current + '/' + character.title.current + '/' + character.lux.current + '/' + character.secunda.current + '/' + character.umbra.current + '/' + character.proficiency.label + '/' + character.proficiency.label + '/true' + '/' + character.category.current)
            .then(response => response.text())
            .then(t => JSON.parse(t));
    }
    clearChat() {
        return fetch(this.baseUrl + 'mj_interdit_aux_joueurs/effacerLancersDes');
    }
}
const lsrApi = new LsrApi();
class WithLabel {
    constructor(element) {
        this.element = element;
    }
    get label() {
        return this.element.querySelector(".label").innerHTML;
    }
    set label(value) {
        const label = this.element.querySelector(".label");
        if (label.innerHTML != value.toString()) {
            label.innerHTML = value.toString();
        }
    }
}
class Attribute extends WithLabel {
    constructor(element) {
        super(element);
        this.onChangeCb = null;
    }
    onChange(cb) {
        this.onChangeCb = cb;
    }
    get current() {
        return parseInt(this.element.querySelector(".current").innerHTML);
    }
    set current(value) {
        const current = this.element.querySelector(".current");
        if (current.innerHTML != value.toString()) {
            current.innerHTML = value.toString();
            if (this.onChangeCb != null) {
                this.onChangeCb(this);
            }
        }
    }
}
class AttributeWithMax extends Attribute {
    constructor(element) {
        super(element);
    }
    get max() {
        return parseInt(this.element.querySelector(".max").innerHTML);
    }
    set max(value) {
        const max = this.element.querySelector(".max");
        if (max.innerHTML != value.toString()) {
            max.innerHTML = value.toString();
            if (this.onChangeCb != null) {
                this.onChangeCb(this);
            }
        }
    }
}
class TextInputAttribute {
    constructor(element) {
        this.element = element;
        this.onChangeCb = null;
    }
    get current() {
        const current = this.element.querySelector(".current");
        return current.value;
    }
    set current(value) {
        let current = this.element.querySelector(".current");
        if (current.dataset.commitNeeded === "true") {
            return;
        }
        if (current.value != value.toString()) {
            current.value = value.toString();
            if (this.onChangeCb != null) {
                this.onChangeCb(this);
            }
        }
    }
    onChange(cb) {
        this.onChangeCb = cb;
    }
}
class SmartStringAttribute {
    constructor(element) {
        this.element = element;
        this.onChangeCb = null;
    }
    onChange(cb) {
        this.onChangeCb = cb;
    }
    get current() {
        const current = this.element.querySelector(".current");
        if ("value" in current) {
            return current.value;
        }
        return current.innerHTML;
    }
    set current(value) {
        let current = this.element.querySelector(".current");
        if (current == null) {
            current = this.element;
        }
        if ("value" in current) {
            if (current.value != value.toString()) {
                current.value = value.toString();
                if (this.onChangeCb != null) {
                    this.onChangeCb(this);
                }
            }
        }
        else {
            if (current.innerHTML != value.toString()) {
                current.innerHTML = value.toString();
                if (this.onChangeCb != null) {
                    this.onChangeCb(this);
                }
            }
        }
    }
}
class AttributeWithoutValueActivable extends WithLabel {
    constructor(element) {
        super(element);
    }
    get enabled() {
        return this.element.querySelector(".enabled input").checked;
    }
    set enabled(value) {
        this.element.querySelector(".enabled input").checked = value;
    }
}
class AttributeActivable extends Attribute {
    constructor(element) {
        super(element);
    }
    get current() {
        if (this.enabled) {
            return parseInt(this.element.querySelector(".current").innerHTML);
        }
        else {
            return 0;
        }
    }
    set current(value) {
        const current = this.element.querySelector(".current");
        if (current.innerHTML != value.toString()) {
            current.innerHTML = value.toString();
        }
    }
    get enabled() {
        return this.element.querySelector(".enabled input").checked;
    }
    set enabled(value) {
        this.element.querySelector(".enabled input").checked = value;
    }
}
class AttributeWithMaxActivable extends AttributeWithMax {
    constructor(element) {
        super(element);
    }
    get enabled() {
        return this.element.querySelector(".enabled input").checked;
    }
    set enabled(value) {
        this.element.querySelector(".enabled input").checked = value;
    }
}
class LocalCharacterView {
    constructor(element) {
        this.element = element;
        this.hpTimeoutSet = false; // necessary to avoid infinitly starting timeouts
    }
    static fromElement(element) {
        let instance = this.instances.get(element);
        if (instance === undefined) {
            instance = new LocalCharacterView(element);
            this.instances.set(element, instance);
        }
        return instance;
    }
    isOnline() {
        return !this.element.classList.contains("npc");
    }
    updateFromDatabase(characterFromDatabase) {
        var _a;
        this.id = characterFromDatabase.id.toString();
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
        this.category.current = characterFromDatabase.category;
    }
    localUpdate(prop, max, value) {
        if (prop == "portrait" || prop == "proficiency" || prop == "secret") {
            console.log("Should probably do nothing when localUpdate called on", prop);
        }
        else {
            const attr = this[prop];
            if (attr instanceof SmartStringAttribute || attr instanceof TextInputAttribute) {
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
    }
    get id() {
        return this.element.dataset.id;
    }
    set id(id) {
        this.element.dataset.id = id;
    }
    get name() {
        const attr = new SmartStringAttribute(this.element.querySelector(".name"));
        if (!isGm()) {
            attr.onChange(attr => {
                history.pushState(null, "", "/lsr/" + attr.current);
            });
        }
        return attr;
    }
    get title() {
        return new SmartStringAttribute(this.element.querySelector(".title"));
    }
    get lux() {
        return new SmartStringAttribute(this.element.querySelector(".lux"));
    }
    get umbra() {
        return new SmartStringAttribute(this.element.querySelector(".umbra"));
    }
    get secunda() {
        return new SmartStringAttribute(this.element.querySelector(".secunda"));
    }
    get notes() {
        return new TextInputAttribute(this.element.querySelector(".notes"));
    }
    get level() {
        return new Attribute(this.element.querySelector(".level"));
    }
    get flesh() {
        return new Attribute(this.element.querySelector(".flesh"));
    }
    get spirit() {
        return new Attribute(this.element.querySelector(".spirit"));
    }
    get essence() {
        return new Attribute(this.element.querySelector(".essence"));
    }
    get blessing() {
        return new Attribute(this.element.querySelector(".blessing"));
    }
    get curse() {
        return new Attribute(this.element.querySelector(".curse"));
    }
    get curse2() {
        return new AttributeActivable(this.element.querySelector(".curse2"));
    }
    get hp() {
        const attr = new AttributeWithMax(this.element.querySelector(".hp"));
        attr.onChange(() => {
            // TODO this is ugly, there must be a better way! Probably like the onChange done for the name property
            let curse2 = Math.floor((this.hp.max - this.hp.current) / 6);
            if (curse2 < 0) {
                curse2 = 0;
            }
            this.curse2.current = curse2;
        });
        return attr;
    }
    get debt() {
        return new Attribute(this.element.querySelector(".debt"));
    }
    get arcana() {
        return new AttributeWithMax(this.element.querySelector(".arcana"));
    }
    get focus() {
        return new AttributeWithMaxActivable(this.element.querySelector(".focus"));
    }
    get power() {
        return new AttributeWithMaxActivable(this.element.querySelector(".power"));
    }
    get proficiency() {
        return new AttributeWithoutValueActivable(this.element.querySelector(".proficiency"));
    }
    get secret() {
        return new AttributeWithoutValueActivable(this.element.querySelector(".secret"));
    }
    get hidden() {
        return new AttributeWithoutValueActivable(this.element.querySelector(".hidden-number"));
    }
    set portrait(basename) {
        var _a;
        const portrait = this.element.querySelector(".portrait img");
        const src = "/static/applsr/" + basename;
        if (((_a = portrait.attributes.getNamedItem("src")) === null || _a === void 0 ? void 0 : _a.nodeValue) != src) {
            portrait.src = src;
        }
    }
    get category() {
        return new SmartStringAttribute(this.element.querySelector(".category"));
    }
}
LocalCharacterView.instances = new Map();
// ### Chat formatting
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
    else if (rollType == 'JAE') {
        return "utilise une <i>Arcane d'Essence</i>";
    }
    else if (rollType == 'JAS') {
        return "utilise une <i>Arcane d'Esprit</i>";
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
    else if (rollType == 'Jmort') {
        return "fait un <i>jet de Sauvegarde contre la Mort</i>";
    }
    else if (rollType.indexOf('Jemp-') === 0) {
        return "fait un <i>jet empirique</i> (" + rollType.split("-")[1] + ")";
    }
    else {
        return rollType + "?";
    }
}
const diceTable = ["?", "&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"];
function formatRollResults(dice_results, rollType, symbol = true) {
    var str = "";
    for (var result of dice_results) {
        let diceText;
        if (symbol && (rollType == "flesh" ||
            rollType == "spirit" ||
            rollType == "essence" ||
            rollType == "arcana-essence" ||
            rollType == "arcana-spirit" ||
            rollType == "heal" ||
            rollType == "magic")) {
            diceText = '<span class="dice">' + diceTable[result] + '</span>';
        }
        else {
            diceText = '[&nbsp;' + result + '&nbsp;]';
        }
        if (result == 6 && rollType != "empirical") {
            str += ' <span class="two-success">' + diceText + '</span> ';
        }
        else if (result == 5 && rollType != "empirical") {
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
    for (var result of dice_results) {
        if (countAsOne.indexOf(result) !== -1) {
            successCount += 1;
        }
        if (countAsTwo.indexOf(result) !== -1) {
            successCount += 2;
        }
    }
    return successCount + bonus;
}
function jsonRollToHtml(roll, sub = false) {
    let tr = document.createElement("tr");
    let secret = "";
    if (roll.secret == true) {
        secret = "(secret) ";
    }
    let benemal = "";
    if (roll.malediction_count > 0 && roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions et " + roll.malediction_count + " malédictions, ";
    }
    else if (roll.malediction_count > 0) {
        benemal = "Avec " + roll.malediction_count + " malédictions, ";
    }
    else if (roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions, ";
    }
    let pp = "";
    if (roll.pp == true) {
        pp = " en y mettant toute sa <i>puissance</i> ";
    }
    let pf = "";
    if (roll.pf == true) {
        pf = " se <i>concentre</i> et ";
    }
    let ra = "";
    if (roll.ra == true) {
        ra = ", grâce à son <i>héritage latent</i>";
    }
    let delta = "";
    if (roll.parent_roll != null) {
        let parentSuccessCount = countSuccessesWith(roll.parent_roll.dice_results, [5], [6], (roll.parent_roll.pp ? 1 : 0) + (roll.parent_roll.ra ? 1 : 0));
        let thisSuccessCount = countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0));
        let diff = parentSuccessCount - thisSuccessCount;
        delta = " Delta: " + diff + " ";
        if (diff <= 0) {
            delta += ' <span class="low">(aucun dégâts)</span>';
        }
        else {
            const dmg = Math.ceil(diff / 2);
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
    let resist = "";
    if (sub == false) {
        resist = '. '
            + '<span class="sub-roll-action resist">'
            + '<span class="sra-resist">'
            + '<span onclick="changeSubActionRoll(this.parentNode.parentNode);">Résister</span> avec '
            + '<button onclick="resist(this, \'flesh\')">chair</button>'
            + '<button onclick="resist(this, \'spirit\')">esprit</button>'
            + '<button onclick="resist(this, \'essence\')">essence</button>'
            + '</span>'
            + '<span class="sra-use-help">'
            + '<span onclick="changeSubActionRoll(this.parentNode.parentNode);">Se faire aider</span> avec '
            + '<button onclick="useHelp(this, \'flesh\')">h-chair</button>'
            + '<button onclick="useHelp(this, \'spirit\')">h-esprit</button>'
            + '<button onclick="useHelp(this, \'essence\')">h-essence</button>'
            + '</span>'
            + '</span>'
            + ' ?';
    }
    let success = "";
    const successCount56 = countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0));
    if (roll.roll_type.indexOf('Jemp-') !== 0 && roll.roll_type != "Jmort") {
        if (roll.hidden_dice == false || isGm()) {
            success = 'et obtient <span title="Juge12: '
                + countSuccessesWith(roll.dice_results, [1], [2], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
                + ', Juge34: '
                + countSuccessesWith(roll.dice_results, [3], [4], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0)) + '">'
                + successCount56
                + " succès</span>";
        }
        else {
            success = 'et obtient '
                + countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
                + " succès";
        }
    }
    else {
        resist = "";
    }
    let roll_string = " ";
    if (roll.roll_type == "JAF") { // JAF = Jet d'arcane fixe
        roll_string = "";
        success = "";
    }
    else if (roll.hidden_dice == false || isGm()) {
        roll_string = " :<br />" + formatRollResults(roll.dice_results, convertRollTypeBackendToFrontend(roll.roll_type)) + "<br />";
    }
    tr.innerHTML = ''
        + '<td class="roll" data-rollid="' + roll.id + '" data-char-name="' + roll.character + '" data-success-count="' + successCount56 + '">'
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
        + resist
        + delta
        + "</td>";
    return tr;
}
// ### LSR
let somethingIsNotSaved = false;
function getCurrentCharacter() {
    var _a, _b;
    const characterElements = document.querySelectorAll(".main .character");
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
function isGm() {
    return document.body.classList.contains("gm-page");
}
function resist(elem, action) {
    const char = getCurrentCharacter();
    const rollElement = elem.closest(".roll");
    const parentRollId = rollElement === null || rollElement === void 0 ? void 0 : rollElement.dataset.rollid;
    if (char == null) {
        throw new Error("Can't find an active character");
    }
    else {
        let character = LocalCharacterView.fromElement(char);
        autoRoll2(character, action, parentRollId);
    }
}
function useHelp(elem, action) {
    const rollElement = elem.closest(".roll");
    const char = getCurrentCharacter();
    const character = LocalCharacterView.fromElement(char);
    const parentRollId = rollElement === null || rollElement === void 0 ? void 0 : rollElement.dataset.rollid;
    console.log("useHelp for", elem);
    let blessingFromHelp = 0;
    rollElement.querySelectorAll("table .roll").forEach(e => {
        var _a;
        blessingFromHelp += parseInt((_a = e.dataset.successCount) !== null && _a !== void 0 ? _a : "0", 10);
    });
    rollForCharacter(character, action, undefined, { blessing: blessingFromHelp });
}
function getCharId(character) {
    if (character == null) {
        return undefined;
    }
    let id;
    if ("dataset" in character) {
        id = character.dataset.id;
    }
    else {
        id = character.id;
    }
    return id;
}
function updateChat() {
    let charName;
    let idParameterString = "";
    const charElem = getCurrentCharacter();
    if (isGm()) {
        charName = "mj";
    }
    else {
        charName = charElem.querySelector(".name .current").innerHTML;
    }
    lsrApi.getChat(charName, isGm(), getCharId(charElem)).then(chatHistory => {
        var _a;
        const chat = document.querySelector('#chat').firstElementChild;
        if (chatHistory.update == null || chat.dataset.update != chatHistory.update) {
            chat.innerHTML = "";
            chat.dataset.update = chatHistory.update;
            for (var roll of chatHistory.rolls) {
                var line = jsonRollToHtml(roll);
                var subtable = document.createElement("table");
                (_a = line.querySelector("td.roll")) === null || _a === void 0 ? void 0 : _a.appendChild(subtable);
                for (var related_roll of roll.related_rolls) {
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
    document.querySelectorAll("body > .main .character:not(.npc)").forEach(e => updateCharacter(e));
}
function createCharacter(name, withRoller = true) {
    const characterElement = document.querySelector(".templates > .character").cloneNode(true);
    const character = LocalCharacterView.fromElement(characterElement);
    character.name.current = name;
    if (withRoller == true) {
        const rollerElement = document.querySelector(".templates > .roller").cloneNode(true);
        characterElement.appendChild(rollerElement);
    }
    return characterElement;
}
function createCharacterByCid(cid, withRoller = true) {
    const characterElement = document.querySelector(".templates > .character").cloneNode(true);
    const character = LocalCharacterView.fromElement(characterElement);
    character.id = cid;
    if (withRoller == true) {
        const rollerElement = document.querySelector(".templates > .roller").cloneNode(true);
        characterElement.appendChild(rollerElement);
    }
    return characterElement;
}
function updateCharacter(characterElement) {
    const name = characterElement.querySelector(".name .current").innerHTML;
    lsrApi.getCharacter(name, getCharId(characterElement)).then(characterFromDatabase => {
        const character = LocalCharacterView.fromElement(characterElement);
        character.updateFromDatabase(characterFromDatabase);
    });
}
function thingToName(thing) {
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
    else if (thing == "category") {
        return "category";
    }
}
function autoClick(sourceElement) {
    const characterElement = sourceElement.closest(".character");
    const character = LocalCharacterView.fromElement(characterElement);
    const action = sourceElement.innerHTML;
    const target = sourceElement.parentElement.dataset.thing;
    let value = null;
    if (action == "Edit") {
        let currentElement = sourceElement.parentElement.querySelector(".current");
        if (currentElement == null) {
            currentElement = sourceElement.parentElement.querySelector(".label");
        }
        const currentValue = currentElement.innerHTML;
        const read = prompt(target + " ?", currentValue);
        if (read == null) {
            return;
        }
        value = read.replace(" / ", " | ");
    }
    else {
        value = "1";
    }
    let add = true;
    if (action == "-" || action == "--") {
        add = false;
    }
    let maxSuffix = "";
    if (action == "++" || action == "--") {
        maxSuffix = "_max";
    }
    let increment = 1;
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
        if (!character.isOnline()) {
            if (action == "Edit") {
                character.localUpdate(target, maxSuffix == "_max", value);
            }
            else {
                character.localUpdate(target, maxSuffix == "_max", increment);
            }
        }
        else {
            // TODO rework maxSuffix logic
            lsrApi.updateCharacter(character.name.current, getCharId(characterElement), target, maxSuffix, value, add)
                .then(characterFromDatabase => character.updateFromDatabase(characterFromDatabase));
        }
    }
}
function convertRollTypeToBackend(rollType) {
    //type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT' | JEMP;
    if (rollType == "flesh") {
        return "JC";
    }
    else if (rollType == "spirit") {
        return "JS";
    }
    else if (rollType == "essence") {
        return "JE";
    }
    else if (rollType == "death") {
        return "Jmort";
    }
    else if (rollType == "magic") {
        return "JM";
    }
    else if (rollType == "heal") {
        return 'Jsoin';
    }
    else if (rollType == "empirical") {
        return "Jemp-";
    }
    else if (rollType == "arcana") {
        return "JAF";
    }
    else if (rollType == "arcana-spirit") {
        return "JAS";
    }
    else if (rollType == "arcana-essence") {
        return "JAE";
    }
    throw new Error("unknown roll type: " + rollType);
}
function convertRollTypeBackendToFrontend(rollTypeBackend) {
    //type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT' | JEMP;
    if (rollTypeBackend == "JC") {
        return "flesh";
    }
    else if (rollTypeBackend == "JS") {
        return "spirit";
    }
    else if (rollTypeBackend == "JE") {
        return "essence";
    }
    else if (rollTypeBackend == "Jmort") {
        return "death";
    }
    else if (rollTypeBackend == "JM") {
        return "magic";
    }
    else if (rollTypeBackend == 'Jsoin') {
        return "heal";
    }
    else if (rollTypeBackend.indexOf("Jemp-") === 0) {
        return "empirical";
    }
    else if (rollTypeBackend == "JAF") {
        return "arcana";
    }
    else if (rollTypeBackend == "JAE") {
        return "arcana-essence";
    }
    else if (rollTypeBackend == "JAS") {
        return "arcana-spirit";
    }
    throw new Error("unknown roll type: " + rollTypeBackend);
}
function rollForServerCharacter(character, rollType, parentRollId, bonuses = {}) {
    const rollAction = new OneStatRollAction(character, rollType, parentRollId, bonuses);
    lsrApi.rollForServerCharacter(character, rollAction).then(updateChat);
}
function rollForCharacter(character, rollType, parentRollId, bonuses = {}) {
    if (!character.isOnline()) {
        rollForLocalCharacterAndApplyCosts(character, rollType, parentRollId, bonuses);
    }
    else {
        rollForServerCharacter(character, rollType, parentRollId, bonuses);
    }
}
function autoRoll(sourceElement) {
    const characterElement = sourceElement.closest(".character");
    const rollType = sourceElement.dataset.roll;
    const character = LocalCharacterView.fromElement(characterElement);
    autoRoll2(character, rollType);
}
function autoRoll2(character, rollType, parentRollId = undefined) {
    if (rollType == "empirical") {
        const formula = prompt("Quel lancer de dé ?", "1d6");
        if (formula == null) {
            return;
        }
        const rollAction = new EmpiricalRollAction(character, formula, parentRollId);
        lsrApi.empiricalRoll(character, rollAction).then(updateChat);
    }
    else if (rollType == "death") {
        const rollAction = new OneStatRollAction(character, rollType, parentRollId);
        lsrApi.rollForServerCharacter(character, rollAction).then(updateChat);
    }
    else {
        rollForCharacter(character, rollType, parentRollId);
    }
}
const notesInputTimer = new DebouncedTimer(sendNotesToServer, 2000);
function onNotesInput(source) {
    source.dataset.commitNeeded = "true";
    somethingIsNotSaved = true;
    notesInputTimer.reset();
}
function sendNotesToServer() {
    document.querySelectorAll('.notes textarea[data-commit-needed="true"]').forEach(ta => {
        const charElem = ta.closest(".character");
        const char = LocalCharacterView.fromElement(charElem);
        lsrApi.sendNotes(char.name.current, getCharId(char), char.notes.current).then(() => {
            somethingIsNotSaved = false;
            delete ta.dataset.commitNeeded;
        });
    });
}
function changeSubActionRoll(elem) {
    if (elem.classList.contains("resist")) {
        elem.classList.remove("resist");
        elem.classList.add("use-help");
    }
    else { // if(elem.classList.contains("use-help")) {
        elem.classList.add("resist");
        elem.classList.remove("use-help");
    }
}
function main() {
    document.addEventListener("DOMContentLoaded", () => {
        var cb = () => {
            updateCharactersOnPage();
            updateChat();
        };
        cb();
        setInterval(cb, 2000);
    });
    window.addEventListener("beforeunload", function (e) {
        if (somethingIsNotSaved === true) {
            var confirmationMessage = "Vous devriez revenir sur la page pendant quelques secondes, quelques chose est en train d'être sauvegardé.";
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }
        else {
            return undefined;
        }
    });
    notesInputTimer.reset();
}
main();
