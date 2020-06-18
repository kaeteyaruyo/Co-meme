import postHTML from 'static/pug/components/post.pug';
import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';

const timeline = document.querySelector('.timeline__posts');
const userCardsContainer = document.querySelector('#recommend__users');
const tagCardsContainer = document.querySelector('#recommend__tags');
const recommendPanel = document.querySelector('.main__recommend');
const rem = 16;
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function getPosts(page, category){
    // TODO: here should query to /hot
    fetch(`/api/images/${ activeUserId ? 'timeline' : 'latest' }?page=${ page }&category=${ category }`)
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
        recommendPanel.style.top = `${ window.innerHeight - recommendPanel.clientHeight - 2 * rem }px`;
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
    recommendPanel.style.top = `${ window.innerHeight - recommendPanel.clientHeight - 2 * rem }px`;
});

window.addEventListener('scroll', () => {
    if(!isEnd && window.scrollY + window.innerHeight + 5 >= document.body.clientHeight){
        getPosts(currentPage++, currentCategory);
    }
});

getPosts(currentPage++, currentCategory);
getRecommend('users', 4, userCardsContainer, userCardHTML);
getRecommend('tags', 2, tagCardsContainer, tagCardHTML);
