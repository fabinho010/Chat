const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconeClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconeClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});


// Función que se llama cuando se realiza un intento de inicio de sesión. 
//Obtiene los valores de los campos de correo electrónico y contraseña del formulario y realiza una solicitud GET 
//al servicio backend para verificar las credenciales. Si las credenciales son válidas, almacena el correo electrónico y la sesión en el sessionStorage y redirige al usuario a la página de menú.
function login() {
    var email = document.getElementById("mail").value;
    let password = document.getElementById("pass").value;

    let http = new XMLHttpRequest();

    http.open("GET", "http://localhost:8080/XatLLM/Login?mail=" + email + "&pass=" + password, true);
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var response = http.responseText;
            if (response === "false") {
                alert("Credenciales invalidas");
                console.error("Credenciales invalidas");
            } else {
                sessionStorage.setItem("mail", email);
                sessionStorage.setItem("session", response);
                window.location.href = "html/menu.html";
            }
        }
    };
    http.send();
}

//  Función que realiza una solicitud GET al servicio backend para obtener la lista de países disponibles. 
//Luego, actualiza un elemento de selección en el HTML con los países obtenido
function getPaises(){
    let http = new XMLHttpRequest();
    http.open("GET","http://localhost:8080/XatLLM/Register",true);
    http.onload = function (){
        if( this.readyState==4 && http.status == 200){
            var response = http.responseText;
            var json = JSON.parse(response);
            var paisSelect = document.getElementById("pais");
            paisSelect.innerHTML = "";

          // Agregar la opción "Elige tu nacionalidad..."
            var defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.disabled = true;
            defaultOption.text = "Elige tu nacionalidad...";
            paisSelect.add(defaultOption);

            for(var i = 0 ; i < json.length; i++){
                var option = document.createElement("option");
                option.value = json[i].code;
                option.text = json[i].name;
                paisSelect.add(option);
            }
    }else{
        console.error("Error en getPaises",http.status);
    }
};
http.send();

}
getPaises();


// Función que se llama cuando se intenta registrar un nuevo usuario. 
//Obtiene los valores de los campos de nombre de usuario, contraseña, correo electrónico y país del formulario
// y realiza una solicitud POST al servicio backend para registrar al usuario.
function register(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("contra").value;
    let email = document.getElementById("correo").value;
    let country = document.getElementById("pais").value;

    let http = new XMLHttpRequest();

    http.open("POST","http://localhost:8080/XatLLM/Register?user="+ username +"&pass=" + password + "&mail=" + email + "&codeCountry=" + country,true);

    http.onload = function(){
        if(this.readyState == 4 && this.status == 200){ 
            var response = http.responseText;
            if(response == "true"){
                alert("Usuario registrado");
                location.href = "index.html";
            } else{
                alert("Error de creedenciales.Revise los datos introducidos.");
                console.error("Error credenciales",http.status);
            }
        } else{
            alert("Error de servidor")
            console.error("Error en register",this.status);
        }
    }
    http.send();
}
