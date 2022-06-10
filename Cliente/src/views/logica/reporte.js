
//const URL = "http:/localhost:4000/";
var params = window.location.search.substring(1);
var idUsuario = localStorage.getItem('idUsuario');

function registrarReporte() {
    let formularioRegistrarReporte = document.forms.formularioRegistrarReporte;

    let txtAsunto = formularioRegistrarReporte.txtAsunto.value;
    let txtComentarios =formularioRegistrarReporte.txtComentarios.value;
    let imagenReporteVista = formularioRegistrarReporte.txtImagenReporte.files[0];
    /*
    let reporte = {
        comentarios:txtComentarios,
        tipo:txtAsunto,
        idUsuario:idUsuario
    }*/

    var reporte = new FormData();

    reporte.append("comentarios", txtComentarios);
    producto.append("tipo", txtAsunto);
    producto.append("idUsuario", idUsuario);
    producto.append("imagen", imagenReporteVista);

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

            formularioRegistrarReporte.txtAsunto.value = "";
            formularioRegistrarReporte.txtComentarios.value ="";

        }
    }

    request.send(JSON.stringify(reporte));
}

function visualizarImagenReporte() {

    const txtImagenReporte = document.getElementById("txtImagenReporte");
    const imagenReporteVista = document.getElementById("imagenReporteVista");
    
    imagenReporteVista.setAttribute("class","img-fluid");

    if (txtImagenReporte.files != 0) {
        
        const tipoImagen = [
            "image/apng",
            "image/bmp",
            "image/gif",
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/svg+xml",
            "image/tiff",
            "image/webp",
            "image/x-icon"
        ];

        for(const imagen of txtImagenReporte.files) {

            if(tipoImagen.includes(imagen.type)){
                imagenReporteVista.src = URL.createObjectURL(imagen);
            }
        }
    }

}