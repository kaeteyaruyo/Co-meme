const unauthorizedDialog = document.querySelector('.main__unauthorized');
const unauthorizedTitle = document.querySelector('.unauthorized__msg--title');
const unauthorizedContent = document.querySelector('.unauthorized__msg--content');

document.querySelector('.unauthorized__msg--close').addEventListener('click', function(){
    unauthorizedDialog.style.display = 'none';
});

function openUnauthorizedDialog(title, content){
    unauthorizedTitle.innerHTML = title;
    unauthorizedContent.innerHTML = content;
    unauthorizedDialog.style.display = 'grid';
}
