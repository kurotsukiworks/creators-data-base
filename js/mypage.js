// ======================================
// Creators Data Base Ver.2
// mypage.js（Google Apps Script版）
// Complete Edition - Part 1
// ======================================

const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";

let member = null;
let titles = [];
let beys = [];

// ==============================
// URLからToken取得
// ==============================

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (!token) {

    alert("Tokenがありません。");

    location.href = "index.html";

}

// ==============================
// 初期読込
// ==============================

async function initializePage() {

    try {

        const [

            members,

            titlesData,

            beysData

        ] = await Promise.all([

            fetch(API_URL + "?action=members")
            .then(r => r.json()),

            fetch(API_URL + "?action=titles")
            .then(r => r.json()),

            fetch(API_URL + "?action=beys")
            .then(r => r.json())

        ]);

        titles = titlesData;
        beys = beysData;

        member =
        members.find(m=>m.Token===token);

        if(!member){

            alert("メンバーが見つかりません。");

            location.href="index.html";

            return;

        }

        loadProfile();

    }

    catch(err){

        console.error(err);

        alert("データの読み込みに失敗しました。");

    }

}

// ==============================
// プロフィール表示
// ==============================

function loadProfile(){

    document.getElementById("memberName").textContent =
    member["名前"];

    document.getElementById("memberId").textContent =
    "ID : " + member["ID"];

    document.getElementById("memberPoint").textContent =
    member["ポイント"] + " PT";

    document.getElementById("memberIcon").src =
    member["アイコン"] || "images/default.png";

    loadRecord();

    loadTitles();

    loadPartner();

}

// ==============================
// 戦績表示
// ==============================

function loadRecord(){

    document.getElementById("championCount").textContent =
        member["優勝"] || 0;

    document.getElementById("runnerUpCount").textContent =
        member["準優勝"] || 0;

    document.getElementById("thirdCount").textContent =
        member["3位"] || 0;

    document.getElementById("best4Count").textContent =
        member["ベスト4"] || 0;

}



// ==============================
// 称号一覧
// ==============================

function loadTitles(){

    const select =
        document.getElementById("titleSelect");

    select.innerHTML = "";

    titles
        .filter(title => {

            return String(title["公開"]) === "TRUE"
                || String(title["公開"]) === "true"
                || title["公開"] === true;

        })
        .forEach(title=>{

            const option =
                document.createElement("option");

            option.value =
                title["ID"];

            option.textContent =
                title["名前"];

            if(
                title["ID"] ===
                member["選択称号"]
            ){

                option.selected = true;

            }

            select.appendChild(option);

        });

}



// ==============================
// 相棒ベイ一覧
// ==============================

function loadPartner(){

    const select =
        document.getElementById("partnerSelect");

    select.innerHTML = "";

    beys
        .filter(bey=>{

            return String(bey["公開"]) === "TRUE"
                || String(bey["公開"]) === "true"
                || bey["公開"] === true;

        })
        .forEach(bey=>{

            const option =
                document.createElement("option");

            option.value =
                bey["ID"];

            option.textContent =
                `${bey["名前"]} (${bey["タイプ"]})`;

            if(
                bey["ID"] ===
                member["相棒ベイ"]
            ){

                option.selected = true;

            }

            select.appendChild(option);

        });

}

// ==============================
// 保存
// ==============================

async function saveProfile(){

    try{

        const selectedTitle =
            document.getElementById("titleSelect").value;

        const partner =
            document.getElementById("partnerSelect").value;

        const result = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action:"updateMember",

                ID:member["ID"],

                選択称号:selectedTitle,

                相棒ベイ:partner

            })

        });

        const json = await result.json();

        if(!json.success){

            alert("保存に失敗しました。");

            return;

        }

        member["選択称号"] = selectedTitle;
        member["相棒ベイ"] = partner;

        alert("保存しました！");

    }

    catch(err){

        console.error(err);

        alert("通信エラーが発生しました。");

    }

}



// ==============================
// 保存ボタン
// ==============================

document
.getElementById("saveButton")
.addEventListener("click",saveProfile);



// ==============================
// 初期化開始
// ==============================

initializePage();