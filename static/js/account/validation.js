function validateForm() {
    const form = document.forms['signup'];
    const birthday = new Date(`${ form['birthyear'].value }/${ form['birthmonth'].value }/${ form['birthdate'].value }`);
    if(birthday.getMonth() !== form['birthmonth'].value - 1){
        window.alert('請輸入正確的生日');
        return false;
    }
}