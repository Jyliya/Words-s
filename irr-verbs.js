let data = fetch("verbs.json");
let dataArr = [];
let type;

data
    .then(response => response.json())
    .then(json => {
        for (item of json["verbs"]) {
            dataArr.push(item);
        }
    })
    .then(()=>{
        for (const verb of dataArr) {
            document.querySelector("#verbs").appendChild(addWordToATable(verb))
        }

    })
    .catch(error => console.error(error));

function addWordToATable(elem) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    td1.classList.add("verb")
    td1.textContent = elem.verb;
    td2.textContent = elem.second;
    td3.textContent = elem.third;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    return tr;
} // Додавання слів до таблиці (на сторінці)

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyA" && e.shiftKey) {
        window.location.href = "/results.html"
        // window.location.href = "/Words-and-Tests/results.html"
    }
}) //Відкриття сторінки з результатами