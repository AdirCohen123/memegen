'use strict';
const KEY = 'imgDB'
let gImgs;
let gFilterBy = '';
let gKeyWords = [];
_createImages();

function _createImages() {
    let images = loadFromStorage(KEY);
    if (!images || !images.length) {
        images = [];
        images.push(_createImage(1, 'imgs/addNew.png', ['all']))
        images.push(_createImage(2, 'imgs/randomCard.png', ['all']))
        images.push(_createImage(makeId(), 'imgs/1.jpg', ['all', 'politics']))
        images.push(_createImage(makeId(), 'imgs/2.jpg', ['all', 'animals', 'love']))
        images.push(_createImage(makeId(), 'imgs/3.jpg', ['all', 'animals', 'sleep']))
        images.push(_createImage(makeId(), 'imgs/4.jpg', ['all', 'animals', 'sleep']))
        images.push(_createImage(makeId(), 'imgs/5.jpg', ['all', 'success', 'baby']))
        images.push(_createImage(makeId(), 'imgs/6.jpg', ['all', 'happy']))
        images.push(_createImage(makeId(), 'imgs/7.jpg', ['all', 'surprise', 'baby']))
        images.push(_createImage(makeId(), 'imgs/8.jpg', ['all', 'funny']))
        images.push(_createImage(makeId(), 'imgs/9.jpg', ['all', 'evil']))
        images.push(_createImage(makeId(), 'imgs/10.jpg', ['all', 'politics']))
        images.push(_createImage(makeId(), 'imgs/11.jpg', ['all', 'boys']))
        images.push(_createImage(makeId(), 'imgs/12.jpg', ['all', 'tv']))
        images.push(_createImage(makeId(), 'imgs/13.jpg', ['all', 'surprise']))
        images.push(_createImage(makeId(), 'imgs/14.jpg', ['all', 'surprise']))
        images.push(_createImage(makeId(), 'imgs/15.jpg', ['all', 'surprise']))
        images.push(_createImage(makeId(), 'imgs/16.jpg', ['all', 'politics', 'funny']))
        images.push(_createImage(makeId(), 'imgs/17.jpg', ['all', 'politics']))
        images.push(_createImage(makeId(), 'imgs/18.jpg', ['all', 'surprise']))
    }
    gImgs = images;
    _saveImagesToStorage()
}

function _createImage(id, url, keyWords) {
    return {
        id,
        url,
        keyWords
    }

}

function loadKeyWords() {
    let keyWords = [];
    gImgs.forEach(img => {
        img.keyWords.forEach(keyWord => {
            if (!keyWords.includes(keyWord)) keyWords.push(keyWord)
        })
    })
    setKeyWords(keyWords)
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId);
}

function setFilter(keyWord) {
    gFilterBy = keyWord;
}

function addImage() {
    gImgs.push({
        id: makeId(),
        url: this.src,
        keywords: ['']
    });
    renderImages();
}

function getImages() {
    return gImgs;
}

function getKeyWords() {
    return gKeyWords;
}

function openGallery() {
    closeCanvas();
    renderImages();
    addTitle()
}

function setKeyWords(keyWords) {
    keyWords.forEach(keyWord => {
        gKeyWords.push({ label: keyWord })
    })
}

function getRandomImg() {
    return gImgs[getRandomInt(3, gImgs.length - 1)]

}

function _saveImagesToStorage() {
    saveToStorage(KEY, gImgs)
}