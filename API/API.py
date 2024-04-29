from datetime import datetime
import random
from pymongo import MongoClient
from bson.objectid import ObjectId
import traceback
from flask import Flask, jsonify, abort, make_response, request
from flask_cors import CORS

#Connecting to the database
conex = MongoClient(host=['127.0.0.1:27017'])
conexDB = conex.JuegoBalanzas
app = Flask(__name__)
CORS(app)
wsgi_app = app.wsgi_app

#Error handling
def error_response(message, status_code):
    response = jsonify({'error': message})
    return make_response(response, status_code)

#Error handlers
def register_error_handlers(app):
    error_handlers = {
        400: 'Bad request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not found',
        500: 'Internal Server Error'
    }

    for status_code, message in error_handlers.items():
        register_error_handler(app, status_code, message)

#Error handler
def register_error_handler(app, status_code, message):
    @app.errorhandler(status_code)
    def error_handler(error):
        return error_response(message, status_code)

#----------------------#
#Routes for the API
#----------------------#


#Route to create a player
@app.route('/player', methods=['POST'])
def create_player():
    if not request.json or 'name' not in request.json:
        return error_response('Invalid data format. "name" is required.', 400)

    id = str(ObjectId())
    player = {
        'id': id,
        'name': request.json['name'],
        'points': request.json.get('points', 0), 
    }

    try:
        data = {
            "status_code": 201,
            "status_message": "Player created successfully",
            "data": {'player_id': id} 
        }
        return jsonify(data), 201
    except Exception as e:
        return error_response('An error occurred while creating the player.', 500)

#Route to get all players
@app.route('/players', methods=['GET'])
def get_players():
    try:
        players = list(conexDB.players.find({}, {'_id': 0}))
        if not players:
            return error_response('No players found.', 404)
        data = {
            "status_code": 200,
            "status_message": "Players retrieved successfully",
            "data": players
        }
        return jsonify(data), 200
    except Exception as e:
        return error_response('An error occurred while retrieving the players.', 500)

#Route to get a player by id
@app.route('/player/<player_id>', methods=['GET'])
def get_player(player_id):
    try:
        player = conexDB.players.find_one({'id': player_id}, {'_id': 0})
        if player:
            data = {
                "status_code": 200,
                "status_message": "Player retrieved successfully",
                "data": player
            }
            return jsonify(data), 200
        else:
            return error_response('Player not found.', 404)
    except Exception as e:
        return error_response('An error occurred while retrieving the player.', 500)

#Route to update a player by id
@app.route('/player/<player_id>', methods=['PUT'])
def update_player(player_id):
    if not request.json or 'points' not in request.json:
        return error_response('Invalid data format. "points" is required.', 400)

    try:
        result = conexDB.players.update_one({'id': player_id}, {'$set': {'points': request.json['points']}})
        if result.modified_count > 0:
            data = {
                "status_code": 200,
                "status_message": "Player updated successfully",
                "data": {'player_id': player_id}
            }
            return jsonify(data), 200
        else:
            return error_response('Player not found.', 404)
    except Exception as e:
        return error_response('An error occurred while updating the player.', 500)

#Route to delete a player by id
@app.route('/player/<player_id>', methods=['DELETE'])
def delete_player(player_id):
    try:
        result = conexDB.players.delete_one({'id': player_id})
        if result.deleted_count > 0:
            data = {
                "status_code": 200,
                "status_message": "Player deleted successfully",
                "data": {'player_id': player_id}
            }
            return jsonify(data), 200
        else:
            return error_response('Player not found.', 404)
    except Exception as e:
        return error_response('An error occurred while deleting the player.', 500)

#Route to create a game
@app.route('/game', methods=['POST'])
def create_game():
    if not request.json or 'players' not in request.json or 'mineralWeights' not in request.json:
        return error_response('Invalid data format. "players" and "mineralWeights" are required.', 400)

    player_ids = request.json['players']
    players = conexDB.players.find({'id': {'$in': player_ids}})
    player_count = len(list(players))  
    if player_count != len(player_ids):
        return error_response('One or more players not found.', 404)

    id = str(ObjectId())
    game = {
        'id': id,
        'players': player_ids,
        'mineralWeights': request.json['mineralWeights'],
        'winner': request.json.get('winner', None),
    }

    try:
        data = {
            "status_code": 201,
            "status_message": "Game created successfully",
            "data": {'game_id': id}
        }
        return jsonify(data), 201
    except Exception as e:
        return error_response('An error occurred while creating the game.', 500)

#Route to get all games
@app.route('/games', methods=['GET'])
def get_games():
    try:
        games = list(conexDB.games.find({}, {'_id': 0}))
        if not games:
            return error_response('No games found.', 404)
        data = {
            "status_code": 200,
            "status_message": "Games retrieved successfully",
            "data": games
        }
        return jsonify(data), 200
    except Exception as e:
        return error_response('An error occurred while retrieving the games.', 500)
    
#Route to get a game by id
@app.route('/game/<game_id>', methods=['GET'])
def get_game(game_id):
    try:
        game = conexDB.games.find_one({'id': game_id}, {'_id':0}) 
        if game:
            data = {
                "status_code": 200,
                "status_message": "Game retrieved successfully",
                "data": game
            }
            return jsonify(data), 200
        else:
            return error_response('Game not found.', 404)
    except Exception as e:
        return error_response('An error occurred while retrieving the game.', 500)

#Route to update a game by id
@app.route('/game/<game_id>', methods=['PUT'])
def update_game(game_id):
    if not request.json or 'winner' not in request.json:
        return error_response('Invalid data format. "winner" is required.', 400)
    
    try:
        winner_id = request.json['winner']
        winner = conexDB.players.find_one({'id': winner_id})
        if not winner:
            return error_response('Winner not found.', 404)
        
        game = conexDB.games.find_one_and_update(
            {'id': game_id}, 
            {'$set': {'winner': winner_id}},
            return_document=True 
        )
        
        if game:
            data = {
                "status_code": 200,
                "status_message": "Game updated successfully",
                "data": {'game_id': game_id}
            }
            return jsonify(data), 200
        else:
            return error_response('Game not found.', 404)
    except Exception as e:
        return error_response('An error occurred while updating the game.', 500)

#Route to delete a game by id
@app.route('/game/<game_id>', methods=['DELETE'])
def delete_game(game_id):
    try:
        result = conexDB.games.delete_one({'id': game_id})
        if result.deleted_count > 0:
            data = {
                "status_code": 200,
                "status_message": "Game deleted successfully",
                "data": {'game_id': game_id}
            }
            return jsonify(data), 200
        else:
            return error_response('Game not found.', 404)
    except Exception as e:
        return error_response('An error occurred while deleting the game.', 500)
    

if __name__ == '__main__':
    HOST = '0.0.0.0'
    PORT = 5001
    register_error_handlers(app) 
    app.run(HOST, PORT)
