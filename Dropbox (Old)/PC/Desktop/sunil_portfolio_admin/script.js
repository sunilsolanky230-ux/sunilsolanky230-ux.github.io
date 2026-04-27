const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section[id]");

function getRevealElements() {
  return document.querySelectorAll(".reveal");
}

if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("show");
    document.body.classList.toggle("menu-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbar?.classList.remove("show");
    document.body.classList.remove("menu-open");
  });
});

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.9;
  getRevealElements().forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < triggerBottom) element.classList.add("visible");
  });
};

const setActiveNavLink = () => {
  let currentSection = "home";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${currentSection}`) link.classList.add("active");
  });
};

const handleScroll = () => {
  revealOnScroll();
  setActiveNavLink();
};

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

window.addEventListener("load", handleScroll);
window.addEventListener("resize", handleScroll);
window.addEventListener("portfolio:data-loaded", handleScroll);

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});
