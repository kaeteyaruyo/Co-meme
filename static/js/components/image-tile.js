function sendLike(imageId){
    fetch(`/like?imageId=${ imageId }`)
    .then(res => {
        // TODO: change like button display
        console.log('ok')
    });
}