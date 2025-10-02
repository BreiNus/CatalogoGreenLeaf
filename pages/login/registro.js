document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos del formulario de registro
    const formularioRegistro = document.querySelector("#form-registro"); // ID del formulario de registro
    const campoNombre = document.querySelector("#nombre"); // Input para el nombre
    const campoApellido = document.querySelector("#apellido"); // Input para el apellido
    const campoEmailRegistro = document.querySelector("#email"); // Input para el email
    const campoContrasena1 = document.querySelector("#contrasena1"); // Input para la contrasena
    const campoContrasena2 = document.querySelector("#contrasena2"); // Input para repetir la contrasena
    const mensajeRegistro = document.querySelector("#mensaje-registro"); // Div para mostrar mensajes

    // Cargar usuarios existentes de localStorage o inicializar con un administrador por defecto
    let usuarios = JSON.parse(localStorage.getItem('users')) || [];

    // Si no hay usuarios guardados agregamos un administrador por defecto
    // El email del administrador tambien sera su identificador unico
    if (!usuarios.some(usuario => usuario.email === 'admin@greenleaf.com' && usuario.role === 'admin')) {
        usuarios.push({
            name: 'Administrador',
            lastname: 'GreenLeaf',
            email: 'admin@greenleaf.com', // Email del admin (debe ser unico)
            password: 'admin', // se tendria que hashear la pass para mas seguridad
            role: 'admin'
        });
        localStorage.setItem('users', JSON.stringify(usuarios));
    }

    // Logica para el envio del formulario de registro
    if (formularioRegistro) { // Nos aseguramos de que el formulario exista en la pagina
        formularioRegistro.addEventListener("submit", (event) => {
            event.preventDefault(); // Previene el envio por defecto del formulario

            // Obtener y limpiar los valores de los campos
            const nombre = campoNombre.value.trim();
            const apellido = campoApellido.value.trim();
            const email = campoEmailRegistro.value.trim();
            const contrasena1 = campoContrasena1.value.trim();
            const contrasena2 = campoContrasena2.value.trim();

            // Limpiar mensajes anteriores en el div de mensajes
            mensajeRegistro.textContent = '';
            mensajeRegistro.className = '';

            // Validacion de los datos
            // Verificar que todos los campos obligatorios esten llenos
            if (!nombre || !apellido || !email || !contrasena1 || !contrasena2) {
                mensajeRegistro.textContent = 'Todos los campos son obligatorios';
                mensajeRegistro.className = 'alert alert-danger mt-3';
                return;
            }

            // Validar la longitud de la contrasena
            if (contrasena1.length < 6) {
                mensajeRegistro.textContent = 'La contrasena debe tener al menos 6 caracteres';
                mensajeRegistro.className = 'alert alert-danger mt-3';
                return;
            }

            // Validar que las dos contrasenas coincidan
            if (contrasena1 !== contrasena2) {
                mensajeRegistro.textContent = 'Las contrasenas no coinciden';
                mensajeRegistro.className = 'alert alert-danger mt-3';
                return;
            }

            // Validar formato basico de email
            if (!email.includes('@') || !email.includes('.')) {
                mensajeRegistro.textContent = 'Por favor introduce un correo electronico valido';
                mensajeRegistro.className = 'alert alert-danger mt-3';
                return;
            }

            // Verificar si el email ya existe
            const existeEmail = usuarios.some(usuario =>
                usuario.email.toLowerCase() === email.toLowerCase()
            );

            if (existeEmail) {
                mensajeRegistro.textContent = 'Este correo electronico ya esta registrado Por favor usa otro';
                mensajeRegistro.className = 'alert alert-danger mt-3';
                return;
            }

            // Crear el nuevo objeto de usuario (con rol 'cliente' por defecto)
            const nuevoUsuario = {
                name: nombre,
                lastname: apellido,
                email: email, // El email sera el identificador unico del usuario
                password: contrasena1,
                role: 'cliente' // Rol por defecto para nuevos registros
            };

            // Guardar el nuevo usuario en el array y luego en localStorage
            usuarios.push(nuevoUsuario);
            localStorage.setItem('users', JSON.stringify(usuarios));

            // Mostrar mensaje de exito y limpiar el formulario
            mensajeRegistro.textContent = 'Registro exitoso Ya puedes iniciar sesion';
            mensajeRegistro.className = 'alert alert-success mt-3';
            formularioRegistro.reset();

            // Descomentar para redirigir al usuario despues de unos segundos
            // setTimeout(() => {
            //     window.location.href = 'login.html';
            // }, 2000);
        });
    }
});