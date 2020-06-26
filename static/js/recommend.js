import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';
import { setupImageWall } from 'static/js/components/image-wall.js'

const cards = document.querySelector('.main--cards');
const tagCardsContainer = document.querySelector('#tags__cards--container');
const userCardsContainer = document.querySelector('#users__cards--container');
const rem = 16; // 1rem = 16px
const step = rem * 21; // 20rem width + 1rem margin
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

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

// TODO: here should query to /recommend
setupImageWall('hot')
getRecommend('users', 8, userCardsContainer, userCardHTML);
getRecommend('tags', 8, tagCardsContainer, tagCardHTML);
