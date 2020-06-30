function followTag(event, button, tagId){
    fetch(`/api/tags/follow/${ tagId }`, {
        method: 'POST',
    })
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(data => {
        button.parentElement.querySelector(`#tag__followers--${ tagId }`).innerHTML = `${ data.followers }人追蹤`;
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
            openUnauthorizedDialog('喜歡這個標籤主題嗎？', '現在就加入我們，追蹤你喜歡的標籤吧！');
        }
    });
    event.stopPropagation();
}