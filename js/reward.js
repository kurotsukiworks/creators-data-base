// ======================================
// Creators Data Base Ver.2.3
// reward.js
// 景品交換システム
// QR Authentication Edition
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

let rewards = [];

let selectedReward = null;


// ==============================
// URL Token
// ==============================

const params =
new URLSearchParams(
    window.location.search
);

const token =
params.get("token")
||
sessionStorage.getItem("qrToken");


// ==============================
// QR認証
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
// QR認証チェック
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
// 要素取得
// ==============================

const memberName =
document.getElementById(
    "memberName"
);


const memberPoint =
document.getElementById(
    "memberPoint"
);


const rewardList =
document.getElementById(
    "rewardList"
);


// ==============================
// 初期化
// ==============================

async function initializePage(){

    try{

        // ==========================
        // Members取得
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
        // メンバー検索
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
        // メンバー情報表示
        // ==========================

        loadMember();


        // ==========================
        // 景品表示
        // ==========================

        loadRewards();

    }

    catch(error){

        console.error(
            "Reward Initialize Error:",
            error
        );

        alert(
            "データの読み込みに失敗しました。"
        );

    }

}


// ==============================
// メンバー情報
// ==============================

function loadMember(){

    if(memberName){

        memberName.textContent =
        member["名前"] || "";

    }


    if(memberPoint){

        memberPoint.textContent =

        (
            Number(
                member["ポイント"]
            ) || 0
        )
        +
        " PT";

    }

}


// ==============================
// 景品一覧
// ==============================

function loadRewards(){

    if(!rewardList){

        return;

    }


    rewardList.innerHTML = "";


    rewards = [

        {
            id: "REWARD001",
            name: "限定ステッカー",
            point: 100,
            description: "Creators限定ステッカー"
        },

        {
            id: "REWARD002",
            name: "限定バトルパスシート",
            point: 200,
            description: "Creators限定バトルパスシート"
        },

        {
            id: "REWARD003",
            name: "限定BIGステッカー",
            point: 300,
            description: "Creators限定BIGステッカー"
        },

        {
            id: "REWARD004",
            name: "ステッカー無料オーダー権",
            point: 350,
            description: "ステッカー1枚を無料でオーダーできます"
        },

        {
            id: "REWARD005",
            name: "パスシート無料オーダー権",
            point: 350,
            description: "バトルパスシート1枚を無料でオーダーできます"
        }

    ];


    rewards.forEach(
        reward => {

            const card =
            document.createElement(
                "div"
            );


            card.className =
            "card rewardCard";


            const currentPoint =
            Number(
                member["ポイント"]
            ) || 0;


            const canExchange =
            currentPoint >=
            reward.point;


            card.innerHTML = `

                <h2>
                    🎁 ${reward.name}
                </h2>

                <p>
                    ${reward.description}
                </p>

                <div class="pointDisplay">
                    ${reward.point} PT
                </div>

                <button
                    class="yellowButton rewardButton"
                    data-id="${reward.id}"
                    ${canExchange ? "" : "disabled"}
                >
                    ${
                        canExchange
                        ?
                        "この景品と交換"
                        :
                        "ポイント不足"
                    }
                </button>

            `;


            rewardList.appendChild(
                card
            );

        }
    );


    document
    .querySelectorAll(
        ".rewardButton"
    )
    .forEach(

        button => {

            button.addEventListener(
                "click",
                () => {

                    const rewardId =
                    button.dataset.id;


                    selectReward(
                        rewardId
                    );

                }
            );

        }

    );

}


// ==============================
// 景品選択
// ==============================

function selectReward(
    rewardId
){

    selectedReward =
    rewards.find(

        reward =>

        reward.id ===
        rewardId

    );


    if(!selectedReward){

        alert(
            "景品が見つかりません。"
        );

        return;

    }


    const currentPoint =
    Number(
        member["ポイント"]
    ) || 0;


    if(
        currentPoint <
        selectedReward.point
    ){

        alert(
            "ポイントが不足しています。"
        );

        return;

    }


    const afterPoint =
    currentPoint -
    selectedReward.point;


    const confirmMessage =

`【景品交換確認】

メンバー：
${member["名前"]}

景品：
${selectedReward.name}

必要ポイント：
${selectedReward.point} PT

現在のポイント：
${currentPoint} PT

交換後：
${afterPoint} PT

この景品を交換申請しますか？`;


    if(!confirm(confirmMessage)){

        return;

    }


    requestReward();

}


// ==============================
// 景品交換申請
// ==============================

async function requestReward(){

    if(!selectedReward){

        return;

    }


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
                    "rewardrequest",

                    ID:
                    member["ID"],

                    Token:
                    token,

                    景品ID:
                    selectedReward.id,

                    景品名:
                    selectedReward.name,

                    必要ポイント:
                    selectedReward.point

                })

            }

        );


        if(!response.ok){

            throw new Error(
                "Reward API Error"
            );

        }


        const result =
        await response.json();


        console.log(
            "景品交換結果:",
            result
        );


        // ==========================
        // GAS側エラー
        // ==========================

        if(!result.success){

            alert(

                "交換申請に失敗しました。\n\n" +

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

        member["ポイント"] =
        Number(
            result.point
        );


        loadMember();

        loadRewards();


        alert(

`🎁 景品交換申請を受け付けました！

景品：
${selectedReward.name}

使用ポイント：
${selectedReward.point} PT

交換後ポイント：
${result.point} PT

管理者が確認後、
景品のお渡しについてご案内します。`

        );


        selectedReward =
        null;

    }

    catch(error){

        console.error(
            "Reward Request Error:",
            error
        );


        alert(

            "通信エラーが発生しました。\n\n" +

            "景品交換申請を送信できませんでした。"

        );

    }

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


// ======================================
// End reward.js
// ======================================