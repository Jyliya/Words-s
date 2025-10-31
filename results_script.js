let results = document.cookie;
let types = [];
let values = [];
let dates = [];
let formatedDates = [];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

let index = 1;
let arrIndex = 0;

function getItem(type, index, array) {
    
    let res;
    let endRes;
    switch (type) {
        case "type":
            res = `result${index}-`;
            endRes = "-";
            break
        case "date":
            res = `result${index}-${types[types.length-1]}-`
            endRes = "="
            break
        case "value":
            res = `result${index}-${types[types.length-1]}-${dates[dates.length-1]}=`
            endRes = ";";
            break
    }

    let pos = results.indexOf(res);

    if (pos != -1) {
        let start = pos + res.length;
        let end = results.indexOf(endRes, start);
        if (end == -1) {
            end = results.length;
        }
        let result = results.substring(start, end);
        array.push(result)
        return result
    }
    else {
        return
    }
    
}

do {
    const t = getItem("type", index, types);
    const d = getItem("date", index, dates);
    const v = getItem("value", index, values);

    if (index > 200) {
        break;
    }
    index++;
}
while (true)

dates.forEach(date => {
    underline = date.indexOf("_")
    let formatedDate = months[date.substring(underline+1, date.length)] + " " + date.substring(0, underline);
    formatedDates.push(formatedDate)
})

for (let i = 0; i < types.length; i++) {
    let tr = document.createElement("tr");
    createTd(formatedDates[i], tr);
    createTd(types[i], tr);
    createTd(values[i], tr);
    document.querySelector("#result-table").append(tr)
}

function createTd(item, tr) {
    let td = document.createElement("td");
    td.textContent = item;
    tr.append(td)

}