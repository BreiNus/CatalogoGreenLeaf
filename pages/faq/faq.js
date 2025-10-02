// Lista de preguntas frecuentes
const datosFaq = [
  {
    pregunta: "¿Cuándo debo regar mi planta?",
    respuesta: "La frecuencia de riego depende del tipo de planta, el tamaño de la maceta y las condiciones ambientales. Generalmente, es mejor revisar la humedad del suelo antes de regar. Si los primeros centímetros de tierra están secos, es probable que necesite agua."
  },
  {
    pregunta: "¿Puedo tener plantas en interiores con poca luz?",
    respuesta: "Sí, hay muchas plantas de interior que prosperan en condiciones de poca luz, como la Sansevieria (lengua de suegra), Zamioculcas (planta ZZ), o el Pothos. Asegúrate de elegir la planta adecuada para el nivel de luz disponible."
  },
  {
    pregunta: "¿Qué plantas son aptas para mascotas?",
    respuesta: "Es crucial investigar si una planta es tóxica para mascotas. Algunas plantas seguras incluyen la Palma Areca, la Planta Araña, el Helecho de Boston, y la Violeta Africana. Consulta siempre una fuente confiable antes de llevar una planta a casa con mascotas."
  },
  {
    pregunta: "¿Cómo trasplanto una planta sin dañarla?",
    respuesta: "Para trasplantar, elige una maceta ligeramente más grande. Riega la planta un día antes. Saca la planta con cuidado, afloja suavemente las raíces si están muy compactas, coloca tierra nueva en el fondo de la maceta, pon la planta y rellena con más tierra, sin cubrir el tallo."
  },
  {
    pregunta: "¿Qué tipo de maceta debo usar?",
    respuesta: "La elección de la maceta depende de la planta y tus preferencias. Las macetas de terracota son porosas y ayudan a evitar el exceso de riego, mientras que las de plástico retienen más la humedad. Asegúrate siempre de que tenga agujeros de drenaje."
  },
  {
    pregunta: "¿Cómo elimino plagas de forma natural?",
    respuesta: "Para plagas comunes como pulgones o araña roja, puedes usar jabón potásico diluido en agua o aceite de neem. Rocía la planta, asegurándote de cubrir el envés de las hojas. Repite cada pocos días si es necesario."
  },
  {
    pregunta: "¿Cómo cuido mi planta?",
    respuesta: "Depende del tipo. Revisá la ficha en el catálogo para ver las necesidades específicas de cada especie (luz, riego, temperatura, etc.)."
  },
  {
    pregunta: "¿Dónde están ubicados?",
    respuesta: "Green Leaf se encuentra en Rosario, Santa Fe. No tenemos un local físico abierto al público, pero realizamos envíos a domicilio dentro de la ciudad. Puedes contactarnos para coordinar tu pedido."
  },
  {
    pregunta: "¿Hacen envíos a otras provincias?",
    respuesta: "Por el momento, nuestros envíos están limitados a la ciudad de Rosario y zonas cercanas. Estamos trabajando para expandir nuestras zonas de entrega en el futuro."
  },
  {
    pregunta: "¿Aceptan todos los medios de pago?",
    respuesta: "Sí, aceptamos diversos medios de pago, incluyendo tarjetas de crédito, débito, y transferencias bancarias. También puedes pagar en efectivo al momento de la entrega en Rosario."
  }
];

// Elementos del DOM
const busquedaFaq = document.getElementById("busqueda-faq");
const contenedorAcordionFaq = document.getElementById("faq-acordion-contenedor");
const mensajeNoResultados = document.getElementById("mensaje-no-resultados");

/**
 Normaliza una cadena de texto eliminando tildes y caracteres especiales y convirtiendola a minusculas
@param {string} texto - El texto a normalizar
@returns {string} El texto normalizado
 */
function normalizarTexto(texto) {
  return texto.toLowerCase()
    .normalize("NFD") // Descompone caracteres con acentos en su forma base + acento
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/[^\w\s]/g, ""); // Elimina caracteres no alfanumericos (excepto espacios)
}

/* Renderiza las preguntas frecuentes filtradas por el termino de busqueda */
function renderizarFaq() {
  const textoBusquedaOriginal = busquedaFaq.value.trim();
  const textoBusquedaNormalizado = normalizarTexto(textoBusquedaOriginal);
  const palabrasBusqueda = textoBusquedaNormalizado.split(/\s+/).filter(palabra => palabra.length > 0); // Divide por espacios y filtra vacios

  let faqFiltradas = [];

  if (textoBusquedaOriginal === "") { // Si el campo de busqueda esta vacio, muestra todas las FAQs
    faqFiltradas = datosFaq;
  } else {
    faqFiltradas = datosFaq.filter(faq => {
      const preguntaNormalizada = normalizarTexto(faq.pregunta);
      const respuestaNormalizada = normalizarTexto(faq.respuesta);

      // Verifica si TODAS las palabras de busqueda estan presentes en la pregunta o la respuesta
      return palabrasBusqueda.every(palabra =>
        preguntaNormalizada.includes(palabra) ||
        respuestaNormalizada.includes(palabra)
      );
    });
  }

  // Limpia el contenedor actual
  contenedorAcordionFaq.innerHTML = "";

  // Muestra u oculta el mensaje de "no resultados"
  if (faqFiltradas.length === 0 && textoBusquedaOriginal !== "") {
    mensajeNoResultados.style.display = 'block';
  } else {
    mensajeNoResultados.style.display = 'none';
    // Renderiza las preguntas filtradas
    faqFiltradas.forEach((item, index) => {
      const itemAcordion = document.createElement("div");
      itemAcordion.className = "accordion-item";

      // Para resaltar coincidencias (opcional pero muy util)
      let preguntaResaltada = item.pregunta;
      let respuestaResaltada = item.respuesta;

      if (textoBusquedaOriginal !== "") {
        // Crear una expresion regular global y sin distinguir mayusculas/minusculas
        // para cada palabra de busqueda y reemplazarla
        palabrasBusqueda.forEach(palabra => {
          const regex = new RegExp(palabra, 'gi'); // 'g' para todas las ocurrencias, 'i' para ignorar mayusculas/minusculas
          preguntaResaltada = preguntaResaltada.replace(regex, match => `<mark>${match}</mark>`);
          respuestaResaltada = respuestaResaltada.replace(regex, match => `<mark>${match}</mark>`);
        });
      }

      itemAcordion.innerHTML = `
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button ${index !== 0 ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="collapse${index}">
                        ${preguntaResaltada}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" aria-labelledby="heading${index}" data-bs-parent="#faq-acordion-contenedor">
                    <div class="accordion-body">
                        ${respuestaResaltada}
                    </div>
                </div>
            `;
      contenedorAcordionFaq.appendChild(itemAcordion);
    });
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Renderiza las preguntas iniciales cuando la pagina carga
  renderizarFaq();

  // Agrega un listener al campo de busqueda para que se actualice al escribir
  busquedaFaq.addEventListener("input", renderizarFaq);
});