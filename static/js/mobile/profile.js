import postHTML from 'static/pug/components/post.pug';
import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';

const imageWall = document.querySelector('.main__imageWall');
const tagCardsContainer = document.querySelector('.main__profile--tags');
const userCardsContainer = document.querySelector('.main__profile--users');
const currentUser = window.location.pathname.split('/').pop();
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function getImages(page, category){
    fetch(`/api/images/user/${ currentUser }?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(images => {
        images.forEach(image => {
            imageWall.insertAdjacentHTML('beforeend', postHTML(image));
            if(image.likedUsers.map(user => user.userId).includes(activeUserId)){
                imageWall.lastElementChild.querySelector('.post__action--like').classList.toggle('image__liked');
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

let active = null;
Array.from(document.querySelectorAll('input[name="tab"]')).forEach(tab => {
    tab.addEventListener('change', function(){
        active = document.querySelector('.panel--active');
        if(active){
            active.classList.remove('panel--active');
            setTimeout(() => {
                active.style.display = 'none';
            }, 350);
        }
        document.querySelector(`.main__profile--${ this.value }`).style.display = 'grid';
        setTimeout(() => {
            document.querySelector(`.main__profile--${ this.value }`).classList.add('panel--active');
        }, 50);
    });
})

window.addEventListener('scroll', () => {
    if(!isEnd && window.scrollY + window.innerHeight + 5 >= document.body.clientHeight){
        getImages(currentPage++, currentCategory);
    }
});

getImages(currentPage++, currentCategory);
getFollowing('users', userCardsContainer, userCardHTML);
getFollowing('tags', tagCardsContainer, tagCardHTML);
document.querySelector('#tab__posts').checked = true;
document.querySelector('#tab__posts').dispatchEvent(new Event('change'))