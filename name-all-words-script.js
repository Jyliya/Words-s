let data = fetch("words_in_categories.json");
let wonCategories = JSON.parse(localStorage.getItem("finished categories")) || [];
let categories = [];
let wordArrays = [];
let gueesedWords = [];
let maxPoints = 0;
let catNum;

data
    .then(response => response.json())
    .then(json => {
        // console.log(json)
        for (const item in json) {
            // console.log(item)
            categories.push(item);
            wordArrays.push(json[item])
        }
        // console.log(categories)
        // console.log(wordArrays)
    })
    .catch(error => console.error(error));


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
} // Get random number

function checkRand(num, array1, array2) {
    // if (array.length > max) return 0;

    while (array1.includes(array2[num])) {
        num = getRandom(0, array2.length - 1);
    }
    return num;
}

document.querySelector("#start-btn").addEventListener("click", () => {
    if (wonCategories.length >= categories.length) {
        wonCategories.length = 0;
    }
    document.querySelector("#start-btn-block").style.display = "none";
    document.querySelector("#game-block").style.display = "block";
    // console.log(wonCategories)
    catNum = checkRand(getRandom(0, categories.length - 1), wonCategories, categories)
    document.querySelector("#category").textContent = categories[catNum];
    for (let i = 0; i < 15; i++) {
        if (fillWordBlock(i, catNum)) {
            document.querySelector("#game-block").appendChild(fillWordBlock(i, catNum));
        }
    }
    document.querySelector("#max-points").textContent = maxPoints / 2;
})

document.querySelector("#submit-btn").addEventListener("click", checkAnswer);

document.querySelector("#hint-btn").addEventListener("click", () => {
    let allGueesedWords = [];
    document.querySelectorAll(".guessed").forEach(elem => {
        allGueesedWords.push(elem.textContent)
    });
    // console.log(allGueesedWords)
    let hintWordNum = checkRand(getRandom(0, wordArrays[catNum].length - 1), allGueesedWords, wordArrays[catNum]);
    let hintWord = wordArrays[catNum][hintWordNum];
    // console.log(hintWordNum + "   " + hintWord)
    new swal({
        title: createHint(hintWord)
    })
})

document.querySelector("#word-input").addEventListener("keydown", (e) => {
    if (e.code == "Enter" || e.code == "NumpadEnter") {
        e.preventDefault();
        checkAnswer();
    }
})

function createHint(word) {
    let hint = '';
    // let beggining, number;
    // switch (true) {
    //     case word.length <= 5:
    //         beggining = word[0] + " ";
    //         number = 2
    //         break
    //     case word.length > 5 && word.length <= 9:
    //         beggining = word[0] + " " + word[1] + " " + word[2];
    //         number = 4
    //         break
    //     case word.length > 9:
    //         beggining = word[0] + " " + word[1] + " " + word[2] + " " + word[3];
    //         number = 5
    //         break
    // }
    // hint += beggining;
    // for (let i = 0; i < word.length - number; i++) {
    //     hint += " — "
    // }
    // hint += word[word.length - 1]
    // if (word.includes(" ")) hint = "Two words: " + hint

    // console.log(word)
    // for (let i = 0; i < word.length; i++) {
    //     // console.log(word[i])
    //     if (word.length <= 5) {
    //         if (i < 1 || i > (word.length - 2)) {
    //             hint += word[i] + " ";
    //         }
    //         else hint += " — ";
    //     }
    //     else if (word.length <= 9) {
    //         if (i < 3 || i > word.length - 2) {
    //             hint += word[i] + " ";
    //         }
    //         else if (word[i] == " ") {
    //             hint += "\n" + word[i + 1] + " ";
    //             i++;
    //         }
    //         else hint += " — ";
    //     }
    //     else if (word.length > 9) {
    //         if (i < 4 || i > word.length - 3) {
    //             hint += word[i] + " ";
    //         }
    //         else if (word[i] == " ") {
    //             hint += "\n" + word[i + 1] + " ";
    //             i++
    //         }
    //         else hint += " — ";
    //     }
    // }

    let len = word.length;
    let start, end;

    if (len <= 5) {
        start = 1;
        end = len - 2;
    } else if (len <= 9) {
        start = 3;
        end = len - 2;
    } else {
        start = 4;
        end = len - 3;
    }

    for (let i = 0; i < len; i++) {
        if (i < start || i > end) {
            hint += word[i] + " ";
        } else if (word[i] === " " && len > 5) {
            hint += "\n" + word[i + 1] + " ";
            i++;
        } else {
            hint += " — ";
        }
    }

    return hint



    // if (word.length <= 5) {
    //     hint += word[0] + " ";
    //     for (let i = 0; i < word.length - 2; i++) {
    //         hint += " — "
    //     }
    //     hint += word[word.length - 1] + " "
    //     return hint
    // }
    // else if (word.length <= 9) {
    //     hint += word[0] + " " + word[1] + " " + word[2];
    //     for (let i = 0; i < word.length - 4; i++) {
    //         hint += " — "
    //     }
    //     hint += word[word.length - 1]
    //     return hint
    // }
    // else {
    //     hint += word[0] + " " + word[1] + " " + word[2] + " " + word[3];
    //     for (let i = 0; i < word.length - 5; i++) {
    //         hint += " — "
    //     }
    //     hint += word[word.length - 1]
    //     return hint
    // }
}

function checkAnswer() {
    let inputWord;
    if (categories[catNum] == "Countries" || categories[catNum] == "School") {
        inputWord = document.querySelector("#word-input").value.trim()
    }
    else {
        inputWord = document.querySelector("#word-input").value.trim().toLowerCase();
    }
    // console.log(inputWord)
    if (wordArrays[catNum].includes(inputWord) && !gueesedWords.includes(inputWord)) {
        let wordDiv = document.querySelector(`#words-${inputWord.length}`)
        // console.log(wordDiv)
        let wordBlock = createWordP(inputWord, "guessed");
        wordDiv.appendChild(wordBlock);

        addPoints(`#words-${inputWord.length}-score`, 1);
        addPoints("#points", 5);
        checkPoints();
        gueesedWords.push(inputWord)
        // console.log(document.querySelector(`#words-${inputWord.length}-score`).textContent)
    }
    document.querySelector("#word-input").value = "";
}


function addPoints(id, point) {
    let blockScore = document.querySelector(id).textContent;
    blockScore = Number(blockScore) + point;
    document.querySelector(id).textContent = blockScore;
}

function checkPoints() {
    if (document.querySelector("#points").textContent == (maxPoints / 2)) {
        wonCategories.push(categories[catNum])
        localStorage.setItem("finished categories", (JSON.stringify(wonCategories)));
        new swal({
            title: "Congratulations!",
            text: 'You gueesed all words.',
            icon: "success",
            draggable: true
        }).then(() => {
            location.reload();
        });
    };
}

function createDiv(className) {
    let div = document.createElement("div");
    div.classList.add(className);
    return div;
}

function createWordP(word, className) {
    let p = document.createElement("p");
    p.classList.add(className);
    p.textContent = word;
    return p
}

function createSpan(word, id) {
    let span = document.createElement("span");
    span.id = id;
    span.textContent = word;
    return span
}

function createScore(num, wordNum) {
    let p = document.createElement("p");
    p.classList.add("block-score");
    p.appendChild(createSpan(0, `words-${wordNum}-score`));
    p.appendChild(createWordP(`/${num}`))
    return p
}

function fillWordBlock(num, categ) {
    let div = createDiv("word-block");
    let index = 0;
    for (const word of wordArrays[categ]) {
        if (word.length == num) {
            index++
        }
    }
    if (index != 0) {
        // console.log(maxPoints + " " + index*5)
        maxPoints = maxPoints + index * 5;
        let headerDiv = createDiv("word-block-header");
        headerDiv.appendChild(createWordP(`${num}-symbol words`, "word-header"));
        headerDiv.appendChild(createScore(index, num));
        div.appendChild(headerDiv);
        div.id = `words-${num}`;
        return div
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyA" && e.shiftKey) {
        window.location.href = "/results.html"
        // window.location.href = "/Words-and-Tests/results.html"
    }
})