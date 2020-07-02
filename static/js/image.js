import commentHTML from 'static/pug/components/comment.pug';
import imageInfoHTML from 'static/pug/components/image-info.pug';

const commentSection = document.querySelector('.information__messages');
const commentInput = document.querySelector('#comment__input');
const imageInfoDialog = document.querySelector('.main__dialog');
const imageId = window.location.pathname.split('/').pop();
let templateInfo = {};
let templateId = Number.parseInt(document.querySelector('.main__template--id').innerHTML);

if(templateId){
    fetch(`/api/template/${ templateId }`)
    .then(res => res.json())
    .then(data => {
        templateInfo = data;
        document.querySelector('.post__picture--info').addEventListener('click', () => {
            imageInfoDialog.innerHTML = imageInfoHTML(templateInfo);
            imageInfoDialog.querySelector('.main__imageInfo--make').addEventListener('click', () => {
                window.location.pathname = '/template';
            })
        });
    })
}

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

if(document.querySelector('#comment__submit')){

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
}

document.querySelector('.post__back').addEventListener('click', () => {
    if(document.referrer){
        window.location = document.referrer;
    }
    else {
        window.history.back();
    }
});
