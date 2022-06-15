var URL_HOST = "https://9f0f-2806-2f0-7080-c9c8-c1b4-9c34-e39b-24ff.ngrok.io/";


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
        xhttp.open("POST", URL_HOST+"usuario/recovery", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(body));
    } catch (error) {
        alert(error);
    }
}