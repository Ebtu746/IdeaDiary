//================ DOM ELEMENTS ================= //

const ideaForm = document.getElementById("idea-form");
const ideaTitle = document.getElementById("idea-title");
const ideaDesc = document.getElementById("idea-desc");
const ideaCategory = document.getElementById("category");
const ideasContainer = document.getElementById("ideas-container");
const newIdeaBtn = document.getElementById("new-idea-btn");
const addIdeaBox = document.getElementById("add-idea-box");

const toggleBtn = document.getElementById("toggle-ideas");
const arrowIcon = document.querySelector(".arrow-icon");
const ideasContent = document.getElementById("ideas-content");

const toggleBestBtn = document.getElementById("toggle-best");
const bestArrowIcon = document.querySelector(".best-arrow-icon");
const bestIdea = document.getElementById("best-ideas-list");

const toggleCompBtn = document.getElementById("toggle-completed");
const compArrowIcon = document.querySelector(".comp-arrow-icon");
const compIdea = document.getElementById("completed-ideas-list");

// ===============LOCAL STORAGE FUNCTIONS ================= //

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function removeIdeaFromLocalStorage(key, title) {
  let data = getFromLocalStorage(key);
  data = data.filter(item => item.title !== title);
  saveToLocalStorage(key, data);
}

// ==================== INITIAL LOAD  ====================== //

window.addEventListener("DOMContentLoaded", () => {
  loadSavedIdeas();

  // Collapse everything on page load
  ideasContent.classList.add("collapsed");
  arrowIcon.textContent = "▼";
  bestIdea.classList.add("collapsed");
  bestArrowIcon.textContent = "▼";
  compIdea.classList.add("collapsed");
  compArrowIcon.textContent = "▼";
});

// Load ideas from localStorage
function loadSavedIdeas() {
  const ideas = getFromLocalStorage("ideas");
  const bestIdeas = getFromLocalStorage("bestIdeas");
  const completedIdeas = getFromLocalStorage("completedIdeas");

  ideas.forEach(idea => createIdeaCard(idea, false));
  bestIdeas.forEach(best => createBestCard(best));
  completedIdeas.forEach(comp => createCompletedCard(comp));
}


//==================== NEW IDEA BUTTON EFFECT ==================== //

newIdeaBtn.addEventListener("click", () => {
  addIdeaBox.classList.add("glow-blue");
  addIdeaBox.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => addIdeaBox.classList.remove("glow-blue"), 2000);
});

//==================== SUBMIT NEW IDEA ==================== //

ideaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = ideaTitle.value.trim();
  const desc = ideaDesc.value.trim();
  const category = ideaCategory.value;

  if (!title || !desc || !category) {
    alert("Please fill in all fields first!");
    return;
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const ideaData = { title, desc, category, date: formattedDate };

  // Save to localStorage
  const ideas = getFromLocalStorage("ideas");
  ideas.push(ideaData);
  saveToLocalStorage("ideas", ideas);

  // Create card
  createIdeaCard(ideaData, true);

  // Reset form
  ideaForm.reset();
});

// =================== TOGGLE FUNCTION ================= //

function toggleSection(container, arrow) {
  container.classList.toggle("collapsed");
  arrow.textContent = container.classList.contains("collapsed") ? "▼" : "▲";
}

toggleBtn.addEventListener("click", () => toggleSection(ideasContent, arrowIcon));
toggleBestBtn.addEventListener("click", () => toggleSection(bestIdea, bestArrowIcon));
toggleCompBtn.addEventListener("click", () => toggleSection(compIdea, compArrowIcon));

// ================= CREATE CARDS ==================== //

function createIdeaCard(idea, openContainer) {
  const ideaCard = document.createElement("div");
  ideaCard.className = "card mb-3 shadow-sm";
  ideaCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title font-weight-bold">${idea.title}</h5>
      <h6 class="text-primary small mb-2">${idea.category}</h6>
      <p class="card-text">${idea.desc}</p>
      <p class="text-muted small mb-0">📅 Added on: ${idea.date}</p>
      <div class="mt-3">
        <button class="delete btn btn-sm btn-outline-danger">🗑️ Delete</button>
        <button class="best btn btn-sm btn-outline-success">💎 Best</button>
        <button class="completed btn btn-sm btn-outline-info">✅ Completed</button>
      </div>
    </div>
  `;
  ideasContent.appendChild(ideaCard);

  if (openContainer) {
    ideasContent.classList.remove("collapsed");
    arrowIcon.textContent = "▲";
  }

  const deleteBtn = ideaCard.querySelector(".delete");
  const bestBtn = ideaCard.querySelector(".best");
  const compBtn = ideaCard.querySelector(".completed");

  // Delete main Idea //
  deleteBtn.addEventListener("click", () => {
    ideaCard.remove();
    removeIdeaFromLocalStorage("ideas", idea.title);
    removeIdeaFromLocalStorage("bestIdeas", idea.title);
    removeIdeaFromLocalStorage("completedIdeas", idea.title);

    bestIdea.querySelectorAll("li").forEach(item => {
      if (item.textContent.includes(idea.title)) item.remove();
    });
    compIdea.querySelectorAll("li").forEach(item => {
      if (item.textContent.includes(idea.title)) item.remove();
    });

    updateArrows();
  });

  // Add to best //
  bestBtn.addEventListener("click", () => {
    const bestIdeas = getFromLocalStorage("bestIdeas");
    if (bestIdeas.some(b => b.title === idea.title)) return;

    createBestCard(idea);
    bestBtn.disabled = true;
    bestIdeas.push({ title: idea.title, category: idea.category });
    saveToLocalStorage("bestIdeas", bestIdeas);

    bestIdea.classList.remove("collapsed");
    bestArrowIcon.textContent = "▲";
  });

  // Add to completed //
  compBtn.addEventListener("click", () => {
    const completedIdeas = getFromLocalStorage("completedIdeas");
    if (completedIdeas.some(c => c.title === idea.title)) return;

    createCompletedCard(idea);
    compBtn.disabled = true;
    completedIdeas.push({ title: idea.title, category: idea.category });
    saveToLocalStorage("completedIdeas", completedIdeas);

    compIdea.classList.remove("collapsed");
    compArrowIcon.textContent = "▲";
  });
}

// Create Best card
function createBestCard(idea) {
  const bestCard = document.createElement("li");
  bestCard.className = "py-3 pl-4 fs-5 d-flex justify-content-between";
  bestCard.style.marginRight = "10px";
  bestCard.innerHTML = `
    <span>🏆 Title: ${idea.title} | Category: ${idea.category}</span>
    <button class="btn btn-sm btn-outline-danger remove-best">Remove</button>
  `;
  bestIdea.appendChild(bestCard);

  bestCard.querySelector(".remove-best").addEventListener("click", () => {
    bestCard.remove();
    removeIdeaFromLocalStorage("bestIdeas", idea.title);

    const mainCard = [...ideasContent.children].find(c => c.querySelector(".card-title").textContent === idea.title);
    if (mainCard) mainCard.querySelector(".best").disabled = false;

    updateArrows();
  });

  updateArrows();
}

// Create Completed card
function createCompletedCard(idea) {
  const compCard = document.createElement("li");
  compCard.className = "py-3 pl-4 fs-5 d-flex justify-content-between";
  compCard.style.marginRight = "10px";
  compCard.innerHTML = `
    <span>✅ Title: ${idea.title} | Category: ${idea.category}</span>
    <button class="btn btn-sm btn-outline-danger remove-comp">Remove</button>
  `;
  compIdea.appendChild(compCard);

  compCard.querySelector(".remove-comp").addEventListener("click", () => {
    compCard.remove();
    removeIdeaFromLocalStorage("completedIdeas", idea.title);

    const mainCard = [...ideasContent.children].find(c => c.querySelector(".card-title").textContent === idea.title);
    if (mainCard) mainCard.querySelector(".completed").disabled = false;

    updateArrows();
  });

  updateArrows();
}

// Update Arrows //
function updateArrows() {
  arrowIcon.textContent = ideasContent.children.length > 0 && !ideasContent.classList.contains("collapsed") ? "▲" : "▼";
  bestArrowIcon.textContent = bestIdea.children.length > 0 && !bestIdea.classList.contains("collapsed") ? "▲" : "▼";
  compArrowIcon.textContent = compIdea.children.length > 0 && !compIdea.classList.contains("collapsed") ? "▲" : "▼";
}
