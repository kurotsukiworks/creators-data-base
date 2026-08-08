// ======================================
// Creators Data Base Ver.2
// mypage.js
// Google Apps Script Edition
// Title Unlock Edition
// ======================================


// ==============================
// GAS URL
// ==============================

const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";


// ==============================
// Data
// ==============================

let member = null;

let titles = [];

let beys = [];

let memberTitles = [];


// ==============================
// Token取得
// ==============================

const params =
new URLSearchParams(
    window.location.search
);

const token =
params.get("token");


if(!token){

    alert(
        "Tokenがありません。"
    );

    location.href =
    "index.html";

}


// ==============================
// 初期読み込み
// ==============================

async function initializePage(){

    try{

        // ------------------------------
        // Members
        // ------------------------------

        const membersData =
        await fetch(
            API_URL +
            "?action=members"
        )
        .then(
            res => res.json()
        );


        // ------------------------------
        // Titles
        // ------------------------------

        const titlesData =
        await fetch(
            API_URL +
            "?action=titles"
        )
        .then(
            res => res.json()
        );


        // ------------------------------
        // Beys
        // ------------------------------

        const beysData =
        await fetch(
            API_URL +
            "?action=beys"
        )
        .then(
            res => res.json()
        );


        // ------------------------------
        // MemberTitles
        // ------------------------------

        const memberTitlesData =
        await fetch(
            API_URL +
            "?action=membertitles"
        )
        .then(
            res => res.json()
        );


        // ------------------------------
        // Dataセット
        // ------------------------------

        titles =
        titlesData;

        beys =
        beysData;

        memberTitles =
        memberTitlesData;


        // ------------------------------
        // メンバー検索
        // ------------------------------

        member =
        membersData.find(

            m =>

            String(m.Token)
            ===
            String(token)

        );


        if(!member){

            alert(
                "メンバーが見つかりません。"
            );

            location.href =
            "index.html";

            return;

        }


        // ------------------------------
        // ページ表示
        // ------------------------------

        loadProfile();


    }

    catch(error){

        console.error(
            "読み込みエラー",
            error
        );

        alert(
            "データの読み込みに失敗しました。"
        );

    }

}


// ==============================
// プロフィール表示
// ==============================

function loadProfile(){

    // ------------------------------
    // 名前
    // ------------------------------

    const name =
    document.getElementById(
        "memberName"
    );

    if(name){

        name.textContent =
        member["名前"] || "";

    }


    // ------------------------------
    // ID
    // ------------------------------

    const id =
    document.getElementById(
        "memberId"
    );

    if(id){

        id.textContent =
        "ID : " +
        member["ID"];

    }


    // ------------------------------
    // ポイント
    // ------------------------------

    const point =
    document.getElementById(
        "memberPoint"
    );

    if(point){

        point.textContent =
        (member["ポイント"] || 0)
        +
        " PT";

    }


    // ------------------------------
    // アイコン
    // ------------------------------

    const icon =
    document.getElementById(
        "memberIcon"
    );

    if(icon){

        icon.src =
        member["アイコン"]
        ||
        "images/default.png";

    }


    // ------------------------------
    // 戦績
    // ------------------------------

    loadRecord();


    // ------------------------------
    // 獲得称号
    // ------------------------------

    loadTitles();


    // ------------------------------
    // 相棒ベイ
    // ------------------------------

    loadPartner();

}


// ======================================
// 戦績表示
// ======================================

function loadRecord(){

    const recordList = [

        {
            id:"championCount",
            key:"優勝"
        },

        {
            id:"runnerUpCount",
            key:"準優勝"
        },

        {
            id:"thirdCount",
            key:"3位"
        },

        {
            id:"best4Count",
            key:"ベスト4"
        }

    ];


    recordList.forEach(item => {

        const element =
        document.getElementById(
            item.id
        );


        if(element){

            element.textContent =
            member[item.key] || 0;

        }

    });

}


// ======================================
// 獲得済み称号一覧
// ======================================

function loadTitles(){

    const select =
    document.getElementById(
        "titleSelect"
    );


    if(!select){

        return;

    }


    select.innerHTML = "";


    // ------------------------------
    // 獲得しているTitleIDだけ取得
    // ------------------------------

    const ownedTitleIds =

    memberTitles

    .filter(

        item =>

        String(item["MemberID"])
        ===
        String(member["ID"])

    )

    .map(

        item =>
        String(item["TitleID"])

    );


    // ------------------------------
    // 獲得称号を表示
    // ------------------------------

    titles.forEach(title => {


        // 公開されている称号のみ

        const isPublic =

        title["公開"] === true

        ||

        String(title["公開"])
        .toLowerCase()
        ===
        "true";


        if(!isPublic){

            return;

        }


        // --------------------------
        // このメンバーが持っているか
        // --------------------------

        const titleId =
        String(title["ID"]);


        if(
            !ownedTitleIds.includes(titleId)
        ){

            return;

        }


        // --------------------------
        // option作成
        // --------------------------

        const option =
        document.createElement(
            "option"
        );


        option.value =
        title["ID"];


        option.textContent =
        title["名前"];


        // 現在選択中の称号

        if(

            String(title["ID"])
            ===
            String(member["選択称号"])

        ){

            option.selected =
            true;

        }


        select.appendChild(
            option
        );


    });


    // ------------------------------
    // 称号が1つもない場合
    // ------------------------------

    if(select.options.length === 0){

        const option =
        document.createElement(
            "option"
        );

        option.value = "";

        option.textContent =
        "獲得称号なし";

        select.appendChild(
            option
        );

    }

}


// ======================================
// ベイ一覧
// ======================================

function loadPartner(){

    const select =
    document.getElementById(
        "partnerSelect"
    );


    if(!select){

        return;

    }


    select.innerHTML = "";


    beys.forEach(bey => {


        const isPublic =

        bey["公開"] === true

        ||

        String(bey["公開"])
        .toLowerCase()
        ===
        "true";


        if(!isPublic){

            return;

        }


        const option =
        document.createElement(
            "option"
        );


        option.value =
        bey["ID"];


        option.textContent =

        `${bey["名前"]} (${bey["タイプ"]})`;


        if(

            String(bey["ID"])
            ===
            String(member["相棒ベイ"])

        ){

            option.selected =
            true;

        }


        select.appendChild(
            option
        );


    });

}


// ======================================
// プロフィール保存
// ======================================

async function saveProfile(){

    try{

        const titleSelect =
        document.getElementById(
            "titleSelect"
        );


        const partnerSelect =
        document.getElementById(
            "partnerSelect"
        );


        const selectedTitle =

        titleSelect
        ?
        titleSelect.value
        :
        "";


        const selectedPartner =

        partnerSelect
        ?
        partnerSelect.value
        :
        "";


        // ------------------------------
        // 送信データ
        // ------------------------------

        const sendData = {

            action:
            "updatemember",

            ID:
            member["ID"],

            選択称号:
            selectedTitle,

            相棒ベイ:
            selectedPartner

        };


        console.log(
            "送信データ",
            sendData
        );


        // ------------------------------
        // GASへ送信
        // ------------------------------

        const response =

        await fetch(

            API_URL,

            {

                method:"POST",

                body:
                JSON.stringify(
                    sendData
                )

            }

        );


        const result =
        await response.json();


        console.log(
            "GAS返答",
            result
        );


        // ------------------------------
        // 保存失敗
        // ------------------------------

        if(!result.success){

            alert(

                "保存失敗\n\n"

                +

                result.message

            );

            return;

        }


        // ------------------------------
        // 表示中データ更新
        // ------------------------------

        member["選択称号"] =
        selectedTitle;


        member["相棒ベイ"] =
        selectedPartner;


        alert(
            "保存しました！"
        );


    }

    catch(error){

        console.error(
            "保存エラー",
            error
        );


        alert(
            "通信エラーが発生しました。"
        );

    }

}


// ======================================
// 保存ボタン登録
// ======================================

const saveButton =
document.getElementById(
    "saveButton"
);


if(saveButton){

    saveButton.addEventListener(
        "click",
        saveProfile
    );

}


// ======================================
// 起動
// ======================================

initializePage();


// ======================================
// End
// ======================================