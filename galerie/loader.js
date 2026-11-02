(async () => {
    const BASE = "https://cdn.jsdelivr.net/gh/kevin-mrn/avg-cdn@main/galerie/";

    const response = await fetch(BASE + "index.html");
    const html = await response.text();

    document.querySelector("#conteneur-galerie").innerHTML = html;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = BASE + "style.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = BASE + "script.js";
    script.onload = () => {
        // Le HTML est chargé, le script peut fonctionner.
    };
    document.body.appendChild(script);
})();