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

  // layer-stack hero: checkboxes toggle the corresponding sheet
  document.querySelectorAll(".layer-chip input").forEach((input) => {
    const layerName = input.dataset.layer;
    const sheet = document.querySelector(
      `.layer-sheet[data-layer="${layerName}"]`
    );
    const sync = () => {
      if (!sheet) return;
      sheet.classList.toggle("active", input.checked);
    };
    input.addEventListener("change", sync);
    sync();
  });
});
