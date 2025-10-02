// funcion para mostrar la lista de deseos en la pagina de wishlist.html
function mostrarListaDeseos() {
  const listaDeseos = JSON.parse(localStorage.getItem("wishlist")) || [];
  const contenedor = document.querySelector("#lista-deseos");
  const elementoTotal = document.querySelector("#total");
  let total = 0;

  // Cargar las plantas desde localStorage cada vez que se muestra la wishlist
  const plantas = JSON.parse(localStorage.getItem('plantas')) || [];

  if (!contenedor) return; // Salir si no estamos en la pagina de wishlist.html

  contenedor.innerHTML = ""; // Limpia el contenedor antes de mostrar todo

  if (listaDeseos.length === 0) {
    contenedor.innerHTML = "<p>no hay plantas en tu lista de deseos</p>";
  } else {
    listaDeseos.forEach(id => {
      const planta = plantas.find(p => p.id === id);
      if (planta) {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
          <div class="card mb-3">
            <img src="${planta.imagen}" class="card-img-top" alt="${planta.nombre}">
            <div class="card-body">
              <h5>${planta.nombre}</h5>
              <p>precio: $${planta.precio}</p>
              <button class="btn btn-danger btn-sm" onclick="eliminarDeListaDeseos(${planta.id})">eliminar</button>
            </div>
          </div>
        `;
        contenedor.appendChild(col);
        total += planta.precio;
      }
    });
  }

  // Actualiza el total en la pagina (si el elemento con id="total" existe en wishlist.html)
  if (elementoTotal) {
    elementoTotal.textContent = total;
  }
}

// Funcion para guardar los contadores de la wishlist
function guardarConteoDeseosPlanta(conteo) {
  localStorage.setItem('plantWishlistCounts', JSON.stringify(conteo));
}

// Funcion para obtener los contadores de la wishlist
function obtenerConteoDeseosPlanta() {
  const conteo = JSON.parse(localStorage.getItem('plantWishlistCounts')) || {};
  return conteo;
}

// funcion para agregar una planta a la wishlist y actualiza el contador y el sidebar del carrito
function agregarAListaDeseosYMostrar(id) {
  let listaDeseos = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Permite agregar el ID de la planta que se paso como argumento
  listaDeseos.push(id);

  localStorage.setItem("wishlist", JSON.stringify(listaDeseos)); // Guarda la lista modificada en localStorage

  // LOGICA para registrar el conteo de veces que se anade una planta
  let conteoPlantas = obtenerConteoDeseosPlanta(); // Esto obtendra los conteos existentes

  conteoPlantas[id] = (conteoPlantas[id] || 0) + 1; // Esto incrementara para el ID de planta especifico

  guardarConteoDeseosPlanta(conteoPlantas); // Esto deberia guardar los conteos actualizados en localStorage

  alert("Agregado a tu lista de deseos");

  actualizarContadorListaDeseos();
  mostrarBarraLateralListaDeseos();
}

// funcion para quitar una instancia de una planta de la wishlist
function eliminarDeListaDeseos(id) {
  // Obtener la wishlist desde localStorage
  let listaDeseos = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Encontrar el indice de la primera aparicion del ID en la lista
  const indiceAEliminar = listaDeseos.indexOf(id);

  if (indiceAEliminar !== -1) { // Si se encontro el ID en la lista
    listaDeseos.splice(indiceAEliminar, 1); // Eliminar solo un elemento en ese indice
    localStorage.setItem("wishlist", JSON.stringify(listaDeseos)); // Guardar la lista modificada
    alert("Una planta ha sido eliminada de tu lista de deseos"); // Mensaje actualizado
  } else {
    // Si el ID no se encontro
    console.warn(`Se intento eliminar planta con ID ${id} no encontrada en la wishlist`);
  }

  // si estamos en la pagina de wishlist, la volvemos a mostrar
  if (document.querySelector("#lista-deseos")) {
    mostrarListaDeseos(); // Llama a mostrarListaDeseos que ahora carga las plantas de localStorage
  }
  actualizarContadorListaDeseos(); // Actualiza el numero del carrito
  mostrarBarraLateralListaDeseos(); // Actualiza el contenido del sidebar
}

// funcion para actualizar el contador del carrito en el navbar
function actualizarContadorListaDeseos() {
  const listaDeseos = JSON.parse(localStorage.getItem("wishlist")) || [];

  const elementoContadorCarrito = document.querySelector("#wishlist-count");
  if (elementoContadorCarrito) {
    elementoContadorCarrito.textContent = listaDeseos.length;
    // Muestra u oculta el circulo del contador
    if (listaDeseos.length > 0) {
      elementoContadorCarrito.classList.remove('d-none');
    } else {
      elementoContadorCarrito.classList.add('d-none');
    }
  }
}

// funcion para mostrar las plantas dentro del sidebar del carrito
function mostrarBarraLateralListaDeseos() {
  const listaDeseos = JSON.parse(localStorage.getItem("wishlist")) || [];

  const contenidoBarraLateral = document.querySelector("#sidebar-wishlist-items");
  const totalBarraLateral = document.querySelector("#sidebar-wishlist-total");
  let totalActual = 0;

  // Cargar las plantas desde localStorage
  const plantas = JSON.parse(localStorage.getItem('plantas')) || [];

  if (!contenidoBarraLateral) return; // Si no hay sidebar, salimos

  contenidoBarraLateral.innerHTML = ""; // Limpia el contenido

  if (listaDeseos.length === 0) {
    contenidoBarraLateral.innerHTML = "<p class='p-3 text-center' id='empty-wishlist-msg'>Tu lista de deseos esta vacia</p>";
  } else {
    listaDeseos.forEach(id => {
      // Usar la variable 'plantas' que acabamos de cargar
      const planta = plantas.find(p => p.id === id);
      if (planta) {
        const elementoItem = document.createElement("div");
        elementoItem.className = "d-flex align-items-center mb-2 border-bottom pb-2 sidebar-item"; // Anadir 'sidebar-item' para los estilos
        elementoItem.innerHTML = `
          <img src="${planta.imagen}" alt="${planta.nombre}" class="me-2 rounded" style="width: 50px; height: 50px; object-fit: cover;">
          <div>
            <h6 class="mb-0">${planta.nombre}</h6>
            <small>precio: $${planta.precio}</small>
          </div>
          <button class="btn btn-sm btn-outline-danger ms-auto" onclick="eliminarDeListaDeseos(${planta.id})">x</button>
        `;
        contenidoBarraLateral.appendChild(elementoItem);
        totalActual += planta.precio;
      }
    });
  }

  // Actualiza el total
  if (totalBarraLateral) {
    totalBarraLateral.textContent = totalActual;
  }
}

// al cargar la pagina, muestra la wishlist principal si estamos en esa pagina y siempre actualiza el contador del carrito
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#lista-deseos")) { // si estamos en la pagina de wishlist.html
    mostrarListaDeseos();
  }
  actualizarContadorListaDeseos(); // siempre actualiza el contador al cargar cualquier pagina

  // Si la pagina tiene el sidebar, tambien lo mostramos al cargar
  if (document.querySelector("#wishlist-sidebar")) {
    mostrarBarraLateralListaDeseos();
  }
});

// Hacemos estas funciones globales para que se puedan llamar desde otros archivos
window.mostrarListaDeseos = mostrarListaDeseos;
window.agregarAListaDeseosYMostrar = agregarAListaDeseosYMostrar;
window.actualizarContadorListaDeseos = actualizarContadorListaDeseos;
window.mostrarBarraLateralListaDeseos = mostrarBarraLateralListaDeseos;
window.eliminarDeListaDeseos = eliminarDeListaDeseos;