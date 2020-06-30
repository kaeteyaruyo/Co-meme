const shareDialog = document.querySelector('.main__share');
const shareURL = document.querySelector('#share--url');

document.querySelector('.main__share--close').addEventListener('click', function(){
    shareDialog.style.display = 'none';
});

document.querySelector('.main__share--linkButton').addEventListener('click', () => {
    shareURL.select();
    shareURL.setSelectionRange(0, 99999);
    document.execCommand("copy");
});

function openShareDialog(imageId){
    shareURL.value = `${ window.location.origin }/image/${ imageId }`;
    shareDialog.style.display = 'grid';
}
