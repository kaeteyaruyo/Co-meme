function followUser(event, button, userId){
    fetch(`/api/users/follow/${ userId }`, {
        method: 'POST',
    })
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(data => {
        button.parentElement.querySelector(`#user__followers--${ userId }`).innerHTML = `${ data.followers }人追蹤`;
        button.classList.toggle('button--hollow');
        button.classList.toggle('button--solid');
        if(data.following){
            button.innerHTML = '已追蹤';
        }
        else {
            button.innerHTML = '追蹤';
        }
    })
    .catch(error => {
        if(error.status === 401){
            openUnauthorizedDialog('喜歡這位創作者嗎？', '立即註冊，即可追蹤你喜歡的創作者！');
        }
    });
    event.stopPropagation();
}