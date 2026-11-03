(function () {
    const BASE = "https://cdn.jsdelivr.net/gh/kevin-mrn/avg-cdn@main/galerie/";

    const container = document.querySelector("#conteneur-galerie");

    if (!container) {
        console.error("[AVG Galerie] Conteneur introuvable");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", BASE + "index.html", true);
    xhr.onload = function () {
        if (xhr.status !== 200) {
            displayError("Erreur lors du chargement de la page.");
            return;
        }
        container.innerHTML = xhr.responseText;

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = BASE + "style.css";
        css.onload = function () {
            loadScript();
        };
        css.onerror = function () {
            displayError("Erreur lors du chargement de l'affichage.");
        };
        document.head.appendChild(css);
    };

    xhr.onerror = function () {
        displayError("Erreur réseau.");
    };
    xhr.send();


    // Chargement du JavaScript
    function loadScript() {
        const script = document.createElement("script");

        script.src = BASE + "script.js";

        script.onerror = function () {
            displayError("Impossible de charger le Javascript.");
        };

        document.body.appendChild(script);
    }

    function displayError(message) {
        console.error("[AVG Galerie]", message);
        container.innerHTML = `<p>${message}</p>`;
    }

})();