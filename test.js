let data = fetch("words.json");
let dataArr = [];
let qNums = JSON.parse(localStorage.getItem("used questions")) || [];
let aNums = [];
let chosenType;
let tryN = localStorage.getItem("number of tries");

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
    let question;
    let answer;
    checkAnswer();
    allCount.textContent = Number(allCount.textContent) + 1;
    endTest();

    let randNum = getRandom(0, (dataArr.length - 1));
    randNum = checkRand(randNum, qNums);
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
    }

    document.querySelector("#question").textContent = question;
    form.querySelector(`#a${answerNumber}`).value = answer;
    document.querySelector(`#answ${answerNumber}`).textContent = answer;

    if (chosenType != "input") {
        for (let i = 1; i <= 4; i++) {
            if (i == answerNumber) {
                continue
            }
            else {
                let randomForArray = checkRand((getRandom(0, (dataArr.length - 1))), aNums);
                if (randomForArray == randNum) {
                    i--;
                    continue
                }
                else {
                    let randomAnswer;
                    switch (chosenType) {
                        case "definitions":
                        case "translations":
                            randomAnswer = dataArr[randomForArray].word;
                            break
                        case "words":
                            randomAnswer = dataArr[randomForArray].translation;
                            break
                    }
                    form.querySelector(`#a${i}`).value = randomAnswer;
                    document.querySelector(`#answ${i}`).textContent = randomAnswer;
                    aNums.push(randomForArray);
                }
            }
        }
    }
    qNums.push(randNum);
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

function checkAnswer() {
    let answer;
    if (qNums.length == 0) {
        return
    }

    switch (chosenType) {
        case "input":
        case "definitions":
        case "translations":
            answer = dataArr[qNums[qNums.length - 1]].word;
            break
        case "words":
            answer = dataArr[qNums[qNums.length - 1]].translation
            break
    }

    if (document.querySelector("#answ-input").value != "") {
        if (chosenType == "input") {
            if ((document.querySelector("#answ-input").value.trim()).toLowerCase() == answer) {
                correctCount += 1;
            } // Перевірка на правильну відповідь
            else {
                new swal({
                    title: "Неправильно!",
                    text: 'Правильна відповідь: ' + answer

                });
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
                new swal({
                    title: "Неправильно!",
                    text: 'Правильна відповідь: ' + answer
                    // icon: "success"
                });
            }
            for (let i = 0; i < 5; i++) {
                form[i].checked = false
            };//Прибирання відмітки
        } //Перевірка на пусту відповідь
    }
}

function checkRand(num, array) {
    do {
        if (array.includes(num)) {
            num = getRandom(0, (dataArr.length - 1));
            if (qNums.length == dataArr.length) {
                qNums = [];
                localStorage.removeItem("questions used");
                break
            }
        }
        else {
            break
        }
    } while (true)
    return num
}//Перевірка на вже викликане питання

function endTest() {
    const nextBtn = document.querySelector("#next");
    const formBlock = document.querySelector("#form-block");
    const choiceBlock = document.querySelector("#test-choice");
    const congratsBlock = document.querySelector("#congratulation-block");

    if (allCount.textContent == 30) {
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
        localStorage.setItem("used questions", (JSON.stringify(qNums)));
        const d = new Date();
        tryN++;
        localStorage.setItem("number of tries", (JSON.stringify(tryN)));
        document.cookie = `result${tryN}-${chosenType}-${d.getDate()}_${d.getMonth()}=${correctCount}; max-age=1.21e+6;`
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