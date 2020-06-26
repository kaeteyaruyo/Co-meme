const form = document.querySelector('.main__form');
const emailHint = document.querySelector('#form__hint--email');
const passwordHint = document.querySelector('#form__hint--password');

form['email'].addEventListener('invalid', function(event) {
    event.preventDefault();
    this.classList.add('main__form--invalid');
    if(this.validity.valueMissing){
        emailHint.innerHTML = '請輸入 E-mail';
    }
    else if(this.validity.typeMismatch){
        emailHint.innerHTML = 'E-mail 格式錯誤';
    }
    else {
        emailHint.innerHTML = '';
    }
});

form['password'].addEventListener('invalid', function(event) {
    event.preventDefault();
    this.classList.add('main__form--invalid');
    if(this.validity.valueMissing){
        passwordHint.innerHTML = '請輸入密碼';
    }
    else {
        passwordHint.innerHTML = '';
    }
});

form['submit'].addEventListener('click', function() {
    form['email'].classList.remove('main__form--invalid');
    emailHint.innerHTML = '';
    form['password'].classList.remove('main__form--invalid');
    passwordHint.innerHTML = '';
})
