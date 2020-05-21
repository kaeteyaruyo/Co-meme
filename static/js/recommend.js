const cards = document.querySelector('.main--cards');
const tagCardsContainer = document.getElementById('tag__cards--container');
const userCardsContainer = document.getElementById('user__cards--container');
const rem = 16; // 1rem = 16px
const step = rem * 21; // 20rem width + 1rem margin

document.getElementById('tag__cards--left').addEventListener('click', function(){
    let pos = tagCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    tagCardsContainer.style.transform = `translateX(${ Math.min(pos + step, 0) }px)`
});

document.getElementById('tag__cards--right').addEventListener('click', function(){
    let pos = tagCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    tagCardsContainer.style.transform = `translateX(${ Math.max(pos - step, cards.clientWidth - tagCardsContainer.clientWidth - rem) }px)`
});

document.getElementById('user__cards--left').addEventListener('click', function(){
    let pos = userCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    userCardsContainer.style.transform = `translateX(${ Math.min(pos + step, 0) }px)`
});

document.getElementById('user__cards--right').addEventListener('click', function(){
    let pos = userCardsContainer.style.transform.match(/-?\d+/);
    pos = pos !== null ? Number.parseInt(pos[0]) : 0;
    userCardsContainer.style.transform = `translateX(${ Math.max(pos - step, cards.clientWidth - userCardsContainer.clientWidth - rem) }px)`
});