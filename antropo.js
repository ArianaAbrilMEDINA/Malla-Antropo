document.addEventListener("DOMContentLoaded", function () {
  // Toggle solo para CBC
  const toggleCBC = document.getElementById("toggleCBC");
  const cbcContainer = document.getElementById("cbcContainer");

  toggleCBC.addEventListener("click", () => {
    const estiloActual = window.getComputedStyle(cbcContainer).display;
    cbcContainer.style.display = estiloActual === "none" ? "block" : "none";
  });

  // Funcionalidad de materias (tachado, progreso, desbloqueo)
  const allButtons = document.querySelectorAll(".btn-materia, .btn-materia-lic");

  function actualizarDesbloqueos() {
    allButtons.forEach(button => {
      const dependsOn = button.dataset.dependsOn;
      if (dependsOn) {
        const deps = dependsOn.split(",").map(dep => dep.trim());
        const allApproved = deps.every(depId => localStorage.getItem(depId) === "tachado");
        button.disabled = !allApproved;
        button.classList.toggle("disabled", !allApproved);
        button.style.opacity = allApproved ? "1" : "0.5";
      }
    });
  }

function actualizarProgreso() {
  // Filtrar solo materias que NO sean idiomas
  const botonesNoIdioma = Array.from(allButtons).filter(btn => {
    const id = btn.dataset.id;
    return id && !id.startsWith("180");
  });

  const total = botonesNoIdioma.length;
  const completadas = botonesNoIdioma.filter(btn => btn.classList.contains("tachado")).length;
  const porcentaje = Math.round((completadas / total) * 100);

  const barra = document.getElementById("progresoInterno");
  barra.style.width = `${porcentaje}%`;
  barra.textContent = `${porcentaje}%`;
}


  allButtons.forEach(button => {
    const id = button.dataset.id;
    if (!id) return;

    if (localStorage.getItem(id) === "tachado") {
      button.classList.add("tachado");
    }

    button.addEventListener("click", function () {
      if (button.disabled) return;

      button.classList.toggle("tachado");
      const isTachado = button.classList.contains("tachado");

      if (isTachado) {
        localStorage.setItem(id, "tachado");
      } else {
        localStorage.removeItem(id);
      }

      actualizarDesbloqueos();
      actualizarProgreso();
    });
  });

  actualizarDesbloqueos();
  actualizarProgreso();
});
