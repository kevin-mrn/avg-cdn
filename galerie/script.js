const search = document.getElementById("galerie-search");
const resultats = document.getElementById("galerie-resultats");

let imgs = [];
let currentIndex = 0;
let visibleImgs = [];

(async function () {

    // Liens des images
    const baseUrl = "https://media.morenokevin.ch/"; //image originale
    const thumbBase = "https://thumb.morenokevin.ch/"; // version miniature

    // la galerie
    const galerie = document.querySelector('.galerie');

    await getImages(baseUrl, galerie);
    await initSearch();

    addClick(galerie);
    openSharedImage();


    //Le code qui récupère les images étant liés au dossier dans "NOM_DOSSIER"
    async function getImages(url, galerie) {
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
            visibleImgs = imgs.filter(image => image.style.display !== "none");
            const index = visibleImgs.indexOf(img);
            openLightbox(index);
        });
    }

function addClick(galerie) {

    galerie.addEventListener("click", e => {

        const img = e.target.closest("img");

        if (!img || img.style.display === "none") return;

        visibleImgs = imgs.filter(image => image.style.display !== "none");

        currentIndex = visibleImgs.indexOf(img);

        openLightbox(currentIndex);

    });

}

    //Ouvre la lightbox en cas d'image partagé
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



async function initSearch() {

    const search = document.getElementById("galerie-recherche");
    const outils = document.querySelector(".galerie-outils");
    const resultats = document.getElementById("galerie-resultats");

    try {
        const response = await fetch("./filtre.json");

        if (!response.ok) {
            throw new Error("Impossible de charger filtre.json");
        }

        const filtres = await response.json();
        outils.style.display = "flex";

        imgs.forEach(img => {

            const imageName = img.dataset.full
                .split("/")
                .pop()
                .replace(/\.[^.]+$/, "");

            img.dataset.tags = JSON.stringify(
                filtres[imageName] || []
            );

        });

        const categories = [
            "cadets a",
            "cadets b",
            "cadettes a",
            "cadettes b",
            "ecoliers a",
            "ecoliers b",
            "parent-enfants garcons",
            "parent-enfants filles"
        ];

        // Recherche
        search.addEventListener("input", () => {

            const recherche = search.value
                .toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/parents?\s*[- ]?\s*enfants?/g, "parent-enfants");

            let recherchePreparee = recherche;
            const categoriesTrouvees = [];

            // Reconnaître les catégories complètes
            categories.forEach(categorie => {

                const regex = new RegExp(`\\b${categorie}\\b`, "g");

                if (regex.test(recherchePreparee)) {
                    categoriesTrouvees.push(categorie);
                    recherchePreparee = recherchePreparee.replace(regex, " ");
                }

            });

            const termes = [
                ...categoriesTrouvees,
                ...recherchePreparee.split(/\s+/).filter(Boolean)
            ];

            let nombreTrouvees = 0;

            imgs.forEach(img => {

                const tags = JSON.parse(img.dataset.tags).map(tag =>
                    String(tag)
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/parents?\s*[- ]?\s*enfants?/g, "parent-enfants")
                );

                const correspond = termes.every(terme => {

                    if (/^\d+$/.test(terme)) {
                        return tags.includes(terme);
                    }

                    if (categories.includes(terme)) {
                        return tags.includes(terme);
                    }

                    return tags.some(tag => tag.includes(terme));

                });

                img.style.display = correspond ? "" : "none";

                if (correspond) {
                    nombreTrouvees++;
                }

            });

            if (termes.length === 0) {
                resultats.textContent = "";
            } else {
                resultats.textContent =
                    `${nombreTrouvees} photo${nombreTrouvees > 1 ? "s" : ""} trouvée${nombreTrouvees > 1 ? "s" : ""}`;
            }

        });

    } catch (error) {
        console.error("Erreur lors du chargement des filtres :", error);
    }
}


})();



