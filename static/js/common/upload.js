/* one step : upload image */
Dropzone.options.myDropzone = {
    url: 'upload',
    paramName: 'image',
    // autoProcessQueue: false,
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
}
// var mydropzone = new Dropzone("div#myDropzone", {url: "/upload"});
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
var tagCount = 0;
function addTag() {
    /* Add tag in tags block */
    tag = document.createElement("input");
    tag.setAttribute("value", keyword.value);
    tag.setAttribute("class", "three__tag");
    tag.setAttribute("type", "text");
    tag.setAttribute("name", `tags[]`);
    tagCount++;
    tagsBlock.appendChild(tag);
    keyword.value = '';
}