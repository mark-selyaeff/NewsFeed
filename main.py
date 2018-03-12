import re
from bottle import route, run, template, request, get, static_file, redirect
import firebase_admin
from firebase_admin import credentials, auth, db
from additional_modules import check_token
from textblob.classifiers import NaiveBayesClassifier

@route('/static/<filename>')
def staticfiles(filename): # serving static files
    return static_file('{}'.format(filename), root='static')

@route('/train')
def train(): # train feed page
    uid = check_token(request.get_cookie('auth'))
    if uid:
        return template('train.html', uid=uid)
    else:
        redirect('/login')

@route('/') # redirecting to train page
def index():
    return redirect('/train', 301)

@route('/login') # login page
def login():
    return template('login.html')

@route('/loggedIn') # page for special js-auth purposes
def logged_in():
    return template('loggedIn.html')

@route('/about') # about section
def about():
    return template('about.html')

@route('/feed')
def feed():
    uid = check_token(request.get_cookie('auth'))
    if uid:
        return template('feed.html', uid=uid)
    else:
        redirect('/login')
        # train = []
        # marked_news = db.reference('users/{}/news'.format(uid)).get()
        # for id, info in marked_news.items():
        #     train.append((info['title'], info['label']))
        # cl = NaiveBayesClassifier(train)




# @route('/')
# def index():
#     if request.get_cookie("auth"):






# @route('/check')
# def check():

cred = credentials.Certificate('newsfeed-d44e7-firebase-adminsdk-f0mrx-759d544fad.json')
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://newsfeed-d44e7.firebaseio.com/'
})
run(host='localhost', port=8080, debug=True)