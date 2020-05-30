const backButton = document.querySelector('.post__back');

backButton.addEventListener('click', () => {
    // window.history.back();
    window.location.pathname = "/"
});

const commentSection = document.querySelector('.information__messages');
function sendComment() {
    console.log('lala')
    fetch(`/comment?imageId=${ window.location.pathname.split('/').pop() }&comment=${ document.getElementById('comment').value }`)
    .then(res => res.json())
    .then(data => {
        commentSection.insertAdjacentHTML('beforeend',
        `
        <div class="message">
        <img class="message__author--icon" src="${ data.author.icon ? 'data:image/png;base64, ' + data.author.icon : '/img/common/account.svg' }" width="35" height="35" />
        <span class="message__author--name">${ data.author.username }</span>
        <span class="message__timestamp">${ data.comment.createdAt }</span>
        <span class="message__content">${ data.comment.comment }</span>
        </div>
        `);
    })
    .catch(error => {
        window.location.pathname = '/signin'
    });
}