import { fabric } from 'fabric'
import templateBlockHTML from 'static/pug/components/template-block.pug';
import imageInfoHTML from 'static/pug/components/image-info.pug';

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
    textArray =templateData.texts.map((text, idx) => new fabric.IText(`文字區塊`, text));
    textArray.forEach(ele=> {
        ele.set('hasControls', false);
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
    let scaleX= width/backgroundImage.width;
    let scaleY= height/backgroundImage.height;
    let scaleXold= NaN;
    let scaleYold= NaN;
    if(textArray[0]) {
        scaleXold = textArray[0].scaleX;
        scaleYold = textArray[0].scaleY;
    }
    textArray.forEach(ele => {
        ele.set('scaleX',scaleX);
        ele.set('scaleY',scaleY);
        ele.set('left',ele.left*(scaleX/scaleXold));
        ele.set('top',ele.top*(scaleY/scaleYold));
        ele.setCoords(false,false);
    });
    canvas.setBackgroundImage(new fabric.Image(backgroundImage),canvas.renderAll.bind(canvas),{
        scaleX: scaleX,
        scaleY: scaleY
    });
    canvas.setWidth(width);
    canvas.setHeight(height);
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
    formData.append("templateId", templateData.templateId)
    /* Add image file */
    let width = backgroundImage.width;
    let height = backgroundImage.height;
    let scaleX= width/backgroundImage.width;
    let scaleY= height/backgroundImage.height;
    let scaleXold= NaN;
    let scaleYold= NaN;
    if(textArray[0]) {
        scaleXold = textArray[0].scaleX;
        scaleYold = textArray[0].scaleY;
    }
    textArray.forEach(ele => {
        ele.set('scaleX',scaleX);
        ele.set('scaleY',scaleY);
        ele.set('left',ele.left*(scaleX/scaleXold));
        ele.set('top',ele.top*(scaleY/scaleYold));
        ele.setCoords(false,false);
        ele.set('hasBorders', false);
    });
    canvas.setBackgroundImage(new fabric.Image(backgroundImage),canvas.renderAll.bind(canvas),{
        scaleX: scaleX,
        scaleY: scaleY
    });
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.renderAll();
    canvas.getElement().toBlob((blob)=> {
        formData.append("image", blob);
        /* Send formdata*/
        sendTemplateForm(formData);
    })
})
function sendTemplateForm(formData) {
    submitBtn.disabled = true;
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

/* Get template data */
const templates = {};
let templateData = {};
const timelinePosts = document.querySelector('.timeline__posts');
const timelineBottom = document.querySelector('.timeline__bottom');

// TODO: this will always query first page
Array.from(document.querySelectorAll('input[name="category"]')).forEach(option => {
    option.addEventListener('change', function(){
        // isEnd = false;
        timelineBottom.innerHTML = '';
        timelinePosts.innerHTML = '';
        getTemplates(0, this.value);
    });
})

getTemplates(0, '');

function getTemplates(page, category) {
    timelineBottom.innerHTML = '載入中';
    fetch(`/api/template?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(data => {
        data.forEach(item => {
            timelinePosts.insertAdjacentHTML('beforeend', templateBlockHTML(item));
            timelinePosts.lastElementChild.addEventListener('click', ()=> {
                selectTemplate(item.templateId);
            })
            templates[item.templateId]= item;
        })
        timelineBottom.innerHTML = '';
    })
    .catch(error => {
        console.error(error)
    });
}

const dialog = document.querySelector(".main__dialog");

function selectTemplate(templateId) {
    templateData = templates[templateId];
    dialog.innerHTML = imageInfoHTML(templateData);
    dialog.querySelector('.main__imageInfo--make').addEventListener('click', () => {
        step1.style.display = "none";
        step2.style.display = "grid";
        checkBoxes[1].style.display = "flex";
        step1Checkbox.checked = true;
        dialog.style.display = "none";
        canvas.clear();
        addBackgroundImage(`data:image/png;base64, ${ templateData.content }`);
    })
}
