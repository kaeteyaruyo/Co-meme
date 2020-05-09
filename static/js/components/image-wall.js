const imageWall = document.querySelector('.imageWall__tiles');

Array.from(document.querySelectorAll('input[name="category"]')).forEach(option => {
    option.addEventListener('change', function(){
        // TOOD: fetch data with correct category
    });
})

Array.from(document.querySelectorAll('input[name="arrange"]')).forEach(option => {
    option.addEventListener('change', function(){
        imageWall.className = `imageWall__tiles imageWall__tiles--${ this.value }`;
    });
})
