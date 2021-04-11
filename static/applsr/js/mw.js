function isTextSelected(input){
   var startPos = input.selectionStart;
   var endPos = input.selectionEnd;
   var doc = document.selection;

   if(doc && doc.createRange().text.length != 0){
      return true;
   }else if (!doc && input.value.substring(startPos,endPos).length != 0){
      return true;
   }
   return false;
}

var textJson = "{}"
function affichermw() {

    fetch('/masterwords_affichermw/').then((response) => response.text()).then(text => {
        var obj = JSON.parse(text);
        var objPrev = JSON.parse(textJson);
        if(role=='mj' && obj.indice!='')
        {
              document.getElementById("btnIndice").disabled = true;
        }

        if(obj.indice!='')
        {
            document.getElementById(obj.indice).style.color = 'blue';
        }
        if(role=='joueur')
        {
                document.getElementById("themePrint").textContent=obj.theme
        }



        for (let i = 1; i < 8; i++) {
            for (let j = 1; j < 4; j++) {
                name = 'l'+i+'c'+j;
                var div_display = document.getElementById(name);
                if(objPrev[name]==null || objPrev[name]!=obj[name])
                   {
                    div_display.value = obj[name];
                   }
                   var valid = 'valide'+i
                    if(obj[valid]=="1" && role=='joueur')
                    {
                        var div_display = document.getElementById('l'+i+'c'+j).disabled=true;
                        } else
                    {
                        var div_display = document.getElementById('l'+i+'c'+j).disabled=false;
                        }

                }
                var reponse = 'reponse'+i
                console.error("err", reponse)
                console.error("err2", obj[reponse])
                if(obj[valid]=="1"){
                if(obj[reponse]!="")
                    {var div_display = document.getElementById('valide'+i).textContent=obj[reponse];}
                    else {var div_display = document.getElementById('valide'+i).textContent="Attente...";}
                }
                }

        if(obj.prop3!=""){
            document.getElementById("btnProp").textContent ="Proposition : 2"
            document.getElementById(obj.prop3).style.color = 'red';
        }  if(obj.prop2!=""){
            document.getElementById("btnProp").textContent ="Proposition : 1"
            document.getElementById(obj.prop2).style.color = 'red';
        }  if(obj.prop1!=""){
            document.getElementById("btnProp").textContent ="Proposition : 0"
            document.getElementById(obj.prop1).style.color = 'red';
            document.getElementById("btnProp").disabled = true;
        }
                textJson=text
    }).catch(function(e) {
        console.error("error", e);
    });
}

setInterval(affichermw, 2000);
affichermw();


function donneIndice(champ, bool) {
if(role=='joueur'){
donneProp(champ, bool)
}
 else if(role=='mj' && bool==0 && document.getElementById("l1c1").style.cursor == "pointer"){
 fetch('/masterwords_enregistrer/indice/'+champ.id);
         }

for (let i = 1; i < 8; i++) {
    for (let j = 1; j < 4; j++) {

    if(bool) {
        document.getElementById("l"+i+"c"+j).style.cursor = "pointer";
        } else {
        document.getElementById("l"+i+"c"+j).style.cursor = "default";
        }
    }
    }
    if(bool) {
        document.getElementById("l8c1").style.cursor = "pointer";
        } else {
        document.getElementById("l8c1").style.cursor = "default";
        }

}
function donneProp(champ, bool) {
if(role=='joueur' && bool==0 && document.getElementById("l1c1").style.cursor == "pointer"){



        if(document.getElementById("btnProp").textContent =="Proposition : 3"){
            fetch('/masterwords_enregistrer/prop3/'+champ.id);
        } else if(document.getElementById("btnProp").textContent =="Proposition : 2"){
            fetch('/masterwords_enregistrer/prop2/'+champ.id);
        } else if(document.getElementById("btnProp").textContent =="Proposition : 1"){
            fetch('/masterwords_enregistrer/prop1/'+champ.id);
        }
         }
for (let i = 1; i < 8; i++) {
    for (let j = 1; j < 4; j++) {

    if(bool) {
        document.getElementById("l"+i+"c"+j).style.cursor = "pointer";
        } else {
        document.getElementById("l"+i+"c"+j).style.cursor = "default";
        }

    }
}
    if(bool){
        document.getElementById("l8c1").style.cursor = "pointer";
        } else {
        document.getElementById("l8c1").style.cursor = "default";
        }

}



function enregistrer(champ){
        fetch('/masterwords_enregistrer/'+champ.id+'/'+champ.value);
}

function genererTableau(role) {
 tableau = document.querySelector('#tableau');

if(role=='mj')
{
table = "<br/><h2>&emsp;&emsp;&emsp;&emsp;&emsp;Thème choisi : &emsp;</h2>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<input type=\"text\" onChange=\"enregistrer(this)\"  id=\"theme\" value=\"\"  size=\"15\"/>";
} else {
table = "<br/><h2>&emsp;&emsp;&emsp;&emsp;&emsp;Thème choisi : &emsp;<span id=\"themePrint\">(thème inconnu)</span></h2>";
}
mj=false;
if(role=='mj'){
mj=true;
}
table=table+"<br/>";
for (let i = 1; i < 8; i++) {
table=table+"&emsp;manche "+i;
    for (let j = 1; j < 4; j++) {
        table = table + "&emsp;&emsp;<input type=\"text\" onChange=\"enregistrer(this)\"  value=\"\" onclick=\"donneIndice(this, 0);\" name==\"l"+i+"c"+j+"\" id=\"l"+i+"c"+j+"\" size=\"30\"/>";
    }
    table=table+"&emsp;&emsp;<button class=\"btn btn-info\" id=\"valide"+i+"\" onclick=\"valider("+i+");\">Valider</button>"
if(role=='mj'){
    table=table+"&emsp;&emsp;<select name=\"select\" onchange=\"reponse("+i+", this)\"><option value=\"-1\">?</option><option value=\"0\">0</option><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option></select>"
    }
    table=table+"<br/><br/>"
}
table=table+"&emsp;manche 8";
table = table + "&emsp;&emsp;<input type=\"text\" onclick=\"donneIndice(this, 0);\" id=\"l8c1\" size=\"30\">";
 table=table+"&emsp;&emsp;<button class=\"btn btn-info\" onclick=\"valider(8);\">Valider</button></br>"
 if(role=='mj')
{ table=table+"&emsp;&emsp;<button id=\"btnIndice\" class=\"btn btn-info\" onclick=\"donneIndice(this, 1);\">Indice</button>"}
if(role=='joueur')
{ table=table+"&emsp;&emsp;<button id=\"btnProp\" class=\"btn btn-info\" onclick=\"donneProp(this, 1);\">Proposition : 3</button>"}

    liste_pj.innerHTML = table;
}
function valider(col){
    fetch('/masterwords_enregistrer/valide'+col+'/1');
}
function test(){
    alert("lol")
}

function reponse(ligne, element)
{
    var idx=element.selectedIndex;
    var content=element.options[idx].innerHTML;
    fetch('/masterwords_enregistrer/reponse'+ligne+'/'+content);
 }




