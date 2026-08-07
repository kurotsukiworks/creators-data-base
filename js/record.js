// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Google Apps Script Edition
// Rebuild Complete Version
// Part1
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
// Select ID
// ==============================

const selectIds = [

    "championSelect",

    "runnerUpSelect",

    "thirdSelect",

    "best4Select"

];




// ==============================
// 初期化
// ==============================

async function initialize(){


    try{


        const membersData =

        await fetch(

            API_URL +

            "?action=members"

        )

        .then(

            res => res.json()

        );




        const tournamentsData =

        await fetch(

            API_URL +

            "?action=tournaments"

        )

        .then(

            res => res.json()

        );




        members = membersData;


        tournaments = tournamentsData;



        loadTournamentList();


        loadMemberLists();



        console.log(
            "Tournament Record Ready"
        );


    }


    catch(error){


        console.error(
            error
        );


        alert(
            "データの読み込みに失敗しました。"
        );


    }


}





// ==============================
// 大会一覧表示
// ==============================

function loadTournamentList(){


    const select =

    document.getElementById(
        "tournamentSelect"
    );



    if(!select){

        return;

    }



    select.innerHTML =

    `

    <option value="">
    大会を選択してください
    </option>

    `;




    tournaments.forEach(tournament=>{


        const option =

        document.createElement(
            "option"
        );



        option.value =

        tournament["ID"];



        option.textContent =

        tournament["大会名"];



        select.appendChild(
            option
        );


    });



}





// ==============================
// メンバー一覧表示
// ==============================

function loadMemberLists(){



    selectIds.forEach(id=>{


        const select =

        document.getElementById(id);



        if(!select){

            return;

        }



        select.innerHTML =


        `

        <option value="">
        選択してください
        </option>

        `;




        members.forEach(member=>{


            const option =

            document.createElement(
                "option"
            );



            option.value =

            member["ID"];



            option.textContent =

            member["名前"];



            select.appendChild(
                option
            );



        });



    });



}




// ==============================
// 起動
// ==============================

initialize();



// ======================================
// End Part1
// ======================================


// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Part2
// ======================================



// ==============================
// 重複選択防止
// ==============================

function updateSelects(){



    const selected = [];



    selectIds.forEach(id=>{


        const select =

        document.getElementById(id);



        if(!select){

            return;

        }



        if(select.value){


            selected.push(
                select.value
            );


        }


    });





    selectIds.forEach(id=>{


        const select =

        document.getElementById(id);



        if(!select){

            return;

        }



        const current =

        select.value;




        select.innerHTML =


        `

        <option value="">
        選択してください
        </option>

        `;




        members.forEach(member=>{


            const memberId =

            String(
                member["ID"]
            );



            // 現在選択中の人は残す

            if(

                !selected.includes(memberId)

                ||

                memberId === String(current)

            ){



                const option =

                document.createElement(
                    "option"
                );



                option.value =

                memberId;



                option.textContent =

                member["名前"];




                if(

                    memberId === String(current)

                ){

                    option.selected = true;

                }



                select.appendChild(
                    option
                );



            }


        });



    });



}



// ==============================
// イベント登録
// ==============================

function setSelectEvents(){



    selectIds.forEach(id=>{


        const select =

        document.getElementById(id);



        if(!select){

            return;

        }



        select.addEventListener(

            "change",

            updateSelects

        );



    });



}



// ==============================
// 選択チェック
// ==============================

function validateRecord(){



    const values = [];



    selectIds.forEach(id=>{


        const select =

        document.getElementById(id);



        if(select && select.value){


            values.push(
                select.value
            );


        }


    });



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
// Part2 起動
// ==============================

setTimeout(()=>{


    setSelectEvents();


},500);



// ======================================
// End Part2
// ======================================


// ======================================
// Creators Data Base Ver.2.3
// record.js
// Tournament Record
// Part3
// ======================================


// ==============================
// 登録ボタン
// ==============================

const saveRecordButton =

document.getElementById(
    "saveRecord"
);



if(saveRecordButton){


    saveRecordButton.addEventListener(

        "click",

        saveRecord

    );


}




// ==============================
// 大会結果保存
// ==============================

async function saveRecord(){



    const tournamentId =

    document.getElementById(
        "tournamentSelect"
    ).value;




    const champion =

    document.getElementById(
        "championSelect"
    ).value;



    const runnerUp =

    document.getElementById(
        "runnerUpSelect"
    ).value;



    const third =

    document.getElementById(
        "thirdSelect"
    ).value;



    const best4 =

    document.getElementById(
        "best4Select"
    ).value;




    const memo =

    document.getElementById(
        "memo"
    )

    ?

    document.getElementById(
        "memo"
    ).value

    :

    "";





    if(!tournamentId){


        alert(
            "大会を選択してください。"
        );


        return;


    }





    if(!validateRecord()){


        return;


    }





    const data = {


        action:

        "savetournament",



        大会ID:

        tournamentId,



        優勝:

        champion,



        準優勝:

        runnerUp,



        "3位":

        third,



        ベスト4:

        best4,



        メモ:

        memo


    };





    console.log(
        "送信データ",
        data
    );






    try{


        const response =

        await fetch(

            API_URL,

            {


                method:"POST",



                body:

                JSON.stringify(
                    data
                )


            }

        );






        const result =

        await response.json();






        console.log(
            "GAS結果",
            result
        );






        if(!result.success){


            alert(

                "登録失敗\n\n"

                +

                result.message

            );


            return;


        }






        alert(

`大会結果を登録しました！

・ポイント反映
・戦績更新
・称号チェック

完了しました。`

        );





        resetForm();





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
// 入力リセット
// ==============================

function resetForm(){



    const tournament =

    document.getElementById(
        "tournamentSelect"
    );



    if(tournament){

        tournament.value = "";

    }



    selectIds.forEach(id=>{


        const select =

        document.getElementById(id);



        if(select){

            select.value = "";

        }


    });





    const memo =

    document.getElementById(
        "memo"
    );



    if(memo){

        memo.value = "";

    }



}



// ======================================
// End Part3
// ======================================