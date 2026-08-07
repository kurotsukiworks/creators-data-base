// ======================================
// Creators Data Base Ver.2
// point.js
// ======================================

let members = [];
let selectedMember = null;
let pointChange = 0;

// ==============================
// 要素取得
// ==============================

const memberSelect = document.getElementById("memberSelect");
const currentPoint = document.getElementById("currentPoint");
const selectedPoint = document.getElementById("selectedPoint");

const reasonSelect = document.getElementById("reasonSelect");
const otherReason = document.getElementById("otherReason");

const saveButton = document.getElementById("savePoint");

// ==============================
// members.json読込
// ==============================

fetch("data/members.json")

.then(response => {

    if (!response.ok) {

        throw new Error("members.jsonの読み込みに失敗しました");

    }

    return response.json();

})

.then(data => {

    members = data;

    memberSelect.innerHTML = "";

    members.forEach(member => {

        const option = document.createElement("option");

        option.value = member.id;
        option.textContent = `${member.name}（${member.id}）`;

        memberSelect.appendChild(option);

    });

    loadMember(memberSelect.value);

})

.catch(error => {

    console.error(error);

    alert("メンバーデータを読み込めませんでした。");

});

// ==============================
// メンバー変更
// ==============================

memberSelect.addEventListener("change", () => {

    loadMember(memberSelect.value);

});

function loadMember(id) {

    selectedMember = members.find(member => member.id === id);

    if (!selectedMember) return;

    currentPoint.textContent = `${selectedMember.point} PT`;

    pointChange = 0;

    selectedPoint.textContent = pointChange;

}

// ==============================
// ポイントボタン
// ==============================

document.querySelectorAll(".pointBtn").forEach(button => {

    button.addEventListener("click", () => {

        pointChange += Number(button.dataset.value);

        selectedPoint.textContent = pointChange;

    });

});

// ==============================
// その他理由
// ==============================

reasonSelect.addEventListener("change", () => {

    if (reasonSelect.value === "その他") {

        otherReason.style.display = "block";

    } else {

        otherReason.style.display = "none";

        otherReason.value = "";

    }

});

// ==============================
// 保存
// ==============================

saveButton.addEventListener("click", () => {

    if (!selectedMember) {

        alert("メンバーを選択してください。");

        return;

    }

    if (pointChange === 0) {

        alert("ポイントが選択されていません。");

        return;

    }

    let reason = reasonSelect.value;

    if (reason === "") {

        alert("理由を選択してください。");

        return;

    }

    if (reason === "その他") {

        if (otherReason.value.trim() === "") {

            alert("理由を入力してください。");

            return;

        }

        reason = otherReason.value.trim();

    }

    const newPoint = selectedMember.point + pointChange;

    if (newPoint < 0) {

        alert("ポイントは0未満にできません。");

        return;

    }

    alert(
`【確認】

メンバー：${selectedMember.name}

現在：${selectedMember.point}PT

変更：${pointChange > 0 ? "+" : ""}${pointChange}PT

変更後：${newPoint}PT

理由：${reason}

※Ver.2ではまだ保存されません。
Ver.3でスプレッドシートへ保存されます。`
    );

});