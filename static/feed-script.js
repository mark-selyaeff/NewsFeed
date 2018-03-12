// let bayes = Tarp.require('/static/bayes');
let newsTable = document.getElementById('news-table');
let newsTableBody = document.getElementById('news-table-body');
let warningHeader = document.getElementById('warning');

function createRow(title, link, time, status) {
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

    // if (status === null) {
    //     status = classifier.categorize(status);
    // }
    tr.style.background = (status === "pos") ? "lightgreen" : "#FFBAD2";
    return tr;
}

function toDateTime(secs) {
    let t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t.toLocaleDateString();
}


firebase.auth().onAuthStateChanged(user => {
	if (user) {
		Tarp.require('/static/bayes', true)
		.then((bayes) => {
			let classifier = bayes();
			let userId = user.uid;
			firebase.database().ref(`users/${userId}/news`).once('value')
			.then(data => {
				let news = data.val();
				if (!news) {
                    warningHeader.innerHTML += "No training data found! Go to <a href='/train'>Training</a>";
                    newsTable.style.display = "none";
                }
				Object.keys(news).forEach((key) => {
					classifier.learn(news[key].title, news[key].label);
				});
				let newsUrl = new Request('https://hacker-news.firebaseio.com/v0/beststories.json');
				fetch(newsUrl)
				.then(data => data.json())
				.then(data => {
					let news = data.slice(0, 50);
					for (let i = 0; i < news.length; i++) {
						let articleUrl = new Request(`https://hacker-news.firebaseio.com/v0/item/${news[i]}.json`);
						fetch(articleUrl)
						.then(article => article.json())
						.then(article => {
							let status = classifier.categorize(article.title);
							let tr = createRow(article.title, article.url, article.time, status);
							newsTableBody.appendChild(tr);
						});
					}
				});
			}).catch((e) => console.log(e));
		});
	}
});


