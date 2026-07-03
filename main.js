
// add placeholder for https:// navigation
// create history + add setthing to enable history in chrome://settings
// add https:// prefix to stuff that has a .
const tabs = [
    //["chrome://newtab", "New Tab", null, [], []] // url, title, favicon, history, future (for forwards arrow button)
];
const forwardStyle = document.createElement("style");
forwardStyle.id = "forwardStyle";
forwardStyle.textContent = `
.nav:has(#forward-btn:active) .forward-back-back {
    transform: scale(1);
    opacity: 1;
    transition: transform 0.1s ease-out, opacity 0s ease-out;
}
.nav:has(#forward-btn:hover) .forward-back { 
    opacity: 1;
}
#nav-forward {
    left: 52px;
    transform: scaleX(-1);
    fill: rgb(180, 180, 180);
}
    
`;
const backwardStyle = document.createElement("style");
backwardStyle.id = "backwardStyle";
backwardStyle.textContent = `
.nav:has(#back-btn:active) .back-back-back {
    transform: scale(1);
    opacity: 1;
    transition: transform 0.1s ease-out, opacity 0s ease-out;
}
.nav:has(#back-btn:hover) .back-back {
    opacity: 1;
}
#nav-back {
    left: 16px;
    fill: rgb(180, 180, 180);
}
`;
let nohistory = false;
let activeTab = 0;
function addTab(url) {
    tabs.push([url, url, null, [], []]);
    let body = document.body;
    let fart = tabs.length - 1;
    let fart2 = fart.toString();
    body.insertAdjacentHTML("beforeend", `<div class='frame' id='frame-${fart2}'></div>`);
    let p = parseURL(url);
    document.querySelector(`#frame-${fart2}`).insertAdjacentHTML("beforeend", "<iframe src='' style='display: block; border: none; width: 100%;height:100%;' class='iframee'>bruh</iframe>");
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
            const urll = tabs[activeTab][4][tabs[activeTab][4].length - 1];
            tabs[activeTab][3].push(tabs[activeTab][0]);
            tabs[activeTab][4].pop();
        }else if(isBackward) {
            tabs[activeTab][3].pop();
            tabs[activeTab][4].push(tabs[activeTab][0]); 
        }else{
            tabs[activeTab][3].push(tabs[activeTab][0]);
            tabs[activeTab][4] = []; 
        }
    }
    tabs[activeTab][0] = url;
        updateNav();
    let r = parsed;
    if (r[0] === 0) {
        if (tabs[activeTab][0] === "chrome://newtab") {
            document.body.querySelector(".searchbar").value = "";
            document.body.querySelector(".searchbar").placeholder = "Ask Google or type a URL";
        }else{
            document.body.querySelector(".searchbar").value = tabs[activeTab][0];
        }
    }else{
        document.body.querySelector(".searchbar").value = ""
        document.body.querySelector(".searchbar").placeholder = parseURL(tabs[activeTab][0])[1].replace("https://", "");
    }
    if (parsed[0] === 0) {
        document.querySelector(`#frame-${activeTab.toString()}`).querySelector(".iframee").src = `chrome/${parsed[1]}/index.html`;
        tabs[activeTab][1] = url;
    }else{
        document.querySelector(`#frame-${activeTab.toString()}`).querySelector(".iframee").src = `${parsed[1]}`;
        tabs[activeTab][1] = parsed[1];
        // actual proccy logic below

    }
    if ((tabs[activeTab] && this.value === tabs[activeTab][0]) || (tabs[activeTab] && this.value === parseURL(tabs[activeTab][0])[1])) {
            document.body.querySelector(".search").classList.add("no-outline");
        }
}
function updateNav() {
    if (tabs[activeTab][3][0]) {//backward
        document.head.appendChild(backwardStyle);
    }else{
        try {document.querySelector("#backwardStyle").remove();}catch(e){}
    }
    if (tabs[activeTab][4][0]) {// forward
        document.head.appendChild(forwardStyle);
    }else{
        try {document.querySelector("#forwardStyle").remove();}catch(e){}
    }
    document.body.querySelector(".search").classList.add("no-outline");
    document.body.querySelector(".search").style.textContent = `
    .search {
    background-color: rgba(40, 40, 40);
    height: 34px;
    position:fixed;
    top: 45px;
    border-radius: 24px;
    left: 121px;
    right: 85px;
    transform: scaleY(0.98);
    transition: background-color 0.25s;}
    `
}
function forward(){
    if (tabs[activeTab][4][0]) {
        let url = tabs[activeTab][4][tabs[activeTab][4].length - 1];
        navigate(url, true, false, false);
    }
}
function backward(){
    if (tabs[activeTab][3][0]) {
        let url = tabs[activeTab][3][tabs[activeTab][3].length - 1];
        navigate(url, false, true, false);
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
    }else if (url.includes(".") && !url.includes(" ")) {
        return [3, `https://${url}`];
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
    updateNav();
}
addTab("chrome://settings");
addTab("chrome://newtab");

const sbar = document.querySelector("#bruh");
if (sbar) {
    sbar.onblur = function() {
        if ((tabs[activeTab] && this.value === tabs[activeTab][0]) || (tabs[activeTab] && this.value === parseURL(tabs[activeTab][0])[1])) {
            document.body.querySelector(".search").classList.add("no-outline");
        }
        if (this.value.includes(".")) {this.placeholder=this.value.replace("https://","");this.value=""}
    }
    sbar.onfocus = function() {
        if (this.placeholder.includes(".")) {this.value=`https://${this.placeholder}`}
        this.select();this.placeholder='';
        document.body.querySelector(".search").classList.remove("no-outline");
    }
}else{
    console.log("HELP ME");
}
document.querySelector("#refresh-btn").addEventListener("click", function(){
    navigate(tabs[activeTab][0], null, null, true);
})
document.querySelector("#forward-btn").addEventListener("click", function(){
    forward();
})
document.querySelector("#back-btn").addEventListener("click", function(){
    backward();
})

//insertsvg("resources/navback.svg", "#backdiv", "nav-back", "nav-icon");
//insertsvg("resources/navback.svg", "#forwarddiv", "nav-forward", "nav-icon");
//insertsvg("resources/refresh.svg", "#refreshdiv", "nav-refresh", "nav-icon"); Not sure why i added this its unnecessary. all of the svgs are in the html alreafdty.