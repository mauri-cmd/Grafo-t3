var nodes,edges,ID = 5;
var cantidadautomatas = 1;
var estados,
  alfabeto=3,
  transicion,
  inicial,
  finales,
  operacionunir = 0,
  operacionconcatenacion = 0,
operaciontransformarAFD=0;
var nodosf1 = [];
var nodosf2 = [];
var automata1 = [nodosf1];
var automata2 = [];
var qinicial1, qinicial2;
///////////////////////////////////////////////
var storage = new plog.storages.LocalStorage({ maxSize: 200 });
plog.useStorage(storage);
var xoptions = {
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" }
    }
  }
  //physics: { enabled: true, wind: { x: 1, y: 0 } }
};
var container = document.getElementById("mynetwork");
var data = {
  nodes: nodes,
  edges: edges
};
nodes = new vis.DataSet([
  { id: 1, label: "q1", color: "#C2FABC" },
  { id: 2, label: "q2", color: "#97C2FC" },
  { id: 3, label: "q3", color: "#fabcbc" },
  { id: 4, label: "q4", color: "#fabcbc"  },
]);
var o_nodes = new vis.DataSet(nodes);
//crear un array con las aristas

//NOTA PARA TODOS:EL ID DEL EDGE CORRESPONDE A "DESDE - CONTADOR DE ARISTAS PARA ESE NODO"
edges = new vis.DataSet([
 { id: "1-1", from: 1, to: 2, label: "a" },
  { id: "1-2", from: 1, to: 3, label: "b" },
  { id: "1-3", from: 1, to: 1, label: "c" },
  { id: "2-1", from: 2, to: 2, label: "a,b" },
  { id: "2-2", from: 2, to: 4, label: "c" },
  { id: "3-1", from: 3, to: 3, label: "a" },
  { id: "3-2", from: 3, to: 4, label: "b,c" },
  { id: "4-1", from: 4, to: 4, label: "c" },
  { id: "4-2", from: 4, to: 3, label: "a,b" },
  
]);

data = {
  nodes: nodes,
  edges: edges
};
qinicial1=estadoinicial(1);
verificar(1);
function automatainicial() {
  plog.info("Se muestran opciones para elegir que automata se creara ");
  Swal.fire({
    title: "Que tipo de automata quiere crear",
    allowOutsideClick: false,

    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '<i class="AFD"></i> AFD',
    denyButtonText: '<i class="ANFD"></i> AFND'
  }).then(result => {
    if (result.isConfirmed) {
      plog.info("Se escoge crear AFD ");
      crearAFD();
    } else if (result.isDenied) {
    }
  });
}

async function crearAFD() {
  //(async() => {
  if (cantidadautomatas == 1) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: "warning",
      title: "cantidad maxima de automatas alcanzada"
    });

    return;
  }
  cantidadautomatas++;
  alfabetoentrada().then(total => {
    console.log(alfabeto);
    estadostotales().then(valor => {
      console.log(estados);
      estadosfinales(valor - 1).then(valor => {
        var q = añadirestadoinicial();
        
        console.log(valor);
        for (let i = 0; i < estados - 1 - finales; i++) {
          añadirestadonormal();
        }
        for (let i = 0; i < finales; i++) {
          añadirestadofinal();
        }
        estados = estados - 0;
        agregar(alfabeto, q, estados);
        if (cantidadautomatas == 1) {
          qinicial1 = estadoinicial(1).id;
        }
        if (cantidadautomatas == 2) {
          qinicial2 = q;
        }
      
      });
    });
  });
plog.info("Se crea AFD");
  
  
}
//se escoje la cantidad total del alfabeto en el automata
async function alfabetoentrada() {
  plog.info("Se muestran opciones para escoger rango de alfabeto ");
  const { value: total } = await Swal.fire({
    title: "Tamaño de alfabeto",
    allowOutsideClick: false,
    input: "range",
    inputAttributes: {
      min: 2,
      max: 5,
      step: 1
    },
    inputValue: 2
  });
  //alert(total);
  alfabeto = total;
  //alert(alfabeto);

  return total;
}
function inputmadre() {
  plog.info("Se muestran opciones para elegir que automata se evaluara  ");
  input().then(opcion => {
    if (opcion == 1 && qinicial1 != undefined) {
      input2().then(texto => {
        recorrer(opcion, texto);
      });
    } else if (
      opcion == 2 &&
      qinicial2 != undefined &&
      operacionunir == 0 &&
      operacionconcatenacion == 0
    ) {
      input2().then(texto => {
        recorrer(opcion, texto);
      });
    } else if (opcion == 1 && qinicial1 == undefined) {
      plog.warn(
        "Se intento evaluar datos de automata inexistente,se cancela la operacion y se manda alerta "
      );
      Swal.fire({
        icon: "warning",
        title: "Error...",
        text: "Se necesita dicho automata para completar esta accion"
      });
    } else if (
      (opcion == 2 && qinicial2 == undefined) ||
      operacionunir != 0 ||
      operacionconcatenacion != 0
    ) {
      plog.warn(
        "Se intento evaluar datos de automata inexistente,se cancela la operacion y se manda alerta "
      );
      Swal.fire({
        icon: "warning",
        title: "Error...",
        text: "Se necesita dicho automata para completar esta accion"
      });
    }
  });
}

//se ingresan los datos para recorrer el automata
async function input() {
  console.log(qinicial1);
  console.log(qinicial2);
  if (nodes.get().length == 0) {
    plog.warn("Se intento evaluar sin haber algun automatas");
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text: "Para realizar esta operacion se necesita crear automatas primero"
    });
    return;
  }
  const inputOptions = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        1: "1",
        2: "2"
      });
    }, 100);
    

  });
  const { value: opcion } = await Swal.fire({
    title: "Elegir automata el cual se va evaluar:",
    input: "radio",
    allowOutsideClick: false,
    inputOptions: inputOptions,
    showCancelButton: true,
    inputValidator: value => {
      if (!value) {
        return "Seleccione automata para evaluar";
      } else if (value == 1) {
        //var texto = input2();
        //alert(texto);
        //recorrer(qinicial1);
      } else if (value == 2) {
        //recorrer(qinicial2);
      }
    }
  });
  return opcion;
 
}
async function input2() {
  plog.info("Se muestran entrada para ingresar texto a evaluar en automata");
  const { value: texto } = await Swal.fire({
    title: "datos a evaluar",
    allowOutsideClick: false,
    icon: "question",
    text: "ingrese letras a,b,c,d,e dependiendo del tamaño de su alfabato:",
    input: "text",
    inputPlaceholder: "Si hay alguna letra fuera del dicho no sera considerado",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar"
  });
  return texto;
}
//se escoje la cantidad de estados en el automata
async function estadostotales() {
  plog.info("Se muestran opciones para escoger rango de estados totales ");
  const { value: valor } = await Swal.fire({
    title: "Cantidad de estados totales",
    allowOutsideClick: false,
    input: "range",
    inputAttributes: {
      min: 2,
      max: 100,
      step: 1
    },
    inputValue: 2
  });
  //alert(valor);
  estados = valor;
  return valor;
}
async function estadosfinales(rango) {
  plog.info("Se muestran opciones para escoger cantidad de estados finales ");
  const { value: valor } = await Swal.fire({
    title: "Cantidad de estados finales",
    allowOutsideClick: false,
    input: "range",
    inputAttributes: {
      min: 1,
      max: rango,
      step: 1
    },
    inputValue: 1
  });
  //alert(valor);
  finales = valor;
  return valor;
}

async function crearopciones(qinicial) {
  plog.info("Se crean opciones para conectar automata ");
  var x = nodes.getIds();
  var options = {};
  for (let i = qinicial; i <= ID - 1; i++) {
    options[nodes.get(i).id] = "q" + i;
    console.log(options);
  }
  return options;
}
/*
async function agregar(alfabeto, q, estados) {
  
  var f = q;
  var opciones = crearopciones(q);
  estadosfinales1(f, alfabeto, opciones).then(cantidad => {
    if (1 < estados)
      estadosfinales1(f + 1, alfabeto, opciones).then(cantidad => {
        if (2 < estados)
          estadosfinales1(f + 2, alfabeto, opciones).then(cantidad => {
            if (3 < estados)
              estadosfinales1(f + 3, alfabeto, opciones).then(cantidad => {
                if (4 < estados)
                  estadosfinales1(f + 4, alfabeto, opciones).then(
                    cantidad => {}
                  );
              });
          });
      });
  });
}
*/

/*async function estadosfinales1(q, alfabeto, opciones) {
  plog.info("Se muestran opciones para conectar afd ");
  var n = nodes.getIds();
  var titulo = "desde q" + q + " hasta:";
  console.log(n);
  if (cantidadautomatas == 1) {
    var cont = 1;
  } else {
    for (let i = 1; i < nodes.get().length; i++) {
      if (nodes.get(n[i]).color == "#C2FABC") {
        var encontrado = nodes.get(n[i]);
        cont = encontrado.id;
      }
    }
  }

  var o = "q";

  const { value: a } = await Swal.fire({
    title: "leyendo " + "a " + titulo,
    allowOutsideClick: false,
    input: "select",
    inputOptions: opciones
  });
  conectar(q, a, "a");
  if (1 < alfabeto) {
    const { value: b } = await Swal.fire({
      title: "leyendo " + "b " + titulo,
      allowOutsideClick: false,
      input: "select",
      inputOptions: opciones
    });
    conectar(q, b, "b");
  }
  if (2 < alfabeto) {
    const { value: c } = await Swal.fire({
      title: "leyendo " + "c " + titulo,
      allowOutsideClick: false,
      input: "select",
      inputOptions: opciones
    });
    conectar(q, c, "c");
  }
  if (3 < alfabeto) {
    const { value: d } = await Swal.fire({
      title: "leyendo " + "d " + titulo,
      allowOutsideClick: false,
      input: "select",
      inputOptions: opciones
    });
    conectar(q, d, "d");
  }
  if (4 < alfabeto) {
    const { value: e } = await Swal.fire({
      title: "leyendo " + "e " + titulo,
      allowOutsideClick: false,
      input: "select",
      inputOptions: opciones
    });
    conectar(q, e, "e");
  }
}
*/

async function agregar(alfabeto, q, estados){
  var f = q;
  var opciones = crearopciones(q);
  for (let i = 0; i < estados; i++){
    for (let j = 0; j < alfabeto; j++){
         await estadosfinales1(i+1,j+1, opciones);
    }
  }
  verificar(1);
}
async function estadosfinales1(q, alfabeto, opciones){
  var alfabet=["a","b","c","d","e"];
  plog.info("Se muestran opciones para conectar afd ");
  var n = nodes.getIds();
  var titulo = " desde q " + q + " hasta:";
  console.log(n);
  if (cantidadautomatas == 1) {
    var cont = 1;
  } else {
    for (let i = 1; i < nodes.get().length; i++) {
      if (nodes.get(n[i]).color == "#C2FABC") {
        var encontrado = nodes.get(n[i]);
        cont = encontrado.id;
      }
    }
  }

  

  const { value: a } = await Swal.fire({
    title: "leyendo " + alfabet[alfabeto-1] + titulo,
    allowOutsideClick: false,
    input: "select",
    inputOptions: opciones
  });
  conectar(q, a, alfabet[alfabeto-1]);
}

async function borrar() {
  
  var borrar = nodes.getIds();
  if (borrar.length == 0) {
    plog.warn(
      "Se intento eliminar un automata cuando no hay ninguno,se cancela la operacion y se manda alerta "
    );
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text: "Para eliminar, debe existir un automata "
    });
    return;
  }else{

        for (var i = 0; i < borrar.length; i++) {
          nodes.remove(borrar[i]);
          var aristas = edges.get();
          var contadoraristas = aristas.filter(
            aristas => aristas.from == borrar[i]
          );

          var x = contadoraristas.length;
          console.log(contadoraristas);
          while (x != 0) {
            edges.remove(contadoraristas[x - 1].id);
            x = x - 1;
          }

          console.log(edges.get());
          ID = 1;
          cantidadautomatas = 0;
          operacionunir = 0;
          operacionconcatenacion = 0;
          operaciontransformarAFD=0;
        }
      }
     
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: toast => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          }
        });

        Toast.fire({
          icon: "success",
          title: "Borrados todos los estados y transiciones"
        });
        plog.info("Se borra automata ");
      

 }

function añadirestadoinicial() {
  plog.info("Se añade un estado inicial");
  var Label = "q";
  nodes.add([{ id: ID, label: Label + ID, color: "#C2FABC" }]);
  var estadoinicial = ID;
  ID++;
  return estadoinicial;
}
function añadirestadofinal() {
  plog.info("Se añade un estado final");
  var Label = "q";
  nodes.add([{ id: ID, label: Label + ID, color: "#fabcbc" }]);
  ID++;
  return ID-1;
}

function añadirestadonormal() {
  plog.info("Se añade un estado no final");
  var Label = "q";
  nodes.add([{ id: ID, label: Label + ID, color: "#97C2FC" }]);
  ID++;
}
function conectar(desde, hasta, label) {
  var aristas = edges.get();
  var contadoraristas = aristas.filter(aristas => aristas.from == desde);

  var aristarep = false;
  for (var i = 0; i < contadoraristas.length; i++) {
    if (contadoraristas[i].from == contadoraristas[i].to) {
      aristarep = true;
      break;
    }
  }
   var conexionrep = false;
  for (var i = 0; i < contadoraristas.length; i++) {
    if (contadoraristas[i].from ==desde&& contadoraristas[i].to==hasta) {
      conexionrep= true;
      break;
    }
  }
  console.log(aristarep);
console.log(contadoraristas);
  if (desde == hasta && contadoraristas != 0 && aristarep == true&&operaciontransformarAFD==0) {
    for (var i = 0; i < contadoraristas.length; i++) {
      if (contadoraristas[i].from == contadoraristas[i].to) {
        var obtenerid = contadoraristas[i].id;
        var obtenerlabel = contadoraristas[i].label;
      }
    }
    console.log("id=" + obtenerid + "///////" + "label=" + obtenerlabel + "," + label);
    edges.updateOnly({ id: obtenerid, label: obtenerlabel + "," + label });
  } else if (desde != hasta && contadoraristas != 0&&conexionrep==true &&operaciontransformarAFD==0) {
    
      for (var i = 0; i < contadoraristas.length; i++) {
      if (contadoraristas[i].from ==desde && contadoraristas[i].to==hasta) {
        console.log(i);
        var obtenerid = contadoraristas[i].id;
        var obtenerlabel = contadoraristas[i].label; 
       
      }
    
     
    }
     console.log("id=" + obtenerid + "///////" + "label=" + obtenerlabel + "," + label);
    edges.updateOnly({ id: obtenerid, label: obtenerlabel + "," + label });
   
  } else{
    contadoraristas = contadoraristas.length + 1;
    plog.info("Se conectan estado "+desde+" hacia estado "+hasta+" leyendo "+label);
    edges.add([
      {
        id: desde + "-" + contadoraristas,
        from: desde,
        to: hasta,
        label: label
      }
    ]);
    return;
  }
}

function archivo() {
  
  plog.info("Se descarga el log");
  var aux = "";
  var events = storage.getEvents();
  for (var i = 0; i < events.length - 1; i++) {
    aux = aux + JSON.stringify(events[i]) + "\n";
  }

  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:events/plain;charset=utf-8," + encodeURIComponent(aux)
  );
  element.setAttribute("download", "log.txt");
  console.log(element);
  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

document.getElementById("download").addEventListener(
  "click",
  function() {
    // Generate download of hello.txt file with some content

    archivo();
  },
  false
);
function recorrer(automata, text) {
  plog.info("Se recorre el automata para verificar que la palabra sea admitida ");
  //var text="af";
  var palabra = [];
  var estadosf = estadosfinalesvector(automata);

  var estadoi = estadoinicial(automata);
  var arista = edges.get();
  var aristasinicial = arista.filter(arista => arista.from == estadoi.id);

  var vecttexto = [];
  var recorre;
  var opcioneslabel = [];
  var totalopciones = [];
  var opcionesf = [];
  var arista = edges.get();

  console.log(
    "automata = ",
    " finales",
    estadosf.length,
    "inicial",
    estadoi.label
  );
  var aux;
  var aux2;
  var cont = 0;
  var cont2 = 0;
  var vectunion = [];

  for (let i of text) {
    vecttexto.push(i);
  }

  //console.log("texto=", text, "inicial=", estadoi);

  for (let t = 0; t < vecttexto.length; t++) {
    for (let m = 0; m < aristasinicial.length; m++) {
      if (vecttexto[t] == aristasinicial[m].label) {
        cont2++;
        break;
      } else {
        for (let o = 0; o < aristasinicial[m].label.length; o++) {
          if (vecttexto[t] == aristasinicial[m].label[o]) {
            cont2++;
            break;
          }
        }
      }
    }
  }
  if (cont2 != vecttexto.length) {
    plog.warn("Palabra con caracteres fuera del alfabeto de automata ");
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text: "Palabra con caracteres fuera del alfabeto de automata"
    });
    return;
  }

  for (let j = 0; j < aristasinicial.length; j++) {
    //console.log(aristasinicial[j].label);
    if (vecttexto[0] == aristasinicial[j].label) {
      recorre = aristasinicial[j];
    }
  }
  //console.log(recorre);

  for (let i = 0; i < aristasinicial.length; i++) {
    console.log(vecttexto[0]);
    if (1 < aristasinicial[i].label.length) {
      for (let j = 0; j < aristasinicial[i].label.length; j++) {
        if (vecttexto[0] == aristasinicial[i].label[j]) {
          recorre = aristasinicial[i];
        }
      }
    }
  }

  console.log(recorre);
  if (recorre == undefined) {
    plog.warn("Palabra no admitida por automata");
    //alert("f");
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text: "Palabra no admitida por automata"
    });
    return;
  }

  console.log(vecttexto[0]);
  console.log("inicial", recorre.label);
  console.log("--------------------------------------");
  for (let m = 0; m < aristasinicial.length; m++) {
    if (aristasinicial[0].label == "ε" && aristasinicial[1].label == "ε") {
      console.log("<<<<<<<<<<<<||||||||", m);
      vectunion.push(recorre);
      recorrer = aristasinicial[m];
    }
    for (let i = 0; i < vecttexto.length; i++) {
      console.log("global", recorre);
      if (recorre.label.length > 1) {
        for (let j = 0; j < recorre.label.length; j++) {
          if (recorre.label[j] == vecttexto[i]) {
            //  console.log("de "+recorre.from+" hasta "+recorre.to+"////"+recorre.label,"==",vecttexto[i]);
            aux = arista.filter(arista => arista.from == recorre.to);

            break;
          }
        }
      } else if (recorre.label == vecttexto[i]) {
        console.log("de", recorre.to, recorre.label, "==", vecttexto[i]);
        aux = arista.filter(arista => arista.from == recorre.to);
        for (let h = 0; h < aux.length; h++) {
          if (aux[h].label == "ε") {
            aux2 = arista.filter(arista => arista.from == aux[h].to);
            for (let p = 0; p < aux2.length; p++) {
              if (aux2[p] == vecttexto[i + 1]) {
                aux = aux2;
                break;
              }
            }
          }
        }
      }
      console.log("segunda fase", aux);
      for (let k = 0; k < aux.length; k++) {
        // console.log("aux:",aux[k],k);
        // console.log("letra del texto",vecttexto[i]," label ",aux[k].label);
        for (let b; b < estadosf.length; b++) {
          if (
            vecttexto[i + 1] == undefined &&
            vecttexto[i] != undefined &&
            aux[k].label == "ε" &&
            aux[k].to == estadosf.id
          ) {
            recorre = aux[k];
          }
        }

        if (vecttexto[i + 1] != undefined) {
          if (aux[k].label == vecttexto[i + 1]) {
            recorre = aux[k];
            console.log("recorre=", recorre.label);
            break;
          } else {
            if (aux[k].label.length > 1) {
              for (let n = 0; n < aux[k].label.length; n++) {
                //console.log(n,"aux[k].label.length=",aux[k].label.length);
                if (aux[k].label[n] == vecttexto[i + 1]) {
                  //console.log("multiple",aux[k].label[n],"==",vecttexto[i]);
                  recorre = aux[k];
                  break;
                }
                //console.log("recorre=",recorre.label,"de",recorre.from);
              }
            }
          }
        }
      }
    }
    if (vectunion.length == 0) {
      break;
    }
  }

  if (vectunion.length == 0) {
    for (let l = 0; l < estadosf.length; l++) {
      if (recorre.to == estadosf[l].id) {
        plog.info("palabra admitida");
        console.log("palabra admitida");
        Swal.fire({
          icon: "success",
          title: "Exito",
          text: "Palabra " + "(" + text + ")" + " admitida"
        });
        cont++;
      }
    }
    console.log("cont", cont);

    if (cont == 0) {
      
      plog.info("la palabra no es admitida");
      Swal.fire({
        icon: "warning",
        title: "Error...",
        text: "Palabra no admitida"
      });
    }
    console.log("termina", recorre.to);
  } else {
    for (let s = 0; s < vectunion.length; s++) {
      for (let l = 0; l < estadosf.length; l++) {
        if (vectunion[s].to == estadosf[l].id) {
          plog.info("palabra admitida");
          console.log("palabra admitida");
          Swal.fire({
            icon: "success",
            title: "Exito",
            text: "Palabra " + "(" + text + ")" + " admitida"
          });
          cont++;
        }
      }
    }
    if (cont == 0) {
      plog.info("la palabra no es admitida");
      Swal.fire({
        icon: "warning",
        title: "Error...",
        text: "Palabra no admitida"
      });
    }
    console.log("termina", recorre.to);
  }
}
//verificar(1);
function verificar(automata) {
  var finales=estadosfinalesvector(automata);
  var inicial=estadoinicial(automata);
  var normales=vectorintermedios();
  console.log("empezo a verificar");

  var vectorprueba=[];
  var nodos = nodes.getIds();
  var totales = nodes.get();
  var arista = edges.get();
  var cont = 0;
  var cont2 = 0;
  var contrecorrido = 0;
  var recorre;
  var aux= arista.filter(arista => arista.from == inicial.id);
  var aristasinicial = arista.filter(arista => arista.from == inicial.id);
  var total = arista.length;

  console.log(
    "aux",
    aux,
    "total",
    total,
    "inicial",
    inicial,
    "aristasinicial",
    aristasinicial[0]
  );
  console.log(total);
   vectorprueba.push(inicial.id);
  for (let i = 0; i < finales.length; i++) {
    
    for (let j = 0; j < aristasinicial.length; j++) { 
     
      for (let k = 0; k < aux.length; k++) {
          recorre = aux[k];
          for (let l = 0; l < total; l++) {
            if (recorre.to == finales[i].id) {
           cont++;
              console.log("llega a la meta")
            vectorprueba.push(recorre.to);
            break;
          } else if (recorre.to == recorre.from) {
            aux = arista.filter(arista => arista.from == recorre.to);
            recorre = aux[k];
            console.log("aux", aux);
            break; //provicional
          } else {
            //console.log(recorre);
            vectorprueba.push(recorre.to);
            aux = arista.filter(arista => arista.from == recorre.to);
            
            recorre = aux[k];}
        

        console.log(finales[i].id, "==", vectorprueba);
      }
      if (recorre.to == finales[i].id) {

        break;
      }
    }
    //aux = arista.filter(arista => arista.from == recorre.to);
    
  }
    console.log("estado", finales[i].label, "==", vectorprueba);
  }
  console.log("contador", cont, "<", finales.length);
  //console.log("recorrido hasta el estado ",finales[i].label," es: ",vectorprueba);
///////////////////////////////////////////////////////////////////////////////////////////segunda verificacion
  console.log("////////////////////");
  for(let s=0;s<nodos.length;s++){
    
    var aux2 = arista.filter(arista => arista.from == nodos[s]);
    var aux3= arista.filter(arista => arista.to == nodos[s]&&arista.from!=nodos[s]);
    console.log(aux3);
    cont2=0;
    for(let j=0;j<aux2.length;j++){
    
      if(aux2[j].from==aux2[j].to){
        cont2++;
      }
      console.log(cont2);
      //console.log(cont2,"==",aux2.length,"de",aux2[j].from); 
      if(cont2==aux2.length && aux3.length==0){
        Swal.fire({
      icon: "warning",
      title: "Error...",
      text:
        "Existe un camino que no llega a un estado final,intente crear el automata nuevamente"
   });
      plog.warn("Automata no cumple condiciones ");
        return;
      }
    }
  }
   console.log("////////////////////");
///////////////////////////////////////////////////////////////////////////////////////
  if (cont == 0) {
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text:
        "Al menos un estado final es inalcanzable desde el estado inicial,intente crear el automata nuevamente"
    });
    plog.warn("Automata no cumple condiciones ");
    //////////borrar va aqui
  } else {
    plog.info("El Automata cumple las condiciones");
  }
}

function estadosfinalesvector(automata) {
  var nodos = nodes.get();
  var automata1;
  var automata2;
  var nautomata2;
  var cont = 0;
  var vectorfinales = [];
  for (let i = 0; i < nodos.length; i++) {
    //console.log("cont=",cont, nodos[i].color," == ","#C2FABC");

    if (nodos[i].color == "#C2FABC") {
      cont++;
      if (cont == 1) {
        automata1 = nodos[i];
        //  console.log("adentro");
      }
      if (cont == 2) {
        automata2 = nodos[i];
        nautomata2 = i;
      }
    }
  }
  if (automata == 1) {
    //console.log("aqui");
    for (let i = 0; i < nodos.length; i++) {
      //console.log("ñe");
      if (nodos[i] == automata2) {
        break;
      }
      if (nodos[i].color == "#fabcbc") vectorfinales.push(nodos[i]);
    }
    return vectorfinales;
  } else {
    if (automata == 2) {
      for (let i = qinicial2; i < ID; i++) {
        console.log(nodes.get(i).color);
        if (nodes.get(i).color == "#fabcbc") vectorfinales.push(nodes.get(i));
      }
      return vectorfinales;
    }
  }
}
function estadoinicial(automata) {
  var nodos = nodes.get();
  var automata1;
  var automata2;
  var cont = 0;
  //console.log("el primer estado empieza en ", nodos[0]);
  for (let i = 0; i < nodos.length; i++) {
    //  console.log("cont=",cont, nodos[i].color," == ","#C2FABC");

    if (nodos[i].color == "#C2FABC") {
      cont++;
      if (cont == 1) {
        automata1 = nodos[i];
        //console.log("adentro");
      }
      if (cont == 2) {
        automata2 = nodos[i];
      }
    }
  }
  if (automata == 1) {
    return automata1;
  }
  if (automata == 2) {
    return automata2;
  }
}
function borrarestadoconaristas(id){
  
  var aristas = edges.get();
  var aristasdesde = aristas.filter(aristas => aristas.from == id);
  var aristashasta = aristas.filter(aristas => aristas.to == id);
  for (var i = 0; i<aristasdesde.length ; i++) { 
            var x = aristasdesde.length;
            while (x != 0) {
              edges.remove(aristasdesde[x - 1].id);
              x = x - 1;
            }
          }
    for (var i = 0; i<aristashasta.length ; i++) { 
            var x = aristashasta.length;
            while (x != 0) {
              edges.remove(aristashasta[x - 1].id);
              x = x - 1;
            }
          }
  nodes.remove(id);
  plog.info("Se borra estado",id,"con todas sus transiciones");
}

function cambiomas(){
  var aristas=edges.get();
  console.log(aristas);
         for(let i=0;i<aristas.length;i++){
           var palabra=undefined;
           var labelnuevo=[];
           if(1<aristas[i].label.length){
             for(let j=0;j<aristas[i].label.length;j++){
               
               if(aristas[i].label[j]==","){
                 labelnuevo.push("+");
               }else labelnuevo.push(aristas[i].label[j]);
             }
             for(let k=0;k<labelnuevo.length;k++){
               if(palabra==undefined){
                 var palabra=labelnuevo[k];
               }else{
                 palabra=palabra+labelnuevo[k];
               }
               
             } console.log(palabra);
               aristas[i].label=palabra;
           }
           
         }
    plog.info("Se intercambian , por + para mejor entendimiento ");

}
function vectorintermedios(){
  
 var nodos=nodes.get();
 var vector=[];
 for(let i=0;i<nodos.length;i++){
   if(nodos[i].color=="#97C2FC"){
   vector.push(nodos[i]); 
    }
  }
  return vector;
}
async function botonER() {
  var nodos = nodes.getIds();
 if (nodos.length == 0) {
    plog.warn(
      "Se intento eliminar un automata cuando no hay ninguno,se cancela la operacion y se manda alerta "
    );
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text: "Para obtener la ER, debe existir un automata "
    });
    return;
  }
  plog.info("Se muestran opciones para obtener el ER");
  const inputOptions = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        1: "Resultado directo",
        2: "Paso a paso",
      });
    }, 100);
  });
  const { value: color } = await Swal.fire({
    title: "Opciones para obtener ER:",
    input: "radio",
    allowOutsideClick: false,
    inputOptions: inputOptions,
    showCancelButton: true,
    inputValidator: value => {
      if (!value) {
        return "Seleccione una opcion o cancele la operacion";
      } else if (value == 1) {
        transformarAFDaER(1,1);
      }else if (value == 2) {
        transformarAFDaER(1,2);
      }
}
  });

}
//transformarAFDaER(1);
async function transformarAFDaER(automata,value){
  cambiomas();
    var arista = edges.get();
//////////////////////////////////////////////////condicion estado inicial
  var qantiguo=estadoinicial(automata);
  var entradasinicial = arista.filter(arista => arista.to == qantiguo.id);
  if(entradasinicial.length!=0){
     if (value==2){
          alerta("Antiguo estado inicial "+qantiguo.id+" cuenta con entradas",3000,"info");
       await sleep(3000);
        }
    plog.info("Antiguo estado inicial "+qantiguo.id+" cuenta con entradas");
     var qinicialnuevo=añadirestadoinicial();
    if (value==2){
          alerta("Se agrega un nuevo estado inicial",5000,"success");
             await sleep(5000);
        }
    conectar(qinicialnuevo,qantiguo.id,"ε");
    if (value==2){
          alerta("Se conecta nuevo estado inicial "+qinicialnuevo+" hacia antiguo estado inicial "+qantiguo.id+" con transicion vacia",5000,"success");
             await sleep(5000);
        }
  
  nodes.updateOnly({ id: qantiguo.id,  color:"#97C2FC" });
    if (value==2){
          alerta("Antiguo estado inicial deja de serlo",4000,"info");
      await sleep(4000);
        }
    plog.info("Antiguo estado inicial deja de serlo");
    
    
  }
      
  /////////////////////////////////////////////////condicion estados finales
  
    var estadosfinales=estadosfinalesvector(automata);
  var cantefinalesantes=estadosfinales.length;
  var añadirnuevofinal=0;
  var cambiarcoloresfinales=0;
  for(let i=0;i<estadosfinales.length;i++){
      var salidasfinales= arista.filter(arista => arista.from == estadosfinales[i].id);
    console.log(estadosfinales);
    console.log(salidasfinales.length);
if(salidasfinales.length!=0){
  if(añadirnuevofinal==0){
    if (value==2){
          alerta("Existe al menos una salida en un estado final",3000,"info");
      await sleep(3000);
        }
        var qfinalnuevo=añadirestadofinal();

        plog.info("Existe al menos una salida en un estado final");
    if (value==2){
          alerta("Se agrega un nuevo estado final",3000,"success");
      await sleep(3000);
        }
       plog.info("Se agrega un estado final para convertir a ER");
   añadirnuevofinal=1;
  }
  cambiarcoloresfinales=1;
   break;
}
  }
    if(salidasfinales.length!=0){
     for(let i=0;i<estadosfinales.length;i++){
          conectar(estadosfinales[i].id,qfinalnuevo,"ε");
       if (value==2){
          alerta("Se conecta antiguo estado final "+estadosfinales[i].id+" a nuevo estado final "+qfinalnuevo+" con transicion vacia",4000,"success");
       await sleep(4000);
        }
     }
     
    }
    
    
    
    
    
    
  
  if(cambiarcoloresfinales==1){
     for(let i=0;i<estadosfinales.length;i++){
                 nodes.updateOnly({ id: estadosfinales[i].id,  color:"#97C2FC" });
     }
    if (value==2){
          alerta("Antiguos estados finales dejan de serlo",4000,"success");
       await sleep(4000);
        }
    plog.info("Antiguos estados finales dejan de serlo");
  }
  
  operaciontransformarAFD=1;
  siguientes(vectorintermedios(),value);
}
async function alerta(mensaje,tiempo,tipo){
  const Toast = Swal.mixin({
          toast: true,
          position: "top-start",
          showConfirmButton: false,
          timer: tiempo,
          timerProgressBar: true,
          didOpen: toast => {
            //toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
            //toast.addEventListener("mouseleave", Swal.disableButtons);
          }
        });

    Toast.fire({
          icon: tipo,
          title: mensaje
        });
  await sleep(tiempo);
}


  
   

async function siguientes(intermedio,value){
  var aristas;
  var nodos=nodes.get();
  for(let i=0;i<nodos.length;i++){
    if(nodos[i].color=="#C2FABC"){
      var inicialutil=nodos[i].id;
      break;
    }
  }
  console.log("////////////////////////////////////////////////////////////inicial: "+inicialutil);
  if (value==2){
          alerta("Desde nuevo estado inicial "+inicialutil+" hasta nuevo estado final existen "+intermedio.length+" estados intermedios",5000,"info");
       await sleep(5000);
        }
      plog.info("Desde nuevo estado inicial "+inicialutil+" hasta nuevo estado final existen "+intermedio.length+" estados intermedios");
  for(let i=0;i<intermedio.length;i++){
   aristas=edges.get();  
    var aux=aristas.filter(aristas => aristas.from == intermedio[i].id&&aristas.from!=aristas.to);
    
     await util(inicialutil,intermedio[i].id,aux,0,value);
    ordenararistasmismodestino(inicialutil);
     ordenararistas();
  
 } 
 }

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}
async function util(estadoi,intermedio,cantidadfinales,i,value){
  console.log("////////////////////////intermedio "+intermedio);
  console.log(cantidadfinales[i]);
  var final=cantidadfinales[i].to;
  var aristas=edges.get();
  console.log(aristas);
  var expresion;
  var primera=aristas.filter(aristas => aristas.from == estadoi);
   for(let i=0;i<primera.length;i++){
        if(primera[i].to==intermedio){
          expresion="("+primera[i].label+")";
          if (value==2){
          alerta("Existe camino entre estado "+estadoi+" y estado intermedio "+intermedio,3000,"ino");
      await sleep(3000);
        }
          plog.info("Existe camino entre "+estadoi+" y estado intermedio "+intermedio);
          break;
        }
      } 
 console.log(expresion);
  
  
    var aristasintermedio = aristas.filter(aristas => aristas.from == intermedio);
    for(let i=0;i<aristasintermedio.length;i++){
      if(aristasintermedio[i].from==aristasintermedio[i].to){
        expresion=expresion+"("+aristasintermedio[i].label+")"+"*";
        if (value==2){
          alerta("Existe bucle en estado intermedio "+intermedio,3000,"info");
      await sleep(3000);
        }
        plog.info("Existe bucle en estado intermedio "+intermedio);
      }
    }
   var aristasentrante = aristas.filter(aristas => aristas.to == intermedio&&aristas.from!=estadoi&&aristas.from==final);
  if(aristasentrante.length!=0){
    for(let i=0;i<aristasintermedio.length;i++){
    for(let j=0;j<aristasentrante.length;j++){
      if(aristasintermedio[i].to==final&&aristasentrante[j].to==intermedio&&aristasentrante[j].to!=aristasentrante[j].from){
        expresion=expresion+"["+"("+aristasintermedio[i].label+")"+"("+aristasentrante[j].label+")"+"]*";
        if (value==2){
          alerta("Existe un camino de ida y vuelta desde "+intermedio+" hasta "+final,3000,"info");
      await sleep(3000);
        }
        plog.info("Existe un camino de ida y vuelta desde "+intermedio+" hasta "+final);
        break;
      }
    }
      
 
    }
  }
 
 for(let i=0;i<aristasintermedio.length;i++){
      if(aristasintermedio[i].to==final){
        expresion=expresion+"("+aristasintermedio[i].label+")";
      }
    }
  
   expresion=reducirER(expresion);
  console.log(expresion);
  if (value==2){
          alerta("La transicion entre "+estadoi+" y estado "+final+" es "+expresion,3000,"info");
      await sleep(3000);
        }
  plog.info("La transicion entre "+estadoi+" y estado "+final+" es "+expresion);
     conectar(estadoi,final,expresion);
      if (value==2){
          alerta("Se conecta con expresion desde "+estadoi+" hasta estado "+final,3000,"success");
      await sleep(3000);
        }
  plog.info("Se conecta con expresion desde "+estadoi+" hasta estado "+final);
    

    if(i<(cantidadfinales.length-1)){
      await util(estadoi,intermedio,cantidadfinales,i+1,value);
    }else{borrarestadoconaristas(intermedio);
    if (value==2){        
      var mensaje="Se elimina estado "+intermedio+" junto a todas sus transiciones";
  alerta(mensaje,3000,"info");   
    await sleep(3000);
  }
 plog.info("Se elimina estado "+intermedio+" junto a todas sus transiciones");
    }
  

}
//////////////////////////////////////
function reducirER(label) {
  var labelgeneral = "ε";
  label = label.replace(new RegExp(labelgeneral, "g"), "");
  for (let i = 0; i < label.length; i++) {
    label = label.replace("()", "");
  }
  plog.info("Se reduce expresion quitando los ε");
  console.log(label);
  return label;
}   

function ordenararistas(){
  var aristas=edges.get();
  for(let i=0;i<ID-1;i++){
      var filtro=aristas.filter(aristas => aristas.from == i+1);
    for(let j=0;j<filtro.length;j++){
    var paraconectar=filtro[j];
      var nuevoid=filtro[j].from+"-"+(j+1);
      edges.remove(filtro[j].id);
       edges.add([
      {
        id: nuevoid,
        from: paraconectar.from,
        to: paraconectar.to,
        label:paraconectar.label
      }
    ]);
    }
  }
}

function ordenararistasmismodestino(estadoi){
    var aristas=edges.get();
  
      var filtro=aristas.filter(aristas => aristas.from == estadoi);
            
  
  if(1<filtro.length){
  for(let j=0;j<filtro.length;j++){
  for(let k=0;k<filtro.length;k++){
    if(filtro[k].id!=undefined&& filtro[j].id!=filtro[k].id && filtro[j].to==filtro[k].to){
      edges.remove(filtro[j].id);
      edges.remove(filtro[k].id);
      var nuevoid=filtro[j].id;
         edges.add([
      {
        id: nuevoid,
        from: filtro[j].from,
        to: filtro[j].to,
        label:"["+filtro[j].label+"]"+"+"+"["+filtro[k].label+"]"
      }
    ]);
      break;
    }
  }
  }
}
  
 }
    

  
///////////////////////////////////////////////////////////////////////////////////////////////
var network = new vis.Network(container, data, xoptions);
network.setOptions(xoptions);
