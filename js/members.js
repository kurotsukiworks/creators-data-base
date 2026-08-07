// ======================================
// Creators Data Base Ver.2
// members.js
// Google Apps Script Version
// ======================================

const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";

const memberList = document.getElementById("memberList");

let members = [];
let titles = [];
let beys = [];

// ==============================
// データ読込
// ==============================

async function loadMembers() {

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

        drawMembers();

    }

    catch (error) {

        console.error(error);

        memberList.innerHTML = `

            <div class="error">

                データの読み込みに失敗しました。

            </div>

        `;

    }

}

// ==============================
// タイトル取得
// ==============================

function getTitleName(id){

    const title =
        titles.find(t=>t["ID"]===id);

    return title
        ? title["名前"]
        : "未設定";

}

// ==============================
// ベイ取得
// ==============================

function getBeyName(id){

    const bey =
        beys.find(b=>b["ID"]===id);

    return bey
        ? bey["名前"]
        : "未設定";

}

// ==============================
// メンバー表示
// ==============================

function drawMembers(){

    memberList.innerHTML = "";

    members.forEach(member=>{

        const card =
            document.createElement("div");

        card.className =
            "memberCard fadeIn";

        card.innerHTML = `

            <img
                src="${member["アイコン"] || "images/default.png"}"
                class="memberIcon"
                alt="${member["名前"]}"
            >

            <div class="memberInfo">

                <div class="memberName">

                    ${member["名前"]}

                </div>

                <div class="memberTitle">

                    🏆 ${getTitleName(member["選択称号"])}

                </div>

                <div class="memberTitle">

                    ⚔ ${getBeyName(member["相棒ベイ"])}

                </div>

                <div class="memberPoint">

                    ⭐ ${member["ポイント"]} PT

                </div>

            </div>

        `;

        card.onclick = ()=>{

            location.href =
            `member.html?id=${member["ID"]}`;

        };

        memberList.appendChild(card);

    });

}

// ==============================
// 初期化
// ==============================

loadMembers();