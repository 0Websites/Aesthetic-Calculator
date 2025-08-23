const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const historyBox = document.getElementById("history"); // ✅ container for history

// ✅ Simple click sound (use your own mp3/wav file if you want)
const clickSound = new Audio("sfx.mp3");

function playSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

let history = []; // ✅ store last 10 operations

function addToHistory(operation, result) {
  history.unshift(`${operation} = ${result}`); // add to front
  if (history.length > 10) history.pop(); // keep only 10
  renderHistory();
}
function renderHistory() {
  historyBox.innerHTML = history
    .map(item => {
      let [operation, result] = item.split(" = ");
      return `
        <div class="history-item">
          <span class="operation">${operation} =</span>
          <span class="result">${result}</span>
        </div>
      `;
    })
    .join("");
}


// Button click handling
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    playSound();

    // ✅ remove focus so Enter won't re-trigger it
    btn.blur();

    if (btn.innerText === "C") {
      display.value = "";
    } else if (btn.innerText === "=") {
      try {
        let result = eval(display.value);
        addToHistory(display.value, result); // ✅ save to history
        display.value = result;
      } catch {
        display.value = "Error";
      }
    } else {
      display.value += btn.innerText;
    }
  });
});

// ✅ Keyboard support + button highlight
document.addEventListener("keydown", (e) => {
  let key = e.key;

  if ((key >= "0" && key <= "9") || ["+", "-", "*", "/", ".", "(", ")"].includes(key)) {
    display.value += key;
    highlightButton(key);
    playSound();
  } else if (key === "Enter") {
    try {
      let result = eval(display.value);
      addToHistory(display.value, result); // ✅ save to history
      display.value = result;
    } catch {
      display.value = "Error";
    }
    highlightButton("=");
    playSound();
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key.toLowerCase() === "c") {
    display.value = "";
    highlightButton("C");
    playSound();
  }
});

// Function to highlight the correct button
function highlightButton(key) {
  buttons.forEach(btn => {
    if (btn.innerText === key) {
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 150);
    }
    if (key === "Enter" && btn.innerText === "=") {
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 150);
    }
  });
}

const fullscreenBtn = document.getElementById("fullscreenToggle");

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable fullscreen: ${err.message}`);
    });
    fullscreenBtn.textContent = "X";
  } else {
    // Exit fullscreen
    document.exitFullscreen();
    fullscreenBtn.textContent = "X";
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.textContent = "⛶";
  }
});

const toggleBtn = document.getElementById("darkToggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleBtn.textContent = document.body.classList.contains("dark-mode")
    ? "Light"
    : "Dark";
});


const clearHistoryBtn = document.getElementById("clearHistory");

clearHistoryBtn.addEventListener("click", () => {
  history = [];           // sab clear
  renderHistory();        // UI refresh
});