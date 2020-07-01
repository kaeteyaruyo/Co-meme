import postHTML from 'static/pug/components/post.pug';
import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';

const timeline = document.querySelector('.main__timeline');
const tagCardsContainer = document.querySelector('#tags__cards--container');
const userCardsContainer = document.querySelector('#users__cards--container');
const rem = 16; // 1rem = 16px
const step = rem * 21; // 20rem width + 1rem margin
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function getPosts(page, category){
    // TODO: here should query to /recommend
    fetch(`/api/images/hot?page=${ page }&category=${ category }`)
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
            if(target === 'users' && item.userId === activeUserId){
                return;
            }
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
        // document.getElementById(`${ target }__cards--left`).addEventListener('click', function(){
        //     let pos = container.style.transform.match(/-?\d+/);
        //     pos = pos !== null ? Number.parseInt(pos[0]) : 0;
        //     container.style.transform = `translateX(${ Math.min(pos + step, 0) }px)`
        // });

        // document.getElementById(`${ target }__cards--right`).addEventListener('click', function(){
        //     let pos = container.style.transform.match(/-?\d+/);
        //     pos = pos !== null ? Number.parseInt(pos[0]) : 0;
        //     container.style.transform = `translateX(${ Math.max(pos - step, cards.clientWidth - container.clientWidth - rem) }px)`
        // });
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
getRecommend('users', 8, userCardsContainer, userCardHTML);
getRecommend('tags', 8, tagCardsContainer, tagCardHTML);
