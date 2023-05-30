
var enviarBoton = document.getElementById('enviar');
enviarBoton.addEventListener('click',function() {
    enviarMensaje();
});

var mensajeTextarea = document.querySelector('.mensajeTexto textarea');
mensajeTextarea.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      enviarMensaje();
    }
  });


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
                spanMensaje.textContent = mensaje.text;
    
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