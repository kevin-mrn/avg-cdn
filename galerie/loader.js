(async () => {

  const SrcGalerie = "https://cdn.jsdelivr.net/gh/kevin-mrn/avg-cdn@main/galerie/";

  try {
    // Chargement des différentes ressources
    await loadCSS("style.css", SrcGalerie);
    await loadCSS("lightbox.css", SrcGalerie);
    await loadHTML("index.html", SrcGalerie);
    await loadJS("script.js", SrcGalerie);

    } catch (error) {
        console.error("[AVG]", error);
    }
})();

//La fonction HTML
async function loadHTML(filename, src) {
    //vérifie qu'un conteneur existe
    const container = document.querySelector("#conteneur-galerie");
    if (!container) {
        throw new Error("Pas de conteneur de galerie");
    }
    //récupère le html
    const response = await fetch(src + filename);

    if (!response.ok) {
        throw new Error("Erreur HTML : " + response.status);
    }
    const html = await response.text();
    container.innerHTML = html;
}

//La fonction CSS
function loadCSS(filename, src) {
  return new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = src + filename;
    css.onload = resolve;
    css.onerror = () => reject(new Error("CSS introuvable : " + filename));
    document.head.appendChild(css);
  });
}

//La fonction JS
function loadJS(filename, src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = src + filename;
    script.onload = resolve;
    script.onerror = () => reject(new Error("JS introuvable : " + filename));

    document.body.appendChild(script);
  });
}