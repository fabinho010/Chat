const botones = document.querySelector('.Botones');
const tabla = document.querySelector('.tablaAmigos');
const exitTabla = document.querySelector('.exitTabla');
const openTabla = document.querySelector('.openTabla');

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