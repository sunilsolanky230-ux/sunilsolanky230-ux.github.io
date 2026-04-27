import { auth, db, firebaseConfigured, ADMIN_EMAIL } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const setupWarning = document.getElementById("setupWarning");
const loginPanel = document.getElementById("loginPanel");
const dashboard = document.getElementById("dashboard");
const loginMessage = document.getElementById("loginMessage");
const seedMessage = document.getElementById("seedMessage");

const defaultProjects = [
  {
    title: "Cipher Panel Web Application",
    description: "A Python and Flask-based web application featuring encryption and decryption logic, authentication functionality, and an interactive interface focused on secure and practical implementation.",
    tech: "Python, Flask, Authentication, Encryption Logic",
    link: "https://github.com/sunilsolanky230-ux/CIPHER-PANEL-WEB-APPLICATION",
    displayOrder: 1
  },
  {
    title: "Student Productivity Hub Ultimate",
    description: "A web-based productivity platform designed to help users organize tasks and daily activities through an interactive interface, responsive design, and smooth user experience.",
    tech: "JavaScript, HTML, CSS, Responsive UI",
    link: "https://github.com/sunilsolanky230-ux/student-productivity-hub-ultimate",
    displayOrder: 2
  }
];

const defaultEducation = [
  {
    title: "BCA — Osmania University",
    year: "2026",
    description: "Pursuing undergraduate studies while building strong foundations in programming, software development, and AI-focused career growth.",
    displayOrder: 1
  },
  {
    title: "12th — Sri Lepakshi Junior College",
    year: "88.4%",
    description: "Completed higher secondary education with strong academic performance and a growing interest in the technology field.",
    displayOrder: 2
  },
  {
    title: "10th — Sai Chaitanya Model School",
    year: "CGPA: 10.0",
    description: "Built a strong academic base with disciplined learning and consistent performance from the early stage of education.",
    displayOrder: 3
  }
];

function show(element) { element?.classList.remove("hidden"); }
function hide(element) { element?.classList.add("hidden"); }
function value(id) { return document.getElementById(id)?.value.trim() || ""; }
function setValue(id, data) { const el = document.getElementById(id); if (el) el.value = data ?? ""; }
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

function resetProjectForm() {
  setValue("projectId", "");
  setValue("projectTitle", "");
  setValue("projectDescription", "");
  setValue("projectTech", "");
  setValue("projectLink", "");
  setValue("projectOrder", "");
  setText("projectFormTitle", "Add Project");
  setText("projectSubmitBtn", "Save Project");
  hide(document.getElementById("cancelProjectEdit"));
}

function resetEducationForm() {
  setValue("educationId", "");
  setValue("educationTitle", "");
  setValue("educationYear", "");
  setValue("educationDescription", "");
  setValue("educationOrder", "");
  setText("educationFormTitle", "Add Education");
  setText("educationSubmitBtn", "Save Education");
  hide(document.getElementById("cancelEducationEdit"));
}

function createRecordCard(type, item) {
  const card = document.createElement("article");
  card.className = "record-card";

  const h3 = document.createElement("h3");
  h3.textContent = item.title || "Untitled";
  card.appendChild(h3);

  const p = document.createElement("p");
  p.textContent = item.description || "No description.";
  card.appendChild(p);

  const meta = document.createElement("div");
  meta.className = "record-meta";
  meta.textContent = type === "projects"
    ? `${item.tech || "No tech tags"} • Order: ${item.displayOrder || "not set"}`
    : `${item.year || "No year"} • Order: ${item.displayOrder || "not set"}`;
  card.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "record-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => type === "projects" ? editProject(item) : editEducation(item));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteRecord(type, item.id));

  actions.append(editBtn, deleteBtn);
  card.appendChild(actions);
  return card;
}

async function getOrderedDocs(collectionName) {
  const q = query(collection(db, collectionName), orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

async function loadProjects() {
  const list = document.getElementById("projectList");
  if (!list) return;
  list.innerHTML = "";

  const projects = await getOrderedDocs("projects");
  setText("projectCount", String(projects.length));

  if (!projects.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No projects yet. Add one or use Seed Default Data.";
    list.appendChild(empty);
    return;
  }

  projects.forEach((item) => list.appendChild(createRecordCard("projects", item)));
}

async function loadEducation() {
  const list = document.getElementById("educationList");
  if (!list) return;
  list.innerHTML = "";

  const education = await getOrderedDocs("education");
  setText("educationCount", String(education.length));

  if (!education.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No education records yet. Add one or use Seed Default Data.";
    list.appendChild(empty);
    return;
  }

  education.forEach((item) => list.appendChild(createRecordCard("education", item)));
}

async function refreshData() {
  await Promise.all([loadProjects(), loadEducation()]);
}

function editProject(item) {
  setValue("projectId", item.id);
  setValue("projectTitle", item.title);
  setValue("projectDescription", item.description);
  setValue("projectTech", item.tech);
  setValue("projectLink", item.link);
  setValue("projectOrder", item.displayOrder || "");
  setText("projectFormTitle", "Edit Project");
  setText("projectSubmitBtn", "Update Project");
  show(document.getElementById("cancelProjectEdit"));
  document.getElementById("projectForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function editEducation(item) {
  setValue("educationId", item.id);
  setValue("educationTitle", item.title);
  setValue("educationYear", item.year);
  setValue("educationDescription", item.description);
  setValue("educationOrder", item.displayOrder || "");
  setText("educationFormTitle", "Edit Education");
  setText("educationSubmitBtn", "Update Education");
  show(document.getElementById("cancelEducationEdit"));
  document.getElementById("educationForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function deleteRecord(type, id) {
  if (!id) return;
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  await deleteDoc(doc(db, type, id));
  await refreshData();
}

async function seedDefaultData() {
  seedMessage.textContent = "";
  const projectDocs = await getDocs(collection(db, "projects"));
  const educationDocs = await getDocs(collection(db, "education"));

  if (!projectDocs.empty || !educationDocs.empty) {
    const confirmSeed = confirm("Some data already exists. Seed default data anyway?");
    if (!confirmSeed) return;
  }

  for (const project of defaultProjects) {
    await addDoc(collection(db, "projects"), { ...project, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
  for (const item of defaultEducation) {
    await addDoc(collection(db, "education"), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  seedMessage.textContent = "Default portfolio data inserted successfully.";
  await refreshData();
}

if (!firebaseConfigured || !auth || !db) {
  show(setupWarning);
  hide(loginPanel);
  hide(dashboard);
} else {
  hide(setupWarning);
  show(loginPanel);

  document.getElementById("loginBtn")?.addEventListener("click", async () => {
    loginMessage.textContent = "";
    try {
      const userCredential = await signInWithEmailAndPassword(auth, value("email"), value("password"));
      if (userCredential.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        loginMessage.textContent = "Access denied. This dashboard is only for the admin email.";
      }
    } catch (error) {
      loginMessage.textContent = "Invalid login details or Firebase Authentication is not enabled.";
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await signOut(auth);
  });

  document.getElementById("projectForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = value("projectId");
    const payload = {
      title: value("projectTitle"),
      description: value("projectDescription"),
      tech: value("projectTech"),
      link: value("projectLink"),
      displayOrder: Number(value("projectOrder")) || 999,
      updatedAt: serverTimestamp()
    };

    if (id) {
      await setDoc(doc(db, "projects", id), payload, { merge: true });
    } else {
      await addDoc(collection(db, "projects"), { ...payload, createdAt: serverTimestamp() });
    }

    resetProjectForm();
    await loadProjects();
  });

  document.getElementById("educationForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = value("educationId");
    const payload = {
      title: value("educationTitle"),
      year: value("educationYear"),
      description: value("educationDescription"),
      displayOrder: Number(value("educationOrder")) || 999,
      updatedAt: serverTimestamp()
    };

    if (id) {
      await setDoc(doc(db, "education", id), payload, { merge: true });
    } else {
      await addDoc(collection(db, "education"), { ...payload, createdAt: serverTimestamp() });
    }

    resetEducationForm();
    await loadEducation();
  });

  document.getElementById("cancelProjectEdit")?.addEventListener("click", resetProjectForm);
  document.getElementById("cancelEducationEdit")?.addEventListener("click", resetEducationForm);
  document.getElementById("seedBtn")?.addEventListener("click", seedDefaultData);

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
      hide(loginPanel);
      show(dashboard);
      await refreshData();
    } else {
      show(loginPanel);
      hide(dashboard);
    }
  });
}
