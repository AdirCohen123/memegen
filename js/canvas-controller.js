'use strict'
let gCanvas;
let gCtx;
let isDrag = false;
let gCurrColor = '#cc2e2e';
let gCurrFont = 'impact';
const STICKER_SIZE = 40;

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
    gCanvas.addEventListener("mousedown", startDrag);
    gCanvas.addEventListener("mousemove", drag);
    gCanvas.addEventListener("mouseup", finishDrag);
    gCanvas.addEventListener("touchmove", startDrag);
    gCanvas.addEventListener("touchmove", drag);
    gCanvas.addEventListener("touchend", finishDrag);
    if (window.innerWidth <= 550) {
        gCanvas.width = 350;
        gCanvas.height = 350;
    }
}

function uploadMemeOnCanvas() {
    const meme = getMeme();
    let img = new Image();
    let memeImg = getImgById(meme.selectedImgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawText()
    }
    img.src = memeImg.url
}

function drawText() {
    const meme = getMeme();
    meme.lines.forEach((line) => {
        const myText = line.txt;
        let mySize = line.size;
        let myAlign = line.align;
        let myColor = line.color;
        let myColorLine = line.colorLine;
        let yPos = line.y;
        let xPos = line.x;
        let font = line.font;
        gCtx.lineWidth = '2';
        gCtx.strokeStyle = myColorLine;
        gCtx.fillStyle = myColor;
        gCtx.font = `${mySize}px ${font}`;
        gCtx.textAlign = myAlign;
        gCtx.fillText(myText, xPos, yPos);
        setWidthTxt(line.id, gCtx.measureText(myText).width);
        gCtx.strokeText(myText, xPos, yPos);
    })
}

function getCanvasSize() {
    return { height: gCanvas.height, width: gCanvas.width };
}

function renderCanvas(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onWrite(ev) {
    setNewType(ev.value, 'txt');
    uploadMemeOnCanvas();
}

function onChangeSize(newVal) {
    setNewType(newVal, 'size');
    uploadMemeOnCanvas();
}

function startDrag(ev) {
    const meme = getMeme();
    let { offsetX, offsetY } = ev;
    if (ev.type === "touchmove") {
        ev.preventDefault();
        offsetX = ev.targetTouches[0].pageX;
        offsetY = ev.targetTouches[0].pageY;
    }
    const clickedLine = meme.lines.find(line => {
        return (offsetY <= line.y + line.size && offsetY >= line.y - line.size &&
            offsetX <= line.x + line.widthTxt && offsetX > line.x - line.widthTxt)
    });

    if (!clickedLine) return;
    setCurrLineIdx(clickedLine.id);
    isDrag = true;
}

function finishDrag() {
    if (!isDrag) return;
    drawSign();
    isDrag = false;
}

function drag(ev) {
    if (!isDrag) return;
    var { offsetX, offsetY } = ev;
    if (ev.type === "touchmove") {
        ev.preventDefault();
        offsetX = ev.targetTouches[0].pageX;
        offsetY = ev.targetTouches[0].pageY;
    }
    setPosition(offsetX, offsetY);
    uploadMemeOnCanvas();
}

function onAddLine() {
    let elTxtInput = document.querySelector('.input-text');
    if (!elTxtInput.value) return;
    elTxtInput.value = '';
    addLine();
    uploadMemeOnCanvas();
}

function drawSign() {
    const currLineIdx = getCurrentIdx();
    const meme = getMeme();
    let width = meme.lines[currLineIdx].widthTxt;
    let height = meme.lines[currLineIdx].size * 1.2;
    let posX = meme.lines[currLineIdx].x - meme.lines[currLineIdx].widthTxt / 2;
    let posY = meme.lines[currLineIdx].y - meme.lines[currLineIdx].size;
    gCtx.beginPath();
    gCtx.rect(posX, posY, width, height);
    gCtx.strokeStyle = "black";
    gCtx.fillStyle = "rgb(0, 0, 0, 0.25)";
    gCtx.lineWidth = '2';
    gCtx.strokeRect(posX, posY, width, height);
}

function onSwitchLines() {
    const meme = getMeme();
    if (meme.selectedLineIdx === 0) {
        if (meme.lines.length > 0) meme.selectedLineIdx = meme.lines.length - 1;
    } else {
        meme.selectedLineIdx = meme.selectedLineIdx - 1;
    }
    document.querySelector('.input-text').value = meme.lines[gMeme.selectedLineIdx].txt;
}

function onOpenColors() {
    document.querySelector('.btn-color-fill').classList.add('display');
    document.querySelector('.color-fill').classList.remove('display');
}

function onOpenColorsLine() {
    document.querySelector('.btn-color-line').classList.add('display');
    document.querySelector('.color-line').classList.remove('display');
}

function onChangeColor(newColor) {
    document.querySelector('.btn-color-fill').classList.remove('display');
    document.querySelector('.color-fill').classList.add('display');
    setNewType(newColor, 'color');
    uploadMemeOnCanvas();
}

function onChangeColorLine(newColor) {
    document.querySelector('.btn-color-line').classList.remove('display');
    document.querySelector('.color-line').classList.add('display');
    setNewType(newColor, 'colorLine');
    uploadMemeOnCanvas();
}

function onChangeFont(newFont) {
    setNewType(newFont, 'font');
    uploadMemeOnCanvas();
}

function onRemoveLine() {
    removeLine();
    uploadMemeOnCanvas();
}

function onCreateSticker(sticker) {
    addSticker(gCanvas.width / 2, gCanvas.height / 2, sticker, STICKER_SIZE);
    uploadMemeOnCanvas();
}

function resetSelections() {
    gMeme.selectedLineIdx = -1;
    gMeme.selectedStickerIdx = -1;
}

function onSave() {
    let imgContent = gCanvas.toDataURL('image/jpeg');
    var meme = {
        id: makeId(),
        img: imgContent,
        gMeme
    }
    _saveMemesToStorage(meme);
}

function onDownload(elLink) {
    let imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function(res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function(err) {
            console.error(err)
        })
}