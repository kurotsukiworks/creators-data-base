// ======================================
// Creators Data Base Ver.2
// qr.js (Token認証版)
// ======================================

const reader = document.getElementById("reader");

const html5QrCode = new Html5Qrcode("reader");

const config = {

    fps: 10,
    qrbox: 250

};

let scanned = false;

function onScanSuccess(decodedText) {

    if (scanned) return;

    scanned = true;

    html5QrCode.stop();

    try {

        // QRにURLが入っている場合
        const url = new URL(decodedText, window.location.href);

        const token = url.searchParams.get("token");

        if (!token) {

            alert("無効なQRコードです。");

            scanned = false;

            startScanner();

            return;

        }

        // マイページへ移動
        location.href = `mypage.html?token=${encodeURIComponent(token)}`;

    }

    catch (error) {

        alert("QRコードの形式が正しくありません。");

        scanned = false;

        startScanner();

    }

}

function startScanner() {

    html5QrCode.start(

        {

            facingMode: "environment"

        },

        config,

        onScanSuccess

    )

    .catch(err => {

        console.error(err);

        alert("カメラを起動できません。");

    });

}

startScanner();