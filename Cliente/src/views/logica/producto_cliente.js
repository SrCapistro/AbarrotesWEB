const URLHost = "http:/localhost:4000/";

var urlParametro = window.location.search;
var parametro = new URLSearchParams(urlParametro);

var idUsuario = parametro.get('idUsuario');
var idProducto = parametro.get('idProducto');

var usuario = "";
var precioProducto = "";

function validarUsuario() {

    usuario =  JSON.parse(localStorage.getItem(idUsuario));

    if (!usuario) {
        window.open('../index.html','_self');
    }else if(usuario.tipo === "Cliente"){
        
        let mostrarMensaje = document.getElementById("nombreCompleto");

        mostrarMensaje.innerHTML = usuario.nombreCompleto;

        var urlCarritoCompras = document.getElementById("carritoCompras");
        urlCarritoCompras.href = "carritoCompras.html?idUsuario="+idUsuario;
        
        var urlCarritoCompras = document.getElementById("productos");
        urlCarritoCompras.href = "productos.html?idUsuario="+idUsuario;

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

function cargarProducto(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        precioProducto = data[0].precio;
        mostrarProducto(data);
    }
    };
    xhttp.open("GET", "http://localhost:4000/productos/"+idProducto, true);
    // xhttp.open("GET", URLHost+"productos/"+idProducto, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function mostrarProducto(data){

    let img = data[0].ruta == null ? "sinImagen.svg":data[0].ruta
    
    document.getElementById("imgPrducto").src = "http://localhost:4000/imagenesProductos/" + img; 
    document.getElementById("tituloproducto").innerHTML = data[0].nombre;
    document.getElementById("costoproducto").innerHTML ="Precio: $" + data[0].precio;
    document.getElementById("categoria").innerHTML = data[0].nombreCatego;
    document.getElementById("mensajeArticulosDisponibles").innerHTML = data[0].cantidad;

    cargarProductoCarrusel(data[0].idCategoria, data[0].idProducto);
}

function cargarProductoCarrusel(idCategoria, idProductoExcluir){
    var request = new XMLHttpRequest();

    request.open('GET', "http://localhost:4000/productos/categoriaImagen/" + idCategoria, true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            let productos = JSON.parse(this.response);

            var imagenesCarrusel = document.getElementById("imagenesCarrusel");
            var botonesCarrusel = document.getElementById("botonesCarrusel");

            if(productos.length != 0){

                var contador = 0;

                for (var key in productos) {

                    if(productos.hasOwnProperty(key) && productos[key].idProducto != idProductoExcluir){
                        productos[key].ruta = productos[key].ruta == null ? 'sinImagen.svg" style="width: 150px; padding-top:20px;"' : productos[key].ruta;
                        if(productos[key].ruta){
                            if (contador == 0) {
                                botonesCarrusel.innerHTML = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${contador}" class="active" aria-current="true" aria-label="Slide ${contador}"></button>`;
                                imagenesCarrusel.innerHTML =`<div class="carousel-item active">
                                                                <div class="d-flex justify-content-center">
                                                                    <div class="card mb-3" style="max-width: 540px; border-width: 0px;">
                                                                        <div class="row g-0 align-items-center">
                                                                            <div class="col-md-4 align-self-center">
                                                                            <img src="http://localhost:4000/imagenesProductos/${productos[key].ruta}" class="img-fluid rounded-start" alt="imgProducto">
                                                                            </div>
                                                                            <div class="col-md-8">
                                                                                <div class="card-body">
                                                                                    <h5 class="card-title">${productos[key].nombre}</h5>
                                                                                    <p class="card-text">Precio $${productos[key].precio}</p>
                                                                                    <p class="card-text"> ${productos[key].cantidad} Disponibles <a class="btn btn-sm btn-primary" role="button" href="producto.html?idUsuario=${idUsuario}&idProducto=${productos[key].idProducto}">Comprar</a> </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>`;
                                contador++;
                            }else{
                                botonesCarrusel.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${contador}" aria-label="Slide ${contador}"></button>`;
                                imagenesCarrusel.innerHTML +=`<div class="carousel-item">
                                                                <div class="d-flex justify-content-center">
                                                                    <div class="card mb-3" style="max-width: 540px; border-width: 0px;">
                                                                        <div class="row g-0 align-items-center">
                                                                            <div class="col-md-4 align-self-center">
                                                                            <img src="http://localhost:4000/imagenesProductos/${productos[key].ruta}" class="img-fluid rounded-start" alt="imgProducto">
                                                                            </div>
                                                                            <div class="col-md-8">
                                                                                <div class="card-body">
                                                                                    <h5 class="card-title">${productos[key].nombre}</h5>
                                                                                    <p class="card-text">Precio $${productos[key].precio}</p>
                                                                                    <p class="card-text"> ${productos[key].cantidad} Disponibles <a class="btn btn-sm btn-primary" role="button" href="producto.html?idUsuario=${idUsuario}&idProducto=${productos[key].idProducto}">Comprar</a> </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                             </div>`;
                                contador++;
                            }
                        }
                    }
                }

                if (!contador) {
                    botonesCarrusel.innerHTML = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>`;
                    imagenesCarrusel.innerHTML =`<div class="carousel-item active">
                                                <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: No Existe mas producto en la categoria con fotos" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#555"></rect><text x="37%" y="50%" fill="#FFFFFF" dy=".3em">No existe producto en la categoria con fotos</text></svg>
                                            </div>`;
                }
                
            }else{
                botonesCarrusel.innerHTML = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>`;
                imagenesCarrusel.innerHTML =`<div class="carousel-item active">
                                                <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: No Existe mas producto en la categoria" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#555"></rect><text x="45%" y="50%" fill="#FFFFFF" dy=".3em">No existe producto en la categoria</text></svg>
                                            </div>`;
            }
        }else{
            var imagenesCarrusel = document.getElementById("imagenesCarrusel");
            var botonesCarrusel = document.getElementById("botonesCarrusel");

            botonesCarrusel.innerHTML = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>`;
            imagenesCarrusel.innerHTML =`<div class="carousel-item active">
                                            <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: No se pudo cargar el producto" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#555"></rect><text x="45%" y="50%" fill="#FFFFFF" dy=".3em">No se pudo cargar el producto</text></svg>
                                        </div>`;
        }
    }
    request.send();
}

function añadirCarrito(){
    let cantidad = document.getElementById("txt_cantidad").value;
    try {
        if(cantidad){
            let agregarCarrito = {
                "idUsuario": idUsuario,
                "idProducto": idProducto,
                "cantidad": cantidad,
                "total": precioProducto * cantidad
            }
    
            var request = new XMLHttpRequest();

            request.open('POST', 'http://localhost:4000/agregarCarrito', true);
            // request.open('POST', URLHost+'agregarCarrito', true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.onload = function(){
                
                if(this.response == 1){
                    let restarCantidad = {
                        "cantidad": cantidad,
                        "idProducto": idProducto
                    }
                    var request2 = new XMLHttpRequest();
                    request2.open('PUT', 'http://localhost:4000/restarProductos', true);
                    // request2.open('PUT', URLHost+'restarProductos', true);
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