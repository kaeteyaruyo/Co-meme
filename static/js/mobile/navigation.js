window.onload = () => {
    const [ , page, currentUser] = window.location.pathname.split('/');
    let activeButton = document.querySelector(`.nav__link--${ page || 'home' }`);
    if(page === 'profile' && currentUser !== document.querySelector('#activeUser__id').innerHTML){
        activeButton = null;
    }
    if(activeButton){
        activeButton.classList.add('nav__link--active');
    }
}
