document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos de la barra de navegacion
  const enlaceAdmin = document.querySelector("#admin-link");
  const infoUsuarioNavbar = document.querySelector("#user-role"); // El span para "Bienvenido/a [Nombre]"
  const enlaceAccesoClientes = document.querySelector("#acceso-clientes-link"); // El boton "Acceso Clientes"
  const botonIniciarSesion = document.querySelector("#login-btn"); // El boton "Login"
  const botonCerrarSesion = document.querySelector("#logout-btn"); // El boton "Logout"
  const botonIconoCarrito = document.querySelector("#cart-icon-btn"); // Boton del icono del carrito

  // Funcion para actualizar la interfaz de usuario de la barra de navegacion
  const actualizarInterfazNavbar = () => {
    // Obtener informacion del usuario desde sessionStorage
    const rolUsuario = sessionStorage.getItem('role'); // Obtiene el rol de sessionStorage
    const nombreUsuario = sessionStorage.getItem('userName');

    // Mostrar el nombre del usuario
    if (infoUsuarioNavbar) {
      if (nombreUsuario) {
        infoUsuarioNavbar.textContent = `Bienvenido/a ${nombreUsuario}`;
        infoUsuarioNavbar.style.display = 'inline';
      } else {
        infoUsuarioNavbar.textContent = '';
        infoUsuarioNavbar.style.display = 'none';
      }
    }

    // Gestionar la visibilidad de los botones de login/logout y el enlace de "Acceso Clientes"
    if (botonIniciarSesion && botonCerrarSesion && enlaceAccesoClientes) {
      if (rolUsuario) { // Si hay un rol, significa que hay un usuario logueado
        botonIniciarSesion.classList.add("d-none"); // Oculta "Login"
        enlaceAccesoClientes.classList.add("d-none"); // Oculta "Acceso Clientes"
        botonCerrarSesion.classList.remove("d-none"); // Muestra "Logout"
      } else { // No hay usuario logueado
        botonIniciarSesion.classList.remove("d-none"); // Muestra "Login"
        enlaceAccesoClientes.classList.remove("d-none"); // Muestra "Acceso Clientes"
        botonCerrarSesion.classList.add("d-none"); // Oculta "Logout"
      }
    }

    // Gestionar la visibilidad del enlace de administrador ("Estadisticas")
    if (enlaceAdmin) {
      if (rolUsuario === 'admin') {
        enlaceAdmin.style.display = 'inline'; // Mostrar para administradores
      } else {
        enlaceAdmin.style.display = 'none'; // Ocultar para otros roles o no logueados
      }
    }

    // Gestionar la visibilidad del boton del carrito (si aplica)
    if (botonIconoCarrito) {
      if (rolUsuario) { // Si hay un usuario logueado, muestra el carrito
        botonIconoCarrito.style.display = "inline-block";
        // Llama a la funcion de wishlist.js para actualizar el contador del carrito al cargar la pagina
        if (typeof window.actualizarContadorListaDeseos === 'function') {
          window.actualizarContadorListaDeseos();
        }
      } else { // Si no hay usuario logueado, oculta el carrito
        botonIconoCarrito.style.display = "none";
      }
    }
  };

  // Llama a la funcion al cargar la pagina para establecer el estado inicial de la navbar
  actualizarInterfazNavbar();

  // Logica para abrir/cerrar el sidebar de la wishlist
  const barraLateralListaDeseos = document.querySelector("#wishlist-sidebar");
  const botonCerrarListaDeseos = document.querySelector("#close-wishlist-btn");

  if (botonIconoCarrito && barraLateralListaDeseos && botonCerrarListaDeseos) {
    botonIconoCarrito.addEventListener("click", () => {
      barraLateralListaDeseos.classList.add("open");
      if (typeof window.mostrarBarraLateralListaDeseos === 'function') {
        window.mostrarBarraLateralListaDeseos();
      }
    });

    botonCerrarListaDeseos.addEventListener("click", () => {
      barraLateralListaDeseos.classList.remove("open");
    });
  }
});

// Funcion global para agregar a la wishlist (delegada a wishlist.js)
function agregarWishlist(id) {
  if (typeof window.agregarAListaDeseosYMostrar === 'function') {
    window.agregarAListaDeseosYMostrar(id);
  } else {
    console.error("agregarAListaDeseosYMostrar no esta definida. Asegurate de que wishlist.js se cargue correctamente");
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.includes(id)) {
      wishlist.push(id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("Agregado a tu lista de deseos");
    } else {
      alert("Esta planta ya esta en tu lista de deseos");
    }
  }
}

// Funcion global para cerrar sesion
// Se llama desde el boton "Logout" en el navbar
window.cerrarSesion = function () {
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userEmail');

  // Al cerrar sesion, si el sidebar de la wishlist esta abierto, lo cerramos
  const barraLateralListaDeseos = document.querySelector("#wishlist-sidebar");
  if (barraLateralListaDeseos && barraLateralListaDeseos.classList.contains("open")) {
    barraLateralListaDeseos.classList.remove("open");
  }

  // Redirige al usuario a la pagina de inicio

  // Si se sirve desde la raiz de un dominio o subdominio
  // Esto significa que, sin importar donde estes (pages/plantas/, pages/contacto/, etc),
  // siempre iras a la raiz de tu sitio y de ahi a index.html
  //  window.location.href = '/index.html';

  // Si estas abriendo los archivos directamente en el navegador
  const segmentosDeRuta = window.location.pathname.split('/');
  let rutaHaciaRaiz = '';
  // // Cuenta cuantos niveles hay que subir para llegar a la raiz del proyecto
  // // Suponiendo que 'pages' es una carpeta de primer nivel bajo la raiz del proyecto
  if (segmentosDeRuta.includes('pages')) {
    //     // Si estamos en 'pages/algo/pagina.html', necesitamos '../../'
    //     // Si estamos en 'pages/pagina.html', necesitamos '../'
    //     // Contar cuantas carpetas hay despues de 'pages' en el path
    const pagesIndex = segmentosDeRuta.indexOf('pages');
    for (let i = pagesIndex; i < segmentosDeRuta.length - 1; i++) {
      rutaHaciaRaiz += '../';
    }
  }
  window.location.href = rutaHaciaRaiz + 'index.html';
};