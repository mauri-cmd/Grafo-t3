var nodes,edges,ID = 5;
var cantidadautomatas = 1;
var estados,
  alfabeto,
  transicion,
  inicial,
  finales,
  operacionunir = 0,
  operacionconcatenacion = 0;
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
  { id: 2, label: "q2", color: "#fabcbc" },
  { id: 3, label: "q3", color: "#97C2FC" },
  { id: 4, label: "q4", color: "#fabcbc" },
]);
var o_nodes = new vis.DataSet(nodes);
//crear un array con las aristas

//NOTA PARA TODOS:EL ID DEL EDGE CORRESPONDE A "DESDE - CONTADOR DE ARISTAS PARA ESE NODO"
edges = new vis.DataSet([
  { id: "1-1", from: 1, to: 2, label: "a" },
  { id: "1-2", from: 1, to: 3, label: "b" },
  { id: "1-3", from: 1, to: 1, label: "c" },
  { id: "2-1", from: 2, to: 2, label: "a" },
  { id: "2-2", from: 2, to: 1, label: "b" },
  { id: "2-3", from: 2, to: 4, label: "c" },
  { id: "3-1", from: 3, to: 3, label: "a" },
  { id: "3-2", from: 3, to: 4, label: "b" },
  { id: "4-1", from: 4, to: 4, label: "c" },
  { id: "4-2", from: 4, to: 3, label: "a,b" },
  
  
   

]);

data = {
  nodes: nodes,
  edges: edges
};
qinicial1=estadoinicial(1);

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
      plog.info("Se escoge crear AFND");
      crearAFND();
    }
  });
}

async function crearAFD() {
  //(async() => {
  if (cantidadautomatas == 2) {
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
        for (let i = 0; i < finales; i++) {
          añadirestadofinal();
        }
        for (let i = 0; i < estados - 1 - finales; i++) {
          añadirestadonormal();
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
      max: 5,
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
async function estadosfinales1(q, alfabeto, opciones) {
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
//borra el automata completo
async function borrar() {
  var borrar = nodes.getIds();
  if (borrar.length == 0) {
    plog.warn(
      "Se intento eliminar un automata cuando no hay ninguno,se cancela la operacion y se manda alerta "
    );
    Swal.fire({
      icon: "warning",
      title: "Error...",
      text: "Para eliminar los automatas,agreguelos primero"
    });
    return;
  }
  const inputOptions = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        1: "1",
        2: "2",
        3: "Ambos"
      });
    }, 100);
  });
  const { value: color } = await Swal.fire({
    title: "Borrar automata:",
    input: "radio",
    allowOutsideClick: false,
    inputOptions: inputOptions,
    showCancelButton: true,
    inputValidator: value => {
      if (!value) {
        return "Seleccione automata para borrar o cancele la operacion";
      } else if (value == 1) {
        if (qinicial2 == undefined || (value == 1 && operacionunir == 1)) {
          value = 3;
        } else {
          plog.info("Se elimina automata 1");

          var diferencia = qinicial2 - qinicial1;
          console.log(diferencia);

          for (var i = 0; i < diferencia; i++) {
            nodes.remove(borrar[i]);
            var aristas = edges.get();
            var contadoraristas = aristas.filter(
              aristas => aristas.from == borrar[i]
            );
            var x = contadoraristas.length;
            while (x != 0) {
              edges.remove(contadoraristas[x - 1].id);
              x = x - 1;
            }
            contadoraristas = aristas.filter(
              aristas => aristas.to == borrar[i]
            );
            x = contadoraristas.length;
            while (x != 0) {
              edges.remove(contadoraristas[x - 1].id);
              x = x - 1;
            }
          }
          cantidadautomatas--;
        }
      } else if (value == 2) {
        if (cantidadautomatas < 2) {
          plog.warn(
            "Se intento eliminar un automata que no existe,se cancela la operacion y se manda alerta "
          );
          Swal.fire({
            icon: "warning",
            title: "Error...",
            text: "El automata seleccionado no existe"
          });
          return;
        } else {
          plog.info("Se elimina automata 2");
          var qinicial = qinicial2;
          for (var i = qinicial; i <= ID - 1; i++) {
            var aristas = edges.get();
            var contadoraristas = aristas.filter(
              aristas => aristas.from == nodes.get(i).id
            );
            var x = contadoraristas.length;
            while (x != 0) {
              edges.remove(contadoraristas[x - 1].id);
              x = x - 1;
            }
            contadoraristas = aristas.filter(
              aristas => aristas.to == nodes.get(i).id
            );
            x = contadoraristas.length;
            while (x != 0) {
              edges.remove(contadoraristas[x - 1].id);
              x = x - 1;
            }
            nodes.remove(nodes.get(i).id);
          }
          console.log(edges.get());
          cantidadautomatas--;
          ID = qinicial;
        }
      }
      if (value == 3) {
        plog.info("Se eliminan todos los automatas existentes ");

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
        }
      }
      if (value != 4) {
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
          title: "Se han borrado los automatas seleccionados"
        });
        plog.info("Se borra automata seleccionado ");
      }
    }
  });
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
  console.log(aristarep);

  if (desde == hasta && contadoraristas != 0 && aristarep == true) {
    for (var i = 0; i < contadoraristas.length; i++) {
      if (contadoraristas[i].from == contadoraristas[i].to) {
        var obtenerid = contadoraristas[i].id;
        var obtenerlabel = contadoraristas[i].label;
      }
    }
    console.log(
      "id=" + obtenerid + "///////" + "label=" + obtenerlabel + "," + label
    );
    edges.updateOnly({ id: obtenerid, label: obtenerlabel + "," + label });
  } else {
    contadoraristas = contadoraristas.length + 1;
    plog.info("Se conectan estado "+desde+" hacia estado "+hasta);
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
    plog.info("Se crea un vector con los estados finales del automata 1");
    return vectorfinales;
  } else {
    if (automata == 2) {
      for (let i = qinicial2; i < ID; i++) {
        console.log(nodes.get(i).color);
        if (nodes.get(i).color == "#fabcbc") vectorfinales.push(nodes.get(i));
      }
      plog.info("Se crea un vector con los estados finales del automata 2");
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
    plog.info("Se usa el estado inicial del automata 1");
    return automata1;
  }
  if (automata == 2) {
    plog.info("Se usa el estado inicial del automata 2");
    return automata2;
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
var network = new vis.Network(container, data, xoptions);
network.setOptions(xoptions);
