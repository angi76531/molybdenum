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
const tabs = [
    //["chrome://newtab", "New Tab", null, [], []] // url, title, favicon, history, future (for forwards arrow button)
];
let activeTab = 0;
function addTab(url) {
    tabs.push([url, url, null, [], []]);
    let body = document.body;
    let fart = tabs.length - 1;
    let fart2 = fart.toString();
    body.insertAdjacentHTML("beforeend", `<div class='frame' id='frame-${fart2}'></div>`);
    let p = parseURL(url);
    if (p[0] === 0) {
        document.querySelector(`#frame-${fart2}`).insertAdjacentHTML("beforeend", 
            `<iframe src='chrome/${p[1]}/index.html' style='display: block; border: none; width: 100%; height: 100vh;'>bruh</iframe>`
        );//todo: finish 
    } 
    switchActive(fart);
}

function removeTab(pos) {
    if (pos < 0 || pos >= tabs.length) return;
    tabs.splice(pos, 1);
    if (activeTab >= tabs.length) {
        activeTab = tabs.length - 1;
    }
    if (activeTab < 0) {
        activeTab = 0;
    }
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
    document.body.querySelector(".searchbar").value = tabs[val][0];
    document.body.querySelector(".search").classList.add("no-outline")
}
addTab("chrome://settings");
switchActive(0);
addTab("chrome://newtab");
switchActive(1);

const sbar = document.querySelector("#bruh");
if (sbar) {
    sbar.onblur = function() {
        if (tabs[activeTab] && this.value === tabs[activeTab][0]) {
            document.body.querySelector(".search").classList.add("no-outline")
        }
    }
    sbar.onfocus = function() {
        this.select();this.placeholder='';
        document.body.querySelector(".search").classList.remove("no-outline")
    }
}else{
    console.log("HELP ME")
}
//insertsvg("resources/navback.svg", "#backdiv", "nav-back", "nav-icon");
//insertsvg("resources/navback.svg", "#forwarddiv", "nav-forward", "nav-icon");
//insertsvg("resources/refresh.svg", "#refreshdiv", "nav-refresh", "nav-icon"); Not sure why i added this its unnecessary. all of the svgs are in the html alreafdty.