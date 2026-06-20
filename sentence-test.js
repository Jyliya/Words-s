let sentence = document.querySelector("#sentence");
let nextBtn = document.querySelector("#answer-btn");
let tenseName = document.querySelector("#tenseName");
let questionNum = document.querySelector("#question-num");
let answer, tense;
let correctCount = 0;
let usedTenses = [];

let data = fetch("sentence_test_words.json");
let irrVerbs = fetch("verbs.json");
let tryN = localStorage.getItem("number of tries");
let irrVerArr = [];
let nouns = [];
let verbs = [];
let contVerbs = [];
let tenses = [];
let nounTypes = ["Singular", "Plural"];
let sentenceTypes = ["Affirmative", "Negative", "Question"]
let alphabet = { "a": "A", "b": "B", "c": "C", "d": "D", "e": "E", "f": "F", "g": "G", "h": "H", "i": "I", "j": "J", "k": "K", "l": "L", "m": "M", "n": "N", "o": "O", "p": "P", "q": "Q", "r": "R", "s": "S", "t": "T", "u": "U", "v": "V", "w": "W", "x": "X", "y": "Y", "z": "Z" }

data
    .then(response => response.json())
    .then(json => {
        for (item of json["nouns"]) {
            nouns.push(item);
        }
        for (item of json["verbs"]) {
            verbs.push(item);
        }
        for (item of json["verbsForContinuous"]) {
            contVerbs.push(item);
        }
        for (item of json["tenses"]) {
            tenses.push(item);
        }
    })
    .catch(error => console.error(error));

irrVerbs
    .then(response => response.json())
    .then(json => {
        for (item of json["verbs"]) {
            irrVerArr.push(item);
        }
    })
    .catch(error => console.error(error));


document.querySelector("#start-btn").addEventListener("click", () => {
    document.querySelector("#start-btn-block").style.display = "none";
    document.querySelector("#question-block").style.display = "block";
    nextBtn.click()
})

// let verb = "bake"
// console.log(verb)
// console.log(verb.slice(0, -1))

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
} // Get a random number

nextBtn.addEventListener("click", () => {
    endTest();
    checkAnswer(answer);
    // console.log(questionNum.textContent)
    answer = generateSentence();
})

function checkRand(num, array, max) {
    if (array.length > max) {
        usedTenses.length = 0
        return num
    }; // fallback

    while (array.includes(num)) {
        num = getRandom(0, max);
    }
    return num;
}

// function showRightAnswer(answer) {
//     new swal({
//         title: "Неправильно!",
//         text: 'Правильна відповідь: ' + answer
//     });
// }//Показ правильного відповіді

function capitalizeAWord(word) {
    let capWord;
    for (const letter in alphabet) {
        if (letter == word[0]) {
            // console.log(letter + " " + word[0] + " " + alphabet[letter])
            capWord = alphabet[letter] + word.slice(1);
            // console.log(word[0] = alphabet[letter])
            // str.slice(0, index) + newChar + str.slice(index + 1);
            // console.log(capWord)
        }
    }
    return capWord
}

function generateSentence() {
    // console.log(questionNum.textContent)

    let type = nounTypes[getRandom(0, 1)];
    let sentenceType = sentenceTypes[getRandom(0, 1)];
    let randNumForTense = checkRand(getRandom(0, tenses.length - 1), usedTenses, tenses.length - 1)
    tense = tenses[randNumForTense];

    if (tense.name == "Present Perfect Continuous" && sentenceType == "Negative") {
        sentenceType = "Affirmative";
    }

    let noun = nouns[getRandom(0, nouns.length - 1)];

    let verbFullObj;
    if (tense.name.includes("Continuous")) { verbFullObj = contVerbs[getRandom(0, contVerbs.length - 1)] }
    else { verbFullObj = verbs[getRandom(0, verbs.length - 1)] }

    let object = verbFullObj["objects"][getRandom(0, verbFullObj["objects"].length - 1)];

    let answer = verbFullObj["verb"];
    let question = '';



    let noForm = true;
    let modalVerd = "";
    // tenseName.textContent = tense.name;
    if (type == "Plural") { noun += "s" };

    // console.log(sentenceType)
    // console.log(tense.name)
    if (sentenceType == "Negative") { question += "not " }

    if (tense["form"] && (sentenceType == "Affirmative" || tense.name.includes("Perfect"))) {
        for (const obj of irrVerArr) {
            if (answer == obj["verb"]) {
                answer = obj[`${tense["form"]}`];
                noForm = false;
                break
            }
        }
    }

    // console.log("form: " + !noForm + " " + tense["form"])

    if (noForm && (sentenceType == "Affirmative" || tense.name.includes("Continuous") || tense.name.includes("Perfect"))) {
        if (tense["verbEnding"] == "ed" || tense["verbEnding"] == "ing") {
            // console.log(Array.from(verb)[verb.length-1])
            if (Array.from(answer)[answer.length - 1] == "e") {
                // console.log(true)
                answer = answer.slice(0, -1)
            }
        }
        // Negation: Present simple, Past simple (e)

        // if (sentenceType == "Affirmative" || tense.name.includes("Continuous") || tense.name.includes("Perfect")) {
        // if (sentenceType != "Negative") {
        // if (sentenceType == "Negative" && (tense.name.includes("Simple"))) {}
        // else {
        // console.log("affirm: " + (sentenceType == "Affirmative") + " contin: " + tense.name.includes("Continuous") + " perfect: " + tense.name.includes("Perfect"))
        if (tense["verbEnding"]) { answer += tense["verbEnding"] }
        else if (tense[`verbEnding${type}`]) { answer += tense[`verbEnding${type}`] }
        // }
    }

    if (tense[`beforeVerb${sentenceType}`]) { modalVerd += tense[`beforeVerb${sentenceType}`] }
    else if (tense[`beforeVerb${sentenceType}${type}`]) { modalVerd += tense[`beforeVerb${sentenceType}${type}`] }

    let keyword = tense["keywords"][getRandom(0, tense["keywords"].length - 1)];
    do {
        if (keyword["sentenceType"].includes(sentenceType)) {
            break
        }
        else { keyword = tense["keywords"][getRandom(0, tense["keywords"].length - 1)]; }
    } while (true)

    if (keyword["position"] == "after") { object += " " + keyword.keyword }
    else if (keyword["position"] == "before") {
        modalVerd += " " + keyword.keyword
        question += keyword.keyword + " "
    }
    else if (keyword["position"] == "beginning") { noun = keyword.keyword + " " + noun }

    // if (tense["place"] == "after") { object += " " + tense["keywords"][getRandom(0, tense["keywords"].length - 1)] }
    // else if (tense["place"] == "before") {
    //     let randNum = getRandom(0, tense["keywords"].length - 1)
    //     modalVerd += " " + tense["keywords"][randNum]
    //     question += tense["keywords"][randNum] + " "
    // }
    // console.log("noun before capitalization: " + noun)
    if (keyword["position"] != "beginning" && sentenceType != "Question") { noun = capitalizeAWord(noun) }

    // console.log(noun + " " + keyword["position"])

    question += verbFullObj["verb"];
    sentence.textContent = noun + " " + "_________ " + `(${question})` + " " + object + "."

    // console.log("Answer: " + modalVerd + " " + answer)
    // console.log("___________________")
    usedTenses.push(randNumForTense);
    // console.log("Array: " + usedTenses)
    // console.log("Num: " + randForTense)
    return modalVerd + " " + answer
}

function checkAnswer(answer) {
    // console.log(questionNum.textContent)
    if (answer == undefined) {
        return
    }

    if (document.querySelector("#answer-input").value != "") {
        if ((document.querySelector("#answer-input").value.trim()).toLowerCase() == answer.trim().toLowerCase()) {
            correctCount += 1;
        } // Перевірка на правильну відповідь
        else {
            new swal({
                title: 'Час: ' + tense.name,
                text: "Правильна відповідь: " + answer
            });
        }
        document.querySelector("#answer-input").value = "";
    }
}

function endTest() {
    const congratsBlock = document.querySelector("#congratulation-block");

    questionNum.textContent = Number(questionNum.textContent) + 1;
    if (questionNum.textContent == 20) {
        nextBtn.textContent = "Finish"
    }
    if (questionNum.textContent > 20) {
        document.querySelector("#question-block").style.display = "none";
        congratsBlock.style.display = "block";
        document.querySelector("#correct-count").textContent = correctCount;
        congratsBlock.querySelector("button").addEventListener("click", () => {
            document.querySelector("#start-btn-block").style.display = "flex";
            congratsBlock.style.display = "none";
            nextBtn.textContent = "Next"
        });
        const d = new Date();
        tryN++;
        localStorage.setItem("number of tries", (JSON.stringify(tryN)));
        document.cookie = `result${tryN}-sentences-${d.getDate()}_${d.getMonth()}=${correctCount}; max-age=604800;`
        correctCount = 0;
        questionNum.textContent = 0;
        // console.log(questionNum.textContent)
    }
}//Перевірка на кількість пройдених питань

document.querySelector("#answer-input").addEventListener("keydown", (e) => {
    // let message = `keydown (Code = ${e.code}, Key = ${e.key})`;
    // console.log(message)
    if (e.code == "Enter" || e.code == "NumpadEnter") {
        e.preventDefault();
        document.querySelector("#answer-btn").click();
        // getNewQuestion();
    }
})

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyA" && e.shiftKey) {
        window.location.href = "/results.html"
        // window.location.href = "/Words-and-Tests/results.html"
    }
})