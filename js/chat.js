
 // Número máximo de conversaciones permitidas
var maxConversaciones = 5;
// Array para almacenar las conversaciones activas
var converActivas = []; 

var Usuarios = [];

var enviarBoton = document.getElementById('enviar');

var contenedor = document.querySelector(".contenedor");

var chatExist = document.querySelector(".caja");

var destinoSelect = document.getElementById("destino");

destinoSelect.addEventListener("change", function() {
    iniciarChat();
    agregarContacto();
    contenedor.style.display = 'block';
});

var contactos = document.querySelector(".contactos");


  function iniciarChat() {
    var destinatarioSeleccionado = destinoSelect.value;
    //Compruebo el usuario ya esta en el array de Usuarios porque si esta significa que ya tiene un chat disponible.
    var indiceUsuario = Usuarios.indexOf(destinatarioSeleccionado);
    if (indiceUsuario !== -1) {
        console.info(indiceUsuario);
        mostrarChatExistente(indiceUsuario);
        recibirMensajes();
    } else if (Usuarios.length < maxConversaciones) {
        //Creo el nuevo chat
        var cajaChat = crearCajaChat(destinatarioSeleccionado);
        cajaChat.id = 'caja-' + destinatarioSeleccionado;
        //Meto el usuario en el array de usuarios a la misma vez que el cajaChat que he creado.
        Usuarios.push(destinatarioSeleccionado);
        converActivas.push(cajaChat);
        //Añado el cajaChat en el Html
       chatExist.appendChild(cajaChat);
        mostrarChatExistente(Usuarios.length - 1);
        recibirMensajes();
    } else{
        console.error("Se alcanzó el máximo de chats activos");
        alert("Se alcanzó el máximo de chats disponibles");
        return;
    }
   
}


function crearCajaChat(User){
    var cajaChat = document.createElement('div');
    //La clase tiene que ser el mismo que la del html
    cajaChat.className = 'caja-chat';
    cajaChat.id = User;
    return cajaChat;
}

function mostrarChatExistente(indice) {
    for (var i = 0; i < converActivas.length; i++) {
      var cajaChat = converActivas[i];
      if (i === indice) {
        cajaChat.style.display = 'block';
        console.info(cajaChat);
      } else {
        cajaChat.style.display = 'none';
        recibirMensajes();
      }
    }
  }


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
    var cajaChatExistente = document.querySelector(".caja-chat");
    var http = new XMLHttpRequest();

    http.open("GET", "http://localhost:8080/XatLLM/Xat?mail=" + mail + "&session=" + session, true);
    http.onload = function() {
            var response = JSON.parse(http.responseText);
            // Verificar si response es un objeto
            if (typeof response === 'object') {
                var mensaje = response;
                /*uN FOR aqui para que el mensaje pueda recorrer el array que contiene el chat y que se coloque donde coreresponda*/
                for (var i = 0; i < converActivas.length; i++) {
                    cajaChatExistente = converActivas[i];
                    if((cajaChatExistente.id === "caja-"+ mensaje.emisor) && (mensaje.receptor === mail)) {
                        var spanMensaje = document.createElement("span"); 
                        spanMensaje.textContent = mensaje.text;
            
                        var divMensaje = document.createElement("div");
                        divMensaje.classList.add("bocadillo");
                        divMensaje.appendChild(spanMensaje);
        
                        // Agregar el mensaje al final de la caja de chat
                        cajaChatExistente.appendChild(divMensaje);
        
                        // Desplazar el scroll hacia abajo
                        cajaChatExistente.scrollTop = cajaChatExistente.scrollHeight;
                        recibirMensajes();
                    }
                }


            } else {
                console.error("La respuesta no es un objeto válido");
            }
    };
    
    http.send();
}

//
// Llama a la función recibirMensajes() cada 5 segundos
//setInterval(recibirMensajes, 1000);

function enviarMensaje(){
    var mail = sessionStorage.getItem('mail');
    var session = sessionStorage.getItem('session');
    var receptor = document.getElementById('destino').value;
    var sms = document.getElementById('mensaje').value;
    var cajaChatExistente = document.getElementById('caja-' + receptor);
    
    var http = new XMLHttpRequest();
    if( sms != ""){
        http.open("POST", "http://localhost:8080/XatLLM/Xat?mail=" + mail + "&session=" + session + "&receptor=" + receptor + "&sms=" + sms, true);
        http.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById('mensaje').value = "";
                if(cajaChatExistente.id === "caja-"+ receptor){
                 //Llevo el mesaje al chat
                 var spanMensaje = document.createElement("span"); 
                 spanMensaje.textContent = sms;
     
                 var divMensaje = document.createElement("div");
                 divMensaje.classList.add("bocadilloEnviar");
                 divMensaje.appendChild(spanMensaje);
                 // Agregar el mensaje al final de la caja de chat
                 cajaChatExistente.appendChild(divMensaje);
                 // Desplazar el scroll hacia abajo
                 cajaChatExistente.scrollTop = cajaChatExistente.scrollHeight;
                } else{
                    console.error("El ID del chat no coincide con el receptor del mensaje");
                }
            }
        }
        http.send();

    }

}


function agregarContacto() {

    var opcionSeleccionada = destinoSelect.value;
 if (opcionSeleccionada !== '' && Usuarios.length < maxConversaciones){
      var contacto = document.createElement('div');
      contacto.className = 'contactoBloque';
      contacto.id = opcionSeleccionada;
      contacto.innerText = opcionSeleccionada;
      contactos.appendChild(contacto)
      opcionSeleccionada = ''; // Reiniciar el select después de agregar el contacto
    }
  }


function enseñarChatContacto(){
    var contactoBloque = document.querySelector(".contactoBloque");
    console.info(contactoBloque);
    console.info(contactoBloque.id);
    var indexUsuario = Usuarios.indexOf(contactoBloque.id);
    mostrarChatExistente(indexUsuario);
}
