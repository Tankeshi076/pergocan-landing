// =======================
// GA4: helper de tracking
// =======================
function gaEvent(name, params = {}) {
  try {
    if (typeof gtag === "function") gtag("event", name, params);
  } catch (e) {}
}

// Track automático de WhatsApp (detecta cualquier link a wa.me / api.whatsapp)
document.addEventListener("click", (e) => {
  const a = e.target.closest?.("a");
  if (!a) return;
  const href = (a.getAttribute("href") || "").toLowerCase();
  if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
    gaEvent("whatsapp_click", {
      link_url: a.href || href,
      link_text: (a.textContent || "").trim().slice(0, 60),
    });
  }
});

// ==================== WHATSAPP ====================
const PHONE = "525568769020";
function abrirWhatsApp(texto) {
  const msg = encodeURIComponent(texto);
  window.open(`https://wa.me/${PHONE}?text=${msg}`, "_blank");
}

// ==================== GALERÍAS ====================
// IMPORTANTE: las llaves deben coincidir con data-galeria del HTML.
const galerias = {
  blackout: ["blackout1.jpeg","blackout2.jpeg","blackout3.jpeg","blackout4.jpeg","blackout5.jpeg","blackout6.jpeg","blackout7.jpeg","blackout8.jpeg","blackout9.jpeg","blackout10.jpeg"],
  sheer: ["sheer1.jpeg","sheer2.jpeg","sheer3.jpeg","sheer4.jpeg","sheer5.jpeg","sheer6.jpeg","sheer7.jpeg","sheer8.jpeg","sheer9.jpeg","sheer10.jpeg"],
  malla: ["malla1.jpeg","malla2.jpeg","malla3.jpeg","malla4.jpeg","malla5.jpeg","malla6.jpeg","malla7.jpeg","malla8.jpeg","malla9.jpeg","malla10.jpeg"],
  palilleria: ["palilleria1.jpg","palilleria2.jpg","palilleria3.jpg","palilleria4.jpg","palilleria5.jpg","palilleria6.jpg","palilleria7.jpg","palilleria8.jpg","palilleria9.jpg","palilleria10.jpg"],
  climatika: ["climatika1.jpeg","climatika2.jpeg","climatika3.jpeg","climatika4.jpeg","climatika5.jpeg","climatika6.jpeg","climatika7.jpeg","climatika8.jpeg","climatika9.jpeg","climatika10.jpeg"],
  "shangri-la": ["shangri-la1.jpeg","shangri-la2.jpeg","shangri-la3.jpeg","shangri-la4.jpeg","shangri-la5.jpeg","shangri-la6.jpeg","shangri-la7.jpeg","shangri-la8.jpeg","shangri-la9.jpeg","shangri-la10.jpeg"],
  "toldo-retractil": ["Toldo Retractil - 002.jpeg","Toldo Retractil - 001.jpeg","Toldo Retractil - 003.jpg","Toldo Retractil - 004.jpg","Toldo Retractil - 005.jpg","Toldo Retractil - 006.jpg","Toldo Retractil - 007.jpg","Toldo Retractil - 008.jpg","Toldo Retractil - 009.jpg","Toldo Retractil - 010.jpg"],
  "toldo-vertical": ["toldovertical1.jpg","toldovertical2.jpg","toldovertical3.jpg","toldovertical4.jpg","toldovertical5.jpg","toldovertical6.jpg","toldovertical7.jpg","toldovertical8.jpg","toldovertical9.jpg","toldovertical10.jpg"],
};

// ==================== MODAL ELEMENTOS ====================
const modal = document.getElementById("galeria-modal");
const titulo = document.getElementById("titulo-galeria");
const fotoPrincipal = document.getElementById("foto-principal");
const thumbs = document.getElementById("thumbs");
const viewer = document.getElementById("viewer");
const contador = document.getElementById("contador-galeria");

let listaActual = [];
let indexActual = 0;

function setSrcConFallback(imgEl, src) {
  imgEl.onerror = () => {
    const lower = src.toLowerCase();
    if (lower.endsWith(".jpeg")) { imgEl.onerror = null; imgEl.src = src.slice(0, -5) + ".jpg"; return; }
    if (lower.endsWith(".jpg"))  { imgEl.onerror = null; imgEl.src = src.slice(0, -4) + ".jpeg"; return; }
  };
  imgEl.src = src;
}

function abrirGaleria(tipo, tituloTexto = "Galería") {
  // tracking
  gaEvent("gallery_open", { gallery: tipo || "unknown", title: tituloTexto || "Galería" });

  listaActual = galerias[tipo] || [];
  indexActual = 0;

  if (titulo) titulo.textContent = tituloTexto;

  if (!listaActual.length) {
    fotoPrincipal?.removeAttribute("src");
    if (fotoPrincipal) fotoPrincipal.alt = "Sin fotos";
    if (thumbs) thumbs.innerHTML = `<div style="padding:10px;color:rgba(255,255,255,.75)">Aún no hay fotos para este producto.</div>`;
    if (contador) contador.textContent = `0 / 0`;
  } else {
    renderGaleria();
  }

  if (modal) {
    modal.classList.add("activo");
    modal.setAttribute("aria-hidden", "false");
  }
  document.body.style.overflow = "hidden";
}

function cerrarGaleria() {
  if (!modal) return;
  modal.classList.remove("activo");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderGaleria() {
  const src = listaActual[indexActual];
  if (fotoPrincipal) {
    setSrcConFallback(fotoPrincipal, src);
    fotoPrincipal.alt = titulo?.textContent || "Foto del producto";
    fotoPrincipal.loading = "eager";
    fotoPrincipal.decoding = "async";
  }

  if (contador) contador.textContent = `${indexActual + 1} / ${listaActual.length}`;

  if (!thumbs) return;
  thumbs.innerHTML = listaActual.map((imgSrc, i) => {
    const activo = i === indexActual ? "activo" : "";
    return `
      <button class="thumb ${activo}" type="button" data-i="${i}">
        <img src="${imgSrc}" alt="Miniatura ${i + 1}" loading="lazy" decoding="async">
      </button>
    `;
  }).join("");

  thumbs.querySelectorAll(".thumb").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.i);
      if (!Number.isNaN(i)) { indexActual = i; renderGaleria(); }
    });
  });
}

function nextFoto() {
  if (!listaActual.length) return;
  indexActual = (indexActual + 1) % listaActual.length;
  renderGaleria();
}
function prevFoto() {
  if (!listaActual.length) return;
  indexActual = (indexActual - 1 + listaActual.length) % listaActual.length;
  renderGaleria();
}

// ==================== EVENTOS MODAL ====================
document.addEventListener("click", (e) => {
  if (e.target?.classList?.contains("modal__close")) cerrarGaleria();
});

modal?.addEventListener("click", (e) => {
  if (e.target === modal) cerrarGaleria();
});

document.querySelector(".nav--left")?.addEventListener("click", prevFoto);
document.querySelector(".nav--right")?.addEventListener("click", nextFoto);

document.addEventListener("keydown", (e) => {
  if (!modal?.classList.contains("activo")) return;
  if (e.key === "Escape") cerrarGaleria();
  if (e.key === "ArrowRight") nextFoto();
  if (e.key === "ArrowLeft") prevFoto();
});

// swipe móvil
if (viewer) {
  let sx = 0, sy = 0;
  viewer.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY;
  }, { passive: true });

  viewer.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? nextFoto() : prevFoto();
    }
  }, { passive: true });
}

document.getElementById("abrir-foto")?.addEventListener("click", () => {
  const src = fotoPrincipal?.getAttribute("src");
  if (src) window.open(src, "_blank");
});

document.getElementById("cotizar-foto")?.addEventListener("click", () => {
  const producto = titulo?.textContent || "Producto";
  const texto =
    `Hola, quiero cotización y visita de medición GRATIS.\n\n` +
    `Producto: ${producto}\n` +
    `¿Me apoyas con precio y disponibilidad?`;
  abrirWhatsApp(texto);
});

// ==================== FORM -> WHATSAPP ====================
document.getElementById("form-cotizacion")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = (document.getElementById("f-nombre")?.value || "").trim();
  const zona = (document.getElementById("f-zona")?.value || "").trim();
  const producto = (document.getElementById("f-producto")?.value || "").trim();
  const medidas = (document.getElementById("f-medidas")?.value || "").trim();
  const mensaje = (document.getElementById("f-mensaje")?.value || "").trim();

  const texto =
    `Hola, quiero cotización y visita de medición GRATIS.\n\n` +
    (nombre ? `Nombre: ${nombre}\n` : "") +
    (zona ? `Zona: ${zona}\n` : "") +
    (producto ? `Producto: ${producto}\n` : "") +
    (medidas ? `Medidas: ${medidas}\n` : "") +
    (mensaje ? `Mensaje: ${mensaje}\n` : "");

  gaEvent("quote_submit", { product: producto, zone: zona, measures: medidas });
  abrirWhatsApp(texto);
});

// ==================== CLICK PARA ABRIR GALERÍA (UN SOLO SISTEMA) ====================
document.addEventListener("click", (e) => {
  const btn = e.target.closest?.(".btn-galeria");
  const img = e.target.closest?.(".card img");
  const card = e.target.closest?.(".card");

  // Solo si fue click en botón, imagen o en la tarjeta
  if (!btn && !img && !card) return;

  // Si fue el botón, evitamos que se dispare doble
  if (btn) { e.preventDefault(); e.stopPropagation(); }

  const targetCard = btn ? btn.closest(".card") : card;
  if (!targetCard) return;

  const tipo = (targetCard.getAttribute("data-galeria") || "").trim();
  const tit = targetCard.getAttribute("data-titulo") || "Galería";

  console.log("Abrir galería:", tipo, tit);
  abrirGaleria(tipo, tit);
});
