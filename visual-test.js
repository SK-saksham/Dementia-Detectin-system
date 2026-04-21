const correctAnswers = {
  q1: "circle",
  q2: "12",
  q3: "east"
};

let visualScore = 0;
let selectedAnswer = null;
let timerRef = null;
let isSubmitting = false;

function showScreen(id) {
  document.querySelectorAll(".test-screen")
    .forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function selectAnswer(btn, value) {
  btn.closest(".options")
    .querySelectorAll(".option-btn")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
  selectedAnswer = value;

  btn.closest(".test-screen")
    .querySelector(".primary-btn")
    .classList.remove("disabled");
}

/* Q1 */
function startQ1() {
  showScreen("q1Screen");
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 500);
  startTimer("q1Timer", submitQ1);
}

function submitQ1() {
  if (isSubmitting) return;
  isSubmitting = true;
  clearInterval(timerRef);
  if (selectedAnswer === correctAnswers.q1) visualScore++;
  selectedAnswer = null;
  showScreen("q2Screen");
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 500);
  startTimer("q2Timer", submitQ2);
}

/* Q2 */
function submitQ2() {
  if (isSubmitting) return;
  isSubmitting = true;
  clearInterval(timerRef);
  if (selectedAnswer === correctAnswers.q2) visualScore++;
  selectedAnswer = null;
  showScreen("q3Screen");
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 500);
  startTimer("q3Timer", submitQ3);
}

/* Q3 */
function submitQ3() {
  if (isSubmitting) return;
  isSubmitting = true;
  clearInterval(timerRef);
  if (selectedAnswer === correctAnswers.q3) visualScore++;

  // ✅ FINAL COMPLETION
  CogniCareStorage.set("visualTestCompleted", "true");
  CogniCareStorage.set("visualScore", String(visualScore));
  CogniCareStorage.set("visualCompletedAt", new Date().toISOString());

  alert(`Visuospatial Test Completed!\nScore: ${visualScore}/3`);

  window.location.href = "exam.html";
}

/* TIMER */
function startTimer(id, callback) {
  let time = 25;
  document.getElementById(id).innerText = time;

  timerRef = setInterval(() => {
    time--;
    document.getElementById(id).innerText = time;

    if (time === 0) {
      clearInterval(timerRef);
      callback();
    }
  }, 1000);
}
