  // Éléments
  const shareBtn = document.getElementById('share-btn');

  const fbLink = document.getElementById('share-facebook');
  const waLink = document.getElementById('share-whatsapp');

  const downloadLink = document.getElementById('download-image');
  const copyLink = document.getElementById('photo-link');


// Menu de partage
shareBtn.addEventListener('click', () => {
    shareLinks.style.display =
        shareLinks.style.display === 'block' ? 'none' : 'block';
});


// Téléchargement
downloadLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const index = currentIndex;
    const imageUrl = imgs[index].dataset.full;

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) throw new Error("Impossible de récupérer l'image");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const number = String(index + 1).padStart(4, '0');

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


// Copie du lien
copyLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const index = currentIndex;
    const imageUrl = imgs[index].dataset.full;
    const imageName = imageUrl.split('/').pop();

    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set("img", imageName);

    try {
        await navigator.clipboard.writeText(pageUrl.href);
    } catch (error) {
        console.error("Impossible de copier le lien", error);
    }
});


// Facebook
fbLink.addEventListener('click', () => {
    const pageUrl = encodeURIComponent(window.location.href);
    fbLink.href = `https://www.facebook.com/sharer.php?u=${pageUrl}`;
});


// WhatsApp
waLink.addEventListener('click', () => {
    const pageUrl = encodeURIComponent(window.location.href);
    waLink.href = `https://wa.me/?text=${pageUrl}`;
});
