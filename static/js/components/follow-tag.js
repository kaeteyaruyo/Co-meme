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
        console.error(error)
    });
    event.stopPropagation();
}