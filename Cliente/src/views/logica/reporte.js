
function registrarReporte() {
    let formularioRegistrarReporte = document.forms.formularioRegistrarReporte;

    let txtAsunto = formularioRegistrarReporte.txtAsunto.value;
    let txtComentarios =formularioRegistrarReporte.txtComentarios.value;
    //espacio para fotografia

    let reporte = {
        comentarios:txtComentarios,
        tipo:txtAsunto
    }

    var request = new XMLHttpRequest();

    request.open('POST', "http://localhost:4000/reportes/registrar", true);

    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function(){
        if (request.status >= 200 && request.status < 300) {
            
            let mostrarMensaje = document.getElementById("mostrarMensaje");

            if(this.response == 1){
                alert("Reporte enviado exitosamente");
            }else{
                alert("Error al enviar el reporte");
            }
        }
    }

    request.send(JSON.stringify(reporte));
}