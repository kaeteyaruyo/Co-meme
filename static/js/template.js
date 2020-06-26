const ImageEditor = require('tui-image-editor');
const downloadBtn = document.getElementById('downloadBtn');

/* image editor */
const imgUrl = '/img/template/meme3.jpg';
const imageContainer = document.getElementById("imageContainer");
const width = 40; // imageContainer's width: 40vw
const imageEditor = new ImageEditor(document.getElementById('imageEditor'));
imageEditor.loadImageFromURL(imgUrl, 'SampleImage').then(async function(result) {
    let height = width*result.newHeight/result.newWidth;
    imageContainer.style.height = `${height}vw`;
    await inputText('text 1');
    await inputText('text 2');
});

/* image editor: text,position,size,color,weight */
async function inputText(text) {
    let initText = text;

    imageEditor.startDrawingMode('TEXT');
    await imageEditor.addText(initText, {
        styles: {
        fill: '#000',
        fontSize: 20,
        fontWeight: 'bold'
        },
        position: {
            x: 125,
            y: 125
        }
    });
}

/* download */
downloadBtn.addEventListener('click', (e)=>{
    let imageName = imageEditor.getImageName();
    const dataURL = imageEditor.toDataURL();
    let blob, type;

    // blob = base64ToBlob(dataURL);
    // type = blob.type.split('/')[1];
    // if (imageName.split('.').pop() !== type) {
    //     imageName += '.' + type;
    // }

    let w = window.open();
    w.document.body.innerHTML = '<img src=' + dataURL + '>';
});
let rImageType = /data:(image\/.+);base64,/;
function base64ToBlob(data) {
    var mimeString = '';
    var raw, uInt8Array, i, rawLength;

    raw = data.replace(rImageType, function(header, imageType) {
        mimeString = imageType;

        return '';
    });

    raw = atob(raw);
    rawLength = raw.length;
    uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

    for (i = 0; i < rawLength; i += 1) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: mimeString});
}