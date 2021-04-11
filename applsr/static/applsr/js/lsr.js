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
    const pvMax = obj.point_de_vie_max;
    prevPv = pv.innerHTML;
    pv.innerHTML = obj.point_de_vie;

    if(prevPv != obj.point_de_vie){
        if((pvMax-obj.point_de_vie)%6 == 0 && prevPv > obj.point_de_vie && obj.point_de_vie!=pvMax){
            plusMalus()
        }
        if((pvMax-obj.point_de_vie)%6 == 5 && prevPv < obj.point_de_vie && obj.point_de_vie!=0){
            moinsMalus()
        }
    }

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

function loadLancer(name, action, pf, pp, ra, sec, pv, pvmax){
    //mal=malus-obj.point_de_focus
      //      car.point_de_vie,
        //    car.point_de_vie_max
    console.log('/lancer/'+name+'/'+action+'/'+pf+'/'+pp+'/'+ra+'/'+malus+'/'+bonus+'/'+sec+'/false')
    fetch('/lancer/'+name+'/'+action+'/'+pf+'/'+pp+'/'+ra+'/'+malus+'/'+bonus+'/'+sec+'/false');
}

function loadLancerEmpirique(sec){
    var valeur = prompt("Quel lancer de dé ?", "1d6");

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




function moinsPf(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/pf/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusPf(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/pf/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
}




function moinsPp(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/pp/1/false')
    .catch(function(e) {
        console.error("error", e);
    });
}
function plusPp(nom){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nompj+'/pp/1/true')
    .catch(function(e) {
        console.error("error", e);
    });
}



function loadLancerJdSvM(name){
    fetch('/lancer_empirique/'+name+'/1d20/true');
}

