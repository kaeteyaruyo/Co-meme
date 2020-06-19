/* start: get all steps */
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
step1.classList.toggle("content__one--hide");

const flow = [];
const flowtext = document.getElementsByClassName("step__content");
flow.push(document.getElementById("step1Flow"));
flow.push(document.getElementById("step2Flow"));
flow.push(document.getElementById("step3Flow"));
for (let i=2;i<=3;i++) {
    turnGrey(i);
}
function turnGrey(index) {
    index--;
    flow[index].childNodes[1].style.display="none";
    flow[index].childNodes[0].style.backgroundColor="#AAAAAA";
    flowtext[index].style.color = "#AAAAAA";
}
function turnPurple(index) {
    index--;
    flow[index].childNodes[1].style.display="block";
    flow[index].childNodes[0].style.backgroundColor="#4C26EB";
    flowtext[index].style.color = "#333333";
}
function turnCheck(index) {
    index--;
    flow[index].classList.toggle("step__check--none");
}
/* next or back step */
function step1GotoStep2() {
    step1AndStep2();
    turnCheck(1);
    turnPurple(2);
}
function step2GotoStep1() {
    step1AndStep2();
    turnGrey(2);
    turnCheck(1);
    turnPurple(1);
}
function step2GotoStep3() {
    step2AndStep3();
    turnCheck(2);
    turnPurple(3);
}
function step3GotoStep2() {
    step2AndStep3();
    turnGrey(3);
    turnCheck(2);
    turnPurple(2);
}
function step1AndStep2() {
    step1.classList.toggle("content__one--hide");
    step2.classList.toggle("content__two--hide");
}
function step2AndStep3() {
    step2.classList.toggle("content__two--hide");
    step3.classList.toggle("content__three--hide");
}

const step1NextBtn = document.getElementById("step1NextBtn");
step1NextBtn.addEventListener("click", function(event) {
    step1GotoStep2();
})
const step2BacktBtn = document.getElementById("step2BacktBtn");
const step2NextBtn = document.getElementById("step2NextBtn");
step2BacktBtn.addEventListener("click", function(event) {
    step2GotoStep1();
})
step2NextBtn.addEventListener("click", function(event) {
    step2GotoStep3();
})
const step3BackBtn = document.getElementById("step3BackBtn");
step3BackBtn.addEventListener("click", function(event) {
    step3GotoStep2();
})
/* one step : upload image */
const emptyImage = document.getElementsByClassName("one__circles")[0];
const imageLoadend = document.getElementsByClassName("one__image--show")[0];
const imagetitle = document.getElementsByClassName("one__title")[0];
const imageSelect = document.getElementsByClassName("one__button--select")[0];
const nextStep = document.getElementsByClassName("one__button--select")[1];
const imageComment = document.getElementsByClassName("one__comment")[0];
const imageView = document.getElementById("imageView");
const progressbar = document.getElementById("progressbar");
const imageMiddle = imageLoadend.childNodes[0];
const imageText = imageLoadend.childNodes[3];
const imagePost = document.getElementById("imagePost");
const fileReader = new FileReader();
const imageUploader = document.getElementById("imageUploader");
let filename = NaN;
function circleChange() {
    const top = emptyImage.childNodes[1];
    const buttom = emptyImage.childNodes[2];
    top.classList.toggle("circle__top--colorchange");
    top.classList.toggle("circle__top--scalechange");
    buttom.classList.toggle("circle__bottom--scalechange");
}
emptyImage.addEventListener("dragenter", function(event) {
    circleChange();
});
emptyImage.addEventListener("dragleave", function(event) {
    circleChange();
});
emptyImage.addEventListener("drop", function(event) {
    circleChange();
    var files = event.dataTransfer.files;
    if(files.length > 0) {
        fileReader.readAsDataURL(files[0]);
        filename = files[0].name;
    }
});
window.addEventListener("dragover", function (event) {
    event.preventDefault();
});
window.addEventListener("drop", function (event) {
    event.preventDefault();
});
imageUploader.addEventListener("change", function(event) {
    if(this.files.length>0) {
        fileReader.readAsDataURL(this.files[0]);
        filename = this.files[0].name;
    }
});
fileReader.onloadstart = function(event) {
    emptyImage.style.display = "none";
    imageLoadend.style.display = "block";
    imageMiddle.style.display = "block";
    imagetitle.innerHTML = "正在為你上傳圖片";
    imageSelect.style.display = "none";
    nextStep.style.display = "block";
    nextStep.style.backgroundColor = "#9B88EB";
    imageComment.style.visibility = "visible";
    imageComment.innerHTML = "正在為你調整圖片，請稍後幾秒";
}
fileReader.onprogress = function(event) {
    var percentNow = NaN;
    if(event.lengthComputable) {
        percentNow = parseInt((event.loaded/event.total)*100, 10);
    }
    if(percentNow < 100) {
        progressbar.style.width = `${percentNow}%`;
    }
}
fileReader.onload = function(event) {
    imageMiddle.style.display = "none";
    imagetitle.innerHTML = "你的圖片已上傳完成";
    nextStep.style.backgroundColor = "#4C26EB";
    imageComment.innerHTML = "前往編輯圖片資訊";
    imageView.style.display = "block";
    imageView.src = this.result;
    imagePost.src = this.result;
    imageText.innerHTML = filename;
};
imageLoadend.childNodes[1].addEventListener("mouseenter", function(event) {
    var imageMask = event.target.childNodes[0];
    imageMask.style.height = `${imageView.offsetHeight}px`;
    imageMask.style.width = `${imageView.offsetWidth}px`;
});

const imageUpdate = document.getElementById("imageUpdate");
imageUpdate.addEventListener("click", function(event) {
    updateImage();
})
function updateImage() {
    emptyImage.style.display = "grid";
    progressbar.style.width = "0%";
    imageLoadend.style.display = "none";
    imageView.src="";
    imagetitle.innerHTML = "將你要上傳的圖片拖曳到這裡";
    imageSelect.style.display = "inline";
    nextStep.style.display = "none";
    imageComment.style.visibility = "hidden";
    imageComment.innerHTML = "前往編輯圖片資訊";
}
/* two step : custom select menu */
// const selectDiv = document.getElementsByClassName("element__privacy")[0];
// const select = selectDiv.getElementsByTagName("select")[0];
// const selectNew = document.createElement("DIV");
// selectNew.setAttribute("class", "select__selected");
// selectNew.innerHTML = select.options[select.selectedIndex].innerHTML;
// selectDiv.appendChild(selectNew);
// const optionList = document.createElement("DIV");
// optionList.setAttribute("class", "select__items select__hide");
// const option;
// for(let i=1; i < select.length; i++) {
//     option = document.createElement("DIV");
//     option.innerHTML = select.options[i].innerHTML;
//     option.addEventListener("click", function(e) {
//         let y,j,k,s,h;
//         s = this.parentNode.parentNode.getElementsByTagName("select")[0];
//         h = this.parentNode.previousSibling;
//         for(j=0;j<s.length;j++) {
//             if(s.options[j].innerHTML == this.innerHTML) {
//                 s.selectedIndex = j;
//                 h.innerHTML = this.innerHTML;
//                 y = this.parentNode.getElementsByClassName("select__selected--same");
//                 for(k=0;k<y.length;k++) {
//                     y[k].removeAttribute("class");
//                 }
//                 this.setAttribute("class", "select__selected--same");
//                 break;
//             }
//         }
//         h.click();
//     });
//     optionList.appendChild(option);
// }
// selectDiv.appendChild(optionList);
// selectNew.addEventListener("click", function(e) {
//     e.stopPropagation();
//     closeAllSelect(this);
//     this.nextSibling.classList.toggle("select__hide");
//     this.classList.toggle("select__arrow--active");
// })
// function closeAllSelect(selected) {
//     var x,y,i, arrNo=[];
//     x = document.getElementsByClassName("select__items");
//     y = document.getElementsByClassName("select__selected");
//     for(i=0;i<y.length;i++) {
//         if(selected == y[i]) {
//             arrNo.push(i);
//         } else {
//             y[i].classList.remove("select__arrow--active");
//         }
//     }
//     for(i=0;i<x.length;i++) {
//         if(arrNo.indexOf(i)) {
//             x[i].classList.add("select__hide");
//         }
//     }
// };
// document.addEventListener("click", closeAllSelect);

/* three step : keyword input*/
const keyword = document.getElementById("keyword");
const tagsBlock = document.getElementsByClassName("three__tags")[0];
const keywordBtn = document.getElementById("keywordBtn");
keywordBtn.addEventListener("click", function(event) {
    addTag();
})
function addTag() {
    /* Add tag in tags block */
    tag = document.createElement("input");
    tag.setAttribute("value", keyword.value);
    tag.setAttribute("class", "three__tag");
    tag.setAttribute("type", "button");
    tag.addEventListener("click", function(event) {
        removeTag(this);
    })
    tagsBlock.appendChild(tag);
    tagtext = document.createElement("input");
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