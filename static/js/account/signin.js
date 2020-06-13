// Send signin form
const signinForm =  document.getElementById('signinForm');
console.log(signinForm);

signinForm.addEventListener('submit',function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const searchParams = new URLSearchParams();
    for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
    }
    fetch('/signin',{
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