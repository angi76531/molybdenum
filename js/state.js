export const state = {
    tabs: [],
    activetab: 0,
    settings: {historyEnabled: true,},
};
export const createTabObj = (Url) => {
    state.tabs.push({url: Url, title: Url, favicon: "resources/icons/web_globe.ico", history: [], future: []});
};