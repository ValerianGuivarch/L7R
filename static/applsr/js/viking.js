function afficher() {
    const chat = document.querySelector('#chat');
    fetch('/afficher/'+nompj+'/false').then((response) => response.text()).then(text => {
        chat.innerHTML = text;
    }).catch(function(e) {
        console.error("error", e);
    });
    getVik(nompj);
}

setInterval(afficher, 2000);
afficher();

function getVik(name) {
 fetch('/vik/getcar/'+name)
 .then((response) => response.text())
  .then(json => {
    const obj = JSON.parse(json);
    const pv = document.querySelector('#pv');
    pv.innerHTML = obj.point_de_vie;
    const dettes = document.querySelector('#magie');
    dettes.innerHTML = obj.point_de_pouvoir;

     }).catch(function(e) {
        console.error("error", e);
    });
}

function loadLancer(name, action){
    fetch('/lancer_viking/'+name+'/'+action+'/'+malus+'/'+bonus);
}


function loadLancerDuel(name, action){
    fetch('/lancer_viking/'+name+'/duel/0/0');
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
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs_viking/'+nompj+'/pv/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusPv(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs_viking/'+nompj+'/pv/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
    }



function moinsMg(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs_viking/'+nompj+'/magie/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusMg(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs_viking/'+nompj+'/magie/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
}

