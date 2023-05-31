 // Número máximo de conversaciones permitidas
var maxConversaciones = 5;
// Array para almacenar las conversaciones activas
var converActivas = []; 

var enviarBoton = document.getElementById('enviar');
enviarBoton.addEventListener('click',function() {
    enviarMensaje();
});

var contenedor = document.querySelector(".contenedor");

var cajaChat = document.querySelector(".caja-chat");

var destinoSelect = document.getElementById("destino");

destinoSelect.addEventListener("change", function() {
    iniciarChat();
});

destinoSelect.addEventListener("change", function() {
    if (destinoSelect.value !== "") {
      contenedor.style.display = "block";
    } else {
      contenedor.style.display = "none";
    }
  });

/*var mensajeTextarea = document.querySelector('.mensajeTexto textarea');
mensajeTextarea.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      enviarMensaje();
    }
  });*/

  function iniciarChat() {
    var destinatarioSeleccionado = destinoSelect.value;
    console.info(destinatarioSeleccionado);


    //Compruebo si ya tiene iniciado adjudicado un chat.Boolenao
    var converExistente = converActivas.find(function(conversacion) {
        return conversacion.usuario === destinatarioSeleccionado;
    });
    console.info(converExistente);
    if (converExistente) {
        mostrarChatExistente(converActivas[destinatarioSeleccionado].cajaChat);
        return;
    } else if (converActivas.length < maxConversaciones) {

        //Creo el nuevo chat
        divChat = document.createElement("div");
        //Inner para que este sea el nuevo caja-chat
        cajaChat.innerHTML = divChat;
        // Añade la conversación en el array de chats activos
        converActivas.push({ usuario: destinatarioSeleccionado, cajaChat: divChat });

    } else{
        console.error("Se alcanzó el máximo de chats activos");
        alert("Se alcanzó el máximo de chats disponibles");
        return;
    }

}


function mostrarChatExistente(chat){
    cajaChat.replaceChildren(chat);
    //cajaChat.innerHTML = chat;
    //cajaChat.innerHTML = ""; // Limpia el contenido existente de cajaChat
    //cajaChat.appendChild(chat); // Agrega el elemento chat como hijo de cajaChat
}



//Encaso de que no funcione lo de arriba
/* Crea el nuevo elemento que deseas introducir
var nuevoElemento = document.createElement("div");
nuevoElemento.textContent = "Nuevo elemento";

// Obtén el elemento existente que deseas reemplazar
var elementoExistente = document.getElementById("elemento-a-reemplazar");

// Reemplaza el elemento existente con el nuevo elemento
elementoExistente.replaceWith(nuevoElemento);*/


function getAmigos(){
    let mail = sessionStorage.getItem('mail');
    let session = sessionStorage.getItem('session');

    var http = new XMLHttpRequest();
    http.open("GET","http://localhost:8080/XatLLM/Friend?mail=" + mail + "&session=" + session,true);

    http.onload = function (){
        if( this.readyState==4 && http.status == 200){
            var response = JSON.parse(http.responseText);
            var destino = document.getElementById("destino");
            destino.innerHTML = "";

          // Agregar la opción "Elige un destinatario..."
            var defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.disabled = true;
            defaultOption.text = "Elige destinatario...";
            destino.add(defaultOption);

            for(var i = 0 ; i < response.length; i++){
                var option = document.createElement("option");
                option.value = response[i];
                option.text = response[i];
                destino.add(option);
            }
    }else{
        console.error("Error en getAmigos",http.status);
    }
};
http.send();
}
getAmigos();



function recibirMensajes() {
    var mail = sessionStorage.getItem('mail');
    var session = sessionStorage.getItem('session');

    var http = new XMLHttpRequest();

    http.open("GET", "http://localhost:8080/XatLLM/Xat?mail=" + mail + "&session=" + session, true);
    http.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(http.responseText);
            var cajaChat = document.querySelector(".caja-chat");
    
            console.info(response);
    
            // Verificar si response es un objeto
            if (typeof response === 'object') {
                var mensaje = response;

                
                var spanMensaje = document.createElement("span"); 
                spanMensaje.textContent =mensaje.emisor + " : " + mensaje.text;
    
                var divMensaje = document.createElement("div");
                divMensaje.appendChild(spanMensaje);
    
                // Agregar el mensaje al final de la caja de chat
                cajaChat.appendChild(divMensaje);
            } else {
                console.error("La respuesta no es un objeto válido");
            }
        }
    };
    
    http.send();
}

//recibirMensajes();
// Llama a la función recibirMensajes() cada 5 segundos
setInterval(recibirMensajes, 5000);

function enviarMensaje(){
    var mail = sessionStorage.getItem('mail');
    var session = sessionStorage.getItem('session');
    var receptor = document.getElementById('destino').value;
    var sms = document.getElementById('mensaje').value;
    
    var http = new XMLHttpRequest();

    http.open("POST", "http://localhost:8080/XatLLM/Xat?mail=" + mail + "&session=" + session + "&receptor=" + receptor + "&sms=" + sms, true);
    
    http.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('mensaje').value = "";
        }
    }
    http.send();
}

