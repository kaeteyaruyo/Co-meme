import imageTileHTML from 'static/pug/components/image-tile.pug';
import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';

const cards = document.querySelector('.main--cards');
const tagCardsContainer = document.querySelector('#tags__cards--container');
const userCardsContainer = document.querySelector('#users__cards--container');
const imageTileContainer = document.querySelector('.imageWall__tiles');
const rem = 16; // 1rem = 16px
const step = rem * 21; // 20rem width + 1rem margin
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

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
            if(image.likedUsers.map(user => user.userId).includes(activeUserId)){
                imageTileContainer.lastElementChild.querySelector('.imageTile__action--like').classList.toggle('image__liked');
            }
        });
        if(images.length < 13){
            isEnd = true;
        }
    })
    .catch(error => {
        console.error(error)
    });
}

function getRecommend(target, count, container, componentHTML){
    // TODO: here should query to /recommend
    fetch(`/api/${ target }/hot?count=${ count }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(data => {
        data.forEach(item => {
            container.insertAdjacentHTML('beforeend', componentHTML(item));
            container.lastElementChild.addEventListener('click', function() {
                this.querySelector('a').click();
            }, false);
            if(item.followers.map(user => user.userId).includes(activeUserId)){
                const button = container.lastElementChild.querySelector('button');
                button.classList.toggle('button--hollow');
                button.classList.toggle('button--solid');
                button.innerHTML = '已追蹤';
            }
        });
        document.getElementById(`${ target }__cards--left`).addEventListener('click', function(){
            let pos = container.style.transform.match(/-?\d+/);
            pos = pos !== null ? Number.parseInt(pos[0]) : 0;
            container.style.transform = `translateX(${ Math.min(pos + step, 0) }px)`
        });

        document.getElementById(`${ target }__cards--right`).addEventListener('click', function(){
            let pos = container.style.transform.match(/-?\d+/);
            pos = pos !== null ? Number.parseInt(pos[0]) : 0;
            container.style.transform = `translateX(${ Math.max(pos - step, cards.clientWidth - container.clientWidth - rem) }px)`
        });
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

getImages(currentPage++, currentCategory);
getRecommend('users', 8, userCardsContainer, userCardHTML);
getRecommend('tags', 8, tagCardsContainer, tagCardHTML);
