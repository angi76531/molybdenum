export const createTabUI = (pos) => {
    // note: this ius only expecting the make a new tab at the end. nowhere else
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.id = `frame-${pos}`;
    document.body.appendChild(frame);
    frame.insertAdjacentHTML("beforeend", "<iframe src='' style='display: block; border: none; width: 100%;height:100%;' class='iframee'>bruh</iframe>");
}

export const removeTabUI = (pos) => {

}

export const switchTabUI = (pos) => {
    const all = document.querySelectorAll('.frame');
    all.forEach(frame => {
        frame.style.display = 'none';
    });
    const fr = document.querySelector(`#frame-${pos}`);
    if (fr) {
        fr.style.display = 'inline';
    }
}

export const navigateUI = (url) => {

}