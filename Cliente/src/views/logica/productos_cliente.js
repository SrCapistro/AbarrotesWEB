var URL_HOST = "https://9f0f-2806-2f0-7080-c9c8-c1b4-9c34-e39b-24ff.ngrok.io/";
// var URL_HOST = "http://localhost:4000/"

var usuario;
var listaProductos = ""; 
var listaProductosFiltrados = ""; 

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

            var urlCarritoCompras = document.getElementById("productos");
            urlCarritoCompras.href = "productos.html?idUsuario="+idUsuario;
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
        listaProductos = data;
        mostrarProductos(data);
    }
    };
    // xhttp.open("GET", URLHost+"productos", true);
    xhttp.open("GET", URL_HOST+"productosCategorias", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function mostrarProductos(data){

    for(var i=0;i<data.length; i++){
        var card = `<div class="col">
                        <div class="card" style="min-height: 300px;">
                            <div class="text-center">
                                <img src="${URL_HOST}imagenesProductos/${data[i].ruta == null? "sinImagen.svg":data[i].ruta}" class="card-img-top " style="width:140px; margin-top: 10px; border-radius: 20px;" alt="imgProducto"></img>
                            </div>
                            <div class="card-body">
                                <h6 class="fw-bold">${data[i].nombre}</h6>
                                <h6> Precio: $${data[i].precio}</h6>
                            </div>
                            <div class="d-grid gap-2 mb-1 mx-1">
                                <button class="btn btn-primary btn-sm" onclick="verProducto(${data[i].idProducto})">Ver producto</button>
                            </div>
                        </div>
                    </div`
        document.getElementById("contenedor-productos").innerHTML += card;
    }
}

function cargarCategorias(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        mostrarCategorias(data);
    }
    };
    // xhttp.open("GET", URLHost+"obtenerCategorias", true);
    //xhttp.open("GET", "http://localhost:4000/categorias/obtenerCategorias", true);
    xhttp.open("GET", URL_HOST+"categorias/obtenerCategorias", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function mostrarCategorias(data){
    var selectorCategorias = document.getElementById("selectorcategoria");

    selectorCategorias.innerHTML += `<option value="-1" selected>Todos</option>`;
    
    for(var i=0;i<data.length; i++){
        var card = `<option value="${data[i].idCatego}">${data[i].nombreCatego}</option>`
        selectorCategorias.innerHTML += card;
    }
    
}

function verProducto(idProducto){
    //Brandon para acceder al ID del usuario nada m??s con el localStorage accedes.
    window.open('producto.html?idUsuario='+usuario.idUsuario+'&idProducto='+idProducto ,'_self');
}

function mostrarProductoCategoria(idCategoria) {
    listaProductosFiltrados = listaProductos;
    var contenedorProductos = document.getElementById("contenedor-productos");
    
    if(idCategoria == -1){
        contenedorProductos.innerHTML = "";
        mostrarProductos(listaProductos);
        listaProductosFiltrados = "";
    }else{
        contenedorProductos.innerHTML = "";

        listaProductosFiltrados = listaProductosFiltrados.filter(producto => producto.idCategoria == idCategoria)

        mostrarProductos(listaProductosFiltrados);
    }
    
}

function ordenarPorPrecio(valor) {

    var listaProductosCategorias = listaProductos;
    var contenedorProductos = document.getElementById("contenedor-productos");

    if (listaProductosFiltrados.length == 0) {

        if (parseInt(valor)) {
            listaProductosCategorias.sort(function(a, b) {
                return b.precio - a.precio;
            });
        }else{
            listaProductosCategorias.sort(function(a, b) {
                return a.precio - b.precio;
            });
        }
        contenedorProductos.innerHTML = "";
        mostrarProductos(listaProductosCategorias);

    }else{
        if (parseInt(valor)) {
            listaProductosFiltrados.sort(function(a, b) {
                return b.precio - a.precio;
            });
        }else if(!parseInt(valor)){
            listaProductosFiltrados.sort(function(a, b) {
                return a.precio - b.precio;
            });
        }
        contenedorProductos.innerHTML = "";
        mostrarProductos(listaProductosFiltrados);

    }
}

function buscarProducto() {
    
    var txtBuscarProducto = document.getElementById("txtBuscarProducto");
    var contenedorProductos = document.getElementById("contenedor-productos");

    var resultadosProductos;

    if(txtBuscarProducto.value.length != 0){
        if (listaProductosFiltrados.length == 0) {

            resultadosProductos = listaProductos.filter(producto => producto.nombre.toLowerCase().includes(txtBuscarProducto.value.toLowerCase()) ||
                                                                    producto.precio.toString().includes(txtBuscarProducto.value) || 
                                                                    producto.nombreCatego.toLowerCase().includes(txtBuscarProducto.value.toLowerCase()) );

        }else{
            resultadosProductos = listaProductosFiltrados.filter(producto => producto.nombre.toLowerCase().includes(txtBuscarProducto.value.toLowerCase()) ||
                                                                    producto.precio.toString().includes(txtBuscarProducto.value) || 
                                                                    producto.nombreCatego.toLowerCase().includes(txtBuscarProducto.value.toLowerCase()) );
        }
        contenedorProductos.innerHTML = "";
        mostrarProductos(resultadosProductos);
    }else{
        contenedorProductos.innerHTML = "";
        mostrarProductos(listaProductos);
    }
    
}

function buscadorVacio() {

    var enterBuscador = document.getElementById("txtBuscarProducto");
    if (enterBuscador.value.length == 0) {
        cargarProductos();
        document.getElementById("selectorprecio").value = -1;
        document.getElementById("selectorcategoria").value = -1;
    }
}


function cerrarSesion(){
    localStorage.removeItem(usuario.idUsuario);
    setTimeout(() => {
        window.open('../index.html','_self');
    }, 1000);
}

window.onload = function(){
    cargarProductos();
    cargarCategorias();

    var enterBuscador = document.getElementById("txtBuscarProducto");

    enterBuscador.addEventListener("keypress", function(event) {
  
        if (event.key === "Enter") {
    
            event.preventDefault();
            
            buscarProducto();
        }
    });
}