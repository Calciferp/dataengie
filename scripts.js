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
  // Cierra cualquier otro overlay abierto para que Acerca de / Proyectos / Contacto
  // nunca queden encimados, sin importar desde dónde se abran.
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
   Detalle de proyectos (integrado en la misma página, sin
   navegar a archivos .html independientes ni recargar nada)
   ============================================================ */
const projectsData = {
  nlp: {
    name: "Motor de Análisis de Sentimientos y Clasificación de Textos",
    date: "Agosto 2026",
    category: "ml",
    categoryLabel: "Machine Learning",
    stack: ["Python", "Transformers", "Hugging Face", "Azure AI", "FastAPI", "Docker"],
    hero: "Static/images/nlp-bg.jpg",
    heroFallback: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1200",
    sections: [
      {
        heading: "Contexto y Desafío",
        paragraphs: [
          "Con el crecimiento exponencial de las interacciones digitales de los usuarios, los equipos de soporte y análisis enfrentan el reto de procesar grandes volúmenes de texto no estructurado. El objetivo de este proyecto fue diseñar e implementar un sistema inteligente capaz de interpretar automáticamente tickets de servicio, correos y comentarios, categorizando cada mensaje y extrayendo el sentimiento subyacente (positivo, neutro, negativo) para priorizar la atención al cliente de manera dinámica.",
        ],
      },
      {
        heading: "Arquitectura y Solución Técnica",
        paragraphs: [
          "El núcleo del motor predictivo se construyó utilizando modelos avanzados de procesamiento de lenguaje natural basados en la arquitectura Transformer. Específicamente, se realizó un proceso de fine-tuning sobre un modelo base de Hugging Face, entrenándolo con un corpus de datos históricos etiquetados del negocio.",
          "Para asegurar la escalabilidad y disponibilidad de las predicciones en tiempo real, el modelo se expuso a través de una API RESTful desarrollada con FastAPI. Toda la solución se empaquetó en contenedores Docker y se orquestó utilizando los servicios de Azure AI, permitiendo una integración fluida con los pipelines de datos existentes y herramientas de Business Intelligence (BI) para el monitoreo de las métricas obtenidas.",
        ],
      },
      {
        heading: "Impacto y Resultados",
        paragraphs: [
          "La implementación de esta solución de IA automatizó el 85% del triaje manual inicial de comunicaciones. Además, al integrar la inferencia del modelo directamente en los tableros analíticos, se habilitó la detección temprana de anomalías en la satisfacción del cliente, permitiendo respuestas proactivas ante picos de sentimientos negativos.",
        ],
      },
    ],
  },
  lakehouse: {
    name: "Data Lakehouse en Azure",
    date: "2026",
    category: "data",
    categoryLabel: "Ingeniería de Datos",
    stack: ["Azure Databricks", "Delta Lake", "OneLake", "Microsoft Fabric", "PySpark", "Apache Spark"],
    hero: "Static/images/datalakehouse-bg.jpg",
    heroFallback: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    sections: [
      {
        heading: "Descripción del proyecto",
        paragraphs: [
          "Diseño y construcción de una arquitectura Medallion (Bronce, Plata, Oro) utilizando Azure Databricks y Delta Lake para el manejo de más de 100 TB de datos mensuales, centralizando el almacenamiento y procesamiento de datos estructurados y no estructurados provenientes de múltiples fuentes.",
        ],
      },
    ],
  },
  etl: {
    name: "Automatización de Pipelines ETL/ELT",
    date: "2026",
    category: "data",
    categoryLabel: "Ingeniería de Datos",
    stack: ["Microsoft Fabric", "Azure Data Factory", "REST APIs", "SQL", "Power Automate"],
    hero: "Static/images/pipelines-bg.jpg",
    heroFallback: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1200",
    sections: [
      {
        heading: "Descripción del proyecto",
        paragraphs: [
          "Orquestación de flujos de datos complejos integrando múltiples APIs REST con bases de datos y plataformas de BI utilizando Microsoft Fabric y Azure Data Factory, automatizando procesos que antes requerían intervención manual entre sistemas.",
        ],
      },
    ],
  },
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
  hero.src = data.hero;
  hero.alt = data.name;
  hero.onerror = function () {
    this.onerror = null;
    this.src = data.heroFallback || "";
  };

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

// Enlace directo: permite abrir un proyecto puntual (ej. index.html?project=nlp)
// sin depender de un archivo .html independiente por proyecto.
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
    
    // Extraer los datos del formulario
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Cambiar el texto del botón mientras envía
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
        // Petición POST a tu backend en FastAPI
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
let uiVisible = !0;
const eyeOpenPath =
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeClosedPath =
    '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
uiToggleBtn.addEventListener("click", (e) => {
  (e.preventDefault(), e.stopPropagation());
  const t = document.querySelectorAll(".ui-element");
});