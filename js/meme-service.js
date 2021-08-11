'use strict'
const MEMES_KEY = 'memesDB'
let gMeme = [];
let gColor = 'white';
let gColorLine = 'black';
let gFontFamily = 'impact';
let gAlign = 'center';
let gCurrLine = 0;
let gId = 0;
let gLinesNoSticker = 0;

function _createMeme(id) {
    console.log(id);
    const canvasSize = getCanvasSize();
    const xPos = canvasSize.width / 2;
    const yPos = canvasSize.height / 8;
    let line = createLine(xPos, yPos);
    return {
        memeId: id,
        lineIdx: 0,
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
    }
}

function _saveMemesToStorage(meme) {
    let memes = loadFromStorage(MEMES_KEY);
    if (memes) gMeme = memes;
    gMeme.push(meme);
    saveToStorage(MEMES_KEY, gMeme);
}