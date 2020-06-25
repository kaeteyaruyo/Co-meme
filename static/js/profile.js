import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';
import { setupImageWall } from 'static/js/components/image-wall.js'

const tagCardsContainer = document.querySelector('.main__profile--tags');
const userCardsContainer = document.querySelector('.main__profile--users');
const currentUser = window.location.pathname.split('/').pop();
let activePanel = null;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function getFollowing(target, container, componentHTML){
    fetch(`/api/${ target }/following/${ currentUser }`)
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
    })
    .catch(error => {
        console.error(error)
    });
}

Array.from(document.querySelectorAll('input[name="tab"]')).forEach(tab => {
    tab.addEventListener('change', function(){
        activePanel = document.querySelector('.panel--active');
        if(activePanel){
            activePanel.classList.remove('panel--active');
            setTimeout(() => {
                activePanel.style.display = 'none';
            }, 350);
        }
        window.location.hash = this.value;
        document.querySelector(`.main__profile--${ this.value }`).style.display = 'grid';
        setTimeout(() => {
            document.querySelector(`.main__profile--${ this.value }`).classList.add('panel--active');
        }, 50);
    });
})

setupImageWall(`user/${ currentUser }`);
getFollowing('users', userCardsContainer, userCardHTML);
getFollowing('tags', tagCardsContainer, tagCardHTML);
document.querySelector(`#tab__${ window.location.hash.slice(1) || 'posts' }`).checked = true;
document.querySelector(`#tab__${ window.location.hash.slice(1) || 'posts' }`).dispatchEvent(new Event('change'))