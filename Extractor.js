let lista_canciones = [];
let last;
let actual;

function guardar(elem_array){
    elem_array.forEach((c)=>{
        !lista_canciones.some(e=>
            !!c.children[0].children[2] && 
            !!e.children[0].children[2] && 
            !!e.children[2] &&
            !!c.children[2] &&
            e.children[0].children[2] == c.children[0].children[2] &&
            e.children[2].textContent == c.children[2].textContent
            ) && !c.classList.contains("vl-placeholder") && lista_canciones.push(c)
  });
}

function scrollToLast(elem_array){
    elem_array[elem_array.length-1].scrollIntoView();
}

function listaToText(a){
    return a.map(e=>(!!e.children[0].children[2])? e.children[0].children[2].textContent : "").sort().join(",")
}

function sameLists(a,b){
    return listaToText(a) == listaToText(b)
}

function listaToJson(l){
    return l.map(e=>{
        return {
            song: (!!e.children[0].children[2])? e.children[0].children[2].textContent : "",
            artist: (!!e.children[2])? e.children[2].textContent : ""
        }
    })
}

function descargar(s,n){
    let b = new Blob([s],{type: "text/plain"});
    let a = document.createElement("a");
    document.body.appendChild(a);
    let url = window.URL.createObjectURL(b);
    a.setAttribute("href", url);
    a.setAttribute("download",n);
    a.click();
    document.body.removeChild(a);
}

function fin(){
    console.log("Fin");
    descargar(JSON.stringify(listaToJson(lista_canciones)),"stringified_list.txt");
    descargar("Song\tArtist\n" + listaToJson(lista_canciones).map(e=>`${e.song}\t${e.artist}`).join("\n"),"lista.csv")
}

function cicle(elem){
    actual = Array.from(elem.children);
    if (!sameLists(last,actual)){
        guardar(actual);
        scrollToLast(actual);
        last = actual;
        setTimeout(()=>{cicle(elem)},1000);
        console.log("Sigo");
    }else fin();
}

function extraerElementos(elem){
    last = Array.from(elem.children).slice(1);
    guardar(last);
    scrollToLast(last);
    setTimeout(()=>{cicle(elem)},1000);
}

extraerElementos(document.querySelectorAll(".songlist-container.material-shadow-z1>table>tbody")[0])
