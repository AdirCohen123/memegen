'use strict'
let gCanvas;
let gCtx;
let isDrag = false;

function openCanvas() {
    document.querySelector('.img-container').classList.add('display')
    document.querySelector('.meme-maker').classList.remove('display')
    document.querySelector('.btn-open-labels').style.display = 'none';

}

function closeCanvas() {
    document.querySelector('.btn-open-labels').style.display = 'block';

    document.querySelector('.img-container').classList.remove('display')
    document.querySelector('.meme-maker').classList.add('display')

}

function initCanvas() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    // gCanvas.addEventListener("mousedown", startDrag);
    // gCanvas.addEventListener("mousemove", drag);
    // gCanvas.addEventListener("mouseup", finishDrag);
    // gCanvas.addEventListener("touchmove", startDrag);
    // gCanvas.addEventListener("touchmove", drag);
    // gCanvas.addEventListener("touchend", finishDrag);
}
// upload the image on canvas
function uploadMemeOnCanvas() {
    const meme = getMeme();
    let img = new Image();
    let memeImg = getImgById(meme.memeId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
    img.src = memeImg.url
}

function getCanvasSize() {
    return { height: gCanvas.height, width: gCanvas.width };
}

function renderCanvas(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}