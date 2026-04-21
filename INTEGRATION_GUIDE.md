# CogniCare Frontend Integration Guide

This guide explains how to connect your existing HTML/JS files to the new **FastAPI** backend without losing your current progress.

## 1. How to Start the Backend
Before you can use the API, you need to have the backend running.

### Installation
Open your terminal in the `CogniCare` folder and run:
```bash
pip install -r requirements.txt
```

### Running the Server
Run the following command to start the backend:
```bash
python -m uvicorn main:app --reload
```
The backend will be available at `http://127.0.0.1:8000`.

---

## 2. API Documentation
One of the best features of FastAPI is the built-in documentation. Once the server is running, visit:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**
Here you can test all endpoints (Register, Login, Save Assessment) directly from your browser.

---

## 3. Connecting your JavaScript
Since you didn't want any changes to your existing frontend, you can use the following approach to sync your data.

### Step A: Create an `api.js` file
Create a new file called `api.js` and paste this code:

```javascript
const API_URL = "http://127.0.0.1:8000";

const API = {
    async register(email, password) {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    async login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem("cognicare_token", data.access_token);
        }
        return data;
    },

    async saveAssessment(scores) {
        const token = localStorage.getItem("cognicare_token");
        const response = await fetch(`${API_URL}/assessments`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(scores)
        });
        return response.json();
    }
};
```

### Step B: Link it in your HTML
Add this tag to your HTML files (e.g., `login.html`, `final-result.html`):
```html
<script src="api.js"></script>
```

### Step C: Call the API
In your existing JavaScript (like `final-result.js`), when the assessment is done, you can call:
```javascript
const scores = CogniCareStorage.getAllScores();
API.saveAssessment(scores).then(result => {
    console.log("Saved to server!", result);
});
```

---

## 4. Current State
Your app will continue to work offline using `localStorage` exactly as it does now. This backend is a **ready-to-use engine** that you can plug in whenever you're ready to add multi-user support or cloud storage.
