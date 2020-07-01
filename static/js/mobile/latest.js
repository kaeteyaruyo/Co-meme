import postHTML from 'static/pug/components/post.pug';

const timeline = document.querySelector('.main__timeline');
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function getPosts(page, category){
    fetch(`/api/images/latest?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(images => {
        images.forEach(image => {
            timeline.insertAdjacentHTML('beforeend', postHTML(image));
            if(image.likedUsers.map(user => user.userId).includes(activeUserId)){
                timeline.lastElementChild.querySelector('.post__action--like').classList.toggle('image__liked');
            }
        });
        if(images.length < 12){
            isEnd = true;
        }
    })
    .catch(error => {
        console.error(error)
    });
}

window.addEventListener('scroll', () => {
    if(!isEnd && window.scrollY + window.innerHeight + 16 >= document.body.clientHeight){
        getPosts(currentPage++, currentCategory);
    }
});

getPosts(currentPage++, currentCategory);
