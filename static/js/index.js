const imageWall = document.querySelector('.imageWall__tiles');
const followPanel = document.querySelector('.main__recommend');
const rem = 16;

Array.from(document.querySelectorAll('input[name="category"]')).forEach(option => {
    option.addEventListener('change', function(){
        console.log(this.value)
        // TOOD: fetch data with correct category
    });
})

window.addEventListener('resize', () => {
    followPanel.style.top = `${ window.innerHeight - followPanel.clientHeight - 2 * rem }px`;
});

followPanel.style.top = `${ window.innerHeight - followPanel.clientHeight - 2 * rem }px`;
