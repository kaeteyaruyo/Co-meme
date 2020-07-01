import imageTileHTML from 'static/pug/components/image-tile.pug';

const imageWall = document.querySelector('.imageWall__rows');
const imageTileRows = document.querySelectorAll('.imageWall__row');
const imageWallBottom = document.querySelector('.imageWall__bottom');
let currentCategory = '';
let currentPage = 0;
let isEnd = false;
let activeUserId = document.querySelector('#activeUser__id');
activeUserId = activeUserId !== null ? Number.parseInt(activeUserId.innerHTML) : null;

function setupImageWall(route){
    Array.from(document.querySelectorAll('input[name="arrange"]')).forEach(option => {
        option.addEventListener('change', function(){
            imageWall.className = `imageWall__rows imageWall--${ this.value }`;
        });
    })

    Array.from(document.querySelectorAll('input[name="category"]')).forEach(option => {
        option.addEventListener('change', function(){
            isEnd = false;
            imageWallBottom.innerHTML = '';
            currentPage = 0;
            currentCategory = this.value;
            imageTileRows.forEach(row => {
                row.innerHTML = '';
            });
            getImages(route, currentPage++, currentCategory);
        });
    })

    window.addEventListener('scroll', () => {
        if(!isEnd && window.scrollY + window.innerHeight + 16 >= document.body.clientHeight){
            getImages(route, currentPage++, currentCategory);
        }
    });

    getImages(route, currentPage++, currentCategory);
}

function getImages(route, page, category){
    imageWallBottom.innerHTML = '載入中';
    fetch(`/api/images/${ route }?page=${ page }&category=${ category }`)
    .then(res => {
        if(res.status === 200){
            return res.json()
        }
        throw res;
    })
    .then(images => {
        images.forEach((image, idx) => {
            imageTileRows[idx % imageTileRows.length].insertAdjacentHTML('beforeend', imageTileHTML(image));
            if(image.likedUsers.map(user => user.userId).includes(activeUserId)){
                imageTileRows[idx % imageTileRows.length].lastElementChild.querySelector('.imageTile__action--like').classList.toggle('image__liked');
            }
        });
        imageWallBottom.innerHTML = '';
        if(images.length < 12){
            isEnd = true;
            imageWallBottom.innerHTML = '到底囉';
        }
    })
    .catch(error => {
        console.error(error)
    });
}

export { setupImageWall };
