// =====================================
// Creators Data Base Ver.2
// member.js
// Google Apps Script Version
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";

// ---------- データ ----------
let member = null;
let members = [];
let titles = [];
let beys = [];

// ---------- URLからID取得 ----------
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

if (!memberId) {

    alert("メンバーIDが指定されていません。");

    location.href = "members.html";

}

// =====================================
// 初期読込
// =====================================

async function initializePage() {

    try {

        const [

            membersData,

            titlesData,

            beysData

        ] = await Promise.all([

            fetch(API_URL + "?action=members")
                .then(res => res.json()),

            fetch(API_URL + "?action=titles")
                .then(res => res.json()),

            fetch(API_URL + "?action=beys")
                .then(res => res.json())

        ]);

        members = membersData;
        titles = titlesData;
        beys = beysData;

        member = members.find(m => m["ID"] == memberId);

        if (!member) {

            alert("メンバーが見つかりません。");

            location.href = "members.html";

            return;

        }

        loadProfile();
        loadRecord();

    }

    catch (error) {

        console.error(error);

        alert("データの読み込みに失敗しました。");

    }

}

// =====================================
// タイトル取得
// =====================================

function getTitleName(id){

    const title =
        titles.find(t=>t["ID"]===id);

    return title
        ? title["名前"]
        : "未設定";

}

// =====================================
// ベイ取得
// =====================================

function getBeyName(id){

    const bey =
        beys.find(b=>b["ID"]===id);

    return bey
        ? bey["名前"]
        : "未設定";

}

// =====================================
// プロフィール生成
// =====================================

function loadProfile() {

    const profileArea =
        document.getElementById("profileArea");

    profileArea.innerHTML = `

    <div class="card profileCard">

        <img
            src="${member["アイコン"] || "images/default.png"}"
            class="memberIcon">

        <h2>${member["名前"]}</h2>

        <p>ID : ${member["ID"]}</p>

    </div>

    <div class="card">

        <h2>🎖 称号</h2>

        <div class="bigText">

            ${getTitleName(member["選択称号"])}

        </div>

    </div>

    <div class="card">

        <h2>⭐ ポイント</h2>

        <div class="pointDisplay">

            ${member["ポイント"]} PT

        </div>

    </div>

    <div class="card">

        <h2>⚔ 相棒ベイ</h2>

        <div class="bigText">

            ${getBeyName(member["相棒ベイ"])}

        </div>

    </div>

    `;

}

// =====================================
// 戦績表示
// =====================================

function loadRecord(){

    const profileArea =
        document.getElementById("profileArea");

    profileArea.innerHTML += `

    <div class="card">

        <h2>🏆 戦績</h2>

        <div class="recordGrid">

            <div>

                優勝

                <p>${member["優勝"] || 0}</p>

            </div>

            <div>

                準優勝

                <p>${member["準優勝"] || 0}</p>

            </div>

            <div>

                3位

                <p>${member["3位"] || 0}</p>

            </div>

            <div>

                ベスト4

                <p>${member["ベスト4"] || 0}</p>

            </div>

        </div>

    </div>

    `;

}

// =====================================
// 初期化
// =====================================

initializePage();

// =====================================
// End
// =====================================