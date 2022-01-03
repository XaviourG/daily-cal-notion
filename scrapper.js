//Using potion API and a webs hared notion page get task database!
const url = "https://potion-api.now.sh/table?id=5f447212868b4abeab69976ad6c62592"

const queryString = window.location.search;
const fetchPromise = fetch(url);
const tasks = [];
var count = 0;
var done = false;

//Get promise from API, extract all tasks happening today!
fetchPromise.then(response => {
    return response.json();
}).then(taskData => {
    if (queryString) {
        const param = new URLSearchParams(queryString);
        var today = param.get('date');
    } else {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
    }

    const h1 = document.querySelector("h1");
    h1.textContent += `: ${today}`;

    for (var i = 0; i < taskData.length; i++) {
        if (taskData[i].fields.Date.start_date == today) {
            tasks.push(taskData[i]);
            count += 1;
        }
    }
    done = true;
}).then(drawCal)


function incT(t) {
    const str = "" + t;
    if (str.charAt(str.length - 2) == "3") { return t + 70; }
    else { return t + 30; }
}

function addTime(start, add) {
    var t = parseInt(start);
    var i = add / 30;
    while (i > 0) {
        t = incT(t);
        i -= 1;
    }

    if (t < 1000) { return ("0" + t); }
    else { return t; }
}
//console.log(tasks);
function drawCal() {
    console.log(tasks.length);
    for (j = 0; j < tasks.length; j++) {
        const name = `${tasks[j].fields.Name} <${tasks[j].fields.Domain}>`;
        const start = tasks[j].fields.Starting;
        const duration = tasks[j].fields.Duration;
        const done = tasks[j].fields.Completed;
        console.log(j, name, start, duration);

        if (start) {
            const tr = document.querySelector(`#t${start}`);
            tr.textContent = name;
            if (done) { tr.classList += " done"; }
            if (duration) {
                if (duration <= 30) {
                    tr.classList += " wholeTask";

                } else if (duration <= 60) {
                    tr.classList += " startTask";

                    const tr2 = document.querySelector(`#t${addTime(start, 30)}`);
                    tr2.classList += " endTask";
                } else {
                    tr.classList += " startTask";

                    var t = duration - 30;
                    var i = 1;
                    while (t > 30) {
                        const tr2 = document.querySelector(`#t${addTime(start, 30 * i)}`);
                        tr2.classList += " midTask";
                        i += 1;
                        t = t - 30;
                    }
                    const tr2 = document.querySelector(`#t${addTime(start, 30 * i)}`);
                    tr2.classList += " endTask";
                }
            } else {
                tr.classList += " wholeTask";
            }
        } else {
            const ul = document.querySelector(" #unscheduledList");
            const li = document.createElement('li');
            li.textContent = `${name}`;
            if (done) { li.classList += " done"; }
            ul.appendChild(li);
        }
    }
    highlightHour();
}

function highlightHour() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    m = Math.floor(m / 30) * 3;
    if (h < 10) { h = "0" + h; }
    console.log(`t${h}${m}0`);
    const tr = document.querySelector(`#t${h}${m}0`);
    tr.classList += " now";
    const th = document.querySelector(`#h${h}${m}0`);
    th.classList += " now";

}


//Daily Calendar view work in 30 mintue increments show from 5:30AM ->8PM, so 58 15 minute blocks. Just a table with that many rows. Fill it in  alternating colours.