import postHTML from 'static/pug/components/post.pug';

const timeline = document.querySelector('.timeline__posts');
const followPanel = document.querySelector('.main__recommend');
const username = document.querySelector('.tool__account--username');
const rem = 16;
let currentCategory = '';
let currentPage = 0;
let isEnd = false;

function getPosts(page, category){
    // TODO: here should query to /hot
    fetch(`/api/images/${ username !== null ? 'timeline' : 'latest' }?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(images => {
        images.forEach(image => {
            timeline.insertAdjacentHTML('beforeend', postHTML(image));
        });
        if(images.length < 13){
            isEnd = true;
        }
    })
    .catch(error => {
        console.error(error)
    });
}

Array.from(document.querySelectorAll('input[name="category"]')).forEach(option => {
    option.addEventListener('change', function(){
        isEnd = false;
        currentPage = 0;
        currentCategory = this.value;
        timeline.innerHTML = '';
        getPosts(currentPage++, currentCategory);
    });
})

window.addEventListener('resize', () => {
    followPanel.style.top = `${ window.innerHeight - followPanel.clientHeight - 2 * rem }px`;
});

window.addEventListener('scroll', () => {
    if(!isEnd && window.scrollY + window.innerHeight + 5 >= document.body.clientHeight){
        getPosts(currentPage++, currentCategory);
    }
});

followPanel.style.top = `${ window.innerHeight - followPanel.clientHeight - 2 * rem }px`;

getPosts(currentPage++, currentCategory);
