function validateForm() {
    const form = document.forms['signup'];
    const alert = document.getElementById('alert');
    const birthday = new Date(`${ form['birthyear'].value }/${ form['birthmonth'].value }/${ form['birthdate'].value }`);
    if(birthday.getMonth() !== form['birthmonth'].value - 1){
        alert.innerHTML = '請輸入正確的生日';
        form['birthmonth'].classList.toggle('form__alert');
        form['birthdate'].classList.toggle('form__alert');
        return false;
    }
    return true;
}

// Send signup form
const signupForm =  document.getElementById('signupForm');

signupForm.addEventListener('submit',function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const searchParams = new URLSearchParams();
    for (const pair of formData) {
        searchParams.append(pair[0], pair[1], pair[2], pair[3], pair[4], pair[5]);
    }
    fetch('/signup',{
        method: 'POST',
        body: searchParams
    })
    .then((res) => {
        return res.text();
    })
    .then((data) => {
        window.alert(data);
        window.location.assign(window.location.href);
    })
    .catch((err) => {
        window.alert(err);
        window.location.assign(window.location.href);
    })

})