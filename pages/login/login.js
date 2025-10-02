/*document.querySelector("#login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.querySelector("#usuario").value;
  const pass = document.querySelector("#clave").value;

  if (user === "admin" && pass === "admin123") {
    localStorage.setItem("role", "admin");
    window.location.href = "../../index.html";
  } else if (user === "cliente" && pass === "cliente123") {
    localStorage.setItem("role", "cliente");
    window.location.href = "../../index.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});*/

document.addEventListener("DOMContentLoaded", () => {
  // Logica de inicio de sesion
  const formularioInicioSesion = document.querySelector("#form-ingreso"); // Obtenemos el formulario de login

  if (formularioInicioSesion) { // Verificamos que el formulario exista en el DOM
    formularioInicioSesion.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevenimos el envio por defecto del formulario

      const campoEmail = document.querySelector("#email-ingreso"); // Input del email de login
      const campoContrasena = document.querySelector("#contrasena-ingreso"); // Input de la contrasena de login

      const correo = campoEmail.value.trim(); // Obtener y limpiar el email
      const contrasena = campoContrasena.value.trim(); // Obtener y limpiar la contrasena

      // Recuperar la lista de usuarios del localStorage
      // Si no hay usuarios inicializamos un array vacio para evitar errores
      let usuarios = JSON.parse(localStorage.getItem('users')) || [];

      // Buscar el usuario en la lista de 'users'
      // Usamos find() para buscar un usuario cuyo email y contrasena coincidan
      // Convertimos el email a minusculas para que la busqueda sea insensible a mayusculas/minusculas
      const usuarioEncontrado = usuarios.find(usuario =>
        usuario.email.toLowerCase() === correo.toLowerCase() && usuario.password === contrasena
      );

      if (usuarioEncontrado) {
        // Si se encontro un usuario con esas credenciales
        console.log(`Inicio de sesion exitoso para: ${usuarioEncontrado.email}`);

        // Guardar la informacion del usuario logueado en sessionStorage
        // sessionStorage es preferible para sesiones ya que los datos se borran al cerrar el navegador
        sessionStorage.setItem("role", usuarioEncontrado.role); // Guarda el rol (admin o cliente)
        sessionStorage.setItem("userName", usuarioEncontrado.name); // Guarda el nombre del usuario
        sessionStorage.setItem("userEmail", usuarioEncontrado.email); // Guarda el email (puede ser util)

        // Redirigir al usuario segun su rol
        if (usuarioEncontrado.role === "admin") {
          window.location.href = "../../index.html"; // Redirige a la pagina de admin
        } else {
          window.location.href = "../../index.html"; // Redirige a la pagina principal del cliente
        }
      } else {
        // Si no se encontro ningun usuario o las credenciales son incorrectas
        alert("Email o contraseña incorrectos.");
        // limpiar los campos de contrasena aqui
        campoContrasena.value = '';
      }
    });
  }

});