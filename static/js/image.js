const backButton = document.querySelector('.post__back');

backButton.addEventListener('click', () => {
    // window.history.back();
    window.location.pathname = "/"
});