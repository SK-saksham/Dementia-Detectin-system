let currentQuestion = 0;
let score = 0;
let timerRef = null;
let selectedAnswer = null;
let submitted = false;

const today = new Date();
const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
const currentDate = today.getDate().toString();
const currentMonth = today.toLocaleDateString("en-US", { month: "long" });

const questions = [
  {
    text: "Aaj ka din kaunsa hai?",
    options: getDayOptions(currentDay),
    correct: currentDay
  },
  {
    text: "Aaj ka date kya hai?",
    options: getDateOptions(currentDate),
    correct: currentDate
  },
  {
    text: "Abhi kaunsa month chal raha hai?",
    options: getMonthOptions(currentMonth),
    correct: currentMonth
  },
  {
    text: "Ye test kis cheez se related hai?",
    options: ["Cognitive health", "Cooking", "Driving", "Cricket score"],
    correct: "Cognitive health"
  }
];

function showScreen(id) {
  document.querySelectorAll(".test-screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function startTest() {
  showScreen("questionScreen");
  loadQuestion();
}

function loadQuestion() {
  selectedAnswer = null;
  submitted = true;
  setTimeout(() => submitted = false, 500);
  document.getElementById("submitBtn").classList.add("disabled");

  document.getElementById("questionCount").innerText =
    `Question ${currentQuestion + 1} of 4`;

  const q = questions[currentQuestion];
  document.getElementById("questionText").innerText = q.text;

  const box = document.getElementById("optionsBox");
  box.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => selectOption(btn, opt);
    box.appendChild(btn);
  });

  startTimer();
}

function selectOption(btn, value) {
  document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedAnswer = value;
  document.getElementById("submitBtn").classList.remove("disabled");
}

function startTimer() {
  let time = 25;
  document.getElementById("timer").innerText = time;

  timerRef = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = time;
    if (time === 0) {
      clearInterval(timerRef);
      submitAnswer();
    }
  }, 1000);
}

function submitAnswer() {
  if (submitted) return;
  submitted = true;
  clearInterval(timerRef);

  if (selectedAnswer === questions[currentQuestion].correct) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    finishTest();
  }
}

function finishTest() {
  CogniCareStorage.set("orientationTestCompleted", "true");
  CogniCareStorage.set("orientationScore", score.toString());
  CogniCareStorage.set("orientationCompletedAt", new Date().toISOString());

  alert(`Orientation Test Completed!\nScore: ${score}/4`);
  window.location.href = "exam.html";
}

/* ---------- Helpers ---------- */

function getDayOptions(correctDay) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].filter(day => day !== correctDay);
  return shuffle([correctDay, ...days.slice(0, 3)]);
}

function getDateOptions(correctDate) {
  const todayNum = Number(correctDate);
  const set = new Set([todayNum, Math.max(1, todayNum - 1), Math.min(31, todayNum + 1), Math.min(31, todayNum + 2)]);
  return shuffle(Array.from(set).slice(0, 4).map(String));
}

function getMonthOptions(correctMonth) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"].filter(month => month !== correctMonth);
  return shuffle([correctMonth, ...months.slice(0, 3)]);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
