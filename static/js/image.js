import commentHTML from 'static/pug/components/comment.pug';

const commentSection = document.querySelector('.information__messages');
const commentInput = document.querySelector('#comment__input');
const imageInfoDialog = document.querySelector('.main__imageInfo');
const imageId = window.location.pathname.split('/').pop();

fetch(`/api/comment/${ imageId }`)
.then(res => {
    if(res.status === 200){
        return res.json()
    }
    throw res;
})
.then(comments => {
    comments.forEach(comment => {
        commentSection.insertAdjacentHTML('beforeend', commentHTML(comment));
    });
})
.catch(error => {
    console.error(error)
});

document.querySelector('#comment__submit').addEventListener('click', function (event) {
    event.preventDefault();
    fetch(`/api/comment/${ imageId }`, {
        method: 'POST',
        body: JSON.stringify({
            comment: commentInput.value,
        }),
        headers: {
            'content-type': 'application/json'
        },
    })
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(comment => {
        commentSection.insertAdjacentHTML('afterbegin', commentHTML(comment));
        commentInput.value = '';
    })
    .catch(error => {
        if(error.status === 401){
            openUnauthorizedDialog('想說點什麼嗎？', '註冊帳號後，就能給喜歡的圖片留言！');
        }
    });
});

document.querySelector('.post__back').addEventListener('click', () => {
    if(document.referrer){
        window.location = document.referrer;
    }
    else {
        window.history.back();
    }
});

document.querySelector('.post__picture--info').addEventListener('click', () => {
    imageInfoDialog.style.display='grid';
});