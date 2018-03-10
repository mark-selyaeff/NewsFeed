import re
from bottle import route, run, template, request, get, static_file
import firebase_admin
from firebase_admin import credentials, auth
from additional_modules import check_token

@route('/static/<filename>')
def stylesheets(filename):
    return static_file('{}'.format(filename), root='static')

@route('/')
def hello():
    return template('index.html')

@route('/login')
def login():
    return template('login.html')

@route('/loggedIn')
def logged_in():
    return template('loggedIn.html')

@route('/about')
def about():
    return template('about.html')

# @route('/')
# def index():
#     if request.get_cookie("auth"):






# @route('/check')
# def check():

cred = credentials.Certificate('newsfeed-d44e7-firebase-adminsdk-f0mrx-759d544fad.json')
default_app = firebase_admin.initialize_app(cred)
run(host='localhost', port=8080, debug=True)