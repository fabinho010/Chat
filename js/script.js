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

function login() {
    var email = document.getElementById("mail").value;
    let password = document.getElementById("pass").value;

    let http = new XMLHttpRequest();

    http.open("GET", "http://localhost:8080/XatLLM/Login?mail=" + email + "&pass=" + password, true);
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var response = http.responseText;
            if (response === "false") {
                throw new Error("Credenciales inválidas");
            } else {
                sessionStorage.setItem("mail", email);
                sessionStorage.setItem("session", response);
                window.location.href = "html/menu.html";
            }
        }
    };
    http.send();
}

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
                alert("Error de creedenciales.Revisew los datos introducidos.");
                console.error("Error credenciales",http.status);
            }
        } else{
            alert("Error de servidor")
            console.error("Error en register",this.status);
        }
    }
    http.send();
}
