var nbPJ = 0;
var listPJ = [];
var table="";


function afficher() {
    const chat = document.querySelector('#chat');
    fetch('/afficher/mj/true').then((response) => response.text()).then(text => {
        chat.innerHTML = text;
    }).catch(function(e) {
        console.error("error", e);
    });
    afficherPJ();
}
setInterval(afficher, 2000);
afficher();



function modif(nom, stat, valeur, add){
    fetch('/mj_interdit_aux_joueurs/modifs_valeurs/'+nom+'/'+stat+'/'+valeur+'/'+add)
    .catch(function(e) {
        console.error("error", e);
    });
    afficher()
}

function ajouter_pj(name){
 liste_pj = document.querySelector('#liste_pj');
 table = table +
  '<td align="center">'+'<span id="pj_name"><b>'+name+'</b></span>'
  +'<br/><i><span id="pj_fl_'+name+'"></span></i>'
  +'<br/><i><span id="pj_fu_'+name+'"></span></i>'
  +'<br/><i><span id="pj_fs_'+name+'"></span></i>'
    +'<br/><button onclick="modif(\''+name+'\',\'pv\',1, false);" >-</button>PV = <span id="pj_pv_'+name+'">3</span>/<span id="pj_pv_max_'+name+'">6</span><button onclick="modif(\''+name+'\',\'pv\',1, true);" >+</button>'
    +'<br/><button onclick="modif(\''+name+'\',\'pf\',1, false);" >-</button>PF = <span id="pj_pf_'+name+'">3</span>/<span id="pj_pf_max_'+name+'">6</span><button onclick="modif(\''+name+'\',\'pf\',1, true);" >+</button>'
    +'<br/><button onclick="modif(\''+name+'\',\'pp\',1, false);" >-</button>PP = <span id="pj_pp_'+name+'">3</span>/<span id="pj_pp_max_'+name+'">6</span><button onclick="modif(\''+name+'\',\'pp\',1, true);" >+</button>'
    +'<br/><button onclick="modif(\''+name+'\',\'dettes\',1, false);" >-</button>DT = <span id="pj_dettes_'+name+'">9</span><button onclick="modif(\''+name+'\',\'dettes\',1, true);" >+</button>'
    +'<br/><button onclick="modif(\''+name+'\',\'arcanes\',1, false);" >-</button>AK = <span id="pj_arcanes_'+name+'">3</span>/<span id="pj_arcanes_max_'+name+'">6</span><button onclick="modif(\''+name+'\',\'arcanes\',1, true);" >+</button>'
    +'</td>';
    liste_pj.innerHTML = '<table border="1"><tr>'+table+'</tr></table>';
    nbPJ++;
    listPJ.push(name);
}

function afficherPJ(){
listPJ.forEach(function(name, index, array) {
    fetch('/lsr/getcar/'+name)
 .then((response) => response.text())
  .then(json => {
    const obj = JSON.parse(json);
    document.querySelector('#pj_pv_'+name).innerHTML = obj.point_de_vie;
    document.querySelector('#pj_pv_max_'+name).innerHTML = obj.point_de_vie_max;
    document.querySelector('#pj_pf_'+name).innerHTML = obj.point_de_focus;
    document.querySelector('#pj_pf_max_'+name).innerHTML = obj.point_de_focus_max;
    document.querySelector('#pj_pp_'+name).innerHTML = obj.point_de_pouvoir;
    document.querySelector('#pj_pp_max_'+name).innerHTML = obj.point_de_pouvoir_max;
    document.querySelector('#pj_dettes_'+name).innerHTML = obj.dettes;
    document.querySelector('#pj_arcanes_'+name).innerHTML = obj.arcanes;
    document.querySelector('#pj_arcanes_max_'+name).innerHTML = obj.arcanes_max;
    document.querySelector('#pj_fl_'+name).innerHTML = obj.fl;
    document.querySelector('#pj_fu_'+name).innerHTML = obj.fu;
    document.querySelector('#pj_fs_'+name).innerHTML = obj.fs;
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

function jetPNJ(name, action, stat, pf, pp, ra, sec){
    mal = parseInt(document.querySelector('#pnj_mal_'+name).innerHTML);
    ben = parseInt(document.querySelector('#pnj_ben_'+name).innerHTML);
    fetch('/mj/lancer_pnj/'+name+'/'+action+'/'+stat+'/'+pf+'/'+pp+'/'+ra+'/'+mal+'/'+ben+'/'+sec);
}



function ajouter_pnj(new_pnj_name,new_pnj_chair,new_pnj_esprit,new_pnj_essence,new_pnj_pv_max,new_pnj_pf_max,new_pnj_pp_max){
    liste_pnj = document.querySelector('#liste_pnj');
     if (new_pnj_pv_max == "PVmax")
        new_pnj_pv_max = parseInt(new_pnj_chair)*2
     if (new_pnj_pf_max == "PFmax")
        new_pnj_pf_max = parseInt(new_pnj_esprit)
     if (new_pnj_pp_max == "PPmax")
        new_pnj_pp_max = parseInt(new_pnj_essence)
     liste_pnj.innerHTML = liste_pnj.innerHTML
     +'<span id=\"pnj_'+new_pnj_name+'\"><br><button onclick=\"effacer_pnj(\''+new_pnj_name+'\');\"> X </button><b>'+new_pnj_name
     +'</> : <button onclick=\"modifPNJ(\''+new_pnj_name+'\',\'pv\',-1);\" >-</button>PV = <span id=\"pnj_pv_'+new_pnj_name+'\">'+new_pnj_pv_max
     +'</span>/<span id=\"pj_pv_max_'+new_pnj_name+'\">'+new_pnj_pv_max+'</span><button onclick=\"modifPNJ(\''+new_pnj_name+
     '\',\'pv\',1);\" >+</button><label class=\"btn active\"><input id=\"use_pf_'+new_pnj_name+'\" type=\"checkbox\" autocomplete=\"off\">PF:<span id=\"pnj_pf_'
     +new_pnj_name+'\">'+new_pnj_pf_max+'</span> / '+new_pnj_pf_max+'</label><label class=\"btn active\"><input id=\"use_pp_'+new_pnj_name
     +'\" type=\"checkbox\" autocomplete=\"off\">PP:<span id=\"pnj_pp_'+new_pnj_name+'\">'+new_pnj_pp_max+'</span> / '+new_pnj_pp_max
     +'</label><label class=\"btn active\"><input id=\"use_ra_'+new_pnj_name+'\" type=\"checkbox\" autocomplete=\"off\">RA</label><label class=\"btn active\"><input id=\"use_sc_'
     +new_pnj_name+'\" type=\"checkbox\" autocomplete=\"off\">Secret</label><br><button onclick=\"jetPNJ(\''
     +new_pnj_name+'\',\'JC\','+new_pnj_chair+',document.getElementById(\'use_pf_'+new_pnj_name+'\').checked,document.getElementById(\'use_pp_'+new_pnj_name
    +'\').checked,document.getElementById(\'use_ra_'+new_pnj_name+'\').checked, document.getElementById(\'use_sc_'+new_pnj_name+'\').checked);\">Chair</button><button onclick=\"jetPNJ(\''
     +new_pnj_name+'\',\'JS\','+new_pnj_esprit+',document.getElementById(\'use_pf_'+new_pnj_name+'\').checked,document.getElementById(\'use_pp_'+new_pnj_name
    +'\').checked,document.getElementById(\'use_ra_'+new_pnj_name+'\').checked, document.getElementById(\'use_sc_'+new_pnj_name+'\').checked);\">Esprit</button><button onclick=\"jetPNJ(\''
     +new_pnj_name+'\',\'JE\','+new_pnj_essence+',document.getElementById(\'use_pf_'+new_pnj_name+'\').checked,document.getElementById(\'use_pp_'+new_pnj_name
    +'\').checked,document.getElementById(\'use_ra_'+new_pnj_name+'\').checked, document.getElementById(\'use_sc_'+new_pnj_name+'\').checked);\">Essence</button><button onclick=\"jetPNJ(\''
     +new_pnj_name+'\',\'JM\','+new_pnj_essence+',document.getElementById(\'use_pf_'+new_pnj_name+'\').checked,document.getElementById(\'use_pp_'+new_pnj_name
    +'\').checked,document.getElementById(\'use_ra_'+new_pnj_name+'\').checked, document.getElementById(\'use_sc_'+new_pnj_name+'\').checked);\">Magie</button> <button onclick=\"modifPNJ(\''+
    new_pnj_name+'\',\'mal\',-1);\" >-</button>Mal = <span id=\"pnj_mal_'+new_pnj_name+'\">0</span><button onclick=\"modifPNJ(\''+new_pnj_name+
     '\',\'mal\',1);\" >+</button> <button onclick=\"modifPNJ(\''+new_pnj_name+'\',\'ben\',-1);\" >-</button>Ben = <span id=\"pnj_ben_'
     +new_pnj_name+'\">0</span><button onclick=\"modifPNJ(\''+new_pnj_name+'\',\'ben\',1);\" >+</button></span>'
}



function effacerLancersDes(){
    fetch('/mj_interdit_aux_joueurs/effacerLancersDes');
}



