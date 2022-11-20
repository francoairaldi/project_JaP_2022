//referencias
name1 = document.getElementById("name1");
name2 = document.getElementById("name2");
surname1 = document.getElementById("surname1");
surname2 = document.getElementById("surname2");
email = document.getElementById("email");
phone = document.getElementById("phone");
userCredentials = localStorage.getItem("storedUserName");
userStoredData = localStorage.getItem("userData");


//autentificacion del usuario
function authentication(){

    //user loged in
    if (userCredentials !== null){

        //populate email field
        email.value = userCredentials;

        //first time?
        if (userStoredData !== null){

            //user credentials match?
            if (userCredentials == JSON.parse(userStoredData).email_address){
                
                //populate fields
                let userDataTemp = JSON.parse(userStoredData);
                name1.value = userDataTemp.first_name;
                name2.value = userDataTemp.second_name;
                surname1.value = userDataTemp.first_surname;
                surname2.value = userDataTemp.second_surname;
                phone.value = userDataTemp.phone_number
            }
        }
    } else {
        //redirect user to login
        window.location.href="index.html"
    }
}

//validacion de campos requeridos
function validateProfile(){

    //validar los campos
    function validate(input){
        if (input == email){
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input.value)){
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            } else {
                input.classList.remove("is-valid");
                input.classList.add("is-invalid");
            }
        } else {
            if (input.value == "" ){
                input.classList.remove("is-valid");
                input.classList.add("is-invalid");
            }
            else {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            }
        }
    }

    //retornar estado del formulario
    function checkStatus(input){
        if (input == email){
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input.value)){
                return true
            } else {
                return false
            }
        } else {
            if (input.value == "" ){
                return false
            } else {
                return true
            }
        }
    }

    validate(name1);
    validate(surname1);
    validate(email);

    if (checkStatus(name1)&&checkStatus(surname1)&&checkStatus(email)){
        return true
    }

}

//guardar info en localstorage
function storeUserData(){

    //construir registro
    let userData = {
        first_name: name1.value,
        second_name: name2.value,
        first_surname: surname1.value,
        second_surname: surname2.value,
        email_address: email.value,
        phone_number: phone.value
    };

    //guardado en localstorage
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("storedUserName", userData.email_address)
    //en un principio iba a hacer que se puediesen almacenar registros persistentes para cada usuario, pero me pareció una chanchada llenar el localstorage de registros
    //tambien se podia solucionar almacenando los registros en un arreglo que fuese aumentandod de tamaño con cada nuevo registro, pero me pareció demasiada vuelta para algo que en la práctica se va a guardar en el servidor
    //de la manera que lo hice, el registro se sobreescribe al almacenar los datos de cada un nuevo usuario (solo persisten los datos del último usuario que llena los campos)
}

//notificar exito o error
function notifyStatus(input){
    
    let success = document.getElementById("successAlert");
    let error = document.getElementById("errorAlert");

    if (input){
        //exito
        error.setAttribute("hidden", true);
        success.removeAttribute("hidden")
    } else {
        //error
        success.setAttribute("hidden", true);
        error.removeAttribute("hidden")
    }
}

//ejecucion del codigo
document.addEventListener("DOMContentLoaded", function(event){

    //autentificacion
    authentication();
    document.getElementById("profile-form").addEventListener("submit", function(event){

        //submit
        event.preventDefault();
        if (validateProfile()){
            storeUserData();
            notifyStatus(true);
            //refresh userName on navbar
            if (document.getElementById("dropdownMenuLink").innerHTML !== email.value){
                document.getElementById("dropdownMenuLink").innerHTML = localStorage.getItem("storedUserName")
            }
        } else {
            notifyStatus(false)
        }
    })

})