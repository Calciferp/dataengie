const slider = document.getElementById("slider"),
  slides = document.querySelectorAll(".slide"),
  dots = document.querySelectorAll(".dot"),
  prevBtn = document.querySelector(".nav-arrow.prev"),
  nextBtn = document.querySelector(".nav-arrow.next"),
  menuToggle = document.getElementById("menuToggle"),
  mainNav = document.getElementById("mainNav");
let autoPlayInterval,
  progressInterval,
  progressStart,
  currentSlide = 0,
  isAnimating = !1,
  mouseX = 0,
  mouseY = 0,
  isPausedByUser = !1,
  slideDuration = 5e3;

function updateBackgroundMovement() {
  const e = slides[currentSlide].querySelector(".background-layer"),
    t = document.querySelectorAll(".bg-shape");
  (e && (e.style.transform = `translate(${20 * mouseX}px, ${20 * mouseY}px)`),
    t.forEach((e, t) => {
      if (e.style.transform && e.style.transform.includes("rotate")) return;
      const n = 15 * (t + 1);
      e.style.transform = `translate(${mouseX * n}px, ${mouseY * n}px)`;
    }));
}

function getTransitionDuration() {
  return currentDuration <= 3 ? 300 : 700;
}

function showSlide(e) {
  if (isAnimating) return;
  isAnimating = !0;
  const t = getTransitionDuration();
  (document.documentElement.style.setProperty(
    "--slide-transition-duration",
    t + "ms",
  ),
    slides.forEach((e) => {
      e.classList.remove("active", "prev");
    }),
    dots.forEach((e) => e.classList.remove("active")),
    currentSlide !== e && slides[currentSlide].classList.add("prev"),
    slides[(currentSlide = e)].classList.add("active"),
    dots[currentSlide].classList.add("active"),
    updateBackgroundMovement(),
    setTimeout(() => {
      isAnimating = !1;
    }, t));
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}
function prevSlide() {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startAutoPlay() {
  (clearInterval(autoPlayInterval),
    stopProgressBar(),
    isPausedByUser ||
      (startProgressBar(),
      (autoPlayInterval = setInterval(() => {
        (nextSlide(), stopProgressBar(), startProgressBar());
      }, slideDuration))));
}

function startProgressBar() {
  const e = document.getElementById("progressBar");
  function t() {
    const t = Date.now() - progressStart,
      n = Math.min(t / slideDuration, 1),
      s = 100 * n;
    ((e.style.width = s + "%"), n >= 1 && (e.style.width = "100%"));
  }
  e &&
    ((e.style.width = "0%"),
    (progressStart = Date.now()),
    clearInterval(progressInterval),
    (progressInterval = setInterval(t, 50)),
    t());
}

function stopProgressBar() {
  clearInterval(progressInterval);
  const e = document.getElementById("progressBar");
  e && (e.style.width = "0%");
}

function openOverlay(e) {
  document.querySelectorAll(".overlay.active").forEach((o) => {
    if (o.id !== e + "Overlay") o.classList.remove("active");
  });
  const t = document.getElementById(e + "Overlay");
  (t.classList.add("active"), clearInterval(autoPlayInterval));
  const n = t.querySelector(".overlay-content");
  n &&
    setTimeout(() => {
      const e = n.querySelector(".scroll-indicator");
      if (e) {
        n.scrollHeight > n.clientHeight &&
          (e.classList.add("show"), n.classList.add("has-scroll"));
      }
    }, 100);
}

function closeOverlay(e) {
  (document.getElementById(e + "Overlay").classList.remove("active"),
    e === "projects" && backToProjects(),
    isPausedByUser || startAutoPlay());
}

/* ============================================================
   Lógica del Lightbox (Visor de imágenes)
   ============================================================ */
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImage');
  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightboxOverlay');
  lightbox.classList.remove('active');
}

// Escuchar clics en imágenes con la clase 'zoomable-image'
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('zoomable-image')) {
      openLightbox(e.target.src);
  }
});


/* ============================================================
   Detalle de proyectos
   ============================================================ */
const projectsData = {
  nlp: {
    name: "Motor de inteligencia operacional y NLP para sector financiero",
    date: "Octubre 2025",
    category: "ml",
    categoryLabel: "Machine Learning & NLP",
    stack: ["Python", "PyTorch", "Transformers", "AWS SageMaker", "PySpark", "FastAPI"],
    hero: "", // Sin imagen hero para que el título quede limpio a la izquierda
    sections: [
      {
        heading: "Contexto y desafío",
        paragraphs: [
          "Una entidad financiera requería optimizar el procesamiento y clasificación de las comunicaciones de sus clientes, ya que el proceso tradicional de categorización (Peticiones, Quejas, Reclamos y Solicitudes - PQRS) resultaba insuficiente para aprovechar el valor de la información en texto libre.",
          "El objetivo principal fue diseñar una solución de Procesamiento de Lenguaje Natural (PLN) para extraer inteligencia operacional y de negocio. La solución debía interpretar intenciones, sentimientos, emociones, entidades relevantes, señales asociadas a fraude o seguridad y riesgo de abandono, enfrentándose al desafío de procesar lenguaje no estructurado con terminología del sector financiero y manteniendo mecanismos de control sobre información sensible."
        ],
      },
      {
        heading: "Arquitectura y solución Técnica",
        paragraphs: [
          "Se diseñó una arquitectura de procesamiento de lenguaje basada en Python, donde los correos ingresan a un pipeline para realizar preprocesamiento, extracción de características, inferencia mediante modelos de NLP y generación de atributos estructurados.",
          "El flujo se estructura en las siguientes etapas:",
          "",
          "<img class='zoomable-image' src='Static/Projects/FlujoNLP_financiero.jpg' alt='Flujo de la arquitectura NLP' style='width: 100%; max-width: 800px; border-radius: 12px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>",
          "Inicia con la normalización del contenido y la clasificación automática de las comunicaciones (tipología PQRS e intención). Seguidamente, se integra un análisis de sentimiento y emoción, y una extracción automática de entidades (NER) para identificar montos, fechas, productos y canales.",
          "La arquitectura también incorpora la detección temprana de eventos asociados a fraude, una capa de enriquecimiento mediante topic modeling y clustering para análisis de causa raíz, y modelos predictivos para identificar la intención y el riesgo de abandono (churn). Finalmente, utiliza un módulo de Next Best Action con modelos de lenguaje (LLM) para sugerir borradores de respuesta al analista y aplica controles de compliance y calidad."
        ],
      },
      {
        heading: "Impacto y resultados",
        paragraphs: [
          "La solución permitió evolucionar de una clasificación manual a un esquema de inteligencia automatizada sobre las comunicaciones, transformando los correos en atributos estructurados listos para ser utilizados por los procesos operativos.",
          "Se mejoró significativamente el direccionamiento automático de los casos y se establecieron mecanismos de priorización temprana para alertas de fraude y seguridad. Además, el análisis de tópicos facilitó la detección de fallas recurrentes, mientras que la predicción de churn abrió la puerta a estrategias de retención proactivas, convirtiendo un canal tradicional en una potente fuente de inteligencia operacional."
        ],
      },
    ],
  },
  agro: {
    name: "Plataforma predictiva para selección de cultivos y riesgo agrícola",
    date: "Octubre 2025",
    category: "data",
    categoryLabel: "Data Engineering & ML",
    stack: ["AWS", "Amazon S3", "AWS Glue", "Amazon SageMaker", "PySpark", "Apache Airflow", "FastAPI", "Python"],
    hero: "", // Sin imagen hero
    sections: [
      {
        heading: "Contexto y desafío",
        paragraphs: [
          "El sistema procesa información agrícola, meteorológica, operativa y económica para determinar la alternativa de cultivo más favorable para una determinada zona y ventana temporal, aplicada para determinada cooperativa arrocera del centro de Colombia.",
          "La fuente principal de complejidad está en que la decisión agrícola no depende de una única variable. Condiciones como precipitación, temperatura, humedad, disponibilidad de agua, características del suelo, requerimientos hídricos del cultivo y costo energético del riego interactúan entre sí y modifican la conveniencia de establecer un cultivo determinado.",
          "Por esta razón, el sistema se plantea como una plataforma de Data Engineering + Machine Learning + análisis de series temporales + motor de decisión, en lugar de un único modelo predictivo.",
          "La plataforma recibe datos históricos y periódicos, construye un repositorio temporal y espacial de información agrícola, genera variables derivadas, ejecuta modelos de predicción y finalmente aplica un motor de scoring que compara diferentes cultivos y fechas de establecimiento.",
          "El resultado no es solamente una predicción aislada. Para cada combinación zona + cultivo + fecha, el sistema genera un conjunto de indicadores que permiten determinar su nivel de favorabilidad y explicar qué variables están afectando la decisión."
        ]
      },
      {
        heading: "Arquitectura y solución técnica",
        paragraphs: [
          "La arquitectura productiva se define sobre AWS, utilizando Python como lenguaje principal para ingeniería de datos, modelamiento y servicios de aplicación.",
          "<strong>Arquitectura general</strong><br>El flujo tecnológico se estructura de la siguiente manera:<br><em>Fuentes de datos → Data Lake → ETL/ELT → Feature Engineering → Feature Store → Modelos ML → Motor de decisión → API → Alertas y visualización</em>",
          "<img class='zoomable-image' src='Static/Projects/Arquitectura_AWS_Cultivos.jpg' alt='Arquitectura en AWS' style='width: 100%; max-width: 800px; border-radius: 12px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>"
        ]
      },
      {
        heading: "2.1 Ingesta de datos",
        paragraphs: [
          "La plataforma recibe información desde diferentes fuentes: APIs meteorológicas y climatológicas, registros históricos de estaciones, sensores de humedad y variables agrícolas, información de parcelas y características del suelo, consumo de agua y operación de sistemas de riego, consumo y precio del combustible diésel, datos históricos de cultivos y rendimiento, información de fenómenos climáticos y datos externos de pronóstico.",
          "Las cargas batch y periódicas se implementan utilizando AWS Glue, mientras que los eventos de llegada de información pueden gestionarse mediante Amazon EventBridge.",
          "Los archivos originales se almacenan en Amazon S3, funcionando como Data Lake y conservando la información en su formato raw para garantizar trazabilidad. Se usó una estructura por particiones: <code>S3 / raw / fuente / año / mes / día</code> y posteriormente <code>S3 / curated / dominio / año / mes / día</code>, permitiendo separar la información original de los datasets procesados."
        ]
      },
      {
        heading: "2.2 Data Lake y catalogación",
        paragraphs: [
          "Amazon S3 constituye la capa principal de almacenamiento. La información se organiza mediante una arquitectura de zonas:",
          "<ul><li><strong>Raw:</strong> Conserva los datos originales.</li><li><strong>Clean:</strong> Contiene información normalizada, tipada y validada.</li><li><strong>Curated:</strong> Contiene datasets integrados, con relaciones entre clima, parcelas, cultivos, riego y variables económicas.</li><li><strong>Analytics:</strong> Datasets preparados específicamente para consumo de modelos, dashboards y procesos de decisión.</li></ul>",
          "AWS Glue Data Catalog registra los esquemas y metadatos de las tablas en S3, permitiendo consultar la información mediante Amazon Athena. Para procesamiento de grandes volúmenes o información proveniente de sensores e imágenes, se utiliza PySpark sobre AWS Glue o Amazon EMR."
        ]
      },
      {
        heading: "2.3 Procesamiento y calidad de datos",
        paragraphs: [
          "La transformación se desarrolla principalmente con Python, Pandas, NumPy y PySpark.",
          "Los pipelines realizan: normalización temporal, tratamiento de valores faltantes, detección de outliers, homogeneización de unidades, validación de rangos físicos, unión de información meteorológica y espacial, cálculo de acumulados/ventanas temporales e integración de información económica y operacional.",
          "Se implementan además controles de calidad para detectar precipitaciones físicamente inconsistentes, sensores sin actualización o incrementos anómalos en consumo de agua/combustible. Los resultados se registran en tablas de control para monitorear el estado de los pipelines."
        ]
      },
      {
        heading: "2.4 Feature Engineering",
        paragraphs: [
          "Esta es una de las capas principales del sistema. A partir de los datos originales se construye un conjunto de variables específicamente orientadas a representar las condiciones agrícolas:",
          "<ul><li><strong>Climáticas:</strong> Precipitación acumulada, días sin precipitación, temperatura (máx/mín/media), humedad relativa, radiación, evapotranspiración y anomalías respecto al histórico.</li><li><strong>Hídricas:</strong> Demanda hídrica estimada, déficit hídrico, agua disponible, requerimiento y frecuencia de riego, volumen estimado de agua.</li><li><strong>Operacionales y Agronómicas:</strong> Horas de bombas, consumo de diésel, costo de riego/energía, tipo de suelo, cultivo, etapa fenológica, requerimientos hídricos e historial productivo.</li><li><strong>Climáticas externas:</strong> Indicadores ENSO, anomalías y probabilidad de escenarios extremos.</li></ul>",
          "Una parte importante del feature engineering corresponde al cálculo del balance hídrico. Para estimar las necesidades de agua se utiliza la metodología FAO-56, calculando evapotranspiración de referencia mediante Penman-Monteith y ajustándola mediante coeficientes del cultivo.",
          "<img class='zoomable-image' src='Static/Projects/Ciclo_Agricola.jpg' alt='Ciclo Agrícola y Gestión Hídrica' style='width: 100%; max-width: 800px; border-radius: 12px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>",
          "El resultado alimenta el cálculo del déficit hídrico y permite traducir la necesidad de agua en una estimación del requerimiento de riego. Posteriormente, el consumo esperado se relaciona con el funcionamiento de las bombas y el consumo de combustible, generando una variable económica asociada."
        ]
      },
      {
        heading: "2.5 Feature Store y 2.6 Modelos Predictivos",
        paragraphs: [
          "Las variables se centralizan en <strong>Amazon SageMaker Feature Store</strong>, garantizando consistencia entre entrenamiento e inferencia. Las features se organizaron por entidades (<code>parcela + fecha + cultivo</code>) para ser consumidas por múltiples modelos.",
          "El sistema utiliza diferentes modelos especializados: un grupo de <em>forecasting</em> (SARIMA, Prophet, XGBoost) para proyectar variables meteorológicas y demanda hídrica. Para variables tabulares, se implementaron XGBoost y LightGBM combinando variables agronómicas y operativas para estimar rendimiento, requerimiento de riego y costo energético."
        ]
      },
      {
        heading: "2.7 Modelo de favorabilidad y 2.8 Optimización",
        paragraphs: [
          "Sobre las predicciones se construye un modelo de scoring multicriterio (<code>Zona + Cultivo + Fecha de siembra</code>). Calcula indicadores (rendimiento, déficit de agua, costo de riego/combustible, riesgo climático, aptitud del suelo) y los transforma en un <strong>índice de favorabilidad</strong>.",
          "Separar esto del ML permite modificar los pesos de decisión sin reentrenar modelos. El sistema simula distintas fechas posibles ejecutando la cadena predictiva (<code>fecha → clima → requerimiento hídrico → costos → rendimiento → riesgo → favorabilidad</code>) para seleccionar la mejor ventana de siembra."
        ]
      },
      {
        heading: "2.9 Anomalías, 2.10 MLOps y API",
        paragraphs: [
          "Se mantiene un monitoreo continuo usando Z-score, IQR o Isolation Forest para detectar desviaciones climáticas locales o externas (El Niño/La Niña), generando alertas tempranas.",
          "Los modelos se gestionan con <strong>Amazon SageMaker</strong> (MLOps completo desde dataset hasta monitoreo y reentrenamiento). Los resultados se exponen mediante una <strong>API en FastAPI</strong> alojada en Amazon ECS con Fargate, la cual devuelve el ranking de cultivos y variables explicativas, mientras que el flujo de datos se orquesta con <strong>Apache Airflow (MWAA)</strong>."
        ]
      },
      {
        heading: "Impacto y resultados",
        paragraphs: [
          "La arquitectura transforma múltiples fuentes heterogéneas de información en un sistema único de predicción y decisión. El principal resultado técnico es la generación de una estructura de decisión basada en la combinación de variables que anteriormente podían encontrarse separadas: clima, características agrícolas, requerimientos hídricos, consumo energético y riesgo.",
          "Desde Data Engineering, establece un Data Lake centralizado, pipelines reproducibles y una capa de features reutilizable. Desde Data Science, la separación entre predicción y scoring permite evolucionar componentes independientemente.",
          "Finalmente, el uso de infraestructura serverless y administrada en AWS transforma el problema agrícola en un proceso reproducible (<code>captura → almacenamiento → transformación → features → predicción → evaluación de escenarios → decisión → alerta</code>), pasando de un análisis descriptivo a una plataforma capaz de anticipar escenarios y actualizar recomendaciones dinámicamente."
        ]
      }
    ]
  },
  secop: {
    name: "Plataforma de analítica de contratación pública y minería de datos sobre SECOP II (Proyecto en desarrollo)",
    date: "En desarrollo",
    category: "data",
    categoryLabel: "Data Analytics & NLP",
    stack: ["Python", "Pandas", "PySpark", "spaCy", "Sentence Transformers", "Scikit-learn", "Amazon S3", "AWS Glue", "Amazon Athena", "AWS Lambda", "EventBridge", "Power BI"],
    hero: "", // Sin imagen hero
    sections: [
      {
        heading: "Contexto y desafío",
        paragraphs: [
          "El proyecto se encuentra en desarrollo y busca analizar la contratación pública colombiana relacionada con tecnología, datos, analítica, desarrollo de software e inteligencia artificial a partir de la información disponible en SECOP II.",
          "El principal desafío consiste en combinar datos estructurados, como entidades, proveedores, fechas y valores de contratos, con información textual contenida en los objetos contractuales.",
          "La solución busca identificar quién contrata, quién gana los contratos, cuánto se invierte y qué tecnologías y servicios son más demandados por el Estado."
        ]
      },
      {
        heading: "Arquitectura y solución técnica",
        paragraphs: [
          "La solución se está construyendo sobre una arquitectura de datos por capas utilizando Python y AWS.",
          "<strong>Arquitectura general</strong><br>El flujo principal es:<br><em>API SECOP II → Python → Amazon S3 → AWS Glue → NLP → Amazon Athena → Power BI</em>",
          "Los datos obtenidos desde SECOP II se almacenan inicialmente en Amazon S3 en una capa Bronze, conservando los registros originales.",
          "Posteriormente, mediante Python, Pandas y PySpark, se realizan procesos de limpieza, normalización de fechas, valores, proveedores y entidades. Estos datos conforman la capa Silver.",
          "Sobre los objetos contractuales se aplica procesamiento de lenguaje natural utilizando spaCy, Scikit-learn y Sentence Transformers para identificar tecnologías y categorías como:",
          "<ul><li>Data Science</li><li>Data Engineering</li><li>Business Intelligence</li><li>Cloud</li><li>Software Development</li><li>Inteligencia Artificial</li></ul>",
          "La información enriquecida se organiza en una capa Gold mediante un modelo dimensional que relaciona contratos, proveedores, entidades, fechas, ubicaciones y tecnologías.",
          "AWS Glue se utiliza para los procesos ETL y Amazon Athena como capa de consulta sobre el Data Lake.",
          "Finalmente, los resultados podrán integrarse con Power BI para construir dashboards sobre inversión, proveedores, entidades, ubicación y tendencias tecnológicas."
        ]
      },
      {
        heading: "Impacto y resultados",
        paragraphs: [
          "Al encontrarse en desarrollo, el proyecto busca establecer una plataforma automatizada para analizar continuamente la contratación pública relacionada con tecnología y datos.",
          "La solución permitirá consolidar información sobre proveedores, entidades, valores contratados y tecnologías demandadas, complementando los datos estructurados de SECOP II con información extraída mediante NLP de los objetos contractuales.",
          "El resultado esperado es una herramienta de Business Intelligence y analítica de mercado que facilite identificar tendencias de contratación, concentración de proveedores y evolución de la demanda tecnológica del sector público colombiano."
        ]
      }
    ]
  }
};

function showProjectDetail(id) {
  const data = projectsData[id];
  if (!data) return;

  document.getElementById("projectsListView").style.display = "none";
  const detail = document.getElementById("projectDetailView");
  detail.classList.add("active");
  const overlayBox = document.getElementById("projectsOverlayContent");
  if (overlayBox) overlayBox.classList.add("project-detail-mode");

  const tag = document.getElementById("pdTag");
  tag.textContent = data.categoryLabel;
  tag.className = "category-tag " + data.category;

  document.getElementById("pdName").textContent = data.name;
  document.getElementById("pdDate").textContent = data.date;
  document.getElementById("pdStackList").innerHTML = data.stack
    .map((s) => `<span class="stack-pill">${s}</span>`)
    .join("");

  const hero = document.getElementById("pdHero");
  const mainTitle = document.getElementById("pdMainTitle");
  
  // Lógica inteligente para ocultar imagen si no existe y mover título a la izquierda
  if (data.hero && data.hero.trim() !== "") {
      hero.style.display = "block";
      mainTitle.style.display = "none"; // Ocultamos el título izquierdo
      document.getElementById("pdName").style.display = "block"; // Mostramos en sidebar
      
      hero.src = data.hero;
      hero.alt = data.name;
      hero.onerror = function () {
        this.onerror = null;
        this.src = data.heroFallback || "";
      };
  } else {
      hero.style.display = "none";
      mainTitle.style.display = "block";
      mainTitle.textContent = data.name;
      document.getElementById("pdName").style.display = "none"; // Ocultamos título en el sidebar para no repetir
  }

  document.getElementById("pdSections").innerHTML = data.sections
    .map(
      (sec) =>
        `<h3>${sec.heading}</h3>` +
        sec.paragraphs.map((p) => `<p>${p}</p>`).join("")
    )
    .join("");

  const scrollBox = document.getElementById("projectsOverlayContent");
  if (scrollBox) scrollBox.scrollTop = 0;
}

function backToProjects() {
  document.getElementById("projectDetailView").classList.remove("active");
  document.getElementById("projectsListView").style.display = "block";
  const scrollBox = document.getElementById("projectsOverlayContent");
  if (scrollBox) {
    scrollBox.scrollTop = 0;
    scrollBox.classList.remove("project-detail-mode");
  }
}

(function initDeepLinkProject() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("project");
  if (projectId && projectsData[projectId]) {
    openOverlay("projects");
    showProjectDetail(projectId);
  }
})();
    
async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:8000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.");
            e.target.reset();
            closeOverlay('contact');
        } else {
            alert("Hubo un error al enviar el mensaje. Intenta contactarme directamente al correo.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("No se pudo conectar con el servidor. Intenta enviarme un correo directamente a tamayoc.felipe@gmail.com.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function moveShapeToRandomPosition(e) {
  const t = 60 * Math.random() + 10,
    n = 80 * Math.random() + 5;
  ((e.style.top = t + "%"),
    (e.style.left = n + "%"),
    (e.style.bottom = "auto"),
    (e.style.right = "auto"));
  const s = 360 * Math.random();
  ((e.style.transform = `rotate(${s}deg)`),
    setTimeout(() => {
      e.style.transform = "";
    }, 800));
}

function autoMoveShapes() {
  document.querySelectorAll(".bg-shape").forEach((e, t) => {
    setTimeout(() => {
      moveShapeToRandomPosition(e);
    }, 2e3 * t);
  });
}

function handleScrollIndicator(e) {
  const t = e.querySelector(".scroll-indicator");
  function n() {
    const n = e.scrollHeight > e.clientHeight,
      s = e.scrollTop + e.clientHeight >= e.scrollHeight - 10;
    (n && !s ? t.classList.add("show") : t.classList.remove("show"),
      n && !s
        ? e.classList.add("has-scroll")
        : e.classList.remove("has-scroll"));
  }
  t && (setTimeout(n, 100), e.addEventListener("scroll", n));
}
(menuToggle.addEventListener("click", () => {
  (menuToggle.classList.toggle("active"), mainNav.classList.toggle("active"));
}),
  document.querySelectorAll("nav a").forEach((e) => {
    e.addEventListener("click", () => {
      window.innerWidth <= 768 &&
        (menuToggle.classList.remove("active"),
        mainNav.classList.remove("active"));
    });
  }),
  slider.addEventListener("mousemove", (e) => {
    const t = slider.getBoundingClientRect();
    ((mouseX = (e.clientX - t.left) / t.width - 0.5),
      (mouseY = (e.clientY - t.top) / t.height - 0.5),
      updateBackgroundMovement());
  }),
  nextBtn.addEventListener("click", () => {
    (clearInterval(autoPlayInterval),
      nextSlide(),
      isPausedByUser || startAutoPlay());
  }),
  prevBtn.addEventListener("click", () => {
    (clearInterval(autoPlayInterval),
      prevSlide(),
      isPausedByUser || startAutoPlay());
  }),
  dots.forEach((e) => {
    e.addEventListener("click", () => {
      (clearInterval(autoPlayInterval),
        showSlide(parseInt(e.getAttribute("data-slide"))),
        isPausedByUser || startAutoPlay());
    });
  }),
  document.addEventListener("keydown", (e) => {
    "ArrowLeft" === e.key
      ? (clearInterval(autoPlayInterval),
        prevSlide(),
        isPausedByUser || startAutoPlay())
      : "ArrowRight" === e.key
        ? (clearInterval(autoPlayInterval),
          nextSlide(),
          isPausedByUser || startAutoPlay())
        : "h" === e.key.toLowerCase() && uiToggleBtn.click();
  }),
  document.querySelectorAll(".overlay").forEach((e) => {
    e.addEventListener("click", (t) => {
      t.target === e &&
        (e.classList.remove("active"), isPausedByUser || startAutoPlay());
    });
  }),
  document.addEventListener("keydown", (e) => {
    "Escape" === e.key &&
      (document.querySelectorAll(".overlay").forEach((e) => {
        e.classList.remove("active");
      }),
      isPausedByUser || startAutoPlay());
  }),
  startAutoPlay(),
  updateBackgroundMovement(),
  window.innerWidth <= 768 &&
    slider.removeEventListener("mousemove", updateBackgroundMovement),
  document.querySelectorAll(".bg-shape").forEach((e) => {
    e.addEventListener("click", function (e) {
      (e.stopPropagation(), moveShapeToRandomPosition(this));
    });
  }),
  setInterval(autoMoveShapes, 15e3),
  setTimeout(autoMoveShapes, 5e3),
  document.querySelectorAll(".overlay-content").forEach((e) => {
    handleScrollIndicator(e);
  }));

const fullscreenBtn = document.getElementById("fullscreenBtn"),
  expandIcon =
    '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
  collapseIcon =
    '<svg viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';
(fullscreenBtn.addEventListener("click", () => {
  (window.innerWidth <= 768 &&
    (menuToggle.classList.remove("active"), mainNav.classList.remove("active")),
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement
      ? (document.exitFullscreen
          ? document.exitFullscreen()
          : document.webkitExitFullscreen
            ? document.webkitExitFullscreen()
            : document.mozCancelFullScreen
              ? document.mozCancelFullScreen()
              : document.msExitFullscreen && document.msExitFullscreen(),
        fullscreenBtn.classList.remove("active"),
        (fullscreenBtn.innerHTML = expandIcon))
      : (document.documentElement.requestFullscreen
          ? document.documentElement.requestFullscreen()
          : document.documentElement.webkitRequestFullscreen
            ? document.documentElement.webkitRequestFullscreen()
            : document.documentElement.mozRequestFullScreen
              ? document.documentElement.mozRequestFullScreen()
              : document.documentElement.msRequestFullscreen &&
                document.documentElement.msRequestFullscreen(),
        fullscreenBtn.classList.add("active"),
        (fullscreenBtn.innerHTML = collapseIcon)));
}),
  document.addEventListener("fullscreenchange", () => {
    document.fullscreenElement ||
      (fullscreenBtn.classList.remove("active"),
      (fullscreenBtn.innerHTML = expandIcon));
  }),
  document.addEventListener("webkitfullscreenchange", () => {
    document.webkitFullscreenElement ||
      (fullscreenBtn.classList.remove("active"),
      (fullscreenBtn.innerHTML = expandIcon));
  }),
  document.addEventListener("mozfullscreenchange", () => {
    document.mozFullScreenElement ||
      (fullscreenBtn.classList.remove("active"),
      (fullscreenBtn.innerHTML = expandIcon));
  }));
const playPauseBtn = document.getElementById("playPauseBtn"),
  playIcon = '<svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>',
  pauseIcon =
    '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
((playPauseBtn.innerHTML = pauseIcon),
  playPauseBtn.addEventListener("click", (e) => {
    (e.stopPropagation(),
      isPausedByUser
        ? ((isPausedByUser = !1),
          startAutoPlay(),
          (playPauseBtn.innerHTML = pauseIcon),
          playPauseBtn.classList.remove("paused"))
        : ((isPausedByUser = !0),
          clearInterval(autoPlayInterval),
          stopProgressBar(),
          (playPauseBtn.innerHTML = playIcon),
          playPauseBtn.classList.add("paused")));
  }));
const decreaseBtn = document.getElementById("decreaseDuration"),
  increaseBtn = document.getElementById("increaseDuration"),
  durationDisplay = document.getElementById("durationDisplay"),
  progressBarContainer = document.querySelector(".progress-bar-container"),
  durationControls = document.querySelector(".duration-controls");
let currentDuration = 8;
function updateDuration(e) {
  ((currentDuration = Math.max(1, Math.min(9, e))),
    (slideDuration = 1e3 * currentDuration),
    (durationDisplay.innerHTML = currentDuration + "<span>s</span>"));
  const t = getTransitionDuration();
  (document.documentElement.style.setProperty(
    "--slide-transition-duration",
    t + "ms",
  ),
    isPausedByUser || startAutoPlay());
}
(document.documentElement.style.setProperty(
  "--slide-transition-duration",
  "700ms",
),
  decreaseBtn.addEventListener("click", (e) => {
    (e.stopPropagation(), updateDuration(currentDuration - 1));
  }),
  increaseBtn.addEventListener("click", (e) => {
    (e.stopPropagation(), updateDuration(currentDuration + 1));
  }));