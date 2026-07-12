(function () {
  "use strict";

  /* ── Edit these before sharing ── */
  var SITE = {
    name: "Jacob",
    linkedin: "https://www.linkedin.com/in/jacob-barrera-515683152",
    email: "hello@example.com",
    github: "https://github.com/jacobbarrera2024-sketch"
  };

  function applySiteConfig() {
    var linkedin = document.getElementById("linkedinLink");
    var email = document.getElementById("emailLink");
    var githubLinks = document.querySelectorAll("[data-github]");
    if (linkedin) linkedin.href = SITE.linkedin;
    if (email) {
      email.href = "mailto:" + SITE.email + "?subject=Project%20inquiry";
      email.textContent = "Email";
    }
    githubLinks.forEach(function (el) { el.href = SITE.github; });
  }

  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  function setMenuOpen(open) {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      setMenuOpen(!navLinks.classList.contains("open"));
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenuOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenuOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && e.target !== menuBtn) setMenuOpen(false);
    });
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
    var activeMap = {};
    navAnchors.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (id) activeMap[id] = a;
    });

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navAnchors.forEach(function (a) { a.classList.remove("active"); });
          if (activeMap[id]) activeMap[id].classList.add("active");
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { if (s.id) sectionObserver.observe(s); });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  applySiteConfig();
})();
