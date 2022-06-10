
const URLHost = "http:/localhost:4000/";
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
    xhttp.open("GET", URLHost+"productos/"+extraerParams(), true);
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
    try {
        if(cantidad){
            let agregarCarrito = {
                "idUsuario": idUsuario,
                "idProducto": extraerParams(),
                "cantidad": cantidad,
                "total": precioProducto * cantidad
            }
    
            var request = new XMLHttpRequest();
            request.open('POST', URLHost+'agregarCarrito', true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.onload = function(){
                
                if(this.response == 1){
                    let restarCantidad = {
                        "cantidad": cantidad,
                        "idProducto": extraerParams()
                    }
                    var request2 = new XMLHttpRequest();
                    request2.open('PUT', URLHost+'restarProductos', true);
                    request2.setRequestHeader('Content-Type', 'application/json');
                    request2.onload = function(){
                        if(this.response == 1){
                            alert("Producto agregado exitosamente");
                            window.open('../vista_consumidor/carritoCompras.html?idUsuario='+idUsuario, '_self');
                        }else{
                            alert("El producto se agregó al carrito pero no se actualizó el total de productos restantes");
                        }
                    }
                    request2.send(JSON.stringify(restarCantidad));
                }else{
                    alert("No fue posible realizar el registro del producto al carrito");
                }
               
            }
            request.send(JSON.stringify(agregarCarrito));
        }else{
            document.getElementById("txt_cantidad").style.borderColor = "red";
        }
    } catch (error) {
        alert("Ocurrió un error, intente más tarde o comuniquese con los profesionales")
    }
    
}


window.onload = function(){
    cargarProducto();
}