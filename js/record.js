// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Team Battle 3 Members Edition
// Part 2
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
// 全Select
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


        // --------------------------
        // データ保存
        // --------------------------

        members =
        Array.isArray(membersData)
        ? membersData
        : [];


        tournaments =
        Array.isArray(tournamentsData)
        ? tournamentsData
        : [];


        // --------------------------
        // 画面表示
        // --------------------------

        loadTournamentList();

        loadMemberLists();

        setSelectEvents();


        console.log(
            "Tournament Record Ready"
        );

    }

    catch(error){

        console.error(
            "Initialize Error:",
            error
        );


        alert(
            "データの読み込みに失敗しました。"
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

        return;

    }


    select.innerHTML = "";


    const defaultOption =
    document.createElement(
        "option"
    );


    defaultOption.value = "";


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
                tournament["ID"]
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
                     * IDを必ず文字列として扱う
                     * 
                     * ID0001などの先頭0が
                     * 消えないようにする
                     */

                    option.value =
                    String(
                        member["ID"]
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
// Selectイベント
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
// 選択済みメンバー取得
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
     * 現在選択されている値を
     * いったん全部保存
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
     * 全体で選択済みのID
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

                    const memberId =
                    String(
                        member["ID"]
                    );


                    /*
                     * 他のプルダウンで
                     * 選ばれている人は除外
                     *
                     * ただし自分自身の現在値は残す
                     */

                    const alreadySelected =
                    selectedValues.includes(
                        memberId
                    );


                    if(
                        alreadySelected
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
// 選択値取得
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
     * 同じ人が複数順位に
     * 入っていないか確認
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

        優勝:
        getRankValues(
            rankGroups.champion
        ),

        準優勝:
        getRankValues(
            rankGroups.runnerUp
        ),

        "3位":
        getRankValues(
            rankGroups.third
        ),

        ベスト4:
        getRankValues(
            rankGroups.best4
        )

    };

}


// ==============================
// 起動
// ==============================

initialize();


// ======================================
// End Part2
// ======================================