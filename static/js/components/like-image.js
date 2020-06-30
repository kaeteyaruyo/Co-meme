function sendLike(button, imageId){
    fetch(`/api/images/like/${ imageId }`, {
        method: 'POST',
    })
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(data => {
        button.lastChild.innerHTML = data.likes;
        button.classList.toggle('image__liked');
    })
    .catch(error => {
        if(error.status === 401){
            openUnauthorizedDialog('喜歡這張圖片嗎？', '登入後，就能給你喜歡的圖片按讚！');
        }
    });
}