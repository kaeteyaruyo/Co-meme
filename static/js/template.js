const ImageEditor = require('tui-image-editor');

const imgUrl = '/img/template/blank.jpg';
let imageEditor = new ImageEditor(document.getElementById('tui-image-editor'));
imageEditor.usageStatistics(false);