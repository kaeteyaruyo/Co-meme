import imageTileHTML from 'static/pug/components/image-tile.pug';

const cards = document.querySelector('.main--cards');
const tagCardsContainer = document.querySelector('#tag__cards--container');
const userCardsContainer = document.querySelector('#user__cards--container');
const imageTileContainer = document.querySelector('.imageWall__tiles');
const rem = 16; // 1rem = 16px
const step = rem * 21; // 20rem width + 1rem margin
let currentCategory = '';
let currentPage = 0;
let isEnd = false;

function getImages(page, category){
    fetch(`/api/images/hot?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(images => {
        images.forEach(image => {
            imageTileContainer.insertAdjacentHTML('beforeend', imageTileHTML(image));
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
        imageTileContainer.innerHTML = '';
        getImages(currentPage++, currentCategory);
    });
})

window.addEventListener('scroll', () => {
    if(!isEnd && window.scrollY + window.innerHeight + 5 >= document.body.clientHeight){
        getImages(currentPage++, currentCategory);
    }
});

document.getElementById('tag__cards--left').addEventListener('click', function(){
    let pos = tagCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    tagCardsContainer.style.transform = `translateX(${ Math.min(pos + step, 0) }px)`
});

document.getElementById('tag__cards--right').addEventListener('click', function(){
    let pos = tagCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    tagCardsContainer.style.transform = `translateX(${ Math.max(pos - step, cards.clientWidth - tagCardsContainer.clientWidth - rem) }px)`
});

document.getElementById('user__cards--left').addEventListener('click', function(){
    let pos = userCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    userCardsContainer.style.transform = `translateX(${ Math.min(pos + step, 0) }px)`
});

document.getElementById('user__cards--right').addEventListener('click', function(){
    let pos = userCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    userCardsContainer.style.transform = `translateX(${ Math.max(pos - step, cards.clientWidth - userCardsContainer.clientWidth - rem) }px)`
});

getImages(currentPage++, currentCategory);
