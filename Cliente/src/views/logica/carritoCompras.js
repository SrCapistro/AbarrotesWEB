var usuario; 
var carritoUsuario;

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

function cargarProductos() {

    var request = new XMLHttpRequest();

    request.open('GET', "http://localhost:4000/obtenerCarrito/" + usuario.idUsuario, true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            let carrito = JSON.parse(this.response);
            
            carritoUsuario = carrito;

            cargarTablaProductos(carrito)

                   
        }
        let totalCantidadProducto = document.getElementById("totalCantidadProducto");
        totalCantidadProducto.innerHTML = calcularTotales(2);
        let totalPrecioProducto = document.getElementById("totalCantidadPrecio");
        totalPrecioProducto.innerHTML = "$" + calcularTotales(4);
        
    }
    request.send();
}
cargarProductos();

function cargarTablaProductos(carrito) {
    let tbodyRef = document.getElementById('tablaCarrito').getElementsByTagName('tbody')[0];
            
            tbodyRef.innerHTML= "";

            let contador = 0;

            for (var key in carrito) {

                if(carrito.hasOwnProperty(key)){

                    let nuevaFila = tbodyRef.insertRow();

                    ++contador;

                    let cellNumeroProducto = nuevaFila.insertCell();
                    let numeroProducto = document.createTextNode(contador);
                    cellNumeroProducto.appendChild(numeroProducto);
                    
                    let cellNombre = nuevaFila.insertCell();
                    let nombre = document.createTextNode(carrito[key].nombre);
                    cellNombre.appendChild(nombre);

                    let cellCantidad = nuevaFila.insertCell();
                    let txtCantidad = document.createElement("input");
                    txtCantidad.setAttribute("type","number");
                    txtCantidad.setAttribute("id","idProducto"+carrito[key].idProducto);
                    txtCantidad.setAttribute("class","form-control form-control-sm");
                    txtCantidad.setAttribute("style","width:100px");
                    txtCantidad.setAttribute("step",1);
                    txtCantidad.setAttribute("value",carrito[key].cantidad);
                    txtCantidad.setAttribute("onchange","actualizarTotalProducto(this)");
                    cellCantidad.appendChild(txtCantidad);

                    let cellPrecio = nuevaFila.insertCell();
                    let precio = document.createTextNode("$" + carrito[key].precio);
                    cellPrecio.appendChild(precio);
                    
                    calcularPrecioProducto(carrito[key].cantidad, carrito[key].precio)

                    let cellTotal = nuevaFila.insertCell();
                    let total = document.createTextNode("$" + calcularPrecioProducto(carrito[key].cantidad, carrito[key].precio));
                    cellTotal.appendChild(total);

                    let cellEliminar = nuevaFila.insertCell();
                    let btnEliminar = document.createElement("button");
                    btnEliminar.setAttribute("type","button");
                    btnEliminar.setAttribute("class","btn btn-danger btn-sm");
                    btnEliminar.setAttribute("value",carrito[key].idCarrito);
                    btnEliminar.setAttribute("onclick","eliminarProducto(this.value)");
                    btnEliminar.innerText = "Eliminar";
                    cellEliminar.appendChild(btnEliminar);

                }
            }
}

//Pendiente
function eliminarProducto(idCarrito) {

    var request = new XMLHttpRequest();

    request.open('DELETE', "http://localhost:4000/eliminarCarrito/"+idCarrito, true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            
            let mostrarMensaje = document.getElementById("mostrarMensaje");

            if(this.response == 1){
                
                mostrarMensaje.innerHTML =  '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> Se elimino el Producto </strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
                cargarProductos()

            }else{
                mostrarMensaje.innerHTML =  '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> No se pudo eliminar el producto </strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
            }
        }
    }

    request.send();
}

//Pendiente
function actualizarTotalProducto(input) {

    //Se verificaron las canidades en la bd y se actualizaron las cantidades en la base de datos
    if (true) {

        for (var key in carritoUsuario) {

            if(carritoUsuario.hasOwnProperty(key)){

                if (parseInt(input.id.slice(10)) == carritoUsuario[key].idProducto) {

                    carritoUsuario[key].cantidad = parseInt(document.getElementById(input.id).value);
                }
            }
        }

        cargarTablaProductos(carritoUsuario);

        let totalCantidadProducto = document.getElementById("totalCantidadProducto");
        totalCantidadProducto.innerHTML = calcularTotales(2);
        let totalPrecioProducto = document.getElementById("totalCantidadPrecio");
        totalPrecioProducto.innerHTML = "$" + calcularTotales(4);
    }
}

function calcularPrecioProducto(cantidadProducto, precioProducto) {
    return cantidadProducto * precioProducto;
}

function calcularTotales(numeroColumna) {
    
    let total = 0;

    let numeroFilas = document.getElementById('tablaCarrito').getElementsByTagName('tbody')[0].getElementsByTagName("tr").length;

        for (let index = 0; index < numeroFilas; index++) {
            if (numeroColumna == 2) {
                total += parseFloat(document.getElementById('tablaCarrito').getElementsByTagName('tbody')[0].getElementsByTagName("tr")[index].getElementsByTagName("td")[numeroColumna].firstChild.value);
            }else{
                total += parseFloat(document.getElementById('tablaCarrito').getElementsByTagName('tbody')[0].getElementsByTagName("tr")[index].getElementsByTagName("td")[numeroColumna].firstChild.nodeValue.slice(1));
            }
        }
    return total;
}