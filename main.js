// Secret key and bin IDs from jsonbin
const key = "";
const taskBin = "";
const deadLBin = "";

// Loads bg img and then content after request is done
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

// Fills the timeline with content
function fillTimeline() {
    let table = [];
    const hours = 24;
    
    let htmltable = "";
    let htmlselect = "";

    const readrequest = new XMLHttpRequest();

    readrequest.open("GET", "https://api.jsonbin.io/b/"+taskBin+"/latest", true);
    readrequest.setRequestHeader("secret-key", key);
    readrequest.send();

    // Fetches today's date to compare it with the date in JSON file
    let today = new Date().toLocaleDateString(undefined).toString();
    let d = {};
    d.date = today;
    table.unshift(d);

    readrequest.onreadystatechange = () => {
        if (readrequest.readyState == XMLHttpRequest.DONE) {


            let filling = JSON.parse(readrequest.responseText);

            // Fills timeline with JSON if there is data to be fetched from today's date
            if((readrequest.responseText || readrequest.responseText != "") && filling.list && filling.list[0].date == today)
            {
                document.getElementById("tab").innerHTML="";
                document.getElementById("addtask").innerHTML="";
                for (i=1;i<filling.list.length;i++)
                {
                    htmltable = `
                    <tr>
                        <td class="time">
                        `+ filling.list[i].time +`
                        </td>
                        <td class="task">
                        `+ filling.list[i].task +`
                        </td>
                    </tr>
                    `;

                    htmlselect = `
                    <option value="`+filling.list[i].time+`">`+filling.list[i].time+`</option>
                    `

                    document.getElementById("tab").insertAdjacentHTML("beforeend", htmltable);
                    document.getElementById("addtask").insertAdjacentHTML("beforeend", htmlselect);
                }
                document.getElementById("timeline").style.opacity = 1;
            }
            // else creates a new timeline and updates JSON with that data
            else {

                for (i = 0; i < hours; i++) {
                    let element = {};
                    element.time = i + ":00";
                    element.task = "";
                    table.push(element);
                }

                const jsonfill = {
                    "list": table
                    
                };

                const jsrequest = new XMLHttpRequest();

                jsrequest.open("PUT", "https://api.jsonbin.io/b/"+taskBin, true);
                jsrequest.setRequestHeader("Content-Type", "application/json");
                jsrequest.setRequestHeader("secret-key", key);
                jsrequest.send(JSON.stringify(jsonfill));

                jsrequest.onreadystatechange = () => {
                    if (jsrequest.readyState == XMLHttpRequest.DONE) {

                        const readrequest2 = new XMLHttpRequest();
                        readrequest2.open("GET", "https://api.jsonbin.io/b/"+taskBin+"/latest", true);
                        readrequest2.setRequestHeader("secret-key", key);
                        readrequest2.send();

                        readrequest2.onreadystatechange = () => {

                            if (readrequest2.readyState == XMLHttpRequest.DONE) {

                                let filling2 = JSON.parse(readrequest2.responseText);
                                for (i=1;i<filling2.list.length;i++) {
                                    htmltable = `
                                    <tr>
                                        <td class="time">
                                        `+ filling2.list[i].time +`
                                        </td>
                                        <td class="task">
                                        `+ filling2.list[i].task +`
                                        </td>
                                    </tr>
                                    `;

                                    htmlselect = `
                                    <option value="`+filling2.list[i].time+`">`+filling2.list[i].time+`</option>
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
    
    }
}

// function that adds tasks in the timeline
function btnPush() {

    const readreq = new XMLHttpRequest();

    readreq.open("GET", "https://api.jsonbin.io/b/"+taskBin+"/latest", true);
    readreq.setRequestHeader("secret-key", key);
    readreq.send();

    readreq.onreadystatechange = () => {
        if (readreq.readyState == XMLHttpRequest.DONE) {
            let filling = JSON.parse(readreq.responseText);
            const timeval = document.getElementById("addtask");
            const textval = document.getElementById("typetask");
            const btnval = document.getElementById("taskbtn");
        
            for (i=1;i < filling.list.length;i++) {
                
                // matches and adds task to correct time if task is defined
                if ((filling.list[i].time == timeval.value)) {
                    if (!textval.value == "" || !textval.value == undefined || !textval.value == null) {
                        
                        filling.list[i].task += " • " + textval.value;
                        const jsrequest = new XMLHttpRequest();
    
                        jsrequest.open("PUT", "https://api.jsonbin.io/b/"+taskBin, true);
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

                    // error if task is not defined
                    else {
                        btnval.value = "Failed adding task";
                            setTimeout(function() {
                                btnval.value = "Add task"; 
                            }, 2000);
                    }

                }
                else {
                    
                }
                
            }
        
        }
    }
}

// fills deadline with content
function fillDeadL() {

    const jsrequest = new XMLHttpRequest();

    let htmllist = "";

    const today = new Date().toLocaleDateString(undefined).toString();
    const differenceToday = Date.parse(today);

    jsrequest.open("GET", "https://api.jsonbin.io/b/"+deadLBin+"/latest", true);
    jsrequest.setRequestHeader("secret-key", key);
    jsrequest.send();

    jsrequest.onreadystatechange = () => {
        if (jsrequest.readyState == XMLHttpRequest.DONE) {
            let filling = JSON.parse(jsrequest.responseText);


            document.getElementById("deadlinelist").innerHTML="";

            if (jsrequest.responseText && filling.list) {
                let deadlineArray = filling.list;

                // sorts deadlines by date
                deadlineArray.sort(function(a,b) {
                    return new Date(b.date) - new Date(a.date);
                });

                // fills deadline 
                for (i=0;i<filling.list.length;i++) {
                    if (filling.list[i].date != "" && filling.list[i].line != "") {

                        let deadlineDate = filling.list[i].date;
                        const differenceDeadline = Date.parse(deadlineDate);

                        // colour-sorts the deadlines depending on when their date is
                        // date is in the past
                        if (differenceToday > differenceDeadline) {
                            htmllist = `
                            <li class="late">`+filling.list[i].date+`: `+filling.list[i].line+`<button class="btn remove" onclick="deleteDeadL(this)">x</button></li>
                            `;
        
                            document.getElementById("deadlinelist").insertAdjacentHTML("beforeend", htmllist);
                        }
                        // date is today
                        else if (differenceToday == differenceDeadline) {
                            htmllist = `
                            <li class="tday">`+filling.list[i].date+`: `+filling.list[i].line+`<button class="btn remove" onclick="deleteDeadL(this)">x</button></li>
                            `;
        
                            document.getElementById("deadlinelist").insertAdjacentHTML("beforeend", htmllist);
                        }
                        // date is not today / in the past AKA the futuuureeee
                        else {
                            htmllist = `
                            <li>`+filling.list[i].date+`: `+filling.list[i].line+`<button class="btn remove" onclick="deleteDeadL(this)">x</button></li>
                            `;
        
                            document.getElementById("deadlinelist").insertAdjacentHTML("beforeend", htmllist);
                        }
                        
                    }
                    else {

                    }
                    
                }
            }
            // sends JSON to JSONbin in correct format (first time)
            else {
                const fillEmptyJSON = new XMLHttpRequest();

                fillEmptyJSON.open("PUT", "https://api.jsonbin.io/b/"+deadLBin, true);
                fillEmptyJSON.setRequestHeader("Content-Type", "application/json");
                fillEmptyJSON.setRequestHeader("secret-key", key);
                
                const jsonfill = {
                    "list": [ {
                        "date": "",
                        "line":""
                        }
                         
                    ]
                    
                };

                fillEmptyJSON.send(JSON.stringify(jsonfill));

                fillEmptyJSON.onreadystatechange = () => {
                    if (fillEmptyJSON.readyState == XMLHttpRequest.DONE) {

                    }
                }
            }

            
            document.getElementById("deadline").style.opacity = 1;
            
        }
    }

}

// adds deadline
function deadL() {

    const jsrequest = new XMLHttpRequest();

    jsrequest.open("GET", "https://api.jsonbin.io/b/"+deadLBin+"/latest", true);
    jsrequest.setRequestHeader("Content-Type", "application/json");
    jsrequest.setRequestHeader("secret-key", key);
    jsrequest.send();

    jsrequest.onreadystatechange = () => {
        if (jsrequest.readyState == XMLHttpRequest.DONE) {
            let filling = JSON.parse(jsrequest.responseText);

            const timeval = document.getElementById("deadDate");
            const textval = document.getElementById("typedead");
            const btnval = document.getElementById("deadbtn");

            // adds deadline if deadline is defined
            if (timeval.value != "" && timeval.value != undefined && textval.value != "" && textval.value != undefined)
            {
                filling["list"].push({"date": timeval.value, "line": textval.value});

                const jsrequest2 = new XMLHttpRequest();

                jsrequest2.open("PUT", "https://api.jsonbin.io/b/"+deadLBin, true);
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
                btnval.value = "Failed adding deadline";
                    setTimeout(function() {
                        btnval.value = "Add deadline"; 
                    }, 2000);
            }
                    
        }
    }

}

// remove deadline from deadline list
function deleteDeadL(obj) {

    const content = obj.parentElement.innerHTML;

    // creates substrings
    const date = content.substring(0, 10);
    const deadL = content.substring(content.lastIndexOf(date) + date.length + 2, content.lastIndexOf(`<button class="btn remove" onclick="deleteDeadL(this)">x</button>`));

    // loading symbol
    obj.innerHTML = "⅁";
    
    const getdeadL = new XMLHttpRequest();

    getdeadL.open("GET", "https://api.jsonbin.io/b/"+deadLBin+"/latest", true);
    getdeadL.setRequestHeader("Content-Type", "application/json");
    getdeadL.setRequestHeader("secret-key", key);
    getdeadL.send();

    getdeadL.onreadystatechange = () => {
        if (getdeadL.readyState == XMLHttpRequest.DONE) {

            let filling = JSON.parse(getdeadL.responseText);

            for (i=0; i<filling.list.length; i++) {

                // removes deadline, sends new JSON to JSONbin, updates deadline list
                if (filling.list[i].date == date && filling.list[i].line == deadL) {

                    filling.list.splice(i, 1);

                    const updDeadL = new XMLHttpRequest();

                    updDeadL.open("PUT", "https://api.jsonbin.io/b/"+deadLBin, true);
                    updDeadL.setRequestHeader("Content-Type", "application/json");
                    updDeadL.setRequestHeader("secret-key", key);
                    updDeadL.send(JSON.stringify(filling));

                    updDeadL.onreadystatechange = () => {
                        if (updDeadL.readyState == XMLHttpRequest.DONE) {
                            fillDeadL();
                        }
                    }

                    updDeadL.ontimeout = () => {
                        obj.innerHTML = "x";
                    }

                    break; // only removes 1 deadline
                }
                else {
                    
                }
                
            }
        }
    }

}