// ======================================
// Creators Data Base Ver.2
// mypage.js
// Google Apps Script Edition
// QR Authentication Edition
// Complete Version
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


// ==============================
// URL Token
// ==============================

const params =
new URLSearchParams(
    window.location.search
);

const token =
params.get("token");


// ==============================
// QR認証チェック
// ==============================

const qrAuthenticated =
sessionStorage.getItem(
    "qrAuthenticated"
);

const qrToken =
sessionStorage.getItem(
    "qrToken"
);


// ==============================
// QR経由でない場合
// ==============================

if(

    qrAuthenticated !== "true"

    ||

    !token

    ||

    qrToken !== token

){

    alert(
        "QRコードを読み込んでください。"
    );

    location.replace(
        "qr.html"
    );

}


// ==============================
// Data読み込み
// ==============================

async function initializePage(){

    try{

        // ==========================
        // Members
        // ==========================

        const membersData =
        await fetch(

            API_URL +
            "?action=members"

        ).then(

            res => {

                if(!res.ok){

                    throw new Error(
                        "Members API Error"
                    );

                }

                return res.json();

            }

        );


        // ==========================
        // Titles
        // ==========================

        const titlesData =
        await fetch(

            API_URL +
            "?action=titles"

        ).then(

            res => {

                if(!res.ok){

                    throw new Error(
                        "Titles API Error"
                    );

                }

                return res.json();

            }

        );


        // ==========================
        // Beys
        // ==========================

        const beysData =
        await fetch(

            API_URL +
            "?action=beys"

        ).then(

            res => {

                if(!res.ok){

                    throw new Error(
                        "Beys API Error"
                    );

                }

                return res.json();

            }

        );


        // ==========================
        // 保存
        // ==========================

        titles =
        titlesData;

        beys =
        beysData;


        // ==========================
        // Member検索
        // ==========================

        member =
        membersData.find(

            m =>

            String(m["Token"])
            ===
            String(token)

        );


        if(!member){

            alert(
                "メンバーが見つかりません。"
            );

            sessionStorage.clear();

            location.replace(
                "qr.html"
            );

            return;

        }
        

// ==========================
// QRログインボーナス
// ==========================

try{

    const bonusResponse =
    await fetch(

        API_URL,

        {

            method:"POST",

            body:
            JSON.stringify({

                action:
                "loginbonus",

                ID:
                member["ID"]

            })

        }

    );


    const bonusResult =
    await bonusResponse.json();


    console.log(
        "ログインボーナス結果",
        bonusResult
    );


    // ==========================
    // ログインボーナス成功
    // ==========================

    if(bonusResult.success){

        if(
            Number(bonusResult.point) > 0
        ){

            member["ポイント"] =
            Number(
                member["ポイント"] || 0
            )
            +
            Number(
                bonusResult.point
            );


            alert(

`🎁 ログインボーナスGET！

${bonusResult.point} PT
獲得しました！

現在のポイント：
${member["ポイント"]} PT`

            );

        }

    }


    // ==========================
    // GAS側エラー
    // ==========================

    else{

        console.error(
            "ログインボーナスエラー:",
            bonusResult.message
        );

    }

}

catch(error){

    console.error(
        "ログインボーナス通信エラー:",
        error
    );

}
        // ==========================
        // 表示
        // ==========================

        loadProfile();


    }

    catch(error){

        console.error(
            "Mypage Error:",
            error
        );

        alert(
            "データの読み込みに失敗しました。"
        );

    }

}


// ==============================
// プロフィール
// ==============================

function loadProfile(){

    const name =
    document.getElementById(
        "memberName"
    );

    if(name){

        name.textContent =
        member["名前"] || "";

    }


    const id =
    document.getElementById(
        "memberId"
    );

    if(id){

        id.textContent =
        "ID : " +
        (member["ID"] || "");

    }


    const point =
    document.getElementById(
        "memberPoint"
    );

    if(point){

        point.textContent =
        (member["ポイント"] || 0) +
        " PT";

    }


    const icon =
    document.getElementById(
        "memberIcon"
    );

    if(icon){

        icon.src =
        member["アイコン"] ||
        "images/default.png";

    }


    loadRecord();

    loadTitles();

    loadPartner();

}


// ==============================
// 戦績
// ==============================

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


    recordList.forEach(

        item => {

            const element =
            document.getElementById(
                item.id
            );


            if(element){

                element.textContent =
                member[item.key] || 0;

            }

        }

    );

}


// ==============================
// 獲得済み称号
// ==============================

async function loadTitles(){

    const select =
    document.getElementById(
        "titleSelect"
    );


    if(!select){

        return;

    }


    select.innerHTML = "";


    // ==========================
    // MemberTitles取得
    // ==========================

    let memberTitles = [];


    try{

        memberTitles =
        await fetch(

            API_URL +
            "?action=membertitles"

        ).then(

            res => res.json()

        );

    }

    catch(error){

        console.error(
            "MemberTitles Error:",
            error
        );

        select.innerHTML =

        `<option value="">
            称号を読み込めません
        </option>`;

        return;

    }


    // ==========================
    // 自分が持っている称号
    // ==========================

    const ownedTitleIds =

    memberTitles

    .filter(

        item =>

        String(
            item["MemberID"]
        )

        ===

        String(
            member["ID"]
        )

    )

    .map(

        item =>
        String(
            item["TitleID"]
        )

    );


    // ==========================
    // Titlesと照合
    // ==========================

    titles.forEach(

        title => {


            const isPublic =

            title["公開"] === true

            ||

            String(
                title["公開"]
            )
            .toLowerCase()
            ===
            "true";


            if(!isPublic){

                return;

            }


            const titleId =
            String(title["ID"]);


            // ======================
            // 未獲得なら表示しない
            // ======================

            if(

                !ownedTitleIds.includes(
                    titleId
                )

            ){

                return;

            }


            const option =
            document.createElement(
                "option"
            );


            option.value =
            title["ID"];


            option.textContent =
            title["名前"];


            if(

                String(title["ID"])
                ===
                String(
                    member["選択称号"]
                )

            ){

                option.selected =
                true;

            }


            select.appendChild(
                option
            );


        }

    );


    // ==========================
    // 称号が1つもない場合
    // ==========================

    if(
        select.options.length === 0
    ){

        const option =
        document.createElement(
            "option"
        );

        option.value = "";

        option.textContent =
        "称号なし";

        select.appendChild(
            option
        );

    }

}


// ==============================
// 相棒ベイ
// ==============================

function loadPartner(){

    const select =
    document.getElementById(
        "partnerSelect"
    );


    if(!select){

        return;

    }


    select.innerHTML = "";


    beys.forEach(

        bey => {


            const isPublic =

            bey["公開"] === true

            ||

            String(
                bey["公開"]
            )
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
                String(
                    member["相棒ベイ"]
                )

            ){

                option.selected =
                true;

            }


            select.appendChild(
                option
            );


        }

    );

}


// ==============================
// 保存
// ==============================

async function saveProfile(){

    if(!member){

        return;

    }


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


        if(!result.success){

            alert(

                "保存に失敗しました。\n\n" +

                result.message

            );

            return;

        }


        // ==========================
        // 表示中データ更新
        // ==========================

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
            "保存エラー:",
            error
        );


        alert(
            "通信エラーが発生しました。"
        );

    }

}


// ==============================
// 保存ボタン
// ==============================

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


// ==============================
// 起動
// ==============================

if(

    qrAuthenticated === "true"

    &&

    token

    &&

    qrToken === token

){

    initializePage();

}


// ==============================
// End
// ==============================