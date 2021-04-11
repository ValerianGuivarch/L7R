var nbPJ = 0;
var listPJ = [];
var table="";


function afficher() {
    const chat = document.querySelector('#chat');
    fetch('/afficher/mj/false').then((response) => response.text()).then(text => {
        chat.innerHTML = text;
    }).catch(function(e) {
        console.error("error", e);
    });
    afficherPJ(nompj);
}

setInterval(afficher, 2000);
afficher();



function modif(nom, stat, valeur, add){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs_viking2/'+nom+'/'+stat+'/'+valeur+'/'+add)
    .catch(function(e) {
        console.error("error", e);
    });
    afficher()
}

function ajouter_pj(name){
 liste_pj = document.querySelector('#liste_pj');
 table = table +
  '<td align="center">'+'<span id="pj_name"><b>'+name+'</b></span>'
    +'<br/><button onclick="modif(\''+name+'\',\'pv\',1, false);" >-</button>PV = <span id="pj_pv_'+name+'">3</span>/<span id="pj_pv_max_'+name+'">6</span><button onclick="modif(\''+name+'\',\'pv\',1, true);" >+</button>'
    +'<br/><button onclick="modif(\''+name+'\',\'magie\',1, false);" >-</button>MG = <span id="pj_mg_'+name+'">3</span><button onclick="modif(\''+name+'\',\'magie\',1, true);" >+</button>'
    +'</td>';
    liste_pj.innerHTML = '<table border="1"><tr>'+table+'</tr></table>';
    nbPJ++;
    listPJ.push(name);
}

function afficherPJ(){
listPJ.forEach(function(name, index, array) {
 fetch('/vik/getgcar2/'+name)
 .then((response) => response.text())
  .then(json => {
    const obj = JSON.parse(json);
    document.querySelector('#pj_pv_'+name).innerHTML = obj.point_de_vie;
    document.querySelector('#pj_pv_max_'+name).innerHTML = obj.point_de_vie_max;
    document.querySelector('#pj_mg_'+name).innerHTML = obj.point_de_pouvoir;
     }).catch(function(e) {
        console.error("error", e);
    });
});
}


function effacer_pnj(new_pnj_name){
    pnj = document.querySelector('#pnj_'+new_pnj_name);
    pnj.innerHTML="";
}

function modifPNJ(pnj_name, stat, valeur){
    mod = document.querySelector('#pnj_'+stat+'_'+pnj_name);
    mod.innerHTML = parseInt(mod.innerHTML)+valeur;
}

function jetPNJ(name, action){
    stat = document.querySelector('#pnj_jet_'+name);
    fetch('/lancer_viking/'+name+'/'+action+'/'+parseInt(stat.innerHTML)+'/0');
}



function ajouter_pnj(new_pnj_name,new_pnj_pv_max){
    liste_pnj = document.querySelector('#liste_pnj');
     liste_pnj.innerHTML = liste_pnj.innerHTML
     +'<span id=\"pnj_'+new_pnj_name+'\"><br><button onclick=\"effacer_pnj(\''+new_pnj_name+'\');\"> X </button><b>'+new_pnj_name
     +'</> : <button onclick=\"modifPNJ(\''+new_pnj_name+'\',\'pv\',-1);\" >-</button>PV = <span id=\"pnj_pv_'+new_pnj_name+'\">'+new_pnj_pv_max
     +'</span>/<span id=\"pj_pv_max_'+new_pnj_name+'\">'+new_pnj_pv_max+'</span><button onclick=\"modifPNJ(\''+new_pnj_name+
     '\',\'pv\',1);\" >+</button><button onclick=\"modifPNJ(\''+new_pnj_name+'\',\'jet\',-1);\" >-</button><button onclick=\"jetPNJ(\''
     +new_pnj_name+'\',\'jet\');\" id=\"pnj_jet_'+new_pnj_name+'\">2</button><button onclick=\"modifPNJ(\''+new_pnj_name+'\',\'jet\',1);\" >+</button><button onclick=\"jetPNJ(\''
     +new_pnj_name+'\',\'duel\');\" id=\"pnj_duel_'+new_pnj_name+'\">Duel</button></span>'
}



function effacerLancersDes(){
    fetch('/mj_interdit_aux_joueurs/effacerLancersDes');
}



