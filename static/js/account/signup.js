const form = document.querySelector('.main__form');
const emailHint = document.querySelector('#form__hint--email');
const passwordHint = document.querySelector('#form__hint--password');
const usernameHint = document.querySelector('#form__hint--username');
const birthdayHint = document.querySelector('#form__hint--birthday');

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
    else if(this.validity.tooShort){
        passwordHint.innerHTML = '密碼至少需達8個字元';
    }
    else {
        passwordHint.innerHTML = '';
    }
});

form['username'].addEventListener('invalid', function(event) {
    event.preventDefault();
    this.classList.add('main__form--invalid');
    if(this.validity.valueMissing){
        usernameHint.innerHTML = '請輸入使用者名稱';
    }
    else {
        usernameHint.innerHTML = '';
    }
});

form['submit'].addEventListener('click', function() {
    form['email'].classList.remove('main__form--invalid');
    emailHint.innerHTML = '';
    form['password'].classList.remove('main__form--invalid');
    passwordHint.innerHTML = '';
    form['username'].classList.remove('main__form--invalid');
    usernameHint.innerHTML = '';
    form['birthyear'].classList.remove('main__form--invalid');
    form['birthmonth'].classList.remove('main__form--invalid');
    form['birthdate'].classList.remove('main__form--invalid');
    birthdayHint.innerHTML = '';

    const birthday = new Date(`${ form['birthyear'].value }/${ form['birthmonth'].value }/${ form['birthdate'].value }`);
    if(isNaN(birthday)){
        if(form['birthyear'].value == 0) form['birthyear'].classList.add('main__form--invalid');
        if(form['birthmonth'].value == 0) form['birthmonth'].classList.add('main__form--invalid');
        if(form['birthdate'].value == 0) form['birthdate'].classList.add('main__form--invalid');
        birthdayHint.innerHTML = '請輸入完整的日期';
    }
    else if(birthday.getMonth() !== form['birthmonth'].value - 1){
        form['birthmonth'].classList.add('main__form--invalid');
        form['birthdate'].classList.add('main__form--invalid');
        birthdayHint.innerHTML = '請輸入正確的日期';
    }
})

form.addEventListener('submit', function(event){
    const birthday = new Date(`${ form['birthyear'].value }/${ form['birthmonth'].value }/${ form['birthdate'].value }`);
    if(isNaN(birthday) || birthday.getMonth() !== form['birthmonth'].value - 1){
        event.preventDefault();
    }
});