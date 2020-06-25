import postHTML from 'static/pug/components/post.pug';
import userCardHTML from 'static/pug/components/user-card.pug';
import tagCardHTML from 'static/pug/components/tag-card.pug';

const timelineRows = document.querySelectorAll('.timeline__row');
const timelineBottom = document.querySelector('.timeline__bottom');
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
    timelineBottom.innerHTML = '載入中';
    fetch(`/api/images/${ activeUserId ? 'timeline' : 'latest' }?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(images => {
        images.forEach((image, idx) => {
            timelineRows[idx % timelineRows.length].insertAdjacentHTML('beforeend', postHTML(image));
            if(image.likedUsers.map(user => user.userId).includes(activeUserId)){
                timelineRows[idx % timelineRows.length].lastElementChild.querySelector('.post__action--like').classList.toggle('image__liked');
            }
        });
        timelineBottom.innerHTML = '';
        if(images.length < 12){
            isEnd = true;
            timelineBottom.innerHTML = '到底囉';
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
        timelineBottom.innerHTML = '';
        currentPage = 0;
        currentCategory = this.value;
        timelineRows.forEach(row => {
            row.innerHTML = '';
        });
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
