import imageTileHTML from 'static/pug/components/image-tile.pug';

const imageTileContainer = document.querySelector('.imageWall__tiles');
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function getImages(page, category){
    fetch(`/api/images/latest?page=${ page }&category=${ category }`)
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
