const correct = {
  q1: "10",
  q2: "🔵",
  q3: "Animal"
};

let score = 0;
let selected = null;
let timerRef = null;
let isSubmitting = false;

function show(id) {
  document.querySelectorAll(".test-screen")
    .forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function selectAnswer(btn, value) {
  btn.parentElement.querySelectorAll("button")
    .forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selected = value;

  btn.closest(".test-screen")
     .querySelector(".primary-btn")
     .classList.remove("disabled");
}

/* Q1 */
function startQuestion1() {
  show("q1");
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 500);
  let t = 20;
  timerRef = setInterval(() => {
    document.getElementById("t1").innerText = --t;
    if (t === 0) submitQ1();
  }, 1000);
}

function submitQ1() {
  if (isSubmitting) return;
  isSubmitting = true;
  clearInterval(timerRef);
  if (selected === correct.q1) score++;
  selected = null;
  startQuestion2();
}

/* Q2 */
function startQuestion2() {
  show("q2");
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 500);
  let t = 20;
  timerRef = setInterval(() => {
    document.getElementById("t2").innerText = --t;
    if (t === 0) submitQ2();
  }, 1000);
}

function submitQ2() {
  if (isSubmitting) return;
  isSubmitting = true;
  clearInterval(timerRef);
  if (selected === correct.q2) score++;
  selected = null;
  startQuestion3();
}

/* Q3 */
function startQuestion3() {
  show("q3");
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 500);
  let t = 25;
  timerRef = setInterval(() => {
    document.getElementById("t3").innerText = --t;
    if (t === 0) submitQ3();
  }, 1000);
}

function submitQ3() {
  if (isSubmitting) return;
  isSubmitting = true;
  clearInterval(timerRef);
  if (selected === correct.q3) score++;

  CogniCareStorage.set("executiveTestCompleted", "true");
  CogniCareStorage.set("executiveScore", String(score));

  alert(`Executive Function Test Completed!\nScore: ${score}/3`);

  window.location.href = "exam.html";
}
