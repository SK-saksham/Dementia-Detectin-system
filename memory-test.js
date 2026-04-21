
// Correct Answers define
const correctAnswers = {
  word: "Apple",
  image: "Clock",
  number: "7 2 9 4"
};

let memoryScore = 0;


let wordSubmitted = false;
let imageSubmitted = false;
let numberSubmitted = false;

let questionTimerRef = null;
let imageTimerRef = null;
let numberTimerRef = null;

let selectedAnswer = null;
let selectedImageAnswer = null;
let selectedNumberAnswer = null;

const examData = { memory: [] };


// SCREEN SWITCH
function showScreen(id) {
  document.querySelectorAll('.test-screen')
    .forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* =======================
   Q1 – WORD MEMORY
======================= */

function startLearningPhase() {
  showScreen('learningScreen');

  let time = 15;
  const timer = setInterval(() => {
    time--;
    document.getElementById('learnTimer').innerText = time;

    if (time === 0) {
      clearInterval(timer);
      startQuestion();
    }
  }, 1000);
}

function startQuestion() {
  showScreen('questionScreen');

  let time = 30;
  questionTimerRef = setInterval(() => {
    time--;
    document.getElementById('questionTimer').innerText = time;

    if (time === 0) {
      clearInterval(questionTimerRef);
      submitAnswer();
    }
  }, 1000);
}

function selectOption(btn, value) {
  document.querySelectorAll('#questionScreen .option-btn')
    .forEach(b => b.classList.remove('selected'));

  btn.classList.add('selected');
  selectedAnswer = value;
  document.getElementById('submitBtn').classList.remove('disabled');
}

function submitAnswer() {
  if (wordSubmitted) return;
  wordSubmitted = true;

  clearInterval(questionTimerRef);

    // ✅ score check
  if (selectedAnswer === correctAnswers.word) {
    memoryScore++;
  }

  examData.memory.push({
    question: 'Word Recall',
    answer: selectedAnswer
  });

  startImageLearning();
}

/* =======================
   Q2 – IMAGE MEMORY
======================= */

function startImageLearning() {
  showScreen('imageLearnScreen');

  let time = 15;
  const timer = setInterval(() => {
    time--;
    document.getElementById('imageLearnTimer').innerText = time;

    if (time === 0) {
      clearInterval(timer);
      startImageQuestion();
    }
  }, 1000);
}

function startImageQuestion() {
  showScreen('imageQuestionScreen');

  let time = 30;
  imageTimerRef = setInterval(() => {
    time--;
    document.getElementById('imageQuestionTimer').innerText = time;

    if (time === 0) {
      clearInterval(imageTimerRef);
      submitImageAnswer();
    }
  }, 1000);
}

function selectImageOption(btn, value) {
  document.querySelectorAll('#imageQuestionScreen .option-btn')
    .forEach(b => b.classList.remove('selected'));

  btn.classList.add('selected');
  selectedImageAnswer = value;
  document.getElementById('imageSubmitBtn').classList.remove('disabled');
}

function submitImageAnswer() {
  if (imageSubmitted) return;
  imageSubmitted = true;

  clearInterval(imageTimerRef);
  
   if (selectedImageAnswer === correctAnswers.image) {
    memoryScore++;
  }

  examData.memory.push({
    question: 'Image Memory',
    answer: selectedImageAnswer
  });

  startNumberLearning();
}

/* =======================
   Q3 – NUMBER MEMORY
======================= */

function startNumberLearning() {
  showScreen('numberLearnScreen');

  let time = 5;
  const timer = setInterval(() => {
    time--;
    document.getElementById('numberLearnTimer').innerText = time;

    if (time === 0) {
      clearInterval(timer);
      startNumberQuestion();
    }
  }, 1000);
}

function startNumberQuestion() {
  showScreen('numberQuestionScreen');

  let time = 20;
  numberTimerRef = setInterval(() => {
    time--;
    document.getElementById('numberQuestionTimer').innerText = time;

    if (time === 0) {
      clearInterval(numberTimerRef);
      submitNumberAnswer();
    }
  }, 1000);
}

function selectNumberOption(btn, value) {
  document.querySelectorAll('#numberQuestionScreen .option-btn')
    .forEach(b => b.classList.remove('selected'));

  btn.classList.add('selected');
  selectedNumberAnswer = value;
  document.getElementById('numberSubmitBtn').classList.remove('disabled');
}

function submitNumberAnswer() {
  if (numberSubmitted) return;
  numberSubmitted = true;

  clearInterval(numberTimerRef);

  if (selectedNumberAnswer && selectedNumberAnswer.trim() === correctAnswers.number.trim()) {
    memoryScore++;
  }

  examData.memory.push({
    question: 'Number Recall (Reverse)',
    answer: selectedNumberAnswer
  });

  console.log('FINAL DATA:', examData);

  CogniCareStorage.set("memoryTestCompleted", "true");
  CogniCareStorage.set("memoryScore", String(memoryScore));
  CogniCareStorage.set("memoryCompletedAt", new Date().toISOString());

  alert(`Memory Test Completed!\nScore: ${memoryScore}/3`);

  setTimeout(() => {
    window.location.href = "exam.html";
  }, 300);
}



