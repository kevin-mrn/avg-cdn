//La lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');
//Bouton partage
const shareLinks = document.getElementById('share-links');

//gauche
const prevArrow = document.getElementById('prev');
const leftZone = document.getElementById('left-zone');
//droite
const rightZone = document.getElementById('right-zone');
const nextArrow = document.getElementById('next');
//compteur
const counter = document.getElementById('counter');

/* SECTION EVENT LISTENER */

//Rajoute l'event pour le changement d'image
leftZone.addEventListener('click', () => changeImage(-1));
rightZone.addEventListener('click', () => changeImage(1));
prevArrow.addEventListener('click', () => changeImage(-1));
nextArrow.addEventListener('click', () => changeImage(1));
//Event Listener de closeButton
closeBtn.addEventListener('click', closeLightbox);
//Event Listener de la lightbox
lightbox.addEventListener('click', (e) => {
    // Ne rien faire si on clique sur l'image ou sur un élément interactif
    if (
        e.target === lightboxImg ||
        e.target.closest('#right-menu') ||
        e.target.closest('.click-zone') ||
        e.target.closest('.arrow')
    ) {
        return;
    }
    closeLightbox();
});

//Ouvre la Lightbox
function openLightbox(index) {
    currentIndex = index;

    lightboxImg.src = visibleImgs[currentIndex].dataset.full;

    updateCounter();
    lightbox.classList.add('open');
    shareLinks.style.display = 'none';
}

//Ferme la Lightbox
function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = "";
    currentIndex = 0;

    const url = new URL(window.location.href);
    url.searchParams.delete("img");

    history.replaceState({}, "", url);
}

//Change les images
function changeImage(step) {
    currentIndex += step;

    if (currentIndex < 0) currentIndex = visibleImgs.length - 1;
    if (currentIndex >= visibleImgs.length) currentIndex = 0;

    lightboxImg.src = visibleImgs[currentIndex].dataset.full; 
    updateCounter();
}

//Compteur d'image
function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${visibleImgs.length}`;

    const imageName = visibleImgs[currentIndex].dataset.full.split('/').pop();

    const url = new URL(window.location.href);
    url.searchParams.set("img", imageName);

    history.replaceState({}, "", url);
}
