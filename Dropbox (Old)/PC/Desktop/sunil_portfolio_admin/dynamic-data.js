import { db, firebaseConfigured } from "./firebase-config.js";
import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const projectsGrid = document.getElementById("projectsGrid");
const educationTimeline = document.getElementById("educationTimeline");
const projectsSourceNote = document.getElementById("projectsSourceNote");
const educationSourceNote = document.getElementById("educationSourceNote");

function cleanUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text || "";
  return element;
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function createProjectCard(project, index) {
  const article = document.createElement("article");
  article.className = "project-card reveal glass-card";

  const top = document.createElement("div");
  top.className = "project-top";

  const headingWrap = document.createElement("div");
  headingWrap.appendChild(createTextElement("p", "project-number", String(index + 1).padStart(2, "0")));
  headingWrap.appendChild(createTextElement("h3", "", project.title || "Untitled Project"));

  top.appendChild(headingWrap);

  const link = cleanUrl(project.link);
  if (link) {
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.setAttribute("aria-label", "Open project");
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-arrow-up-right-from-square";
    anchor.appendChild(icon);
    top.appendChild(anchor);
  }

  article.appendChild(top);
  article.appendChild(createTextElement("p", "", project.description || "Project details will appear here."));

  const tagWrap = document.createElement("div");
  tagWrap.className = "project-tags";
  splitTags(project.tech).forEach((tag) => tagWrap.appendChild(createTextElement("span", "", tag)));
  article.appendChild(tagWrap);

  return article;
}

function createEducationCard(item) {
  const article = document.createElement("article");
  article.className = "timeline-item reveal glass-card";

  const dot = document.createElement("span");
  dot.className = "timeline-dot";
  article.appendChild(dot);

  const title = item.year ? `${item.title || "Education"} (${item.year})` : (item.title || "Education");
  article.appendChild(createTextElement("h3", "", title));
  article.appendChild(createTextElement("p", "", item.description || "Education description will appear here."));

  return article;
}

async function loadProjects() {
  if (!firebaseConfigured || !db || !projectsGrid) return;

  try {
    const q = query(collection(db, "projects"), orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    projectsGrid.innerHTML = "";
    const projects = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    projects.forEach((project, index) => projectsGrid.appendChild(createProjectCard(project, index)));
    projectsGrid.dataset.count = String(projects.length);
    if (projectsSourceNote) projectsSourceNote.textContent = "Live projects loaded from your admin dashboard.";
  } catch (error) {
    console.warn("Projects could not be loaded from Firebase:", error);
  }
}

async function loadEducation() {
  if (!firebaseConfigured || !db || !educationTimeline) return;

  try {
    const q = query(collection(db, "education"), orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    educationTimeline.innerHTML = "";
    snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .forEach((item) => educationTimeline.appendChild(createEducationCard(item)));

    if (educationSourceNote) educationSourceNote.textContent = "Live education details loaded from your admin dashboard.";
  } catch (error) {
    console.warn("Education could not be loaded from Firebase:", error);
  }
}

await Promise.all([loadProjects(), loadEducation()]);
window.dispatchEvent(new CustomEvent("portfolio:data-loaded"));
