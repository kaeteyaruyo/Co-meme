const shareDialog = document.querySelector('.main__share');
const shareURL = document.querySelector('#share--url');
const lineURL = document.querySelector('.main__share--snsLine');
const facebookURL = document.querySelector('.main__share--snsFacebook');
const twitterURL = document.querySelector('.main__share--snsTwitter');
const plurkURL = document.querySelector('.main__share--snsPlurk');

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
    lineURL.href = `https://social-plugins.line.me/lineit/share?url=${ shareURL.value }`;
    facebookURL.href = `https://www.facebook.com/dialog/share?app_id=684988175228092&href=${ shareURL.value }`;
    twitterURL.href = `https://twitter.com/intent/tweet?text=我在Co meme上發現了一張有趣的圖片，快來一起看看吧！\n${ shareURL.value }`
    plurkURL.href =`http://www.plurk.com/?qualifier=shares&status=我在Co meme上發現了一張有趣的圖片，快來一起看看吧！%0D%0A${ window.location.href }`;
    shareDialog.style.display = 'grid';
}
