const ImageEditor = require('tui-image-editor');

const imgUrl = '/img/template/blank.jpg';
let imageEditor = new ImageEditor(document.getElementById('tui-image-editor'), {
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
    }
});