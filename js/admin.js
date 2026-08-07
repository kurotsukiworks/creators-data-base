// ======================================
// Creators Data Base Ver.2
// admin.js
// ======================================

const PIN = "8810";

const loginArea = document.getElementById("loginArea");
const adminArea = document.getElementById("adminArea");

const pinInput = document.getElementById("pinInput");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const loginMessage = document.getElementById("loginMessage");

// ======================================
// 起動時
// ======================================

window.addEventListener("load", () => {

    const login = sessionStorage.getItem("adminLogin");

    if (login === "true") {

        showAdmin();

    } else {

        hideAdmin();

    }

});

// ======================================
// ログイン
// ======================================

loginButton.addEventListener("click", login);

pinInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        login();

    }

});

function login() {

    const pin = pinInput.value.trim();

    if (pin === PIN) {

        sessionStorage.setItem("adminLogin", "true");

        showAdmin();

        return;

    }

    loginMessage.innerHTML = `
        <div class="error">
            PINコードが違います。
        </div>
    `;

    pinInput.value = "";

    pinInput.focus();

}

// ======================================
// ログアウト
// ======================================

logoutButton.addEventListener("click", () => {

    sessionStorage.removeItem("adminLogin");

    hideAdmin();

});

// ======================================
// 管理画面表示
// ======================================

function showAdmin() {

    loginArea.classList.add("hidden");

    adminArea.classList.remove("hidden");

}

// ======================================
// 管理画面非表示
// ======================================

function hideAdmin() {

    loginArea.classList.remove("hidden");

    adminArea.classList.add("hidden");

    pinInput.value = "";

    loginMessage.innerHTML = "";

}