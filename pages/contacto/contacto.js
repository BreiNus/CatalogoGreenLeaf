document.addEventListener("DOMContentLoaded", function () {
  const formularioContacto = document.getElementById("formulario-contacto");

  // --- Formulario de Contacto y WhatsApp ---
  if (formularioContacto) {
    formularioContacto.addEventListener("submit", function (evento) {
      evento.preventDefault(); // Evita el envio normal del formulario

      // Obtener los valores de los campos
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const email = document.getElementById("email").value;
      const mensaje = document.getElementById("mensaje").value;

      // Numero de WhatsApp
      const numeroCelular = "3416641957";

      // Mensaje pre-hecho para WhatsApp
      const mensajeFijo = `¡Hola Green Leaf! 👋*Consulta de contacto:* Nombre: ${nombre} Apellido: ${apellido} Email: ${email} Mensaje: ${mensaje}`;

      // Codificar el mensaje para la URL
      const mensajeCodificado = encodeURIComponent(decodeURIComponent(mensajeFijo));
      // encodeURIComponent se usa para escapar caracteres especiales para la URL
      // decodeURIComponent se usa primero para asegurar que el string esta interpretado correctamente antes de codificarlo
      // Esto es util si ya tienes caracteres especiales en el mensaje predefinido o en los datos de entrada

      // Crear el enlace de WhatsApp
      const enlaceWhatsapp = `https://wa.me/${numeroCelular}?text=${mensajeCodificado}`;
      // Redireccionar al enlace de WhatsApp
      window.open(enlaceWhatsapp, "_blank"); // Abre en una nueva pestaña

      // Opcional: limpiar el formulario despues del envio
      formularioContacto.reset();
    });
  }
});