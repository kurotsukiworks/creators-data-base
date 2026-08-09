// ======================================
// Creators Data Base Ver.2
// qr.js
// QR Token Reader
// Google Apps Script Edition
// ======================================


// ==============================
// GAS URL
// ==============================

const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";


// ==============================
// DOM
// ==============================

const video =
document.getElementById("qrVideo");

const resultArea =
document.getElementById("qrResult");


// ==============================
// QR Scanner
// ==============================

let scanning = false;

let animationId = null;


// ==============================
// カメラ起動
// ==============================

async function startScanner(){

    if(scanning){
        return;
    }

    try{

        const stream =
        await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:{
                    ideal:"environment"
                }
            },

            audio:false

        });


        video.srcObject =
        stream;


        await video.play();


        scanning = true;


        scanQR();


    }
    catch(error){

        console.error(
            "Camera Error:",
            error
        );


        showError(
            "カメラを起動できませんでした。\n\n" +
            "カメラの使用を許可してください。"
        );

    }

}


// ==============================
// QR読み取り
// ==============================

function scanQR(){

    if(!scanning){
        return;
    }


    if(
        video.readyState
        !==
        video.HAVE_ENOUGH_DATA
    ){

        animationId =
        requestAnimationFrame(
            scanQR
        );

        return;

    }


    const canvas =
    document.createElement(
        "canvas"
    );


    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;


    const context =
    canvas.getContext("2d");


    context.drawImage(

        video,

        0,
        0,

        canvas.width,
        canvas.height

    );


    const imageData =
    context.getImageData(

        0,
        0,

        canvas.width,
        canvas.height

    );


    const code =
    jsQR(

        imageData.data,

        imageData.width,

        imageData.height

    );


    if(code){

        handleQRResult(
            code.data
        );

        return;

    }


    animationId =
    requestAnimationFrame(
        scanQR
    );

}


// ==============================
// QR結果処理
// ==============================

async function handleQRResult(
    qrData
){

    if(!qrData){
        return;
    }


    scanning = false;


    if(animationId){

        cancelAnimationFrame(
            animationId
        );

    }


    stopCamera();


    const token =
    qrData.trim();


    console.log(
        "QR Data:",
        token
    );


    // ==========================
    // URL形式は禁止
    // ==========================

    if(
        token.startsWith("http://")
        ||
        token.startsWith("https://")
    ){

        showError(

            "このQRコードは使用できません。\n\n" +

            "Creators Data Base専用QRコードを\n" +

            "使用してください。"

        );

        return;

    }


    // ==========================
    // Token確認
    // ==========================

    showMessage(
        "メンバーを確認しています..."
    );


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


        const members =
        await response.json();


        const member =
        members.find(

            m =>

            String(m["Token"])
            ===
            String(token)

        );


        if(!member){

            showError(

                "このQRコードのメンバーが\n" +
                "見つかりませんでした。"

            );

            return;

        }


        // ==========================
        // QR認証済み
        // ==========================

        sessionStorage.setItem(

            "qrAuthenticated",

            "true"

        );


        sessionStorage.setItem(

            "qrToken",

            token

        );


        sessionStorage.setItem(

            "qrTime",

            String(Date.now())

        );


        // ==========================
        // マイページへ
        // ==========================

        location.href =

            "mypage.html?token=" +

            encodeURIComponent(token);


    }
    catch(error){

        console.error(
            error
        );


        showError(

            "メンバー情報の確認に失敗しました。\n\n" +
            "通信環境を確認してください。"

        );

    }

}


// ==============================
// カメラ停止
// ==============================

function stopCamera(){

    if(!video){
        return;
    }


    const stream =
    video.srcObject;


    if(stream){

        stream
        .getTracks()
        .forEach(

            track => {

                track.stop();

            }

        );

    }


    video.srcObject =
    null;

}


// ==============================
// メッセージ
// ==============================

function showMessage(
    message
){

    if(!resultArea){
        return;
    }


    resultArea.textContent =
    message;

}


// ==============================
// エラー
// ==============================

function showError(
    message
){

    if(!resultArea){
        return;
    }


    resultArea.textContent =
    message;

}


// ==============================
// ページ終了時
// ==============================

window.addEventListener(
    "beforeunload",
    stopCamera
);


// ==============================
// 起動
// ==============================

if(video){

    startScanner();

}


// ==============================
// End
// ==============================