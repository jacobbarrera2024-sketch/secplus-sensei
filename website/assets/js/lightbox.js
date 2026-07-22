// Click-to-enlarge for lab screenshots. Click any step/screenshot image to view it
// full-size; click the overlay, press Escape, or click the close button to dismiss.
(function () {
  function initLightbox() {
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-hidden", "true");

    var img = document.createElement("img");
    img.alt = "";
    overlay.appendChild(img);

    var closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.type = "button";
    closeBtn.textContent = "Close ✕";
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function open(src, alt) {
      img.src = src;
      img.alt = alt || "";
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === img) return;
      close();
    });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    var targets = document.querySelectorAll(".step-figure img, .screenshot-figure img");
    targets.forEach(function (el) {
      el.addEventListener("click", function () {
        open(el.getAttribute("src"), el.getAttribute("alt"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();
