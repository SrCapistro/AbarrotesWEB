const URL = "http:/localhost:4000/";



function verificarCodigo(){
    try {
        var codigo = parseInt(document.getElementById("txtcodigo").value);
        var correo = localStorage.getItem('correo');
        var body = {
            "correo": correo,
            "codigo": codigo
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(parseInt(this.response) == 1){
                document.location.href = "recuperacion.html";
            }else{
                document.getElementById("alerterror").hidden = false;
            }
        }
        };
        xhttp.open("POST", URL+"usuario/passwordrecovery", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(body));
    } catch (error) {
        alert(error);
    }
}