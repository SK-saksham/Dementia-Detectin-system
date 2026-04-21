const tests = ["memory", "attention", "executive", "language", "orientation", "visual"];
const scoreDenominator = { memory: 3, attention: 3, executive: 3, language: 3, orientation: 4, visual: 3 };
function updateScoreText(test) { const scoreEl = document.getElementById(`${test}ScoreText`); if (!scoreEl) return; const score = CogniCareStorage.get(test + "Score"); scoreEl.innerText = score !== null ? `Score: ${score}/${scoreDenominator[test]}` : "Ready to start"; }
function enableButton(test) { const btn = document.getElementById(test + "Btn"); if (!btn) return; btn.textContent = "Start Module"; btn.classList.remove("locked"); btn.disabled = false; btn.onclick = () => window.location.href = test + "-test.html"; }
function disableButton(test) { const btn = document.getElementById(test + "Btn"); if (!btn) return; btn.textContent = "Locked"; btn.classList.add("locked"); btn.disabled = true; }
function updateHeader(doneCount, percent, examCompleted) { const circle = document.getElementById("progressCircle"); if (circle) circle.style.background = `conic-gradient(var(--primary) ${percent * 3.6}deg, rgba(255,255,255,.08) 0deg)`; document.getElementById("progressText").innerText = percent + "%"; document.getElementById("progressPercent").innerText = percent + "%"; document.getElementById("doneCount").innerText = `${doneCount} / ${tests.length}`; document.getElementById("progressBar").style.width = percent + "%"; const headline = document.getElementById("statusHeadline"); const subtext = document.getElementById("statusSubtext"); if (examCompleted) { headline.innerText = "Assessment completed"; subtext.innerText = "Your latest report has been generated and saved in local assessment history."; } else if (doneCount === 0) { headline.innerText = "Ready to begin"; subtext.innerText = "Start the memory module to unlock the full sequential screening flow."; } else { headline.innerText = "Assessment in progress"; subtext.innerText = "Continue the next unlocked module to complete the cognitive summary."; } }
function renderDashboard() {
  let completedCount = 0;
  const examCompleted = CogniCareStorage.getBoolean("examCompleted");
  
  // Use a simple loop for better performance
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const btn = document.getElementById(test + "Btn");
    if (!btn) continue;
    
    const card = btn.closest(".exam-card");
    const badge = card.querySelector(".status-badge");
    const done = CogniCareStorage.getBoolean(test + "TestCompleted");
    
    updateScoreText(test);
    
    if (done) {
      badge.textContent = "Completed";
      badge.classList.add("completed");
      badge.classList.remove("locked");
      btn.textContent = "Completed ✓";
      btn.disabled = true;
      completedCount++;
    } else {
      const previousDone = i === 0 || CogniCareStorage.getBoolean(tests[i - 1] + "TestCompleted");
      if (!examCompleted && previousDone) {
        badge.textContent = "Available";
        badge.classList.remove("locked");
        enableButton(test);
      } else {
        badge.textContent = "Locked";
        badge.classList.add("locked");
        disableButton(test);
      }
    }
  }

  const percent = Math.round((completedCount / tests.length) * 100);
  updateHeader(completedCount, percent, examCompleted);
  
  const finalWrapper = document.querySelector(".final-submit-wrapper");
  const finalBtn = document.querySelector(".final-submit-btn");
  let reExamBtn = document.getElementById("reExamBtn");
  
  if (completedCount === tests.length && !examCompleted) {
    finalWrapper.style.display = "block";
    finalBtn.style.display = "inline-flex";
    finalBtn.onclick = () => {
      CogniCareStorage.set("examCompleted", true);
      CogniCareStorage.set("lastAssessmentId", "cg-" + Date.now());
      window.location.href = "final-result.html";
    };
  } else if (examCompleted) {
    finalWrapper.style.display = "block";
    finalBtn.style.display = "none";
    if (!reExamBtn) {
      reExamBtn = document.createElement("button");
      reExamBtn.id = "reExamBtn";
      reExamBtn.className = "final-submit-btn";
      reExamBtn.innerText = "Start New Assessment";
      reExamBtn.onclick = resetExam;
      finalWrapper.appendChild(reExamBtn);
    }
  } else {
    finalWrapper.style.display = "none";
  }
}
function resetExam() { CogniCareStorage.resetExam(); window.location.href = "exam.html"; }
function goBack() { if (document.referrer && document.referrer.includes(window.location.origin)) window.history.back(); else window.location.href = "features.html"; }
renderDashboard();
