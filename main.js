async function insertsvg(path, container, id, classs){
    try {
        const file = await fetch(path);
        const text = await file.text();

        const cont = document.querySelector(container);
        if (cont) {
            cont.insertAdjacentHTML("beforeend", text);
            const svg = cont.querySelector('svg');
            if (svg && id) { 
                svg.id = id;
            }
            if (svg && classs) {
                svg.setAttribute('class', classs); //this just wont work without setattribute idk why smh
            }
        } else {
            console.log("no container for svg");
        }
    } catch(err) {
        console.log("error inserting svg", err);
    }
}
// add placeholder for https:// navigation
// create history + add setthing to enable history in chrome://settings
// add https:// prefix to stuff that has a .
const tabs = [
    //["chrome://newtab", "New Tab", null, [], []] // url, title, favicon, history, future (for forwards arrow button)
];
let nohistory = false;
let activeTab = 0;
function addTab(url) {
    tabs.push([url, url, null, [], []]);
    let body = document.body;
    let fart = tabs.length - 1;
    let fart2 = fart.toString();
    body.insertAdjacentHTML("beforeend", `<div class='frame' id='frame-${fart2}'></div>`);
    let p = parseURL(url);
    document.querySelector(`#frame-${fart2}`).insertAdjacentHTML("beforeend", 
            "<iframe src='' style='display: block; border: none; width: 100%; height: 100vh;' class='iframee'>bruh</iframe>"
    );
    switchActive(tabs.length - 1);
    const nohistorysave = nohistory;
    nohistory = true;
    navigate(url);
    nohistory = nohistorysave;
}
function navigate(url, isForward, isBackward, isRefresh) {
    let parsed = parseURL(url);
    if (!url) {
        return false;
    }
    if (!nohistory && !isRefresh) {
        if (isForward) {
            tabs[activeTab][4].pop();
        }else if(isBackward) {
            tabs[activeTab][4].push(tabs[activeTab][0]); // Shits weird. if youre going forward, next page in forward gets removed. if youre going backward, current tab becomes the future. if navigating normally, current tab becomes past and future is no more
        }else{
            tabs[activeTab][3].push(tabs[activeTab][0]);
            tabs[activeTab][4] = []; 
        }
    }
    tabs[activeTab][0] = url;
    let r = parsed;
    if (r[0] === 0) {
        if (tabs[activeTab][0] === "chrome://newtab") {
            document.body.querySelector(".searchbar").value = "";
            document.body.querySelector(".searchbar").placeholder = "Ask Google or type a URL";
        }else{
            document.body.querySelector(".searchbar").value = tabs[activeTab][0];
        }
    }else{
        document.body.querySelector(".searchbar").value = parseURL(tabs[activeTab][0])[1];
    }
    if (parsed[0] === 0) {
        document.querySelector(`#frame-${activeTab.toString()}`).querySelector(".iframee").src = `chrome/${parsed[1]}/index.html`;
        tabs[activeTab][1] = url;
        // actual proccy logic below
    }else if (parsed[0] === 1) {
        document.querySelector(`#frame-${activeTab.toString()}`).querySelector(".iframee").src = `${parsed[1]}`;
        tabs[activeTab][1] = parsed[1];
    }else if(parsed[0] === 2) {
        document.querySelector(`#frame-${activeTab.toString()}`).querySelector(".iframee").src = `${parsed[1]}`;
        tabs[activeTab][1] = parsed[1];
    }
}
function removeTab(pos) {
    if (pos < 0 || pos >= tabs.length){return}
    tabs.splice(pos, 1);
    if (activeTab >= tabs.length) {
        activeTab = tabs.length - 1;
    }
    if (activeTab < 0) {
        activeTab = 0;
    }
    document.querySelector(`#frame-${pos.toString()}`).remove()
    document.querySelectorAll('.frame').forEach(frame => {
        const id = parseInt(frame.id.split('-')[1]);
        if (id > pos) {
            frame.id = `frame-${id - 1}`;
        }
    });
    switchActive(pos-1);
}
function parseURL(url) {
    if (url.startsWith("chrome://")) {
        const pageName = url.replace("chrome://", "");
        return [0, pageName];
    } 
    else if (url.startsWith("https://") || url.startsWith("http://")) {
        return [1, url];
    }
    else {
        return [2, "https://google.com/search?q=" + encodeURIComponent(url)];
    }
}
function switchActive(val){
    activeTab = val;
    let curTab = tabs[activeTab];
    const all = document.querySelectorAll('.frame');
    all.forEach(frame => {
        frame.style.display = 'none';
    });
    document.body.querySelector(`#frame-${activeTab.toString()}`).style.display='inline';
    let r = parseURL(tabs[activeTab][0]);
    if (r[0] === 0) {
        if (tabs[activeTab][0] === "chrome://newtab") {
            document.body.querySelector(".searchbar").value = "";
            document.body.querySelector(".searchbar").placeholder = "Ask Google or type a URL";
        }else{
            document.body.querySelector(".searchbar").value = tabs[val][0];
        }
    }else{
        document.body.querySelector(".searchbar").value = parseURL(tabs[val][0])[1];
    }
    document.body.querySelector(".search").classList.add("no-outline");
}
addTab("chrome://settings");
addTab("chrome://newtab");

const sbar = document.querySelector("#bruh");
if (sbar) {
    sbar.onblur = function() {
        if ((tabs[activeTab] && this.value === tabs[activeTab][0]) || (tabs[activeTab] && this.value === parseURL(tabs[activeTab][0])[1])) {
            document.body.querySelector(".search").classList.add("no-outline");
        }
    }
    sbar.onfocus = function() {
        this.select();this.placeholder='';
        document.body.querySelector(".search").classList.remove("no-outline");
    }
}else{
    console.log("HELP ME");
}
document.querySelector("#refresh-btn").addEventListener("click", function(){
    navigate(tabs[activeTab][0], null, null, true);
})
//insertsvg("resources/navback.svg", "#backdiv", "nav-back", "nav-icon");
//insertsvg("resources/navback.svg", "#forwarddiv", "nav-forward", "nav-icon");
//insertsvg("resources/refresh.svg", "#refreshdiv", "nav-refresh", "nav-icon"); Not sure why i added this its unnecessary. all of the svgs are in the html alreafdty.