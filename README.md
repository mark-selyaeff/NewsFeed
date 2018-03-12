## News Feed application

Main purpose of this application is to provide user with news he/she will like. I use
[Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier) to classify the text.  

### APIs & libraries used:
1. Handling User Auth and storing data – [Firebase](https://github.com/firebase/)
2. Retrieving news – [HackerNews Official API (also hosted on Firebase)](https://github.com/HackerNews/API)
3. Working with browser cookies – [js-cookie API](https://github.com/js-cookie/js-cookie)
4. Training recommendation model – [bayes NPM module](https://www.npmjs.com/package/bayes)
5. Implementing clientside require(‘module’) – [tarp.require](https://github.com/letorbi/tarp.require) JS module (analogue to *Browserify* and *require.js*)

The structure of project is simple:
1. **views** folder – HTML templates for each page
2. **static** folder – JS and CSS files
3. **main.py** file – routing setup. You can see there what HTML page is used for each route.

----

Live version can be found at https://newsfeed.seliaev.com