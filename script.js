const EVENT_CONFIG = {
  eventDateISO: "2026-05-07T13:00:00+03:00",
};

const eventDate = new Date(EVENT_CONFIG.eventDateISO);
const countdownIds = ["days", "hours", "minutes", "seconds"];

function updateCountdown() {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (Number.isNaN(eventDate.getTime())) {
    countdownIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "--";
    });
    return;
  }

  if (diff <= 0) {
    countdownIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "00";
    });
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const values = [days, hours, minutes, seconds];
  countdownIds.forEach((id, index) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = values[index].toString().padStart(2, "0");
  });
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".fade-in, .reveal, .reveal-left, .reveal-right, .reveal-scale");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupActiveSectionHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const onIntersect = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);
      });
    });
  };

  const sectionObserver = new IntersectionObserver(onIntersect, {
    rootMargin: "-40% 0px -45% 0px",
    threshold: 0.01,
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

function setupMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const navList = document.getElementById("primary-navigation");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuButton || !navList) return;

  menuButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Închide meniul" : "Deschide meniul");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Deschide meniul");
    });
  });
}

function setupHeroParallax() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const hero = document.querySelector(".hero");
  const parallaxItems = document.querySelectorAll(".parallax-item");
  if (!hero || parallaxItems.length === 0) return;

  let pointerX = 0;
  let pointerY = 0;
  let scrollOffset = 0;

  const applyParallax = () => {
    parallaxItems.forEach((item) => {
      const depth = Number(item.getAttribute("data-parallax-depth") || 10);
      const x = pointerX * (depth / 120);
      const y = pointerY * (depth / 120) + scrollOffset * (depth / 220);
      item.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    });
  };

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX = relativeX * 14;
    pointerY = relativeY * 10;
    applyParallax();
  });

  hero.addEventListener("mouseleave", () => {
    pointerX = 0;
    pointerY = 0;
    applyParallax();
  });

  window.addEventListener(
    "scroll",
    () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, rect.top / window.innerHeight));
      scrollOffset = progress * -7;
      applyParallax();
    },
    { passive: true }
  );
}

function init() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setupScrollReveal();
  setupActiveSectionHighlight();
  setupMobileMenu();
  setupHeroParallax();
}

document.addEventListener("DOMContentLoaded", init);
