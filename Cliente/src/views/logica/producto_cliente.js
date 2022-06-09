
const URL = "http:/localhost:4000/";
var params = window.location.search.substring(1);
var idUsuario = localStorage.getItem('idUsuario');

function extraerParams(){
    id = params.split("=");
    return id[1];
}

var precioProducto;
function cargarProducto(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        precioProducto = data[0].precio;
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
   
    let cantidad = document.getElementById("txt_cantidad").value;
    if(cantidad){
        let agregarCarrito = {
            "idUsuario": idUsuario,
            "idProducto": extraerParams(),
            "cantidad": cantidad,
            "total": precioProducto * cantidad
        }

        var request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:4000/productos/agregarCarrito', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function(){
            
            if(this.response == 1){
                alert("Producto agregado exitosamente");
                window.open("Aquí va la ruta para abrir el carrito de compras");
            }else{
                alert("No fue posible realizar el registro");
            }
           
        }
        request.send(JSON.stringify(agregarCarrito));
    }else{
        document.getElementById("txt_cantidad").style.borderColor = "red";
    }
}


window.onload = function(){
    cargarProducto();
}