import {state, createTabObj} from "./state.js";
import {parseURL} from "./utils.js";
import {createTabUI, switchTabUI, navigateUI} from "./ui.js";

export const createTab = (url) => {
    createTabObj(url);
    createTabUI(state.tabs.length - 1);
    switchTabUI(state.activetab);
    navigate(url);
};
export const removeTab = (pos) => {
    if (pos < 0 || pos >= state.tabs.length) return;
    state.tabs.splice(pos, 1);
    removeTabUI(pos);
    if (state.tabs.length === 0) {
        createTab("chrome://newtab");
        return;
    }
    let newActiveTab = state.activetab;
    if (state.activetab >= pos) {
        newActiveTab = Math.max(0, state.activetab - 1);
    }
    switchTab(newActiveTab);
};
export const switchTab = (pos) => {
    state.activetab = pos;
    switchTabUI(pos);
};

export const navigate = (url) => {
    let tab = state.tabs[state.activetab];
    let parsedURL = parseURL(url);
    if (tab.url) {
        tab.history.push(tab.url);
    } 
    navigateUI(parsedURL);
    tab.url = url;
    tab.future = [];
};

export const navigateBack = () => {
    let tab = state.tabs[state.activetab];
    if (tab.history.length > 0) {
        let save = tab.history.pop();
        tab.history.pop();
        tab.future.push(tab.url);
        navigateUI(parseURL(save)) ;
        tab.url = save;
    }
};

export const navigateForward = () => {
    let tab = state.tabs[state.activetab];
    if (tab.future.length > 0) {
        let save = tab.future.pop();
        tab.history.push(tab.url);
        navigateUI(parseURL(save));
        tab.url = save;
    }
};