const key = "";
const tdBin = "";
const tmrwBin = "";
const Dbin = "";

function loadContent() {
    const request = new XMLHttpRequest();
    request.open('GET', "https://picsum.photos/2000/1800/?blur");
    request.send();

    request.addEventListener('load', function(){
        const pic = this.responseURL;

        document.getElementById("all").style.backgroundImage = `url('${pic}')`;

        document.getElementById("all").style.opacity = 1;

        fillTimeline();
        fillDeadL();
    })

}

function fillTimeline() {
    let table = [];
    const hours = 24;
    
    let htmltable = "";
    let htmlselect = "";

    const readrequest = new XMLHttpRequest();

    readrequest.open("GET", "https://api.jsonbin.io/b/"+tdBin+"/latest", true);
    readrequest.setRequestHeader("secret-key", key);
    readrequest.send();

    let today = new Date().toLocaleDateString(undefined).toString();
    let d = {};
    d.date = today;
    table.unshift(d);

    readrequest.onreadystatechange = () => {
        if (readrequest.readyState == XMLHttpRequest.DONE) {

            let filling = JSON.parse(readrequest.responseText);

            if((readrequest.responseText || readrequest.responseText != "") && (filling[0].date == today))
            {
                document.getElementById("tab").innerHTML="";
                document.getElementById("addtask").innerHTML="";
                for (i=1;i<filling.length;i++)
                {
                    htmltable = `
                    <tr>
                        <td class="time">
                        `+ filling[i].time +`
                        </td>
                        <td class="task">
                        `+ filling[i].task +`
                        </td>
                    </tr>
                    `;

                    htmlselect = `
                    <option value="`+filling[i].time+`">`+filling[i].time+`</option>
                    `

                    document.getElementById("tab").insertAdjacentHTML("beforeend", htmltable);
                    document.getElementById("addtask").insertAdjacentHTML("beforeend", htmlselect);
                }
                document.getElementById("timeline").style.opacity = 1;
            }
            else {

                for (i = 0; i < hours; i++) {
                    let element = {};
                    element.time = i + ":00";
                    element.task = "";
                    table.push(element);
                }

                const jsrequest = new XMLHttpRequest();

                jsrequest.open("PUT", "https://api.jsonbin.io/b/"+tdBin, true);
                jsrequest.setRequestHeader("Content-Type", "application/json");
                jsrequest.setRequestHeader("secret-key", key);
                jsrequest.send(JSON.stringify(table));

                jsrequest.onreadystatechange = () => {
                    if (jsrequest.readyState == XMLHttpRequest.DONE) {

                        const readrequest2 = new XMLHttpRequest();
                        readrequest2.open("GET", "https://api.jsonbin.io/b/"+tdBin+"/latest", true);
                        readrequest2.setRequestHeader("secret-key", key);
                        readrequest2.send();

                        readrequest2.onreadystatechange = () => {

                            if (readrequest2.readyState == XMLHttpRequest.DONE) {

                                let filling2 = JSON.parse(readrequest2.responseText);
                                for (i=1;i<filling2.length;i++) {
                                    htmltable = `
                                    <tr>
                                        <td class="time">
                                        `+ filling2[i].time +`
                                        </td>
                                        <td class="task">
                                        `+ filling2[i].task +`
                                        </td>
                                    </tr>
                                    `;

                                    htmlselect = `
                                    <option value="`+filling2[i].time+`">`+filling2[i].time+`</option>
                                    `

                                    document.getElementById("tab").insertAdjacentHTML("beforeend", htmltable);
                                    document.getElementById("addtask").insertAdjacentHTML("beforeend", htmlselect);
                                }

                                document.getElementById("timeline").style.opacity = 1;
                            }

                        }
                    };

                }
            }
        };
    

    //TODO: Fetch+format times+tasks to a new JSON, update JSON when task had been added. Fill JSON, always check JSON when loading site, update JSON when adding task.
    }
}

function btnPush() {

    const readreq = new XMLHttpRequest();

    readreq.open("GET", "https://api.jsonbin.io/b/"+tdBin+"/latest", true);
    readreq.setRequestHeader("secret-key", key);
    readreq.send();

    readreq.onreadystatechange = () => {
        if (readreq.readyState == XMLHttpRequest.DONE) {
            let filling = JSON.parse(readreq.responseText);
            const timeval = document.getElementById("addtask");
            const textval = document.getElementById("typetask");
            const btnval = document.getElementById("taskbtn");
        
            for (i=1;i < filling.length;i++) {
                if ((filling[i].time == timeval.value) && textval.value != "") {

                    filling[i].task += " • " + textval.value;
                    const jsrequest = new XMLHttpRequest();

                    jsrequest.open("PUT", "https://api.jsonbin.io/b/"+tdBin, true);
                    jsrequest.setRequestHeader("Content-Type", "application/json");
                    jsrequest.setRequestHeader("secret-key", key);
                    jsrequest.send(JSON.stringify(filling));

                    jsrequest.onreadystatechange = () => {
                        if (jsrequest.readyState == XMLHttpRequest.DONE) {
                            btnval.value = "Task added!";
                            setTimeout(function() {
                                btnval.value = "Add task"; 
                            }, 2000);

                            fillTimeline();

                        }
                    }
                    

                    break;

                }
                else {
                }
                
            }
        
        }
    }
}

function fillDeadL() {

    const jsrequest = new XMLHttpRequest();

    let htmllist = "";

    jsrequest.open("GET", "https://api.jsonbin.io/b/"+Dbin+"/latest", true);
    jsrequest.setRequestHeader("secret-key", key);
    jsrequest.send();

    jsrequest.onreadystatechange = () => {
        if (jsrequest.readyState == XMLHttpRequest.DONE) {
            let filling = JSON.parse(jsrequest.responseText);

            document.getElementById("deadlinelist").innerHTML="";

            for (i=0;i<filling.list.length;i++) {
                htmllist = `
                    <li>`+filling.list[i].date+`: `+filling.list[i].line+`</li>
                `;

                document.getElementById("deadlinelist").insertAdjacentHTML("beforeend", htmllist);
            }
            document.getElementById("deadline").style.opacity = 1;
            
        }
    }

}

function deadL() {
    const listing = [];

    const jsrequest = new XMLHttpRequest();

    jsrequest.open("GET", "https://api.jsonbin.io/b/"+Dbin+"/latest", true);
    jsrequest.setRequestHeader("Content-Type", "application/json");
    jsrequest.setRequestHeader("secret-key", key);
    jsrequest.send();

    jsrequest.onreadystatechange = () => {
        if (jsrequest.readyState == XMLHttpRequest.DONE) {
            let filling = JSON.parse(jsrequest.responseText);

            const timeval = document.getElementById("deadDate");
            const textval = document.getElementById("typedead");
            const btnval = document.getElementById("deadbtn");

            if (timeval.value != "" && timeval.value != undefined && textval.value != "" && textval.value != undefined)
            {
                filling["list"].push({"date": timeval.value, "line": textval.value});

                console.table(filling);

                const jsrequest2 = new XMLHttpRequest();

                jsrequest2.open("PUT", "https://api.jsonbin.io/b/"+Dbin, true);
                jsrequest2.setRequestHeader("Content-Type", "application/json");
                jsrequest2.setRequestHeader("secret-key", key);
                jsrequest2.send(JSON.stringify(filling));

                jsrequest2.onreadystatechange = () => {
                    if (jsrequest2.readyState == XMLHttpRequest.DONE) {
                        btnval.value = "Deadline added!";
                        setTimeout(function() {
                            btnval.value = "Add deadline"; 
                        }, 2000);
                        fillDeadL();
                    }
                }
            }
            else {

            }
                    
        }
    }

}