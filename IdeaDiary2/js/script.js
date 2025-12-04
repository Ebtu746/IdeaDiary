const ideaForm = document.getElementById("idea-form");
const ideaTitle = document.getElementById("idea-title");
const ideaDesc = document.getElementById("idea-desc");
const ideaCategory = document.getElementById("category");
const ideasContainer = document.getElementById("ideas-container");
const newIdeaBtn = document.getElementById("new-idea-btn");
const addIdeaBox = document.getElementById("add-idea-box");

// ****When new idea button clicked****
newIdeaBtn.addEventListener("click", function() {
  addIdeaBox.classList.add("glow-blue");
  addIdeaBox.scrollIntoView({ behavior: "smooth" }); 
  setTimeout(() => {
    addIdeaBox.classList.remove("glow-blue");
  }, 2000);
});

// ===New idea submitted container==== //
ideaForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = ideaTitle.value;
  const desc = ideaDesc.value;
  const category = ideaCategory.value;

  if (!title || !desc || !category) {
    alert("Please fill in all fields first!");
    return;
  }

  // Create a formatted date string 
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);

  // Create a small box/card for the new idea
  const ideaCard = document.createElement("div");
  ideaCard.className = "card mb-3 shadow-sm";
  ideaCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title font-weight-bold">${title}</h5>
      <h6 class="text-primary small mb-2">${category}</h6>
      <p class="card-text">${desc}</p>
      <p class="text-muted small mb-0">📅 Added on: ${formattedDate}</p>

      <div class="mt-3">
        <button class="delete btn btn-sm btn-outline-danger">🗑️ Delete</button>
        <button class="best btn btn-sm btn-outline-success">💎 Best</button>
        <button class="completed btn btn-sm btn-outline-info">✅ Completed</button>
      </div>
    </div>
  `;
// *****deleting idea******* //
const deleteBtn = ideaCard.querySelector(".delete");
deleteBtn.addEventListener("click", () => {
  ideaCard.remove();
  updateArrows();
  // Also delete for best idea (if it was added)
  const bestItems = bestIdea.querySelectorAll("li");
  bestItems.forEach(item => {
    if (item.textContent.includes(title)) {
      item.parentElement.remove();
    }
  });
  //Also delete for completed ideas (if it was added)
  const compItems = compIdea.querySelectorAll("li");
  compItems.forEach(item => {
      if (item.textContent.includes(title)) {
      item.parentElement.remove();
    }
    updateArrows();
  });
});

//******adding best idea*******//
const bestCard = document.createElement("div");
bestCard.className = "card shadow-sm";
bestCard.innerHTML = `<li class="py-3 pl-4 .fs-4 d-flex justify-content-between"> 
                      <span>🏆 Title: ${title}   |  Category: ${category}</span>
                      <div><button class="btn btn-sm btn-outline-danger mr-3 remove-best">Remove</button></div>
                  </li>`;
const bestBtn = ideaCard.querySelector(".best");
bestBtn.addEventListener("click", () =>{
  bestIdea.appendChild(bestCard);
  bestArrowIcon.textContent = "▲";
});

// Remove best idea when “Remove” button clicked
bestCard.querySelector(".remove-best").addEventListener("click", () => {
  bestCard.remove();
  updateArrows();
});

  // *****Add it to the ideas container******//
  ideasContent.appendChild(ideaCard);

  //**** adding completed idea ****//
const compCard = document.createElement("div");
compCard.className = "card shadow-sm";
compCard.innerHTML = `<li class="py-3 pl-4 .fs-4 d-flex justify-content-between">
                    <span> ✅ Title: ${title}   |  Category: ${category}</span>
                    <div><button class="btn btn-sm btn-outline-danger mr-3 remove-comp">Remove</button></div>
                    </li>`;
const compBtn = ideaCard.querySelector(".completed");
compBtn.addEventListener("click", () =>{
  compIdea.appendChild(compCard);
  compArrowIcon.textContent = "▲";
});

// Remove completed idea when “Remove” button clicked
compCard.querySelector(".remove-comp").addEventListener("click", () => {
  compCard.remove();
  updateArrows();
});

  // Ensure the box is visible after adding it
  ideasContent.classList.remove("collapsed");  // remove the collapsed class to see what we add
  arrowIcon.textContent = "▲";  
  // Clear input fields after adding
  ideaForm.reset();
});

// =====Toggle buttons======
// ****Toggle the idea container******
const toggleBtn = document.getElementById("toggle-ideas");
const arrowIcon = document.querySelector(".arrow-icon");
const ideasContent = document.getElementById("ideas-content");

toggleBtn.addEventListener("click", () => {
  ideasContent.classList.toggle("collapsed");
  arrowIcon.textContent = ideasContent.classList.contains("collapsed") ? "▼" : "▲";
});

// ****Toggle the Best Ideas container******
const toggleBestBtn = document.getElementById("toggle-best");
const bestArrowIcon = document.querySelector(".best-arrow-icon");
const bestIdea = document.getElementById("best-ideas-list");

toggleBestBtn.addEventListener("click", () => {
  bestIdea.classList.toggle("collapsed");
  bestArrowIcon.textContent = bestIdea.classList.contains("collapsed") ? "▼" : "▲";
});

// ****Toggle the Completed Ideas container******
const toggleCompBtn = document.getElementById("toggle-completed");
const compArrowIcon = document.querySelector(".comp-arrow-icon");
const compIdea = document.getElementById("completed-ideas-list");

toggleCompBtn.addEventListener("click", () => {
  compIdea.classList.toggle("collapsed");
  compArrowIcon.textContent = compIdea.classList.contains("collapsed") ? "▼" : "▲";
});

function updateArrows() {
  arrowIcon.textContent = ideasContent.children.length > 0 ? "▲" : "▼";
  
  bestArrowIcon.textContent = bestIdea.children.length > 0 ? "▲" : "▼";

  compArrowIcon.textContent = compIdea.children.length > 0 ? "▲" : "▼";
}
// Call this after adding or removing a card
updateArrows();













