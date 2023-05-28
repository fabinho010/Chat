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

