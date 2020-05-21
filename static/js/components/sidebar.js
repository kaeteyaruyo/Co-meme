window.onload = () => {
    const activeButton = document.querySelector(`.sidebar__menu--${ window.location.pathname.split('/')[1] || 'home' }`);
    if(activeButton){
        activeButton.classList.add('sidebar__button--active');
    }
}
