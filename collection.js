const params = new URLSearchParams(window.location.search);
const slug = params.get("set") || "new-drop";
const collections = window.LANDYCISS_COLLECTIONS || {};
const collection = collections[slug] || collections["new-drop"];

const title = document.querySelector("#collectionTitle");
const kicker = document.querySelector("#collectionKicker");
const description = document.querySelector("#collectionDescription");
const count = document.querySelector("#collectionCount");
const boardImage = document.querySelector("#collectionBoardImage");
const piecesGrid = document.querySelector("#piecesGrid");
const openFirstPiece = document.querySelector("#openFirstPiece");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxCounter = document.querySelector("#lightboxCounter");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxPrev = document.querySelector("#lightboxPrev");
const lightboxNext = document.querySelector("#lightboxNext");

let activeIndex = 0;

const updateMeta = () => {
  document.title = `LANDYCISS | ${collection.title}`;
  title.textContent = collection.title;
  kicker.textContent = collection.kicker;
  description.textContent = collection.description;
  count.textContent = `${collection.pieces.length} piezas`;
  boardImage.src = collection.board;
  boardImage.alt = `${collection.title} lamina completa`;
};

const renderPieces = () => {
  piecesGrid.replaceChildren(
    ...collection.pieces.map(([label, path], index) => {
      const button = document.createElement("button");
      button.className = "piece-card piece-button";
      button.type = "button";
      button.addEventListener("click", () => openLightbox(index));

      const image = document.createElement("img");
      image.src = path;
      image.alt = label;
      image.loading = index < 4 ? "eager" : "lazy";

      const caption = document.createElement("span");
      caption.textContent = label;

      button.append(image, caption);
      return button;
    })
  );
};

const showImage = (index) => {
  activeIndex = (index + collection.pieces.length) % collection.pieces.length;
  const [label, path] = collection.pieces[activeIndex];
  lightboxImage.src = path;
  lightboxImage.alt = label;
  lightboxTitle.textContent = label;
  lightboxCounter.textContent = `${activeIndex + 1} / ${collection.pieces.length}`;
};

const openLightbox = (index = 0) => {
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

let touchStartX = 0;

lightbox?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

lightbox?.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 36) return;
  moveLightbox(delta > 0 ? -1 : 1);
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));
openFirstPiece?.addEventListener("click", () => openLightbox(0));

updateMeta();
renderPieces();
