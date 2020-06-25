window.onload = () => {
    const activeButton = document.querySelector(`.sidebar__menu--${ window.location.pathname.split('/')[1] || 'home' }`);
    const moreTagsButton = document.querySelector('#sidebar__tags--more');
    const moreTagsLabel = document.querySelector('.sidebar__popularTags--more');
    const popularTags = document.querySelectorAll('.tag');

    if(activeButton){
        activeButton.classList.add('sidebar__button--active');
    }

    moreTagsButton.addEventListener('change', function() {
        popularTags.forEach((tag, idx) => {
            if(idx > 3){
                tag.classList.toggle('tag__hidden');
            }
        });
        moreTagsLabel.innerHTML = this.checked ? '顯示更多' : '顯示較少';
    });
}
