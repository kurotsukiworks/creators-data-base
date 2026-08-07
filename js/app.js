// ======================================
// Creators Data Base
// Version 0.1
// app.js
// ======================================

// ページ読み込み完了
document.addEventListener("DOMContentLoaded", () => {

    console.log("Creators Data Base 起動");

    // QRボタン
    const qrButton = document.getElementById("qrButton");

    if (qrButton) {

        qrButton.addEventListener("click", () => {

            alert("QRコード機能は次のバージョンで実装予定です！");

        });

    }

});