// Send signin form
const signinForm =  document.getElementById('signinForm');

signinForm.addEventListener('submit',function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
    for (const pair of formData) {
        data[pair[0]] = pair[1];
    }
    fetch('/signin',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        if(res.status == 200) {
            return res.text();
        }
        throw res;
    })
    .then((data) => {
        window.location.pathname = "/";
    })
    .catch((err) => {
        window.alert(err);
        window.location.assign(window.location.href);
    })
})