document.addEventListener("DOMContentLoaded", async function() {    
    // Liens des images
    const baseUrl = "https://media.morenokevin.ch/"; //image originale
    const thumbBase = "https://thumb.morenokevin.ch/"; // version miniature

    // divers éléments
    const galerie = document.querySelector('.galerie');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-btn');
    const leftZone = document.getElementById('left-zone');
    const rightZone = document.getElementById('right-zone');
    const prevArrow = document.getElementById('prev');
    const nextArrow = document.getElementById('next');
    const counter = document.getElementById('counter');
    const fbLink = document.getElementById('share-facebook');
    const downloadLink = document.getElementById('download-image');
    const shareBtn = document.getElementById('share-btn');
    const shareLinks = document.getElementById('share-links');

    let currentIndex = 0;

    //Le code qui récupère les images étant liés au dossier dans "NOM_DOSSIER"
    try {
        const response = await fetch(baseUrl + "list?prefix=" + NOM_DOSSIER);
        if (!response.ok) throw new Error("Impossible de charger le JSON");
        const allImages = await response.json();

        allImages.forEach(src => {
            const img = document.createElement("img");

            img.src = `${thumbBase}${src}`;
            img.dataset.full = `${baseUrl}${src}`;

            galerie.appendChild(img);
        });
    } catch (err) {
        console.error("Erreur : Le dossier n'existe pas", err);
    }
    
    //Ajoute la fonction de click sur les images
    galerie.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            const imgs = Array.from(galerie.querySelectorAll('img'));
            const index = imgs.indexOf(e.target);
            openLightbox(index);
        }
    });
    
    //Ouvre la Lightbox qui affiche les images en grands
    function openLightbox(index) {
        const imgs = Array.from(galerie.querySelectorAll('img'));
        currentIndex = index;
        lightboxImg.src = imgs[currentIndex].dataset.full;
        updateCounter();
        updateShareLinks();
        lightbox.classList.add('open');
        shareLinks.style.display = 'none';
    }
    
    //Ferme la Lightbox
    closeBtn.addEventListener('click', () => lightbox.classList.remove('open'));

    //Change les images avec le click sur les flèches
    function changeImage(step) {
        const imgs = Array.from(galerie.querySelectorAll('img'));
        currentIndex += step;
        if (currentIndex < 0) currentIndex = imgs.length - 1;
        if (currentIndex >= imgs.length) currentIndex = 0;
        lightboxImg.src = imgs[currentIndex].dataset.full; 
        updateCounter();
        updateShareLinks();
    }

    //Ecoute le click
    leftZone.addEventListener('click', () => changeImage(-1));
    rightZone.addEventListener('click', () => changeImage(1));
    prevArrow.addEventListener('click', () => changeImage(-1));
    nextArrow.addEventListener('click', () => changeImage(1));

    //Compteur d'image
    function updateCounter() {
        const imgs = Array.from(galerie.querySelectorAll('img'));
        counter.textContent = `${currentIndex + 1} / ${imgs.length}`;
    }

    //partage d'image
    function updateShareLinks() {
        const pageUrl = encodeURIComponent(`${window.location.href}#image-${currentIndex}`);
        fbLink.href = `https://www.facebook.com/sharer.php?u=${pageUrl}`;
        downloadLink.onclick = async function(e) {
                e.preventDefault();
        
                const imageUrl = lightboxImg.src;
        
                try {
                    const response = await fetch(imageUrl);
        
                    if (!response.ok) {
                        throw new Error("Impossible de récupérer l'image");
                    }
        
                    const blob = await response.blob();
        
                    const blobUrl = URL.createObjectURL(blob);
        
                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = "image.jpg";
        
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
        
                    URL.revokeObjectURL(blobUrl);
        
                } catch (error) {
                    console.error("Erreur lors du téléchargement :", error);
        
                    // Fallback : ouverture de l'image
                    window.open(imageUrl, "_blank");
                }
            };
    }

    //Affiche les options de partage
    shareBtn.addEventListener('click', () => {
        shareLinks.style.display = shareLinks.style.display === 'block' ? 'none' : 'block';
    });
});