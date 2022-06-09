
function registrarReporte() {
    let formularioRegistrarReporte = document.forms.formularioRegistrarReporte;

    let txtAsunto = formularioRegistrarReporte.txtAsunto.value;
    let txtComentarios =formularioRegistrarReporte.txtComentarios.value;
    //espacio para fotografia


    let reporte = {
        comentarios: txtComentarios,
        tipo: txtAsunto
    }

    var request = new XMLHttpRequest();

    request.open('POST', "http://localhost:4000/reportes/registrar", true);

    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            
            let mostrarMensaje = document.getElementById("mostrarMensaje");

            if(this.response == 1){
                
                mostrarMensaje.innerHTML =  '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> Se registro el Producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';

                formularioRegistrarReporte.txtAsunto.value = "";
                formularioRegistrarReporte.txtComentarios.value = "";

            }else{
                mostrarMensaje.innerHTML =  '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                                                '<strong id="mensajeAlerta"> No se pudo registrar el producto</strong>' +
                                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                                            '</div>';
            }
        }
    }

    request.send(JSON.stringify(reporte));
}