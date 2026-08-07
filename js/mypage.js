// ======================================
// Creators Data Base Ver.2
// mypage.js
// Google Apps Script Complete Edition
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

    alert("Tokenがありません。");

    location.href="index.html";

}



// ==============================
// 初期読み込み
// ==============================

async function initializePage(){


    try{


        const [

            membersData,

            titlesData,

            beysData


        ] = await Promise.all([


            fetch(
                API_URL+"?action=members"
            )
            .then(r=>r.json()),



            fetch(
                API_URL+"?action=titles"
            )
            .then(r=>r.json()),



            fetch(
                API_URL+"?action=beys"
            )
            .then(r=>r.json())


        ]);



        titles = titlesData;

        beys = beysData;



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


            location.href="index.html";


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
        "ID : "
        +
        member["ID"];

    }



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



    loadRecord();

    loadTitles();

    loadPartner();


}

// ======================================
// Creators Data Base Ver.2
// mypage.js（Google Apps Script版）
// Complete Edition - Part 2
// ======================================


// ==============================
// 称号一覧
// ==============================

function loadTitles(){

    const select =
        document.getElementById("titleSelect");


    if(!select){

        return;

    }


    select.innerHTML = "";


    titles

    .filter(title=>{


        return (

            title["公開"] === true

            ||

            String(title["公開"]) === "true"

            ||

            String(title["公開"]) === "TRUE"

        );


    })


    .forEach(title=>{


        const option =
            document.createElement("option");


        option.value =
            title["ID"];


        option.textContent =
            title["名前"];


        if(

            title["ID"]

            ===

            member["選択称号"]

        ){

            option.selected = true;

        }


        select.appendChild(option);


    });


}



// ==============================
// 使用ベイ一覧
// ==============================

function loadPartner(){


    const select =
        document.getElementById("partnerSelect");


    if(!select){

        return;

    }


    select.innerHTML = "";


    beys

    .filter(bey=>{


        return (

            bey["公開"] === true

            ||

            String(bey["公開"]) === "true"

            ||

            String(bey["公開"]) === "TRUE"

        );


    })


    .forEach(bey=>{


        const option =
            document.createElement("option");


        option.value =
            bey["ID"];


        option.textContent =

        `${bey["名前"]} (${bey["タイプ"]})`;



        if(

            bey["ID"]

            ===

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


            headers:{


                "Content-Type":

                "application/json"


            },


            body:JSON.stringify({


                action:"updateMember",


                ID:member["ID"],


                選択称号:selectedTitle,


                相棒ベイ:partner


            })


        });



        const result =

        await response.json();



        if(!result.success){


            alert(

            "保存に失敗しました。"

            );


            return;


        }



        member["選択称号"]

        =

        selectedTitle;



        member["相棒ベイ"]

        =

        partner;



        alert(

        "保存しました！"

        );



    }


    catch(error){


        console.error(error);


        alert(

        "通信エラーが発生しました。"

        );


    }



}




// ==============================
// 保存ボタン
// ==============================

const saveButton =

document.getElementById("saveButton");



if(saveButton){


    saveButton

    .addEventListener(

        "click",

        saveProfile

    );


}



// ==============================
// 初期化開始
// ==============================

window.onload = ()=>{


    initializePage();


};



// ======================================
// END Part2
// ======================================

// ======================================
// Creators Data Base Ver.2
// mypage.js（Google Apps Script版）
// Complete Edition - Part 3
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



        const result =
        await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify({

                action:"updateMember",

                ID:
                member["ID"],

                選択称号:
                selectedTitle,

                相棒ベイ:
                partner

            })

        });



        const json =
        await result.json();



        if(!json.success){

            alert(
                "保存に失敗しました。"
            );

            return;

        }



        member["選択称号"] =
            selectedTitle;


        member["相棒ベイ"] =
            partner;



        alert(
            "保存しました！"
        );


    }

    catch(error){

        console.error(error);


        alert(
            "通信エラーが発生しました。"
        );

    }

}


// ==============================
// 保存ボタン
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

window.onload = () => {

    initializePage();

};



// ======================================
// End Part3
// ======================================