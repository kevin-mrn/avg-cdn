(async () => {
    const BASE = "https://cdn.jsdelivr.net/gh/kevin-mrn/avg-cdn@main/galerie/";

    try {
        const container = document.querySelector("#conteneur-galerie");
        if (!container) {
            throw new Error("Conteneur de galerie introuvable");
        }

        await new Promise((resolve, reject) => {
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = BASE + "style.css";
            css.onload = resolve;
            css.onerror = () => reject(new Error("Erreur CSS"));
            document.head.appendChild(css);
        });

        const response = await fetch(BASE + "index.html");
        if (!response.ok) {
            throw new Error(`Erreur HTML : ${response.status}`);
        }
        const html = await response.text();
        container.innerHTML = html;

        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = BASE + "script.js";
            script.onload = resolve;
            script.onerror = () => reject(new Error("Erreur JS"));

            document.body.appendChild(script);
        });

    } catch (error) {
        console.error("[AVG Galerie]", error);

        const container = document.querySelector("#conteneur-galerie");

        if (container) {
            container.innerHTML =
                "<p>Impossible de charger la galerie. Veuillez actualiser la page.</p>";
        }
    }
})();