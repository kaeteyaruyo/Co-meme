/* start : get all steps */
step1 = document.getElementById("step1");
step2 = document.getElementById("step2");
step3 = document.getElementById("step3");
step1.classList.toggle("content__one--hide");

flow = [];
flowtext = document.getElementsByClassName("step__content");
flow.push(document.getElementById("step1Flow"));
flow.push(document.getElementById("step2Flow"));
flow.push(document.getElementById("step3Flow"));
for (i=2;i<=3;i++) {
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

/* one step : upload image */
var emptyImage = document.getElementsByClassName("one__circles")[0];
var imageLoadend = document.getElementsByClassName("one__image--show")[0];
var imagetitle = document.getElementsByClassName("one__title")[0];
var imageSelect = document.getElementsByClassName("one__button--select")[0];
var nextStep = document.getElementsByClassName("one__button--select")[1];
var imageComment = document.getElementsByClassName("one__comment")[0];
var imageUploader = document.getElementById("imageUploader");
var imageView = document.getElementById("imageView");
var imageText = imageLoadend.childNodes[2];
var fileReader = new FileReader();
var filename = NaN;

imageUploader.addEventListener("change", function(event) {
    if(this.files.length>0) {
        fileReader.readAsDataURL(this.files[0]);
        filename = this.files[0].name;
    }
});
fileReader.onloadstart = function(event) {
    emptyImage.style.display = "none";
}
fileReader.onload = function(event) {
    imageLoadend.style.display = "block";
    imagetitle.innerHTML = "你的圖片已上傳完成";
    imageSelect.style.display = "none";
    nextStep.style.display = "block";
    imageComment.style.visibility = "visible";
    imageComment.innerHTML = "前往編輯圖片資訊";
    imageView.src = this.result;
    imageText.innerHTML = filename;
};
imageView.addEventListener("mouseenter", function(event) {
    var imageMask = imageLoadend.childNodes[0].childNodes[0];
    imageMask.style.height = `${imageView.offsetHeight}px`;
    imageMask.style.width = `${imageView.offsetWidth}px`;
});
/* two step : custom select menu */
var selectDiv = document.getElementsByClassName("element__privacy")[0];
var select = selectDiv.getElementsByTagName("select")[0];
var selectNew = document.createElement("DIV");
selectNew.setAttribute("class", "select__selected");
selectNew.innerHTML = select.options[select.selectedIndex].innerHTML;
selectDiv.appendChild(selectNew);
var optionList = document.createElement("DIV");
optionList.setAttribute("class", "select__items select__hide");
var option;
for(var i=1; i < select.length; i++) {
    option = document.createElement("DIV");
    option.innerHTML = select.options[i].innerHTML;
    option.addEventListener("click", function(e) {
        var y,j,k,s,h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for(j=0;j<s.length;j++) {
            if(s.options[j].innerHTML == this.innerHTML) {
                s.selectedIndex = j;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("select__selected--same");
                for(k=0;k<y.length;k++) {
                    y[k].removeAttribute("class");
                }
                this.setAttribute("class", "select__selected--same");
                break;
            }
        }
        h.click();
    });
    optionList.appendChild(option);
}
selectDiv.appendChild(optionList);
selectNew.addEventListener("click", function(e) {
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select__hide");
    this.classList.toggle("select__arrow--active");
})
function closeAllSelect(selected) {
    var x,y,i, arrNo=[];
    x = document.getElementsByClassName("select__items");
    y = document.getElementsByClassName("select__selected");
    for(i=0;i<y.length;i++) {
        if(selected == y[i]) {
            arrNo.push(i);
        } else {
            y[i].classList.remove("select__arrow--active");
        }
    }
    for(i=0;i<x.length;i++) {
        if(arrNo.indexOf(i)) {
            x[i].classList.add("select__hide");
        }
    }
};
document.addEventListener("click", closeAllSelect);

/* three step : keyword input*/
var keyword = document.getElementById("keyword");
var tagsBlock = document.getElementsByClassName("three__tags")[0];
function addTag() {
    /* Add tag in tags block */
    tag = document.createElement("input");
    tag.setAttribute("value", keyword.value);
    tag.setAttribute("class", "three__tag");
    tag.setAttribute("type", "button");
    tag.setAttribute("onclick", "removeTag(this)");
    tagsBlock.appendChild(tag);
    tagtext = document.createElement("input");
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