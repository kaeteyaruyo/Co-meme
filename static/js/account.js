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
    const data = {};
    for (const pair of formData) {
        data[pair[0]] = pair[1];
    }
    fetch('/signup',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        return res.text();
    })
    .then((data) => {
        window.alert(data);
        // window.location.assign(window.location.href);
    })
    .catch((err) => {
        window.alert(err);
        // window.location.assign(window.location.href);
    })

})