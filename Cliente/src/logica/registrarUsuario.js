function registrar(){
    console.log("Hola")
    var nombreCompleto = document.getElementById("txt_nombre")
    var correo = document.getElementById("txt_correo")
    var contraseña = document.getElementById("txt_contraseña")
    var telefono = document.getElementById("txt_telefono")

    var camposVacios = false
    if(nombreCompleto == ""){
        camposVacios = true
    }
    if(correo == ""){
        camposVacios = true
    }
    if(contraseña == ""){
        camposVacios = true
    }
    if(telefono == ""){
        camposVacios = true
    }

    if(!camposVacios){
        let nuevoUsuario = {
            "nombreCompleto": nombreCompleto,
            "estatus": 1,
            "tipo": "Cliente",
            "contraseña": contraseña,
            "correo": correo,
            "telefono": telefono
            
        }
        try{
            registrarUsuario(nuevoUsuario)
            alert("Exito")
        }catch(err){
            alert("Error al registrar el cliente")
        }
    }else{
        alert("Asegurese de llenar todos los campos")
    }

    return false
}
