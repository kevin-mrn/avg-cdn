(async () => {
  const BASE = "https://cdn.jsdelivr.net/gh/kevin-mrn/avg-cdn@main/galerie/";

  const container = document.querySelector("#conteneur-galerie");

  if (!container) {
      console.error("[AVG Galerie] Conteneur introuvable");
      return;
  }
  //Le CSS
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

  //Le HTML
  const response = await fetch(BASE + "index.html");
  if (!response.ok) {
    throw new Error(`Erreur HTML : ${response.status}`);
  }
  const html = await response.text();
  container.innerHTML = html;


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