let sentence = document.querySelector("#sentence");
let nextBtn = document.querySelector("#answer-btn");
let tenseName = document.querySelector("#tenseName");
let questionNum = document.querySelector("#question-num");
let answer, tense;
let correctCount = 0;
let usedTenses = [], usedVerbs = [];

let data = fetch("sentence_test_words.json");
let irrVerbs = fetch("verbs.json");
let tryN = localStorage.getItem("number of tries");
let irrVerArr = [], nouns = [], verbs = [], tenses = [];
let nounTypes = ["Singular", "Plural"];
let sentenceTypes = ["Affirmative", "Negative", "Question"]
let alphabet = { "a": "A", "b": "B", "c": "C", "d": "D", "e": "E", "f": "F", "g": "G", "h": "H", "i": "I", "j": "J", "k": "K", "l": "L", "m": "M", "n": "N", "o": "O", "p": "P", "q": "Q", "r": "R", "s": "S", "t": "T", "u": "U", "v": "V", "w": "W", "x": "X", "y": "Y", "z": "Z" }
let vowels = ["a", "o", "u", "i", "e"];

data
    .then(response => response.json())
    .then(json => {
        for (item of json["nouns"]) {
            nouns.push(item);
        }
        for (item of json["verbs"]) {
            verbs.push(item);
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

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
} // Get a random number

nextBtn.addEventListener("click", () => {
    checkAnswer(answer);
    endTest();
    answer = generateSentence();
})

function checkRand(num, array, max) {
    if (array.length > max) {
        array.length = 0
        return num
    }; // fallback

    while (array.includes(num)) {
        num = getRandom(0, max);
    }
    return num;
}

function capitalizeAWord(word) {
    let capWord;
    for (const letter in alphabet) {
        if (letter == word[0]) {
            capWord = alphabet[letter] + word.slice(1);
        }
    }
    return capWord
}

function addEndingForPS(word) {
    let changedWord;
    if (Array.from(word)[word.length - 1] == "y") {
        if (!vowels.includes(Array.from(word)[word.length - 2])) {
            changedWord = word.slice(0, word.length - 1) + "ies"
        }
    }
    else if (word.slice(word.length - 2, word.length) == "ch" || (Array.from(word)[word.length - 1] == "o" || word.slice(word.length - 2, word.length) == "sh" || (Array.from(word)[word.length - 1]) == "x" || word.slice(word.length - 2, word.length) == "ss")) {
        changedWord = word + "es"
    }
    else { changedWord = word + "s" }
    return changedWord
}

function getAVerb() {
    let verb;
    let randNum = checkRand(getRandom(0, 12), usedVerbs, verbs.length - 1);
    let randNum2 = checkRand(getRandom(0, verbs.length - 1), usedVerbs, verbs.length - 1);
    if (tense.name.includes("Continuous")) {
        verb = verbs[randNum];
        usedVerbs.push(randNum);
    }
    else {
        verb = verbs[randNum2];
        usedVerbs.push(randNum2);
    }
    console.log(verb)
    console.log(usedVerbs)
    return verb
}

function generateSentence() {
    let type = nounTypes[getRandom(0, 1)];
    let sentenceType = sentenceTypes[getRandom(0, 1)];
    let randNumForTense = checkRand(getRandom(0, tenses.length - 1), usedTenses, tenses.length - 1)
    tense = tenses[randNumForTense];

    if (tense.name == "Present Perfect Continuous" && sentenceType == "Negative") {
        sentenceType = "Affirmative";
    }

    let noun = nouns[getRandom(0, nouns.length - 1)];

    let verbFullObj = getAVerb();

    let object = verbFullObj["objects"][getRandom(0, verbFullObj["objects"].length - 1)];

    let answer = verbFullObj["verb"];
    let question = '';

    if (tense.name == "Present Simple" && sentenceType == "Affirmative") {

    }

    let noForm = true;
    let modalVerd = "";
    if (type == "Plural") { noun += "s" };

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


    if (noForm && (sentenceType == "Affirmative" || tense.name.includes("Continuous") || tense.name.includes("Perfect"))) {
        if (tense["verbEnding"] == "ed" || tense["verbEnding"] == "ing") {
            if (Array.from(answer)[answer.length - 1] == "e") {
                answer = answer.slice(0, -1)
            }
        }
        if (tense["verbEnding"]) { answer += tense["verbEnding"] }
        else if (tense[`verbEnding${type}`]) { answer += tense[`verbEnding${type}`] }
    }

    if (tense.name == "Present Simple" && sentenceType == "Affirmative" && type == "Singular") {
        answer = addEndingForPS(verbFullObj["verb"]);
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

    if (keyword["position"] != "beginning" && sentenceType != "Question") { noun = capitalizeAWord(noun) }

    question += verbFullObj["verb"];
    sentence.textContent = noun + " " + "_________ " + `(${question})` + " " + object + "."

    usedTenses.push(randNumForTense);
    return modalVerd + " " + answer
}

function checkAnswer(answer) {
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
        usedVerbs.length = 0;
    }
}//Перевірка на кількість пройдених питань

document.querySelector("#answer-input").addEventListener("keydown", (e) => {
    if (e.code == "Enter" || e.code == "NumpadEnter") {
        e.preventDefault();
        document.querySelector("#answer-btn").click();
    }
})

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyA" && e.shiftKey) {
        window.location.href = "/Words-s/results.html"
    }
})