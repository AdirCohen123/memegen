'use strict';


function init() {
    loadKeyWords();
    renderKeywords();
    renderImages();
    addTitle()
}

function renderImages() {
    const images = getImages();
    let strHtmls = images.map(image => {
        let onFunc = 'onMemeClick(this)'
        let dataTitle = `data-title="${image.keyWords}"`
        if (image.id === 1) {
            dataTitle = ''
            return `<div class="file-input-container"><img data-id=${image.id} class="meme" src=${image.url}><input type="file" class="img-item file-input btn" name="image" onchange="onUploadImg(this)"/></div>`
        }
        if (image.id === 2) {
            onFunc = 'onRandomImg()'
            dataTitle = ''
        }
        return `<img data-id=${image.id} ${dataTitle} onclick="${onFunc}" class="meme"
        src=${image.url}>`
    });
    document.querySelector('.img-container').innerHTML = strHtmls.join('');
}

function renderKeywords() {
    const keyWords = getKeyWords();
    let strHtmls = keyWords.map(keyWord => {
        return `<li><a class="a-keyWord" onclick="onKeyWord(this)">${keyWord.label}</a></li>`
    });
    document.querySelector('.keywords').innerHTML = strHtmls.join('');
}

function onKeyWord(elKeyWord) {
    onFilterKeyWord(elKeyWord.innerText);
}

function addTitle() {
    const elMeme = document.querySelectorAll('.meme');
    elMeme.forEach(image => {
        if (image.dataset.id === '1') {
            image.title = `Add new image`
        } else if (image.dataset.id === '2') {
            image.title = `Random Image`
        } else {
            let meme = getImgById(image.dataset.id)
            meme.title = `${meme.keyWords[1]}`
        }
    })
}

function renderImgByKey(keyWord) {
    let images = getImages();
    let key = keyWord.toLowerCase();
    let imageFiltered = [];
    images.forEach(img => {
        if (img.keyWords.includes(key)) {
            imageFiltered.push(img);
        }
    })
    let strHtmls = imageFiltered.map(image => {
        return `<img data-id=${image.id} data-title= ${image.keyWords} onclick="onMemeClick(this)" class="meme"
        src=${image.url}>`
    });
    document.querySelector('.img-container').innerHTML = strHtmls.join('');
}

function onOpenGallery() {
    openGallery();
}

function onFilterKeyWord(keyWord) {
    setFilter(keyWord);
    renderImgByKey(keyWord)
}

function onRandomImg() {
    let img = getRandomImg()
    openCanvas()
    initCanvas();
    let meme = _createMeme(img.id);
    setMeme(meme);
    uploadMemeOnCanvas()
}

function onMemeClick(elMeme) {
    const memeId = elMeme.dataset.id;
    openCanvas()
    initCanvas();
    let meme = _createMeme(memeId);
    setMeme(meme);
    uploadMemeOnCanvas()
}

function onUploadImg(elFileInput) {
    if (elFileInput.files && elFileInput.files[0]) {
        var img = new Image();
        img.src = URL.createObjectURL(elFileInput.files[0]);
        img.onload = addImage;
    }
}

function openLabels() {
    document.querySelector('.labels-container').style.display = 'block';
    document.querySelector('.btn-open-labels').style.display = 'none';
    document.querySelector('.screen').style.display = 'block';
}

function closeMenu() {
    document.querySelector('.labels-container').style.display = 'none';
    document.querySelector('.screen').style.display = 'none';
    document.querySelector('.btn-open-labels').style.display = 'block';
}