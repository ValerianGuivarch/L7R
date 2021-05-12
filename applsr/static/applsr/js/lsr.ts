/// <reference path="lsr.d.ts" />


let somethingIsNotSaved = false;
let display_secret = false; // override value from lsr.js


function getCurrentCharacter(): HTMLElement | null {
    const characterElements = document.querySelectorAll<HTMLElement>(".main .character");
    if(characterElements.length == 0) {
        return null;
    }
    else if(characterElements.length == 1) {
        return characterElements[0];
    }
    else {
        return document.querySelector<HTMLElement>('input[name="activeCharacter"]:checked')?.closest<HTMLElement>(".character") ?? null;
    }
}


class WithLabel {
    constructor(protected element: HTMLElement) { }

    public get label(): string {
        return this.element.querySelector(".label")!.innerHTML;
    }

    public set label(value: string) {
        const label = this.element.querySelector(".label")!;
        if(label.innerHTML != value.toString()) {
            label.innerHTML = value.toString();
        }
    }
}


class Attribute extends WithLabel {
    constructor(element: HTMLElement) {
        super(element);
    }

    public get current(): number {
        return parseInt(this.element.querySelector(".current")!.innerHTML);
    }

    public set current(value: number) {
        const current = this.element.querySelector(".current")!;
        if(current.innerHTML != value.toString()) {
            current.innerHTML = value.toString();
        }
    }
}


class AttributeWithMax extends Attribute {
    constructor(element: HTMLElement) {
        super(element);
    }

    public get max(): number {
        return parseInt(this.element.querySelector(".max")!.innerHTML);
    }

    public set max(value: number) {
        const max = this.element.querySelector(".max")!;
        if(max.innerHTML != value.toString()) {
            max.innerHTML = value.toString();
        }
    }
}


class TextInputAttribute {
    private onChangeCb: ((attr: TextInputAttribute) => void) | null = null;
    constructor(protected element: HTMLElement) { }

    public get current(): string {
        const current = this.element.querySelector<HTMLInputElement | HTMLTextAreaElement>(".current")!;
        return current.value;
    }

    public set current(value: string) {
        let current = this.element.querySelector<HTMLInputElement | HTMLTextAreaElement>(".current")!;
        if(current.dataset.commitNeeded === "true") {
            return;
        }
        
        if(current.value != value.toString()) {
            current.value = value.toString();
            if(this.onChangeCb != null) {
                this.onChangeCb(this);
            }
        }
    }

    public onChange(cb: (attr: TextInputAttribute) => void) {
        this.onChangeCb = cb;
    }
}


class SmartStringAttribute {
    private onChangeCb: ((attr: SmartStringAttribute) => void) | null = null;
    constructor(protected element: HTMLElement) { }

    public get current(): string {
        const current = this.element.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLElement>(".current")!;
        if("value" in current) {
            return current.value;
        }
        return current.innerHTML;
    }

    public set current(value: string) {
        let current = this.element.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLElement>(".current");
        if(current == null) {
            current = this.element;
        }
        
        if("value" in current) {
            if(current.value != value.toString()) {
                current.value = value.toString();
                if(this.onChangeCb != null) {
                    this.onChangeCb(this);
                }
            }
        }
        else {
            if(current.innerHTML != value.toString()) {
                current.innerHTML = value.toString();
                if(this.onChangeCb != null) {
                    this.onChangeCb(this);
                }
            }
        }
    }

    public onChange(cb: (attr: SmartStringAttribute) => void) {
        this.onChangeCb = cb;
    }
}


class AttributeWithoutValueActivable extends WithLabel {
    constructor(element: HTMLElement) {
        super(element);
    }

    public get enabled(): boolean {
        return this.element.querySelector<HTMLInputElement>(".enabled input")!.checked;
    }

    public set enabled(value: boolean) {
        this.element.querySelector<HTMLInputElement>(".enabled input")!.checked = value;
    }
}


class AttributeActivable extends Attribute {
    constructor(element: HTMLElement) {
        super(element);
    }

    public get current(): number {
        if(this.enabled) {
            return parseInt(this.element.querySelector(".current")!.innerHTML);
        }
        else {
            return 0;
        }
    }

    public set current(value: number) {
        const current = this.element.querySelector(".current")!;
        if(current.innerHTML != value.toString()) {
            current.innerHTML = value.toString();
        }
    }

    public get enabled(): boolean {
        return this.element.querySelector<HTMLInputElement>(".enabled input")!.checked;
    }

    public set enabled(value: boolean) {
        this.element.querySelector<HTMLInputElement>(".enabled input")!.checked = value;
    }
}


class AttributeWithMaxActivable extends AttributeWithMax {
    constructor(element: HTMLElement) {
        super(element);
    }

    public get enabled(): boolean {
        return this.element.querySelector<HTMLInputElement>(".enabled input")!.checked;
    }

    public set enabled(value: boolean) {
        this.element.querySelector<HTMLInputElement>(".enabled input")!.checked = value;
    }
}


class LocalCharacterView {
    constructor(private element: HTMLElement) {
    }

    public isOnline(): boolean {
        return !this.element.classList.contains("npc");
    }

    updateFromDatabase(characterFromDatabase: CharacterFromDatabase) {
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
        if(characterFromDatabase.force2) {
            this.proficiency.label += " / " + characterFromDatabase.force2;
        }
        this.notes.current = characterFromDatabase.notes ?? "";
        this.portrait = characterFromDatabase.name + ".png";
        this.category.current = characterFromDatabase.category;
    }

    localUpdate(prop: Thing, max: boolean, value: string | number) {
        if(prop == "portrait" || prop == "proficiency" || prop == "secret") {
            console.log("Should probably do nothing when localUpdate called on", prop);
        }
        else {
            const attr = this[prop];
            if(attr instanceof SmartStringAttribute || attr instanceof TextInputAttribute) {
                if(typeof (value) != "string") {
                    throw new Error("wrong type for value: " + value);
                }
                attr.current = value
            }
            else {
                if(typeof (value) != "number") {
                    throw new Error("wrong type for value: " + value);
                }
                if(max) {
                    if(!(attr instanceof AttributeWithMax || attr instanceof AttributeWithMaxActivable)) {
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

    public get id(): string | undefined {
        return this.element.dataset.id;
    }

    public set id(id: string | undefined) {
        this.element.dataset.id = id;
    }

    public get name(): SmartStringAttribute {
        const attr = new SmartStringAttribute(this.element.querySelector(".name")!);
        if(!isGm()) {
            attr.onChange(attr => {
                history.pushState(null, "", "/lsr/" + attr.current);
            });
        }
        return attr;
    }

    public get title(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".title")!);
    }

    public get lux(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".lux")!);
    }

    public get umbra(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".umbra")!);
    }

    public get secunda(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".secunda")!);
    }

    public get notes(): TextInputAttribute {
        return new TextInputAttribute(this.element.querySelector(".notes")!);
    }

    public get level(): Attribute {
        return new Attribute(this.element.querySelector(".level")!);
    }

    public get flesh(): Attribute {
        return new Attribute(this.element.querySelector(".flesh")!);
    }

    public get spirit(): Attribute {
        return new Attribute(this.element.querySelector(".spirit")!);
    }

    public get essence(): Attribute {
        return new Attribute(this.element.querySelector(".essence")!);
    }

    public get blessing(): Attribute {
        return new Attribute(this.element.querySelector(".blessing")!);
    }

    public get curse(): Attribute {
        return new Attribute(this.element.querySelector(".curse")!);
    }

    public get curse2(): AttributeActivable {
        return new AttributeActivable(this.element.querySelector(".curse2")!);
    }

    private hpTimeoutSet = false;// necessary to avoid infinitly starting timeouts
    public get hp(): AttributeWithMax {
        if(this.hpTimeoutSet == false) {
            setTimeout(() => { // TODO this is ugly, there must be a better way! Probably like the onChange done for the name property
                let curse2 = Math.floor((this.hp.max - this.hp.current) / 6)
                if(curse2 < 0) {
                    curse2 = 0;
                }
                this.curse2.current = curse2;
                this.hpTimeoutSet = false;
            }, 1);
            this.hpTimeoutSet = true;
        }
        return new AttributeWithMax(this.element.querySelector(".hp")!);
    }

    public get debt(): Attribute {
        return new Attribute(this.element.querySelector(".debt")!);
    }

    public get arcana(): AttributeWithMax {
        return new AttributeWithMax(this.element.querySelector(".arcana")!);
    }

    public get focus(): AttributeWithMaxActivable {
        return new AttributeWithMaxActivable(this.element.querySelector(".focus")!);
    }

    public get power(): AttributeWithMaxActivable {
        return new AttributeWithMaxActivable(this.element.querySelector(".power")!);
    }

    public get proficiency(): AttributeWithoutValueActivable {
        return new AttributeWithoutValueActivable(this.element.querySelector(".proficiency")!);
    }

    public get secret(): AttributeWithoutValueActivable {
        return new AttributeWithoutValueActivable(this.element.querySelector(".secret")!);
    }

    public get hidden(): AttributeWithoutValueActivable {
        return new AttributeWithoutValueActivable(this.element.querySelector(".hidden-number")!);
    }

    public set portrait(basename: string) {
        const portrait = this.element.querySelector<HTMLImageElement>(".portrait img")!;
        const src = "/static/applsr/" + basename;
        if(portrait.attributes.getNamedItem("src")?.nodeValue != src) {
            portrait.src = src;
        }
    }

    public get category(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".category")!);
    }
}


function rollTypeToString(rollType: RollTypeBackend) {
    if(rollType == 'Jsoin') {
        return "<i>Soigne</i>";
    }
    else if(rollType == 'JM') {
        return "lance un <i>Sort</i>";
    }
    else if(rollType == 'JAF') {
        return "utilise une <i>Arcane Fixe</i>";
    }
    else if(rollType == 'JAS') {
        return "utilise une <i>Arcane d'Esprit</i>";
    }
    else if(rollType == 'JAE') {
        return "utilise une <i>Arcane d'Essence</i>";
    }
    else if(rollType == 'JC') {
        return "fait un <i>jet de Chair</i>";
    }
    else if(rollType == 'JS') {
        return "fait un <i>jet d'Esprit</i>";
    }
    else if(rollType == 'JE') {
        return "fait un <i>jet d'Essence</i>";
    }
    else if(rollType == 'Jmort') {
        return "fait un <i>jet de Sauvegarde contre la Mort</i>";
    }
    else if(rollType.indexOf('Jemp-') === 0) {
        return "fait un <i>jet empirique</i> (" + rollType.split("-")[1] + ")";
    }
    else {
        return rollType + "?";
    }
}


const diceTable = ["?", "&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"];
function formatRollResults(dice_results: number[], rollType: RollType, symbol = true) {
    var str = "";
    for(var result of dice_results) {
        let diceText: string;
        if(symbol && (
            rollType == "flesh" ||
            rollType == "spirit" ||
            rollType == "essence" ||
            rollType == "arcana-essence" ||
            rollType == "arcana-spirit" ||
            rollType == "heal" ||
            rollType == "magic"
        )) {
            diceText = '<span class="dice">' + diceTable[result] + '</span>';
        }
        else {
            diceText = '[&nbsp;' + result + '&nbsp;]';
        }
        if(result == 6) {
            str += ' <span class="two-success">' + diceText + '</span> ';
        }
        else if(result == 5) {
            str += ' <span class="one-success">' + diceText + '</span> ';
        }
        else {
            str += ' ' + diceText + ' ';
        }
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


function isGm(): boolean {
    return document.body.classList.contains("gm-page");
}


function resist(elem: HTMLElement, action: RollType) {
    const char = getCurrentCharacter();
    const parentRollId = elem.closest<HTMLElement>(".roll")?.dataset.rollid ?? null;
    if(char == null) {
        throw new Error("Can't find an active character");
    }
    else {
        let character = new LocalCharacterView(char);
        autoRoll2(character, action, parentRollId);
    }
}


function jsonRollToHtml(roll: Roll, sub: boolean = false) {
    let tr = document.createElement("tr");

    let secret = ""
    if(roll.secret == true) {
        secret = "(secret) ";
    }

    let benemal = "";
    if(roll.malediction_count > 0 && roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions et " + roll.malediction_count + " malédictions, "
    }
    else if(roll.malediction_count > 0) {
        benemal = "Avec " + roll.malediction_count + " malédictions, "
    }
    else if(roll.benediction_count > 0) {
        benemal = "Avec " + roll.benediction_count + " bénédictions, "
    }

    let pp = "";
    if(roll.pp == true) {
        pp = " en y mettant toute sa <i>puissance</i> ";
    }

    let pf = "";
    if(roll.pf == true) {
        pf = " se <i>concentre</i> et "
    }

    let ra = "";
    if(roll.ra == true) {
        ra = ", grâce à son <i>héritage latent</i>"
    }

    let delta = "";
    if(roll.parent_roll != null) {
        let parentSuccessCount = countSuccessesWith(roll.parent_roll.dice_results, [5], [6], (roll.parent_roll.pp ? 1 : 0) + (roll.parent_roll.ra ? 1 : 0));
        let thisSuccessCount = countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0));
        let diff = parentSuccessCount - thisSuccessCount;
        delta = " Delta: " + diff + " ";
        if(diff <= 0) {
            delta += ' <span class="low">(aucun dégâts)</span>'
        }
        else {
            const dmg = Math.ceil(diff / 2);
            if(dmg >= 4) {
                delta += ' <span class="high">(' + dmg + ' dégâts)</span>.'
            }
            else if(dmg >= 1) {
                delta += ' <span class="medium">(' + dmg + ' dégâts)</span>.'
            }
            else {
                delta += ' <span class="low">(' + dmg + ' dégâts)</span>.'
            }
        }
    }

    let resist = "";
    if(sub == false) {
        resist = ' Résister avec <button onclick="resist(this, \'flesh\')">chair</button>'
            + '<button onclick="resist(this, \'spirit\')">esprit</button>'
            + '<button onclick="resist(this, \'essence\')">essence</button> ?';
    }

    let success = 'et obtient <span title="Juge12: '
        + countSuccessesWith(roll.dice_results, [1], [2], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + ', Juge34: '
        + countSuccessesWith(roll.dice_results, [3], [4], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0)) + '">'
        + countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + " succès</span>"

    let roll_string = " ";
    if(roll.roll_type == "JAF") {
        roll_string = "";
        success = "";
    }
    else if(roll.hidden_dice == false || isGm()) {
        roll_string = " :<br />" + formatRollResults(roll.dice_results, convertRollTypeBackendToFrontend(roll.roll_type)) + "<br />";
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


/** cid = Character ID */
function createCidParameterString(character: LocalCharacterView | HTMLElement | null, prefix = "&") {
    if(character == null) {
        return "";
    }
    let idParameterString = "";
    let id: string | undefined;
    if("dataset" in character) {
        id = character.dataset.id;
    }
    else {
        id = character.id;
    }
    if(id !== undefined) {
        idParameterString = prefix + "cid=" + id;
    }
    return idParameterString;
}


function updateChat() {
    let charName: string;
    let idParameterString = "";
    const char = getCurrentCharacter();
    if(isGm()) {
        charName = "mj";
    }
    else {
        charName = char!.querySelector(".name .current")!.innerHTML;
    }

    fetch('/afficher/' + charName + '/' + display_secret + '?json' + createCidParameterString(char)).then((response) => response.text()).then(text => {
        const chat = document.querySelector<HTMLElement>('#chat')!.firstElementChild as HTMLElement;
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


function updateCharactersOnPage() {
    document.querySelectorAll<HTMLElement>("body > .main .character:not(.npc)").forEach(e => updateCharacter(e));
}


function createCharacter(name: string, withRoller = true) {
    const characterElement = document.querySelector(".templates > .character")!.cloneNode(true) as HTMLElement;
    const character = new LocalCharacterView(characterElement);
    character.name.current = name;

    if(withRoller == true) {
        const rollerElement = document.querySelector(".templates > .roller")!.cloneNode(true) as HTMLElement;
        characterElement.appendChild(rollerElement);
    }

    return characterElement;
}


function createCharacterByCid(cid: string, withRoller = true) {
    const characterElement = document.querySelector(".templates > .character")!.cloneNode(true) as HTMLElement;
    const character = new LocalCharacterView(characterElement);
    character.id = cid;

    if(withRoller == true) {
        const rollerElement = document.querySelector(".templates > .roller")!.cloneNode(true) as HTMLElement;
        characterElement.appendChild(rollerElement);
    }

    return characterElement;
}


function updateCharacter(characterElement: HTMLElement) {
    const name = characterElement.querySelector<HTMLElement>(".name .current")!.innerHTML;
    fetch('/lsr/getcar/' + name + "?json" + createCidParameterString(characterElement))
        .then(response => response.text())
        .then(text => {
            const characterFromDatabase = JSON.parse(text) as CharacterFromDatabase;
            const character = new LocalCharacterView(characterElement);
            character.updateFromDatabase(characterFromDatabase);
        });
}


function thingToName(thing: Thing) {
    // "pv" "pv_max" "pf" "pf_max" "pp" "pp_max" "chair" "esprit" "essence" "dettes" "arcanes" "arcanes_max"
    if(thing == "name") {
        return "name";
    }
    else if(thing == "title") {
        return "titre";
    }
    else if(thing == "level") {
        return "niveau";
    }
    else if(thing == "portrait") {
        throw new Error("Makes no sense");
    }
    else if(thing == "flesh") {
        return "chair";
    }
    else if(thing == "spirit") {
        return "esprit";
    }
    else if(thing == "essence") {
        return "essence";
    }
    else if(thing == "lux") {
        return "fl";
    }
    else if(thing == "umbra") {
        return "fu";
    }
    else if(thing == "secunda") {
        return "fs";
    }
    else if(thing == "hp") {
        return "pv";
    }
    else if(thing == "debt") {
        return "dettes";
    }
    else if(thing == "arcana") {
        return "arcanes";
    }
    else if(thing == "focus") {
        return "pf";
    }
    else if(thing == "power") {
        return "pp";
    }
    else if(thing == "curse") {
        throw new Error("Makes no sense");
    }
    else if(thing == "curse2") {
        throw new Error("Makes no sense");
    }
    else if(thing == "blessing") {
        throw new Error("Makes no sense");
    }
    else if(thing == "proficiency") {
        return "force";
    }
    else if(thing == "secret") {
        throw new Error("Makes no sense");
    }
    else if(thing == "notes") {
        throw new Error("Not implemented");
    }
    else if(thing == "category") {
        return "category";
    }
}


function autoClick(sourceElement: HTMLElement) {
    const characterElement = sourceElement.closest<HTMLElement>(".character")!;
    const character = new LocalCharacterView(characterElement);
    const action = sourceElement.innerHTML as Action;
    const target = sourceElement.parentElement!.dataset.thing as Thing;

    let value: string | null = null;
    if(action == "Edit") {
        let currentElement = sourceElement.parentElement!.querySelector<HTMLElement>(".current");
        if(currentElement == null) {
            currentElement = sourceElement.parentElement!.querySelector<HTMLElement>(".label")!;
        }
        const currentValue = currentElement.innerHTML;
        const read = prompt(target + " ?", currentValue);
        if(read == null) {
            return;
        }
        value = read.replace(" / ", " | ");
    }
    else {
        value = "1";
    }

    let add = true;
    if(action == "-" || action == "--") {
        add = false;
    }
    let maxSuffix = "";
    if(action == "++" || action == "--") {
        maxSuffix = "_max";
    }

    let increment = 1;
    if(action == "-" || action == "--") {
        increment = -1;
    }

    if(target == "blessing" || target == "curse" || target == "curse2") {
        if(target == "blessing") {
            character.blessing.current += increment;
        }
        else if(target == "curse") {
            character.curse.current += increment;
        }
        else if(target == "curse2") {
            character.curse2.current += increment;
        }
    }
    else {
        if(!character.isOnline()) {
            if(action == "Edit") {
                character.localUpdate(target, maxSuffix == "_max", value);
            }
            else {
                character.localUpdate(target, maxSuffix == "_max", increment);
            }
        }
        else {
            const url = '/mj_interdit_aux_joueurs/modifs_valeurs/' + character.name.current + '/' + thingToName(target) + maxSuffix + '/' + value + '/' + add + createCidParameterString(characterElement, "?");
            fetch(url)
                .then(response => response.text())
                .then(text => {
                    const characterFromDatabase = JSON.parse(text) as CharacterFromDatabase;
                    character.updateFromDatabase(characterFromDatabase);
                });
        }
    }
}


function convertRollTypeToBackend(rollType: RollType): RollTypeBackend {
    //type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT' | JEMP;
    if(rollType == "flesh") {
        return "JC";
    }
    else if(rollType == "spirit") {
        return "JS";
    }
    else if(rollType == "essence") {
        return "JE";
    }
    else if(rollType == "death") {
        return "Jmort";
    }
    else if(rollType == "magic") {
        return "JM";
    }
    else if(rollType == "heal") {
        return 'Jsoin';
    }
    else if(rollType == "empirical") {
        return "Jemp-";
    }
    else if(rollType == "arcana") {
        return "JAF";
    }
    else if(rollType == "arcana-spirit") {
        return "JAS"
    }
    else if(rollType == "arcana-essence") {
        return "JAE";
    }
    throw new Error("unknown roll type: " + rollType);
}


function convertRollTypeBackendToFrontend(rollTypeBackend: RollTypeBackend): RollType {
    //type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT' | JEMP;
    if(rollTypeBackend == "JC") {
        return "flesh";
    }
    else if(rollTypeBackend == "JS") {
        return "spirit";
    }
    else if(rollTypeBackend == "JE") {
        return "essence";
    }
    else if(rollTypeBackend == "Jmort") {
        return "death";
    }
    else if(rollTypeBackend == "JM") {
        return "magic";
    }
    else if(rollTypeBackend == 'Jsoin') {
        return "heal";
    }
    else if(rollTypeBackend.indexOf("Jemp-") === 0) {
        return "empirical";
    }
    else if(rollTypeBackend == "JAF") {
        return "arcana";
    }
    else if(rollTypeBackend == "JAS") {
        return "arcana-spirit"
    }
    else if(rollTypeBackend == "JAE") {
        return "arcana-essence";
    }
    throw new Error("unknown roll type: " + rollTypeBackend);
}


function autoRoll(sourceElement: HTMLElement) {
    const characterElement = sourceElement.closest<HTMLElement>(".character")!;
    const rollType = sourceElement.dataset.roll as RollType;
    const character = new LocalCharacterView(characterElement);
    autoRoll2(character, rollType);
}


function autoRoll2(character: LocalCharacterView, rollType: RollType, parentRollId: string | null = null) {
    if(rollType == "empirical") {
        empiricalRoll(character.name.current, createCidParameterString(character), character.secret.enabled);
    }
    else if(rollType == "death") {
        const rollType2 = convertRollTypeToBackend(rollType);
        rollForServerCharacter(character.name.current, rollType2, character.focus.enabled, character.power.enabled, character.proficiency.enabled, character.secret.enabled, character.blessing.current, character.curse.current + character.curse2.current, character.hidden.enabled, createCidParameterString(character), parentRollId);
    }
    else {
        if(!character.isOnline()) {
            rollForLocalCharacter(character, rollType, character.hidden.enabled, parentRollId);
        }
        else {
            const rollType2 = convertRollTypeToBackend(rollType);
            rollForServerCharacter(character.name.current, rollType2, character.focus.enabled, character.power.enabled, character.proficiency.enabled, character.secret.enabled, character.blessing.current, character.curse.current + character.curse2.current, character.hidden.enabled, createCidParameterString(character), parentRollId);
        }
    }
}


function rollForServerCharacter(name: string, action: RollTypeBackend, pf: boolean, pp: boolean, ra: boolean, secret: boolean, bonus: number, malus: number, hidden: boolean, cidString: string, parentRollId: string | null = null) {
    fetch('/lancer/' + name + '/' + action + '/' + pf + '/' + pp + '/' + ra + '/' + malus + '/' + bonus + '/' + secret + '/' + hidden + '?parent_roll_id=' + parentRollId + cidString).then(() => updateChat());
}


function empiricalRoll(charName: string, cidString: string, secret: boolean) {
    var valeur = prompt("Quel lancer de dé ?", "1d6");

    fetch('/lancer_empirique/' + charName + '/' + valeur + '/' + secret + "?" + cidString).catch(function(e) {
        console.error("error", e);
    }).then(() => updateChat());
}


class DebouncedTimer {
    private timeoutId: number | undefined = undefined;
    private cb: (() => void);

    constructor(cb: () => void, private timeoutMs: number = 2000) {
        this.cb = () => {
            cb();
            this.timeoutId = setTimeout(this.cb, this.timeoutMs);
        }
    }

    public reset() {
        clearTimeout(this.timeoutId);
        console.log("reset");
        this.timeoutId = setTimeout(this.cb, this.timeoutMs);
    }
}


const notesInputTimer = new DebouncedTimer(sendNotesToServer, 2000);
function onNotesInput(source: HTMLTextAreaElement) {
    source.dataset.commitNeeded = "true";
    somethingIsNotSaved = true;
    notesInputTimer.reset();
}


function sendNotesToServer() {
    console.log("sending notes!");
    document.querySelectorAll<HTMLTextAreaElement>('.notes textarea[data-commit-needed="true"]').forEach(ta => {
        const charElem = ta.closest<HTMLElement>(".character")!;
        const char = new LocalCharacterView(charElem);
        fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + char.name.current + '/notes/post/true?' + createCidParameterString(char), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': document.querySelector<HTMLInputElement>('[name="csrfmiddlewaretoken"]')!.value},
            credentials: 'include',
            body: char.notes.current,
        }).then(() => {
            somethingIsNotSaved = false;
            delete ta.dataset.commitNeeded;
        });
    });
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
        if(somethingIsNotSaved === true) {
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