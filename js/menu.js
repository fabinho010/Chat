const botones = document.querySelector('.Botones');
const tabla = document.querySelector('.tablaAmigos');
const exitTabla = document.querySelector('.exitTabla');
const openTabla = document.querySelector('.openTabla');
const wrapper = document.querySelector('.wrapper');
const openWrapper = document.querySelector('.openWrapper');

openTabla.addEventListener('click',()=> {
    tabla.classList.add('open');
})
openTabla.addEventListener('click',()=>{
    botones.classList.add('noshow');
})

exitTabla.addEventListener('click',()=>{
    tabla.classList.remove('open');
})

exitTabla.addEventListener('click',()=>{
    botones.classList.remove('noshow');
})

openWrapper.addEventListener('click',()=>{
    wrapper.classList.add('open');
});
openWrapper.addEventListener('click',()=>{
    botones.classList.add('close');
});







function listaAmigos(){
    let mail = sessionStorage.getItem('mail');
    let session = sessionStorage.getItem('session');

    var http = new XMLHttpRequest();

    http.open("GET","http://localhost:8080/XatLLM/Friend?mail=" + mail + "&session=" + session,true);
    http.onload = function(){
        if( this.readyState && http.status === 200){
            let friends = JSON.parse(this.responseText);
            let tbody = document.querySelector(".tablaAmigos tbody");
            tbody.innerHTML = "";
            for (var i = 0; i < friends.length ; i++){
                //creo una nueva fila//
                var fila = document.createElement("tr");
                // Crea la celda <td> y agrega el nombre del amigo
                var celdaEmail = document.createElement("td");
                celdaEmail.textContent = friends[i];
                fila.appendChild(celdaEmail);
                // Agrega la fila al tbody
                tbody.appendChild(fila);

            }
        } else {
            alert("Error al cargar la lista de amigos")
            console.log("Error al cargar amigos");
        }
    };
    http.send();
}


function añadirAmigo(){
    let mail = sessionStorage.getItem('mail');
    let session = sessionStorage.getItem('session');
    let friend = document.getElementById('mail').value;

    var http = new XMLHttpRequest();

    http.open("POST","http://localhost:8080/XatLLM/Friend?mail=" + mail + "&session=" + session + "&friend=" + friend,true);

    http.onload = function () {
        if (this.readyState ==4  && this.status === 200) {
            var response = http.responseText;
            if(response== 1){
                alert("Amigo añadido perfectamente");
                window.location.href = "menu.html"
            }else if (response == 2){
                alert("Amigo no encontrado");
                console.error("Usuario no esta en el sistema");
                window.location.href = "menu.html"
            }else if(response == 3){
                alert("Codigo de sesion ha expirado.Se requiere el Login nuevamente.");
                console.error("Sesion caducada.Se ha de loguear nuevamente");
                window.location.href = "index.html"
            }else if(response == 0){
                alert("El servidor no responde");
                console.error("El servidor no response");
            }
        }
    }
    http.send();
}

function irChat(){
    window.location.href="chat.html";
}

function logOut(){
    sessionStorage.removeItem('mail');
    sessionStorage.removeItem('session');
    window.location.href="/../index.html";
}