var usuario;
var listaProductos; 

function validarUsuario() {

    let miURL = document.location.href;
    
    if(miURL.indexOf('?') > 0) {
        
        let valorUser = miURL.split('?')[1];

        let idUsuario = valorUser.split('=')[1];

        usuario =  JSON.parse(localStorage.getItem(idUsuario));

        if (!usuario) {
            window.open('index.html','_self');
        }else if(usuario.tipo === "Cliente"){
            let mostrarMensaje = document.getElementById("nombreCompleto");
                mostrarMensaje.innerHTML = usuario.nombreCompleto;
        }
    }else{
        window.open('index.html','_self');
    }
}
validarUsuario();

function cerrarSesion(){
    localStorage.removeItem(usuario.idUsuario);
    setTimeout(() => {
        window.open('index.html','_self');
    }, 1000);
}

/////////////////////////////////////METODOS SOLO PARA PRODUCTOS////////////////////////////////////////
function cargarProductos() {

    var request = new XMLHttpRequest();

    request.open('GET', "http://localhost:4000/productosCategorias", true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            let productos = JSON.parse(this.response);
            listaProductos = productos;

            let tbodyRef = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
            
            tbodyRef.innerHTML= "";

            for (var key in productos) {

                if(productos.hasOwnProperty(key)){

                    let nuevaFila = tbodyRef.insertRow();

                    let cellIdProducto = nuevaFila.insertCell();
                    let cellNombre = nuevaFila.insertCell();
                    let cellPrecio = nuevaFila.insertCell();
                    let cellCantidad = nuevaFila.insertCell();
                    let cellIdCategoria = nuevaFila.insertCell();
                    let cellEstatus = nuevaFila.insertCell();
                    let cellModificar = nuevaFila.insertCell();
                    let cellEliminar = nuevaFila.insertCell();

                    let idProducto = document.createTextNode(productos[key].idProducto);
                    let nombre = document.createTextNode(productos[key].nombre);
                    let precio = document.createTextNode("$" + productos[key].precio);
                    let cantidad = document.createTextNode(productos[key].cantidad);
                    let idCategoria = document.createTextNode(productos[key].nombreCatego);
                    let estatus = document.createTextNode(productos[key].estatus == 1 ? "Disponible":"Agotado");

                    let btnModificar = document.createElement("button");

                    btnModificar.setAttribute("type","button");
                    btnModificar.setAttribute("class","btn btn-warning btn-sm");
                    btnModificar.setAttribute("value",productos[key].idProducto);
                    btnModificar.setAttribute("onclick","modificarProducto(this.value)");
                    btnModificar.innerText = "Modificar";
                    
                    let btnEliminar = document.createElement("button");

                    btnEliminar.setAttribute("type","button");
                    btnEliminar.setAttribute("class","btn btn-danger btn-sm");
                    btnEliminar.setAttribute("value",productos[key].idProducto);
                    btnEliminar.setAttribute("onclick","eliminarProducto(this.value)");
                    btnEliminar.innerText = "Eliminar";


                    cellIdProducto.appendChild(idProducto);
                    cellNombre.appendChild(nombre);
                    cellPrecio.appendChild(precio);
                    cellCantidad.appendChild(cantidad);
                    cellIdCategoria.appendChild(idCategoria);
                    cellEstatus.appendChild(estatus);
                    cellModificar.appendChild(btnModificar);
                    cellEliminar.appendChild(btnEliminar);

                }
            }       
        }
    }
    request.send();
}
cargarProductos();

function cargarComboCategoria() {

    let selectCategoria = document.getElementById("selectCategoria");

    var request = new XMLHttpRequest();

    request.open('GET', "http://localhost:4000/categorias/obtenerCategorias", true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            let categorias = JSON.parse(this.response);

            for (var key in categorias) {

                if(categorias.hasOwnProperty(key)){

                    var opcionCategoria = new Option(categorias[key].nombreCatego, categorias[key].idCatego);
                    selectCategoria.options.add(opcionCategoria);
                }
            }       
        }
    }
    request.send();
}
cargarComboCategoria();

function registrarProducto() {
    let formularioIniciarSesion = document.forms.formularioRegistrarProducto;

    let txtProducto = formularioIniciarSesion.txtProducto.value;
    let txtPrecio = formularioIniciarSesion.txtPrecio.value;
    let txtCantidad = formularioIniciarSesion.txtCantidad.value;
    let selectCategoria = formularioIniciarSesion.selectCategoria.value;

    let producto = {
        nombre:txtProducto,
        precio: txtPrecio,
        cantidad: txtCantidad,
        idCategoria: selectCategoria,
        estatus: txtCantidad == "0" ? 0 : 1
    }

    var request = new XMLHttpRequest();

    request.open('POST', "http://localhost:4000/productos/registrar", true);

    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            
            let mostrarMensaje = document.getElementById("mosntrarMensaje");

            if(this.response == 1){
                
                mostrarMensaje.innerHTML =  '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> Se registro el Producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';

                formularioIniciarSesion.txtProducto.value = "";
                formularioIniciarSesion.txtPrecio.value = "";
                formularioIniciarSesion.txtCantidad.value = "";

                cargarProductos();

            }else{
                mostrarMensaje.innerHTML =  '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> No se pudo registrar el producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
            }
        }
    }

    request.send(JSON.stringify(producto));
}

function eliminarProducto(idProducto) {
    
    var request = new XMLHttpRequest();

    request.open('DELETE', "http://localhost:4000/productos/eliminar/"+idProducto, true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            
            let mostrarMensaje = document.getElementById("mosntrarMensaje");

            if(this.response == 1){
                
                mostrarMensaje.innerHTML =  '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> Se elimino el Producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
                cargarProductos();

            }else{
                mostrarMensaje.innerHTML =  '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> No se pudo eliminar el producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
            }
        }
    }

    request.send();
}

function modificarProducto(idProducto) {

    let btnModificarProducto =  document.getElementById("btnRegistrarNuevoProducto");
    btnModificarProducto.click();

    let txtTituloModal =  document.getElementById("txtTituloModal");
    txtTituloModal.innerHTML ="Modificar Producto";


    let btnRegistra = document.getElementById("btnRegistraProducto");
    btnRegistra.setAttribute("class", "btn btn-primary visually-hidden");
    let btnModificar = document.getElementById("btnModificarProducto");
    btnModificar.setAttribute("class", "btn btn-primary");

    let formularioIniciarSesion = document.forms.formularioRegistrarProducto;

    for (var key in listaProductos) {

        if(listaProductos.hasOwnProperty(key)){

            if(listaProductos[key].idProducto == idProducto){
                
                formularioIniciarSesion.txtIdProducto.value = listaProductos[key].idProducto;
                formularioIniciarSesion.txtProducto.value = listaProductos[key].nombre;
                formularioIniciarSesion.txtPrecio.value = listaProductos[key].precio;
                formularioIniciarSesion.txtCantidad.value = listaProductos[key].cantidad;
                formularioIniciarSesion.selectCategoria.value = listaProductos[key].idCatego;

                return;
            }
        }
    }
}

function guardarProductoModificado() {

    let formularioIniciarSesion = document.forms.formularioRegistrarProducto;
    
    let txtIdProducto = formularioIniciarSesion.txtIdProducto.value;
    let txtProducto = formularioIniciarSesion.txtProducto.value;
    let txtPrecio = formularioIniciarSesion.txtPrecio.value;
    let txtCantidad = formularioIniciarSesion.txtCantidad.value;
    let selectCategoria = formularioIniciarSesion.selectCategoria.value;

    let producto = {
        idProducto:txtIdProducto,
        nombre:txtProducto,
        precio: txtPrecio,
        cantidad: txtCantidad,
        idCategoria: selectCategoria,
        estatus: txtCantidad == "0" ? 0 : 1
    }

    var request = new XMLHttpRequest();

    request.open('PUT', "http://localhost:4000/productos/actualizar", true);

    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            
            let mostrarMensaje = document.getElementById("mosntrarMensaje");

            if(this.response == 1){

                
                mostrarMensaje.innerHTML =  '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> Se modifico el Producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
                
                formularioIniciarSesion.txtIdProducto.value = "";
                formularioIniciarSesion.txtProducto.value = "";
                formularioIniciarSesion.txtPrecio.value = "";
                formularioIniciarSesion.txtCantidad.value = "";

                cargarProductos();

            }else{
                mostrarMensaje.innerHTML =  '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> No se pudo modificar el producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
            }
        }
    }

    request.send(JSON.stringify(producto));


}

function resetearModal() {
    let txtTituloModal =  document.getElementById("txtTituloModal");
    txtTituloModal.innerHTML ="Registrar Producto";

    let btnRegistra = document.getElementById("btnRegistraProducto");
    btnRegistra.setAttribute("class", "btn btn-primary");

    let btnModificar = document.getElementById("btnModificarProducto");
    btnModificar.setAttribute("class", "btn btn-primary visually-hidden");
}