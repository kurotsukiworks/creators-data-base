// ======================================
// Creators Data Base Ver.2.3
// point.js
// 管理者ポイント管理
// ======================================


// ==============================
// GAS URL
// ==============================

const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";


// ==============================
// Data
// ==============================

let members = [];

let selectedMember = null;

let pointChange = 0;


// ==============================
// 要素取得
// ==============================

const memberSelect =
document.getElementById(
    "memberSelect"
);


const currentPoint =
document.getElementById(
    "currentPoint"
);


const selectedPoint =
document.getElementById(
    "selectedPoint"
);


const reasonSelect =
document.getElementById(
    "reasonSelect"
);


const otherReason =
document.getElementById(
    "otherReason"
);


const saveButton =
document.getElementById(
    "savePoint"
);


// ==============================
// 初期化
// ==============================

async function initialize(){

    try{

        const response =
        await fetch(
            API_URL +
            "?action=members"
        );


        if(!response.ok){

            throw new Error(
                "Members API Error"
            );

        }


        const data =
        await response.json();


        if(!Array.isArray(data)){

            throw new Error(
                "メンバーデータが不正です。"
            );

        }


        members = data;


        loadMemberList();


        if(members.length > 0){

            memberSelect.value =
            String(
                members[0]["ID"]
            );

            loadMember(
                memberSelect.value
            );

        }

    }

    catch(error){

        console.error(
            "Point Initialize Error:",
            error
        );


        alert(
            "メンバーデータを読み込めませんでした。"
        );

    }

}


// ==============================
// メンバー一覧
// ==============================

function loadMemberList(){

    memberSelect.innerHTML = "";


    const defaultOption =
    document.createElement(
        "option"
    );


    defaultOption.value = "";


    defaultOption.textContent =
    "メンバーを選択してください";


    memberSelect.appendChild(
        defaultOption
    );


    members.forEach(
        member => {

            const option =
            document.createElement(
                "option"
            );


            option.value =
            String(
                member["ID"]
            );


            option.textContent =
            `${member["名前"]}（${member["ID"]}）`;


            memberSelect.appendChild(
                option
            );

        }
    );

}


// ==============================
// メンバー変更
// ==============================

memberSelect.addEventListener(
    "change",
    () => {

        loadMember(
            memberSelect.value
        );

    }
);


// ==============================
// メンバー表示
// ==============================

function loadMember(id){

    selectedMember =
    members.find(
        member =>
        String(
            member["ID"]
        ) === String(id)
    );


    if(!selectedMember){

        currentPoint.textContent =
        "0 PT";

        pointChange = 0;

        selectedPoint.textContent =
        "0";

        return;

    }


    const point =
    Number(
        selectedMember["ポイント"]
    ) || 0;


    currentPoint.textContent =
    `${point} PT`;


    pointChange = 0;


    selectedPoint.textContent =
    "0";

}


// ==============================
// ポイントボタン
// ==============================

document
.querySelectorAll(".pointBtn")
.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                pointChange +=
                Number(
                    button.dataset.value
                );


                selectedPoint.textContent =
                pointChange;

            }
        );

    }
);


// ==============================
// その他理由
// ==============================

reasonSelect.addEventListener(
    "change",
    () => {

        if(
            reasonSelect.value ===
            "その他"
        ){

            otherReason.style.display =
            "block";

        }
        else{

            otherReason.style.display =
            "none";

            otherReason.value =
            "";

        }

    }
);


// ==============================
// 保存
// ==============================

saveButton.addEventListener(
    "click",
    savePoint
);


// ==============================
// ポイント保存
// ==============================

async function savePoint(){

    if(!selectedMember){

        alert(
            "メンバーを選択してください。"
        );

        return;

    }


    if(pointChange === 0){

        alert(
            "ポイントを選択してください。"
        );

        return;

    }


    let reason =
    reasonSelect.value;


    if(reason === ""){

        alert(
            "理由を選択してください。"
        );

        return;

    }


    if(reason === "その他"){

        if(
            otherReason.value
            .trim() === ""
        ){

            alert(
                "理由を入力してください。"
            );

            return;

        }


        reason =
        otherReason.value.trim();

    }


    const current =
    Number(
        selectedMember["ポイント"]
    ) || 0;


    const newPoint =
    current + pointChange;


    if(newPoint < 0){

        alert(
            "ポイントは0未満にできません。"
        );

        return;

    }


    const confirmMessage =

`【ポイント変更確認】

メンバー：${selectedMember["名前"]}

現在：${current} PT

変更：
${pointChange > 0 ? "+" : ""}${pointChange} PT

変更後：${newPoint} PT

理由：${reason}

この内容で保存しますか？`;


    if(!confirm(confirmMessage)){

        return;

    }


    // ==========================
    // 二重クリック防止
    // ==========================

    saveButton.disabled = true;

    saveButton.textContent =
    "保存中...";


    try{

        // ==========================
        // GASへ送信
        // ==========================

        const response =
        await fetch(

            API_URL,

            {

                method:
                "POST",

                body:
                JSON.stringify({

                    action:
                    "adminpoint",

                    ID:
                    String(
                        selectedMember["ID"]
                    ),

                    増減:
                    pointChange,

                    理由:
                    reason

                })

            }

        );


        if(!response.ok){

            throw new Error(
                "HTTP Error : " +
                response.status
            );

        }


        const result =
        await response.json();


        console.log(
            "Point API Result:",
            result
        );


        // ==========================
        // GAS側エラー
        // ==========================

        if(!result.success){

            alert(

                "ポイント変更に失敗しました。\n\n" +

                (
                    result.message
                    ||
                    "不明なエラー"
                )

            );

            return;

        }


        // ==========================
        // 成功
        // ==========================

        alert(

`ポイントを変更しました！

メンバー：
${selectedMember["名前"]}

変更：
${pointChange > 0 ? "+" : ""}${pointChange} PT

現在ポイント：
${result.point} PT

理由：
${reason}`

        );


        // ==========================
        // ローカルデータ更新
        // ==========================

        selectedMember["ポイント"] =
        Number(
            result.point
        );


        currentPoint.textContent =
        `${result.point} PT`;


        pointChange = 0;


        selectedPoint.textContent =
        "0";


        reasonSelect.value =
        "";


        otherReason.value =
        "";


        otherReason.style.display =
        "none";

    }


    catch(error){

        console.error(
            "Point Save Error:",
            error
        );


        alert(

            "通信エラーが発生しました。\n\n" +

            "GASとの通信に失敗しました。"

        );

    }


    finally{

        saveButton.disabled =
        false;

        saveButton.textContent =
        "保存";

    }

}


// ==============================
// 起動
// ==============================

initialize();


// ======================================
// End point.js
// ======================================