const languageQuestions = [
  {
    question: "‘Happy’ ka matlab kya hota hai?",
    options: ["Udaas", "Khush", "Gussa", "Darr"],
    correct: "Khush"
  },
  {
    question: "Ram ____ school ja raha hai.",
    options: ["kal", "hai", "tha", "kyunki"],
    correct: "hai"
  },
  {
    question: "‘Fast’ ka synonym kaunsa hai?",
    options: ["Slow", "Quick", "Late", "Weak"],
    correct: "Quick"
  }
];

let currentQuestion = 0;
let languageScore = 0;
let selectedAnswer = null;
let submitted = false;
let timerRef = null;

const examData = { language: [] };

// Screen switch
function showScreen(id) {
  document.querySelectorAll('.test-screen')
    .forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Start Test
function startLanguageTest() {
  showScreen("questionScreen");
  loadQuestion();
}

// Load Question
function loadQuestion() {
  submitted = false;
  selectedAnswer = null;
  document.getElementById("submitBtn").classList.add("disabled");

  const q = languageQuestions[currentQuestion];

  document.getElementById("questionText").innerText = q.question;
  document.getElementById("questionCount").innerText =
    `Question ${currentQuestion + 1} of ${languageQuestions.length}`;

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => selectOption(btn, opt);
    optionsBox.appendChild(btn);
  });

  startTimer();
}

// Select Option
function selectOption(btn, value) {
  document.querySelectorAll(".option-btn")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
  selectedAnswer = value;
  document.getElementById("submitBtn").classList.remove("disabled");
}

// Timer
function startTimer() {
  let time = 20;
  document.getElementById("questionTimer").innerText = time;

  clearInterval(timerRef);
  timerRef = setInterval(() => {
    time--;
    document.getElementById("questionTimer").innerText = time;

    if (time === 0) {
      clearInterval(timerRef);
      submitLanguageAnswer();
    }
  }, 1000);
}

// Submit Answer
function submitLanguageAnswer() {
  if (submitted) return;
  submitted = true;

  clearInterval(timerRef);

  const q = languageQuestions[currentQuestion];

  if (selectedAnswer === q.correct) {
    languageScore++;
  }

  examData.language.push({
    question: q.question,
    answer: selectedAnswer
  });

  currentQuestion++;

  if (currentQuestion < languageQuestions.length) {
    loadQuestion();
  } else {
    finishLanguageTest();
  }
}

// Finish Test
function finishLanguageTest() {
  CogniCareStorage.set("languageTestCompleted", "true");
  CogniCareStorage.set("languageScore", String(languageScore));
  CogniCareStorage.set("languageCompletedAt", new Date().toISOString());

  alert(`Language Test Completed!\nScore: ${languageScore}/3`);

  setTimeout(() => {
    window.location.href = "exam.html";
  }, 300);
}
