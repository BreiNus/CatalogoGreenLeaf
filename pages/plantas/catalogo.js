// A partir de ahora la variable 'plantas' solo se usara como un valor inicial
// La fuente de la verdad sera siempre el localStorage
const plantasIniciales = [
  {
    id: 1,
    nombre: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    imagen: "../../assets/images-catalogo/Lavanda.jpg",
    categoria: "aromatica",
    necesidades: "Sol directo, riego moderado",
    dificultad: "facil",
    precio: 1200,
    descripcion: "Hermosa planta aromatica con flores purpuras, ideal para relajacion"
  },
  {
    id: 2,
    nombre: "Helecho",
    nombreCientifico: "Nephrolepis exaltata",
    imagen: "../../assets/images-catalogo/Helecho.jpg",
    categoria: "interior",
    necesidades: "Sombra parcial, alta humedad, riego frecuente",
    dificultad: "media",
    precio: 1500,
    descripcion: "Popular planta de interior conocida por sus frondosas hojas verdes"
  },
  {
    id: 3,
    nombre: "Cactus Bola de Oro",
    nombreCientifico: "Echinocactus grusonii",
    imagen: "../../assets/images-catalogo/cactus-bola-oro.jpg",
    categoria: "exterior",
    necesidades: "Mucho sol, poco riego, suelo bien drenado",
    dificultad: "facil",
    precio: 1000,
    descripcion: "Cactus esferico con espinas amarillas, muy resistente y decorativo"
  },
  {
    id: 4,
    nombre: "Menta",
    nombreCientifico: "Mentha spicata",
    imagen: "../../assets/images-catalogo/Menta.jpg",
    categoria: "aromatica",
    necesidades: "Sol parcial, riego regular, crece rapidamente",
    dificultad: "media",
    precio: 800,
    descripcion: "Hierba aromatica versatil, ideal para infusiones y cocina"
  },
  {
    id: 5,
    nombre: "Limonero",
    nombreCientifico: "Citrus limon",
    imagen: "../../assets/images-catalogo/Limonero.jpg",
    categoria: "frutal",
    necesidades: "Mucho sol, riego constante, proteger del frio",
    dificultad: "dificil",
    precio: 2300,
    descripcion: "Arbol pequeno que produce deliciosos limones, requiere cuidados especificos"
  }
];

// Si no hay plantas guardadas, se inicializan con la lista temporal y se guardan
if (!localStorage.getItem('plantas')) {
  localStorage.setItem('plantas', JSON.stringify(plantasIniciales));
}

// Funcion para guardar las plantas en localStorage
function guardarPlantas(pantasAGuardar) {
  localStorage.setItem('plantas', JSON.stringify(pantasAGuardar));
}

// --- Funciones para la gestion de plantas (CRUD) ---

// Referencias del DOM para que esten disponibles en todo el archivo
const formularioModalPlantas = new bootstrap.Modal(document.getElementById('formularioModalPlantas'));
const formularioPlanta = document.querySelector("#formulario-planta");
const plantaFormModalLabel = document.querySelector("#plantaFormModalLabel");

const inputPlantaId = document.querySelector("#planta-id");
const nombreComunInput = document.querySelector("#nombre-comun");
const nombreCientificoInput = document.querySelector("#nombre-cientifico");
const imagenUrlInput = document.querySelector("#imagen-url");
const imagenPreview = document.querySelector("#imagen-preview");
const categoriaInput = document.querySelector("#categoria");
const necesidadesInput = document.querySelector("#necesidades");
const dificultadInput = document.querySelector("#dificultad");
const precioInput = document.querySelector("#precio");
const descripcionInput = document.querySelector("#descripcion");

// Referencias al modal de eliminacion
const modalConfirmacionBorrar = new bootstrap.Modal(document.getElementById('modalConfirmacionBorrar'));
const nombrePlantaBorrar = document.querySelector("#nombre-planta-a-borrar");
const botonConfirmarBorrar = document.querySelector("#btn-confirmar-borrar");
let plantaIdBorrar = null; // Variable para almacenar el ID de la planta a eliminar


// funcion para mostrar las plantas en la pagina
// La lista de plantas se carga desde localStorage cada vez que se llama
function mostrarPlantas() {
  const contenedor = document.querySelector("#plantas-container");
  if (!contenedor) return; // si no hay contenedor no hacemos nada

  contenedor.innerHTML = ""; // limpia lo que haya antes

  const plantas = JSON.parse(localStorage.getItem('plantas')) || []; // lee el local storage

  // agarra los valores de los filtros y el buscador
  const filtroCategoria = document.querySelector("#filtro-categoria")?.value || "todos";
  const filtroDificultad = document.querySelector("#filtro-dificultad")?.value || "todas";
  const buscarValorInput = document.querySelector("#buscar")?.value.toLowerCase() || "";
  // Obtener valores de precio, asegurando que sean numeros y manejando campos vacios

  const precioMinInput = parseFloat(document.querySelector("#filtro-precio-min")?.value);
  const precioMaxInput = parseFloat(document.querySelector("#filtro-precio-max")?.value);

  // Si el input esta vacio o no es un numero valido, se considera un rango ilimitado
  const precioMin = isNaN(precioMinInput) ? 0 : precioMinInput;
  const precioMax = isNaN(precioMaxInput) ? Infinity : precioMaxInput;

  // ve si el usuario es admin o cliente
  const role = sessionStorage.getItem("role"); // obtiene el rol del usuario
  const isAdmin = role === "admin";
  const isCliente = role === "cliente";
  const mostrarBotonWishlist = isAdmin || isCliente;

  // filtra las plantas segun lo que elegiste
  let plantasFiltradas = plantas.filter(planta => {
    const coincideCategoria = filtroCategoria === "todos" || planta.categoria === filtroCategoria;
    const coincideDificultad = filtroDificultad === "todas" || planta.dificultad === filtroDificultad;
    const coincidePrecio = planta.precio >= precioMin && planta.precio <= precioMax;
    const coincideBusqueda = planta.nombre.toLowerCase().includes(buscarValorInput) ||
      (planta.nombreCientifico && planta.nombreCientifico.toLowerCase().includes(buscarValorInput)) ||
      (planta.descripcion && planta.descripcion.toLowerCase().includes(buscarValorInput));

    return coincideCategoria && coincideDificultad && coincidePrecio && coincideBusqueda;
  });

  // si no encuentra nada, avisa
  if (plantasFiltradas.length === 0) {
    // Elimina el mensaje anterior y anade el nuevo si el contenedor esta vacio
    contenedor.innerHTML = `
        <div class="col-12 text-center mt-5">
          <p id="no-plantas-mensaje">No se encontraron plantas con los filtros aplicados</p>
        </div>
      `;
    return;
  }

  // crea las tarjetas para cada planta
  plantasFiltradas.forEach(planta => {
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3 mb-4"; // Columnas responsivas
    card.innerHTML = `
   <div class="card h-100 shadow-sm">
    <img src="${planta.imagen}" class="card-img-top" alt="${planta.nombre}">
    <div class="card-body d-flex flex-column">
     <h5 class="card-title">${planta.nombre}</h5>
     <p class="card-text text-muted"><em>${planta.nombreCientifico || ''}</em></p>
     <p class="card-text">${planta.descripcion || 'Sin descripcion'}</p>
     <ul class="list-unstyled mb-2 small">
      <li><strong>Categoria:</strong> ${planta.categoria}</li>
      <li><strong>Dificultad:</strong> ${planta.dificultad}</li>
      <li><strong>Precio:</strong> $${planta.precio}</li>
      <li><strong>Necesidades:</strong> ${planta.necesidades || 'No especificado'}</li>
     </ul>
     <div class="mt-auto d-flex justify-content-between align-items-center">
        ${mostrarBotonWishlist ? `
        <button class="btn btn-outline-success btn-sm agregar-wishlist" data-id="${planta.id}">
         <i class="fas fa-heart"></i> Favoritos
        </button>
        ` : ''}
      ${role === 'admin' ? `
       <button class="btn btn-warning btn-sm editar-planta" data-id="${planta.id}" data-bs-toggle="modal" data-bs-target="#formularioModalPlantas">
        <i class="fas fa-edit"></i> Editar
       </button>
       <button class="btn btn-danger btn-sm eliminar-planta" data-id="${planta.id}" data-bs-toggle="modal" data-bs-target="#modalConfirmacionBorrar">
        <i class="fas fa-trash-alt"></i> Eliminar
       </button>
      ` : ''}
     </div>
    </div>
   </div>
  `;
    contenedor.appendChild(card);
  });

  // Los event listeners para agregar-wishlist solo deben anadirse si los botones existen
  if (mostrarBotonWishlist) {
    document.querySelectorAll(".agregar-wishlist").forEach(button => {
      button.addEventListener("click", (event) => {
        const id = parseInt(event.currentTarget.dataset.id);
        agregarAListaDeseosYMostrar(id);
      });
    });
  }

  // Anadir eventos a los botones de "Editar Planta"
  if (role === 'admin') {
    document.querySelectorAll(".editar-planta").forEach(button => {
      button.addEventListener("click", (event) => {
        const id = parseInt(event.currentTarget.dataset.id);
        cargarFormularioEdicion(id);
      });
    });

    // Anadir eventos a los botones de "Eliminar Planta"
    document.querySelectorAll(".eliminar-planta").forEach(button => {
      button.addEventListener("click", (event) => {
        const id = parseInt(event.currentTarget.dataset.id);
        mostrarConfirmacionEliminar(id);
      });
    });
  }
}


// Funcion para mostrar el formulario para agregar una nueva planta
function abrirFormularioAgregar() {
  formularioPlanta.reset(); // Limpia el formulario
  inputPlantaId.value = ""; // Asegura que el ID este vacio para una nueva planta
  plantaFormModalLabel.textContent = "Agregar Nueva Planta"; // Cambia el titulo del modal
  formularioModalPlantas.show(); // Muestra el modal
  imagenPreview.src = '#'; // Limpia la vista previa
  imagenPreview.style.display = 'none'; // Oculta la vista previa
}

// Funcion para cargar los datos de una planta en el formulario para edicion
function cargarFormularioEdicion(id) {
  const plantas = JSON.parse(localStorage.getItem('plantas')) || []; // <-- SE LEE EL LOCALSTORAGE AQUI
  const planta = plantas.find(p => p.id === id);
  if (planta) {
    inputPlantaId.value = planta.id;
    nombreComunInput.value = planta.nombre;
    nombreCientificoInput.value = planta.nombreCientifico || '';
    // Limpiamos el input y mostramos la imagen existente en la vista previa
    imagenUrlInput.value = '';
    if (planta.imagen) {
      imagenPreview.src = planta.imagen; // Mostrar la imagen actual (URL o Base64)
      imagenPreview.style.display = 'block';
    } else {
      imagenPreview.src = '#';
      imagenPreview.style.display = 'none';
    }
    categoriaInput.value = planta.categoria;
    necesidadesInput.value = planta.necesidades || '';
    dificultadInput.value = planta.dificultad;
    precioInput.value = planta.precio;
    descripcionInput.value = planta.descripcion || '';

    plantaFormModalLabel.textContent = `Editar Planta: ${planta.nombre}`;
    formularioModalPlantas.show();
  }
}

// Funcion para manejar el envio del formulario (agregar o editar)
formularioPlanta.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita el envio por defecto del formulario

  // Cargar la lista de plantas mas reciente del localStorage
  let plantas = JSON.parse(localStorage.getItem('plantas')) || [];

  const file = imagenUrlInput.files[0]; // Obtiene el archivo seleccionado
  const id = inputPlantaId.value ? parseInt(inputPlantaId.value) : null;

  const precioValue = parseInt(precioInput.value);
  if (isNaN(precioValue) || precioValue < 0) {
    alert("Por favor, ingresa un precio valido (numero entero positivo)");
    return; // Detiene el envio si el precio no es valido
  }

  // Funcion auxiliar para guardar la planta, que sera llamada despues de procesar la imagen
  const savePlant = (imageData) => {
    const nuevaPlanta = {
      nombre: nombreComunInput.value,
      nombreCientifico: nombreCientificoInput.value,
      imagen: imageData, // Aqui se guarda la Base64 o la URL existente
      categoria: categoriaInput.value,
      necesidades: necesidadesInput.value,
      dificultad: dificultadInput.value,
      precio: precioValue,
      descripcion: descripcionInput.value
    };

    if (id) {
      // Editar planta existente
      const index = plantas.findIndex(p => p.id === id);
      if (index !== -1) {
        plantas[index] = { ...plantas[index], ...nuevaPlanta, id: id };
        //alert("Planta editada con exito");
      }
    } else {
      // Agregar nueva planta
      const newId = plantas.length > 0 ? Math.max(...plantas.map(p => p.id)) + 1 : 1;
      plantas.push({ id: newId, ...nuevaPlanta });
      alert("Planta agregada con exito");
    }

    guardarPlantas(plantas); // Guarda los cambios en localStorage
    mostrarPlantas(); // Vuelve a mostrar el catalogo
    formularioModalPlantas.hide(); // Cierra el modal
    imagenPreview.src = '#'; // Limpia la vista previa
    imagenPreview.style.display = 'none'; // Oculta la vista previa
  };

  if (file) {
    // Si se selecciono un nuevo archivo, lo leemos como Base64
    const reader = new FileReader();
    reader.onload = (e) => savePlant(e.target.result); // Cuando la lectura termina, guarda la planta
    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      alert("Error al cargar la imagen Intentalo de nuevo");
    };
    reader.readAsDataURL(file); // Inicia la lectura del archivo
  } else {
    // Si no se selecciono un nuevo archivo:
    let existingImageData = '';
    if (id) {
      // Si estamos editando, usamos la imagen existente de la planta
      const existingPlanta = plantas.find(p => p.id === id);
      if (existingPlanta) {
        existingImageData = existingPlanta.imagen;
      }
    }
    // Si es una nueva planta sin imagen o se edita sin cambiar, imageData sera vacio o la existente
    savePlant(existingImageData);
  }
});


// Funcion para mostrar el modal de confirmacion de eliminacion
function mostrarConfirmacionEliminar(id) {
  const plantas = JSON.parse(localStorage.getItem('plantas')) || []; // <-- SE LEE EL LOCALSTORAGE
  const planta = plantas.find(p => p.id === id);
  if (planta) {
    plantaIdBorrar = id; // Guarda el ID de la planta a eliminar
    nombrePlantaBorrar.textContent = planta.nombre; // Muestra el nombre en el modal
    modalConfirmacionBorrar.show(); // Muestra el modal de confirmacion
  }
}

// Evento para confirmar la eliminacion
botonConfirmarBorrar.addEventListener("click", () => {
  if (plantaIdBorrar !== null) {
    let plantas = JSON.parse(localStorage.getItem('plantas')) || []; // lee el local storage
    plantas = plantas.filter(planta => planta.id !== plantaIdBorrar);
    guardarPlantas(plantas); // Guarda los cambios
    mostrarPlantas(); // Vuelve a mostrar el catalogo
    modalConfirmacionBorrar.hide(); // Cierra el modal
    //alert("Planta eliminada con exito");
    plantaIdBorrar = null; // Reinicia la variable
  }
});

// --- Logica de inicializacion (DOMContentLoaded) ---
document.addEventListener("DOMContentLoaded", () => {
  mostrarPlantas(); // muestra las plantas al principio

  // Listener para mostrar la vista previa de la imagen seleccionada
  imagenUrlInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader(); // Objeto para leer el contenido del archivo
      reader.onload = function (e) {
        imagenPreview.src = e.target.result; // Establece el src de la imagen a la URL
        imagenPreview.style.display = 'block'; // Muestra la imagen de vista previa
      };
      reader.readAsDataURL(this.files[0]); // Lee el archivo como una URL de datos (Base64)
    } else {
      imagenPreview.src = '#'; // Limpia la vista previa si no hay archivo
      imagenPreview.style.display = 'none'; // Oculta la vista previa
    }
  });

  const filtroCategoria = document.querySelector("#filtro-categoria");
  if (filtroCategoria) filtroCategoria.addEventListener("change", mostrarPlantas);

  const filtroDificultad = document.querySelector("#filtro-dificultad");
  if (filtroDificultad) filtroDificultad.addEventListener("change", mostrarPlantas);

  const filtroPrecioMin = document.querySelector("#filtro-precio-min");
  if (filtroPrecioMin) filtroPrecioMin.addEventListener("input", mostrarPlantas);
  const filtroPrecioMax = document.querySelector("#filtro-precio-max");
  if (filtroPrecioMax) filtroPrecioMax.addEventListener("input", mostrarPlantas);

  const searchInput = document.querySelector("#buscar");
  if (searchInput) searchInput.addEventListener("input", mostrarPlantas);

  // Control de visibilidad del boton "Agregar Planta" y su evento
  const addPlantBtn = document.querySelector("#add-plant-btn");
  const role = sessionStorage.getItem("role"); // obtiene el rol del usuario

  if (addPlantBtn) {
    if (role === "admin") {
      addPlantBtn.style.display = "inline-block";
      addPlantBtn.addEventListener("click", abrirFormularioAgregar);
    } else {
      addPlantBtn.style.display = "none";
    }
  }

  // Evento para mostrar y ocultar el sidebar de la wishlist
  const wishlistSidebar = document.querySelector("#wishlist-sidebar");
  const openWishlistBtn = document.querySelector("#cart-icon-btn");
  const closeWishlistBtn = document.querySelector("#close-wishlist-btn");

  if (openWishlistBtn) {
    openWishlistBtn.addEventListener("click", () => {
      if (wishlistSidebar) {
        wishlistSidebar.classList.add("open");
        mostrarBarraLateralListaDeseos();
      }
    });
  }

  if (closeWishlistBtn) {
    closeWishlistBtn.addEventListener("click", () => {
      if (wishlistSidebar) {
        wishlistSidebar.classList.remove("open");
      }
    });
  }
});

// hacemos mostrarPlantas global para que pueda ser llamada desde main.js si es necesario
window.mostrarPlantas = mostrarPlantas;