document.addEventListener("DOMContentLoaded", () => {
  const seccionAdmin = document.querySelector("#seccion-admin");
  const sinAcceso = document.querySelector("#sin-acceso");
  const rol = sessionStorage.getItem("role");


  const cuerpoTablaEstadisticas = document.querySelector("#cuerpo-tabla-estadisticas"); // El tbody de la tabla
  const mensajeSinEstadisticas = document.querySelector("#mensaje-sin-estadisticas"); // Mensaje si no hay estadisticas


  if (rol === "admin") {
    seccionAdmin.style.display = "block";
    sinAcceso.style.display = "none";

    mostrarEstadisticasListaDeseos(cuerpoTablaEstadisticas, mensajeSinEstadisticas);

  } else {
    seccionAdmin.style.display = "none";
    sinAcceso.style.display = "block";
  }
});


// Mostrar las estadisticas de la wishlist
function mostrarEstadisticasListaDeseos(elementoCuerpoTabla, elementoMensajeSinEstadisticas) {
  const conteoPlantas = JSON.parse(localStorage.getItem('plantWishlistCounts')) || {};
  const plantas = JSON.parse(localStorage.getItem('plantas')) || []; // Necesitamos los nombres de las plantas

  // Limpiar el contenido actual
  if (elementoCuerpoTabla) {
    elementoCuerpoTabla.innerHTML = '';
  }

  let tieneEstadisticas = false;
  for (const idPlanta in conteoPlantas) {
    const conteo = conteoPlantas[idPlanta];
    const planta = plantas.find(p => p.id === parseInt(idPlanta)); // Buscar la planta por ID

    if (planta && conteo > 0) { // Asegurarse de que la planta exista y el conteo sea positivo
      tieneEstadisticas = true;
      if (elementoCuerpoTabla) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
                        <td>${planta.nombre}</td>
                        <td>${planta.nombreCientifico || 'N/A'}</td>
                        <td>${conteo}</td>
                    `;
        elementoCuerpoTabla.appendChild(fila);
      }
    }
  }

  // Mostrar mensaje si no hay estadisticas
  if (elementoMensajeSinEstadisticas) {
    if (tieneEstadisticas) {
      elementoMensajeSinEstadisticas.style.display = 'none';
    } else {
      elementoMensajeSinEstadisticas.style.display = 'block';
      if (elementoCuerpoTabla) { // Si hay tabla, ocultarla tambien si no hay datos
        elementoCuerpoTabla.parentElement.style.display = 'none'; // Oculta la tabla si esta vacia
      }
    }
  }
}