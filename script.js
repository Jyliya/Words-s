let data = fetch("words.json");
let dataArr = [];
let type;
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let categories = ['Art', 'Family', 'Clothes', 'Body parts', 'Characteristics', 'Emotions/qualities', 'People', 'Economics/finance', 'Science', 'Food', 'Furniture/household items', 'Places', 'Geography', 'Transport', 'Technology/devices', 'Nature/plants', 'Professions', 'School', 'Sport', 'Shops', 'Space', 'Time', 'Weather/seasons', 'Literature', 'Work', 'Objects/things', 'Abstract nouns', 'Adjectives', 'Adverbs', 'Verbs', 'Prepositions'];
let types = ['noun', 'adjective', 'verb', 'adverb', "preposition"];

data
    .then(response => response.json())
    .then(json => {
        sort(json["words"])
        for (item of json["words"]) {
            dataArr.push(item);
        }
    })

document.querySelector("select").addEventListener("change", (e) => {
    type = e.target.value;
    document.querySelector("#sorted").remove();
    sort(dataArr)
}); //Виклик сортування

function sort(arr) {
    if (type == undefined) {
        type = "none";
    }
    let arrLength;
    let arrType;
    let match;
    switch (type) {
        case "none":
            arrLength = 0;
            arrType = "none";
            break
        case "alphabet":
            arrLength = alphabet.length;
            arrType = alphabet;
            break
        case "category":
            arrLength = categories.length;
            arrType = categories;
            break
        case "type":
            arrLength = types.length;
            arrType = types;
            break
    }
    let table = document.createElement("table");
    table.id = "sorted"
    if (arrLength == 0 || arrType == "none") {
        for (item of arr) {
            table.appendChild(addWordToATable(item));
        }
    }
    else {
        for (let i = 0; i < arrLength; i++) {
            let blockHeadline = document.createElement("th");
            blockHeadline.colSpan = "2";
            blockHeadline.textContent = arrType[i];
            blockHeadline.classList.add("name")
            table.appendChild(blockHeadline);
            for (item of arr) {
                switch (type) {
                    case "alphabet":
                        match = Array.from(item.word)[0];
                        break
                    case "category":
                        match = item.category;
                        break
                    case "type":
                        match = item.type;
                        break
                };
                if (match == arrType[i]) {
                    table.appendChild(addWordToATable(item));
                }
            }
        }

    }
    document.querySelector("#word-block").appendChild(table)
} // Сортування

function addWordToATable(elem) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.textContent = elem.word;
    td2.textContent = elem.translation;
    tr.appendChild(td1);
    tr.appendChild(td2);
    return tr;
} // Додавання слів до таблиці (на сторінці)

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyA" && e.shiftKey) {
        window.location.href = "/Words-s/results.html"
    }
}) //Відкриття сторінки з результатами 