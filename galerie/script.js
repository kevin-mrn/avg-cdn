(async function() {

    // Liens des images
    const baseUrl = "https://media.morenokevin.ch/"; //image originale
    const thumbBase = "https://thumb.morenokevin.ch/"; // version miniature

    // divers éléments
    const galerie = document.querySelector('.galerie');
    const lightbox = document.getElementById('lightbox');
    const search = document.getElementById("galerie-search");

    //La lightbox
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-btn');
    //Bouton partage
    const shareBtn = document.getElementById('share-btn');
    const shareLinks = document.getElementById('share-links');
    //Les liens
    const fbLink = document.getElementById('share-facebook');
    const downloadLink = document.getElementById('download-image');
    const copyLink = document.getElementById("photo-link");

    //gauche
    const prevArrow = document.getElementById('prev');
    const leftZone = document.getElementById('left-zone');
    //droite
    const rightZone = document.getElementById('right-zone');
    const nextArrow = document.getElementById('next');
    //compteur
    const counter = document.getElementById('counter');
    
    let imgs = [];
    let currentIndex = 0;



    await getImages(baseUrl, galerie);
    addClick(galerie);
    openSharedImage();
    updateMetaTags();


async function getImages(url, galerie) {
//Le code qui récupère les images étant liés au dossier dans "NOM_DOSSIER"
    try {
        const response = await fetch(url + "list?prefix=" + NOM_DOSSIER);
        if (!response.ok) throw new Error("Impossible de charger le JSON");
        const allImages = await response.json();

        allImages.forEach(src => {
            const img = document.createElement("img");

            img.src = `${thumbBase}${src}`;
            img.dataset.full = `${baseUrl}${src}`;

            galerie.appendChild(img);
        });

        imgs = Array.from(galerie.querySelectorAll("img"));

    } catch (err) {
        console.error("Erreur : Le dossier n'existe pas", err);
    }

}

//Rajoute le click sur les photos
function addClick() {
  //Ajoute la fonction de click sur les images
  galerie.addEventListener('click', (e) => {
  const img = e.target.closest("img");
  if (!img || !galerie.contains(img)) return;

  const index = imgs.indexOf(img);
  openLightbox(index);
  });
}

/* SECTION LIGHTBOX */

//Ouvre la Lightbox qui affiche les images en grands
function openLightbox(index) {
    currentIndex = index;

    lightboxImg.src = imgs[currentIndex].dataset.full;

    updateCounter();
    lightbox.classList.add('open');
    shareLinks.style.display = 'none';
}
    
//Ferme la Lightbox
closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('open');
  lightboxImg.src = "";
  currentIndex = 0;

  const url = new URL(window.location.href);
  url.searchParams.delete("img");

  history.replaceState({}, "", url);
})

/* SECTION CHANGEMENT D'IMAGE */

//Change les images
function changeImage(step) {
    currentIndex += step;

    if (currentIndex < 0) currentIndex = imgs.length - 1;
    if (currentIndex >= imgs.length) currentIndex = 0;

    lightboxImg.src = imgs[currentIndex].dataset.full; 
    updateCounter();
}

//Rajoute l'event pour le changement d'image
leftZone.addEventListener('click', () => changeImage(-1));
rightZone.addEventListener('click', () => changeImage(1));
prevArrow.addEventListener('click', () => changeImage(-1));
nextArrow.addEventListener('click', () => changeImage(1));

//Compteur d'image
function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${imgs.length}`;

    const imageName = imgs[currentIndex].dataset.full.split('/').pop();

    const url = new URL(window.location.href);
    url.searchParams.set("img", imageName);

    history.replaceState({}, "", url);
}


function openSharedImage() {
    const params = new URLSearchParams(window.location.search);
    const imageName = params.get("img");

    if (!imageName) return;

    const index = imgs.findIndex(img => {
        return img.dataset.full.split('/').pop() === imageName;
    });

    if (index !== -1) {
        openLightbox(index);
    }
}



downloadLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const imageUrl = imgs[currentIndex].dataset.full;

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) throw new Error("Impossible de récupérer l'image");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const number = String(currentIndex + 1).padStart(4, '0');

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${NOM_PHOTO}_${number}.jpg`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    } catch (error) {
        console.error("Erreur lors du téléchargement :", error);
        window.open(imageUrl, "_blank");
    }
});


copyLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const imageUrl = imgs[currentIndex].dataset.full;
    const imageName = imageUrl.split('/').pop();

    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set("img", imageName);

    try {
        await navigator.clipboard.writeText(pageUrl.href);
    } catch (error) {
        console.error("Impossible de copier le lien :", error);
    }
});

fbLink.addEventListener('click', (e) => {
        const pageUrl = encodeURIComponent(`${window.location.href}`);
        fbLink.href = `https://www.facebook.com/sharer.php?u=${pageUrl}`;
});


function updateMetaTags() {
    const titre = document.querySelector("h1.post_title.entry-title");

    if (titre) {
        titre.textContent = "TEST DE PARTAGE";
    }
}


  //Affiche les options de partage
  shareBtn.addEventListener('click', () => {
      shareLinks.style.display = shareLinks.style.display === 'block' ? 'none' : 'block';
  });


})();