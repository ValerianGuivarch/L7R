declare var nompj: string; // set in html

type JEMP = `Jemp-${string}`;
type RollType = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'JCH' | 'JAG' | 'JCB' | 'JMG' | 'JSV' | 'JNV' | 'JNT'
    | JEMP;

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

class SmartStringAttribute {
    constructor(protected element: HTMLElement) { }

    public get current(): string {
        return this.element.querySelector(".current")!.innerHTML;
    }

    public set current(value: string) {
        let current = this.element.querySelector(".current");
        if(current == null) {
            current = this.element;
        }
        if(current.innerHTML != value.toString()) {
            current.innerHTML = value.toString();
        }
    }
}

class AttributeActivable extends WithLabel {
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

    updateFromDatabase(characterFromDatabase: CharacterFromDatabase) {
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
        if(characterFromDatabase.force2) {
            this.proficiency.label += " / " + characterFromDatabase.force2;
        }
        this.notes.current = characterFromDatabase.notes ?? "";
    }

    public get name(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".name")!);
    }

    public get title(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".title")!);
    }

    public get lux(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".lux .current")!);
    }

    public get umbra(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".umbra .current")!);
    }

    public get secunda(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".secunda .current")!);
    }

    public get notes(): SmartStringAttribute {
        return new SmartStringAttribute(this.element.querySelector(".notes .current")!);
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

    public get hp(): AttributeWithMax {
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

    public get proficiency(): AttributeActivable {
        return new AttributeActivable(this.element.querySelector(".proficiency")!);
    }

    public get secret(): AttributeActivable {
        return new AttributeActivable(this.element.querySelector(".secret")!);
    }
}

interface CharacterFromDatabase {
    name: string,
    titre: string,
    niveau: number,
    element: string,
    force1: string,
    force2: string | null,
    chair: number,
    esprit: number,
    essence: number,
    point_de_vie: number,
    point_de_vie_max: number,
    point_de_focus: number,
    point_de_focus_max: number,
    point_de_pouvoir: number,
    point_de_pouvoir_max: number,
    dettes: number,
    arcanes: number,
    arcanes_max: number,
    /** lux */
    fl: string,
    /** umbra */
    fu: string,
    /** secunda */
    fs: string,
    notes: string | undefined,
}

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
    ra: boolean,
    hidden_dice: boolean,
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
    //@ts-expect-error
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

function resist(elem: HTMLElement, action: RollType) {
    const char = getCurrentCharacter();
    if(char === null) {
        console.error("Cannot roll with no character");
        return;
    }
    else if(typeof(char) === "string") {
        loadLancer(char, action, document.querySelector<HTMLInputElement>('#use_pf')!.checked, document.querySelector<HTMLInputElement>('#use_pp')!.checked, document.querySelector<HTMLInputElement>('#use_ra')!.checked, document.querySelector<HTMLInputElement>('#use_sc')!.checked, elem.closest<HTMLElement>('.roll')!.dataset.rollid);
    }
    else {
        const new_pnj_name = char.querySelector(".name")!.innerHTML;
        const new_pnj_stat_value = parseInt(char.dataset[action.toLowerCase()]!);
        jetPNJ(char, action, new_pnj_stat_value, char.querySelector<HTMLInputElement>('.use_pf')!.checked, char.querySelector<HTMLInputElement>('.use_pp')!.checked, char.querySelector<HTMLInputElement>('.use_ra')!.checked, char.querySelector<HTMLInputElement>('.use_sc')!.checked, char.querySelector<HTMLInputElement>('.use_dc')!.checked, elem.closest<HTMLElement>('.roll')!.dataset.rollid);
    }
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

    var ra = "";
    if(roll.ra == true) {
        ra = ", grâce à son <i>héritage latent</i>"
    }

    var delta = "";
    if(roll.parent_roll != null) {
        var parentSuccessCount = countSuccessesWith(roll.parent_roll.dice_results, [5], [6], (roll.parent_roll.pp ? 1 : 0) + (roll.parent_roll.ra ? 1 : 0));
        var thisSuccessCount = countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0));
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
        resist = ' Résister avec <button class="btn resist" onclick="resist(this, \'JC\')">chair</button>'
            + '<button class="btn resist" onclick="resist(this, \'JS\')">esprit</button>'
            + '<button class="btn resist" onclick="resist(this, \'JE\')">essence</button> ?';
    }

    var success = 'et obtient <span title="Juge12: '
        + countSuccessesWith(roll.dice_results, [1], [2], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + ', Juge34: '
        + countSuccessesWith(roll.dice_results, [3], [4], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0)) + '">'
        + countSuccessesWith(roll.dice_results, [5], [6], (roll.pp ? 1 : 0) + (roll.ra ? 1 : 0))
        + " succès</span>"

    var roll_string = " ";
    if(roll.roll_type == "JAF") {
        roll_string = "";
        success = "";
    }
    else if(roll.hidden_dice == false || nompj == "mj") {
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

function updateCharactersOnPage() {
    document.querySelectorAll<HTMLElement>("body > .main .character").forEach(e => updateCharacter(e));
}

function createCharacter(name: string) {
    const characterElement = document.querySelector(".templates > .character")!.cloneNode(true) as HTMLElement;
    const character = new LocalCharacterView(characterElement);
    character.name.current = name;
    return characterElement;
}

function updateCharacter(characterElement: HTMLElement) {
    const name = characterElement.querySelector<HTMLElement>(".name")!.innerHTML;
    fetch('/lsr/getcar/' + name + "?json")
    .then(response => response.text())
    .then(text => {
        const characterFromDatabase = JSON.parse(text) as CharacterFromDatabase;
        const character = new LocalCharacterView(characterElement);
        character.updateFromDatabase(characterFromDatabase);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    var cb = () => {
        updateCharactersOnPage();
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

function loadLancer(name: string, action: RollType, pf: boolean, pp: boolean, ra: boolean, secret: boolean, parentRollId: string | null = null) {
    fetch('/lancer/' + name + '/' + action + '/' + pf + '/' + pp + '/' + ra + '/' + malus + '/' + bonus + '/' + secret + '/false?parent_roll_id=' + parentRollId).then(() => afficher(nompj));
}

function loadLancerEmpirique(nompj: string, secret: boolean) {
    var valeur = prompt("Quel lancer de dé ?", "1d6");

    fetch('/lancer_empirique/' + nompj + '/' + valeur + '/' + secret).catch(function(e) {
        console.error("error", e);
    }).then(() => afficher(nompj));
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
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function plusPv(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pv/1/true')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function moinsAk(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/false')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function plusAk(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/arcanes/1/true')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function moinsDt(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/false')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function plusDt(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/dettes/1/true')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function moinsPf(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/false')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function plusPf(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pf/1/true')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function moinsPp(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/false')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function plusPp(nompj: string) {
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/' + nompj + '/pp/1/true')
    .then(() => getCar(nompj))
    .catch(function(e) {
        console.error("error", e);
    });
}

function loadLancerJdSvM(name: string) {
    fetch('/lancer_empirique/' + name + '/1d20/true').then(() => getCar(nompj));
}
