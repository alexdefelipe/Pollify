from flask import jsonify, request
from app import app, db
from app.models import Question, User
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt)


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/api/questions', methods=['GET'])
def getQuestions():
    question = Question()
    return jsonify([q.serialize() for q in question.query.all()])


@app.route('/api/questions/<username>', methods=['GET'])
def getQuestionsByUser(username):
    question = Question()
    user = User.query.filter_by(username=username).first_or_404()
    user_id = user.id
    return jsonify([q.serialize() for q in question.query.all()
                    if q.user_id == user_id])


@app.route('/api/questions/<username>', methods=['POST'])
# @cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def addQuestion(username):
    user = User.query.filter_by(username=username).first_or_404()
    user_id = user.id
    title = request.get_json()['title']
    body = request.get_json()['body']

    q = Question(user_id=user_id, title=title, body=body)

    try:
        db.session.add(q)
        db.session.commit()
        response = jsonify(code=200, payload=q.serialize())
    except Exception as ex:
        plantilla = "Se ha producido un error de tipo {0}. Argumentos:\n{1!r}"
        mensaje = plantilla.format(type(ex).__name__, ex.args)
        response = jsonify(code=500, payload=mensaje)

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/api/iniciarSesion', methods=['POST'])
def iniciarSesion():
    username = request.get_json()['username']
    password = request.get_json()['password']
    remember = request.get_json()['remember']

    try:
        user = User.query.filter_by(
            username=username, password=password).first_or_404()
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        response = jsonify(code=200, payload=user.serialize(),
                           access_token=access_token, refresh_token=refresh_token,
                           remember=remember)
    except Exception as ex:
        plantilla = "Se ha producido un error de tipo {0}."
        mensaje = plantilla.format(type(ex).__name__, ex.args)
        response = jsonify(code=500, payload=mensaje)

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/api/register', methods=['POST'])
def registerUser():
    username = request.get_json()['username']
    password = request.get_json()['password']
    print username, password
    user = User(username=username, password=password)

    try:
        db.session.add(user)
        db.session.commit()
        response = jsonify(code=200, payload=user.serialize())
    except Exception as ex:
        plantilla = "Se ha producido un error de tipo {0}."
        mensaje = plantilla.format(type(ex).__name__, ex.args)
        response = jsonify(code=500, payload=mensaje)

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/api/private/holaMundo', methods=['GET'])
@jwt_required
def holaMundoPrivado():
    return "Hello, World!"


@app.route('/api/tokenRefresh', methods=['GET'])
@jwt_refresh_token_required
def tokenRefresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    response = jsonify(access_token=access_token)
    return response


@app.route('/api/getUsernameFromToken', methods=['GET'])
@jwt_required
def returnUsernameFromToken():
    return jsonify(username=get_jwt_identity())
