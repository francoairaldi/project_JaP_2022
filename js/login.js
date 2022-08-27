//espera a que se cargue el DOM
document.addEventListener("DOMContentLoaded", function(event){
    //apuntar a los elementos con constantes para facil acceso
    const formLogin = document.getElementById("form-login");
    const inputEmail = document.getElementById("input-email");
    const inputPass = document.getElementById("input-password");
    //regex para la validacion del email
    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //EventListener para el submit
    formLogin.addEventListener("submit", function(event){
        //preventDefault para que no se recarge la pagina
        event.preventDefault();

        //bloque de validaciones
        if (!emailFormat.test(inputEmail.value)){
            inputEmail.classList.remove("is-valid");
            inputEmail.classList.add("is-invalid")
        } else {
            inputEmail.classList.remove("is-invalid");
            inputEmail.classList.add("is-valid")}
        if (!inputPass.value.length>0){
            inputPass.classList.remove("is-valid");
            inputPass.classList.add("is-invalid")
        } else {
            inputPass.classList.remove("is-invalid");
            inputPass.classList.add("is-valid")
        }
        //redireccion a home si email y password son validos
        if ((inputEmail.classList.contains("is-valid"))&&(inputPass.classList.contains("is-valid"))){
            window.location.href="home.html"
        }
    })
})