import os
from flask import Flask,render_template, request,json

app = Flask(__name__)
logged = False
users = {}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signUp', methods=['POST'])
def signUp():
    global users
    user =  request.form['email']
    password = request.form['password']
    if user not in users:
        users.update({user:password})
        return json.dumps({'status':'OK','email':user,'pass':password})
    else:
        return "Email already exist!"


@app.route('/logIn', methods=['POST'])
def logIn():
    global users
    global logged
    user =  request.form['email']
    password = request.form['password']
    if user in users:
        if users[user] == password:
            logged = {user:password}
            return json.dumps({'status':'OK','email':user,'pass':password})
        else:
            return "Wrong password!"
    else:
        return "Username does not exist!"


@app.route('/logOut', methods=['GET'])
def logOut():
    global logged
    logged = False
    return "Successfully log out"


@app.route('/loggedIn', methods=['GET'])
def loggedIn():
    if logged:
        return json.dumps(logged)
    else:
        return "false"


if __name__=="__main__":
    app.run(debug = True)
