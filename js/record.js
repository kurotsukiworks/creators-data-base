// =====================================
// Creators Data Base Ver.2.3
// Tournament Record
// Google Apps Script Version
// Part1
// =====================================


const API_URL =
"https://script.google.com/macros/s/AKfycby7UMjPGJ_gUILneRA4pcc8idt2LMJIezWCokacvk-9_b-NEO8KXYR2gdXqN3ww4dCh9g/exec";


let members = [];

let tournaments = [];



const selectIds = [

    "championSelect",
    "runnerUpSelect",
    "thirdSelect",
    "best4Select"

];



// -------------------------------------
// 初期化
// -------------------------------------

initialize();



async function initialize(){


    try{


        const [

            membersData,

            tournamentsData


        ] = await Promise.all([


            fetch(
                API_URL + "?action=members"
            )
            .then(res=>res.json()),



            fetch(
                API_URL + "?action=tournaments"
            )
            .then(res=>res.json())


        ]);



        members =
            membersData;



        tournaments =
            tournamentsData;



        loadTournamentList();



        loadMemberLists();



        console.log(
            "Tournament Record Ready"
        );


    }


    catch(error){


        console.error(error);



        alert(
            "データの読み込みに失敗しました。"
        );


    }


}





// -------------------------------------
// 大会一覧
// -------------------------------------

function loadTournamentList(){



    const select =
        document.getElementById(
            "tournamentSelect"
        );



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



        select.appendChild(option);



    });


}




// -------------------------------------
// メンバー一覧
// -------------------------------------

function loadMemberLists(){



    selectIds.forEach(id=>{


        const select =
            document.getElementById(id);



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



            select.appendChild(option);



        });



    });



    selectIds.forEach(id=>{


        document

        .getElementById(id)

        .addEventListener(

            "change",

            updateSelects

        );


    });


}




// -------------------------------------
// 重複選択防止
// -------------------------------------

function updateSelects(){



    const selected = [];



    selectIds.forEach(id=>{


        const value =

            document

            .getElementById(id)

            .value;



        if(value){


            selected.push(value);


        }


    });




    selectIds.forEach(id=>{


        const select =

            document

            .getElementById(id);



        const current =
            select.value;




        select.innerHTML =

        `

        <option value="">
            選択してください
        </option>

        `;




        members.forEach(member=>{


            if(

                !selected.includes(
                    member["ID"]
                )

                ||

                member["ID"] === current

            ){



                const option =
                    document.createElement(
                        "option"
                    );



                option.value =
                    member["ID"];



                option.textContent =
                    member["名前"];



                if(

                    member["ID"] === current

                ){


                    option.selected =
                        true;


                }



                select.appendChild(option);



            }


        });



    });



}

// -------------------------------------
// 登録
// -------------------------------------


document

.getElementById("saveRecord")

.addEventListener(

    "click",

    saveRecord

);





async function saveRecord(){



    const tournamentId =

        document

        .getElementById(
            "tournamentSelect"
        )

        .value;



    const champion =

        document

        .getElementById(
            "championSelect"
        )

        .value;



    const runnerUp =

        document

        .getElementById(
            "runnerUpSelect"
        )

        .value;



    const third =

        document

        .getElementById(
            "thirdSelect"
        )

        .value;



    const best4 =

        document

        .getElementById(
            "best4Select"
        )

        .value;



    const memo =

        document

        .getElementById(
            "memo"
        )

        .value;




    if(!tournamentId){


        alert(
            "大会を選択してください。"
        );


        return;


    }




    const data = {


        action:
            "saveTournament",



        大会ID:
            tournamentId,



        優勝:
            champion || "",



        準優勝:
            runnerUp || "",



        "3位":
            third || "",



        ベスト4:
            best4 || "",



        メモ:
            memo || ""


    };





    try{


        const response =

            await fetch(

                API_URL,

                {


                    method:"POST",


                    headers:{


                        "Content-Type":
                        "application/json"


                    },


                    body:

                    JSON.stringify(data)


                }


            );




        const result =

            await response.json();






        if(!result.success){


            alert(

                "登録に失敗しました。\n"

                +

                result.message

            );


            return;


        }





        alert(

`大会結果を登録しました！

ポイント付与
戦績更新
称号チェック

が完了しました。`

        );




        resetForm();



    }



    catch(error){


        console.error(error);



        alert(

            "通信エラーが発生しました。"

        );


    }


}






// -------------------------------------
// 入力リセット
// -------------------------------------

function resetForm(){



    document

    .getElementById(
        "tournamentSelect"
    )

    .value = "";




    selectIds.forEach(id=>{


        document

        .getElementById(id)

        .value = "";


    });




    document

    .getElementById(
        "memo"
    )

    .value = "";



}




// -------------------------------------
// End
// -------------------------------------

console.log(
    "Creators Data Base Tournament Record Ready"
);