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

  // layer-stack hero: the most recently toggled-on layer jumps to the
  // front of the stack, so it's never obscured by layers above its
  // "natural" resting position. Not how a real GIS TOC works (draw
  // order is usually fixed there), but far more useful in a demo
  // where the point is actually seeing what you just clicked.
  const stackOrder = ["buildings", "parcels", "huc12", "contours"];
  const baseZIndex = { buildings: 5, parcels: 4, huc12: 3, contours: 2 };
  const layerInputs = stackOrder
    .map((name) => document.querySelector(`.layer-chip input[data-layer="${name}"]`))
    .filter(Boolean);
  let recency = [];

  function renderStack() {
    stackOrder.forEach((name) => {
      const sheet = document.querySelector(`.layer-sheet[data-layer="${name}"]`);
      const input = layerInputs.find((i) => i.dataset.layer === name);
      if (!sheet || !input) return;
      const isChecked = input.checked;
      sheet.classList.toggle("active", isChecked);
      if (isChecked) {
        const idx = recency.indexOf(name);
        sheet.style.zIndex = String(50 - (idx === -1 ? recency.length : idx));
      } else {
        sheet.style.zIndex = String(baseZIndex[name] || 1);
      }
    });
  }

  if (layerInputs.length) {
    layerInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const name = input.dataset.layer;
        recency = recency.filter((n) => n !== name);
        if (input.checked) recency.unshift(name);
        renderStack();
      });
    });
    renderStack();
  }

  // scroll-reveal: fade + lift content into place as it enters the
  // viewport. Respects prefers-reduced-motion via the CSS itself
  // (transition durations are zeroed there), so no JS branch needed.
  const revealTargets = document.querySelectorAll(
    ".section-head, .card, .service-row, .stat-row, .contact-details, .contact-form, .about-grid > div, .page-hero > *"
  );
  if (revealTargets.length && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }

  // hero layer-stack: subtle tilt toward the cursor, like physical
  // map sheets on a table. Desktop pointer only; skipped entirely
  // for touch/reduced-motion so it never fights a finger scroll.
  const stackStage = document.querySelector(".stack-stage");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (stackStage && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion) {
    stackStage.style.perspective = "1000px";
    const sheets = stackStage.querySelectorAll(".layer-sheet");
    stackStage.addEventListener("mousemove", (e) => {
      const rect = stackStage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      sheets.forEach((sheet) => {
        sheet.style.setProperty("--tilt-x", `${(-py * 6).toFixed(2)}deg`);
        sheet.style.setProperty("--tilt-y", `${(px * 6).toFixed(2)}deg`);
      });
    });
    stackStage.addEventListener("mouseleave", () => {
      sheets.forEach((sheet) => {
        sheet.style.setProperty("--tilt-x", "0deg");
        sheet.style.setProperty("--tilt-y", "0deg");
      });
    });
  }
});
