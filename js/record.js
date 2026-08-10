// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Team Battle 3 Members Edition
// Part 1
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

let tournaments = [];


// ==============================
// 順位ごとのSelect
// ==============================

const rankGroups = {

champion: [
"championSelect1",
"championSelect2",
"championSelect3"
],

runnerUp: [
"runnerUpSelect1",
"runnerUpSelect2",
"runnerUpSelect3"
],

third: [
"thirdSelect1",
"thirdSelect2",
"thirdSelect3"
],

best4: [
"best4Select1",
"best4Select2",
"best4Select3"
]

};


// ==============================
// 全メンバーSelect
// ==============================

const selectIds = [

"championSelect1",
"championSelect2",
"championSelect3",

"runnerUpSelect1",
"runnerUpSelect2",
"runnerUpSelect3",

"thirdSelect1",
"thirdSelect2",
"thirdSelect3",

"best4Select1",
"best4Select2",
"best4Select3"

];


// ==============================
// 初期化
// ==============================

async function initialize(){

try{

// --------------------------
// メンバー取得
// --------------------------

const membersResponse =
await fetch(
API_URL +
"?action=members"
);


if(!membersResponse.ok){

throw new Error(
"Members API Error"
);

}


const membersData =
await membersResponse.json();


if(!Array.isArray(membersData)){

throw new Error(
"Members data is not array"
);

}


// --------------------------
// 大会取得
// --------------------------

const tournamentsResponse =
await fetch(
API_URL +
"?action=tournaments"
);


if(!tournamentsResponse.ok){

throw new Error(
"Tournaments API Error"
);

}


const tournamentsData =
await tournamentsResponse.json();


if(!Array.isArray(tournamentsData)){

throw new Error(
"Tournaments data is not array"
);

}


// --------------------------
// データ保存
// --------------------------

members =
membersData;

tournaments =
tournamentsData;


// --------------------------
// 大会一覧表示
// --------------------------

loadTournamentList();


// --------------------------
// メンバー一覧表示
// --------------------------

loadMemberLists();


console.log(
"Creators Tournament Record Ready"
);

}


catch(error){

console.error(
"Initialize Error:",
error
);


alert(
"データの読み込みに失敗しました。\n\n" +
"大会登録ページのデータを確認してください。"
);

}

}


// ==============================
// 大会一覧
// ==============================

function loadTournamentList(){

const select =
document.getElementById(
"tournamentSelect"
);


if(!select){

console.error(
"tournamentSelect が見つかりません。"
);

return;

}


select.innerHTML = "";


const defaultOption =
document.createElement(
"option"
);


defaultOption.value =
"";


defaultOption.textContent =
"大会を選択してください";


select.appendChild(
defaultOption
);


tournaments.forEach(
tournament => {

const option =
document.createElement(
"option"
);


option.value =
String(
tournament["ID"] || ""
);


option.textContent =
tournament["大会名"] || "";


select.appendChild(
option
);

}
);

}


// ==============================
// メンバー一覧
// ==============================

function loadMemberLists(){

selectIds.forEach(
id => {

const select =
document.getElementById(id);


if(!select){

console.warn(
id +
" が見つかりません。"
);

return;

}


select.innerHTML = "";


const defaultOption =
document.createElement(
"option"
);


defaultOption.value =
"";


defaultOption.textContent =
"選択してください";


select.appendChild(
defaultOption
);


members.forEach(
member => {

const option =
document.createElement(
"option"
);


/*
* IDは必ず文字列として扱う
*
* これにより
* 数値ID・文字列IDの比較による
* 選択不具合を防止
*/

option.value =
String(
member["ID"] || ""
);


option.textContent =
member["名前"] || "";


select.appendChild(
option
);

}
);

}
);

}


// ==============================
// Part 1 起動
// ==============================

initialize();


// ======================================
// End Part 1
// ======================================

// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Team Battle 3 Members Edition
// Part 2
// ======================================


// ==============================
// Selectイベント登録
// ==============================

function setSelectEvents(){

selectIds.forEach(
id => {

const select =
document.getElementById(id);


if(!select){

return;

}


select.addEventListener(
"change",
updateSelects
);

}
);

}


// ==============================
// 選択されているメンバー取得
// ==============================

function getSelectedMembers(){

const selected = [];


selectIds.forEach(
id => {

const select =
document.getElementById(id);


if(!select){

return;

}


const value =
String(
select.value || ""
);


if(value){

selected.push(value);

}

}
);


return selected;

}


// ==============================
// 重複選択防止
// ==============================

function updateSelects(){

/*
* 現在選択されている値を保存
*/

const currentValues = {};


selectIds.forEach(
id => {

const select =
document.getElementById(id);


if(select){

currentValues[id] =
String(
select.value || ""
);

}

}
);


/*
* 現在選択されている
* メンバーID一覧
*/

const selectedValues =
Object.values(
currentValues
).filter(
value => value !== ""
);


/*
* 各プルダウンを再構築
*/

selectIds.forEach(
id => {

const select =
document.getElementById(id);


if(!select){

return;

}


const current =
currentValues[id];


select.innerHTML = "";


/*
* 初期項目
*/

const defaultOption =
document.createElement(
"option"
);


defaultOption.value =
"";


defaultOption.textContent =
"選択してください";


select.appendChild(
defaultOption
);


/*
* メンバー一覧
*/

members.forEach(
member => {

const memberId =
String(
member["ID"] || ""
);


/*
* すでに他のプルダウンで
* 選択されている場合は除外
*
* ただし現在のプルダウン自身が
* 選択している人は残す
*/

if(

selectedValues.includes(
memberId
)

&&

memberId !== current

){

return;

}


const option =
document.createElement(
"option"
);


option.value =
memberId;


option.textContent =
member["名前"] || "";


/*
* 現在選択中なら復元
*/

if(
memberId === current
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
);

}


// ==============================
// 順位ごとの選択値取得
// ==============================

function getRankValues(
ids
){

return ids
.map(
id => {

const select =
document.getElementById(id);


if(!select){

return "";

}


return String(
select.value || ""
);

}
)
.filter(
value => value !== ""
);

}


// ==============================
// 重複チェック
// ==============================

function validateRecord(){

const values =
getSelectedMembers();


/*
* Setを使って
* 重複をチェック
*/

const unique =
new Set(values);


if(
values.length
!==
unique.size
){

alert(
"同じメンバーを複数順位に登録できません。"
);


return false;

}


return true;

}


// ==============================
// 順位データ作成
// ==============================

function createRankData(){

return {

/*
* 優勝
*/

優勝:
getRankValues(
rankGroups.champion
),


/*
* 準優勝
*/

準優勝:
getRankValues(
rankGroups.runnerUp
),


/*
* 3位
*/

"3位":
getRankValues(
rankGroups.third
),


/*
* ベスト4
*/

ベスト4:
getRankValues(
rankGroups.best4
)

};

}


// ==============================
// Part 2 起動
// ==============================

setSelectEvents();


// ======================================
// End Part 2
// ======================================

// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Team Battle 3 Members Edition
// Part 3
// ======================================


// ==============================
// 登録ボタン設定
// ==============================

function setSaveButton(){

const button =
document.getElementById(
"saveRecord"
);


if(!button){

console.error(
"saveRecord ボタンが見つかりません。"
);

return;

}


button.addEventListener(
"click",
saveRecord
);

}


// ==============================
// 大会結果保存
// ==============================

async function saveRecord(){

/*
* 二重クリック防止
*/

const button =
document.getElementById(
"saveRecord"
);


if(button){

button.disabled = true;

}


try{

// ==========================
// 大会取得
// ==========================

const tournamentSelect =
document.getElementById(
"tournamentSelect"
);


const tournamentId =
tournamentSelect
? String(
tournamentSelect.value || ""
)
: "";


// ==========================
// 大会チェック
// ==========================

if(!tournamentId){

alert(
"大会を選択してください。"
);

return;

}


// ==========================
// メンバー重複チェック
// ==========================

if(!validateRecord()){

return;

}


// ==========================
// 順位データ取得
// ==========================

const rankData =
createRankData();


console.log(
"順位データ",
rankData
);


// ==========================
// 少なくとも1人必要
// ==========================

const totalMembers =

rankData.優勝.length +

rankData.準優勝.length +

rankData["3位"].length +

rankData.ベスト4.length;


if(totalMembers === 0){

alert(
"少なくとも1人のメンバーを選択してください。"
);

return;

}


// ==========================
// メモ
// ==========================

const memoElement =
document.getElementById(
"memo"
);


const memo =
memoElement
? memoElement.value
: "";


// ==========================
// GASへ送信するデータ
// ==========================
//
// GAS側は
//
// 優勝1
// 優勝2
// 優勝3
//
// のように受け取るため、
// 配列を3人分に分解して送信する。
// ==========================

const data = {

action:
"savetournament",


大会ID:
tournamentId,


// --------------------------
// 優勝チーム
// --------------------------

優勝1:
rankData.優勝[0] || "",

優勝2:
rankData.優勝[1] || "",

優勝3:
rankData.優勝[2] || "",


// --------------------------
// 準優勝チーム
// --------------------------

準優勝1:
rankData.準優勝[0] || "",

準優勝2:
rankData.準優勝[1] || "",

準優勝3:
rankData.準優勝[2] || "",


// --------------------------
// 3位チーム
// --------------------------

"3位1":
rankData["3位"][0] || "",

"3位2":
rankData["3位"][1] || "",

"3位3":
rankData["3位"][2] || "",


// --------------------------
// ベスト4チーム
// --------------------------

"ベスト4_1":
rankData.ベスト4[0] || "",

"ベスト4_2":
rankData.ベスト4[1] || "",

"ベスト4_3":
rankData.ベスト4[2] || "",


// --------------------------
// メモ
// --------------------------

メモ:
memo || ""

};


console.log(
"GAS送信データ",
data
);


// ==========================
// GAS通信
// ==========================

const response =
await fetch(

API_URL,

{

method:
"POST",

body:
JSON.stringify(data)

}

);


// ==========================
// HTTPエラーチェック
// ==========================

if(!response.ok){

throw new Error(
"HTTP Error : " +
response.status
);

}


// ==========================
// JSON取得
// ==========================

const result =
await response.json();


console.log(
"GAS結果",
result
);


// ==========================
// GAS側エラー
// ==========================

if(!result.success){

alert(

"登録に失敗しました。\n\n" +

(
result.message
||
"不明なエラーが発生しました。"
)

);

return;

}


// ==========================
// 登録成功
// ==========================

alert(

`大会結果を登録しました！

・大会結果を保存
・ポイントを反映
・戦績を更新

登録が完了しました。`

);


// ==========================
// フォームリセット
// ==========================

resetForm();


}


catch(error){

console.error(
"Tournament Save Error:",
error
);


alert(

"通信エラーが発生しました。\n\n" +

"GASとの通信に失敗しました。"

);

}


finally{

/*
* ボタンを再び有効化
*/

if(button){

button.disabled = false;

}

}

}


// ==============================
// フォームリセット
// ==============================

function resetForm(){

// --------------------------
// 大会
// --------------------------

const tournament =
document.getElementById(
"tournamentSelect"
);


if(tournament){

tournament.value = "";

}


// --------------------------
// 全メンバーSelect
// --------------------------

selectIds.forEach(
id => {

const select =
document.getElementById(id);


if(select){

select.value = "";

}

}
);


// --------------------------
// メモ
// --------------------------

const memo =
document.getElementById(
"memo"
);


if(memo){

memo.value = "";

}


// --------------------------
// 選択肢を再構築
// --------------------------

updateSelects();

}


// ==============================
// Part 3 起動
// ==============================

setSaveButton();


// ======================================
// End Part 3
// ======================================
