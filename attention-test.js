const correctAnswers = {
  target: "A",
  odd: "Square",
  focus: 25
};

let attentionScore = 0;
let selectedOdd = null;
let selectedFocus = null;
let currentLetter = null;
let targetClicked = false;
let oddTimerRef = null;
let focusTimerRef = null;
let oddSubmitted = false;
let focusSubmitted = false;

// SCREEN SWITCH
function showScreen(id) {
  document.querySelectorAll('.test-screen')
    .forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ======================
   Q1 TARGET LETTER
====================== */

function startTargetTest() {
  showScreen('targetScreen');
  let time = 15;

  const letters = ["A","B","C","D","E"];
  const box = document.getElementById("letterBox");

  const letterInterval = setInterval(() => {
    currentLetter = letters[Math.floor(Math.random()*letters.length)];
    box.innerText = currentLetter;
  }, 800);

  const timer = setInterval(() => {
    time--;
    document.getElementById("targetTimer").innerText = time;
    if (time === 0) {
      clearInterval(timer);
      clearInterval(letterInterval);
      if (targetClicked) attentionScore++;
      startOddTest();
    }
  }, 1000);
}

function recordTargetClick() {
  if (currentLetter === "A") {
    targetClicked = true;
  }
}

/* ======================
   Q2 ODD ONE OUT
====================== */

function startOddTest() {
  showScreen('oddScreen');
  oddSubmitted = true;
  setTimeout(() => oddSubmitted = false, 500);
  let time = 20;

  oddTimerRef = setInterval(() => {
    time--;
    document.getElementById("oddTimer").innerText = time;
    if (time === 0) {
      clearInterval(oddTimerRef);
      submitOdd();
    }
  }, 1000);
}

function selectOdd(btn,value){
  document.querySelectorAll('#oddScreen .option-btn')
    .forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedOdd = value;
  document.getElementById("oddSubmitBtn").classList.remove("disabled");
}

function submitOdd(){
  if (oddSubmitted) return;
  oddSubmitted = true;
  clearInterval(oddTimerRef);
  if(selectedOdd === correctAnswers.odd) attentionScore++;
  startFocusTest();
}

/* ======================
   Q3 FOCUS QUESTION
====================== */

function startFocusTest(){
  showScreen('focusScreen');
  focusSubmitted = true;
  setTimeout(() => focusSubmitted = false, 500);
  let time = 20;

  focusTimerRef = setInterval(()=>{
    time--;
    document.getElementById("focusTimer").innerText=time;
    if(time===0){
      clearInterval(focusTimerRef);
      submitFocus();
    }
  },1000);
}

function selectFocus(btn,value){
  document.querySelectorAll('#focusScreen .option-btn')
    .forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedFocus=value;
  document.getElementById("focusSubmitBtn").classList.remove("disabled");
}

function submitFocus(){
  if (focusSubmitted) return;
  focusSubmitted = true;
  clearInterval(focusTimerRef);
  if(selectedFocus === correctAnswers.focus) attentionScore++;

  CogniCareStorage.set("attentionTestCompleted","true");
  CogniCareStorage.set("attentionScore",String(attentionScore));
  CogniCareStorage.set("attentionCompletedAt",new Date().toISOString());

  alert(`Attention Test Completed!\nScore: ${attentionScore}/3`);
  window.location.href="exam.html";
}
