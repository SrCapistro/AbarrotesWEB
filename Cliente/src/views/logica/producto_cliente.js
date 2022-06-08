const URL = "http:/localhost:4000/";
var params = window.location.search.substring(1);
var idUsuario = localStorage.getItem('idUsuario');

function extraerParams(){
    id = params.split("=");
    return id[1];
}


function cargarProducto(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        mostrarProducto(data);
    }
    };
    xhttp.open("GET", URL+"productos/"+extraerParams(), true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function mostrarProducto(data){
    document.getElementById("tituloproducto").innerHTML = data[0].nombre;
    document.getElementById("costoproducto").innerHTML = data[0].precio;
    document.getElementById("categoria").innerHTML = "Aun no la pongo xd";
}

function añadirCarrito(){
    alert("Id producto: "+extraerParams()+"\n"+"Id usuario: "+idUsuario);
}


window.onload = function(){
    cargarProducto();
}