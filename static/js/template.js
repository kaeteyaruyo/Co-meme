import {fabric} from 'fabric'
import templateBlockHTML from 'static/pug/components/template-block.pug';

/* URL to base64*/
let base64 = "";
function getDataUrl(img) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
  }
const img = document.getElementById("tempImage");
let dataUrl = getDataUrl(img);
base64 = dataUrl;

/* steps */
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step1Checkbox = document.getElementById("step1Checkbox");
const step2Checkbox = document.getElementById("step2Checkbox");
const step3Checkbox = document.getElementById("step3Checkbox");
const checkBoxes = document.getElementsByClassName("step__color");

checkBoxes[1].style.display = "none";
checkBoxes[2].style.display = "none";
step2.style.display = "none";
step3.style.display = "none";

const step2NextBtn = document.getElementById("step2NextBtn");
step2NextBtn.addEventListener("click", (e) => {
    step2.style.display = "none";
    step3.style.display = "block";
    checkBoxes[2].style.display = "flex";
    step2Checkbox.checked = true;
})
const step2BackBtn = document.getElementById("step2BackBtn");
step2BackBtn.addEventListener("click", (e) => {
    step2.style.display = "none";
    step1.style.display = "block";
    checkBoxes[1].style.display = "none";
    step1Checkbox.checked = false;
})
const step3BackBtn = document.getElementById("step3BackBtn");
step3BackBtn.addEventListener("click", (e) => {
    step2.style.display = "grid";
    step3.style.display = "none";
    checkBoxes[2].style.display = "none";
    step2Checkbox.checked = false;
})

/* fabric canvas */
const editorCanvas = document.getElementById('editorCanvas');
const canvas = new fabric.Canvas(editorCanvas);
const backgroundImage = new Image();
let textArray = [];
backgroundImage.onload = function() {
    canvas.setWidth(backgroundImage.width);
    canvas.setHeight(backgroundImage.height);
    canvas.setBackgroundImage(new fabric.Image(backgroundImage));
    textArray =templateData.texts.map(text => new fabric.IText('Double click', text));
    textArray.forEach(ele=> {
        canvas.add(ele);
    });
    resizeEditor();
}
function addBackgroundImage(src) {
    backgroundImage.src =  src;
}
/* resize */
function resizeEditor() {
    let style = window.getComputedStyle(step2);
    let width = (parseFloat(style.width, 10)-32)*0.4;
    let height = width*backgroundImage.height/backgroundImage.width;
    canvas.setWidth(width);
    canvas.setHeight(height);
    let scaleX= canvas.width/backgroundImage.width;
    let scaleY= canvas.height/backgroundImage.height;
    let scaleXold= NaN;
    let scaleYold= NaN;
    if(textArray[0]) {
        scaleXold = textArray[0].scaleX;
        scaleYold = textArray[0].scaleY;
    }
    canvas.setBackgroundImage(new fabric.Image(backgroundImage),canvas.renderAll.bind(canvas),{
        scaleX: scaleX,
        scaleY: scaleY
    });
    canvas.renderAll();
    textArray.forEach(ele => {
        ele.set('scaleX',scaleX);
        ele.set('scaleY',scaleY);
        ele.set('left',ele.left*(scaleX/scaleXold));
        ele.set('top',ele.top*(scaleY/scaleYold));
    });
    canvas.renderAll();
}
window.onresize = resizeEditor;
/* Add tags */
const keyword = document.getElementById("keyword");
const tagsBlock = document.getElementsByClassName("element__tags")[0];
const keywordBtn = document.getElementById("keywordBtn");
keywordBtn.addEventListener("click", function(event) {
    addTag();
});
// keyword.addEventListener("keypress", function(event) {
//     if(event.key == "Enter") {
//         addTag();
//         return false;
//     }
// },false);

function addTag() {
    /* Add tag in tags block */
    const tag = document.createElement("button");
    tag.innerHTML = keyword.value;
    tag.setAttribute("class", "element_tag");
    tag.addEventListener("click", function(event) {
        removeTag(this);
    })
    tagsBlock.appendChild(tag);
    /* Add tag in form */
    const tagtext = document.createElement("input");
    tagtext.setAttribute("type", 'text');
    tagtext.setAttribute("value", keyword.value);
    tagtext.setAttribute("name", `tags[]`);
    tagtext.style.display = "none";
    tagsBlock.appendChild(tagtext);
    keyword.value = '';
}

function removeTag(tagbtn) {
    tagtext = tagbtn.nextSibling;
    tagbtn.remove();
    tagtext.remove();
}
/* submit the form */
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener('click', (e)=> {
    /* Get form */
    let templateForm = document.getElementById("templateForm");
    let formData = new FormData(templateForm);
    /* Add category */
    formData.append("category", 0);
    /* Add image file */
    let width = backgroundImage.width;
    let height = width*backgroundImage.height/backgroundImage.width;
    canvas.setWidth(width);
    canvas.setHeight(height);
    let scaleX= canvas.width/backgroundImage.width;
    let scaleY= canvas.height/backgroundImage.height;
    let scaleXold= NaN;
    let scaleYold= NaN;
    if(textArray[0]) {
        scaleXold = textArray[0].scaleX;
        scaleYold = textArray[0].scaleY;
    }
    canvas.setBackgroundImage(new fabric.Image(backgroundImage),canvas.renderAll.bind(canvas),{
        scaleX: scaleX,
        scaleY: scaleY
    });
    canvas.renderAll();
    textArray.forEach(ele => {
        ele.set('scaleX',scaleX);
        ele.set('scaleY',scaleY);
        ele.set('left',ele.left*(scaleX/scaleXold));
        ele.set('top',ele.top*(scaleY/scaleYold));
    });
    canvas.renderAll();
    canvas.getElement().toBlob((blob)=> {
        formData.append("image", blob);
        /* Send formdata*/
        sendTemplateForm(formData);
    })
})
function sendTemplateForm(formData) {
    fetch("/template", {
        method: 'POST',
        'enctype':'multipart/form-data',
        body: formData
    })
    .then((res)=> {
        if(res.redirected) {
            window.location.href = res.url;
        } else {
            window.location.href = '/';
        }
    })
    .catch((err)=> {
        console.log(err);
    })
}
/* Template data (fake) */
/* Get template data */
const data=[
    {
        templateId: 1,
        content: "/img/template/meme.png",
        title: "迷因模板標題一",
        count: 1,
        author: {
            userId: 1,
            username: 'ArielWu'
        },
        description: '迷因模板文字一',
        texts: [
            {
                top: 50,
                left:200,
                fontSize: 32,
                fill: '#333333'
            },
            {
                top: 200,
                left:200,
                fontSize: 32,
                fill: '#333333'
            }
        ]
    },
    {
        templateId: 2,
        content: "/img/template/meme2.jpg",
        title: "迷因模板標題二",
        count: 2,
        author: {
            userId: 2,
            username: 'ArielWu2'
        },
        description: '迷因模板文字二',
        texts: [
            {
                top: 100,
                left:100,
                fontSize: 16,
                fill: '#333333'
            }
        ]
    },
    {
        templateId: 3,
        content: "/img/template/meme3.jpg",
        title: "迷因模板標題三",
        count: 3,
        author: {
            userId: 3,
            username: 'ArielWu3'
        },
        description: '迷因模板文字三',
        texts: [
            {
                top: 50,
                left:50,
                fontSize: 32,
                fill: '#333333'
            },
            {
                top: 50,
                left:150,
                fontSize: 32,
                fill: '#333333'
            }
        ]
    },
    {
        templateId: 4,
        content: "/img/template/meme4.png",
        title: "迷因模板標題四",
        count: 4,
        author: {
            userId: 4,
            username: 'ArielWu4'
        },
        description: '迷因模板文字四',
        texts: [
            {
                top: 50,
                left:50,
                fontSize: 32,
                fill: '#ffffff'
            },
            {
                top: 50,
                left:150,
                fontSize: 32,
                fill: '#ffffff'
            }
        ]
    }
]
const templates= {};
let templateData = {};
const timelinePosts = document.querySelectorAll('.timeline__posts');
function getTemplates(page, category) {
    /* fetch all template data */
    data.forEach(item => {
        timelinePosts[0].insertAdjacentHTML('beforeend', templateBlockHTML(item));
        timelinePosts[0].lastElementChild.addEventListener('click', ()=> {
            selectTemplate(item.templateId);
        })
        templates[item.templateId]= item;
    })
}

function selectTemplate(templateId) {
    dialog.style.display = "grid";
    templateData = templates[templateId];
    dialog.querySelector('.all__img').src = templateData.content;
    dialog.querySelector('.word__title').innerHTML = templateData.title;
    dialog.querySelector('.word__author--name').innerHTML = templateData.author.username;
    dialog.querySelector('.word__describe').innerHTML = templateData.description;

}

getTemplates(0,0);

/* Dialog */
const dialog = document.getElementById("dialog");
const dialogClose = document.getElementsByClassName("content__close")[0];

dialogClose.onclick = function() {
    dialog.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == dialog) {
    dialog.style.display = "none";
  }
}

/* Create template post */
const createPost = document.getElementById("createPost");
createPost.addEventListener("click", (e) => {
    step1.style.display = "none";
    step2.style.display = "grid";
    checkBoxes[1].style.display = "flex";
    step1Checkbox.checked = true;
    dialog.style.display = "none";
    canvas.clear();
    addBackgroundImage(templateData.content);
})