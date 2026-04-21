(function () {
  const PREFIX = "cognicare_";
  function key(name) { return `${PREFIX}${name}`; }
  function get(name, fallback = null) { const value = localStorage.getItem(key(name)); return value === null ? fallback : value; }
  function getNumber(name, fallback = 0) { const value = Number(get(name, fallback)); return Number.isFinite(value) ? value : fallback; }
  function getBoolean(name) { return get(name) === "true"; }
  function getJSON(name, fallback = null) { try { const value = get(name); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
  function set(name, value) { localStorage.setItem(key(name), String(value)); }
  function setJSON(name, value) { localStorage.setItem(key(name), JSON.stringify(value)); }
  function remove(name) { localStorage.removeItem(key(name)); }
  function getAllScores() { return { memory: getNumber("memoryScore", 0), attention: getNumber("attentionScore", 0), executive: getNumber("executiveScore", 0), language: getNumber("languageScore", 0), orientation: getNumber("orientationScore", 0), visual: getNumber("visualScore", 0) }; }
  function getHistory() { return getJSON("assessmentHistory", []) || []; }
  function saveAssessment(record) { const history = getHistory(); if (!record || !record.id) return; if (!history.some(item => item.id === record.id)) { history.unshift(record); setJSON("assessmentHistory", history.slice(0, 12)); saveAssessmentToBackend(record); } }
  async function saveAssessmentToBackend(record) { if (!CogniCareAuth.isAuthenticated()) return; try { const response = await fetch(`${CogniCareAuth.API_URL}/assessments`, { method: "POST", headers: { "Content-Type": "application/json", ...CogniCareAuth.getAuthHeaders() }, body: JSON.stringify({ memory_score: record.scores.memory, attention_score: record.scores.attention, executive_score: record.scores.executive, language_score: record.scores.language, orientation_score: record.scores.orientation, visual_score: record.scores.visual }) }); if (!response.ok) console.error("Failed to sync assessment to backend"); else { const data = await response.json(); record.backend_id = data.id; set("lastAssessmentSaved", "true"); } } catch (e) { console.error("Error syncing to backend:", e); } }
  async function syncHistory() { if (!CogniCareAuth.isAuthenticated()) return; try { const response = await fetch(`${CogniCareAuth.API_URL}/assessments`, { headers: CogniCareAuth.getAuthHeaders() }); if (response.ok) { const data = await response.json(); const formatted = data.map(item => ({ id: "cg-" + item.id, completedAt: new Date(item.completed_at).toLocaleString(), totalScore: item.total_score, totalMax: 19, percentage: Math.round((item.total_score / 19) * 100), risk: "Report-Synced", scores: { memory: item.memory_score, attention: item.attention_score, executive: item.executive_score, language: item.language_score, orientation: item.orientation_score, visual: item.visual_score } })); setJSON("assessmentHistory", formatted.slice(0, 12)); return formatted; } } catch (e) { console.error("Error fetching history:", e); } }
  function resetExam() { ["memoryScore","attentionScore","executiveScore","languageScore","orientationScore","visualScore","memoryTestCompleted","attentionTestCompleted","executiveTestCompleted","languageTestCompleted","orientationTestCompleted","visualTestCompleted","examCompleted","lastAssessmentId","lastAssessmentSaved"].forEach(remove); }
  function handleExit() {
    let modal = document.getElementById("cognicareExitModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "cognicareExitModal";
      modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.2s ease;";
      modal.innerHTML = `
        <div style="background:#0a1224;border:1px solid rgba(122,173,255,0.18);padding:32px;border-radius:22px;text-align:center;max-width:380px;box-shadow:0 22px 60px rgba(0,0,0,0.5);transform:scale(0.95);transition:transform 0.2s ease;" id="cognicareExitBox">
          <h3 style="margin:0 0 12px;font-size:1.4rem;color:#eff5ff;">Abandon Assessment?</h3>
          <p style="color:#9caed1;margin:0 0 24px;line-height:1.6;font-size:0.95rem;">Are you sure you want to exit? Your current progress in this module will be lost.</p>
          <div style="display:flex;gap:12px;justify-content:center;">
            <button onclick="document.getElementById('cognicareExitModal').style.opacity='0';document.getElementById('cognicareExitBox').style.transform='scale(0.95)';setTimeout(()=>document.getElementById('cognicareExitModal').style.display='none',200);" style="padding:12px 24px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);color:#eff5ff;cursor:pointer;font-weight:600;transition:background 0.2s;">Cancel</button>
            <button onclick="window.location.href='exam.html'" style="padding:12px 24px;border-radius:999px;background:#ff7d7d;border:none;color:#05111e;font-weight:800;cursor:pointer;transition:transform 0.2s;">Yes, Exit</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      // Trigger animations
      requestAnimationFrame(() => {
        modal.style.display = "flex";
        requestAnimationFrame(() => {
          modal.style.opacity = "1";
          document.getElementById('cognicareExitBox').style.transform = "scale(1)";
        });
      });
    } else {
      modal.style.display = "flex";
      requestAnimationFrame(() => {
        modal.style.opacity = "1";
        document.getElementById('cognicareExitBox').style.transform = "scale(1)";
      });
    }
  }
  window.CogniCareStorage = { key, get, getNumber, getBoolean, getJSON, set, setJSON, remove, getAllScores, getHistory, saveAssessment, resetExam, syncHistory, saveAssessmentToBackend, handleExit };
})();
