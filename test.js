let data = fetch("words.json");
let verbsData = fetch("verbs.json");
let dataArr = [];
let dataVerbsArr = [];
let qNums = JSON.parse(localStorage.getItem("used questions")) || [];
let qNumsVerbs = JSON.parse(localStorage.getItem("used verbs")) || [];;
let aNums = [];
let chosenType;
let tryN = localStorage.getItem("number of tries");
let resultType;

if (tryN == null) {
    tryN = 0
}
else {
    let pos = document.cookie.indexOf("result1");
    if (pos == -1) {
        tryN = 0;
        localStorage.removeItem("number of tries")
    }
    else {
        tryN = JSON.parse(tryN)
    }
}

data
    .then(response => response.json())
    .then(json => {
        for (item of json["words"]) {
            dataArr.push(item);
        }
    })
    .catch(error => console.error(error));

verbsData
    .then(response => response.json())
    .then(json => {
        for (const item of json["verbs"]) {
            dataVerbsArr.push(item);
        }
    })
    .catch(error => console.error(error));

let textAnswers = document.querySelectorAll(".textAnswer");
let inputAnswers = document.querySelectorAll(".inputAnswer");

for (let i = 0; i < textAnswers.length; i++) {
    textAnswers[i].addEventListener("click", () => {
        inputAnswers[i].checked = true;
    })
}

const form = document.forms[0];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let allCount = document.querySelector("#all-count");
let correctCount = 0;

function getNewQuestion() {
    let question, answer, length, arrW, arr;

    switch (chosenType) {
        case "definitions":
        case "input":
        case "translations":
        case "words":
            arrW = dataArr;
            arr = qNums;
            length = dataArr.length;
            break
        case "verbSecond":
        case "verbThird":
            arrW = dataVerbsArr;
            arr = qNumsVerbs;
            length = dataVerbsArr.length;
            break
    } 
    checkAnswer(arr);
    allCount.textContent = Number(allCount.textContent) + 1;
    endTest();

    checkFullness(arr, arrW, length)
    let randNum = getRandom(0, (length - 1));
    randNum = checkRand(randNum, arr, length - 1);
    let answerNumber = getRandom(1, 4);

    switch (chosenType) {
        case "definitions":
            question = dataArr[randNum].definition;
            answer = dataArr[randNum].word;
            break
        case "input":
        case "translations":
            question = dataArr[randNum].translation;
            answer = dataArr[randNum].word;
            break
        case "words":
            question = dataArr[randNum].word;
            answer = dataArr[randNum].translation;
            break
        case "verbSecond":
            question = dataVerbsArr[randNum].verb;
            answer = dataVerbsArr[randNum].second;
            break
        case "verbThird":
            question = dataVerbsArr[randNum].verb;
            answer = dataVerbsArr[randNum].third;
            break
    }

    document.querySelector("#question").textContent = question;
    form.querySelector(`#a${answerNumber}`).value = answer;
    document.querySelector(`#answ${answerNumber}`).textContent = answer;

    if (chosenType != "input" && chosenType != "verbSecond" && chosenType != "verbThird") {
        for (let i = 1; i <= 4; i++) {
            if (i == answerNumber) {
                continue
            }
            else {
                let randomForArray = checkRand(
                    getRandom(0, arrW.length - 1),
                    aNums,
                    arrW.length - 1
                );
                if (randomForArray == randNum) {
                    i--;
                    continue
                }
                else {
                    let randomAnswer;
                    switch (chosenType) {
                        case "definitions":
                        case "translations":
                            randomAnswer = arrW[randomForArray].word;
                            break
                        case "words":
                            randomAnswer = arrW[randomForArray].translation;
                            break
                    }
                    form.querySelector(`#a${i}`).value = randomAnswer;
                    document.querySelector(`#answ${i}`).textContent = randomAnswer;
                    aNums.push(randomForArray);
                }
            }
        }
    }
    arr.push(randNum);
    aNums = [];
}

function startTest() {
    let answ = form.querySelectorAll(".answer")
    if (chosenType == "input") {
        answ.forEach(item => { item.style.display = "none" });
        document.querySelector("#answ-input").hidden = false;
    }
    else {
        answ.forEach(item => { item.style.display = "inline" });
        document.querySelector("#answ-input").hidden = true;
    }
    document.querySelector("#next").value = "Next question";
    document.querySelector("#form-block").style.display = "block";
    document.querySelector("#test-choice").style.display = "none";
    form.querySelector("#next").removeEventListener("click", getNewQuestion);
}//Прибирання івентліснерів та ховання елементів

function checkAnswer(array) {
    let answer;
    if (array.length == 0) {
        return
    }

    switch (chosenType) {
        case "input":
        case "definitions":
        case "translations":
            answer = dataArr[array[array.length - 1]].word;
            break
        case "words":
            answer = dataArr[array[array.length - 1]].translation
            break
        case "verbSecond":
            answer = dataVerbsArr[array[array.length - 1]].second;
            console.log(answer);
            break
        case "verbThird":
            answer = dataVerbsArr[array[array.length - 1]].third;
            break
    }

    if (document.querySelector("#answ-input").value != "") {
        if (chosenType == "input" || chosenType == "verbSecond" || chosenType == "verbThird") {
            if ((document.querySelector("#answ-input").value.trim()).toLowerCase() == answer) {
                correctCount += 1;
            } // Перевірка на правильну відповідь
            else {
                showRightAnswer(answer);
            }
            document.querySelector("#answ-input").value = "";
        }
    }
    else {
        if (form.answer.value != "") {
            if (form.answer.value == answer) {
                correctCount += 1;
            } // Перевірка на правильну відповідь
            else {
                showRightAnswer(answer);
            }
            for (let i = 0; i < 5; i++) {
                form[i].checked = false
            };//Прибирання відмітки
        } //Перевірка на пусту відповідь
    }

}

function showRightAnswer(answer) {
    new swal({
        title: "Неправильно!",
        text: 'Правильна відповідь: ' + answer
    });
}//Показ правильного відповіді

function checkRand(num, array, max) {
    if (array.length > max) return 0; // fallback

    while (array.includes(num)) {
        num = getRandom(0, max);
    }
    return num;
}

function checkFullness(arrayQue, arrayWords, length) {
    console.log(arrayWords);
    console.log(arrayQue);

    if (arrayQue.length >= arrayWords.length) {
        console.log("yes");
        if (arrayQue == qNums) {
            console.log("yes");
            arrayQue.length = 0;
            localStorage.removeItem("used questions");
        }
        if (arrayQue == qNumsVerbs) {
            console.log("yes");
            arrayQue.length = 0;
            localStorage.removeItem("used verbs");
        }
    }
}

function endTest() {
    const nextBtn = document.querySelector("#next");
    const formBlock = document.querySelector("#form-block");
    const choiceBlock = document.querySelector("#test-choice");
    const congratsBlock = document.querySelector("#congratulation-block");

   if (Number(allCount.textContent) === 30) {
        nextBtn.value = "Finish"
    }
    if (allCount.textContent > 30) {
        nextBtn.removeEventListener("click", getNewQuestion);
        [formBlock, choiceBlock].forEach(el => el.style.display = "none");
        congratsBlock.style.display = "block";
        document.querySelector("#correct-count").textContent = correctCount;
        congratsBlock.querySelector("button").addEventListener("click", () => {
            choiceBlock.style.display = "block";
            congratsBlock.style.display = "none";
        });
        switch (chosenType) {
            case "definitions":
            case "input":
            case "translations":
            case "words":
                localStorage.setItem("used questions", (JSON.stringify(qNums)));
                break
            case "verbSecond":
            case "verbThird":
                localStorage.setItem("used verbs", (JSON.stringify(qNumsVerbs)));
                break
        }
        const d = new Date();
        tryN++;
        localStorage.setItem("number of tries", (JSON.stringify(tryN)));
        document.cookie = `result${tryN}-${chosenType}-${d.getDate()}_${d.getMonth()}=${correctCount}; max-age=604800;`
        correctCount = 0;
        allCount.textContent = 0;
    }
}//Перевірка на кількість пройдених питань

let buttons = document.querySelectorAll(".test-type");

buttons.forEach(item => {
    item.addEventListener("click", (e) => {
        chosenType = e.target.value;
        startTest();
        form.querySelector("#next").addEventListener("click", getNewQuestion);
        getNewQuestion();
    })
})

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyA" && e.shiftKey) {
        window.location.href = "/Words-s/results.html"
    }
}) //Відкриття сторінки з результатами

document.querySelector("#answ-input").addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
        e.preventDefault();
        getNewQuestion();
    }
})