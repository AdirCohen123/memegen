'use strict'
const MEMES_KEY = 'memesDB'
var gMeme;
var gColor = 'white';
var gColorLine = 'black';
var gFontFamily = 'impact';
var gAlign = 'center';
var gCurrLine = 0;
var gId = 0;
var gMemes = [];
var gLinesNoSticker = 0;

function _createMeme(id) {
    gId = 0;
    gLinesNoSticker = 0;
    gColor = 'white';
    gColorLine = 'black';
    gFontFamily = 'impact';
    gAlign = 'center';
    const canvasSize = getCanvasSize();
    const xPos = canvasSize.width / 2;
    const yPos = canvasSize.height / 8;
    let line = createLine(xPos, yPos);
    return {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [line]
    }
}

function addLine() {
    gId++;
    gLinesNoSticker++;
    gMeme.selectedLineIdx = gMeme.lines.length;
    const canvasSize = getCanvasSize();
    let xPos = canvasSize.width / 2;
    let yPos = (gLinesNoSticker === 1) ? canvasSize.height - canvasSize.height / 8 : canvasSize.height / 2;
    let line = createLine(xPos, yPos);
    gMeme.lines.push(line);
}

function addSticker(xPos, yPos, txt, size) {
    gId++;
    gMeme.selectedLineIdx = gMeme.lines.length;
    let line = createLine(xPos, yPos, txt, size);
    gMeme.lines.push(line);
}

function setMeme(meme) {
    gMeme = meme;
}

function getMeme() {
    return gMeme;
}


function createLine(x, y, txt = 'Write something...', size = 40, align = 'center', color = gColor, colorLine = gColorLine, font = gFontFamily, widthTxt = 0) {
    return {
        id: gId,
        txt,
        size,
        align,
        color,
        colorLine,
        font,
        x,
        y,
        widthTxt
    }
}

function setNewType(newColor, type) {
    gMeme.lines[gMeme.selectedLineIdx][type] = newColor;
}

function setPosition(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].x = x;
    gMeme.lines[gMeme.selectedLineIdx].y = y;
}

function setCurrLineIdx(lineId) {
    var lineIdx = findLineIdx(lineId);
    if (lineIdx === -1) return;
    gMeme.selectedLineIdx = lineIdx;
    document.querySelector('.input-text').value = gMeme.lines[gMeme.selectedLineIdx].txt;
}

function setWidthTxt(lineId, widthTxt) {
    const lineIdx = findLineIdx(lineId);
    if (lineIdx === -1) return;
    gMeme.lines[lineIdx].widthTxt = widthTxt;
}

function getCurrentLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getCurrentIdx() {
    return gMeme.selectedLineIdx;
}

function findLineIdx(lineId) {
    return gMeme.lines.findIndex((line => {
        return lineId === line.id
    }))
}

function removeLine() {
    if (gMeme.selectedLineIdx >= 0) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        document.querySelector('.input-text').value = '';
        gMeme.selectedLineIdx = 0;
        if (!gMeme.lines.length) {
            addLine();
        }
    }
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
        var newImgId = addImg(img.src);
        var newMeme = creatMeme(newImgId);
        setMeme(newMeme);
    }
    reader.readAsDataURL(ev.target.files[0]);
}


function _saveMemesToStorage(meme) {
    let memes = loadFromStorage(MEMES_KEY);
    if (memes) gMeme = memes;
    gMemes.push(meme);
    saveToStorage(MEMES_KEY, gMeme);
}