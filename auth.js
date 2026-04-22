const CogniCareAuth = (function () {
  const API_URL = "http://127.0.0.1:8000";

  function setToken(token) {
    localStorage.setItem("cognicare_access_token", token);
  }

  function getToken() {
    return localStorage.getItem("cognicare_access_token");
  }

  function clearToken() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("cognicare_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  function isAuthenticated() {
    return !!getToken();
  }

  async function register(email, password) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  }

  async function login(email, password) {
    clearToken();
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    setToken(data.access_token);
    localStorage.setItem("cognicare_user_email", email);
    return data;
  }

  function logout() {
    clearToken();
    window.location.href = "login.html";
  }

  function checkAuth() {
    if (!isAuthenticated()) {
      // Immediate redirect to prevent accidental interaction with secret content
      window.location.replace("login.html");
      return false;
    }
    return true;
  }

  function getAuthHeaders() {
    const token = getToken();
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }

  return {
    API_URL,
    register,
    login,
    logout,
    isAuthenticated,
    checkAuth,
    getAuthHeaders,
    getToken
  };
})();
