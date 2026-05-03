const videoInput = document.querySelector("#videoInput");
const brandVideo = document.querySelector("#brandVideo");
const videoPlaceholder = document.querySelector("#videoPlaceholder");
const generalGallery = document.querySelector("#generalGallery");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxCounter = document.querySelector("#lightboxCounter");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxPrev = document.querySelector("#lightboxPrev");
const lightboxNext = document.querySelector("#lightboxNext");

const collections = window.LANDYCISS_COLLECTIONS || {};
const collectionOrder = [
  "new-drop",
  "apparel",
  "accessories",
  "performance-kit",
  "urban",
  "engineered",
  "campaign",
  "gemini-suite",
];

const galleryItems = collectionOrder.flatMap((slug) => {
  const collection = collections[slug];
  if (!collection) return [];
  return collection.pieces.map(([label, path]) => ({
    label,
    path,
    group: collection.kicker,
  }));
});

let activeIndex = 0;
let touchStartX = 0;

const makeGalleryCard = ({ label, path, group }, index) => {
  const button = document.createElement("button");
  button.className = "gallery-card";
  button.type = "button";
  button.addEventListener("click", () => openLightbox(index));

  const image = document.createElement("img");
  image.src = path;
  image.alt = `${label} - ${group}`;
  image.loading = index < 8 ? "eager" : "lazy";

  const caption = document.createElement("span");
  caption.innerHTML = `<strong>${label}</strong><small>${group}</small>`;

  button.append(image, caption);
  return button;
};

const renderGallery = () => {
  if (!generalGallery) return;
  generalGallery.replaceChildren(...galleryItems.map(makeGalleryCard));
};

const showImage = (index) => {
  activeIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeIndex];
  lightboxImage.src = item.path;
  lightboxImage.alt = `${item.label} - ${item.group}`;
  lightboxTitle.textContent = item.label;
  lightboxCounter.textContent = `${activeIndex + 1} / ${galleryItems.length}`;
};

const openLightbox = (index = 0) => {
  if (!galleryItems.length || !lightbox) return;
  showImage(index);
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
};

const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
};

const moveLightbox = (direction) => {
  showImage(activeIndex + direction);
};

lightbox?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

lightbox?.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 36) return;
  moveLightbox(delta > 0 ? -1 : 1);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

videoInput?.addEventListener("change", (event) => {
  const [file] = Array.from(event.target.files || []).filter((item) =>
    item.type.startsWith("video/")
  );

  if (!file) return;

  if (brandVideo.dataset.objectUrl) {
    URL.revokeObjectURL(brandVideo.dataset.objectUrl);
  }

  const objectUrl = URL.createObjectURL(file);
  brandVideo.dataset.objectUrl = objectUrl;
  brandVideo.src = objectUrl;
  brandVideo.load();
  videoPlaceholder.hidden = true;
});

renderGallery();
