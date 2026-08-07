// ======================================
// Creators Data Base Ver.2
// mypage.js（Google Apps Script版）
// Save Fix Edition
// Part 1
// ======================================


const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";


let member = null;

let titles = [];

let beys = [];


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


        const [

            members,

            titlesData,

            beysData


        ] = await Promise.all([


            fetch(
                API_URL +
                "?action=members"
            )
            .then(r=>r.json()),



            fetch(
                API_URL +
                "?action=titles"
            )
            .then(r=>r.json()),



            fetch(
                API_URL +
                "?action=beys"
            )
            .then(r=>r.json())


        ]);



        titles =
        titlesData;


        beys =
        beysData;



        member =
        members.find(
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



        loadProfile();



    }


    catch(error){


        console.error(error);


        alert(
            "データの読み込みに失敗しました。"
        );


    }


}





// ==============================
// プロフィール表示
// ==============================


function loadProfile(){


    document
    .getElementById("memberName")
    .textContent =
    member["名前"] || "";



    document
    .getElementById("memberId")
    .textContent =
    "ID : "
    +
    member["ID"];



    document
    .getElementById("memberPoint")
    .textContent =
    (member["ポイント"] || 0)
    +
    " PT";



    document
    .getElementById("memberIcon")
    .src =
    member["アイコン"]
    ||
    "images/default.png";



    loadRecord();


    loadTitles();


    loadPartner();



}



// ======================================
// Creators Data Base Ver.2
// mypage.js（Google Apps Script版）
// Save Function - Part3
// ======================================


// ==============================
// プロフィール保存
// ==============================

async function saveProfile(){

    try{


        const selectedTitle =
            document
            .getElementById("titleSelect")
            .value;



        const partner =
            document
            .getElementById("partnerSelect")
            .value;



        const response =
        await fetch(API_URL,{

            method:"POST",


            body:JSON.stringify({

                action:"updatemember",

                ID:
                member["ID"],

                選択称号:
                selectedTitle,

                相棒ベイ:
                partner

            })

        });



        const result =
        await response.json();



        console.log(
            "Save Result:",
            result
        );



        if(!result.success){


            alert(

                "保存に失敗しました。\n\n" +

                result.message

            );


            return;

        }



        // ローカル状態更新

        member["選択称号"] =
            selectedTitle;


        member["相棒ベイ"] =
            partner;



        alert(
            "保存しました！"
        );


    }


    catch(error){


        console.error(
            error
        );


        alert(

            "通信エラーが発生しました。"

        );


    }

}



// ==============================
// 保存ボタン登録
// ==============================


const saveButton =
document.getElementById("saveButton");


if(saveButton){

    saveButton.addEventListener(

        "click",

        saveProfile

    );

}



// ==============================
// 初期化
// ==============================


window.onload = function(){

    initializePage();

};


// ======================================
// End Part3
// ======================================