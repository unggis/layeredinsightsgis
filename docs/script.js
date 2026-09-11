document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const expanded = navLinks.classList.contains("open");
      navToggle.setAttribute("aria-expanded", String(expanded));
    });
  }

  // layer-stack hero: checking a layer reveals it and clears away
  // any unchecked layers sitting above it, so you can see through
  // to the one you picked. Order is top-of-stack to bottom.
  const stackOrder = ["buildings", "parcels", "hydro", "contours"];
  const layerInputs = stackOrder
    .map((name) => document.querySelector(`.layer-chip input[data-layer="${name}"]`))
    .filter(Boolean);

  function updateStack() {
    const checked = {};
    layerInputs.forEach((input) => {
      checked[input.dataset.layer] = input.checked;
    });

    stackOrder.forEach((name, i) => {
      const sheet = document.querySelector(`.layer-sheet[data-layer="${name}"]`);
      if (!sheet) return;
      const isChecked = !!checked[name];
      const somethingDeeperChecked = stackOrder.slice(i + 1).some((n) => checked[n]);
      sheet.classList.toggle("active", isChecked);
      sheet.classList.toggle("depth-hidden", somethingDeeperChecked && !isChecked);
    });
  }

  if (layerInputs.length) {
    layerInputs.forEach((input) => input.addEventListener("change", updateStack));
    updateStack();
  }
});
