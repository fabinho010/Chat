
 // Número máximo de conversaciones permitidas
var maxConversaciones = 5;
// Array para almacenar las conversaciones activas
var converActivas = []; 
//Array para almacenar los usuarios
var Usuarios = [];

var enviarBoton = document.getElementById('enviar');

var contenedor = document.querySelector(".contenedor");

var chatExist = document.querySelector(".caja");

var destinoSelect = document.getElementById("destino");

destinoSelect.addEventListener("change", function() {
    agregarContacto();
    iniciarChat();
    contenedor.style.display = 'block';
});

var contactos = document.querySelector(".contactos");


// Función que se llama cuando se selecciona un destinatario del chat. 
//Comprueba si el usuario ya tiene un chat activo o si se puede crear un nuevo chat. 
//Crea una nueva caja de chat si es posible y la agrega al HTML.
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

// Función auxiliar que crea y devuelve un elemento div para la caja de chat con el destinatario especificado.
function crearCajaChat(User){
    var cajaChat = document.createElement('div');
    //La clase tiene que ser el mismo que la del html
    cajaChat.className = 'caja-chat';
    cajaChat.id = User;
    return cajaChat;
}

// Función que muestra la caja de chat correspondiente
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


  //Función que realiza una solicitud GET al servicio backend para obtener la lista de amigos de un usuario.
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



//Función que realiza una solicitud GET al servicio backend para recibir un mensaje pendiente. 
//Si hay un mensaje válido, lo muestra en la caja de chat correspondiente.

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



//Función que se llama cuando se envía un mensaje. Obtiene los datos necesarios del formulario y realiza una solicitud POST
// al servicio backend para enviar el mensaje.
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


// Funciona para agregar contactos.Crea un elemento de contacto en el HTML y asigna un manejador de eventos 
//para mostrar el chat correspondiente cuando se hace clic en el contacto.
function agregarContacto() {
        
        var opcionSeleccionada = destinoSelect.value;
        var indexSel = Usuarios.indexOf(opcionSeleccionada);
        //Si en el select no es vacio , ni se ha llegado al cupo de usuario y no sea creeado el contacto
    if(opcionSeleccionada !== '' && Usuarios.length < maxConversaciones && (indexSel === -1)){
        //Creo el contacto
        var contacto = document.createElement('div');
        contacto.className = 'contactoBloque';
        contacto.id = opcionSeleccionada;
        contacto.innerText = opcionSeleccionada;
        contacto.onclick = function() {
            enseñarChat(contacto.id);
          };
        contactos.appendChild(contacto)
         // Reiniciar el select después de agregar el contacto
        }
  }



  // Función que se llama cuando se selecciona un chat desde el panel de contactos. 
  //Cambia la opción seleccionada en el select de destinatarios y llama a la función iniciarChat().
  function enseñarChat(id){
    //Cambio la opcion del select a la que esta apuntando,para poder ejecutar la funcion iniciarChat();
    destinoSelect.value = id;
    iniciarChat();
  }


