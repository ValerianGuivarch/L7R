function afficher() {
    const chat = document.querySelector('#chat');
    fetch('/afficher/'+nompj+'/false').then((response) => response.text()).then(text => {
        chat.innerHTML = text;
    }).catch(function(e) {
        console.error("error", e);
    });
    getCar(nompj);
}

setInterval(afficher, 2000);
afficher();

function getCar(name) {
 fetch('/lsr/getcar/'+name)
 .then((response) => response.text())
  .then(json => {
    const obj = JSON.parse(json);
    const pv = document.querySelector('#pv');
    pv.innerHTML = obj.point_de_vie;
    const dettes = document.querySelector('#dettes');
    dettes.innerHTML = obj.dettes;
    const arcanes = document.querySelector('#arcanes');
    arcanes.innerHTML = obj.arcanes;
    const pf = document.querySelector('#pf');
    pf.innerHTML = obj.point_de_focus;
    const pp = document.querySelector('#pp');
    pp.innerHTML = obj.point_de_pouvoir;

     }).catch(function(e) {
        console.error("error", e);
    });
}

function loadLancer(name, action, pf, pp, ra, sec){
    console.log(sec)
    fetch('/lancer/'+name+'/'+action+'/'+pf+'/'+pp+'/'+ra+'/'+malus+'/'+bonus+'/'+sec);
}

function loadLancerEmpirique(sec){
    var valeur = prompt("Quel lancer de dé ?");

    fetch('/lancer_empirique/'+nompj+'/'+valeur+'/'+sec).catch(function(e) {
        console.error("error", e);
    });
    }

var malus = 0;
var bonus = 0;

function moinsMalus(){
    if(malus>0){
        malus=malus-1
        document.querySelector('#malus').innerHTML = malus;
    }
}

function plusMalus(){
    malus=malus+1
    document.querySelector('#malus').innerHTML = malus;
}



function moinsBonus(){
    if(bonus>0){
        bonus=bonus-1
        document.querySelector('#bonus').innerHTML = bonus;
    }
}

function plusBonus(){
    bonus=bonus+1
    document.querySelector('#bonus').innerHTML = bonus;
}



function moinsPv(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/pv/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusPv(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/pv/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
}



function moinsAk(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/arcanes/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusAk(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/arcanes/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
}



function moinsDt(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/dettes/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusDt(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/dettes/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
}

