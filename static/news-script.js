console.log('privet');
document.getElementById('trainFeed').classList.add('currentLink');

let newsTableBody = document.getElementById('news-table-body');
let newsTable = document.getElementById('news-table'); newsTable.style.display = "none";


let fetchButton = document.getElementById('fetchNews');
fetchButton.addEventListener('click', (e) => {
    e.preventDefault();
    let number = parseInt(document.getElementById('fetchNumberOfNews').value);
    console.log(number);
    getNews(number);
});


let b = ``;


function markArticle(id, label, title) {
    let updates = {};
    updates['users/' + firebase.auth().currentUser.uid + '/news/' + id] = {"label": label, "title": title};
    // TODO: increment value on each article below to know how many people liked them
    updates['news/' + id] = title;
    firebase.database().ref().update(updates);
}

function toDateTime(secs) {
    let t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t.toLocaleDateString();
}

function createRow(title, time, link, id) {
    let tr = document.createElement('TR');

    let title_td = document.createElement('TD');
    let title_link = document.createElement('A');
    title_link.href = link ? link : "#";
    title_link.appendChild(document.createTextNode(title));
    title_td.appendChild(title_link);
    title_td.classList.add("mdl-data-table__cell--non-numeric");
    tr.appendChild(title_td);

    let date_td = document.createElement('TD');
    date_td.appendChild(document.createTextNode(toDateTime(time)));
    date_td.classList.add("mdl-data-table__cell--non-numeric");
    tr.appendChild(date_td);

    let like_td = document.createElement('TD');
    let btnLike = document.createElement('BUTTON');
    btnLike.appendChild(document.createTextNode('Like'));
    btnLike.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-button--accent");
    like_td.appendChild(btnLike);
    btnLike.addEventListener('click', (e) => {
        e.target.parentNode.parentNode.style.background = "mediumspringgreen";
        markArticle(id, "pos", title);
    });
    tr.appendChild(like_td);

    let dislike_td = document.createElement('TD');
    let btnDislike = document.createElement('BUTTON');
    btnDislike.appendChild(document.createTextNode('Dislike'));
    btnDislike.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-button--colored");
    dislike_td.appendChild(btnDislike);
    btnDislike.addEventListener('click', (e) => {
        markArticle(id, "neg", title);
        e.target.parentNode.parentNode.style.background = "indianred";
    });
    tr.appendChild(dislike_td);

    return tr;
}

function getNews(n = 20) {
    newsTable.style.display = "";
    url = new Request('https://hacker-news.firebaseio.com/v0/newstories.json');
    fetch(url)
        .then(data => data.json())
        .then(data => {
            let news = data.slice(0, n);
            // console.log(data.slice(0, 20));
            let freshNewsCount = 0;
            for (let i = 0; i < news.length; i++) {
                // let tr = document.createElement('TR');
                let articleUrl = new Request(`https://hacker-news.firebaseio.com/v0/item/${news[i]}.json`);
                console.log(`https://hacker-news.firebaseio.com/v0/item/${news[i]}.json?print=pretty`);
                fetch(articleUrl)
                    .then(article => article.json())
                    .then(article => {
                        let dbRef = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/news').child(article.id);
                        dbRef.once('value')
                            .then(snap => {
                                if (!snap.exists()) {
                                    let tr = createRow(article.title, article.time, article.url, article.id);
                                    newsTableBody.appendChild(tr);
                                    // console.log(article.id + ' ' + article.title);
                                } else {
                                    console.log('already in db');
                                }
                            });
                    });
            }
        });
}



