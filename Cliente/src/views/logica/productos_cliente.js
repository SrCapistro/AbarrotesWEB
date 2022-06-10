const URLHost = "http:/localhost:4000/";

var usuario; 

function validarUsuario() {

    let miURL = document.location.href;
    
    if(miURL.indexOf('?') > 0) {
        
        let valorUser = miURL.split('?')[1];

        let idUsuario = valorUser.split('=')[1];

        usuario =  JSON.parse(localStorage.getItem(idUsuario));

        if (!usuario) {
            window.open('../index.html','_self');
        }else if(usuario.tipo === "Cliente"){
            let mostrarMensaje = document.getElementById("nombreCompleto");
                mostrarMensaje.innerHTML = usuario.nombreCompleto;
                var urlCarritoCompras = document.getElementById("carritoCompras");
                urlCarritoCompras.href = "carritoCompras.html?idUsuario="+usuario.idUsuario;
        }
    }else{
        window.open('../index.html','_self');
    }
}

validarUsuario();

function cerrarSesion(){
    localStorage.removeItem(usuario.idUsuario);
    setTimeout(() => {
        window.open('../index.html','_self');
    }, 1000);
}

function cargarProductos(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        mostrarProductos(data);
    }
    };
    xhttp.open("GET", URLHost+"productos", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}


function mostrarProductos(data){
    //<img class="card-img-top" src="..." alt="Card image cap"></img>
    for(var i=0;i<data.length; i++){
        var card = `<div class="card" style="width:18rem; margin: 10px;">
                        
                        <div class="card-body">
                            <h5 class="card-title">${data[i].nombre}</h5>
                            <h6>$${data[i].precio}</h6>
                            <button class="btn btn-primary" onclick="verProducto(${data[i].idProducto})">Ver producto</button>
                        </div>
                    </div>`
        document.getElementById("contenedor-productos").innerHTML += card;
    }
}

function cargarCategorias(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(data);
        mostrarCategorias(data);
    }
    };
    xhttp.open("GET", URLHost+"obtenerCategorias", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function mostrarCategorias(data){
    for(var i=0;i<data.length; i++){
        var card = `<option value="${data[i].idCategoria}">${data[i].nombreCatego}</option>`
        document.getElementById("selectorcategoria").innerHTML += card;
    }
}

function verProducto(idProducto){
    //Brandon para acceder al ID del usuario nada más con el localStorage accedes.
    window.open('producto.html?idProducto='+idProducto ,'_self');
}

window.onload = function(){
    cargarProductos();
    cargarCategorias();
}