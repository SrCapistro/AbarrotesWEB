const URL = "http:/localhost:4000/";


function solicitarCodigo(){
    try {
        var correo = document.getElementById("txtCorreo").value;
        var body = {
            "correo": correo
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(parseInt(this.response) == 1){
                document.location.href = "codigorecuperacion.html";
                localStorage.setItem('correo', correo);
            }else{
                document.getElementById("alerterror").hidden = false;
            }
        }
        };
        xhttp.open("POST", URL+"usuario/recovery", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(body));
    } catch (error) {
        alert(error);
    }
}